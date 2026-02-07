import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore Tech Articles | Inkraft Blog",
    description: "Browse and discover high-quality tech articles on Inkraft. Filter by category, sort by trending, latest, or top-rated. Explore AI, Programming, Cybersecurity, and Web Development content.",
    keywords: [
        "explore inkraft",
        "tech articles",
        "browse blog posts",
        "AI articles",
        "programming tutorials",
        "cybersecurity content",
        "web development",
        "trending tech articles"
    ],
    openGraph: {
        title: "Explore Tech Articles - Inkraft",
        description: "Discover quality tech content on AI, Programming & Web Development",
        type: "website",
        url: "/explore",
    },
    alternates: {
        canonical: "/explore",
    },
};

export default function ExploreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
