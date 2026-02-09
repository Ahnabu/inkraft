
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import Image from "next/image";
import { Clock, Bookmark, History, Lock, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function LibraryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"saved" | "history">("saved");
    const [savedPosts, setSavedPosts] = useState<any[]>([]);
    const [readingHistory, setReadingHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin?callbackUrl=/library");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            fetchLibraryData();
        }
    }, [session]);

    const fetchLibraryData = async () => {
        try {
            setLoading(true);
            const [savedRes, historyRes, userRes] = await Promise.all([
                fetch("/api/user/saved"),
                fetch("/api/user/history"),
                fetch(`/api/user/${session?.user?.id}`)
            ]);

            if (savedRes.ok) {
                const data = await savedRes.json();
                setSavedPosts(data.posts || []);
            }

            if (historyRes.ok) {
                const data = await historyRes.json();
                setReadingHistory(data.history || []);
            }

            if (userRes.ok) {
                const data = await userRes.json();
                setIsPublic(data.user?.isSavedPostsPublic || false);
            }

        } catch (error) {
            console.error("Error fetching library:", error);
        } finally {
            setLoading(false);
        }
    };

    const togglePrivacy = async () => {
        try {
            const newStatus = !isPublic;
            setIsPublic(newStatus);
            await fetch(`/api/user/${session?.user?.id}/settings`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isSavedPostsPublic: newStatus })
            });
        } catch (error) {
            console.error("Error updating privacy:", error);
            setIsPublic(!isPublic); // Revert on error
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="container mx-auto px-4 py-8 min-h-screen">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="grid gap-4 mt-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-muted rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Library</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Manage your saved posts and reading history
                    </p>
                </div>

                <button
                    onClick={togglePrivacy}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted/50 transition-colors text-sm"
                >
                    {isPublic ? (
                        <>
                            <Globe size={16} className="text-green-500" />
                            <span>Public Library</span>
                        </>
                    ) : (
                        <>
                            <Lock size={16} className="text-muted-foreground" />
                            <span>Private Library</span>
                        </>
                    )}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-border mb-6 sm:mb-8 overflow-x-auto pb-px -mx-3 px-3 sm:mx-0 sm:px-0">
                <button
                    onClick={() => setActiveTab("saved")}
                    className={`pb-3 sm:pb-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === "saved"
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Bookmark size={16} className="sm:w-[18px] sm:h-[18px]" />
                        Saved Posts
                        <span className="bg-muted px-2 py-0.5 rounded-full text-xs">
                            {savedPosts.length}
                        </span>
                    </div>
                    {activeTab === "saved" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("history")}
                    className={`pb-3 sm:pb-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === "history"
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <History size={16} className="sm:w-[18px] sm:h-[18px]" />
                        Reading History
                        <span className="bg-muted px-2 py-0.5 rounded-full text-xs">
                            {readingHistory.length}
                        </span>
                    </div>
                    {activeTab === "history" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="grid gap-3 sm:gap-4">
                {activeTab === "saved" ? (
                    savedPosts.length > 0 ? (
                        savedPosts.map((post) => (
                            <Link key={post._id} href={`/blog/${post.slug}`}>
                                <GlassCard className="p-3 sm:p-4 hover:bg-muted/50 transition-colors group">
                                    <div className="flex gap-3 sm:gap-4">
                                        {post.coverImage && (
                                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden">
                                                <Image
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base sm:text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="hidden sm:block text-sm text-muted-foreground line-clamp-1 mb-2">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {post.readingTime} min
                                                </span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="truncate max-w-[100px] sm:max-w-none">{post.author?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No saved posts yet.</p>
                            <Link href="/explore" className="text-primary hover:underline mt-2 inline-block">
                                Explore articles to save
                            </Link>
                        </div>
                    )
                ) : (
                    readingHistory.length > 0 ? (
                        readingHistory.map((item) => (
                            <Link key={item._id} href={`/blog/${item.post?.slug}`}>
                                <GlassCard className="p-3 sm:p-4 hover:bg-muted/50 transition-colors group">
                                    <div className="flex gap-3 sm:gap-4">
                                        <div className="w-1 bg-muted rounded-full overflow-hidden shrink-0 flex flex-col justify-end">
                                            <div
                                                className={`w-full ${item.completed ? 'bg-green-500' : 'bg-primary'}`}
                                                style={{ height: `${item.progress}%` }}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-semibold text-base sm:text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                                    {item.post?.title || "Deleted Post"}
                                                </h3>
                                                {item.completed && (
                                                    <span className="text-[10px] sm:text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full shrink-0">
                                                        Read
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-muted-foreground mb-2">
                                                {formatDistanceToNow(new Date(item.lastReadAt), { addSuffix: true })}
                                            </p>

                                            {!item.completed && (
                                                <div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden max-w-[200px]">
                                                    <div
                                                        className="bg-primary h-full transition-all duration-300"
                                                        style={{ width: `${item.progress}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <History size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No reading history yet.</p>
                            <p className="text-sm">Stories you read will appear here.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
