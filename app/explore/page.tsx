import { Suspense } from "react";
import { Metadata } from "next";
import { ExploreClient } from "@/components/explore/ExploreClient";

export const metadata: Metadata = {
    title: "Explore | Inkraft Editorial Content",
    description: "Discover high-quality articles on AI, Programming, and Technology from expert writers. Browse curated editorial content and trending discussions.",
    keywords: [
        "discover blog articles",
        "browse editorial content",
        "explore blog categories",
        "trending blog posts",
        "top editorial articles",
        "curated blog content"
    ],
    openGraph: {
        title: "Explore Inkraft - Discover Expert Content",
        description: "Browse trending and featured articles from our community of writers.",
        type: "website",
        url: "/explore",
    },
    alternates: {
        canonical: "/explore",
    },
};

export default function ExplorePage() {
    return (
        <main className="min-h-screen py-8 relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] pointer-events-none" />
            <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Loading explore...</div>}>
                <ExploreClient />
            </Suspense>
        </main>
    );
}
