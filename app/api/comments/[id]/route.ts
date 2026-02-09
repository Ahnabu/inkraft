import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import CommentHistory from "@/models/CommentHistory";
import { sanitizeCommentContent } from "@/lib/trust";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

// PATCH: Edit comment
export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const params = await context.params;
        const { content } = await req.json();

        if (!content || content.trim().length === 0) {
            return new NextResponse("Content is required", { status: 400 });
        }

        if (content.length > 5000) {
            return new NextResponse("Content too long (max 5000 characters)", {
                status: 400,
            });
        }

        await dbConnect();

        const comment = await Comment.findById(params.id);
        if (!comment) {
            return new NextResponse("Comment not found", { status: 404 });
        }

        // Check ownership
        if (comment.author.toString() !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Check if comment is already deleted
        if (comment.deleted) {
            return new NextResponse("Cannot edit deleted comment", { status: 400 });
        }

        // Check edit window (24 hours)
        const hoursSinceCreation =
            (Date.now() - comment.createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceCreation > 24) {
            return new NextResponse("Edit window expired (24 hours)", { status: 400 });
        }

        // Save history before updating
        await CommentHistory.create({
            comment: comment._id,
            previousContent: comment.content,
            editedAt: new Date(),
            editedBy: session.user.id
        });

        // Sanitize content
        const user = await User.findById(session.user.id);
        const sanitizedContent = sanitizeCommentContent(content.trim(), { trustScore: user?.trustScore || 0 } as any);

        // Update comment
        comment.content = sanitizedContent;
        comment.edited = true;
        comment.editedAt = new Date();
        await comment.save();

        const updatedComment = await Comment.findById(comment._id)
            .populate("author", "name image")
            .lean();

        return NextResponse.json({
            ...updatedComment,
            _id: updatedComment!._id.toString(),
            author: {
                ...updatedComment!.author,
                _id: updatedComment!.author._id.toString(),
            },
            createdAt: updatedComment!.createdAt.toISOString(),
            updatedAt: updatedComment!.updatedAt.toISOString(),
        });
    } catch (error: unknown) {
        console.error("[PATCH_COMMENT]", error);
        const message = error instanceof Error ? error.message : "Internal Error";
        return new NextResponse(message, { status: 500 });
    }
}

// DELETE: Soft delete comment
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const params = await context.params;
        await dbConnect();

        const comment = await Comment.findById(params.id);
        if (!comment) {
            return new NextResponse("Comment not found", { status: 404 });
        }

        // Check ownership (or admin in future)
        if (comment.author.toString() !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Soft delete
        comment.deleted = true;
        comment.deletedAt = new Date();
        comment.content = "[deleted]";
        await comment.save();

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error("[DELETE_COMMENT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
