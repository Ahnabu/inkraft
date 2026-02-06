import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function POST(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { slug } = await context.params;
        await dbConnect();

        const post = await Post.findOne({ slug });
        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        // Get fresh user data including savedPosts
        const user = await User.findById(session.user.id);
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const isSaved = user.savedPosts?.some((id: unknown) => (id as { toString(): string }).toString() === post._id.toString());

        if (isSaved) {
            // Unsave
            user.savedPosts = user.savedPosts.filter(
                (id: unknown) => (id as { toString(): string }).toString() !== post._id.toString()
            );
            post.saves = Math.max(0, post.saves - 1);
        } else {
            // Save
            if (!user.savedPosts) user.savedPosts = [];
            user.savedPosts.push(post._id);
            post.saves += 1;
        }

        await Promise.all([user.save(), post.save()]);

        return NextResponse.json({
            saved: !isSaved,
            saves: post.saves
        });
    } catch (error) {
        console.error("[POST_SAVE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
