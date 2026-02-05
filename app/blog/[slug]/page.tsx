import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Metadata } from "next";

interface PageProps {
    params: { slug: string };
}

async function getPost(slug: string) {
    await dbConnect();
    const post = await Post.findOne({ slug, published: true }).populate("author", "name image bio").lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const post = await getPost(params.slug);
    if (!post) return { title: "Post Not Found" };

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            authors: [post.author?.name],
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <header className="space-y-6 text-center">
                <div className="space-y-4">
                    {post.categories && post.categories.length > 0 && (
                        <div className="flex justify-center gap-2">
                            {post.categories.map((cat: string) => (
                                <span key={cat} className="text-xs font-semibold tracking-wider uppercase text-primary bg-primary/10 px-2 py-1 rounded-sm">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {post.excerpt}
                    </p>
                </div>

                <div className="flex items-center justify-center gap-4 pt-4 border-t border-border/40 w-max mx-auto px-8">
                    <div className="text-left">
                        <p className="text-sm font-medium">{post.author?.name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </header>

            {/* Cover Image */}
            {post.coverImage && (
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                    <img src={post.coverImage} alt={post.title} className="object-cover w-full h-full" />
                </div>
            )}

            {/* Content */}
            <div
                className="prose prose-lg dark:prose-invert max-w-none pt-8 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </article>
    );
}
