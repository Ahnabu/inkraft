import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Digest from "@/models/Digest";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        await dbConnect();

        // Try finding by ID first, then slug
        let digest = null;
        if (params.id.match(/^[0-9a-fA-F]{24}$/)) {
            digest = await Digest.findById(params.id)
                .populate("posts", "title slug coverImage excerpt author readingTime publishedAt")
                .populate("editorPicks", "title slug coverImage author")
                .lean();
        }

        if (!digest) {
            digest = await Digest.findOne({ slug: params.id, published: true })
                .populate("posts", "title slug coverImage excerpt author readingTime publishedAt")
                .populate("editorPicks", "title slug coverImage author")
                .lean();
        }

        if (!digest) {
            return new NextResponse("Digest not found", { status: 404 });
        }

        return NextResponse.json(digest);
    } catch (error) {
        console.error("[GET_DIGEST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const params = await context.params;
        await dbConnect();

        const body = await req.json();
        const { title, slug, description, posts, editorPicks, published } = body;

        const digest = await Digest.findById(params.id);

        if (!digest) {
            return new NextResponse("Digest not found", { status: 404 });
        }

        // Update fields
        if (title) digest.title = title;
        if (slug) digest.slug = slug;
        if (description !== undefined) digest.description = description;
        if (posts) digest.posts = posts;
        if (editorPicks) digest.editorPicks = editorPicks;

        // Handle publishing status change
        if (published !== undefined) {
            if (published && !digest.published) {
                digest.publishedAt = new Date();
            }
            digest.published = published;
        }

        await digest.save();

        return NextResponse.json(digest);
    } catch (error) {
        console.error("[UPDATE_DIGEST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const params = await context.params;
        await dbConnect();

        const digest = await Digest.findByIdAndDelete(params.id);

        if (!digest) {
            return new NextResponse("Digest not found", { status: 404 });
        }

        return NextResponse.json({ message: "Digest deleted" });
    } catch (error) {
        console.error("[DELETE_DIGEST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
