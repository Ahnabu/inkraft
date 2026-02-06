import { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

import { getBaseUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getBaseUrl();

    // Static pages
    const routes = ["", "/about", "/explore", "/new"].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
    }));

    // Dynamic blog posts
    await dbConnect();
    const posts = await Post.find({ published: true }).select("slug updatedAt").lean();

    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 1,
    }));

    return [...routes, ...blogRoutes];
}
