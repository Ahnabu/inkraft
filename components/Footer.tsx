"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { useFocusMode } from "@/lib/context/FocusModeContext";

export function Footer() {
    const { isFocusMode } = useFocusMode();

    if (isFocusMode) return null;

    return (
        <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-20">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row md:justify-between gap-8">
                    {/* Brand Section */}
                    <div className="flex flex-col items-start md:max-w-xs">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-cta bg-clip-text text-transparent">
                            Inkraft
                        </span>
                        <p className="mt-3 text-sm text-muted-foreground">
                            A content-first editorial platform for deep thinking and serious writing.
                        </p>
                    </div>

                    {/* Links Section - Grid layout on desktop, stack on mobile */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                        {/* Platform Links */}
                        <div className="flex flex-col">
                            <h3 className="font-semibold mb-3 text-sm md:text-base text-foreground">Platform</h3>
                            <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/explore" className="hover:text-primary transition-colors inline-block">Explore</Link></li>
                                <li><Link href="/new" className="hover:text-primary transition-colors inline-block">Write a Post</Link></li>
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div className="flex flex-col">
                            <h3 className="font-semibold mb-3 text-sm md:text-base text-foreground">Company</h3>
                            <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/about" className="hover:text-primary transition-colors inline-block">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-primary transition-colors inline-block">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div className="flex flex-col">
                            <h3 className="font-semibold mb-3 text-sm md:text-base text-foreground">Connect</h3>
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                                    aria-label="Facebook"
                                >
                                    <Facebook size={20} />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={20} />
                                </a>
                                <a
                                    href="https://threads.net"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                                    aria-label="Threads"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12.186 3.094c-2.167 0-3.97.857-5.348 2.548l1.483 1.03c1.03-1.266 2.336-1.896 3.865-1.896 1.483 0 2.67.63 3.52 1.87.85 1.24 1.275 2.91 1.275 5.01 0 2.1-.425 3.77-1.275 5.01-.85 1.24-2.037 1.87-3.52 1.87-1.483 0-2.67-.63-3.52-1.87-.85-1.24-1.275-2.91-1.275-5.01 0-.425.03-.85.09-1.275l-1.8-.18c-.09.485-.135.97-.135 1.455 0 2.55.605 4.59 1.815 6.12 1.21 1.53 2.835 2.295 4.875 2.295 2.04 0 3.665-.765 4.875-2.295 1.21-1.53 1.815-3.57 1.815-6.12 0-2.55-.605-4.59-1.815-6.12-1.21-1.53-2.835-2.295-4.875-2.295z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                                    aria-label="Twitter"
                                >
                                    <Twitter size={20} />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/sm-abu-horaira/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin size={20} />
                                </a>
                                <a
                                    href="https://github.com/Ahnabu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                                    aria-label="GitHub"
                                >
                                    <Github size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border/40">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs md:text-sm text-muted-foreground">
                        <p className="text-center sm:text-left">© {new Date().getFullYear()} Inkraft. All rights reserved.</p>
                        <div className="flex items-center gap-4 md:gap-6">
                            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            <span className="text-border">•</span>
                            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
