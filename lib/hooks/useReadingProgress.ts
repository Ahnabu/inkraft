"use client";

import { useState, useEffect } from "react";

export function useReadingProgress(slug: string, meta?: { title: string; coverImage?: string; category: string; author: { name: string; image?: string }; readingTime: number }) {
    const [readingProgress, setReadingProgress] = useState(0);
    const [hasRestored, setHasRestored] = useState(false);

    useEffect(() => {
        if (!slug) return;

        // Restore scroll position
        const saved = localStorage.getItem(`reading_progress_${slug}`);
        if (saved && !hasRestored) {
            const percentage = parseFloat(saved);
            if (percentage > 0) {
                // Small delay to allow content to load
                setTimeout(() => {
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const targetScroll = (percentage / 100) * docHeight;
                    if (targetScroll > 0) {
                        window.scrollTo({ top: targetScroll, behavior: "smooth" });
                        // Show a toast or indicator? Maybe later.
                    }
                }, 500);
                setHasRestored(true);
            }
        }

        // Debounce save function
        let timeoutId: NodeJS.Timeout;

        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setReadingProgress(scrollPercent);

            // Save to local storage after pause
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (scrollPercent > 0) {
                    localStorage.setItem(`reading_progress_${slug}`, scrollPercent.toString());

                    // Save to history if meta is provided
                    if (meta) {
                        const historyItem = {
                            slug,
                            ...meta,
                            viewedAt: new Date().toISOString(),
                            progress: Math.round(scrollPercent),
                        };

                        try {
                            const historyJson = localStorage.getItem("reading_history");
                            const history = historyJson ? JSON.parse(historyJson) : [];

                            // Remove existing entry for this slug to avoid duplicates and update position
                            const filteredHistory = history.filter((item: any) => item.slug !== slug);

                            // Add to top, limit to 50 items
                            const newHistory = [historyItem, ...filteredHistory].slice(0, 50);

                            localStorage.setItem("reading_history", JSON.stringify(newHistory));
                        } catch (e) {
                            console.error("Failed to save reading history", e);
                        }
                    }
                }
            }, 500);
        };

        window.addEventListener("scroll", updateProgress);
        updateProgress(); // Initial

        return () => {
            window.removeEventListener("scroll", updateProgress);
            clearTimeout(timeoutId);
        };
    }, [slug, hasRestored]);

    return readingProgress;
}
