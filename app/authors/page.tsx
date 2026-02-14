import { Metadata } from "next";
import { getAllAuthors } from "@/lib/data/users";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { User, Users } from "lucide-react";
import FollowButton from "@/components/FollowButton";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: "Discover Authors | Inkraft",
    description: "Find and follow the best writers on Inkraft.",
};

export default async function AuthorsPage() {
    const session = await auth();
    const authors = await getAllAuthors();

    // Sort authors: those with most followers first, then by name
    const sortedAuthors = [...authors].sort((a, b) => {
        // Mock sort logic as we might not have follower counts in the user object yet
        // In a real app, we would sort by follower count
        return (a.name || "").localeCompare(b.name || "");
    });

    return (
        <main className="min-h-screen py-12 container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                        <Users className="w-10 h-10 text-primary" />
                        Discover Authors
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Connect with the voices that matter to you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedAuthors.map((author) => (
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

                                    {/* Reputation / Stats could go here */}
                                    <div className="text-xs text-muted-foreground flex gap-3">
                                        <span>Joined {new Date(author.createdAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0">
                                <FollowButton
                                    targetUserId={author.id}
                                    isFollowing={false} // We need to fetch this status ideally, or client-side it
                                />
                            </div>
                        </GlassCard>
                    ))}

                    {sortedAuthors.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No authors found.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
