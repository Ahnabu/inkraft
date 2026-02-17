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
import { ArrowLeft, Star, Calendar, Share2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShareButtons } from "@/components/ShareButtons";
import { getBaseUrl } from "@/lib/utils";

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

    const editorPickIds = new Set(digest.editorPicks.map((p: any) => p._id));
    const regularPosts = digest.posts.filter((p: any) => !editorPickIds.has(p._id));
    const digestUrl = `${getBaseUrl()}/digest/${slug}`;

    return (
        <main className="min-h-screen bg-background pb-20 relative transition-colors duration-300">
            <Navbar />

            {/* Ambient Background Gradient - Theme Aware */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-sky-500/10 dark:bg-sky-500/20 rounded-full blur-3xl opacity-20 -translate-x-1/2" />
            </div>

            <div className="container mx-auto px-4 pt-32 relative z-10">
                <Link href="/digest">
                    <Button variant="ghost" size="sm" className="mb-8 hover:bg-muted/50">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Digests
                    </Button>
                </Link>

                <header className="max-w-4xl mx-auto mb-16">
                    {/* Replaced GlassCard with standard semantic card classes for robust theming */}
                    <div className="rounded-3xl border border-border bg-card text-card-foreground p-8 md:p-12 shadow-sm relative overflow-hidden">
                        {/* Subtle inner gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                                <Star className="h-4 w-4 fill-primary" />
                                Weekly Digest
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-foreground">
                                {digest.title}
                            </h1>

                            {digest.description && (
                                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                                    {digest.description}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground border-t border-border/50 pt-6 w-full">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{format(new Date(digest.publishedAt), "MMMM d, yyyy")}</span>
                                </div>
                                <div className="hidden sm:block w-1 h-1 bg-muted-foreground/30 rounded-full" />
                                <div>
                                    {digest.posts.length + (digest.editorPicks?.length || 0)} Stories
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto space-y-20">
                    {/* Editor's Picks Section */}
                    {digest.editorPicks.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                                    <Star className="h-6 w-6 fill-current" />
                                </div>
                                <h2 className="text-3xl font-bold text-foreground">Editor&apos;s Picks</h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {digest.editorPicks.map((post: any) => (
                                    <ArticleCard key={post._id} post={post} variant="standard" />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* All Posts Section */}
                    {regularPosts.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-2xl font-bold text-foreground">This Week&apos;s Stories</h2>
                                <div className="h-px bg-border flex-1" />
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {regularPosts.map((post: any) => (
                                    <ArticleCard key={post._id} post={post} variant="standard" />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Footer / Share */}
                    <section className="pt-12 border-t border-border mt-20 text-center">
                        <h3 className="text-lg font-semibold mb-6 text-foreground">Share this Digest</h3>
                        <div className="flex justify-center">
                            <ShareButtons title={digest.title} url={digestUrl} />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
