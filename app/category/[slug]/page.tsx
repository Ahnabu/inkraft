import { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from "@/models/User"; // Import User model for populate
import { getCategoryBySlug, DEFAULT_CATEGORIES } from "@/lib/categories";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { generateSEO, generateBreadcrumbSchema } from "@/lib/seo";
import { getBaseUrl } from "@/lib/utils";

interface PageProps {
    params: { slug: string };
}

import { getLocale } from "next-intl/server";

// ... imports

async function getCategoryPosts(category: string, locale?: string) {
    await dbConnect();
    const query: any = { category, published: true };
    if (locale) query.locale = locale;

    const posts = await Post.find(query)
        .sort({ publishedAt: -1 })
        .limit(12)
        .populate("author", "name image")
        .lean();

    return JSON.parse(JSON.stringify(posts));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const categoryConfig = getCategoryBySlug(params.slug);

    if (!categoryConfig) {
        return { title: "Category Not Found" };
    }

    const baseUrl = getBaseUrl();
    const categoryUrl = `${baseUrl}/category/${params.slug}`;

    return generateSEO({
        title: `${categoryConfig.name} Articles - Expert Content & Tutorials | Inkraft`,
        description: `${categoryConfig.description} Discover in-depth articles, tutorials, and expert insights on ${categoryConfig.name}.`,
        keywords: [
            categoryConfig.name,
            `${categoryConfig.name} blog`,
            `${categoryConfig.name} articles`,
            `${categoryConfig.name} tutorials`,
            `learn ${categoryConfig.name}`,
            ...categoryConfig.slug.split("-"),
        ],
        url: categoryUrl,
        type: "website",
    });
}

export async function generateStaticParams() {
    return DEFAULT_CATEGORIES.map((cat) => ({
        slug: cat.slug,
    }));
}

export default async function CategoryPage({ params }: PageProps) {
    const categoryConfig = getCategoryBySlug(params.slug);

    if (!categoryConfig) {
        notFound();
    }

    const locale = await getLocale();
    const posts = await getCategoryPosts(params.slug, locale);
    const featuredPost = posts[0];
    const recentPosts = posts.slice(1);

    // Breadcrumb structured data
    const baseUrl = getBaseUrl();
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "Home", url: baseUrl },
        { name: "Categories", url: `${baseUrl}/explore` },
        { name: categoryConfig.name, url: `${baseUrl}/category/${params.slug}` },
    ]);

    // Collection page structured data
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${categoryConfig.name} Articles`,
        description: categoryConfig.description,
        url: `${baseUrl}/category/${params.slug}`,
        about: {
            "@type": "Thing",
            name: categoryConfig.name,
            description: categoryConfig.description,
        },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: posts.length,
            itemListElement: posts.slice(0, 10).map((post: { title: string; slug: string }, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${baseUrl}/blog/${post.slug}`,
                name: post.title,
            })),
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <div className="space-y-12">
                {/* Category Header */}
                <header className="text-center space-y-4 pb-8 border-b border-border/40">
                    <div
                        className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white"
                        style={{ backgroundColor: categoryConfig.color }}
                    >
                        {categoryConfig.name}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {categoryConfig.name} Articles
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                        {categoryConfig.description}
                    </p>
                </header>

                {/* Featured Post */}
                {featuredPost && (
                    <section>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Featured</h2>
                        </div>
                        <Link href={`/blog/${featuredPost.slug}`}>
                            <GlassCard className="group relative overflow-hidden min-h-[350px] flex flex-col justify-end p-8 md:p-10 hover:shadow-2xl transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                                <div className="absolute inset-0 bg-zinc-900 z-0">
                                    {featuredPost.coverImage && (
                                        <img src={featuredPost.coverImage} alt={featuredPost.title} className="w-full h-full object-cover opacity-60" />
                                    )}
                                </div>

                                <div className="relative z-20 max-w-2xl space-y-3">
                                    <h3 className="text-3xl md:text-4xl font-bold text-white group-hover:text-cta transition-colors">
                                        {featuredPost.title}
                                    </h3>
                                    {featuredPost.excerpt && (
                                        <p className="text-gray-300 line-clamp-2">
                                            {featuredPost.excerpt}
                                        </p>
                                    )}
                                </div>
                            </GlassCard>
                        </Link>
                    </section>
                )}

                {/* Recent Posts */}
                <section>
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Recent Articles</h2>
                    </div>

                    {recentPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentPosts.map((post: { _id: string; slug: string; title: string; excerpt: string; coverImage?: string; author: { name: string; image?: string }; readingTime: number; publishedAt: string; category: string; createdAt?: string }) => (
                                <Link key={post._id} href={`/blog/${post.slug}`} className="group">
                                    <GlassCard className="h-full flex flex-col justify-between hover:border-primary/50 transition-colors">
                                        <div className="space-y-3">
                                            {post.coverImage && (
                                                <div className="w-full aspect-[2/1] bg-muted rounded-lg overflow-hidden">
                                                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                            )}
                                            <h4 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h4>
                                            {post.excerpt && (
                                                <p className="text-muted-foreground text-sm line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{new Date(post.publishedAt || post.createdAt || 0).toLocaleDateString()}</span>
                                            <span>{post.readingTime || 5} min read</span>
                                        </div>
                                    </GlassCard>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No articles in this category yet. Be the first to write one!</p>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
