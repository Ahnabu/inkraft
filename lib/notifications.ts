"use server";

import Notification, { NotificationType, INotification } from "@/models/Notification";
import Post from "@/models/Post";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

/**
 * Get date key for batching (YYYY-MM-DD format)
 */
function getDateKey(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Create or increment a batched notification.
 * Instead of creating multiple notifications for similar events,
 * we group them under a single notification with a count.
 */
export async function createBatchedNotification(
    userId: string,
    type: NotificationType,
    payload: Partial<Omit<INotification, 'user' | 'type' | 'batchKey' | 'batchCount'>>
): Promise<INotification> {
    await dbConnect();

    const batchKey = `${type}-${userId}-${getDateKey()}`;

    // Check if batch exists and is still unread
    const existing = await Notification.findOne({
        user: userId,
        batchKey,
        state: "unread"
    });

    if (existing) {
        // Increment batch count instead of creating new notification
        await existing.updateOne({
            $inc: { batchCount: 1 },
            $set: { updatedAt: new Date() }
        });
        return existing;
    }

    // Create new notification
    return Notification.create({
        user: userId,
        type,
        batchKey,
        batchCount: 1,
        state: "unread",
        read: false,
        ...payload
    });
}

/**
 * Check if post reached an upvote milestone and send notification
 */
export async function checkUpvoteMilestone(postId: string, currentUpvotes: number): Promise<void> {
    const milestones = [10, 50, 100, 500, 1000, 5000];
    const milestone = milestones.find(m => currentUpvotes === m);

    if (!milestone) return;

    await dbConnect();

    const post = await Post.findById(postId).select("author title");
    if (!post) return;

    // Check if we already notified about this milestone
    const existingNotif = await Notification.findOne({
        user: post.author,
        post: postId,
        type: "upvote_milestone",
        message: { $regex: `${milestone} upvotes` }
    });

    if (existingNotif) return; // Already notified

    await Notification.create({
        user: post.author,
        type: "upvote_milestone",
        post: postId,
        message: `Your post "${post.title.substring(0, 50)}" reached ${milestone} upvotes!`,
        state: "unread",
        read: false
    });
}

/**
 * Notify all followers of a category about a new post
 */
export async function notifyCategoryFollowers(
    postId: string,
    category: string,
    authorId: string,
    postTitle: string
): Promise<number> {
    await dbConnect();

    // Find users who follow this category (but not the author themselves)
    const categoryFollowers = await User.find({
        followedCategories: category,
        _id: { $ne: authorId }
    }).select("_id");

    if (categoryFollowers.length === 0) return 0;

    const notifications = categoryFollowers.map(user => ({
        user: user._id,
        type: "category_post" as NotificationType,
        actor: authorId,
        post: postId,
        category,
        message: `New post in ${category}: "${postTitle.substring(0, 40)}..."`,
        state: "unread",
        read: false
    }));

    await Notification.insertMany(notifications);
    return notifications.length;
}

/**
 * Create admin announcement for all users or specific group
 */
export async function createAdminAnnouncement(
    message: string,
    targetUserIds?: string[]
): Promise<number> {
    await dbConnect();

    let targets: { _id: unknown }[];

    if (targetUserIds && targetUserIds.length > 0) {
        targets = targetUserIds.map(id => ({ _id: id }));
    } else {
        // Broadcast to all users
        targets = await User.find({ banned: false }).select("_id").lean();
    }

    const notifications = targets.map(user => ({
        user: user._id,
        type: "admin_announcement" as NotificationType,
        message,
        state: "unread",
        read: false
    }));

    // Use bulkWrite for large number of users
    if (notifications.length > 1000) {
        const batches = [];
        for (let i = 0; i < notifications.length; i += 1000) {
            batches.push(notifications.slice(i, i + 1000));
        }
        for (const batch of batches) {
            await Notification.insertMany(batch);
        }
    } else {
        await Notification.insertMany(notifications);
    }

    return targets.length;
}

/**
 * Mark notifications as read/archived
 */
export async function updateNotificationState(
    notificationIds: string[],
    state: "read" | "archived"
): Promise<void> {
    await dbConnect();

    await Notification.updateMany(
        { _id: { $in: notificationIds } },
        {
            $set: {
                state,
                read: true // Legacy field - always true since we're marking as read or archived
            }
        }
    );
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
    await dbConnect();
    return Notification.countDocuments({
        user: userId,
        state: "unread"
    });
}
