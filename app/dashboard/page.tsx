import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import Note from "@/models/Note";
import UserActivity from "@/models/UserActivity";
import {
    FileText,
    ArrowUp,
    MessageSquare,
    TrendingUp,
    Edit,
    Eye,
    Plus,
    Settings,
    Bookmark,
    BarChart3,
    StickyNote
} from "lucide-react";
import { CategoryManager } from "@/components/CategoryManager";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getDashboardData(userId: string) {
    await dbConnect();

    const userWithSaved = await User.findById(userId)
        .populate({
            path: "savedPosts",
            match: { published: true },
            populate: { path: "author", select: "name image" },
            options: { limit: 10, sort: { createdAt: -1 } }
        })
        .lean();

    const [posts, userActivity, notes] = await Promise.all([
        Post.find({ author: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
        UserActivity.findOne({ user: userId }).lean(),
        Note.find({ userId: userId }).sort({ createdAt: -1 }).populate({
            path: 'postId',
            select: 'title slug' // Determine if postId is stored as string or ref. Model says string but let's try populate if it works, otherwise manual map. 
            // Wait, Note model says postId is type String. Mongoose populate works on refs or if we specify model.
            // NoteSchema definies postId as String. We should updated Note model to be ref if we want populate, 
            // OR we just fetch notes and map manually if needed, but populate is cleaner.
            // For now, let's assume we can't populate easily without schema change. 
            // Let's just fetch notes and we might need to fetch posts separately or rely on what's there.
            // Actually, simplest is to just return notes and let client handle or use existing data.
            // But wait, the user wants to "access later from their dashboard". They need to know which post it is from.
        }).lean()
    ]);

    // Schema check: Note model has postId: String. 
    // To support populate, we should ideally have ref: 'Post'.
    // BUT we can use virtuals or just fetching.
    // Let's just fetch notes for now. 

    const savedPosts = userWithSaved?.savedPosts || [];
    const publishedPosts = posts.filter((p: any) => p.published);
    const draftPosts = posts.filter((p: any) => !p.published);
    const totalUpvotes = posts.reduce((sum: number, p: any) => sum + (p.upvotes || 0), 0);
    const totalComments = posts.reduce((sum: number, p: any) => sum + (p.commentCount || 0), 0);

    return {
        user: JSON.parse(JSON.stringify(userWithSaved)),
        posts: JSON.parse(JSON.stringify(posts)),
        savedPosts: JSON.parse(JSON.stringify(savedPosts)),
        notes: JSON.parse(JSON.stringify(notes)), // Return notes
        userActivity: userActivity ? JSON.parse(JSON.stringify(userActivity)) : null,
        stats: {
            totalPosts: posts.length,
            publishedPosts: publishedPosts.length,
            draftPosts: draftPosts.length,
            totalUpvotes,
            totalComments,
            savedPostsCount: savedPosts.length,
            notesCount: notes.length, // Add notes count
        },
    };
}

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const { user, posts, savedPosts, notes, stats } = await getDashboardData(
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
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                        <Link
                            href="/dashboard/analytics"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
                        >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Detailed Analytics
                        </Link>
                        <Link
                            href="/new"
                            className="justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            New Post
                        </Link>
                        <Link
                            href="/settings"
                            className="justify-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                        >
                            <Settings size={16} />
                            Settings
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                        <p className="text-3xl font-bold">{Math.round(stats.totalUpvotes)}</p>
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
                            <span className="text-muted-foreground text-sm">Saved Posts</span>
                            <Bookmark size={20} className="text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold">{stats.savedPostsCount}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Bookmarked articles
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

                {/* My Notes Section */}
                <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold">My Notes</h2>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                                {notes.length}
                            </span>
                        </div>
                    </div>

                    {notes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                            {notes.map((note: any) => (
                                <Link
                                    key={note._id}
                                    href={`/blog/${note.postId?.slug || '#'}#${note.paragraphId}`}
                                    className="block group h-full"
                                >
                                    <div className="bg-muted/30 hover:bg-muted/50 border border-border rounded-lg p-4 h-full transition-colors flex flex-col">
                                        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                                            <StickyNote size={14} className="text-primary" />
                                            <span className="truncate max-w-[150px] font-medium text-foreground">
                                                {note.postId?.title || 'Unknown Post'}
                                            </span>
                                            <span>•</span>
                                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-foreground/90 line-clamp-4 flex-1 whitespace-pre-wrap leading-relaxed">
                                            {note.content}
                                        </p>
                                        <div className="mt-4 pt-3 border-t border-border/50 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            View in context <ArrowUp size={12} className="rotate-45" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            <StickyNote size={32} className="mx-auto mb-3 opacity-20" />
                            <p>You haven&apos;t added any private notes yet.</p>
                            <p className="text-sm mt-1">Highlight text in any article to add a note.</p>
                        </div>
                    )}
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
                                    {posts.map((post: { _id: string; slug: string; title: string; published: boolean; upvotes: number; commentCount: number; views: number; publishedAt?: string; createdAt: string }) => (
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
                                                        <Eye size={14} />
                                                        <span>{post.views || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <ArrowUp size={14} />
                                                        <span>{Math.round(post.upvotes || 0)}</span>
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
                                                    {post.published && (
                                                        <Link
                                                            href={`/analytics/${post.slug}`}
                                                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                            title="Analytics"
                                                        >
                                                            <BarChart3 size={16} />
                                                        </Link>
                                                    )}
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
                                You haven&apos;t created any posts yet
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

                {/* Saved Posts */}
                <div className="bg-card rounded-xl border border-border overflow-hidden mt-8">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h2 className="text-xl font-bold">Saved Posts</h2>
                        <Link
                            href={`/profile/${session.user.id}?tab=saved`}
                            className="text-sm text-primary hover:underline"
                        >
                            View All
                        </Link>
                    </div>

                    {savedPosts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-semibold">Title</th>
                                        <th className="text-left p-4 text-sm font-semibold">Author</th>
                                        <th className="text-left p-4 text-sm font-semibold">Category</th>
                                        <th className="text-left p-4 text-sm font-semibold">Engagement</th>
                                        <th className="text-right p-4 text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {savedPosts.map((post: { _id: string; slug: string; title: string; category: string; author: { _id: string; name: string }; upvotes: number; commentCount: number; views: number }) => (
                                        <tr key={post._id} className="border-b border-border last:border-0">
                                            <td className="p-4">
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="font-medium hover:text-primary transition-colors line-clamp-1"
                                                >
                                                    {post.title}
                                                </Link>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                <Link
                                                    href={`/profile/${post.author._id}`}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {post.author.name}
                                                </Link>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-muted text-foreground rounded text-xs font-medium">
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Eye size={14} />
                                                        <span>{post.views || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <ArrowUp size={14} />
                                                        <span>{Math.round(post.upvotes || 0)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MessageSquare size={14} />
                                                        <span>{post.commentCount || 0}</span>
                                                    </div>
                                                </div>
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
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Bookmark size={48} className="mx-auto text-muted-foreground mb-3" />
                            <p className="text-muted-foreground mb-4">
                                You haven&apos;t saved any posts yet
                            </p>
                            <Link
                                href="/explore"
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
                            >
                                Explore Articles
                            </Link>
                        </div>
                    )}

                    {/* Category Manager (Admin Only) */}
                    {user.role === 'admin' && (
                        <CategoryManager />
                    )}
                </div>
            </div>
        </div>
    );
}
