
"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BarChart3,
    Plus,
    Settings,
    FileText,
    Bookmark,
    StickyNote,
    Layers
} from "lucide-react";

import { DashboardStats } from "./DashboardStats";
import { DashboardPosts } from "./DashboardPosts";
import { DashboardSaved } from "./DashboardSaved";
import { DashboardNotes } from "./DashboardNotes";
import { CategoryManager } from "@/components/CategoryManager";

interface DashboardClientProps {
    user: any;
    posts: any[];
    savedPosts: any[];
    notes: any[];
    stats: any;
}

export function DashboardClient({ user, posts, savedPosts, notes, stats }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<"posts" | "saved" | "notes" | "categories">("posts");

    const tabs = [
        { id: "posts", label: "My Content", icon: FileText },
        { id: "saved", label: "Saved Posts", icon: Bookmark },
        { id: "notes", label: "My Notes", icon: StickyNote },
    ] as const;

    // Add Category tab for admins
    const allTabs = user.role === 'admin'
        ? [...tabs, { id: "categories", label: "Categories", icon: Layers }]
        : tabs;

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Welcome back, {user.name}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                        <Link
                            href="/dashboard/analytics"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
                        >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Detailed Analytics
                        </Link>
                        <Link
                            href="/new"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Post
                        </Link>
                        <Link
                            href="/settings"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 border border-zinc-200 dark:border-input bg-white dark:bg-transparent hover:bg-zinc-100 dark:hover:bg-accent hover:text-zinc-900 dark:hover:text-accent-foreground text-zinc-900 dark:text-zinc-100 shadow-sm dark:shadow-none"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Link>
                    </div>
                </div>

                {/* Always Visible Stats */}
                <DashboardStats user={user} stats={stats} />

                {/* Tabs Navigation */}
                <div className="mb-6 border-b border-border overflow-x-auto scrollbar-hide">
                    <div className="flex min-w-max space-x-2">
                        {allTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`
                                        flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                                        ${isActive
                                            ? "border-primary text-primary"
                                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                                        }
                                    `}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in-50 duration-300">
                    {activeTab === "posts" && <DashboardPosts posts={posts} />}
                    {activeTab === "saved" && <DashboardSaved savedPosts={savedPosts} userId={user._id} />}
                    {activeTab === "notes" && <DashboardNotes notes={notes} />}
                    {activeTab === "categories" && user.role === 'admin' && <CategoryManager />}
                </div>
            </div>
        </div>
    );
}
