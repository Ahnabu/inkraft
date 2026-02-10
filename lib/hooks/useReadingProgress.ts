"use client";

import { useState, useEffect } from "react";

export function useReadingProgress(slug: string) {
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
