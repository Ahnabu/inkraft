import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PostAnalytics from "@/models/PostAnalytics";
import Post from "@/models/Post";
import { auth } from "@/auth";
import { getClientIP, hashIP, getLocationFromIP, parseUserAgent, parseReferrer } from "@/lib/analytics";

// POST /api/posts/[slug]/analytics - Track view with location and device info
export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await context.params;

    // Get post
    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get request data
    const body = await request.json();
    const { sessionId, timeOnPage, scrollDepth } = body;

    // Extract client information
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);
    const location = getLocationFromIP(clientIP);
    const userAgent = request.headers.get("user-agent") || "";
    const deviceInfo = parseUserAgent(userAgent);
    const referrerInfo = parseReferrer(request.headers.get("referer"));

    // Create or update analytics entry
    const analytics = await PostAnalytics.create({
      postId: post._id,
      postSlug: slug,
      ipHash,
      ...location,
      ...deviceInfo,
      ...referrerInfo,
      sessionId,
      timeOnPage: timeOnPage || 0,
      scrollDepth: scrollDepth || 0,
    });

    return NextResponse.json({ success: true, id: analytics._id });
  } catch (error: unknown) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track analytics" },
      { status: 500 }
    );
  }
}

// GET /api/posts/[slug]/analytics - Get analytics for a specific post (author/admin only)
export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await context.params;

    // Get post
    const post = await Post.findOne({ slug }).populate("author");
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user is author or admin
    const isAuthor = post.author._id.toString() === session.user.id;
    // @ts-expect-error - role property extended in custom type
    const isAdmin = session.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get time range from query params
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch analytics data
    const [
      totalViews,
      uniqueVisitors,
      countryStats,
      deviceStats,
      browserStats,
      dailyViews,
      topReferrers,
      avgEngagement,
    ] = await Promise.all([
      // Total views
      PostAnalytics.countDocuments({
        postSlug: slug,
        viewedAt: { $gte: startDate },
      }),

      // Unique visitors (by IP hash)
      PostAnalytics.distinct("ipHash", {
        postSlug: slug,
        viewedAt: { $gte: startDate },
      }).then((ips) => ips.length),

      // Views by country
      PostAnalytics.aggregate([
        { $match: { postSlug: slug, viewedAt: { $gte: startDate } } },
        { $group: { _id: "$country", count: { $sum: 1 }, countryCode: { $first: "$countryCode" } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Views by device
      PostAnalytics.aggregate([
        { $match: { postSlug: slug, viewedAt: { $gte: startDate } } },
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Views by browser
      PostAnalytics.aggregate([
        { $match: { postSlug: slug, viewedAt: { $gte: startDate } } },
        { $group: { _id: "$browser", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      // Daily views
      PostAnalytics.aggregate([
        { $match: { postSlug: slug, viewedAt: { $gte: startDate } } },
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

      // Top referrers
      PostAnalytics.aggregate([
        { $match: { postSlug: slug, viewedAt: { $gte: startDate }, referrerDomain: { $ne: "direct" } } },
        { $group: { _id: "$referrerDomain", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      // Average engagement
      PostAnalytics.aggregate([
        { $match: { postSlug: slug, viewedAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            avgTimeOnPage: { $avg: "$timeOnPage" },
            avgScrollDepth: { $avg: "$scrollDepth" },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      summary: {
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
      topReferrers: topReferrers.map((stat: { _id: string; count: number }) => ({
        referrer: stat._id,
        views: stat.count,
      })),
    });
  } catch (error: unknown) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
