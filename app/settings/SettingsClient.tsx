"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SettingsClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        website: "",
        twitter: "",
        linkedin: "",
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            fetchUserData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const fetchUserData = async () => {
        try {
            const res = await fetch(`/api/user/${session?.user?.id}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name || "",
                    bio: data.bio || "",
                    website: data.socialLinks?.website || "",
                    twitter: data.socialLinks?.twitter || "",
                    linkedin: data.socialLinks?.linkedin || "",
                });
            }
        } catch (err) {
            console.error("Failed to fetch user data:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch(`/api/user/${session?.user?.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    bio: formData.bio,
                    socialLinks: {
                        website: formData.website || undefined,
                        twitter: formData.twitter || undefined,
                        linkedin: formData.linkedin || undefined,
                    },
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to update profile");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/dashboard"
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <p className="text-muted-foreground">
                            Manage your profile and preferences
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card rounded-xl border border-border p-6">
                        <h2 className="text-xl font-bold mb-6">Profile Information</h2>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Bio
                                <span className="text-muted-foreground font-normal ml-2">
                                    (Optional)
                                </span>
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) =>
                                    setFormData({ ...formData, bio: e.target.value })
                                }
                                rows={4}
                                maxLength={500}
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {formData.bio.length}/500 characters
                            </p>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border p-6">
                        <h2 className="text-xl font-bold mb-6">Social Links</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Website</label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) =>
                                    setFormData({ ...formData, website: e.target.value })
                                }
                                placeholder="https://yourwebsite.com"
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Twitter Username
                            </label>
                            <div className="flex items-center">
                                <span className="px-4 py-2 bg-muted border border-r-0 border-border rounded-l-lg text-muted-foreground">
                                    @
                                </span>
                                <input
                                    type="text"
                                    value={formData.twitter}
                                    onChange={(e) =>
                                        setFormData({ ...formData, twitter: e.target.value })
                                    }
                                    placeholder="username"
                                    className="flex-1 px-4 py-2 rounded-r-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                LinkedIn URL
                            </label>
                            <input
                                type="url"
                                value={formData.linkedin}
                                onChange={(e) =>
                                    setFormData({ ...formData, linkedin: e.target.value })
                                }
                                placeholder="https://l inkedin.com/in/username"
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {success && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
                            Profile updated successfully! Redirecting to dashboard...
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
