import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export const dynamic = 'force-dynamic';

// GET single post
export async function GET(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await context.params;
        await dbConnect();

        const post = await Post.findOne({ slug: params.slug })
            .populate("author", "name image")
            .lean();

        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        return NextResponse.json(JSON.parse(JSON.stringify(post)));
    } catch (error: unknown) {
        console.error("[POST_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PATCH update post
export async function PATCH(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await context.params;
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

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
            seo,
        } = body;

        // Find existing post
        const existingPost = await Post.findOne({ slug: params.slug });
        if (!existingPost) {
            return new NextResponse("Post not found", { status: 404 });
        }

        // Check if slug is changing and if new slug already exists
        if (slug !== params.slug) {
            const slugExists = await Post.findOne({ slug });
            if (slugExists) {
                return new NextResponse("Slug already exists", { status: 409 });
            }
        }

        // Update post
        const updatedPost = await Post.findOneAndUpdate(
            { slug: params.slug },
            {
                title,
                subtitle,
                slug,
                content,
                excerpt,
                coverImage,
                category,
                tags: tags || [],
                difficultyLevel,
                readingTime: readingTime || existingPost.readingTime,
                published,
                publishedAt: published && !existingPost.published ? new Date() : existingPost.publishedAt,
                lastUpdatedAt: new Date(),
                seo: seo || existingPost.seo,
            },
            { new: true }
        )
            .populate("author", "name image")
            .lean();

        return NextResponse.json(JSON.parse(JSON.stringify(updatedPost)));
    } catch (error: unknown) {
        console.error("[POST_PATCH]", error);
        const message = error instanceof Error ? error.message : "Internal Error";
        return new NextResponse(message, { status: 500 });
    }
}
