import { GlassCard } from "@/components/ui/GlassCard";

export const metadata = {
    title: "Terms of Service - Inkraft",
    description: "Terms and conditions for using the Inkraft blogging platform.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last updated: February 6, 2026</p>

                <div className="space-y-8">
                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using Inkraft, you agree to be bound by these Terms of Service and all applicable
                            laws and regulations. If you do not agree with any of these terms, you are prohibited from using
                            or accessing this site.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
                        <div className="space-y-3 text-muted-foreground leading-relaxed">
                            <p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Maintaining the confidentiality of your account and password</li>
                                <li>All activities that occur under your account</li>
                                <li>Notifying us immediately of any unauthorized use</li>
                            </ul>
                            <p className="mt-3">
                                We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.
                            </p>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Content Ownership and Rights</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Your Content</h3>
                                <p>
                                    You retain all ownership rights to the content you create and post on Inkraft. By posting
                                    content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce,
                                    distribute, and display your content on the platform.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Author Rights</h3>
                                <p>
                                    As an author, you have the right to create, edit, update, and delete your own posts at any time.
                                    You maintain full control and ownership of your content.
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Prohibited Activities</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            You agree not to engage in any of the following prohibited activities:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Posting false, inaccurate, misleading, or defamatory content</li>
                            <li>Violating any intellectual property rights</li>
                            <li>Transmitting harmful code, viruses, or malicious software</li>
                            <li>Harassing, intimidating, or threatening other users</li>
                            <li>Spamming or using the platform for commercial solicitation</li>
                            <li>Attempting to gain unauthorized access to the platform</li>
                            <li>Impersonating another person or entity</li>
                        </ul>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Content Moderation</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            While authors have full control over their posts, our administrators reserve the right to moderate,
                            edit, or remove any content that violates these terms, applicable laws, or community standards. We
                            also reserve the right to feature or unfeature posts at our discretion.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Comments and Engagement</h2>
                        <div className="space-y-3 text-muted-foreground leading-relaxed">
                            <p>When participating in comments and discussions:</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Be respectful and constructive</li>
                                <li>You can edit or delete your own comments</li>
                                <li>Administrators can delete any comment</li>
                                <li>Voting is limited to one vote per user per post</li>
                            </ul>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The Inkraft platform, including its design, features, and functionality, is owned by Inkraft and
                            protected by international copyright, trademark, and other intellectual property laws. You may not
                            duplicate, copy, or reuse any portion of the platform without our express written permission.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Inkraft is provided "as is" without warranties of any kind, either express or implied. We do not
                            guarantee that the platform will be uninterrupted, secure, or error-free. Your use of the platform
                            is at your own risk.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Inkraft shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                            resulting from your use or inability to use the platform. Our total liability shall not exceed the
                            amount you paid us in the past twelve months.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to modify these terms at any time. We will notify users of any material changes
                            via email or a notice on the platform. Your continued use of Inkraft after such modifications
                            constitutes your acceptance of the updated terms.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            For questions about these Terms of Service, please contact us at{" "}
                            <a href="mailto:legal@inkraft.com" className="text-primary hover:underline">
                                legal@inkraft.com
                            </a>
                        </p>
                    </GlassCard>
                </div>
            </div>
        </main>
    );
}
