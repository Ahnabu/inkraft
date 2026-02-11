"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sparkles, Clock, Users } from "lucide-react";

interface FeedTabsProps {
    isLoggedIn: boolean;
}

export function FeedTabs({ isLoggedIn }: FeedTabsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentFeed = searchParams.get("feed") || (isLoggedIn ? "foryou" : "latest");

    const tabs = [
        ...(isLoggedIn ? [{
            id: "foryou",
            label: "For You",
            icon: Sparkles
        }] : []),
        {
            id: "latest",
            label: "Latest",
            icon: Clock
        },
        ...(isLoggedIn ? [{
            id: "following",
            label: "Following",
            icon: Users
        }] : [])
    ];

    const handleTabClick = (feedId: string) => {
        router.push(`/?feed=${feedId}`, { scroll: false }); // keep position if possible, though it's a new feed
    };

    return (
        <div className="flex items-center gap-6 mb-6 sm:mb-8">
            {tabs.map((tab) => {
                const isActive = currentFeed === tab.id;
                const Icon = tab.icon;

                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={cn(
                            "group flex items-center gap-2 text-base font-medium transition-colors",
                            isActive
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Icon size={18} className={cn(
                            "transition-colors",
                            isActive && tab.id === "foryou" ? "text-amber-500" :
                                isActive && tab.id === "latest" ? "text-foreground" :
                                    isActive && tab.id === "following" ? "text-purple-500" :
                                        "text-muted-foreground group-hover:text-foreground"
                        )} />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
