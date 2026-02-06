import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import UserActivity from "@/models/UserActivity";
import {
    FileText,
    ArrowUp,
    MessageSquare,
    TrendingUp,
    Edit,
    Eye,
    Plus,
    Settings
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getDashboardData(userId: string) {
    await dbConnect();

    const [user, posts, userActivity] = await Promise.all([
        User.findById(userId).lean(),
        Post.find({ author: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
        UserActivity.findOne({ user: userId }).lean(),
    ]);

    // Calculate stats
    const publishedPosts = posts.filter((p) => p.published);
    const draftPosts = posts.filter((p) => !p.published);
    const totalUpvotes = posts.reduce((sum: number, p: any) => sum + (p.upvotes || 0), 0);
    const totalComments = posts.reduce((sum: number, p: any) => sum + (p.commentCount || 0), 0);

    return {
        user: JSON.parse(JSON.stringify(user)),
        posts: JSON.parse(JSON.stringify(posts)),
        userActivity: userActivity ? JSON.parse(JSON.stringify(userActivity)) : null,
        stats: {
            totalPosts: posts.length,
            publishedPosts: publishedPosts.length,
            draftPosts: draftPosts.length,
            totalUpvotes,
            totalComments,
        },
    };
}

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const { user, posts, userActivity, stats } = await getDashboardData(
        session.user.id
    );

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Welcome back, {user.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Link
                            href="/new"
                            className="flex-1 md:flex-none justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            New Post
                        </Link>
                        <Link
                            href="/settings"
                            className="flex-1 md:flex-none justify-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                        >
                            <Settings size={16} />
                            Settings
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-muted-foreground text-sm">Total Posts</span>
                            <FileText size={20} className="text-primary" />
                        </div>
                        <p className="text-3xl font-bold">{stats.totalPosts}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.publishedPosts} published, {stats.draftPosts} drafts
                        </p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-muted-foreground text-sm">Total Upvotes</span>
                            <ArrowUp size={20} className="text-green-500" />
                        </div>
                        <p className="text-3xl font-bold">{stats.totalUpvotes}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Across all posts
                        </p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-muted-foreground text-sm">Comments</span>
                            <MessageSquare size={20} className="text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold">{stats.totalComments}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total discussions
                        </p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-muted-foreground text-sm">Trust Score</span>
                            <TrendingUp size={20} className="text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold">
                            {user.trustScore ? user.trustScore.toFixed(1) : "1.0"}x
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Vote weight multiplier
                        </p>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-bold">Recent Posts</h2>
                    </div>

                    {posts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-semibold">Title</th>
                                        <th className="text-left p-4 text-sm font-semibold">Status</th>
                                        <th className="text-left p-4 text-sm font-semibold">Engagement</th>
                                        <th className="text-left p-4 text-sm font-semibold">Date</th>
                                        <th className="text-right p-4 text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((post: any) => (
                                        <tr key={post._id} className="border-b border-border last:border-0">
                                            <td className="p-4">
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="font-medium hover:text-primary transition-colors line-clamp-1"
                                                >
                                                    {post.title}
                                                </Link>
                                            </td>
                                            <td className="p-4">
                                                {post.published ? (
                                                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-medium">
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs font-medium">
                                                        Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <ArrowUp size={14} />
                                                        <span>{post.upvotes || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MessageSquare size={14} />
                                                        <span>{post.commentCount || 0}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link
                                                        href={`/edit/${post.slug}`}
                                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <FileText size={48} className="mx-auto text-muted-foreground mb-3" />
                            <p className="text-muted-foreground mb-4">
                                You haven't created any posts yet
                            </p>
                            <Link
                                href="/new"
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
                            >
                                Create Your First Post
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
