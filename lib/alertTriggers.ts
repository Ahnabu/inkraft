/**
 * Alert Triggers - Automated detection for suspicious activity
 * Run these functions via cron jobs or event hooks
 */

import dbConnect from "@/lib/mongodb";
import AdminAlert from "@/models/AdminAlert";
import Post from "@/models/Post";
import User from "@/models/User";
import Vote from "@/models/Vote";
import Comment from "@/models/Comment";

// Time constants
const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

/**
 * Detect unusual vote activity on a post
 * Triggers alert if votes in the last hour exceed threshold
 */
export async function detectVoteSpike(postId: string, threshold = 50): Promise<boolean> {
    await dbConnect();

    const oneHourAgo = new Date(Date.now() - ONE_HOUR);

    const recentVotes = await Vote.countDocuments({
        post: postId,
        createdAt: { $gte: oneHourAgo }
    });

    if (recentVotes >= threshold) {
        const post = await Post.findById(postId).select("title author");

        // Check if alert already exists for this spike
        const existingAlert = await AdminAlert.findOne({
            type: "vote_spike",
            targetPost: postId,
            resolved: false,
            createdAt: { $gte: oneHourAgo }
        });

        if (!existingAlert) {
            await AdminAlert.create({
                type: "vote_spike",
                severity: recentVotes > 100 ? "critical" : "high",
                targetPost: postId,
                targetUser: post?.author,
                title: `Unusual vote activity detected`,
                description: `Post "${post?.title}" received ${recentVotes} votes in the last hour, which is significantly above normal.`,
                metadata: {
                    voteCount: recentVotes,
                    threshold,
                    detectedAt: new Date().toISOString()
                }
            });
            return true;
        }
    }

    return false;
}

/**
 * Detect spam-like comment velocity from a user
 * Triggers if user posts too many comments in a short time
 */
export async function detectSpamVelocity(userId: string, threshold = 10): Promise<boolean> {
    await dbConnect();

    const oneHourAgo = new Date(Date.now() - ONE_HOUR);

    const recentComments = await Comment.countDocuments({
        author: userId,
        createdAt: { $gte: oneHourAgo }
    });

    if (recentComments >= threshold) {
        const user = await User.findById(userId).select("name email");

        // Check for existing unresolved alert
        const existingAlert = await AdminAlert.findOne({
            type: "spam_velocity",
            targetUser: userId,
            resolved: false,
            createdAt: { $gte: oneHourAgo }
        });

        if (!existingAlert) {
            await AdminAlert.create({
                type: "spam_velocity",
                severity: recentComments > 20 ? "high" : "medium",
                targetUser: userId,
                title: `High comment velocity detected`,
                description: `User "${user?.name}" posted ${recentComments} comments in the last hour.`,
                metadata: {
                    commentCount: recentComments,
                    threshold,
                    userEmail: user?.email
                }
            });
            return true;
        }
    }

    return false;
}

/**
 * Detect low trust user with high engagement (potential manipulation)
 */
export async function detectLowTrustEngagement(userId: string): Promise<boolean> {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user || user.trustScore >= 0.8) return false;

    const oneDayAgo = new Date(Date.now() - ONE_DAY);

    // Count recent votes by this user
    const recentVotes = await Vote.countDocuments({
        user: userId,
        createdAt: { $gte: oneDayAgo }
    });

    // Low trust + high activity = suspicious
    if (user.trustScore < 0.5 && recentVotes > 20) {
        const existingAlert = await AdminAlert.findOne({
            type: "low_trust_engagement",
            targetUser: userId,
            resolved: false,
            createdAt: { $gte: oneDayAgo }
        });

        if (!existingAlert) {
            await AdminAlert.create({
                type: "low_trust_engagement",
                severity: "medium",
                targetUser: userId,
                title: `Low-trust user with unusual activity`,
                description: `User "${user.name}" (trust: ${user.trustScore.toFixed(2)}) had ${recentVotes} votes in the last 24 hours.`,
                metadata: {
                    trustScore: user.trustScore,
                    voteCount: recentVotes
                }
            });
            return true;
        }
    }

    return false;
}

/**
 * Check posts for vote manipulation patterns
 * Call this periodically (e.g., every hour via cron)
 */
export async function runVoteSpikeCheck(): Promise<number> {
    await dbConnect();

    const oneHourAgo = new Date(Date.now() - ONE_HOUR);

    // Find posts with significant recent vote activity
    const hotPosts = await Vote.aggregate([
        { $match: { createdAt: { $gte: oneHourAgo } } },
        { $group: { _id: "$post", voteCount: { $sum: 1 } } },
        { $match: { voteCount: { $gte: 30 } } }, // Lower threshold for scanning
        { $sort: { voteCount: -1 } },
        { $limit: 10 }
    ]);

    let alertsCreated = 0;
    for (const post of hotPosts) {
        const triggered = await detectVoteSpike(post._id.toString(), 50);
        if (triggered) alertsCreated++;
    }

    return alertsCreated;
}

/**
 * Freeze a user's trust score (admin action)
 */
export async function freezeUserTrust(userId: string, adminId: string, reason: string): Promise<void> {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Store frozen state in metadata (add to User model if needed)
    user.trustFrozen = true;
    user.trustFrozenAt = new Date();
    user.trustFrozenBy = adminId;
    user.trustFrozenReason = reason;
    await user.save();

    await AdminAlert.create({
        type: "suspicious_activity",
        severity: "high",
        targetUser: userId,
        title: `Trust score frozen`,
        description: `Admin froze trust score for user "${user.name}". Reason: ${reason}`,
        resolved: true,
        resolvedBy: adminId,
        resolvedAt: new Date(),
        action: "trust_frozen"
    });
}

/**
 * Nullify suspicious votes on a post
 */
export async function nullifyVotes(postId: string, adminId: string, reason: string): Promise<number> {
    await dbConnect();

    const oneHourAgo = new Date(Date.now() - ONE_HOUR);

    // Get recent suspicious votes (from low-trust users)
    const suspiciousVotes = await Vote.find({
        post: postId,
        createdAt: { $gte: oneHourAgo }
    }).populate("user", "trustScore");

    let nullifiedCount = 0;
    for (const vote of suspiciousVotes) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userTrust = (vote.user as any)?.trustScore || 0;
        if (userTrust < 0.5) {
            await Vote.findByIdAndDelete(vote._id);
            nullifiedCount++;
        }
    }

    // Update post vote counts
    if (nullifiedCount > 0) {
        const post = await Post.findById(postId);
        if (post) {
            post.upvotes = Math.max(0, (post.upvotes || 0) - nullifiedCount);
            await post.save();
        }

        await AdminAlert.create({
            type: "vote_spike",
            severity: "high",
            targetPost: postId,
            title: `Votes nullified`,
            description: `${nullifiedCount} suspicious votes removed. Reason: ${reason}`,
            resolved: true,
            resolvedBy: adminId,
            resolvedAt: new Date(),
            action: "votes_nullified",
            metadata: { nullifiedCount, reason }
        });
    }

    return nullifiedCount;
}
