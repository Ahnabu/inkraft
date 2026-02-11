import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { PostFeed } from "@/components/PostFeed";
import { TrendingUp, Clock, Award, ArrowRight, Sparkles } from "lucide-react";
import { FeedTabs } from "@/components/feed/FeedTabs";
import { auth } from "@/auth";
import { Metadata } from "next";

import { fetchLatestPosts, fetchTopPosts, fetchTrendingPosts, fetchPersonalizedFeed, fetchFollowedPosts } from "@/lib/data/posts";

export const metadata: Metadata = {
  title: "Inkraft | Premium Tech Blog - AI, Programming & Web Development",
  description: "Discover expert articles on Artificial Intelligence, Programming, Cybersecurity, Web Development, and more. Join Inkraft's community of tech enthusiasts and quality writers.",
  keywords: ["inkraft", "tech blog", "AI articles", "programming tutorials", "web development", "cybersecurity", "technology news"],
  openGraph: {
    title: "Inkraft - Premium Tech Blog Platform",
    description: "Expert content on AI, Programming, Cybersecurity & Web Development",
    type: "website",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 900; // Revalidate page every 15 minutes

async function getFeaturedPost() {
  try {
    const posts = await fetchTopPosts(1);
    return posts[0] || null;
  } catch (error) {
    console.error("Failed to fetch featured post:", error);
    return null;
  }
}

async function getTrendingPosts() {
  try {
    return await fetchTrendingPosts(3);
  } catch (error) {
    console.error("Failed to fetch trending posts:", error);
    return [];
  }
}

async function getLatestPosts() {
  try {
    return await fetchLatestPosts(6);
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
    return [];
  }
}

async function getTopPosts() {
  try {
    // Fetch top 5, but we might overlap with featured, so maybe fetch more?
    // Using simple logic for now matching previous API
    return await fetchTopPosts(5);
  } catch (error) {
    console.error("Failed to fetch top posts:", error);
    return [];
  }
}

export default async function HomePage(props: { searchParams?: Promise<{ feed?: string }> }) {
  const session = await auth();
  const [featuredPost, trendingPosts, latestPosts, topPosts] = await Promise.all([
    getFeaturedPost(),
    getTrendingPosts(),
    getLatestPosts(),
    getTopPosts(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchParams = (await props.searchParams) as any;
  const feedType = searchParams?.feed || (session?.user?.id ? "foryou" : "latest");

  // Get main feed posts based on selected feed type
  let mainPosts = latestPosts;
  if (session?.user?.id) {
    if (feedType === "foryou") {
      mainPosts = await fetchPersonalizedFeed(session.user.id);
    } else if (feedType === "following") {
      mainPosts = await fetchFollowedPosts(session.user.id);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Featured Post */}
      {featuredPost && (
        <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Award size={20} className="text-primary sm:w-6 sm:h-6" />
            <h2 className="text-xl sm:text-2xl font-bold">Featured</h2>
          </div>
          <ArticleCard post={featuredPost} variant="featured" />
        </section>
      )}

      {/* Trending Section */}
      {trendingPosts.length > 0 && (
        <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-primary sm:w-6 sm:h-6" />
              <h2 className="text-xl sm:text-2xl font-bold">Trending Now</h2>
            </div>
            <Link
              href="/trending"
              className="text-primary hover:underline flex items-center gap-1 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">View all</span>
              <span className="sm:hidden">All</span>
              <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </Link>
          </div>
          <PostFeed posts={trendingPosts} columns={3} variant="standard" />
        </section>
      )}

      {/* Main Content Grid */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Feed - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <FeedTabs isLoggedIn={!!session?.user?.id} />
              <Link
                href="/latest"
                className="text-primary hover:underline flex items-center gap-1 text-sm sm:text-base hidden sm:flex"
              >
                <span className="hidden sm:inline">View all</span>
                <span className="sm:hidden">All</span>
                <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </Link>
            </div>

            {mainPosts.length > 0 ? (
              <PostFeed posts={mainPosts} columns={2} variant="standard" />
            ) : (
              <div className="py-12 text-center border rounded-xl bg-card">
                <p className="text-muted-foreground mb-4">
                  {feedType === 'following'
                    ? "You aren't following anyone yet, or they haven't posted recently."
                    : feedType === 'foryou'
                      ? "Follow some authors or categories to get personalized recommendations!"
                      : "No posts yet"}
                </p>
                {(feedType === 'following' || feedType === 'foryou') && (
                  <Link href="/authors" className="text-primary hover:underline">
                    Discover Authors
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Top Posts Sidebar - 1/3 width */}
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Award size={20} className="text-primary sm:w-6 sm:h-6" />
              <h2 className="text-xl sm:text-2xl font-bold">Top Posts</h2>
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
      <section className="container mx-auto px-3 sm:px-4 py-10 sm:py-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-primary/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center border border-primary/30 shadow-2xl">
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Start Your Writing Journey
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-base md:text-lg">
            Join Inkraft and share your stories with a global audience. Build your
            reputation through quality content and community engagement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/new"
              className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-100"
            >
              Write a Post
            </Link>
            {!session && (
              <Link
                href="/auth/signin"
                className="px-8 py-3.5 bg-background/50 backdrop-blur-sm border border-border rounded-xl font-semibold hover:bg-muted/80 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
