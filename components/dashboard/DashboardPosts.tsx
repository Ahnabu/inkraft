
import Link from "next/link";
import {
    FileText,
    ArrowUp,
    MessageSquare,
    Eye,
    Edit,
    BarChart3
} from "lucide-react";

interface DashboardPostsProps {
    posts: any[];
}

export function DashboardPosts({ posts }: DashboardPostsProps) {
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold">Recent Posts</h2>
            </div>

            {posts.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold whitespace-nowrap">Title</th>
                                <th className="text-left p-4 text-sm font-semibold whitespace-nowrap">Status</th>
                                <th className="text-left p-4 text-sm font-semibold whitespace-nowrap">Engagement</th>
                                <th className="text-left p-4 text-sm font-semibold whitespace-nowrap">Date</th>
                                <th className="text-right p-4 text-sm font-semibold whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post: any) => (
                                <tr key={post._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                    <td className="p-4">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="font-medium hover:text-primary transition-colors line-clamp-1 min-w-[200px]"
                                        >
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td className="p-4">
                                        {post.published ? (
                                            <span className="px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium border border-green-500/20">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-medium border border-yellow-500/20">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5" title="Views">
                                                <Eye size={14} />
                                                <span>{post.views || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5" title="Upvotes">
                                                <ArrowUp size={14} />
                                                <span>{Math.round(post.upvotes || 0)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5" title="Comments">
                                                <MessageSquare size={14} />
                                                <span>{post.commentCount || 0}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            {post.published && (
                                                <Link
                                                    href={`/analytics/${post.slug}`}
                                                    className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors"
                                                    title="Analytics"
                                                >
                                                    <BarChart3 size={16} />
                                                </Link>
                                            )}
                                            <Link
                                                href={`/edit/${post.slug}`}
                                                className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors"
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
                    <FileText size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                    <p className="text-muted-foreground mb-4 font-medium">
                        You haven&apos;t created any posts yet
                    </p>
                    <Link
                        href="/new"
                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                    >
                        Create Your First Post
                    </Link>
                </div>
            )}
        </div>
    );
}
