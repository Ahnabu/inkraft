"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
    Settings,
    LogOut,
    LayoutDashboard,
    Shield,
    Clock,
    Users
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function UserNav() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const user = session?.user;

    // Toggle dropdown
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!user) return null;

    // Generate initials for avatar fallback
    const initials = user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "U";

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Trigger */}
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border bg-muted flex items-center justify-center">
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={user.name || "User avatar"}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="font-medium text-sm text-foreground">
                            {initials}
                        </span>
                    )}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (

                <div className="absolute right-0 top-12 z-50 min-w-[14rem] overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/95 backdrop-blur-md text-zinc-900 dark:text-zinc-100 shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                    {/* User Header */}
                    <div className="flex flex-col space-y-1 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                        <p className="text-sm font-medium leading-none max-w-[12rem] truncate">
                            {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground max-w-[12rem] truncate">
                            {user.email}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-1.5 flex flex-col gap-0.5">
                        <Link
                            href="/dashboard"
                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                            onClick={() => setIsOpen(false)}
                        >
                            <LayoutDashboard className="mr-2.5 h-4 w-4 text-muted-foreground" />
                            Dashboard
                        </Link>

                        <Link
                            href="/history"
                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                            onClick={() => setIsOpen(false)}
                        >
                            <Clock className="mr-2.5 h-4 w-4 text-muted-foreground" />
                            Reading History
                        </Link>

                        <Link
                            href="/following"
                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                            onClick={() => setIsOpen(false)}
                        >
                            <Users className="mr-2.5 h-4 w-4 text-muted-foreground" />
                            Following
                        </Link>

                        {/* Admin Link - Only visible for admins */}
                        {user.role === 'admin' && (
                            <Link
                                href="/admin"
                                className="relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-primary font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                <Shield className="mr-2.5 h-4 w-4" />
                                Admin Panel
                            </Link>
                        )}

                        <Link
                            href="/settings"
                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
                            Settings
                        </Link>

                        <div className="h-px bg-border my-1" />

                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="relative flex w-full cursor-pointer select-none items-center rounded-lg px-2.5 py-2 text-sm outline-none transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 dark:hover:text-red-400"
                        >
                            <LogOut className="mr-2.5 h-4 w-4" />
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
