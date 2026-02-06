"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Search, Filter, TrendingUp, Clock, Star, ArrowUp, ArrowDown, User } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
    { name: "All", slug: "all" },
    { name: "Technology", slug: "technology" },
    { name: "AI & Future", slug: "ai-future" },
    { name: "Programming", slug: "programming" },
    { name: "Cybersecurity", slug: "cybersecurity" },
    { name: "Product & Startups", slug: "product-startups" },
    { name: "Guides", slug: "guides" },
    { name: "Case Studies", slug: "case-studies" },
    { name: "Opinions", slug: "opinions" },
];

const sortOptions = [
    { name: "Latest", value: "latest", icon: Clock },
    { name: "Trending", value: "trending", icon: TrendingUp },
    { name: "Top Rated", value: "top", icon: Star },
];

export default function ExplorePage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSort, setSelectedSort] = useState("latest");
    const [searchQuery, setSearchQuery] = useState("");
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory, selectedSort]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let url = `/api/posts/${selectedSort}`;
            const params = new URLSearchParams();

            if (selectedCategory !== "all") {
                params.append("category", selectedCategory);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                console.error("Failed to fetch posts:", response.statusText);
                setPosts([]);
                return;
            }

            const data = await response.json();
            // API returns { posts: [...], pagination: {...} }
            setPosts(Array.isArray(data.posts) ? data.posts : []);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        // Search is handled by filteredPosts
        console.log("Searching for:", searchQuery);
    };

    const handleVote = async (postSlug: string, direction: "up" | "down") => {
        try {
            const voteType = direction === "up" ? "upvote" : "downvote";
            const response = await fetch(`/api/posts/${postSlug}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ voteType }),
            });

            if (response.ok) {
                // Refresh posts to get updated vote counts
                fetchPosts();
            }
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const filteredPosts = posts.filter(post => {
        if (searchQuery === "") return true;

        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title?.toLowerCase().includes(query);
        const matchesExcerpt = post.excerpt?.toLowerCase().includes(query);
        const matchesContent = post.content?.toLowerCase().includes(query);
        const matchesAuthor = post.author?.name?.toLowerCase().includes(query);

        return matchesTitle || matchesExcerpt || matchesContent || matchesAuthor;
    });

    return (
        <main className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore</h1>
                    <p className="text-lg text-muted-foreground">
                        Discover quality content from our community of expert writers
                    </p>
                </div>

                {/* Search Bar */}
                <GlassCard className="p-4 mb-6">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="text"
                                placeholder="Search by title, content, or author name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="px-6 rounded-lg bg-primary hover:bg-primary/90"
                        >
                            Search
                        </Button>
                    </div>
                </GlassCard>

                {/* Filters */}
                <div className="mb-8 space-y-6">
                    {/* Category Filter */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Filter size={18} className="text-muted-foreground" />
                            <h3 className="font-semibold">Categories</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.slug}
                                    onClick={() => setSelectedCategory(category.slug)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                        selectedCategory === category.slug
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <h3 className="font-semibold mb-3">Sort By</h3>
                        <div className="flex flex-wrap gap-2">
                            {sortOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setSelectedSort(option.value)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                            selectedSort === option.value
                                                ? "bg-primary/10 text-primary border-2 border-primary"
                                                : "bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border-2 border-transparent"
                                        )}
                                    >
                                        <Icon size={16} />
                                        {option.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div>
                    <p className="text-sm text-muted-foreground mb-4">
                        {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} found
                    </p>

                    {loading ? (
                        <div className="grid gap-6">
                            {[1, 2, 3].map((i) => (
                                <GlassCard key={i} className="p-6 animate-pulse">
                                    <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                    <div className="h-4 bg-muted rounded w-2/3"></div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <GlassCard className="p-12 text-center">
                            <p className="text-muted-foreground">No articles found. Try adjusting your filters or search query.</p>
                        </GlassCard>
                    ) : (
                        <div className="grid gap-6">
                            {filteredPosts.map((post) => (
                                <GlassCard key={post._id} className="p-6 hover:shadow-lg transition-all group">
                                    <div className="flex gap-6">
                                        {/* Main Content */}
                                        <div className="flex-1">
                                            <Link href={`/blog/${post.slug}`}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                                        {post.category}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {post.readingTime} min read
                                                    </span>
                                                </div>
                                                <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                    {post.title}
                                                </h2>
                                                <p className="text-muted-foreground mb-4 line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                            </Link>

                                            {/* Author Info */}
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    {post.author?.image ? (
                                                        <img
                                                            src={post.author.image}
                                                            alt={post.author.name}
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User size={14} className="text-primary" />
                                                        </div>
                                                    )}
                                                    <span className="font-medium">{post.author?.name || "Anonymous"}</span>
                                                </div>
                                                <span>•</span>
                                                <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* Voting Section */}
                                        <div className="flex flex-col items-center gap-2 min-w-[60px]">
                                            <button
                                                onClick={() => handleVote(post.slug, "up")}
                                                className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                                                aria-label="Upvote"
                                            >
                                                <ArrowUp size={20} />
                                            </button>
                                            <span className="font-bold text-lg">{Math.round((post.upvotes || 0) - (post.downvotes || 0))}</span>
                                            <button
                                                onClick={() => handleVote(post.slug, "down")}
                                                className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                aria-label="Downvote"
                                            >
                                                <ArrowDown size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
