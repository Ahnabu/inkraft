"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeriesPost {
    _id: string;
    title: string;
    slug: string;
}

interface SeriesNavigationProps {
    series: {
        title: string;
        slug: string;
        posts: SeriesPost[];
        currentIndex: number;
    };
    className?: string;
}

export function SeriesNavigation({ series, className }: SeriesNavigationProps) {
    const { title, slug, posts, currentIndex } = series;
    const totalParts = posts.length;
    const partNumber = currentIndex + 1;
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < totalParts - 1 ? posts[currentIndex + 1] : null;

    if (totalParts <= 1) return null;

    return (
        <div className={cn("mb-8 p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm", className)}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                    <Layers size={18} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Series</span>
                        <Link
                            href={`/series/${slug}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors truncate"
                        >
                            {title}
                        </Link>
                    </div>
                </div>
                <div className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full whitespace-nowrap">
                    Part {partNumber} of {totalParts}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {prevPost ? (
                    <Link
                        href={`/blog/${prevPost.slug}`}
                        className="group flex flex-col p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-all text-left"
                    >
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 group-hover:text-primary transition-colors">
                            <ChevronLeft size={14} />
                            <span>Previous: Part {currentIndex}</span>
                        </div>
                        <span className="text-sm font-medium line-clamp-1 group-hover:underline decoration-primary/50 underline-offset-4">
                            {prevPost.title}
                        </span>
                    </Link>
                ) : (
                    <div className="p-3 rounded-lg border border-border/30 bg-muted/20 opacity-50 cursor-not-allowed">
                        <span className="text-xs text-muted-foreground block mb-1">Previous</span>
                        <span className="text-sm font-medium text-muted-foreground">Start of Series</span>
                    </div>
                )}

                {nextPost ? (
                    <Link
                        href={`/blog/${nextPost.slug}`}
                        className="group flex flex-col items-end p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-all text-right"
                    >
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 group-hover:text-primary transition-colors">
                            <span>Next: Part {currentIndex + 2}</span>
                            <ChevronRight size={14} />
                        </div>
                        <span className="text-sm font-medium line-clamp-1 group-hover:underline decoration-primary/50 underline-offset-4">
                            {nextPost.title}
                        </span>
                    </Link>
                ) : (
                    <div className="flex flex-col items-end p-3 rounded-lg border border-border/30 bg-muted/20 opacity-50 cursor-not-allowed text-right">
                        <span className="text-xs text-muted-foreground block mb-1">Next</span>
                        <span className="text-sm font-medium text-muted-foreground">Conclusion</span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${(partNumber / totalParts) * 100}%` }}
                />
            </div>
        </div>
    );
}
