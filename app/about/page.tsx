import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, Users, Target, Zap, TrendingUp, Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Inkraft | The Modern Blogging Platform for Developers & Writers",
    description: "Inkraft is the premier editorial blogging platform for developers, tech writers, and startups. A SEO-optimized content platform with markdown support and built-in analytics.",
    keywords: [
        "developer blogging platform",
        "tech blogging platform",
        "writing platform for creators",
        "startup blog platform",
        "editorial platform",
        "markdown blog editor"
    ],
    openGraph: {
        title: "About Inkraft - The Modern Blogging Platform",
        description: "The professional publishing platform for developers, startups, and expert writers.",
        type: "website",
        url: "/about",
    },
    alternates: {
        canonical: "/about",
    },
};

export default function AboutPage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-primary/5 py-20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            The Modern <span className="text-primary">Publishing Platform</span> for Tech & Creativity
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                            Inkraft is the editorial blogging platform for developers, writers, and startups who value quality, SEO, and ownership.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Built for Content Creators</h2>
                    <GlassCard className="p-8">
                        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                            We built Inkraft to be the best **blogging platform for writers** and **developers** alike.
                            Unlike generic CMSs, Inkraft is a dedicated **editorial platform** focused on long-form content,
                            clean typography, and technical excellence.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Whether you're a startup building a **company blog**, a developer sharing code tutorials,
                            or an expert writer publishing deep-dive analysis, our **SEO-optimized platform** ensures your
                            voice reaches the right audience.
                        </p>
                    </GlassCard>
                </div>
            </section>

            {/* Core Values */}
            <section className="container mx-auto px-4 py-16 bg-muted/30">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Inkraft?</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <GlassCard className="p-6 text-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="text-primary" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">SEO Optimized</h3>
                        <p className="text-muted-foreground">
                            A fully **SEO-friendly blogging platform** out of the box. Structured data, sitemaps, and performance tuning help you rank higher.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-6 text-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="text-primary" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Developer Friendly</h3>
                        <p className="text-muted-foreground">
                            The ideal **developer blogging platform**. Write in Markdown, paste code snippets with syntax highlighting, and enjoy a clean writing experience.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-6 text-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="text-primary" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Community & Growth</h3>
                        <p className="text-muted-foreground">
                            More than just a tool, Inkraft is a **multi-author blogging platform** where you can connect with other expert writers and grow your audience.
                        </p>
                    </GlassCard>
                </div>
            </section>

            {/* Platform Features */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Platform Features</h2>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <GlassCard className="p-6">
                        <Target className="text-primary mb-3" size={28} />
                        <h3 className="text-xl font-bold mb-2">Technical SEO Built-In</h3>
                        <p className="text-muted-foreground">
                            Automated meta tags, canonical URLs, and OpenGraph support make us a top choice for a **technical SEO blogging platform**.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <Zap className="text-primary mb-3" size={28} />
                        <h3 className="text-xl font-bold mb-2">Markdown Editor</h3>
                        <p className="text-muted-foreground">
                            A powerful **blog editor with markdown support** designed for efficiency. Focus on writing while we handle the formatting.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <TrendingUp className="text-primary mb-3" size={28} />
                        <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                        <p className="text-muted-foreground">
                            Track your performance with our **blog analytics platform**. Understand reader engagement and optimize your content strategy.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <Users className="text-primary mb-3" size={28} />
                        <h3 className="text-xl font-bold mb-2">Author Portfolio</h3>
                        <p className="text-muted-foreground">
                            Build your personal brand with a beautiful **author profile blog**. Showcase your best work and establish authority in your niche.
                        </p>
                    </GlassCard>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-primary/5 rounded-3xl p-12 text-center border border-primary/30 shadow-2xl max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Share Your Story?</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join Inkraft today and connect with readers who appreciate quality content.
                    </p>
                    <Link
                        href="/auth/register"
                        className="inline-block px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 hover:scale-105"
                    >
                        Start Writing
                    </Link>
                </div>
            </section>
        </main>
    );
}
