import dbConnect from "@/lib/mongodb";
import Series from "@/models/Series";
import Post from "@/models/Post";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from "@/models/User";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { getBaseUrl } from "@/lib/utils";
import { BookOpen, ChevronRight, Clock, User as UserIcon } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getSeries(slug: string) {
    await dbConnect();
    const series = await Series.findOne({ slug })
        .populate("author", "name image")
        .populate({
            path: "posts",
            match: { published: true },
            select: "title slug excerpt readingTime publishedAt",
            options: { sort: { createdAt: 1 } }
        })
        .lean();

    return series;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const series = await getSeries(slug);

    if (!series) {
        return { title: "Series Not Found" };
    }

    const baseUrl = getBaseUrl();
    return generateSEO({
        title: `${series.title} | Series | Inkraft`,
        description: series.description,
        url: `${baseUrl}/series/${slug}`,
        type: "website",
        image: series.coverImage || `${baseUrl}/api/og?title=${encodeURIComponent(series.title)}`,
    });
}

export default async function SeriesPage({ params }: PageProps) {
    const { slug } = await params;
    const series = await getSeries(slug);

    if (!series) {
        notFound();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const author = series.author as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posts = (series.posts || []) as any[];
    const totalReadingTime = posts.reduce((acc, post) => acc + (post.readingTime || 0), 0);

    // Generate JSON-LD for ItemList schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: series.title,
        description: series.description,
        numberOfItems: posts.length,
        itemListElement: posts.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${getBaseUrl()}/blog/${post.slug}`,
            name: post.title,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <BookOpen size={20} />
                        <span className="text-sm font-medium uppercase tracking-wide">Series</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">{series.title}</h1>
                    <p className="text-muted-foreground text-lg mb-6">{series.description}</p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <UserIcon size={16} />
                            <span>{author?.name || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} />
                            <span>{posts.length} {posts.length === 1 ? "Part" : "Parts"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{totalReadingTime} min total</span>
                        </div>
                    </div>
                </div>

                {/* Posts list */}
                <div className="space-y-4">
                    {posts.map((post, index) => (
                        <Link
                            key={post._id?.toString() || index}
                            href={`/blog/${post.slug}`}
                            className="block group"
                        >
                            <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
                                {/* Part number */}
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                                    {index + 1}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                        {post.title}
                                    </h2>
                                    {post.excerpt && (
                                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                        <span>{post.readingTime || 5} min read</span>
                                        {post.publishedAt && (
                                            <span>
                                                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow */}
                                <ChevronRight
                                    size={20}
                                    className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
                                />
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No published posts in this series yet.
                    </div>
                )}
            </div>
        </>
    );
}
