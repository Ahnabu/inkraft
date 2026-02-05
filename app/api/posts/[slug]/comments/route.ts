import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import User from "@/models/User";
import { checkRateLimit, recordComment } from "@/lib/rateLimit";

// GET: Fetch comments for a post
export async function GET(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await context.params;
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        await dbConnect();

        const post = await Post.findOne({ slug: params.slug });
        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        // Fetch top-level comments (depth 0) with replies
        const topLevelComments = await Comment.find({
            post: post._id,
            depth: 0,
            deleted: false,
            moderationStatus: { $ne: "rejected" },
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "name image")
            .lean();

        // Fetch replies for each top-level comment (depth 1)
        const commentsWithReplies = await Promise.all(
            topLevelComments.map(async (comment) => {
                const replies = await Comment.find({
                    parentComment: comment._id,
                    deleted: false,
                    moderationStatus: { $ne: "rejected" },
                })
                    .sort({ createdAt: 1 })
                    .populate("author", "name image")
                    .lean();

                return {
                    ...comment,
                    replies: replies.map((r) => ({
                        ...r,
                        _id: r._id.toString(),
                        author: {
                            ...r.author,
                            _id: r.author._id.toString(),
                        },
                        post: r.post.toString(),
                        parentComment: r.parentComment?.toString(),
                        createdAt: r.createdAt.toISOString(),
                        updatedAt: r.updatedAt.toISOString(),
                    })),
                };
            })
        );

        // Get total count for pagination
        const totalComments = await Comment.countDocuments({
            post: post._id,
            depth: 0,
            deleted: false,
            moderationStatus: { $ne: "rejected" },
        });

        return NextResponse.json({
            comments: commentsWithReplies.map((c) => ({
                ...c,
                _id: c._id.toString(),
                author: {
                    ...c.author,
                    _id: c.author._id.toString(),
                },
                post: c.post.toString(),
                createdAt: c.createdAt.toISOString(),
                updatedAt: c.updatedAt.toISOString(),
            })),
            pagination: {
                page,
                limit,
                total: totalComments,
                totalPages: Math.ceil(totalComments / limit),
            },
        });
    } catch (error: any) {
        console.error("[GET_COMMENTS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// POST: Create a new comment
export async function POST(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const params = await context.params;
        const { content, parentCommentId } = await req.json();

        if (!content || content.trim().length === 0) {
            return new NextResponse("Content is required", { status: 400 });
        }

        if (content.length > 5000) {
            return new NextResponse("Content too long (max 5000 characters)", {
                status: 400,
            });
        }

        await dbConnect();

        // Get user for rate limiting
        const user = await User.findById(session.user.id);
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Check rate limit
        const rateLimitCheck = checkRateLimit(session.user.id as string, user.trustScore);
        if (!rateLimitCheck.allowed) {
            const resetIn = Math.ceil((rateLimitCheck.resetTime - Date.now()) / 60000);
            return new NextResponse(
                `Rate limit exceeded. Try again in ${resetIn} minutes.`,
                { status: 429 }
            );
        }

        // Find post
        const post = await Post.findOne({ slug: params.slug });
        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        let depth = 0;
        let parentComment = null;

        // Validate parent comment if replying
        if (parentCommentId) {
            parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                return new NextResponse("Parent comment not found", { status: 404 });
            }

            depth = parentComment.depth + 1;

            // Enforce max depth of 2
            if (depth > 2) {
                return new NextResponse("Maximum comment depth exceeded", {
                    status: 400,
                });
            }
        }

        // Auto-approve trusted users, pending for new users
        const moderationStatus =
            user.trustScore >= 1.2 ? "approved" : "pending";

        // Create comment
        const comment = await Comment.create({
            content: content.trim(),
            author: session.user.id,
            post: post._id,
            parentComment: parentCommentId || undefined,
            depth,
            moderationStatus,
        });

        // Record for rate limiting
        recordComment(session.user.id as string);

        // Update post comment count (only for approved comments)
        if (moderationStatus === "approved") {
            post.commentCount += 1;
            await post.save();
        }

        // Update user comment count
        user.commentCount += 1;
        await user.save();

        // Populate author for response
        const populatedComment = await Comment.findById(comment._id)
            .populate("author", "name image")
            .lean();

        return NextResponse.json({
            ...populatedComment,
            _id: populatedComment!._id.toString(),
            author: {
                ...populatedComment!.author,
                _id: populatedComment!.author._id.toString(),
            },
            post: populatedComment!.post.toString(),
            parentComment: populatedComment!.parentComment?.toString(),
            createdAt: populatedComment!.createdAt.toISOString(),
            updatedAt: populatedComment!.updatedAt.toISOString(),
            rateLimitRemaining: rateLimitCheck.remaining - 1,
        });
    } catch (error: any) {
        console.error("[POST_COMMENT]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
