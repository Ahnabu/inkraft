import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export const dynamic = 'force-dynamic';

export async function POST(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await context.params;

        await dbConnect();

        // Increment view count
        const post = await Post.findOneAndUpdate(
            { slug, published: true },
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        return NextResponse.json({ views: post.views });
    } catch (error: unknown) {
        console.error("[VIEW_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
