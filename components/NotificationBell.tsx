"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Archive, TrendingUp, FolderOpen, Megaphone } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type NotificationType =
    | "new_post"
    | "comment_reply"
    | "new_follower"
    | "series_update"
    | "category_post"
    | "upvote_milestone"
    | "admin_announcement";

type NotificationState = "unread" | "read" | "archived";

interface Notification {
    _id: string;
    type: NotificationType;
    state: NotificationState;
    actor?: { _id: string; name: string; image?: string };
    post?: { _id: string; title: string; slug: string };
    category?: string;
    message?: string;
    read: boolean; // Legacy field
    batchCount?: number;
    createdAt: string;
}

export function NotificationBell() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch notifications
    const fetchNotifications = async () => {
        if (!session?.user) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/notifications?limit=10&includeArchived=${showArchived}`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAllRead: true }),
            });
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true, state: "read" as NotificationState })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    // Archive notification
    const archiveNotification = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: [id], state: "archived" }),
            });
            setNotifications((prev) => prev.filter((n) => n._id !== id));
        } catch (error) {
            console.error("Failed to archive notification:", error);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch on mount and when opened
    useEffect(() => {
        if (session?.user) {
            fetchNotifications();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user]);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, showArchived]);

    if (!session?.user) return null;

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case "upvote_milestone":
                return <TrendingUp size={14} className="text-green-500" />;
            case "category_post":
                return <FolderOpen size={14} className="text-blue-500" />;
            case "admin_announcement":
                return <Megaphone size={14} className="text-orange-500" />;
            default:
                return <Bell size={14} className="text-muted-foreground" />;
        }
    };

    const getNotificationText = (n: Notification) => {
        const batchSuffix = n.batchCount && n.batchCount > 1 ? ` (+${n.batchCount - 1} more)` : "";

        switch (n.type) {
            case "new_post":
                return `${n.actor?.name || "Someone"} published a new post${batchSuffix}`;
            case "comment_reply":
                return `${n.actor?.name || "Someone"} replied to your comment${batchSuffix}`;
            case "new_follower":
                return `${n.actor?.name || "Someone"} started following you${batchSuffix}`;
            case "series_update":
                return `New part added to a series you follow${batchSuffix}`;
            case "category_post":
                return `New post in ${n.category || "a category you follow"}${batchSuffix}`;
            case "upvote_milestone":
                return n.message || `Your post reached a milestone!`;
            case "admin_announcement":
                return n.message || "Important announcement";
            default:
                return n.message || "New notification";
        }
    };

    const getNotificationLink = (n: Notification) => {
        if (n.post?.slug) return `/blog/${n.post.slug}`;
        if (n.category) return `/category/${n.category}`;
        if (n.actor?._id) return `/profile/${n.actor._id}`;
        return "#";
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed left-4 right-4 top-20 md:absolute md:left-auto md:right-0 md:top-12 z-50 md:w-80 max-h-[calc(100vh-6rem)] md:max-h-[400px] overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/95 backdrop-blur-md shadow-lg animate-in fade-in-0 zoom-in-95 text-zinc-900 dark:text-zinc-100">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                        <h3 className="font-semibold">Notifications</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowArchived(!showArchived)}
                                className={`p-1 rounded hover:bg-muted transition-colors ${showArchived ? "text-primary" : "text-muted-foreground"}`}
                                title={showArchived ? "Hide archived" : "Show archived"}
                            >
                                <Archive size={14} />
                            </button>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <Check size={12} />
                                    Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications list */}
                    <div className="overflow-y-auto max-h-[320px]">
                        {loading && notifications.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                                Loading...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <Link
                                    key={notification._id}
                                    href={getNotificationLink(notification)}
                                    onClick={() => setIsOpen(false)}
                                    className={`block p-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0 group ${notification.state === "unread" || !notification.read ? "bg-primary/5" : ""
                                        } ${notification.state === "archived" ? "opacity-60" : ""}`}
                                >
                                    <div className="flex gap-3">
                                        {/* Avatar/Icon */}
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                            {notification.actor?.image ? (
                                                <img
                                                    src={notification.actor.image}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                getNotificationIcon(notification.type)
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm line-clamp-2">
                                                {getNotificationText(notification)}
                                            </p>
                                            {notification.post?.title && (
                                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                    {notification.post.title}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatTime(notification.createdAt)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex-shrink-0 flex items-start gap-1">
                                            {notification.state !== "archived" && (
                                                <button
                                                    onClick={(e) => archiveNotification(notification._id, e)}
                                                    className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Archive"
                                                >
                                                    <Archive size={12} className="text-muted-foreground" />
                                                </button>
                                            )}
                                            {(notification.state === "unread" || !notification.read) && (
                                                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

