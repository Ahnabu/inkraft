import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Series from "@/models/Series";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { VoteButton } from "@/components/VoteButton";
import { Comments } from "@/components/Comments";
import { Clock, Calendar, User, Tag, Eye } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { auth } from "@/auth";
import UserModel from "@/models/User"; // Renamed to avoid conflict with lucide-react User
import FollowButton from "@/components/FollowButton";
import { SaveButton } from "@/components/SaveButton";
import { TableOfContents } from "@/components/TableOfContents";
import { getBaseUrl } from "@/lib/utils";
import { ViewTracker } from "@/components/ViewTracker";
import { BlogPostClient } from "@/components/BlogPostClient";
import { BlogContent } from "@/components/BlogContent";
import { FeedbackWidget } from "@/components/reader/FeedbackWidget";

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
    await dbConnect();
    const post = await Post.findOne({ slug, published: true })
        .populate("author", "name image bio")
        .lean();

    if (!post) return null;

    // View tracking is now handled client-side with time-window
    return JSON.parse(JSON.stringify(post));
}

// Get series context for a post (if it belongs to a series)
async function getSeriesContext(postId: string) {
    await dbConnect();

    // Find series that contains this post
    const series = await Series.findOne({ posts: postId })
        .populate("posts", "_id title slug")
        .lean();

    if (!series) return null;

    // Find current post's index in series
    const postIdStr = postId.toString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentIndex = (series.posts as any[]).findIndex(
        (p: { _id: { toString(): string } }) => p._id.toString() === postIdStr
    );

    if (currentIndex === -1) return null;

    return {
        title: series.title,
        slug: series.slug,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        posts: (series.posts as any[]).map((p: any) => ({
            _id: p._id.toString(),
            title: p.title,
            slug: p.slug
        })),
        currentIndex
    };
}

