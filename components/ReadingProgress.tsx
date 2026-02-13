"use client";

import { useReadingProgress } from "@/lib/hooks/useReadingProgress";

export interface ReadingProgressProps {
    slug: string;
    title: string;
    coverImage?: string;
    category: string;
    author: {
        name: string;
        image?: string;
    };
    readingTime: number;
}

export function ReadingProgress({ slug, title, coverImage, category, author, readingTime }: ReadingProgressProps) {
    const { progress } = useReadingProgress(slug, { title, coverImage, category, author, readingTime });

    return (
        <div className="fixed top-0 left-0 w-full h-1 bg-muted/30 z-50">
            <div
                className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
