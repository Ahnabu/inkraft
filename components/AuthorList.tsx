"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import FollowButton from "@/components/FollowButton";
import { Input } from "@/components/ui/Input";

interface Author {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    bio?: string;
    createdAt?: string;
    _id?: string;
}

interface AuthorListProps {
    initialAuthors: Author[];
    currentUserId?: string;
    followingIds?: string[];
}

export function AuthorList({ initialAuthors, currentUserId, followingIds = [] }: AuthorListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredAuthors = initialAuthors.filter((author) => {
        const query = searchQuery.toLowerCase();
        const name = author.name?.toLowerCase() || "";
        const bio = author.bio?.toLowerCase() || "";
        return name.includes(query) || bio.includes(query);
    });

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                    type="text"
                    placeholder="Search authors by name or bio..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-background/50 backdrop-blur-sm border-border"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAuthors.map((author) => (
                    <GlassCard key={author.id} className="p-6 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <Link href={`/profile/${author.id}`} className="shrink-0">
                                {author.image ? (
                                    <img
                                        src={author.image}
                                        alt={author.name || "Author"}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/10 hover:border-primary/50 transition-colors"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User size={32} />
                                    </div>
                                )}
                            </Link>
                            <div>
                                <Link href={`/profile/${author.id}`} className="group">
                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                        {author.name || "Anonymous"}
                                    </h3>
                                </Link>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
                                    {author.bio || "No bio available."}
                                </p>

                                <div className="text-xs text-muted-foreground flex gap-3">
                                    <span>Joined {new Date(author.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {currentUserId !== author.id && (
                            <div className="shrink-0">
                                <FollowButton
                                    targetUserId={author.id}
                                    isFollowing={followingIds.includes(author.id)}
                                />
                            </div>
                        )}
                    </GlassCard>
                ))}

                {filteredAuthors.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No authors found matching "{searchQuery}".
                    </div>
                )}
            </div>
        </div>
    );
}
