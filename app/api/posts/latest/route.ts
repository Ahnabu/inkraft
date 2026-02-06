import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

// Cache for latest posts (5 minutes - shorter for freshness)
let latestPostsCache: {
    data: any[];
    timestamp: number;
    category?: string;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url, "http://localhost");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const category = searchParams.get("category");
        const skip = (page - 1) * limit;

        await dbConnect();

        // Check cache
        const now = Date.now();
        if (
            latestPostsCache &&
            now - latestPostsCache.timestamp < CACHE_DURATION &&
            latestPostsCache.category === category
        ) {
            const paginatedData = latestPostsCache.data.slice(skip, skip + limit);
            return NextResponse.json({
                posts: paginatedData,
                pagination: {
                    page,
                    limit,
                    total: latestPostsCache.data.length,
                    totalPages: Math.ceil(latestPostsCache.data.length / limit),
                },
            });
        }

        // Build query
        const query: any = { published: true };
        if (category) {
            query.category = category;
        }

        // Fetch posts sorted by publish date
        const posts = await Post.find(query)
            .sort({ publishedAt: -1 })
            .populate("author", "name image")
            .lean();

        const formattedPosts = posts.map((post) => ({
            ...post,
            _id: post._id.toString(),
            author: {
                ...post.author,
                _id: post.author._id.toString(),
            },
            publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        }));

        // Cache results
        latestPostsCache = {
            data: formattedPosts,
            timestamp: now,
            category: category || undefined,
        };

        // Paginate
        const paginatedPosts = formattedPosts.slice(skip, skip + limit);

        return NextResponse.json({
            posts: paginatedPosts,
            pagination: {
                page,
                limit,
                total: formattedPosts.length,
                totalPages: Math.ceil(formattedPosts.length / limit),
            },
        });
    } catch (error: any) {
        console.error("[GET_LATEST_POSTS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
