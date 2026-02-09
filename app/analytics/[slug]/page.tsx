import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import { PostAnalyticsDashboard } from "@/components/PostAnalyticsDashboard";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostAnalyticsPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { slug } = await params;

  await dbConnect();
  const post = await Post.findOne({ slug }).populate("author", "name");

  if (!post) {
    notFound();
  }

  // Check if user is author or admin
  const isAuthor = post.author._id.toString() === session.user.id;
  const isAdmin = session.user.role === "admin";

  if (!isAuthor && !isAdmin) {
    redirect("/");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/blog/${slug}`}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-primary mb-1">
            <BarChart3 size={20} />
            <span className="text-sm font-medium">Post Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">{post.title}</h1>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <PostAnalyticsDashboard slug={slug} />

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/blog/${slug}`}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            View Post
          </Link>
          <Link
            href={`/edit/${slug}`}
            className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors"
          >
            Edit Post
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
