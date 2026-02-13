"use client";

import { useState, useTransition } from "react";
import { followUser, unfollowUser } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface FollowButtonProps {
    targetUserId: string;
    isFollowing: boolean;
}

export default function FollowButton({ targetUserId, isFollowing: initialIsFollowing }: FollowButtonProps) {
    const t = useTranslations("Follow");
    const [isPending, startTransition] = useTransition();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

    const { data: session } = useSession();
    const router = useRouter();

    const handleFollowToggle = () => {
        if (!session) {
            toast.error(t("loginRequired"));
            router.push("/auth/signin");
            return;
        }

        const previousState = isFollowing;
        setIsFollowing(!previousState);

        startTransition(async () => {
            try {
                if (previousState) {
                    await unfollowUser(targetUserId);
                    toast.success(t("unfollowed"));
                } else {
                    await followUser(targetUserId);
                    toast.success(t("followed"));
                }
            } catch (error) {
                setIsFollowing(previousState);
                toast.error(t("error"));
                console.error(error);
            }
        });
    };

    return (
        <button
            onClick={handleFollowToggle}
            disabled={isPending}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isFollowing
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-input"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isFollowing ? (
                t("following")
            ) : (
                t("follow")
            )}
        </button>
    );
}
