"use client";

import { useState, useEffect } from "react";
import { Shield, Users, FileText, MessageSquare, Search, Loader2, Ban, Check, Trash2, Eye, EyeOff, Bell, AlertTriangle, XCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import Link from "next/link";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "author" | "reader";
    banned: boolean;
    trustScore?: number;
    totalUpvotes?: number;
    commentCount?: number;
    createdAt: string;
}

interface Post {
    _id: string;
    title: string;
    slug: string;
    author?: {
        name: string;
        email: string;
    };
    category: string;
    published: boolean;
    views?: number;
    upvotes?: number;
    commentCount?: number;
    createdAt: string;
}

interface Comment {
    _id: string;
    content: string;
    author?: {
        name: string;
        email: string;
    };
    post?: {
        title: string;
        slug: string;
    };
    moderationStatus?: string;
    createdAt: string;
}

interface Stats {
    userCount: number;
    postCount: number;
    pendingComments: number;
}

interface Alert {
    _id: string;
    type: "vote_spike" | "spam_velocity" | "low_trust_engagement" | "repeated_reports" | "suspicious_activity";
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    description: string;
    targetUser?: {
        _id: string;
        name: string;
        email: string;
        trustScore: number;
    };
    targetPost?: {
        _id: string;
        title: string;
        slug: string;
    };
    resolved: boolean;
    resolvedBy?: {
        name: string;
    };
    action?: string;
    createdAt: string;
}

