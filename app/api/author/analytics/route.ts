import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PostAnalytics from "@/models/PostAnalytics";
import Post from "@/models/Post";
import { auth } from "@/auth";
import mongoose from "mongoose";

// GET /api/author/analytics - Get overall analytics for author's posts
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get time range from query params
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all posts by this author
    const authorPosts = await Post.find({
      author: new mongoose.Types.ObjectId(session.user.id as string),
      published: true,
    }).select("_id slug title");

    const postIds = authorPosts.map((post) => post._id);

    if (postIds.length === 0) {
      return NextResponse.json({
        summary: {
          totalPosts: 0,
          totalViews: 0,
          uniqueVisitors: 0,
          avgTimeOnPage: 0,
          avgScrollDepth: 0,
        },
        countries: [],
        topPosts: [],
        dailyViews: [],
        devices: [],
        browsers: [],
      });
    }

    // Fetch analytics data across all posts
    const [
      totalViews,
      uniqueVisitors,
      countryStats,
      deviceStats,
      browserStats,
      dailyViews,
      topPosts,
      avgEngagement,
    ] = await Promise.all([
      // Total views
      PostAnalytics.countDocuments({
        postId: { $in: postIds },
        viewedAt: { $gte: startDate },
      }),

      // Unique visitors (by IP hash)
      PostAnalytics.distinct("ipHash", {
        postId: { $in: postIds },
        viewedAt: { $gte: startDate },
      }).then((ips) => ips.length),

      // Views by country
      PostAnalytics.aggregate([
        {
          $match: {
            postId: { $in: postIds },
            viewedAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$country",
            count: { $sum: 1 },
            countryCode: { $first: "$countryCode" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]),

      // Views by device
      PostAnalytics.aggregate([
        {
          $match: {
            postId: { $in: postIds },
            viewedAt: { $gte: startDate },
          },
        },
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Views by browser
      PostAnalytics.aggregate([
        {
          $match: {
            postId: { $in: postIds },
            viewedAt: { $gte: startDate },
          },
        },
        { $group: { _id: "$browser", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),

      // Daily views
      PostAnalytics.aggregate([
        {
          $match: {
            postId: { $in: postIds },
            viewedAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$viewedAt" },
            },
            views: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Top performing posts
      PostAnalytics.aggregate([
        {
          $match: {
            postId: { $in: postIds },
            viewedAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$postSlug",
            views: { $sum: 1 },
            avgTimeOnPage: { $avg: "$timeOnPage" },
            avgScrollDepth: { $avg: "$scrollDepth" },
          },
        },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),

      // Average engagement
      PostAnalytics.aggregate([
        {
          $match: {
            postId: { $in: postIds },
            viewedAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            avgTimeOnPage: { $avg: "$timeOnPage" },
            avgScrollDepth: { $avg: "$scrollDepth" },
          },
        },
      ]),
    ]);

    // Enrich top posts with title
    const enrichedTopPosts = topPosts.map((stat: { _id: string; views: number; avgTimeOnPage: number; avgScrollDepth: number }) => {
      const post = authorPosts.find((p) => p.slug === stat._id);
      return {
        slug: stat._id,
        title: post?.title || "Unknown",
        views: stat.views,
        avgTimeOnPage: stat.avgTimeOnPage,
        avgScrollDepth: stat.avgScrollDepth,
      };
    });

    return NextResponse.json({
      summary: {
        totalPosts: authorPosts.length,
        totalViews,
        uniqueVisitors,
        avgTimeOnPage: avgEngagement[0]?.avgTimeOnPage || 0,
        avgScrollDepth: avgEngagement[0]?.avgScrollDepth || 0,
      },
      countries: countryStats.map((stat: { _id: string; count: number; countryCode: string }) => ({
        country: stat._id,
        countryCode: stat.countryCode,
        views: stat.count,
      })),
      devices: deviceStats.map((stat: { _id: string; count: number }) => ({
        device: stat._id,
        views: stat.count,
      })),
      browsers: browserStats.map((stat: { _id: string; count: number }) => ({
        browser: stat._id,
        views: stat.count,
      })),
      dailyViews: dailyViews.map((stat: { _id: string; views: number }) => ({
        date: stat._id,
        views: stat.views,
      })),
      topPosts: enrichedTopPosts,
    });
  } catch (error: unknown) {
    console.error("Author analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch author analytics" },
      { status: 500 }
    );
  }
}
