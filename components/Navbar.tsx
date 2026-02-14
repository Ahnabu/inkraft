"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { PenTool, Menu, X, Sun, Moon } from "lucide-react";
import { useSession } from "next-auth/react";
import { UserNav } from "@/components/UserNav";
import { NotificationBell } from "@/components/NotificationBell";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useFocusMode } from "@/lib/context/FocusModeContext";
import { Maximize2, Minimize2, Type, Minus, Plus } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const t = useTranslations("Navigation");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { setTheme, theme } = useTheme();
    const { isFocusMode, toggleFocusMode, fontSize, setFontSize } = useFocusMode();

    const fontSizes = ["small", "medium", "large", "xlarge"] as const;
    const currentSizeIndex = fontSizes.indexOf(fontSize as any);

    const decreaseFontSize = () => {
        if (currentSizeIndex > 0) {
            setFontSize(fontSizes[currentSizeIndex - 1]);
        }
    };

    const increaseFontSize = () => {
        if (currentSizeIndex < fontSizes.length - 1) {
            setFontSize(fontSizes[currentSizeIndex + 1]);
        }
    };

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Explore", href: "/explore" },
        { name: "About", href: "/about" },
    ];

    if (isFocusMode) {
        return (
            <div className="fixed top-4 right-4 z-50 flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                {/* Font Size Controls */}
                <div className="flex items-center gap-1 bg-background/50 backdrop-blur-md rounded-full border border-border shadow-sm p-1">
                    <button
                        onClick={decreaseFontSize}
                        className="p-2 rounded-full hover:bg-background transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                        title="Decrease font size"
                        disabled={currentSizeIndex <= 0}
                    >
                        <Minus size={16} />
                    </button>
                    <div className="flex items-center gap-1.5 px-1 min-w-[3rem] justify-center">
                        <Type size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium capitalize">{fontSize}</span>
                    </div>
                    <button
                        onClick={increaseFontSize}
                        className="p-2 rounded-full hover:bg-background transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                        title="Increase font size"
                        disabled={currentSizeIndex >= fontSizes.length - 1}
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="h-6 w-px bg-border/50 mx-1" />

                <button
                    onClick={toggleFocusMode}
                    className="p-3 bg-background/50 backdrop-blur-md rounded-full border border-border shadow-sm hover:bg-background transition-all group"
                    title="Exit Focus Mode"
                >
                    <Minimize2 size={20} className="text-muted-foreground group-hover:text-foreground" />
                </button>
            </div>
        );
    }

    return (
        <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 flex justify-center px-2 sm:px-4">
            <nav className="glass-card flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 w-full max-w-5xl rounded-2xl sm:rounded-[2rem] shadow-lg bg-white/70 backdrop-blur-md border border-white/20 dark:bg-black/50 dark:border-white/10 transition-all duration-300">

                {/* Top Bar: Logo + Mobile Toggle + Auth (Mobile) */}
                <div className="flex items-center justify-between w-full md:w-auto">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 z-50">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                            <Feather size={18} fill="currentColor" />
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden sm:block">
                            Inkraft
                        </span>
                    </Link>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-2 md:hidden">
                        {session && <NotificationBell />}
                        {session && <UserNav />}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

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
                            {t(item.name.toLowerCase())}
                            {pathname === item.href && (
                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth / Action */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 mr-2 border-r border-border/50 pr-4">
                        <LanguageSwitcher />
                        {pathname !== "/" && (
                            <button
                                onClick={toggleFocusMode}
                                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground relative"
                                title="Enter Focus Mode"
                            >
                                <Maximize2 size={20} />
                            </button>
                        )}
                        <button
                            onClick={() => theme === "dark" ? setTheme("light") : setTheme("dark")}
                            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground relative"
                            title="Toggle theme"
                        >
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:hidden" />
                            <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
                            <span className="sr-only">Toggle theme</span>
                        </button>
                    </div>

                    {session ? (
                        <div className="flex items-center gap-2">
                            <NotificationBell />
                            <UserNav />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/api/auth/signin">
                                <Button variant="ghost" size="sm" className="hidden sm:inline-flex rounded-full">
                                    {t('signIn')}
                                </Button>
                            </Link>
                            <Link href="/api/auth/signin?type=register">
                                <Button size="sm" className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white shadow-md">
                                    {t('getStarted')}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="w-full md:hidden pt-4 pb-2 flex flex-col gap-4 animate-in slide-in-from-top-4 fade-in-0">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
                                        pathname === item.href
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {t(item.name.toLowerCase())}
                                </Link>
                            ))}
                        </div>

                        {!session && (
                            <div className="flex flex-col gap-2 pt-2 border-t border-border">
                                <Link href="/api/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start rounded-lg">
                                        {t('signIn')}
                                    </Button>
                                </Link>
                                <Link href="/api/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary text-white">
                                        {t('getStarted')}
                                    </Button>
                                </Link>
                            </div>
                        )}
                        <div className="flex items-center justify-between px-4 py-2 border-t border-border mt-2">
                            <span className="text-sm font-medium text-muted-foreground">{t('language')}</span>
                            <LanguageSwitcher />
                        </div>
                        <div className="flex items-center justify-between px-4 py-2 border-t border-border mt-2">
                            <span className="text-sm font-medium text-muted-foreground">{t('theme')}</span>
                            <button
                                onClick={() => theme === "dark" ? setTheme("light") : setTheme("dark")}
                                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2"
                            >
                                <Sun className="h-5 w-5 dark:hidden" />
                                <Moon className="h-5 w-5 hidden dark:block" />
                                <span className="text-sm font-medium">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
