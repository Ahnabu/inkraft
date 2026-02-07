import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, Users, Target, Zap, TrendingUp, Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Inkraft | Premium Tech Blog Platform",
    description: "Learn about Inkraft - a premium blogging platform for tech writers. Discover our mission to provide quality content on AI, Programming, Cybersecurity, and Web Development with strong SEO and community engagement.",
    keywords: ["about inkraft", "inkraft platform", "tech blog platform", "blogging community", "quality tech writing"],
    openGraph: {
        title: "About Inkraft - Premium Tech Blog Platform",
        description: "Quality tech writing platform for AI, Programming & Web Development",
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
                            Welcome to <span className="text-primary">Inkraft</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                            A premium editorial platform where quality writing meets engaged readers.
                            Built for authors who care about their craft and readers who value substance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Mission</h2>
                    <GlassCard className="p-8">
                        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                            Inkraft is designed for authors who take their writing seriously and readers who
                            appreciate thoughtful, well-crafted content. We believe that quality long-form
                            writing deserves a platform that respects both the creator and the audience.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Our platform combines powerful writing tools, strong SEO optimization, and
                            meaningful community engagement—all while ensuring authors maintain full ownership
                            and control of their work.
                        </p>
                    </GlassCard>
                </div>
            </section>

            {/* Core Values */}
            <section className="container mx-auto px-4 py-16 bg-muted/30">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What We Stand For</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <GlassCard className="p-6 text-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="text-primary" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Quality First</h3>
                        <p className="text-muted-foreground">
                            We prioritize depth and substance over viral clicks. Every feature is designed
                            to support thoughtful, well-researched content.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-6 text-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="text-primary" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Author Ownership</h3>
                        <p className="text-muted-foreground">
                            Your content is yours. Period. Authors have full control to create, edit,
                            and delete their posts at any time.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-6 text-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="text-primary" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Community Driven</h3>
                        <p className="text-muted-foreground">
                            Thoughtful engagement systems that reward quality contributions and foster
                            meaningful discussions.
                        </p>
                    </GlassCard>
                </div>
            </section>

            {/* Platform Features */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Platform Highlights</h2>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <GlassCard className="p-6">
                        <Target className="text-primary mb-3" size={28} />
                        <h3 className="text-xl font-bold mb-2">SEO-First Architecture</h3>
                        <p className="text-muted-foreground">
                            Built-in SEO optimization for every post. Custom meta tags, structured data,
                            and clean URLs ensure your content gets discovered.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <Zap className="text-primary mb-3" size={28} />
                        <h3 className="text-xl font-bold mb-2">Powerful Editor</h3>
                        <p className="text-muted-foreground">
                            Rich text editing with paste preservation, code blocks, tables, callouts,
                            and distraction-free writing mode.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <TrendingUp className="text-primary mb-3" size={28} />
                        <h3 className="text-xl font-bold mb-2">Smart Discovery</h3>
                        <p className="text-muted-foreground">
                            Algorithmic ranking balances quality, engagement, and recency to surface
                            the best content to the right readers.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <Users className="text-primary mb-3" size={28} />
                        <h3 className="text-xl font-bold mb-2">Author Dashboard</h3>
                        <p className="text-muted-foreground">
                            Comprehensive analytics, post management, and profile customization—all
                            in one clean interface.
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
