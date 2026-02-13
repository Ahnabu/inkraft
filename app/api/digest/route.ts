import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Digest from "@/models/Digest";
import { checkBotId } from "botid/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const page = parseInt(searchParams.get("page") || "1");
        const skip = (page - 1) * limit;

        await dbConnect();

        // Fetch published digests
        const digests = await Digest.find({ published: true })
            .select("title slug description publishedAt editorPicks")
            .populate("editorPicks", "title slug coverImage")
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Digest.countDocuments({ published: true });

        return NextResponse.json({
            digests,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error("[GET_DIGESTS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check for bot activity
        const verification = await checkBotId();
        if (verification.isBot) {
            return new NextResponse("Bot detected. Access denied.", { status: 403 });
        }

        await dbConnect();

        const body = await req.json();
        const { title, slug, description, posts, editorPicks, published } = body;

        if (!title || !slug) {
            return new NextResponse("Title and Slug are required", { status: 400 });
        }

        // Check if slug exists
        const existing = await Digest.findOne({ slug });
        if (existing) {
            return new NextResponse("Slug already exists", { status: 409 });
        }

        const digest = await Digest.create({
            title,
            slug,
            description,
            posts: posts || [],
            editorPicks: editorPicks || [],
            published: published || false,
            publishedAt: published ? new Date() : undefined,
        });

        return NextResponse.json(digest);
    } catch (error) {
        console.error("[CREATE_DIGEST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
