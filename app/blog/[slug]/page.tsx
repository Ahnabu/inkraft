import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { VoteButton } from "@/components/VoteButton";
import { Comments } from "@/components/Comments";
import { Clock, Calendar, User, Tag, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { auth } from "@/auth";
import UserModel from "@/models/User"; // Renamed to avoid conflict with lucide-react User
import { SaveButton } from "@/components/SaveButton";
import { TableOfContents } from "@/components/TableOfContents";
import { getBaseUrl } from "@/lib/utils";

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

    return {
        title: post.seo?.title || post.title,
        description: post.seo?.description || post.excerpt,
        keywords: post.seo?.keywords || post.tags,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            authors: [post.author?.name],
            images: post.coverImage ? [post.coverImage] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: post.coverImage ? [post.coverImage] : [],
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
    if (session?.user?.id) {
        await dbConnect();
        const user = await UserModel.findById(session.user.id).select("savedPosts");
        if (user && user.savedPosts) {
            // Check if post ID is in savedPosts array
            isSaved = user.savedPosts.some((id: unknown) => (id as { toString(): string }).toString() === post._id);
        }
    }

    const relatedPosts = await getRelatedPosts(post.category, slug);
    const articleUrl = `${getBaseUrl()}/blog/${slug}`;

    return (
        <>
            <ReadingProgress />

            <div className="min-h-screen">
                {/* Hero Section */}
                <div className="relative">
                    {post.coverImage && (
                        <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                        </div>
                    )}
                </div>

                {/* Article Container */}
                <div className="container mx-auto px-4 -mt-32 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        {/* Article Header */}
                        <GlassCard className="p-8 md:p-12 mb-8">
                            <div className="space-y-6">
                                {/* Category Badge */}
                                <div className="flex items-center gap-2">
                                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                                        {post.category}
                                    </span>
                                    {post.difficultyLevel && (
                                        <span className="px-4 py-1.5 bg-muted text-muted-foreground text-sm font-medium rounded-full">
                                            {post.difficultyLevel}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                    {post.title}
                                </h1>

                                {/* Subtitle */}
                                {post.subtitle && (
                                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                                        {post.subtitle}
                                    </p>
                                )}

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border">
                                    {/* Author */}
                                    <div className="flex items-center gap-3">
                                        <Link href={`/profile/${post.author?._id}`}>
                                            {post.author?.image ? (
                                                <Image
                                                    src={post.author.image}
                                                    alt={post.author.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full hover:opacity-80 transition-opacity"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                                                    <User size={24} className="text-primary" />
                                                </div>
                                            )}
                                        </Link>
                                        <div>
                                            <Link
                                                href={`/profile/${post.author?._id}`}
                                                className="font-semibold hover:text-primary transition-colors block"
                                            >
                                                {post.author?.name || "Anonymous"}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">Author</p>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar size={18} />
                                        <span className="text-sm">
                                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    {/* Reading Time */}
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock size={18} />
                                        <span className="text-sm">{post.readingTime} min read</span>
                                    </div>

                                    {/* Views */}
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <TrendingUp size={18} />
                                        <span className="text-sm">{post.views || 0} views</span>
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

                        {/* Main Content Grid */}
                        <div className="grid lg:grid-cols-[1fr_80px] gap-8">
                            {/* Article Content */}
                            <article className="min-w-0">
                                <GlassCard className="p-8 md:p-12">
                                    <div
                                        className="prose prose-lg dark:prose-invert max-w-none
                                        prose-headings:font-bold prose-headings:tracking-tight
                                        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                                        prose-p:text-lg prose-p:leading-relaxed prose-p:text-foreground/90
                                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                        prose-strong:text-foreground prose-strong:font-semibold
                                        prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                                        prose-pre:bg-muted prose-pre:border prose-pre:border-border
                                        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1
                                        prose-img:rounded-lg prose-img:shadow-lg
                                        prose-hr:border-border
                                        prose-ul:text-foreground/90 prose-ol:text-foreground/90
                                        first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:mr-2 first-letter:float-left first-letter:leading-none"
                                        dangerouslySetInnerHTML={{
                                            __html: post.content
                                        }}
                                    />

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
                                                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors">
                                                        <User size={32} className="text-primary" />
                                                    </div>
                                                )}
                                            </Link>
                                            <div>
                                                <h3 className="text-xl font-bold mb-2">
                                                    About{" "}
                                                    <Link
                                                        href={`/profile/${post.author._id}`}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {post.author.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-muted-foreground">{post.author.bio}</p>
                                            </div>
                                        </div>
                                    </GlassCard>
                                )}

                                {/* Related Articles */}
                                {relatedPosts.length > 0 && (
                                    <div className="mt-12">
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

                            {/* Sticky Voting Sidebar */}
                            <aside className="hidden lg:block">
                                <div className="sticky top-24">
                                    <VoteButton
                                        postSlug={slug}
                                        initialUpvotes={post.upvotes}
                                        initialDownvotes={post.downvotes}
                                        variant="stacked"
                                    />

                                    <div className="mt-8 pt-8 border-t border-border">
                                        <TableOfContents />
                                    </div>
                                </div>
                            </aside>
                        </div>

                        {/* Comments Section */}
                        <Comments postSlug={slug} />

                        {/* Mobile Voting (Bottom) */}
                        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 z-40">
                            <div className="container mx-auto flex justify-center">
                                <VoteButton
                                    postSlug={slug}
                                    initialUpvotes={post.upvotes}
                                    initialDownvotes={post.downvotes}
                                    variant="inline"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
