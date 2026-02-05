import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { PostFeed } from "@/components/PostFeed";
import { TrendingUp, Clock, Award, ArrowRight } from "lucide-react";

async function getFeaturedPost() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts/top?limit=1`, {
      next: { revalidate: 900 }, // 15 minutes
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.posts[0] || null;
  } catch (error) {
    console.error("Failed to fetch featured post:", error);
    return null;
  }
}

async function getTrendingPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts/trending?limit=3`, {
      next: { revalidate: 1800 }, // 30 minutes
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts;
  } catch (error) {
    console.error("Failed to fetch trending posts:", error);
    return [];
  }
}

async function getLatestPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts/latest?limit=6`, {
      next: { revalidate: 300 }, // 5 minutes
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts;
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
    return [];
  }
}

async function getTopPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts/top?limit=5`, {
      next: { revalidate: 900 }, // 15 minutes
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts;
  } catch (error) {
    console.error("Failed to fetch top posts:", error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredPost, trendingPosts, latestPosts, topPosts] = await Promise.all([
    getFeaturedPost(),
    getTrendingPosts(),
    getLatestPosts(),
    getTopPosts(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Featured Post */}
      {featuredPost && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <Award size={24} className="text-primary" />
            <h2 className="text-2xl font-bold">Featured</h2>
          </div>
          <ArticleCard post={featuredPost} variant="featured" />
        </section>
      )}

      {/* Trending Section */}
      {trendingPosts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={24} className="text-primary" />
              <h2 className="text-2xl font-bold">Trending Now</h2>
            </div>
            <Link
              href="/trending"
              className="text-primary hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>
          <PostFeed posts={trendingPosts} columns={3} variant="standard" />
        </section>
      )}

      {/* Main Content Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Posts - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock size={24} className="text-primary" />
                <h2 className="text-2xl font-bold">Latest Posts</h2>
              </div>
              <Link
                href="/latest"
                className="text-primary hover:underline flex items-center gap-1"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            </div>
            {latestPosts.length > 0 ? (
              <PostFeed posts={latestPosts} columns={2} variant="standard" />
            ) : (
              <p className="text-muted-foreground">No posts yet</p>
            )}
          </div>

          {/* Top Posts Sidebar - 1/3 width */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Award size={24} className="text-primary" />
              <h2 className="text-2xl font-bold">Top Posts</h2>
            </div>
            {topPosts.length > 0 ? (
              <PostFeed posts={topPosts} layout="list" variant="compact" />
            ) : (
              <p className="text-muted-foreground text-sm">No top posts yet</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-12 text-center border border-primary/20">
          <h2 className="text-3xl font-bold mb-4">Start Your Writing Journey</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join Inkraft and share your stories with a global audience. Build your
            reputation through quality content and community engagement.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/new"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Write a Post
            </Link>
            <Link
              href="/auth/signin"
              className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
