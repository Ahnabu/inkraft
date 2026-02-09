"use server";

import { auth } from "@/auth";
import User from "@/models/User";
import Series from "@/models/Series";
import Post from "@/models/Post";
import Notification from "@/models/Notification";
import dbConnect from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function followUser(targetUserId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();

    // Prevent self-follow
    if (session.user.id === targetUserId) {
        throw new Error("Cannot follow yourself");
    }

    // Add to following
    await User.findByIdAndUpdate(session.user.id, {
        $addToSet: { following: targetUserId }
    });

    // Add to followers
    await User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: session.user.id }
    });

    // Create notification for the target user
    await Notification.create({
        user: targetUserId,
        type: "new_follower",
        actor: session.user.id,
        message: `started following you`
    });

    revalidatePath(`/author/${targetUserId}`);
    return { success: true };
}

export async function unfollowUser(targetUserId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();

    await User.findByIdAndUpdate(session.user.id, {
        $pull: { following: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: session.user.id }
    });

    revalidatePath(`/author/${targetUserId}`);
    return { success: true };
}

export async function createSeries(data: { title: string; description: string; slug: string; coverImage?: string }) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();

    const series = await Series.create({
        ...data,
        author: session.user.id,
        posts: []
    });

    return { success: true, id: series._id.toString() };
}

export async function updatePostStatus(postId: string, status: "draft" | "submitted" | "needs_revision" | "scheduled" | "published" | "archived") {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();
    const post = await Post.findById(postId);

    if (!post) throw new Error("Post not found");

    if (post.author.toString() !== session.user.id && session.user.role !== 'admin') {
        throw new Error("Unauthorized");
    }

    const updates: Record<string, unknown> = { status };
    if (status === 'published' && !post.publishedAt) {
        updates.publishedAt = new Date();
        updates.published = true; // Sync legacy field

        // Notify all followers about the new post
        const author = await User.findById(post.author).select("followers");
        if (author?.followers && author.followers.length > 0) {
            const notifications = author.followers.map((followerId: unknown) => ({
                user: followerId,
                type: "new_post",
                actor: post.author,
                post: post._id,
                message: `published a new post: "${post.title}"`
            }));
            await Notification.insertMany(notifications);
        }
    }

    await Post.findByIdAndUpdate(postId, updates);
    revalidatePath(`/post/${post.slug}`);
    revalidatePath(`/dashboard`);
    return { success: true };
}

