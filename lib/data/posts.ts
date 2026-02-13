import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from "@/models/User"; // Import User model to ensure it's registered for populate
import Vote from "@/models/Vote";
import Comment from "@/models/Comment";
import { calculateEngagementScore, calculateTrendingScore } from "@/lib/engagement";

export async function fetchLatestPosts(limit = 20, page = 1, category?: string, locale?: string) {
    await dbConnect();
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { published: true };
    if (category) query.category = category;
    if (locale) query.locale = locale;

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

export async function fetchTopPosts(limit = 10, page = 1, category?: string, locale?: string) {
    await dbConnect();
    const query: Record<string, unknown> = { published: true };
    if (category) query.category = category;
    if (locale) query.locale = locale;

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

export async function fetchTrendingPosts(limit = 10, page = 1, locale?: string) {
    await dbConnect();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const matchQuery: any = {
        published: true,
        publishedAt: { $gte: sevenDaysAgo },
    };
    if (locale) matchQuery.locale = locale;

    const posts = await Post.find(matchQuery)
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
                rankingDetails: {
                    type: "trending",
                    score: Math.round(trendScore * 100) / 100,
                    formula: "Viral / (Hours + 2)^1.5",
                    factors: {
                        viral_velocity: recentVotes + recentComments * 2.0,
                        time_decay: Math.round(Math.pow(hoursSincePublish + 2, 1.5) * 10) / 10
                    }
                },
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

export async function fetchFollowedPosts(userId: string, limit = 20, page = 1, locale?: string) {
    await dbConnect();
    const user = await User.findById(userId).select("following");

    if (!user || !user.following || user.following.length === 0) {
        return [];
    }

    const skip = (page - 1) * limit;
    const query: any = {
        author: { $in: user.following },
        published: true,
    };
    if (locale) query.locale = locale;

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

/**
 * Personalized "For You" feed based on user preferences.
 * Scoring formula: authorFollow(+10) + categoryFollow(+5) + engagement + freshness
 */
export async function fetchPersonalizedFeed(userId: string, limit = 20, page = 1, locale?: string) {
    await dbConnect();

    // Get user preferences
    const user = await User.findById(userId).select("following followedCategories");
    const followedAuthors = user?.following || [];
    const followedCategories = user?.followedCategories || [];

    // If user has no preferences, fall back to trending/latest
    if (followedAuthors.length === 0 && followedCategories.length === 0) {
        return fetchLatestPosts(limit, page, undefined, locale); // Pass locale
    }

    // Get recent posts (last 30 days) - wider pool for personalization
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const query: any = {
        published: true,
        publishedAt: { $gte: thirtyDaysAgo },
    };
    if (locale) query.locale = locale;

    const posts = await Post.find(query)
        .populate("author", "name image")
        .lean();

    // Calculate personalized scores
    const now = Date.now();
    const followedAuthorIds = followedAuthors.map((id: { toString: () => string }) => id.toString());

    const scoredPosts = posts.map((post) => {
        let feedScore = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const postObj = post as any;

        // Author follow boost (+10)
        if (followedAuthorIds.includes(postObj.author._id.toString())) {
            feedScore += 10;
        }

        // Category follow boost (+5)
        if (followedCategories.includes(post.category)) {
            feedScore += 5;
        }

        // Engagement score (normalized 0-5)
        const engagementBase = (post.upvotes || 0) - (post.downvotes || 0) + (post.commentCount || 0) * 2;
        const engagementScore = Math.min(5, Math.log10(Math.max(1, engagementBase)) * 2);
        feedScore += engagementScore;

        // Freshness score (0-5, decays over time)
        const hoursSincePublish = post.publishedAt
            ? (now - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60)
            : 0;
        const freshnessScore = Math.max(0, 5 - (hoursSincePublish / 48)); // Full points within 48h
        feedScore += freshnessScore;

        return {
            ...post,
            _id: post._id.toString(),
            author: {
                _id: postObj.author._id.toString(),
                name: postObj.author.name,
                image: postObj.author.image,
            },
            excerpt: post.excerpt || "",
            feedScore: Math.round(feedScore * 100) / 100,
            rankingDetails: {
                type: "personalized",
                score: Math.round(feedScore * 100) / 100,
                factors: {
                    author_follow: followedAuthorIds.includes(post.author._id.toString()) ? 10 : 0,
                    category_follow: followedCategories.includes(post.category) ? 5 : 0,
                    engagement_quality: Math.round(engagementScore * 10) / 10,
                    freshness: Math.round(freshnessScore * 10) / 10
                }
            },
            publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        };
    });

    // Sort by feed score + some randomization for variety
    const sortedPosts = scoredPosts
        .sort((a, b) => {
            // Add slight randomization for posts with similar scores
            const scoreDiff = b.feedScore - a.feedScore;
            if (Math.abs(scoreDiff) < 2) {
                return Math.random() - 0.5; // Shuffle similar-scored posts
            }
            return scoreDiff;
        });

    const skip = (page - 1) * limit;
    return sortedPosts.slice(skip, skip + limit);
}
