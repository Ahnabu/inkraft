"use client";

import { useEffect, useRef, useState } from "react";

interface ViewTrackerProps {
    postSlug: string;
    postId: string;
}

import { useSession } from "next-auth/react";

export function ViewTracker({ postSlug, postId }: ViewTrackerProps) {
    const { data: session } = useSession();
    const [sessionId] = useState(() => {
        // Get or create sessionId
        if (typeof window !== "undefined") {
            let sid = sessionStorage.getItem("session_id");
            if (!sid) {
                sid = crypto.randomUUID();
                sessionStorage.setItem("session_id", sid);
            }
            return sid;
        }
        return crypto.randomUUID();
    });

    const startTimeRef = useRef(Date.now());
    const maxScrollRef = useRef(0);
    const viewTrackedRef = useRef(false);
    const analyticsTrackedRef = useRef(false);

    useEffect(() => {
        const trackView = async () => {
            if (viewTrackedRef.current) return;

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
                    viewTrackedRef.current = true;
                } catch (error) {
                    console.error("Error tracking view:", error);
                }
            } else {
                viewTrackedRef.current = true;
            }
        };

        // Immediate history sync (post onboarding)
        const syncHistoryImmediately = () => {
            if (session?.user?.id && !viewTrackedRef.current) {
                const historyData = JSON.stringify({
                    postId,
                    progress: 0,
                    completed: false
                });

                fetch("/api/user/history", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: historyData
                }).catch(err => console.error("Error syncing initial history:", err));
            }
        };

        // Call immediate sync
        syncHistoryImmediately();

        // Track scroll depth
        const trackScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollPercentage = Math.round(
                ((scrollTop + windowHeight) / documentHeight) * 100
            );
            maxScrollRef.current = Math.max(maxScrollRef.current, scrollPercentage);
        };

        // Send analytics data when user leaves or after some time
        const sendAnalytics = async () => {
            if (analyticsTrackedRef.current) return;
            analyticsTrackedRef.current = true;

            const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000); // in seconds
            const scrollDepth = Math.min(maxScrollRef.current, 100);

            // Calculate exit position
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const currentScroll = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
            const exitScrollDepth = Math.min(currentScroll, 100);

            try {
                await fetch(`/api/posts/${postSlug}/analytics`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId,
                        timeOnPage,
                        scrollDepth,
                        reachedEnd: scrollDepth > 85, // Considered "read" if > 85%
                        exitScrollDepth,
                    }),
                });
            } catch (error) {
                console.error("Error tracking analytics:", error);
            }

            // Sync reading history if logged in (using session from hook)
            if (session?.user) {
                const historyData = JSON.stringify({
                    postId,
                    progress: scrollDepth,
                    completed: scrollDepth > 85
                });

                // Use sendBeacon for reliable delivery on unload if available
                if (navigator.sendBeacon) {
                    const blob = new Blob([historyData], { type: 'application/json' });
                    navigator.sendBeacon("/api/user/history", blob);
                } else {
                    // Fallback
                    fetch("/api/user/history", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: historyData
                    }).catch(err => console.error("Error syncing history:", err));
                }
            }
        };

        // Initial view tracking
        trackView();

        // Add scroll listener
        window.addEventListener("scroll", trackScroll);
        trackScroll(); // Initial scroll position

        // Send analytics on page unload
        window.addEventListener("beforeunload", sendAnalytics);

        // Also send analytics after 30 seconds if still on page
        const analyticsTimer = setTimeout(() => {
            sendAnalytics();
        }, 30000);

        return () => {
            window.removeEventListener("scroll", trackScroll);
            window.removeEventListener("beforeunload", sendAnalytics);
            clearTimeout(analyticsTimer);
            // Send final analytics if not already sent
            if (!analyticsTrackedRef.current) {
                sendAnalytics();
            }
        };
    }, [postSlug, sessionId]);

    return null; // This component doesn't render anything
}
