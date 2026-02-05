import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-20">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-cta bg-clip-text text-transparent">
                            Inkraft
                        </span>
                        <p className="mt-4 text-sm text-muted-foreground">
                            A content-first editorial platform for deep thinking and serious writing.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/explore" className="hover:text-primary transition-colors">Explore</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 rounded-full hover:bg-accent hover:text-primary transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="#" className="p-2 rounded-full hover:bg-accent hover:text-primary transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="p-2 rounded-full hover:bg-accent hover:text-primary transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Inkraft. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