export default function AdminDashboardClient({ initialStats }: { initialStats: Stats }) {
    const [activeTab, setActiveTab] = useState<"users" | "posts" | "comments" | "alerts">("users");
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [publishedFilter, setPublishedFilter] = useState("");
    const [stats] = useState(initialStats);

    useEffect(() => {
        if (activeTab === "users") {
            fetchUsers();
        } else if (activeTab === "posts") {
            fetchPosts();
        } else if (activeTab === "comments") {
            fetchComments();
        } else if (activeTab === "alerts") {
            fetchAlerts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, searchTerm, roleFilter, publishedFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);
            if (roleFilter) params.append("role", roleFilter);

            const response = await fetch(`/api/admin/users?${params}`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);
            if (publishedFilter) params.append("published", publishedFilter);

            const response = await fetch(`/api/admin/posts?${params}`);
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/comments");
            if (response.ok) {
                const data = await response.json();
                setComments(data.comments);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Failed to fetch comments");
        } finally {
            setLoading(false);
        }
    };

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/alerts?resolved=false");
            if (response.ok) {
                const data = await response.json();
                setAlerts(data.alerts);
            }
        } catch (error) {
            console.error("Error fetching alerts:", error);
            toast.error("Failed to fetch alerts");
        } finally {
            setLoading(false);
        }
    };

    const handleUserAction = async (userId: string, action: "ban" | "unban" | "delete" | "role", value?: string) => {
        const loadingId = `user-${action}-${userId}`;
        toast.loading(`Processing...`, { id: loadingId });

        try {
            if (action === "delete") {
                if (!confirm("Are you sure you want to delete this user and all their content?")) {
                    toast.dismiss(loadingId);
                    return;
                }

                const response = await fetch(`/api/admin/users/${userId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    setUsers(users.filter(u => u._id !== userId));
                    toast.success("User deleted successfully", { id: loadingId });
                } else {
                    throw new Error("Failed to delete user");
                }
            } else {
                const updates: Record<string, unknown> = {};
                if (action === "ban") updates.banned = true;
                if (action === "unban") updates.banned = false;
                if (action === "role" && value) updates.role = value;

                const response = await fetch(`/api/admin/users/${userId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updates),
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    setUsers(users.map(u => u._id === userId ? updatedUser : u));
                    toast.success("User updated successfully", { id: loadingId });
                } else {
                    throw new Error("Failed to update user");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Action failed", { id: loadingId });
        }
    };

    const handlePostAction = async (postId: string, action: "publish" | "unpublish" | "delete") => {
        const loadingId = `post-${action}-${postId}`;
        toast.loading(`Processing...`, { id: loadingId });

        try {
            if (action === "delete") {
                if (!confirm("Are you sure you want to delete this post?")) {
                    toast.dismiss(loadingId);
                    return;
                }

                const response = await fetch(`/api/admin/posts/${postId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    setPosts(posts.filter(p => p._id !== postId));
                    toast.success("Post deleted successfully", { id: loadingId });
                } else {
                    throw new Error("Failed to delete post");
                }
            } else {
                const updates = {
                    published: action === "publish",
                };

                const response = await fetch(`/api/admin/posts/${postId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updates),
                });

                if (response.ok) {
                    const updatedPost = await response.json();
                    setPosts(posts.map(p => p._id === postId ? updatedPost : p));
                    toast.success("Post updated successfully", { id: loadingId });
                } else {
                    throw new Error("Failed to update post");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Action failed", { id: loadingId });
        }
    };

    const handleAlertAction = async (alertId: string, action: "dismiss" | "ban_user" | "freeze_trust" | "nullify_votes") => {
        const loadingId = `alert-${action}-${alertId}`;
        toast.loading(`Processing...`, { id: loadingId });

        try {
            const response = await fetch("/api/admin/alerts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ alertId, action }),
            });

            if (response.ok) {
                setAlerts(alerts.filter(a => a._id !== alertId));
                toast.success("Alert resolved successfully", { id: loadingId });
            } else {
                throw new Error("Failed to update alert");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Action failed", { id: loadingId });
        }
    };

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-muted-foreground">Total Users</h3>
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold">{stats.userCount}</p>
                        <p className="text-sm text-muted-foreground mt-1">Registered users</p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-muted-foreground">Total Posts</h3>
                            <FileText className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold">{stats.postCount}</p>
                        <p className="text-sm text-muted-foreground mt-1">Published content</p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-muted-foreground">Pending Review</h3>
                            <MessageSquare className="h-5 w-5 text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold">{stats.pendingComments}</p>
                        <p className="text-sm text-muted-foreground mt-1">Comments to moderate</p>
                    </GlassCard>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-border">
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "users"
                            ? "text-primary border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Users className="inline h-4 w-4 mr-2" />
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "posts"
                            ? "text-primary border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <FileText className="inline h-4 w-4 mr-2" />
                        Content Moderation
                    </button>
                    <button
                        onClick={() => setActiveTab("comments")}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "comments"
                            ? "text-primary border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <MessageSquare className="inline h-4 w-4 mr-2" />
                        Comment Review
                    </button>
                    <button
                        onClick={() => setActiveTab("alerts")}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "alerts"
                            ? "text-primary border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Bell className="inline h-4 w-4 mr-2" />
                        Alerts
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {activeTab === "users" && (
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="author">Author</option>
                            <option value="reader">Reader</option>
                        </select>
                    )}

                    {activeTab === "posts" && (
                        <select
                            value={publishedFilter}
                            onChange={(e) => setPublishedFilter(e.target.value)}
                            className="px-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All Posts</option>
                            <option value="true">Published</option>
                            <option value="false">Drafts</option>
                        </select>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    </div>
                ) : (
                    <>
                        {/* User Management Table */}
                        {activeTab === "users" && (
                            <GlassCard className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Stats
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {users.map((user) => (
                                                <tr key={user._id} className="hover:bg-muted/30">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleUserAction(user._id, "role", e.target.value)}
                                                            className="px-2 py-1 bg-secondary/50 border border-border rounded text-sm"
                                                        >
                                                            <option value="reader">Reader</option>
                                                            <option value="author">Author</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <div>Upvotes: {user.totalUpvotes || 0}</div>
                                                        <div>Comments: {user.commentCount || 0}</div>
                                                        <div>Trust: {(user.trustScore || 1.0).toFixed(1)}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.banned ? (
                                                            <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-sm">
                                                                Banned
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-sm">
                                                                Active
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            {user.banned ? (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleUserAction(user._id, "unban")}
                                                                    title="Unban user"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleUserAction(user._id, "ban")}
                                                                    title="Ban user"
                                                                >
                                                                    <Ban className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleUserAction(user._id, "delete")}
                                                                className="text-red-500 hover:text-red-600"
                                                                title="Delete user"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {users.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No users found
                                    </div>
                                )}
                            </GlassCard>
                        )}

                        {/* Content Moderation Table */}
                        {activeTab === "posts" && (
                            <GlassCard className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Post
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Author
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Stats
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {posts.map((post) => (
                                                <tr key={post._id} className="hover:bg-muted/30">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="font-medium">{post.title}</div>
                                                            <div className="text-sm text-muted-foreground">{post.category}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm">{post.author?.name || "Unknown"}</div>
                                                            <div className="text-xs text-muted-foreground">{post.author?.email || "N/A"}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <div>Views: {post.views || 0}</div>
                                                        <div>Upvotes: {post.upvotes || 0}</div>
                                                        <div>Comments: {post.commentCount || 0}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {post.published ? (
                                                            <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-sm">
                                                                Published
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-sm">
                                                                Draft
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                                <Button size="sm" variant="ghost" title="View post">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            {post.published ? (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handlePostAction(post._id, "unpublish")}
                                                                    title="Unpublish post"
                                                                >
                                                                    <EyeOff className="h-4 w-4" />
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handlePostAction(post._id, "publish")}
                                                                    title="Publish post"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handlePostAction(post._id, "delete")}
                                                                className="text-red-500 hover:text-red-600"
                                                                title="Delete post"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {posts.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No posts found
                                    </div>
                                )}
                            </GlassCard>
                        )}

                        {/* Comment Review Table */}
                        {activeTab === "comments" && (
                            <GlassCard className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Comment
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Author
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Post
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {comments.map((comment) => (
                                                <tr key={comment._id} className="hover:bg-muted/30">
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-md truncate">{comment.content || "[No content]"}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm">{comment.author?.name || "Unknown"}</div>
                                                            <div className="text-xs text-muted-foreground">{comment.author?.email || "N/A"}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {comment.post?.slug ? (
                                                            <Link href={`/blog/${comment.post.slug}`} className="text-primary hover:underline text-sm">
                                                                {comment.post.title || "Untitled"}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">Post deleted</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-sm ${comment.moderationStatus === "pending"
                                                            ? "bg-yellow-500/20 text-yellow-500"
                                                            : comment.moderationStatus === "approved"
                                                                ? "bg-green-500/20 text-green-500"
                                                                : "bg-red-500/20 text-red-500"
                                                            }`}>
                                                            {comment.moderationStatus || "pending"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {comments.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No comments found
                                    </div>
                                )}
                            </GlassCard>
                        )}

                        {/* Alerts Table */}
                        {activeTab === "alerts" && (
                            <GlassCard className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Severity
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Alert Info
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Target
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {alerts.map((alert) => (
                                                <tr key={alert._id} className="hover:bg-muted/30">
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-sm capitalize font-medium ${alert.severity === "critical" ? "bg-red-500/20 text-red-500" :
                                                            alert.severity === "high" ? "bg-orange-500/20 text-orange-500" :
                                                                alert.severity === "medium" ? "bg-yellow-500/20 text-yellow-500" :
                                                                    "bg-blue-500/20 text-blue-500"
                                                            }`}>
                                                            {alert.severity}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="font-medium flex items-center gap-2">
                                                                <AlertTriangle size={16} className="text-muted-foreground" />
                                                                {alert.title}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground mt-1">{alert.description}</div>
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                {new Date(alert.createdAt).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {alert.targetUser && (
                                                            <div className="mb-2">
                                                                <div className="text-xs font-semibold text-muted-foreground">User:</div>
                                                                <div className="text-sm">{alert.targetUser.name}</div>
                                                                <div className="text-xs text-muted-foreground">Trust: {alert.targetUser.trustScore.toFixed(2)}</div>
                                                            </div>
                                                        )}
                                                        {alert.targetPost && (
                                                            <div>
                                                                <div className="text-xs font-semibold text-muted-foreground">Post:</div>
                                                                <Link href={`/blog/${alert.targetPost.slug}`} target="_blank" className="text-sm hover:underline text-primary">
                                                                    {alert.targetPost.title}
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleAlertAction(alert._id, "dismiss")}
                                                                title="Dismiss Alert"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>

                                                            {alert.targetUser && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => handleAlertAction(alert._id, "ban_user")}
                                                                        className="text-red-500 hover:text-red-600"
                                                                        title="Ban User"
                                                                    >
                                                                        <Ban className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => handleAlertAction(alert._id, "freeze_trust")}
                                                                        className="text-orange-500 hover:text-orange-600"
                                                                        title="Freeze Trust Score"
                                                                    >
                                                                        <Lock className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            )}

                                                            {alert.targetPost && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleAlertAction(alert._id, "nullify_votes")}
                                                                    className="text-red-500 hover:text-red-600"
                                                                    title="Nullify Votes"
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {alerts.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No active alerts found
                                    </div>
                                )}
                            </GlassCard>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
