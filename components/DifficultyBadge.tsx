"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { BookOpen, GraduationCap, Flame } from "lucide-react";

interface DifficultyBadgeProps {
    level?: "Beginner" | "Intermediate" | "Advanced";
    className?: string;
    showIcon?: boolean;
    size?: "sm" | "md" | "lg";
}

export function DifficultyBadge({
    level,
    className,
    showIcon = true,
    size = "md"
}: DifficultyBadgeProps) {
    const t = useTranslations("difficulty");

    if (!level) return null;

    const config = {
        Beginner: {
            color: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/30",
            icon: BookOpen,
            label: t("beginner"),
        },
        Intermediate: {
            color: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/30",
            icon: GraduationCap,
            label: t("intermediate"),
        },
        Advanced: {
            color: "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-500/30",
            icon: Flame,
            label: t("advanced"),
        },
    };

    const { color, icon: Icon, label } = config[level];

    const sizeClasses = {
        sm: "text-xs px-2 py-0.5 gap-1",
        md: "text-sm px-2.5 py-1 gap-1.5",
        lg: "text-base px-3 py-1.5 gap-2",
    };

    const iconSizes = {
        sm: 12,
        md: 14,
        lg: 16,
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full font-medium border transition-colors",
                color,
                sizeClasses[size],
                // Touch-friendly minimum size on mobile
                "min-h-[32px] sm:min-h-0",
                className
            )}
            title={t("tooltip", { level: label })}
        >
            {showIcon && <Icon size={iconSizes[size]} className="shrink-0" />}
            <span className="leading-none">{label}</span>
        </span>
    );
}
