"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeReadingBannerProps {
    slug: string;
    onResume: () => void;
}

export function ResumeReadingBanner({ slug, onResume }: ResumeReadingBannerProps) {
    const t = useTranslations("resumeReading");
    const [showBanner, setShowBanner] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Check if there's saved progress
        const saved = localStorage.getItem(`reading_progress_${slug}`);
        if (saved) {
            const percentage = parseFloat(saved);
            // Only show if progress is between 15% and 90%
            if (percentage > 15 && percentage < 90) {
                setProgress(Math.round(percentage));
                setShowBanner(true);

                // Auto-hide after 10 seconds
                const timer = setTimeout(() => {
                    setShowBanner(false);
                }, 10000);

                return () => clearTimeout(timer);
            }
        }
    }, [slug]);

    const handleResume = () => {
        onResume();
        setShowBanner(false);
    };

    const handleDismiss = () => {
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div
            className={cn(
                "fixed top-20 left-1/2 -translate-x-1/2 z-50",
                "w-[90%] max-w-md",
                "animate-in slide-in-from-top duration-300"
            )}
        >
            <div className="glass-card border border-primary/20 shadow-xl p-3 sm:p-4 rounded-xl">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <PlayCircle size={20} className="text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base mb-1">
                            {t("title")}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                            {t("description", { progress: `${progress}%` })}
                        </p>

                        {/* Progress bar */}
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleResume}
                                className="flex-1 px-3 py-1.5 sm:py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors min-h-[44px] sm:min-h-0"
                            >
                                {t("resume")}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] sm:min-h-0"
                            >
                                {t("dismiss")}
                            </button>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 p-1 hover:bg-muted rounded-full transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                        aria-label={t("dismiss")}
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
