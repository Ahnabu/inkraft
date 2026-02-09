
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import ReadingHistory from "@/models/ReadingHistory";
import Post from "@/models/Post";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { postId, progress, completed } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: "Post ID required" }, { status: 400 });
        }

        await dbConnect();

        // Verify post exists
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Update or create reading history
        const history = await ReadingHistory.findOneAndUpdate(
            { user: session.user.id, post: postId },
            {
                lastReadAt: new Date(),
                progress: progress || 0,
                completed: completed || false
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, history });

    } catch (error) {
        console.error("Error saving reading history:", error);
        return NextResponse.json(
            { error: "Failed to save reading history" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get("limit") || "10");
        const page = parseInt(url.searchParams.get("page") || "1");
        const skip = (page - 1) * limit;

        const history = await ReadingHistory.find({ user: session.user.id })
            .sort({ lastReadAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'post',
                select: 'title slug excerpt coverImage author category readingTime',
                populate: {
                    path: 'author',
                    select: 'name image'
                }
            });

        const total = await ReadingHistory.countDocuments({ user: session.user.id });

        return NextResponse.json({
            history,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                current: page
            }
        });

    } catch (error) {
        console.error("Error fetching reading history:", error);
        return NextResponse.json(
            { error: "Failed to fetch reading history" },
            { status: 500 }
        );
    }
}
