"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ThumbsUp, CheckCircle, HelpCircle, MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface SilentFeedbackProps {
    postId: string;
    className?: string;
}

type FeedbackType = "helpful" | "clear" | "more_detail";

export function SilentFeedback({ postId, className }: SilentFeedbackProps) {
    const t = useTranslations("SilentFeedback");
    const [submitted, setSubmitted] = useState<FeedbackType | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check local storage or fetch from API if we want to show previous state
        // For now, let's just rely on local state per session or fetch
        const checkFeedback = async () => {
            try {
                const res = await fetch(`/api/feedback?postId=${postId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.userFeedback && data.userFeedback.length > 0) {
                        // Just take the first one found for simplicity in UI
                        setSubmitted(data.userFeedback[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to check feedback", error);
            }
        };
        checkFeedback();
    }, [postId]);

    const handleFeedback = async (type: FeedbackType) => {
        if (submitted || isLoading) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, type }),
            });

            if (!res.ok) {
                if (res.status === 409) {
                    toast.info(t("alreadySubmitted"));
                    setSubmitted(type); // Assume it was this type
                    return;
                }
                throw new Error("Failed to submit");
            }

            setSubmitted(type);
            toast.success(t("thankYou"));
        } catch (error) {
            console.error(error);
            toast.error(t("error"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GlassCard className={cn("p-6 text-center", className)}>
            <h3 className="text-lg font-semibold mb-2">{t("title")}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t("subtitle")}</p>

            <div className="flex flex-wrap justify-center gap-4">
                <Button
                    variant={submitted === "helpful" ? "primary" : "outline"}
                    className={cn("gap-2 min-w-30", submitted === "helpful" && "bg-green-600 hover:bg-green-700 text-white")}
                    onClick={() => handleFeedback("helpful")}
                    disabled={!!submitted || isLoading}
                >
                    {submitted === "helpful" ? <CheckCircle className="w-4 h-4" /> : <ThumbsUp className="w-4 h-4" />}
                    {t("helpful")}
                </Button>

                <Button
                    variant={submitted === "clear" ? "primary" : "outline"}
                    className={cn("gap-2 min-w-30", submitted === "clear" && "bg-blue-600 hover:bg-blue-700 text-white")}
                    onClick={() => handleFeedback("clear")}
                    disabled={!!submitted || isLoading}
                >
                    {submitted === "clear" ? <CheckCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    {t("clear")}
                </Button>

                <Button
                    variant={submitted === "more_detail" ? "primary" : "outline"}
                    className={cn("gap-2 min-w-30", submitted === "more_detail" && "bg-amber-600 hover:bg-amber-700 text-white")}
                    onClick={() => handleFeedback("more_detail")}
                    disabled={!!submitted || isLoading}
                >
                    {submitted === "more_detail" ? <CheckCircle className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                    {t("moreDetail")}
                </Button>
            </div>

            {submitted && (
                <p className="mt-4 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
                    {t("feedbackSaved")}
                </p>
            )}
        </GlassCard>
    );
}
