import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from "@/models/User"; // Import User model to ensure it's registered for populate
import Vote from "@/models/Vote";
import Comment from "@/models/Comment";
import { calculateEngagementScore, calculateTrendingScore } from "@/lib/engagement";

export async function fetchLatestPosts(limit = 20, page = 1, category?: string) {
    await dbConnect();
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { published: true };
    if (category) query.category = category;

    const posts = await Post.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "name image")
        .lean();

    return posts.map((post) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const postObj = post as any;
        return {
            ...post,
            _id: post._id.toString(),
            author: {
                _id: postObj.author._id.toString(),
                name: postObj.author.name,
                image: postObj.author.image,
            },
            excerpt: post.excerpt || "",
            publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        };
    });
}

export async function fetchTopPosts(limit = 10, page = 1, category?: string) {
    await dbConnect();
    const query: Record<string, unknown> = { published: true };
    if (category) query.category = category;

    // For performance, we might want to query all and sort in memory if dataset is small,
    // or rely on a pre-computed score field in DB (ideal).
    // Following existing API logic: fetch all/many and sort in memory.
    const posts = await Post.find(query)
        .populate("author", "name image")
        .lean();

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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const postObj = post as any;
        return {
            ...post,
            _id: post._id.toString(),
            author: {
                _id: postObj.author._id.toString(),
                name: postObj.author.name,
                image: postObj.author.image,
            },
            excerpt: post.excerpt || "",
            engagementScore: Math.round(engagementScore),
            publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        };
    });

    const sortedPosts = postsWithScores.sort((a, b) => b.engagementScore - a.engagementScore);
    const skip = (page - 1) * limit;
    return sortedPosts.slice(skip, skip + limit);
}

export async function fetchTrendingPosts(limit = 10, page = 1) {
    await dbConnect();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const posts = await Post.find({
        published: true,
        publishedAt: { $gte: sevenDaysAgo },
    })
        .populate("author", "name image")
        .lean();

    const postsWithTrendScores = await Promise.all(
        posts.map(async (post) => {
            const hoursSincePublish = post.publishedAt
                ? (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60)
                : 0;

            const timeWindow = hoursSincePublish <= 24
                ? 24 * 60 * 60 * 1000
                : 72 * 60 * 60 * 1000;

            const windowStart = new Date(Date.now() - timeWindow);

            const recentVotes = await Vote.countDocuments({
                post: post._id,
                createdAt: { $gte: windowStart },
            });

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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const postObj = post as any;
            return {
                ...post,
                _id: post._id.toString(),
                author: {
                    _id: postObj.author._id.toString(),
                    name: postObj.author.name,
                    image: postObj.author.image,
                },
                excerpt: post.excerpt || "",
                trendScore: Math.round(trendScore * 100) / 100,
                recentVotes,
                recentComments,
                publishedAt: post.publishedAt?.toISOString(),
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
            };
        })
    );

    const trendingPosts = postsWithTrendScores
        .filter((post) => post.trendScore > 0 && (post.recentVotes >= 5 || post.recentComments >= 3))
        .sort((a, b) => b.trendScore - a.trendScore);

    const skip = (page - 1) * limit;
    return trendingPosts.slice(skip, skip + limit);
}
