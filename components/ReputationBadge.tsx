"use client";

import { useTranslations } from "next-intl";
import { Shield, ShieldCheck, Star, Award, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReputationBadgeProps {
    score: number;
    className?: string;
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
}

export function ReputationBadge({ score, className, showLabel = true, size = "md" }: ReputationBadgeProps) {
    const t = useTranslations("reputation");

    // Badge configuration based on score (0.5 - 2.0)
    let config = {
        label: t("newcomer"),
        icon: User,
        color: "bg-muted text-muted-foreground border-border",
        iconColor: "text-muted-foreground"
    };

    if (score >= 1.6) {
        config = {
            label: t("expert"),
            icon: Award,
            color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
            iconColor: "text-amber-600 dark:text-amber-400"
        };
    } else if (score >= 1.2) {
        config = {
            label: t("trusted"),
            icon: ShieldCheck,
            color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
            iconColor: "text-green-600 dark:text-green-400"
        };
    } else if (score >= 0.8) {
        config = {
            label: t("contributor"),
            icon: Star,
            color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
            iconColor: "text-blue-600 dark:text-blue-400"
        };
    }

    const sizeClasses = {
        sm: "text-[10px] px-1.5 py-0.5 gap-1",
        md: "text-xs px-2 py-0.5 gap-1.5",
        lg: "text-sm px-3 py-1 gap-2"
    };

    const iconSizes = {
        sm: 10,
        md: 12,
        lg: 16
    };

    const Icon = config.icon;

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full font-medium border transition-colors",
                config.color,
                sizeClasses[size],
                className
            )}
            title={`${config.label} (${t("tooltip")})`}
        >
            <Icon size={iconSizes[size]} className={cn("shrink-0", config.iconColor)} />
            {showLabel && <span className="leading-none">{config.label}</span>}
        </span>
    );
}
