"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

const publicationSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

type PublicationFormValues = z.infer<typeof publicationSchema>;

export default function CreatePublicationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PublicationFormValues>({
        resolver: zodResolver(publicationSchema),
    });

    const onSubmit = async (data: PublicationFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/publications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to create publication");
            }

            toast.success("Publication created successfully!");
            router.push(`/dashboard/publications`);
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto px-4 py-12">
            <Link
                href="/dashboard/publications"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft size={16} className="mr-1" />
                Back to Dashboard
            </Link>

            <GlassCard className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create a Publication</h1>
                    <p className="text-muted-foreground">
                        Start your own multi-author blog or newsletter.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Publication Name
                        </label>
                        <input
                            {...register("name")}
                            id="name"
                            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="e.g., The Tech Daily"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="slug" className="text-sm font-medium">
                            URL Slug
                        </label>
                        <div className="flex items-center">
                            <span className="px-3 py-2 bg-muted border border-r-0 border-input rounded-l-md text-muted-foreground text-sm">
                                inkraft.com/publication/
                            </span>
                            <input
                                {...register("slug")}
                                id="slug"
                                className="flex-1 px-3 py-2 bg-background border border-input rounded-r-md focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="the-tech-daily"
                            />
                        </div>
                        {errors.slug && (
                            <p className="text-sm text-red-500">{errors.slug.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                            Description (Optional)
                        </label>
                        <textarea
                            {...register("description")}
                            id="description"
                            rows={3}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                            placeholder="A brief description of your publication..."
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Publication"
                            )}
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}
