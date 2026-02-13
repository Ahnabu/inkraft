import { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import dbConnect from "@/lib/mongodb";
import Digest, { IDigest } from "@/models/Digest";
import Post from "@/models/Post";
import { ArticleCard } from "@/components/ArticleCard";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const slug = (await params).slug;
    await dbConnect();
    const digest = await Digest.findOne({ slug, published: true }).select("title description");

    if (!digest) return { title: "Digest Not Found" };

    return {
        title: `${digest.title} - Inkraft Weekly Digest`,
        description: digest.description || `Inkraft Weekly Digest: ${digest.title}`,
    };
}

async function getDigest(slug: string) {
    await dbConnect();
    const digest = await Digest.findOne({ slug, published: true })
        .populate({
            path: "posts",
            select: "title slug excerpt coverImage publishedAt readingTime difficultyLevel author category",
            populate: { path: "author", select: "name image" }
        })
        .populate({
            path: "editorPicks",
            select: "title slug excerpt coverImage publishedAt readingTime difficultyLevel author category",
            populate: { path: "author", select: "name image" }
        })
        .lean();

    if (!digest) return null;
    return JSON.parse(JSON.stringify(digest));
}

export default async function SingleDigestPage({ params }: PageProps) {
    const slug = (await params).slug;
    const digest = await getDigest(slug);

    if (!digest) {
        notFound();
    }

    // Filter out editor picks from the main list to avoid duplication if desired, 
    // or just show them in a special section.
    // Let's show Editor Picks at the top, and then "More from this week" below.
    // We can filter `digest.posts` to exclude `digest.editorPicks` if they overlap.
    const editorPickIds = new Set(digest.editorPicks.map((p: any) => p._id));
    const regularPosts = digest.posts.filter((p: any) => !editorPickIds.has(p._id));

    // If posts are manually ordered in `posts`, we might want to respect that.
    // Assuming `digest.posts` contains ALL posts including editor picks, or just the regular ones?
    // The model definition says `posts` and `editorPicks`. 
    // Usually editor picks are a subset of posts. 
    // Let's assume editor picks are special and displayed first.

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 pt-32">
                <Link href="/digest">
                    <Button variant="ghost" size="sm" className="mb-8">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Digests
                    </Button>
                </Link>

                <header className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Star className="h-4 w-4 fill-primary" />
                        Weekly Digest
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        {digest.title}
                    </h1>
                    {digest.description && (
                        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                            {digest.description}
                        </p>
                    )}
                    <div className="text-sm text-muted-foreground">
                        Published on {format(new Date(digest.publishedAt), "MMMM d, yyyy")}
                    </div>
                </header>

                {/* Editor's Picks Section */}
                {digest.editorPicks.length > 0 && (
                    <section className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-bold">Editor&apos;s Picks</h2>
                            <div className="h-px bg-border flex-1" />
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {digest.editorPicks.map((post: any) => (
                                <ArticleCard key={post._id} post={post} />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Posts Section */}
                {regularPosts.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-bold">This Week&apos;s Stories</h2>
                            <div className="h-px bg-border flex-1" />
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {regularPosts.map((post: any) => (
                                <ArticleCard key={post._id} post={post} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
