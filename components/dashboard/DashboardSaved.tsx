
import Link from "next/link";
import {
    Eye,
    ArrowUp,
    MessageSquare,
    Bookmark
} from "lucide-react";

interface DashboardSavedProps {
    savedPosts: any[];
    userId: string;
}

export function DashboardSaved({ savedPosts, userId }: DashboardSavedProps) {
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold">Saved Posts</h2>
                <Link
                    href={`/profile/${userId}?tab=saved`}
                    className="text-sm text-primary hover:underline font-medium"
                >
                    View All
                </Link>
            </div>

            {savedPosts.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold whitespace-nowrap">Title</th>
                                <th className="text-left p-4 text-sm font-semibold whitespace-nowrap">Author</th>
                                <th className="text-left p-4 text-sm font-semibold whitespace-nowrap">Category</th>
                                <th className="text-left p-4 text-sm font-semibold whitespace-nowrap">Engagement</th>
                                <th className="text-right p-4 text-sm font-semibold whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savedPosts.map((post: any) => (
                                <tr key={post._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                    <td className="p-4">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="font-medium hover:text-primary transition-colors line-clamp-1 min-w-[200px]"
                                        >
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                        <Link
                                            href={`/profile/${post.author?._id}`}
                                            className="hover:text-primary transition-colors flex items-center gap-2"
                                        >
                                            {post.author?.name || 'Unknown'}
                                        </Link>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 bg-muted text-foreground rounded-full text-xs font-medium border border-border">
                                            {post.category || 'General'}
                                        </span>
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
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors"
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
                    <Bookmark size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                    <p className="text-muted-foreground mb-4 font-medium">
                        You haven&apos;t saved any posts yet
                    </p>
                    <Link
                        href="/explore"
                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                    >
                        Explore Articles
                    </Link>
                </div>
            )}
        </div>
    );
}