async function getRelatedPosts(category: string, currentSlug: string) {
    await dbConnect();
    const posts = await Post.find({
        category,
        slug: { $ne: currentSlug },
        published: true,
    })
        .limit(3)
        .populate("author", "name")
        .lean();

    return JSON.parse(JSON.stringify(posts));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) return { title: "Post Not Found" };

    const baseUrl = getBaseUrl();
    const wordCount = post.content?.split(/\s+/).length || 0;
    const articleUrl = `${baseUrl}/blog/${slug}`;

    return {
        title: post.seo?.title || `${post.title} | Inkraft`,
        description: post.seo?.description || post.excerpt,
        keywords: post.seo?.keywords || post.tags,
        authors: post.author?.name ? [{ name: post.author.name, url: `${baseUrl}/profile/${post.author._id}` }] : [],
        creator: post.author?.name || "Inkraft",
        publisher: "Inkraft",
        alternates: {
            canonical: articleUrl,
        },
        openGraph: {
            title: post.seo?.title || post.title,
            description: post.seo?.description || post.excerpt,
            type: "article",
            url: articleUrl,
            publishedTime: post.publishedAt || post.createdAt,
            modifiedTime: post.updatedAt,
            authors: [post.author?.name || "Anonymous"],
            tags: post.tags || [],
            section: post.category,
            images: post.coverImage ? [
                {
                    url: post.coverImage,
                    width: 1200,
                    height: 630,
                    alt: post.seo?.title || post.title,
                    type: "image/jpeg",
                }
            ] : [
                {
                    url: `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.seo?.title || post.title,
            description: post.seo?.description || post.excerpt,
            images: post.coverImage ? [post.coverImage] : [`${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`],
            creator: post.author?.name ? `@${post.author.name.replace(/\s+/g, '')}` : "@inkraft",
            site: "@inkraft",
        },
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        other: {
            "article:word_count": wordCount.toString(),
            "article:section": post.category,
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    // Check if post is saved by current user
    const session = await auth();
    let isSaved = false;
    let isFollowingAuthor = false;
    if (session?.user?.id) {
        await dbConnect();
        const user = await UserModel.findById(session.user.id).select("savedPosts following");
        if (user && user.savedPosts) {
            // Check if post ID is in savedPosts array
            isSaved = user.savedPosts.some((id: unknown) => (id as { toString(): string }).toString() === post._id);
        }
        // Check if following the author
        if (user && user.following && post.author?._id) {
            isFollowingAuthor = user.following.some((id: unknown) => (id as { toString(): string }).toString() === post.author._id);
        }
    }

    const relatedPosts = await getRelatedPosts(post.category, slug);
    const seriesContext = await getSeriesContext(post._id);
    const articleUrl = `${getBaseUrl()}/blog/${slug}`;

    // Enhanced structured data with Breadcrumbs and Article
    const wordCount = post.content?.split(/\s+/).length || 0;

    const breadcrumbStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: getBaseUrl(),
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: `${getBaseUrl()}/explore`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: post.category,
                item: `${getBaseUrl()}/category/${post.category.toLowerCase()}`,
            },
            {
                '@type': 'ListItem',
                position: 4,
                name: post.title,
                item: articleUrl,
            },
        ],
    };

    const articleStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        alternativeHeadline: post.subtitle || undefined,
        description: post.excerpt,
        image: post.coverImage ? {
            '@type': 'ImageObject',
            url: post.coverImage,
            width: 1200,
            height: 630,
        } : `${getBaseUrl()}/api/og?title=${encodeURIComponent(post.title)}`,
        datePublished: post.publishedAt || post.createdAt,
        dateModified: post.updatedAt || post.publishedAt || post.createdAt,
        author: {
            '@type': 'Person',
            name: post.author?.name || 'Anonymous',
            url: post.author?._id ? `${getBaseUrl()}/profile/${post.author._id}` : undefined,
            image: post.author?.image || undefined,
            description: post.author?.bio || undefined,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Inkraft',
            url: getBaseUrl(),
            logo: {
                '@type': 'ImageObject',
                url: `${getBaseUrl()}/icon-512.png`,
                width: 512,
                height: 512,
            },
            sameAs: [
                'https://twitter.com/inkraft',
                'https://github.com/inkraft',
            ],
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': articleUrl,
        },
        keywords: post.tags?.join(', ') || '',
        articleSection: post.category,
        articleBody: post.excerpt,
        wordCount: wordCount,
        timeRequired: `PT${post.readingTime || 5}M`,
        url: articleUrl,
        inLanguage: 'en-US',
        copyrightYear: new Date(post.publishedAt || post.createdAt).getFullYear(),
        copyrightHolder: {
            '@type': 'Organization',
            name: 'Inkraft',
        },
        commentCount: post.comments?.length || 0,
        interactionStatistic: [
            {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/ReadAction',
                userInteractionCount: post.views || 0,
            },
            {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/LikeAction',
                userInteractionCount: post.upvotes || 0,
            },
            {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/CommentAction',
                userInteractionCount: post.comments?.length || 0,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
            />
            <ReadingProgress slug={slug} />
            <ViewTracker postSlug={slug} postId={post._id.toString()} />

            <BlogPostClient>
                <div className="min-h-screen">
                    {/* Hero Section */}
                    <div className="relative navbar-hide hide-in-fullscreen">
                        {post.coverImage && (
                            <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
                            </div>
                        )}
                    </div>

                    {/* Main Layout with Left TOC Sidebar */}
                    <div className="container mx-auto px-3 sm:px-4 lg:px-8 -mt-24 sm:-mt-32 relative z-10">
                        <div className="flex gap-6 sm:gap-8 lg:gap-12">
                            {/* Left Sidebar - Table of Contents (Desktop Only) */}
                            <aside className="hidden xl:block w-64 shrink-0 hide-in-focus-mode">
                                <div className="p-8 md:p-12 mb-8">
                                    <div className="space-y-6">

                                    </div>
                                </div>
                                <div className="sticky top-24">
                                    <TableOfContents />
                                </div>
                            </aside>

                            {/* Main Content Area */}
                            <div className="flex-1 max-w-4xl mx-auto xl:mx-0 center-in-focus-mode">
                                {/* Article Header */}
                                <GlassCard className="p-4 sm:p-6 md:p-8 lg:p-12 mb-6 sm:mb-8">
                                    <div className="space-y-4 sm:space-y-6">
                                        {/* Category Badge */}
                                        <div className="flex items-center gap-2">
                                            <span className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                                                {post.category}
                                            </span>
                                            {post.difficultyLevel && (
                                                <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${post.difficultyLevel === "Beginner" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                                    post.difficultyLevel === "Intermediate" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                    }`}>
                                                    {post.difficultyLevel}
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                                            {post.title}
                                        </h1>

                                        {/* Subtitle */}
                                        {post.subtitle && (
                                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                                                {post.subtitle}
                                            </p>
                                        )}

                                        {/* Author Info + Voting - Combined */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6 pt-4 border-t border-border">
                                            {/* Author Info */}
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <Link href={`/profile/${post.author?._id}`}>
                                                    {post.author?.image ? (
                                                        <Image
                                                            src={post.author.image}
                                                            alt={post.author.name}
                                                            width={40}
                                                            height={40}
                                                            className="sm:w-12 sm:h-12 rounded-full hover:opacity-80 transition-opacity"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                                                            <User size={20} className="sm:w-6 sm:h-6 text-primary" />
                                                        </div>
                                                    )}
                                                </Link>
                                                <div>
                                                    <Link
                                                        href={`/profile/${post.author?._id}`}
                                                        className="font-semibold text-sm sm:text-base hover:text-primary transition-colors block"
                                                    >
                                                        {post.author?.name || "Anonymous"}
                                                    </Link>
                                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                                        <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                                                        <span className="text-xs sm:text-sm">
                                                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </span>
                                                        <span className="mx-1">•</span>
                                                        <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                                                        <span className="text-xs sm:text-sm">{post.readingTime} min read</span>
                                                        <span className="mx-1">•</span>
                                                        <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                                                        <span className="text-xs sm:text-sm">{post.views || 0} views</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Voting Buttons */}
                                            <div className="flex items-center gap-4">
                                                <VoteButton
                                                    postSlug={slug}
                                                    initialUpvotes={post.upvotes}
                                                    initialDownvotes={post.downvotes}
                                                    variant="inline"
                                                />
                                            </div>
                                        </div>

                                        {/* Share and Save Actions */}
                                        <div className="pt-4 flex items-center justify-between border-t border-border mt-6">
                                            <ShareButtons title={post.title} url={articleUrl} />
                                            <SaveButton
                                                postSlug={slug}
                                                initialSaved={isSaved}
                                            />
                                        </div>
                                    </div>
                                </GlassCard>

                                {/* Mobile TOC */}
                                <div className="xl:hidden mb-8">
                                    <GlassCard className="p-6">
                                        <TableOfContents />
                                    </GlassCard>
                                </div>

                                {/* Main Article Content */}
                                <article>
                                    <GlassCard className="p-4 sm:p-6 md:p-8 lg:p-12">
                                        <BlogContent content={post.content} postId={post._id.toString()} series={seriesContext || undefined} />

                                        <hr className="my-8 border-border/50" />

                                        <FeedbackWidget postId={post._id.toString()} />

                                        {/* Tags */}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="mt-12 pt-8 border-t border-border">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Tag size={18} className="text-muted-foreground" />
                                                    {post.tags.map((tag: string) => (
                                                        <Link
                                                            key={tag}
                                                            href={`/explore?tag=${tag}`}
                                                            className="px-3 py-1 bg-muted hover:bg-muted/80 text-sm rounded-full transition-colors"
                                                        >
                                                            {tag}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </GlassCard>



                                    {/* Author Bio */}
                                    {post.author?.bio && (
                                        <GlassCard className="p-6 mt-8">
                                            <div className="flex gap-4">
                                                <Link href={`/profile/${post.author._id}`}>
                                                    {post.author.image ? (
                                                        <Image
                                                            src={post.author.image}
                                                            alt={post.author.name}
                                                            width={80}
                                                            height={80}
                                                            className="rounded-full hover:opacity-80 transition-opacity"
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0 hover:bg-primary/20 transition-colors">
                                                            <User size={32} className="text-primary" />
                                                        </div>
                                                    )}
                                                </Link>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between gap-4 mb-2">
                                                        <h3 className="text-xl font-bold">
                                                            About{" "}
                                                            <Link
                                                                href={`/profile/${post.author._id}`}
                                                                className="hover:text-primary transition-colors"
                                                            >
                                                                {post.author.name}
                                                            </Link>
                                                        </h3>
                                                        {session?.user?.id !== post.author._id && (
                                                            <FollowButton
                                                                targetUserId={post.author._id}
                                                                isFollowing={isFollowingAuthor}
                                                            />
                                                        )}
                                                    </div>
                                                    <p className="text-muted-foreground">{post.author.bio}</p>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    )}

                                    {/* Related Articles */}
                                    {relatedPosts.length > 0 && (
                                        <div className="mt-12 hide-in-focus-mode">
                                            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                {relatedPosts.map((related: { _id: string; slug: string; title: string; excerpt: string; readingTime: number }) => (
                                                    <Link key={related._id} href={`/blog/${related.slug}`}>
                                                        <GlassCard className="p-4 hover:shadow-lg transition-all h-full">
                                                            <h3 className="font-semibold mb-2 line-clamp-2">
                                                                {related.title}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {related.excerpt}
                                                            </p>
                                                            <div className="mt-3 text-xs text-muted-foreground">
                                                                {related.readingTime} min read
                                                            </div>
                                                        </GlassCard>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </article>

                                {/* Comments Section */}
                                <div className="hide-in-focus-mode">
                                    <Comments postSlug={slug} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BlogPostClient>
        </>
    );
}
