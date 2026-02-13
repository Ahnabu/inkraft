import { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Digest from "@/models/Digest";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { getBaseUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getBaseUrl();

    // Static pages with appropriate priorities
    const staticRoutes = [
        { route: "", priority: 1.0, changeFrequency: "daily" as const },
        { route: "/about", priority: 0.8, changeFrequency: "monthly" as const },
        { route: "/explore", priority: 0.9, changeFrequency: "daily" as const },
        { route: "/latest", priority: 0.9, changeFrequency: "daily" as const },
        { route: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
        { route: "/terms", priority: 0.5, changeFrequency: "yearly" as const },
        { route: "/privacy", priority: 0.5, changeFrequency: "yearly" as const },
    ].map(({ route, priority, changeFrequency }) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }));

    // Category pages
    const categoryRoutes = DEFAULT_CATEGORIES.map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    // Dynamic blog posts
    await dbConnect();
    const posts = await Post.find({ published: true })
        .select("slug updatedAt publishedAt")
        .sort({ publishedAt: -1 })
        .lean();

    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency: "weekly" as const,
        priority: 1.0,
    }));

    // Dynamic digests
    const digests = await Digest.find({ published: true })
        .select("slug updatedAt publishedAt")
        .sort({ publishedAt: -1 })
        .lean();

    const digestRoutes = digests.map((digest) => ({
        url: `${baseUrl}/digest/${digest.slug}`,
        lastModified: new Date(digest.updatedAt || digest.publishedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // Add main digest page to static routes if not there, or appended here
    const digestIndex = {
        url: `${baseUrl}/digest`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    };

    return [...staticRoutes, ...categoryRoutes, ...blogRoutes, digestIndex, ...digestRoutes];
}
