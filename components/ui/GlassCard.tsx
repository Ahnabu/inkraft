import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: "default" | "dark";
}

export function GlassCard({
    children,
    className,
    ...props
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-xl",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
