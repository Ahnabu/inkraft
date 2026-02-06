import { Suspense } from "react";
import { PostFeed } from "@/components/PostFeed";
import { getBaseUrl } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Latest Posts",
    description: "Read the latest articles from our community.",
};

async function getLatestPosts() {
    try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/posts/latest?limit=50`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        return data.posts;
    } catch (error) {
        console.error("Error fetching latest posts:", error);
        return [];
    }
}

export default async function LatestPage() {
    const posts = await getLatestPosts();

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <Clock className="text-primary" size={32} />
                <h1 className="text-3xl font-bold">Latest Posts</h1>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                {posts.length > 0 ? (
                    <PostFeed posts={posts} columns={3} />
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        No posts found. check back later!
                    </div>
                )}
            </Suspense>
        </main>
    );
}
