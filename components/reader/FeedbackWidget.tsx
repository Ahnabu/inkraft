"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ThumbsUp, CheckCircle, HelpCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeedbackWidgetProps {
    postId: string;
}

type FeedbackType = "helpful" | "clear" | "needs-more";

export function FeedbackWidget({ postId }: FeedbackWidgetProps) {
    const [selected, setSelected] = useState<FeedbackType | null>(null);
    const [stats, setStats] = useState<Record<FeedbackType, number>>({
        helpful: 0,
        clear: 0,
        "needs-more": 0
    });
    const [loading, setLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        // Fetch existing feedback stats and user vote
        const fetchFeedback = async () => {
            try {
                const res = await fetch(`/api/feedback?postId=${postId}`);
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                    if (data.userFeedback) {
                        setSelected(data.userFeedback);
                        setHasVoted(true);
                    }
                }
            } catch (error) {
                console.error("Failed to load feedback", error);
            }
        };
        fetchFeedback();
    }, [postId]);

    const handleVote = async (type: FeedbackType) => {
        if (loading || hasVoted) return; // Prevent spam voting or changing vote for simplicity for now

        setLoading(true);
        // Optimistic update
        setSelected(type);
        setStats(prev => ({ ...prev, [type]: prev[type] + 1 }));
        setHasVoted(true);

        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, type }),
            });

            if (!res.ok) {
                throw new Error("Failed to save feedback");
            }
            toast.success("Thanks for your feedback!");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
            // Revert optimistic update
            setStats(prev => ({ ...prev, [type]: prev[type] - 1 }));
            setSelected(null);
            setHasVoted(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 my-8 bg-muted/30 rounded-xl border border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Was this article helpful?</h3>
            <div className="flex flex-wrap items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("helpful")}
                    className={cn(
                        "gap-2 transition-all duration-300",
                        selected === "helpful"
                            ? "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800"
                            : "hover:bg-muted"
                    )}
                    disabled={hasVoted}
                >
                    <ThumbsUp size={16} className={selected === "helpful" ? "fill-current" : ""} />
                    <span>Helpful</span>
                    {stats.helpful > 0 && <span className="ml-1 text-xs opacity-70">({stats.helpful})</span>}
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("clear")}
                    className={cn(
                        "gap-2 transition-all duration-300",
                        selected === "clear"
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            : "hover:bg-muted"
                    )}
                    disabled={hasVoted}
                >
                    <CheckCircle size={16} className={selected === "clear" ? "fill-current" : ""} />
                    <span>Clear</span>
                    {stats.clear > 0 && <span className="ml-1 text-xs opacity-70">({stats.clear})</span>}
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("needs-more")}
                    className={cn(
                        "gap-2 transition-all duration-300",
                        selected === "needs-more"
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                            : "hover:bg-muted"
                    )}
                    disabled={hasVoted}
                >
                    <HelpCircle size={16} className={selected === "needs-more" ? "fill-current" : ""} />
                    <span>Needs More</span>
                    {stats["needs-more"] > 0 && <span className="ml-1 text-xs opacity-70">({stats["needs-more"]})</span>}
                </Button>
            </div>
            {loading && <Loader2 className="animate-spin text-muted-foreground mt-2" size={16} />}
        </div>
    );
}
