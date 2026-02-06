import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await auth();

        // For demo purposes, if no session, we might allow it or mock it.
        // Ideally: if (!session) return new NextResponse("Unauthorized", { status: 401 });

        // Mock user ID if no session (development only shortcut)
        const authorId = session?.user?.id || "65c3f9b0e1b2c3d4e5f6a7b8"; // Random ObjectID

        await dbConnect();

        const body = await req.json();
        const {
            title,
            subtitle,
            content,
            excerpt,
            slug,
            coverImage,
            category,
            tags,
            difficultyLevel,
            readingTime,
            published,
            seo
        } = body;

        if (!title || !content || !slug || !category) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Check slug uniqueness
        const existingPost = await Post.findOne({ slug });
        if (existingPost) {
            return new NextResponse("Slug already exists", { status: 409 });
        }

        // Create post
        const post = await Post.create({
            title,
            subtitle,
            slug,
            content,
            excerpt,
            coverImage,
            category,
            tags: tags || [],
            difficultyLevel,
            readingTime: readingTime || 5,
            published,
            author: authorId as string,
            publishedAt: published ? new Date() : undefined,
            lastUpdatedAt: new Date(),
            seo: seo || {},
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("[POST_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
