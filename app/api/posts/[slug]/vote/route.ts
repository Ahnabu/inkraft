import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Vote from "@/models/Vote";
import Post from "@/models/Post";
import User from "@/models/User";
import UserActivity from "@/models/UserActivity";
import { calculateVoteWeight, getAccountAgeDays, calculateEngagementScore } from "@/lib/engagement";

export const dynamic = 'force-dynamic';

export async function POST(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        console.log("[VOTE_POST] Starting vote request");
        
        const session = await auth();
        console.log("[VOTE_POST] Session:", session ? "exists" : "null");
        
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const params = await context.params;
        console.log("[VOTE_POST] Post slug:", params.slug);
        
        const { voteType } = await req.json();
        console.log("[VOTE_POST] Vote type:", voteType);

        if (!["upvote", "downvote"].includes(voteType)) {
            return new NextResponse("Invalid vote type", { status: 400 });
        }

        await dbConnect();
        console.log("[VOTE_POST] DB connected");

        // Find post
        const post = await Post.findOne({ slug: params.slug });
        console.log("[VOTE_POST] Post found:", post ? "yes" : "no");
        
        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        // Get user data for trust score calculation
        const user = await User.findById(session.user.id);
        console.log("[VOTE_POST] User found:", user ? "yes" : "no");
        
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Get user activity - use defaults if not found
        let articlesRead = 0;
        let contributions = 0;
        
        try {
            const userActivity = await UserActivity.findOne({ user: session.user.id });
            if (userActivity) {
                articlesRead = userActivity.articlesRead || 0;
                contributions = userActivity.contributions || 0;
            }
            console.log("[VOTE_POST] UserActivity loaded:", { articlesRead, contributions });
        } catch (activityError) {
            console.warn("[VOTE_POST] UserActivity error, using defaults:", activityError);
            // Continue with defaults (0, 0)
        }

        // Calculate vote weight based on trust
        let voteWeight = 1.0;
        try {
            const accountAgeDays = getAccountAgeDays(user.createdAt);
            voteWeight = calculateVoteWeight(
                accountAgeDays,
                articlesRead,
                contributions
            );
            console.log("[VOTE_POST] Vote weight calculated:", voteWeight);
        } catch (weightError) {
            console.warn("[VOTE_POST] Vote weight calculation error, using default:", weightError);
            voteWeight = 1.0;
        }

        // Check for existing vote
        let existingVote = null;
        try {
            existingVote = await Vote.findOne({
                user: session.user.id,
                post: post._id,
            });
            console.log("[VOTE_POST] Existing vote:", existingVote ? existingVote.voteType : "none");
        } catch (voteCheckError) {
            console.error("[VOTE_POST] Error checking existing vote:", voteCheckError);
            // Continue as if no existing vote
        }

        let oldVoteType: string | null = null;
        let oldWeight = 0;
        let finalUserVote: "upvote" | "downvote" | null = null;

        if (existingVote) {
            oldVoteType = existingVote.voteType;
            oldWeight = existingVote.weight || 1.0;

            // If same vote type, remove vote (toggle off)
            if (existingVote.voteType === voteType) {
                console.log("[VOTE_POST] Toggling vote off");
                try {
                    await Vote.deleteOne({ _id: existingVote._id });
                } catch (deleteError) {
                    console.error("[VOTE_POST] Error deleting vote:", deleteError);
                    throw new Error("Failed to remove vote");
                }

                // Update post counts
                if (voteType === "upvote") {
                    post.upvotes = Math.max(0, (post.upvotes || 0) - oldWeight);
                } else {
                    post.downvotes = Math.max(0, (post.downvotes || 0) - oldWeight);
                }

                finalUserVote = null; // Vote toggled off
            } else {
                // Switch vote type
                console.log("[VOTE_POST] Switching vote from", oldVoteType, "to", voteType);
                try {
                    existingVote.voteType = voteType;
                    existingVote.weight = voteWeight;
                    await existingVote.save();
                } catch (updateError) {
                    console.error("[VOTE_POST] Error updating vote:", updateError);
                    throw new Error("Failed to update vote");
                }

                // Update post counts (remove old, add new)
                if (oldVoteType === "upvote") {
                    post.upvotes = Math.max(0, (post.upvotes || 0) - oldWeight);
                    post.downvotes = (post.downvotes || 0) + voteWeight;
                } else {
                    post.downvotes = Math.max(0, (post.downvotes || 0) - oldWeight);
                    post.upvotes = (post.upvotes || 0) + voteWeight;
                }

                finalUserVote = voteType; // Vote switched
            }
        } else {
            // Create new vote
            console.log("[VOTE_POST] Creating new vote");
            try {
                await Vote.create({
                    user: session.user.id,
                    post: post._id,
                    voteType,
                    weight: voteWeight,
                });
            } catch (createError) {
                console.error("[VOTE_POST] Error creating vote:", createError);
                throw new Error("Failed to create vote");
            }

            // Update post counts
            if (voteType === "upvote") {
                post.upvotes = (post.upvotes || 0) + voteWeight;
            } else {
                post.downvotes = (post.downvotes || 0) + voteWeight;
            }

            finalUserVote = voteType; // New vote created
        }

        // Recalculate engagement score
        try {
            const daysSincePublish = post.publishedAt
                ? (Date.now() - post.publishedAt.getTime()) / (1000 * 60 * 60 * 24)
                : 0;

            post.engagementScore = calculateEngagementScore(
                post.upvotes || 0,
                post.downvotes || 0,
                post.commentCount || 0,
                daysSincePublish
            );
        } catch (engagementError) {
            console.warn("[VOTE_POST] Engagement score calculation error:", engagementError);
            // Continue without updating engagement score
        }

        console.log("[VOTE_POST] Saving post with new vote counts");
        try {
            await post.save();
            console.log("[VOTE_POST] Vote completed successfully");
        } catch (saveError) {
            console.error("[VOTE_POST] Error saving post:", saveError);
            throw new Error("Failed to save vote changes");
        }

        // Return updated vote counts
        return NextResponse.json({
            upvotes: Math.round(post.upvotes || 0),
            downvotes: Math.round(post.downvotes || 0),
            engagementScore: Math.round(post.engagementScore || 0),
            userVote: finalUserVote,
        });
    } catch (error: unknown) {
        console.error("[VOTE_POST_ERROR]", error);
        if (error instanceof Error) {
            console.error("[VOTE_POST_STACK]", error.stack);
            console.error("[VOTE_POST_MESSAGE]", error.message);
            console.error("[VOTE_POST_NAME]", error.name);
        }
        const message = error instanceof Error ? error.message : "Internal Error";
        return new NextResponse(JSON.stringify({ 
            error: message,
            details: error instanceof Error ? error.stack : String(error)
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
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
    } catch (error: unknown) {
        console.error("[GET_VOTE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
