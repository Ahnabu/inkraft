"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Send, Loader2, User, Reply, AlertCircle, Trash2, MoreVertical } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { Button } from "./ui/Button";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
    _id: string;
    content: string;
    author: {
        _id: string;
        name: string;
        image?: string;
    };
    createdAt: string;
    replies?: Comment[];
    depth: number;
}

interface CommentsProps {
    postSlug: string;
}

export function Comments({ postSlug }: CommentsProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingComments, setFetchingComments] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    const fetchComments = useCallback(async () => {
        try {
            const response = await fetch(`/api/posts/${postSlug}/comments`);
            if (response.ok) {
                const data = await response.json();
                setComments(data.comments || []);
            } else {
                console.error("Failed to fetch comments:", await response.text());
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setFetchingComments(false);
        }
    }, [postSlug]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent, parentCommentId?: string) => {
        e.preventDefault();

        if (!session) {
            toast.error("Please sign in to comment");
            return;
        }

        const content = parentCommentId ? replyContent : newComment;
        if (!content.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/posts/${postSlug}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: content.trim(),
                    parentCommentId
                }),
            });

            if (response.ok) {
                if (parentCommentId) {
                    setReplyContent("");
                    setReplyTo(null);
                } else {
                    setNewComment("");
                }
                fetchComments(); // Refresh comments
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Failed to post comment");
                setError(errorText || "Failed to post comment");
            }
        } catch (error: unknown) {
            console.error("Error posting comment:", error);
            const message = error instanceof Error ? error.message : "Error posting comment";
            toast.error(message);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (commentId: string) => {
        if (!editContent.trim()) return;

        try {
            const response = await fetch(`/api/posts/${postSlug}/comments`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    commentId,
                    content: editContent.trim(),
                }),
            });

            if (response.ok) {
                toast.success("Comment updated");
                setEditingCommentId(null);
                setEditContent("");
                fetchComments();
            } else {
                toast.error("Failed to update comment");
            }
        } catch (_error) {
            toast.error("Error updating comment");
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const response = await fetch(`/api/posts/${postSlug}/comments?commentId=${commentId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Comment deleted");
                fetchComments();
            } else {
                toast.error("Failed to delete comment");
            }
        } catch (_error) {
            toast.error("Error deleting comment");
        }
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
        <div className={`${isReply ? 'ml-12 mt-3' : ''}`}>
            <GlassCard className="p-4">
                <div className="flex gap-3">
                    {comment.author?.image ? (
                        <Image
                            src={comment.author.image}
                            alt={comment.author.name}
                            width={40}
                            height={40}
                            className="rounded-full w-10 h-10 object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User size={20} className="text-primary" />
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Link
                                href={`/profile/${comment.author?._id}`}
                                className="font-semibold hover:text-primary transition-colors"
                            >
                                {comment.author?.name || "Anonymous"}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                            {editingCommentId === comment._id ? (
                                <div className="flex-1 space-y-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground dark:text-gray-100 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                                        rows={2}
                                        maxLength={1500}
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleUpdate(comment._id)}
                                            size="sm"
                                            disabled={!editContent.trim()}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setEditingCommentId(null);
                                                setEditContent("");
                                            }}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-foreground dark:text-gray-100 whitespace-pre-wrap mb-2 flex-1">{comment.content}</p>
                            )}

                            {session?.user?.id === comment.author._id && !editingCommentId && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="text-muted-foreground hover:text-foreground p-1">
                                            <MoreVertical size={16} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setEditingCommentId(comment._id);
                                                setEditContent(comment.content);
                                            }}
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(comment._id)}
                                            className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
                                        >
                                            <Trash2 size={14} className="mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {/* Reply button - only show for top-level comments */}
                        {!isReply && session && (
                            <button
                                onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                                <Reply size={14} />
                                Reply
                            </button>
                        )}

                        {/* Reply form */}
                        {replyTo === comment._id && (
                            <form onSubmit={(e) => handleSubmit(e, comment._id)} className="mt-3">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                                    rows={2}
                                    maxLength={1500}
                                />
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        type="submit"
                                        disabled={loading || !replyContent.trim()}
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Send size={14} />
                                        )}
                                        Reply
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setReplyTo(null);
                                            setReplyContent("");
                                        }}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </GlassCard>

            {/* Render replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                        <CommentItem key={reply._id} comment={reply} isReply={true} />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare size={24} />
                Comments ({comments.length})
            </h2>

            {/* Error Alert */}
            {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="text-red-500 hover:text-red-400">
                        ×
                    </button>
                </div>
            )}

            {/* Comment Form */}
            <GlassCard className="p-6 mb-6">
                {session ? (
                    <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                        <div className="flex gap-3">
                            {session.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    width={40}
                                    height={40}
                                    className="rounded-full w-10 h-10 object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <User size={20} className="text-primary" />
                                </div>
                            )}
                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-secondary/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    rows={3}
                                    maxLength={1500}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-muted-foreground">
                                        {newComment.length}/1500
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={loading || !newComment.trim()}
                                className="flex items-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Send size={16} />
                                )}
                                Post Comment
                            </Button>
                        </div>
                    </form>
                ) : (
                    <p className="text-center text-muted-foreground py-4">
                        Please <a href="/auth/signin" className="text-primary hover:underline">sign in</a> to leave a comment
                    </p>
                )}
            </GlassCard>

            {/* Comments List */}
            {fetchingComments ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <GlassCard key={i} className="p-6 animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-muted" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted rounded w-1/4" />
                                    <div className="h-3 bg-muted rounded w-3/4" />
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <GlassCard className="p-12 text-center bg-card/80 dark:bg-zinc-900/50">
                    <MessageSquare size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                </GlassCard>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))}
                </div>
            )}
        </div>
    );
}
