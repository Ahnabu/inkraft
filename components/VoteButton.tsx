"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";

interface VoteButtonProps {
    postSlug: string;
    initialUpvotes?: number;
    initialDownvotes?: number;
    initialUserVote?: "upvote" | "downvote" | null;
    variant?: "inline" | "stacked"; // inline: horizontal, stacked: vertical
}

export function VoteButton({
    postSlug,
    initialUpvotes = 0,
    initialDownvotes = 0,
    initialUserVote = null,
    variant = "stacked",
}: VoteButtonProps) {
    const { data: session, status } = useSession();
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(initialUserVote);
    const [loading, setLoading] = useState(false);

    // Fetch user's vote on mount if logged in
    useEffect(() => {
        if (status === "authenticated") {
            fetchUserVote();
        }
    }, [status, postSlug]);

    const fetchUserVote = async () => {
        try {
            const response = await fetch(`/api/posts/${postSlug}/vote`);
            if (response.ok) {
                const data = await response.json();
                setUserVote(data.userVote);
                setUpvotes(data.upvotes);
                setDownvotes(data.downvotes);
            }
        } catch (error) {
            console.error("Failed to fetch vote:", error);
        }
    };

    const handleVote = async (voteType: "upvote" | "downvote") => {
        if (!session) {
            alert("Please sign in to vote");
            return;
        }

        // Optimistic update
        const previousVote = userVote;
        const previousUpvotes = upvotes;
        const previousDownvotes = downvotes;

        // Calculate optimistic state
        if (previousVote === voteType) {
            // Toggling off
            setUserVote(null);
            if (voteType === "upvote") {
                setUpvotes(prev => Math.max(0, prev - 1));
            } else {
                setDownvotes(prev => Math.max(0, prev - 1));
            }
        } else if (previousVote === null) {
            // New vote
            setUserVote(voteType);
            if (voteType === "upvote") {
                setUpvotes(prev => prev + 1);
            } else {
                setDownvotes(prev => prev + 1);
            }
        } else {
            // Switching vote
            setUserVote(voteType);
            if (voteType === "upvote") {
                setUpvotes(prev => prev + 1);
                setDownvotes(prev => Math.max(0, prev - 1));
            } else {
                setDownvotes(prev => prev + 1);
                setUpvotes(prev => Math.max(0, prev - 1));
            }
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/posts/${postSlug}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ voteType }),
            });

            if (!response.ok) {
                throw new Error("Failed to vote");
            }

            const data = await response.json();

            // Update with actual server values
            setUpvotes(data.upvotes);
            setDownvotes(data.downvotes);
            setUserVote(data.userVote);
        } catch (error) {
            console.error("Vote error:", error);

            // Revert on error
            setUserVote(previousVote);
            setUpvotes(previousUpvotes);
            setDownvotes(previousDownvotes);

            alert("Failed to vote. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const netVotes = Math.round(upvotes - downvotes);

    if (variant === "inline") {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleVote("upvote")}
                    disabled={loading || status === "loading"}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${userVote === "upvote"
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title="Upvote"
                >
                    {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <ArrowUp size={16} />
                    )}
                    <span className="text-sm font-medium">{Math.round(upvotes)}</span>
                </button>

                <button
                    onClick={() => handleVote("downvote")}
                    disabled={loading || status === "loading"}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${userVote === "downvote"
                        ? "bg-red-500 text-white"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title="Downvote"
                >
                    {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <ArrowDown size={16} />
                    )}
                    <span className="text-sm font-medium">{Math.round(downvotes)}</span>
                </button>
            </div>
        );
    }

    // Stacked variant (vertical)
    return (
        <div className="flex flex-col items-center gap-1">
            <button
                onClick={() => handleVote("upvote")}
                disabled={loading || status === "loading"}
                className={`p-2 rounded-lg transition-all ${userVote === "upvote"
                    ? "bg-primary text-white"
                    : "hover:bg-muted text-muted-foreground"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Upvote"
                aria-label="Upvote"
            >
                {loading && userVote !== "downvote" ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <ArrowUp size={20} className={userVote === "upvote" ? "fill-current" : ""} />
                )}
            </button>

            <span className={`text-base font-bold ${netVotes > 0 ? "text-primary" : netVotes < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                {netVotes > 0 ? "+" : ""}{netVotes}
            </span>

            <button
                onClick={() => handleVote("downvote")}
                disabled={loading || status === "loading"}
                className={`p-2 rounded-lg transition-all ${userVote === "downvote"
                    ? "bg-red-500 text-white"
                    : "hover:bg-muted text-muted-foreground"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Downvote"
                aria-label="Downvote"
            >
                {loading && userVote === "downvote" ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <ArrowDown size={20} className={userVote === "downvote" ? "fill-current" : ""} />
                )}
            </button>

            {status === "unauthenticated" && (
                <p className="text-xs text-muted-foreground mt-1">Sign in to vote</p>
            )}
        </div>
    );
}
