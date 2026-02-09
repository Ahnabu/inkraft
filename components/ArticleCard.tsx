"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MessageSquare, ArrowUp, User, Eye, Flame, Award, TrendingUp, Info } from "lucide-react";

interface ArticleCardProps {
    post: {
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
        views?: number;
        publishedAt?: string;
        editorsPick?: boolean;
        rankingDetails?: {
            type: string;
            score: number;
            formula?: string;
            factors?: Record<string, number>;
        };
    };
    variant?: "featured" | "standard" | "compact";
}

export function ArticleCard({ post, variant = "standard" }: ArticleCardProps) {
    if (variant === "featured") {
        return (
            <Link
                href={`/blog/${post.slug}`}
                className="block group overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300"
            >
                {/* Cover Image */}
                {post.coverImage && (
                    <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-2">
                            <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-full">
                                {post.category}
                            </span>
                            {post.editorsPick && (
                                <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-amber-500 text-white text-xs sm:text-sm font-semibold rounded-full flex items-center gap-1">
                                    <Award size={14} />
                                    Editor's Pick
                                </span>
                            )}
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 line-clamp-2">
                                {post.title}
                            </h2>
                            {post.subtitle && (
                                <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-3 sm:mb-4 line-clamp-2">
                                    {post.subtitle}
                                </p>
                            )}

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    {post.author.image ? (
                                        <Image
                                            src={post.author.image}
                                            alt={post.author.name}
                                            width={24}
                                            height={24}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <User size={24} className="rounded-full bg-muted p-1" />
                                    )}
                                    <span>{post.author.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={16} />
                                    <span>{post.readingTime} min read</span>
                                </div>
                                {(post.views || 0) > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Eye size={16} />
                                        <span>{post.views}</span>
                                    </div>
                                )}
                                {(post.upvotes || 0) > 0 && (
                                    <div className="flex items-center gap-1">
                                        <ArrowUp size={16} />
                                        <span>{Math.round(post.upvotes || 0)}</span>
                                    </div>
                                )}
                                {(post.commentCount || 0) > 0 && (
                                    <div className="flex items-center gap-1">
                                        <MessageSquare size={16} />
                                        <span>{post.commentCount}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Link>
        );
    }

    if (variant === "compact") {
        return (
            <Link
                href={`/blog/${post.slug}`}
                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors group"
            >
                {/* Thumbnail */}
                {post.coverImage && (
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-muted text-foreground text-xs font-medium rounded">
                            {post.category}
                        </span>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg line-clamp-2 sm:line-clamp-1 group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {post.editorsPick && (
                            <span className="text-amber-500 flex items-center gap-1" title="Editor's Pick">
                                <Award size={12} />
                            </span>
                        )}
                        {post.rankingDetails?.type === 'trending' && (
                            <span className="text-rose-500 flex items-center gap-1" title={`Trending Score: ${post.rankingDetails.score}`}>
                                <TrendingUp size={12} />
                            </span>
                        )}
                        <span className="truncate max-w-[100px]">{post.author.name}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{post.readingTime} min</span>
                        {(post.views || 0) > 0 && (
                            <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Eye size={12} />
                                    <span>{post.views}</span>
                                </div>
                            </>
                        )}
                        {(post.upvotes || 0) > 0 && (
                            <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <ArrowUp size={12} />
                                    <span>{Math.round(post.upvotes || 0)}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

    // Standard variant
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="block overflow-hidden rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300 group"
        >
            {/* Cover Image */}
            {post.coverImage && (
                <div className="relative w-full h-40 sm:h-48 overflow-hidden">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                            {post.category}
                        </span>
                        {post.editorsPick && (
                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                <Award size={12} />
                                <span className="hidden sm:inline">Pick</span>
                            </span>
                        )}
                        {post.rankingDetails?.type === 'trending' && (
                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-rose-500 text-white text-xs font-semibold rounded-full flex items-center gap-1"
                                title={`Score: ${post.rankingDetails.score} (${post.rankingDetails.formula})`}>
                                <Flame size={12} />
                                <span className="hidden sm:inline">Trending</span>
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="p-4 sm:p-5">
                <h3 className="font-bold text-lg sm:text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3 sm:mb-4">
                    {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        {post.author.image ? (
                            <Image
                                src={post.author.image}
                                alt={post.author.name}
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                        ) : (
                            <User size={20} className="rounded-full bg-muted p-1" />
                        )}
                        <span className="text-muted-foreground">{post.author.name}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                        <div className="hidden sm:flex items-center gap-1">
                            <Clock size={14} />
                            <span>{post.readingTime} min</span>
                        </div>
                        {(post.views || 0) > 0 && (
                            <div className="flex items-center gap-1">
                                <Eye size={14} />
                                <span>{post.views}</span>
                            </div>
                        )}
                        {(post.upvotes || 0) > 0 && (
                            <div className="flex items-center gap-1">
                                <ArrowUp size={14} />
                                <span>{Math.round(post.upvotes || 0)}</span>
                            </div>
                        )}
                        {(post.commentCount || 0) > 0 && (
                            <div className="flex items-center gap-1">
                                <MessageSquare size={14} />
                                <span>{post.commentCount}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
