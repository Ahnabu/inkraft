import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";

async function getPosts() {
  await dbConnect();
  // Fetch published posts, sort by latest
  const posts = await Post.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("author", "name image")
    .lean();

  // Serialize for client component use if needed, though this is RSC
  return JSON.parse(JSON.stringify(posts));
}

export default async function Home() {
  const posts = await getPosts();
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium animate-fade-in-up">
          <Sparkles size={14} />
          <span>Welcome to ModernBlog</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Discover a new way <br /> to read and write.
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
          A premium space for specific thoughts, stories, and ideas.
          Built with modern web technologies for the best reading experience.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/explore">
            <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20">
              Start Reading
            </Button>
          </Link>
          <Link href="/new">
            <Button variant="outline" size="lg" className="rounded-full px-8 backdrop-blur-sm">
              Write a Story
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Featured</h2>
          </div>
          <Link href={`/blog/${featuredPost.slug}`}>
            <GlassCard className="group relative overflow-hidden min-h-[400px] flex flex-col justify-end p-8 md:p-12 hover:shadow-2xl transition-all duration-500">
              {/* Background Image Abstract */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
              <div className="absolute inset-0 bg-zinc-900 group-hover:scale-105 transition-transform duration-700 z-0">
                {/* Placeholder for cover image if available */}
                {featuredPost.coverImage && (
                  <img src={featuredPost.coverImage} alt={featuredPost.title} className="w-full h-full object-cover opacity-60" />
                )}
              </div>

              <div className="relative z-20 max-w-2xl space-y-4">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{featuredPost.author?.name || "Unknown Author"}</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-white group-hover:text-cta transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-lg text-gray-300 line-clamp-2">
                  {featuredPost.excerpt || "No excerpt available."}
                </p>
              </div>
            </GlassCard>
          </Link>
        </section>
      )}

      {/* Recent Posts - Bento Grid style */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recent Stories</h2>
          <Link href="/explore" className="text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.length > 0 ? (
            recentPosts.map((post: any, i: number) => (
              <Link key={post._id} href={`/blog/${post.slug}`} className={`group ${i === 3 || i === 6 ? "md:col-span-2" : ""}`}>
                <GlassCard className="h-full flex flex-col justify-between hover:border-primary/50 transition-colors">
                  <div className="space-y-4">
                    <div className="w-full aspect-[2/1] bg-muted rounded-lg overflow-hidden relative">
                      {/* Image placeholder */}
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">
                        {post.excerpt || stripHtml(post.content).slice(0, 100) + "..."}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>{post.author?.name}</span>
                  </div>
                </GlassCard>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No recent stories found. Be the first to write one!
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 md:p-16 text-center">
        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Stay curious.</h2>
          <p className="text-primary-foreground/80">
            Discover stories, thinking, and expertise from writers on any topic.
            Subscribe to our newsletter.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input type="email" placeholder="email@example.com" className="bg-white/10 border-white/20 text-white placeholder:text-white/60 flex-1 rounded-full px-4 py-2 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50" />
            <Button variant="secondary" className="rounded-full">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}
