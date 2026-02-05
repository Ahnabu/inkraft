"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils"; // Fixed utils path
import { PenTool, User as UserIcon } from "lucide-react";
// import { useSession } from "next-auth/react"; // Will uncomment when SessionProvider is added

export function Navbar() {
    const pathname = usePathname();
    // const { data: session } = useSession();
    const session = null; // Mock session for now until Provider is set up

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Explore", href: "/explore" },
        { name: "About", href: "/about" },
    ];

    return (
        <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <nav className="glass-card flex items-center justify-between px-6 py-3 w-full max-w-5xl rounded-full shadow-lg bg-white/70 backdrop-blur-md border border-white/20 dark:bg-black/50 dark:border-white/10">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary text-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                        <PenTool size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-cta bg-clip-text text-transparent">
                        Inkraft
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary relative",
                                pathname === item.href
                                    ? "text-primary font-semibold"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.name}
                            {pathname === item.href && (
                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Auth / Action */}
                <div className="flex items-center gap-4">
                    {session ? (
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <UserIcon size={20} />
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/api/auth/signin">
                                <Button variant="ghost" size="sm" className="hidden sm:inline-flex rounded-full">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/api/auth/signin?type=register">
                                <Button size="sm" className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white shadow-md">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
