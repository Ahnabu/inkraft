"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                const errorMsg = "Invalid email or password";
                setError(errorMsg);
                toast.error(errorMsg);
            } else if (result?.ok) {
                toast.success("Successfully signed in! Redirecting...");
                // Successful sign in - redirect
                setTimeout(() => {
                    window.location.href = callbackUrl;
                }, 500);
                return; // Don't set loading to false, page is redirecting
            }
        } catch (_error) {
            const errorMsg = "Something went wrong. Please try again.";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        toast.loading("Redirecting to Google...");
        try {
            await signIn("google", { 
                callbackUrl,
                redirect: true,
            });
        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.error("Failed to sign in with Google");
            setLoading(false);
        }
    };

    return (
        <GlassCard className="w-full max-w-md space-y-8 p-8">
            <div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Or{" "}
                    <Link
                        href="/auth/register"
                        className="font-medium text-primary hover:text-primary/80"
                    >
                        create a new account
                    </Link>
                </p>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 text-center">
                    {error}
                </div>
            )}

            <div className="mt-8 space-y-6">
                <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full relative"
                    disabled={loading}
                >
                    <svg
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="google"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                    >
                        <path
                            fill="currentColor"
                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        ></path>
                    </svg>
                    Sign in with Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-3 text-foreground font-medium">
                            Or continue with
                        </span>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleCredentialsSignIn}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="relative block w-full rounded-md border-0 bg-secondary/50 py-1.5 px-3 ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="relative block w-full rounded-md border-0 bg-secondary/50 py-1.5 px-3 ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </GlassCard>
    );
}

export default function SignInPage() {
    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="text-center">Loading...</div>}>
                <SignInContent />
            </Suspense>
        </div>
    );
}
