"use client";

import { ArticleCard } from "./ArticleCard";
import { Loader2 } from "lucide-react";

interface Post {
    _id: string;
    slug: string;
    title: string;
    subtitle?: string;
    excerpt: string;
    coverImage?: string;
    category: string;
    author: {
        _id: string;
        name: string;
        image?: string;
    };
    readingTime: number;
    upvotes?: number;
    commentCount?: number;
    publishedAt?: string;
}

interface PostFeedProps {
    posts: Post[];
    layout?: "grid" | "list";
    variant?: "featured" | "standard" | "compact";
    loading?: boolean;
    emptyMessage?: string;
    columns?: 2 | 3 | 4;
}

export function PostFeed({
    posts,
    layout = "grid",
    variant = "standard",
    loading = false,
    emptyMessage = "No posts found",
    columns = 3,
}: PostFeedProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin" size={32} />
                <span className="ml-3 text-muted-foreground">Loading posts...</span>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">{emptyMessage}</p>
            </div>
        );
    }

    if (layout === "list" || variant === "compact") {
        return (
            <div className="space-y-3">
                {posts.map((post) => (
                    <ArticleCard key={post._id} post={post} variant="compact" />
                ))}
            </div>
        );
    }

    // Grid layout
    const gridCols = {
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div className={`grid ${gridCols[columns]} gap-4 sm:gap-6`}>
            {posts.map((post) => (
                <ArticleCard key={post._id} post={post} variant={variant} />
            ))}
        </div>
    );
}

// Loading skeleton
export function PostFeedSkeleton({ columns = 3 }: { columns?: 2 | 3 | 4 }) {
    const gridCols = {
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div className={`grid ${gridCols[columns]} gap-6`}>
            {[...Array(columns * 2)].map((_, i) => (
                <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-border bg-card"
                >
                    <div className="relative w-full h-48 bg-muted animate-pulse" />
                    <div className="p-5 space-y-3">
                        <div className="h-6 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                        <div className="flex justify-between items-center pt-2">
                            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                            <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
