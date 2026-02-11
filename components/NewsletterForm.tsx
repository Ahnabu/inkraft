"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setIsSuccess(true);
            toast.success("Subscribed successfully!");
            setEmail("");
        } catch (error: any) {
            toast.error(error.message || "Failed to subscribe");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className={cn("p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-4", className)}>
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-primary" size={24} />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-foreground">You're subscribed!</h3>
                    <p className="text-sm text-muted-foreground">Thank you for joining our newsletter.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm", className)}>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="space-y-2 max-w-md text-center md:text-left">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center justify-center md:justify-start gap-2">
                        <Mail size={20} className="text-primary" />
                        Subscribe to our newsletter
                    </h3>
                    <p className="text-muted-foreground">
                        Get the latest articles, tutorials, and tech insights delivered directly to your inbox. No spam, ever.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-all"
                        required
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading} className="shrink-0">
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Subscribe"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
