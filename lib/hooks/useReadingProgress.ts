"use client";

import { useState, useEffect } from "react";

export function useReadingProgress(slug: string, meta?: { title: string; coverImage?: string; category: string; author: { name: string; image?: string }; readingTime: number }) {
    const [readingProgress, setReadingProgress] = useState(0);
    const [savedProgress, setSavedProgress] = useState<number | null>(null);

    // Function to manually resume reading at saved position
    const resumeScroll = () => {
        if (savedProgress && savedProgress > 0) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const targetScroll = (savedProgress / 100) * docHeight;
            if (targetScroll > 0) {
                window.scrollTo({ top: targetScroll, behavior: "smooth" });
            }
        }
    };

    useEffect(() => {
        if (!slug) return;

        // Check for saved progress but DON'T auto-scroll
        const saved = localStorage.getItem(`reading_progress_${slug}`);
        if (saved) {
            const percentage = parseFloat(saved);
            setSavedProgress(percentage);
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
    }, [slug]);

    return { progress: readingProgress, savedProgress, resumeScroll };
}
