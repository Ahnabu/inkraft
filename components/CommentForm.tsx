"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { renderMarkdown, validateMarkdownContent } from "@/lib/markdown";

interface CommentFormProps {
    postSlug: string;
    parentCommentId?: string;
    onSuccess?: (comment: any) => void;
    onCancel?: () => void;
    initialContent?: string; // For editing
    isEditing?: boolean;
    commentId?: string;
}

export function CommentForm({
    postSlug,
    parentCommentId,
    onSuccess,
    onCancel,
    initialContent = "",
    isEditing = false,
    commentId,
}: CommentFormProps) {
    const { data: session, status } = useSession();
    const [content, setContent] = useState(initialContent);
    const [showPreview, setShowPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null);

    const charCount = content.length;
    const charLimit = 5000;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            setError("Please sign in to comment");
            return;
        }

        // Validate content
        const validation = validateMarkdownContent(content);
        if (!validation.valid) {
            setError(validation.error || "Invalid content");
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (isEditing && commentId) {
                // Edit existing comment
                const response = await fetch(`/api/comments/${commentId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Failed to edit comment");
                }

                const updatedComment = await response.json();
                onSuccess?.(updatedComment);
                setContent("");
            } else {
                // Create new comment
                const response = await fetch(`/api/posts/${postSlug}/comments`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content,
                        parentCommentId,
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Failed to post comment");
                }

                const newComment = await response.json();
                setRateLimitRemaining(newComment.rateLimitRemaining);
                onSuccess?.(newComment);
                setContent("");
                setShowPreview(false);
            }
        } catch (err: any) {
            console.error("Comment submit error:", err);
            setError(err.message || "Failed to submit comment");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg">
                <Loader2 className="animate-spin" size={20} />
                <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="p-6 bg-muted/30 rounded-lg border border-border text-center">
                <p className="text-muted-foreground">
                    Please{" "}
                    <a href="/auth/signin" className="text-primary underline">
                        sign in
                    </a>{" "}
                    to comment
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="border border-border rounded-lg overflow-hidden bg-card">
                {/* Editor Tabs */}
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border">
                    <button
                        type="button"
                        onClick={() => setShowPreview(false)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${!showPreview
                                ? "bg-background text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Eye size={14} className="inline mr-1" />
                        Write
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${showPreview
                                ? "bg-background text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                        disabled={!content}
                    >
                        <EyeOff size={14} className="inline mr-1" />
                        Preview
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-3">
                    {showPreview ? (
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none min-h-[120px]"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                        />
                    ) : (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={
                                parentCommentId
                                    ? "Write a reply... Supports **bold**, *italic*, `code`, and links"
                                    : "Write a comment... Supports **bold**, *italic*, `code`, and links"
                            }
                            className="w-full min-h-[120px] resize-none bg-transparent border-none outline-none text-sm"
                            disabled={loading}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className={charCount > charLimit ? "text-destructive" : ""}>
                            {charCount}/{charLimit}
                        </span>
                        {rateLimitRemaining !== null && (
                            <span>
                                {rateLimitRemaining} comments remaining this hour
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={loading}
                                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                            >
                                <X size={14} className="inline mr-1" />
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={loading || !content.trim() || charCount > charLimit}
                            className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Send size={14} />
                                    {isEditing ? "Save" : parentCommentId ? "Reply" : "Comment"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                    {error}
                </div>
            )}

            {/* Markdown Help */}
            {!showPreview && !parentCommentId && (
                <div className="text-xs text-muted-foreground space-y-1 px-1">
                    <p>
                        <strong>Markdown supported:</strong> **bold**, *italic*, `code`,
                        ```code blocks```, [links](url)
                    </p>
                </div>
            )}
        </form>
    );
}
