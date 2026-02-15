"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Search, Filter, TrendingUp, Clock, Star, ArrowUp, ArrowDown, User, Award, Tag } from "lucide-react";
import { cn, getBaseUrl } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface PostType {
    _id: string;
    slug: string;
    title: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    author?: {
        name?: string;
        image?: string;
    };
    category?: string;
    readingTime?: number;
    createdAt?: string;
    publishedAt?: string;
    upvotes?: number;
    downvotes?: number;
    editorsPick?: boolean;
}

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

const popularTags = ["React", "Next.js", "AI", "Design", "Tutorial", "Career", "Web Dev", "Security"];

export function ExploreClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const locale = useLocale();

    // State from URL or defaults
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
    const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "latest");
    const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || null);
    const [showStaffPicks, setShowStaffPicks] = useState(searchParams.get("editorsPick") === "true");

    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);

    // Sync state with URL
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (selectedCategory !== "all") params.set("category", selectedCategory);
        if (selectedSort !== "latest") params.set("sort", selectedSort);
        if (selectedTag) params.set("tag", selectedTag);
        if (showStaffPicks) params.set("editorsPick", "true");

        router.replace(`/explore?${params.toString()}`, { scroll: false });
    }, [searchQuery, selectedCategory, selectedSort, selectedTag, showStaffPicks, router]);

    // Fetch posts when dependencies change
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("q", searchQuery);
            if (selectedCategory !== "all") params.append("category", selectedCategory);
            if (selectedTag) params.append("tag", selectedTag);
            params.append("sort", selectedSort);
            if (showStaffPicks) params.append("editorsPick", "true");
            if (locale) params.append("locale", locale);

            const response = await fetch(`/api/posts/search?${params.toString()}`);
            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            setPosts(data.posts || []);
            setTotalResults(data.pagination?.total || 0);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCategory, selectedSort, selectedTag, showStaffPicks, locale]);

    // Debounce fetch for search query
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPosts();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchPosts]);

    const handleVote = async (postSlug: string, direction: "up" | "down") => {
        try {
            const baseUrl = getBaseUrl();
            const voteType = direction === "up" ? "upvote" : "downvote";
            await fetch(`${baseUrl}/api/posts/${postSlug}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ voteType }),
            });
            // Optimistic update or refetch could go here if needed
            fetchPosts();
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedTag(null);
        setShowStaffPicks(false);
        setSelectedSort("latest");
    };

    return (
        <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-8 relative">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Explore
                </h1>
                <p className="text-lg text-muted-foreground">
                    Discover quality content from our community of expert writers
                </p>

                {/* Staff Picks Toggle - Absolute on desktop, relative on mobile */}
                <div className="mt-4 md:mt-0 md:absolute md:top-0 md:right-0">
                    <button
                        onClick={() => setShowStaffPicks(!showStaffPicks)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium",
                            showStaffPicks
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-card border-border hover:border-primary/50 text-muted-foreground"
                        )}
                    >
                        <Award size={18} />
                        Staff Picks
                        {showStaffPicks && <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">ON</span>}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <GlassCard className="p-4 mb-6">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title, content, category, or tag..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
            </GlassCard>

            {/* Filters */}
            <div className="mb-8 space-y-6">
                {/* Categories & Sort Row */}
                <div className="flex flex-col gap-6">
                    {/* Categories - Wrapped List */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.slug}
                                onClick={() => setSelectedCategory(category.slug)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                    selectedCategory === category.slug
                                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                                        : "bg-muted/30 border-transparent hover:bg-muted text-muted-foreground hover:text-foreground hover:border-border"
                                )}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Sort & View Options - Separated row for cleaner layout */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/40">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
                            <div className="flex p-1 bg-muted/30 rounded-lg border border-border/50">
                                <button
                                    onClick={() => setSelectedSort("latest")}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                        selectedSort === "latest"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Clock size={14} />
                                    Latest
                                </button>
                                <button
                                    onClick={() => setSelectedSort("trending")}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                        selectedSort === "trending"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <TrendingUp size={14} />
                                    Trending
                                </button>
                                <button
                                    onClick={() => setSelectedSort("top")}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                        selectedSort === "top"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Star size={14} />
                                    Top Rated
                                </button>
                            </div>
                        </div>

                        {/* Staff Picks Toggle - kept simplified */}
                        <button
                            onClick={() => setShowStaffPicks(!showStaffPicks)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                showStaffPicks
                                    ? "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400"
                                    : "bg-muted/30 border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Award size={16} className={showStaffPicks ? "fill-current" : ""} />
                            Staff Picks
                        </button>
                    </div>
                </div>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Tag size={14} /> Popular Tags:
                    </span>
                    {popularTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                            className={cn(
                                "text-xs px-2.5 py-1 rounded-md transition-colors border",
                                selectedTag === tag
                                    ? "bg-primary/10 text-primary border-primary"
                                    : "bg-muted/20 border-border hover:border-primary/50 text-muted-foreground"
                            )}
                        >
                            #{tag}
                        </button>
                    ))}
                    {(selectedCategory !== "all" || selectedTag || showStaffPicks || searchQuery) && (
                        <button
                            onClick={clearFilters}
                            className="text-xs text-destructive hover:underline ml-2"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground">
                        {loading ? "Searching..." : `${totalResults} ${totalResults === 1 ? "article" : "articles"} found`}
                    </p>
                </div>

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
                ) : posts.length === 0 ? (
                    <GlassCard className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <Search className="text-muted-foreground opacity-50" size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">No articles found</h3>
                                <p className="text-muted-foreground mb-4">
                                    Try adjusting your search query or filters to find what you're looking for.
                                </p>
                                <Button onClick={clearFilters} variant="outline">
                                    Clear all filters
                                </Button>
                            </div>
                        </div>
                    </GlassCard>
                ) : (
                    <div className="grid gap-4 md:gap-6">
                        <AnimatePresence mode="popLayout">
                            {posts.map((post) => (
                                <motion.div
                                    key={post._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <GlassCard className="p-4 md:p-6 hover:shadow-lg transition-all group border-border/50 hover:border-primary/20">
                                        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                            {/* Main Content */}
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/blog/${post.slug}`} className="block">
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                                                            {post.category}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Clock size={12} /> {post.readingTime} min read
                                                        </span>
                                                        {post.editorsPick && (
                                                            <span className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                                                <Award size={12} /> Staff Pick
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
                                                        {post.title}
                                                    </h2>

                                                    <p className="text-muted-foreground mb-4 line-clamp-2 md:line-clamp-3 text-sm md:text-base">
                                                        {post.excerpt}
                                                    </p>
                                                </Link>

                                                {/* Author Info */}
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            {post.author?.image ? (
                                                                <img
                                                                    src={post.author.image}
                                                                    alt={post.author.name}
                                                                    className="w-6 h-6 rounded-full object-cover ring-1 ring-border"
                                                                />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-border">
                                                                    <User size={14} className="text-primary" />
                                                                </div>
                                                            )}
                                                            <span className="font-medium text-muted-foreground">{post.author?.name || "Anonymous"}</span>
                                                        </div>
                                                        <span className="text-muted-foreground/50 hidden sm:inline">•</span>
                                                        <span className="hidden sm:inline">{new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Voting Section */}
                                            <div className="flex md:flex-col items-center gap-2 border-t md:border-t-0 md:border-l border-border/30 pt-4 md:pt-0 md:pl-6 justify-end md:justify-start">
                                                <button
                                                    onClick={() => handleVote(post.slug, "up")}
                                                    className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                                                    aria-label="Upvote"
                                                >
                                                    <ArrowUp size={20} />
                                                </button>
                                                <span className="font-bold text-lg min-w-[2ch] text-center">{Math.round((post.upvotes || 0) - (post.downvotes || 0))}</span>
                                                <button
                                                    onClick={() => handleVote(post.slug, "down")}
                                                    className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                                                    aria-label="Downvote"
                                                >
                                                    <ArrowDown size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
