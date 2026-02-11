"use client";

import { useState, useEffect } from "react";
import { PostFeed } from "@/components/PostFeed";
import { Button } from "@/components/ui/Button";
import { Clock, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("reading_history");
        if (saved) {
            try {
                // Ensure IDs are strings and match PostFeed expectations
                const parsed = JSON.parse(saved).map((item: any) => ({
                    ...item,
                    _id: item.slug, // Use slug as ID for client-side list compatibility
                    author: {
                        _id: "history", // Mock ID
                        name: item.author?.name || "Unknown",
                        image: item.author?.image
                    }
                }));
                setHistory(parsed);
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
        setLoading(false);
    }, []);

    const clearHistory = () => {
        if (confirm("Are you sure you want to clear your reading history?")) {
            localStorage.removeItem("reading_history");
            setHistory([]);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Clock className="text-primary" />
                            Reading History
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Posts you've read recently on this device
                        </p>
                    </div>
                </div>
                {history.length > 0 && (
                    <Button
                        variant="outline"
                        onClick={clearHistory}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                    >
                        <Trash2 size={16} />
                        Clear History
                    </Button>
                )}
            </div>

            <PostFeed
                posts={history}
                layout="list"
                variant="compact"
                loading={loading}
                emptyMessage="You haven't read any posts yet. Go explore!"
                columns={2}
            />
        </div>
    );
}
