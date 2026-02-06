import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
                        {/* Platform Links */}
                        <div className="flex flex-col">
                            <h3 className="font-semibold mb-3 text-sm md:text-base text-foreground">Platform</h3>
                            <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/explore" className="hover:text-primary transition-colors inline-block">Explore</Link></li>
                                <li><Link href="/pricing" className="hover:text-primary transition-colors inline-block">Pricing</Link></li>
                                <li><Link href="/features" className="hover:text-primary transition-colors inline-block">Features</Link></li>
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div className="flex flex-col">
                            <h3 className="font-semibold mb-3 text-sm md:text-base text-foreground">Company</h3>
                            <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/about" className="hover:text-primary transition-colors inline-block">About Us</Link></li>
                                <li><Link href="/blog" className="hover:text-primary transition-colors inline-block">Careers</Link></li>
                                <li><Link href="/contact" className="hover:text-primary transition-colors inline-block">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div className="flex flex-col">
                            <h3 className="font-semibold mb-3 text-sm md:text-base text-foreground">Connect</h3>
                            <div className="flex items-center gap-3">
                                <a
                                    href="#"
                                    className="p-2 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                                    aria-label="GitHub"
                                >
                                    <Github size={20} />
                                </a>
                                <a
                                    href="#"
                                    className="p-2 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                                    aria-label="Twitter"
                                >
                                    <Twitter size={20} />
                                </a>
                                <a
                                    href="#"
                                    className="p-2 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin size={20} />
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
