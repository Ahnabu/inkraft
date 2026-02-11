"use client";

import Link from "next/link";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";
import FollowButton from "@/components/FollowButton";
import { GlassCard } from "@/components/ui/GlassCard";

interface UserCardProps {
    user: {
        _id: string;
        name: string;
        image?: string;
        bio?: string;
        followersCount?: number;
    };
    isFollowing: boolean;
}

export function UserCard({ user, isFollowing }: UserCardProps) {
    return (
        <GlassCard className="p-6 flex flex-col items-center text-center gap-4 transition-all hover:scale-[1.02] hover:shadow-lg">
            <Link href={`/profile/${user._id}`} className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 border-4 border-background shadow-md">
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <UserIcon size={40} className="text-primary/50" />
                        </div>
                    )}
                </div>
            </Link>

            <div className="w-full space-y-2">
                <Link href={`/profile/${user._id}`} className="block">
                    <h3 className="font-bold text-lg hover:text-primary transition-colors truncate">
                        {user.name}
                    </h3>
                </Link>

                {user.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                        {user.bio}
                    </p>
                )}

                {/* Optional stats */}
                {user.followersCount !== undefined && (
                    <div className="text-xs text-muted-foreground font-medium">
                        {user.followersCount} Followers
                    </div>
                )}
            </div>

            <div className="mt-2 w-full">
                <FollowButton
                    targetUserId={user._id}
                    isFollowing={isFollowing}
                />
            </div>
        </GlassCard>
    );
}
