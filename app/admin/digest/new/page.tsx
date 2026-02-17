"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Plus, Search, X, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

interface Post {
    _id: string;
    title: string;
    slug: string;
    coverImage?: string;
    publishedAt: string;
}

interface DigestFormData {
    title: string;
    slug: string;
    description: string;
    published: boolean;
}

export default function NewDigestPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Post[]>([]);
    const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
    const [editorPickIds, setEditorPickIds] = useState<Set<string>>(new Set());

    // Initial fetch of recent posts for selection
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DigestFormData>({
        defaultValues: {
            published: false
        }
    });

    const title = watch("title");

    // Auto-generate slug from title
    useEffect(() => {
        if (title) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            setValue("slug", slug);
        }
    }, [title, setValue]);

    // Fetch posts for selection
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/admin/posts?limit=20&published=true&search=${searchQuery}`);
                const data = await res.json();
                if (data.posts) {
                    if (searchQuery) {
                        setSearchResults(data.posts);
                    } else {
                        setRecentPosts(data.posts);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch posts", error);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchPosts();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleAddPost = (post: Post) => {
        if (!selectedPosts.find(p => p._id === post._id)) {
            setSelectedPosts([...selectedPosts, post]);
        }
        setSearchQuery(""); // Clear search
    };

    const handleRemovePost = (postId: string) => {
        setSelectedPosts(selectedPosts.filter(p => p._id !== postId));
        const newPicks = new Set(editorPickIds);
        newPicks.delete(postId);
        setEditorPickIds(newPicks);
    };

    const toggleEditorPick = (postId: string) => {
        const newPicks = new Set(editorPickIds);
        if (newPicks.has(postId)) {
            newPicks.delete(postId);
        } else {
            newPicks.add(postId);
        }
        setEditorPickIds(newPicks);
    };

    const onSubmit = async (data: DigestFormData) => {
        if (selectedPosts.length === 0) {
            toast.error("Please add at least one post to the digest");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/digest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    posts: selectedPosts.map(p => p._id),
                    editorPicks: Array.from(editorPickIds)
                }),
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(error);
            }

            toast.success("Digest created successfully");
            router.push("/admin/digest");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create digest");
        } finally {
            setIsLoading(false);
        }
    };

    const displayPosts = searchQuery ? searchResults : recentPosts;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Create New Digest</h1>
                <p className="text-muted-foreground">Curate the best content for your readers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form id="digest-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <GlassCard className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 pl-1">Title</label>
                                <Input
                                    {...register("title", { required: "Title is required" })}
                                    placeholder="e.g., Weekly Digest #42: The Future of AI"
                                    className="text-2xl font-bold bg-transparent border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground placeholder:text-lg placeholder:font-normal h-auto py-3"
                                />
                                {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 pl-1">Slug</label>
                                <Input
                                    {...register("slug", { required: "Slug is required" })}
                                    readOnly
                                    className="bg-muted/50 border-none shadow-none text-muted-foreground"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 pl-1">Description</label>
                                <Textarea
                                    {...register("description")}
                                    className="min-h-[100px] bg-transparent border-none shadow-none focus-visible:ring-0 px-0 resize-none text-base text-muted-foreground py-3"
                                    placeholder="A brief intro to this week's highlights..."
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="published"
                                    {...register("published")}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="published" className="text-sm font-medium">Publish immediately</label>
                            </div>
                        </GlassCard>

                        {/* Selected Posts Management */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Selected Posts ({selectedPosts.length})</h2>
                            <p className="text-sm text-muted-foreground">
                                Order matters. Click the star to mark as "Editor's Pick".
                            </p>

                            {selectedPosts.length === 0 ? (
                                <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground bg-muted/30">
                                    No posts selected yet. Search and add posts from the sidebar.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {selectedPosts.map((post, index) => (
                                        <div key={post._id} className="flex items-center gap-3 p-3 rounded-lg border bg-card group">
                                            <span className="text-xs text-muted-foreground font-mono w-6">{index + 1}</span>
                                            {post.coverImage && (
                                                <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                                                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{post.title}</p>
                                                <p className="text-xs text-muted-foreground truncate">{post.slug}</p>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleEditorPick(post._id)}
                                                className={editorPickIds.has(post._id) ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-amber-500"}
                                                title="Toggle Editor's Pick"
                                            >
                                                <Star className={editorPickIds.has(post._id) ? "fill-current" : ""} size={18} />
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemovePost(post._id)}
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <X size={18} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Digest"
                                )}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.back()} className="w-full">
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Sidebar - Post Selector */}
                <div className="space-y-4">
                    <div className="sticky top-24">
                        <h2 className="text-lg font-semibold mb-4">Add Posts</h2>
                        <div className="relative mb-4">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-card border-border"
                            />
                        </div>

                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {displayPosts.map((post) => {
                                const isSelected = selectedPosts.some(p => p._id === post._id);
                                return (
                                    <button
                                        key={post._id}
                                        type="button"
                                        onClick={() => !isSelected && handleAddPost(post)}
                                        disabled={isSelected}
                                        className={`w-full text-left p-3 rounded-lg border transition-all ${isSelected
                                            ? "opacity-50 cursor-not-allowed bg-muted"
                                            : "hover:border-primary/50 hover:bg-muted/50 bg-card"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {post.coverImage && (
                                                <div className="relative w-8 h-8 rounded overflow-hidden shrink-0 mt-0.5">
                                                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium line-clamp-2">{post.title}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(post.publishedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {!isSelected && (
                                                <Plus className="ml-auto h-4 w-4 text-muted-foreground shrink-0" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}

                            {displayPosts.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-8">
                                    No posts found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
