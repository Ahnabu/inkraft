import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Vote from "@/models/Vote";
import Comment from "@/models/Comment";
import { calculateTrendingScore } from "@/lib/engagement";

// Cache for trending posts (30 minutes)
let trendingPostsCache: {
    data: any[];
    timestamp: number;
} | null = null;

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url, "http://localhost");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        await dbConnect();

        // Check cache
        const now = Date.now();
        if (trendingPostsCache && now - trendingPostsCache.timestamp < CACHE_DURATION) {
            const paginatedData = trendingPostsCache.data.slice(skip, skip + limit);
            return NextResponse.json({
                posts: paginatedData,
                pagination: {
                    page,
                    limit,
                    total: trendingPostsCache.data.length,
                    totalPages: Math.ceil(trendingPostsCache.data.length / limit),
                },
            });
        }

        // Fetch posts from last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const posts = await Post.find({
            published: true,
            publishedAt: { $gte: sevenDaysAgo },
        })
            .populate("author", "name image")
            .lean();

        // Calculate trending scores
        const postsWithTrendScores = await Promise.all(
            posts.map(async (post) => {
                const hoursSincePublish = post.publishedAt
                    ? (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60)
                    : 0;

                // Determine time window based on post age
                const timeWindow =
                    hoursSincePublish <= 24
                        ? 24 * 60 * 60 * 1000 // 24 hours for very new content
                        : 72 * 60 * 60 * 1000; // 72 hours for content under 7 days

                const windowStart = new Date(Date.now() - timeWindow);

                // Count recent votes
                const recentVotes = await Vote.countDocuments({
                    post: post._id,
                    createdAt: { $gte: windowStart },
                });

                // Count recent comments
                const recentComments = await Comment.countDocuments({
                    post: post._id,
                    createdAt: { $gte: windowStart },
                    deleted: false,
                    moderationStatus: "approved",
                });

                const trendScore = calculateTrendingScore(
                    recentVotes,
                    recentComments,
                    hoursSincePublish
                );

                return {
                    ...post,
                    _id: post._id.toString(),
                    author: {
                        ...post.author,
                        _id: post.author._id.toString(),
                    },
                    trendScore: Math.round(trendScore * 100) / 100,
                    recentVotes,
                    recentComments,
                    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
                    createdAt: post.createdAt.toISOString(),
                    updatedAt: post.updatedAt.toISOString(),
                };
            })
        );

        // Filter by minimum engagement threshold
        const trendingPosts = postsWithTrendScores
            .filter(
                (post) =>
                    post.trendScore > 0 &&
                    (post.recentVotes >= 5 || post.recentComments >= 3)
            )
            .sort((a, b) => b.trendScore - a.trendScore);

        // Cache results
        trendingPostsCache = {
            data: trendingPosts,
            timestamp: now,
        };

        // Paginate
        const paginatedPosts = trendingPosts.slice(skip, skip + limit);

        return NextResponse.json({
            posts: paginatedPosts,
            pagination: {
                page,
                limit,
                total: trendingPosts.length,
                totalPages: Math.ceil(trendingPosts.length / limit),
            },
        });
    } catch (error: any) {
        console.error("[GET_TRENDING_POSTS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
