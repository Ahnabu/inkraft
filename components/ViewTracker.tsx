"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
    postSlug: string;
}

export function ViewTracker({ postSlug }: ViewTrackerProps) {
    useEffect(() => {
        const trackView = async () => {
            // Check if user has viewed this post recently (within 30 minutes)
            const viewKey = `view_${postSlug}`;
            const lastViewTime = localStorage.getItem(viewKey);
            const now = Date.now();
            const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

            // If no previous view or more than 30 minutes have passed
            if (!lastViewTime || now - parseInt(lastViewTime) > thirtyMinutes) {
                try {
                    // Increment view count
                    await fetch(`/api/posts/${postSlug}/view`, {
                        method: "POST",
                    });

                    // Store current timestamp
                    localStorage.setItem(viewKey, now.toString());
                } catch (error) {
                    console.error("Error tracking view:", error);
                }
            }
        };

        trackView();
    }, [postSlug]);

    return null; // This component doesn't render anything
}
