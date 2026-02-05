import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Vote from "@/models/Vote";
import Post from "@/models/Post";
import User from "@/models/User";
import UserActivity from "@/models/UserActivity";
import { calculateVoteWeight, getAccountAgeDays, calculateEngagementScore } from "@/lib/engagement";

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
        const { voteType } = await req.json(); // "upvote" | "downvote"

        if (!["upvote", "downvote"].includes(voteType)) {
            return new NextResponse("Invalid vote type", { status: 400 });
        }

        await dbConnect();

        // Find post
        const post = await Post.findOne({ slug: params.slug });
        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        // Get user data for trust score calculation
        const user = await User.findById(session.user.id);
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Get user activity
        let userActivity = await UserActivity.findOne({ user: session.user.id });
        if (!userActivity) {
            // Create default activity if not exists
            userActivity = await UserActivity.create({
                user: session.user.id,
                articlesRead: 0,
                contributions: 0,
            });
        }

        // Calculate vote weight based on trust
        const accountAgeDays = getAccountAgeDays(user.createdAt);
        const voteWeight = calculateVoteWeight(
            accountAgeDays,
            userActivity.articlesRead,
            userActivity.contributions
        );

        // Check for existing vote
        const existingVote = await Vote.findOne({
            user: session.user.id,
            post: post._id,
        });

        let oldVoteType: string | null = null;
        let oldWeight = 0;

        if (existingVote) {
            oldVoteType = existingVote.voteType;
            oldWeight = existingVote.weight;

            // If same vote type, remove vote (toggle off)
            if (existingVote.voteType === voteType) {
                await Vote.deleteOne({ _id: existingVote._id });

                // Update post counts
                if (voteType === "upvote") {
                    post.upvotes = Math.max(0, post.upvotes - oldWeight);
                } else {
                    post.downvotes = Math.max(0, post.downvotes - oldWeight);
                }
            } else {
                // Switch vote type
                existingVote.voteType = voteType;
                existingVote.weight = voteWeight;
                await existingVote.save();

                // Update post counts (remove old, add new)
                if (oldVoteType === "upvote") {
                    post.upvotes = Math.max(0, post.upvotes - oldWeight);
                    post.downvotes += voteWeight;
                } else {
                    post.downvotes = Math.max(0, post.downvotes - oldWeight);
                    post.upvotes += voteWeight;
                }
            }
        } else {
            // Create new vote
            await Vote.create({
                user: session.user.id,
                post: post._id,
                voteType,
                weight: voteWeight,
            });

            // Update post counts
            if (voteType === "upvote") {
                post.upvotes += voteWeight;
            } else {
                post.downvotes += voteWeight;
            }
        }

        // Recalculate engagement score
        const daysSincePublish = post.publishedAt
            ? (Date.now() - post.publishedAt.getTime()) / (1000 * 60 * 60 * 24)
            : 0;

        post.engagementScore = calculateEngagementScore(
            post.upvotes,
            post.downvotes,
            post.commentCount,
            daysSincePublish
        );

        await post.save();

        // Return updated vote counts
        return NextResponse.json({
            upvotes: Math.round(post.upvotes),
            downvotes: Math.round(post.downvotes),
            engagementScore: Math.round(post.engagementScore),
            userVote: existingVote?.voteType === voteType ? null : voteType, // null if toggled off
        });
    } catch (error: any) {
        console.error("[VOTE_POST]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}

// GET: Check user's vote on this post
export async function GET(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ userVote: null });
        }

        const params = await context.params;
        await dbConnect();

        const post = await Post.findOne({ slug: params.slug });
        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        const vote = await Vote.findOne({
            user: session.user.id,
            post: post._id,
        });

        return NextResponse.json({
            userVote: vote?.voteType || null,
            upvotes: Math.round(post.upvotes),
            downvotes: Math.round(post.downvotes),
        });
    } catch (error: any) {
        console.error("[GET_VOTE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
