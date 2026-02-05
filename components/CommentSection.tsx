"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Reply, Edit2, Trash2, Loader2, ChevronDown } from "lucide-react";
import { CommentForm } from "./CommentForm";
import { renderMarkdown } from "@/lib/markdown";
import Image from "next/image";

interface Comment {
    _id: string;
    content: string;
    author: {
        _id: string;
        name: string;
        image?: string;
    };
    parentComment?: string; // Parent comment ID for nesting
    createdAt: string;
    updatedAt: string;
    edited: boolean;
    depth: number;
    replies?: Comment[];
}

interface CommentSectionProps {
    postSlug: string;
    initialCommentCount?: number;
}

export function CommentSection({
    postSlug,
    initialCommentCount = 0,
}: CommentSectionProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [editingComment, setEditingComment] = useState<string | null>(null);

    useEffect(() => {
        fetchComments();
    }, [postSlug, page]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/posts/${postSlug}/comments?page=${page}&limit=20`
            );

            if (response.ok) {
                const data = await response.json();
                setComments(data.comments);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSuccess = (newComment: Comment) => {
        if (newComment.depth === 0) {
            // Top-level comment
            setComments((prev) => [newComment, ...prev]);
        } else {
            // Reply
            setComments((prev) =>
                prev.map((comment) => {
                    if (comment._id === newComment.parentComment) {
                        return {
                            ...comment,
                            replies: [...(comment.replies || []), newComment],
                        };
                    }
                    return comment;
                })
            );
        }
        setReplyingTo(null);
        setEditingComment(null);
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Remove comment from UI
                setComments((prev) =>
                    prev.map((comment) => {
                        if (comment._id === commentId) {
                            return { ...comment, content: "[deleted]", deleted: true };
                        }
                        // Check replies
                        if (comment.replies) {
                            comment.replies = comment.replies.map((reply) =>
                                reply._id === commentId
                                    ? { ...reply, content: "[deleted]", deleted: true }
                                    : reply
                            );
                        }
                        return comment;
                    })
                );
            } else {
                alert("Failed to delete comment");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete comment");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const renderComment = (comment: Comment, isReply = false) => {
        const isAuthor = session?.user?.id === comment.author._id;
        const isEditing = editingComment === comment._id;

        return (
            <div
                key={comment._id}
                className={`${isReply ? "ml-8 mt-3" : "mb-4"} ${isReply ? "border-l-2 border-border pl-4" : ""
                    }`}
            >
                <div className="bg-card rounded-lg border border-border p-4">
                    {/* Comment Header */}
                    <div className="flex items-start gap-3 mb-2">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            {comment.author.image ? (
                                <Image
                                    src={comment.author.image}
                                    alt={comment.author.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                                    {comment.author.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="font-medium text-sm">
                                    {comment.author.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDate(comment.createdAt)}
                                </span>
                                {comment.edited && (
                                    <span className="text-xs text-muted-foreground italic">
                                        (edited)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Comment Content */}
                    {isEditing ? (
                        <div className="mt-3">
                            <CommentForm
                                postSlug={postSlug}
                                initialContent={comment.content}
                                isEditing
                                commentId={comment._id}
                                onSuccess={handleCommentSuccess}
                                onCancel={() => setEditingComment(null)}
                            />
                        </div>
                    ) : (
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none mt-2"
                            dangerouslySetInnerHTML={{
                                __html: renderMarkdown(comment.content),
                            }}
                        />
                    )}

                    {/* Comment Actions */}
                    {!isEditing && (
                        <div className="flex items-center gap-3 mt-3 text-sm">
                            {!isReply && comment.depth < 2 && (
                                <button
                                    onClick={() =>
                                        setReplyingTo(
                                            replyingTo === comment._id ? null : comment._id
                                        )
                                    }
                                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Reply size={14} />
                                    Reply
                                </button>
                            )}

                            {isAuthor && (
                                <>
                                    <button
                                        onClick={() => setEditingComment(comment._id)}
                                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Edit2 size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(comment._id)}
                                        className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Reply Form */}
                {replyingTo === comment._id && !isReply && (
                    <div className="ml-8 mt-3 border-l-2 border-primary pl-4">
                        <CommentForm
                            postSlug={postSlug}
                            parentCommentId={comment._id}
                            onSuccess={handleCommentSuccess}
                            onCancel={() => setReplyingTo(null)}
                        />
                    </div>
                )}

                {/* Render Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3">
                        {comment.replies.map((reply) => renderComment(reply, true))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <h2 className="text-xl font-bold">
                    Comments ({initialCommentCount || comments.length})
                </h2>
            </div>

            {/* Comment Form */}
            <CommentForm postSlug={postSlug} onSuccess={handleCommentSuccess} />

            {/* Comments List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="ml-2 text-muted-foreground">Loading comments...</span>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
                    <MessageSquare size={48} className="mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                        No comments yet. Be the first to comment!
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {comments.map((comment) => renderComment(comment))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-muted rounded-md text-sm font-medium hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-muted rounded-md text-sm font-medium hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
