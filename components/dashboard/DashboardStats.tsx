
import {
    FileText,
    ArrowUp,
    MessageSquare,
    TrendingUp,
    Bookmark,
} from "lucide-react";

interface DashboardStatsProps {
    user: any;
    stats: {
        totalPosts: number;
        publishedPosts: number;
        draftPosts: number;
        totalUpvotes: number;
        totalComments: number;
        savedPostsCount: number;
    };
}

export function DashboardStats({ user, stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm font-medium">Total Posts</span>
                    <FileText size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold">{stats.totalPosts}</p>
                <p className="text-xs text-muted-foreground mt-1">
                    {stats.publishedPosts} published, {stats.draftPosts} drafts
                </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm font-medium">Total Upvotes</span>
                    <ArrowUp size={20} className="text-green-500" />
                </div>
                <p className="text-3xl font-bold">{Math.round(stats.totalUpvotes)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Across all posts
                </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm font-medium">Comments</span>
                    <MessageSquare size={20} className="text-blue-500" />
                </div>
                <p className="text-3xl font-bold">{stats.totalComments}</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Total discussions
                </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm font-medium">Saved Posts</span>
                    <Bookmark size={20} className="text-purple-500" />
                </div>
                <p className="text-3xl font-bold">{stats.savedPostsCount}</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Bookmarked articles
                </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm font-medium">Trust Score</span>
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
    );
}
