import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { calculateEngagementScore } from "@/lib/engagement";

export const dynamic = 'force-dynamic';

// Cache for top posts (15 minutes)
let topPostsCache: {
    data: Array<Record<string, unknown>>;
    timestamp: number;
    locale?: string;
} | null = null;

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url, "http://localhost");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const category = searchParams.get("category");
        const locale = searchParams.get("locale");
        const skip = (page - 1) * limit;

        await dbConnect();

        // Check cache
        const now = Date.now();
        if (
            topPostsCache &&
            now - topPostsCache.timestamp < CACHE_DURATION &&
            !category &&
            topPostsCache.locale === locale
        ) {
            // Return cached data with pagination
            const paginatedData = topPostsCache.data.slice(skip, skip + limit);
            return NextResponse.json({
                posts: paginatedData,
                pagination: {
                    page,
                    limit,
                    total: topPostsCache.data.length,
                    totalPages: Math.ceil(topPostsCache.data.length / limit),
                },
            });
        }

        // Build query
        const query: Record<string, unknown> = { published: true };
        if (category) {
            query.category = category;
        }
        if (locale) {
            query.locale = locale;
        }

        // Fetch all published posts
        const posts = await Post.find(query)
            .populate("author", "name image")
            .lean();

        // Calculate engagement scores
        const postsWithScores = posts.map((post) => {
            const daysSincePublish = post.publishedAt
                ? (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
                : 0;

            const engagementScore = calculateEngagementScore(
                post.upvotes || 0,
                post.downvotes || 0,
                post.commentCount || 0,
                daysSincePublish
            );

            return {
                ...post,
                _id: post._id.toString(),
                author: {
                    ...post.author,
                    _id: post.author._id.toString(),
                },
                engagementScore: Math.round(engagementScore),
                publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
            };
        });

        // Sort by engagement score descending
        const sortedPosts = postsWithScores.sort(
            (a, b) => b.engagementScore - a.engagementScore
        );

        // Cache results if no category filter
        if (!category) {
            topPostsCache = {
                data: sortedPosts,
                timestamp: now,
                locale: locale || undefined,
            };
        }

        // Paginate
        const paginatedPosts = sortedPosts.slice(skip, skip + limit);

        return NextResponse.json({
            posts: paginatedPosts,
            pagination: {
                page,
                limit,
                total: sortedPosts.length,
                totalPages: Math.ceil(sortedPosts.length / limit),
            },
        });
    } catch (error: unknown) {
        console.error("[GET_TOP_POSTS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
