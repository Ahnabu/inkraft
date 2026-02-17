
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import Note from "@/models/Note";
import UserActivity from "@/models/UserActivity";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | Inkraft",
    description: "Manage your comprehensive blogging dashboard. View analytics, manage posts, and track your writing progress.",
};

async function getDashboardData(userId: string) {
    await dbConnect();

    const userWithSaved = await User.findById(userId)
        .populate({
            path: "savedPosts",
            match: { published: true },
            populate: { path: "author", select: "name image" },
            options: { limit: 10, sort: { createdAt: -1 } }
        })
        .lean();

    const [posts, userActivity, notes] = await Promise.all([
        Post.find({ author: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
        UserActivity.findOne({ user: userId }).lean(),
        Note.find({ userId: userId }).sort({ createdAt: -1 }).populate({
            path: 'postId',
            select: 'title slug'
        }).lean()
    ]);

    const savedPosts = userWithSaved?.savedPosts || [];
    const publishedPosts = posts.filter((p: any) => p.published);
    const draftPosts = posts.filter((p: any) => !p.published);
    const totalUpvotes = posts.reduce((sum: number, p: any) => sum + (p.upvotes || 0), 0);
    const totalComments = posts.reduce((sum: number, p: any) => sum + (p.commentCount || 0), 0);

    return {
        user: JSON.parse(JSON.stringify(userWithSaved)),
        posts: JSON.parse(JSON.stringify(posts)),
        savedPosts: JSON.parse(JSON.stringify(savedPosts)),
        notes: JSON.parse(JSON.stringify(notes)),
        userActivity: userActivity ? JSON.parse(JSON.stringify(userActivity)) : null,
        stats: {
            totalPosts: posts.length,
            publishedPosts: publishedPosts.length,
            draftPosts: draftPosts.length,
            totalUpvotes,
            totalComments,
            savedPostsCount: savedPosts.length,
            notesCount: notes.length,
        },
    };
}

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const data = await getDashboardData(session.user.id);

    return <DashboardClient {...data} />;
}
