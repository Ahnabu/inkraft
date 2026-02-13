"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@/components/Editor";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { calculateReadingTime } from "@/lib/readingTime";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useDraftRestoration } from "@/lib/hooks/useDraftRestoration";

interface EditPostPageProps {
    params: Promise<{ slug: string }>;
}

export default function EditPostPage({ params: paramsPromise }: EditPostPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [originalSlug, setOriginalSlug] = useState("");
    const [postId, setPostId] = useState("");

    // Post fields
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState<"Beginner" | "Intermediate" | "Advanced" | "">("");

    // SEO fields
    const [slug, setSlug] = useState("");
    const [seoData, setSeoData] = useState({
        title: "",
        description: "",
        keywords: [] as string[],
        canonical: "",
        ogImage: "",
    });

    // Load existing post data
    useEffect(() => {
        async function loadPost() {
            try {
                const params = await paramsPromise;
                setOriginalSlug(params.slug);

                const response = await fetch(`/api/posts/${params.slug}`);
                if (!response.ok) throw new Error("Post not found");

                const post = await response.json();

                setPostId(post._id);
                setTitle(post.title);
                setSubtitle(post.subtitle || "");
                setContent(post.content);
                setCoverImage(post.coverImage || "");
                setCategory(post.category);
                setTags(post.tags?.join(", ") || "");
                setDifficultyLevel(post.difficultyLevel || "");
                setSlug(post.slug);
                setSeoData({
                    title: post.seo?.title || post.title,
                    description: post.seo?.description || "",
                    keywords: post.seo?.keywords || [],
                    canonical: post.seo?.canonical || "",
                    ogImage: post.seo?.ogImage || "",
                });

                setLoading(false);
            } catch (_error) {
                toast.error("Failed to load post");
                router.push("/dashboard");
            }
        }

        loadPost();
        loadPost();
    }, [paramsPromise, router]);

    // Draft Restoration
    useDraftRestoration(originalSlug ? `inkraft-edit-${originalSlug}` : "", (draft: any) => {
        // Only restore if the draft is different?
        // For now, simple overwrite on restore
        setTitle(draft.title || "");
        setSubtitle(draft.subtitle || "");
        setContent(draft.content || "");
        setCoverImage(draft.coverImage || "");
        setCategory(draft.category || "");
        setTags(draft.tags || "");
        setDifficultyLevel(draft.difficultyLevel || "");
        // slug is usually fixed in edit, but if they changed it in draft:
        if (draft.slug) setSlug(draft.slug);
        setSeoData(draft.seoData || {
            title: draft.metaTitle || "",
            description: draft.metaDescription || "",
            keywords: [],
            canonical: "",
            ogImage: ""
        });
    });

    const handleAutoSave = useCallback(async () => {
        if (!originalSlug) return;

        // Auto-save to localStorage
        const draft = {
            title,
            subtitle,
            content,
            coverImage,
            category,
            tags,
            difficultyLevel,
            slug,
            seoData,
            savedAt: new Date().toISOString(),
        };
        localStorage.setItem(`inkraft-edit-${originalSlug}`, JSON.stringify(draft));
        setLastSaved(new Date());
    }, [title, subtitle, content, coverImage, category, tags, difficultyLevel, slug, seoData, originalSlug]);

    const handleUpdate = async (publishNow: boolean) => {
        if (!title || !content || !slug || !category || !originalSlug) {
            toast.error("Please fill in title, content, slug, and category");
            return;
        }

        setSaving(true);
        toast.loading(publishNow ? "Updating and publishing post..." : "Updating draft...", {
            id: "update-post",
        });

        try {
            const readingTime = calculateReadingTime(content);
            const tagsArray = tags.split(",").map(tag => tag.trim()).filter(Boolean);

            const response = await fetch(`/api/posts/${originalSlug}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    subtitle,
                    slug,
                    content,
                    excerpt: seoData.description || content.substring(0, 300).replace(/<[^>]*>/g, ""),
                    coverImage,
                    category,
                    tags: tagsArray,
                    difficultyLevel: difficultyLevel || undefined,
                    readingTime,
                    published: publishNow,
                    seo: seoData,
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            localStorage.removeItem(`inkraft-edit-${originalSlug}`);
            const post = await response.json();
            toast.success(publishNow ? "Post updated and published!" : "Draft updated!", {
                id: "update-post",
            });
            setTimeout(() => {
                router.push(`/blog/${post.slug}`);
            }, 500);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to save post";
            toast.error(message, { id: "update-post" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => router.back()}
                        variant="ghost"
                        size="sm"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Article</h1>
                        <p className="text-muted-foreground mt-1">
                            Update your published article
                        </p>
                    </div>
                </div>
                {lastSaved && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Save size={14} />
                        <span>Saved {lastSaved.toLocaleTimeString()}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Subtitle */}
                    <GlassCard className="space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Article Title"
                            className="w-full text-4xl font-bold bg-transparent border-none focus:outline-none placeholder:text-muted-foreground"
                        />
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Subtitle (optional)"
                            className="w-full text-xl text-muted-foreground bg-transparent border-none focus:outline-none placeholder:text-muted-foreground"
                        />
                    </GlassCard>

                    {/* Editor */}
                    <Editor
                        content={content}
                        onChange={setContent}
                        onAutoSave={handleAutoSave}
                        placeholder="Continue writing your story..."
                        initialSeo={seoData}
                        onSeoChange={(newSeo) => setSeoData({
                            title: newSeo.title || "",
                            description: newSeo.description || "",
                            keywords: newSeo.keywords || [],
                            canonical: newSeo.canonical || "",
                            ogImage: newSeo.ogImage || "",
                        })}
                        postId={postId}
                    />
                </div>

                {/* Sidebar - 1/3 width */}
                <div className="space-y-6">
                    {/* SEO Panel */}
                    {/* Post Settings */}
                    <GlassCard className="space-y-4">
                        <h3 className="font-bold">Post Settings</h3>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                URL Slug
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">/blog/</span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))}
                                    placeholder="article-slug"
                                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Category *
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                            >
                                <option value="">Select a category</option>
                                {DEFAULT_CATEGORIES.map((cat) => (
                                    <option key={cat.slug} value={cat.slug}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="nextjs, typescript, tutorial"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                            />
                        </div>

                        {/* Difficulty Level */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Difficulty Level
                            </label>
                            <select
                                value={difficultyLevel}
                                onChange={(e) => setDifficultyLevel(e.target.value as any)}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                            >
                                <option value="">Select difficulty</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <h3 className="font-bold">Post Settings</h3>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Category *
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select a category</option>
                                {DEFAULT_CATEGORIES.map((cat) => (
                                    <option key={cat.slug} value={cat.slug}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="nextjs, typescript, tutorial"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Difficulty Level */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Difficulty Level
                            </label>
                            <select
                                value={difficultyLevel}
                                onChange={(e) => setDifficultyLevel(e.target.value as "Beginner" | "Intermediate" | "Advanced" | "")}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Not specified</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Cover Image URL
                            </label>
                            <input
                                type="url"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {coverImage && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                                    <img src={coverImage} alt="Cover preview" className="w-full h-32 object-cover" />
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Actions */}
                    <GlassCard className="flex flex-col gap-3">
                        <Button
                            onClick={() => handleUpdate(true)}
                            disabled={saving}
                            variant="primary"
                            className="w-full"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={16} />
                                    Updating...
                                </>
                            ) : (
                                "Update & Publish"
                            )}
                        </Button>
                        <Button
                            onClick={() => handleUpdate(false)}
                            disabled={saving}
                            variant="outline"
                            className="w-full"
                        >
                            Save as Draft
                        </Button>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
