import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Vote from "@/models/Vote";
import SavedArticle from "@/models/SavedArticle";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { id } = await params;
        const body = await request.json();

        const allowedUpdates = ["published", "status", "difficultyLevel", "editorsPick"];
        const updates: Record<string, unknown> = {};

        for (const key of allowedUpdates) {
            if (body[key] !== undefined) {
                updates[key] = body[key];
            }
        }

        // Handle status/published sync
        if (body.status) {
            if (body.status === "published") {
                updates.published = true;
                updates.publishedAt = new Date();
            } else {
                updates.published = false;
            }
        } else if (body.published !== undefined) {
            // If only published boolean is sent (legacy or simple toggle)
            updates.status = body.published ? "published" : "draft";
            if (body.published) {
                updates.publishedAt = new Date();
            }
        }

        const post = await Post.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).populate("author", "name email image");

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { error: "Failed to update post" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { id } = await params;

        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Delete associated data
        await Promise.all([
            Comment.deleteMany({ post: id }),
            Vote.deleteMany({ post: id }),
            SavedArticle.deleteMany({ post: id }),
            Post.findByIdAndDelete(id),
        ]);

        return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { error: "Failed to delete post" },
            { status: 500 }
        );
    }
}
