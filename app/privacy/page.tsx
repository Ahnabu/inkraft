import { GlassCard } from "@/components/ui/GlassCard";

export const metadata = {
    title: "Privacy Policy - Inkraft",
    description: "How Inkraft collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: February 6, 2026</p>

                <div className="space-y-8">
                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            At Inkraft, we take your privacy seriously. This Privacy Policy explains how we collect,
                            use, disclose, and safeguard your information when you use our platform. Please read this
                            privacy policy carefully. If you do not agree with the terms of this privacy policy, please
                            do not access the site.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Personal Information</h3>
                                <p>
                                    We collect information that you provide directly to us when you register for an account,
                                    create or modify your profile, post content, or communicate with us. This may include:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Name and email address</li>
                                    <li>Profile information (bio, profile picture, social links)</li>
                                    <li>Posts, comments, and other content you create</li>
                                    <li>Communications with us and other users</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Automatically Collected Information</h3>
                                <p>
                                    When you access our platform, we automatically collect certain information about your
                                    device and usage, including:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>IP address and browser type</li>
                                    <li>Pages visited and actions taken</li>
                                    <li>Referring/exit pages and timestamps</li>
                                    <li>Device information and operating system</li>
                                </ul>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process and complete transactions</li>
                            <li>Send you technical notices and support messages</li>
                            <li>Respond to your comments and questions</li>
                            <li>Monitor and analyze trends, usage, and activities</li>
                            <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                            <li>Personalize and improve your experience</li>
                        </ul>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            We do not sell your personal information. We may share your information in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li><strong>Public Content:</strong> Your posts and profile information are publicly visible</li>
                            <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                        </ul>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We implement appropriate technical and organizational security measures to protect your personal
                            information. However, no security system is impenetrable, and we cannot guarantee the security of
                            our systems 100%. In the event of a data breach, we will notify affected users in accordance with
                            applicable laws.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            Depending on your location, you may have the following rights:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Access and receive a copy of your personal information</li>
                            <li>Correct inaccurate or incomplete personal information</li>
                            <li>Delete your personal information</li>
                            <li>Object to or restrict certain processing of your information</li>
                            <li>Withdraw consent where we rely on it</li>
                        </ul>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use cookies and similar tracking technologies to track activity on our platform and hold certain
                            information. Cookies are files with small amounts of data. You can instruct your browser to refuse
                            all cookies or to indicate when a cookie is being sent.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at{" "}
                            <a href="mailto:privacy@inkraft.com" className="text-primary hover:underline">
                                privacy@inkraft.com
                            </a>
                        </p>
                    </GlassCard>
                </div>
            </div>
        </main>
    );
}
