"use client";

import { useState, useCallback } from "react";
import { Editor } from "@/components/Editor";
import { SEOPanel } from "@/components/SEOPanel";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { calculateReadingTime } from "@/lib/readingTime";
import { Loader2, Save } from "lucide-react";

export default function NewPostPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState<"Beginner" | "Intermediate" | "Advanced" | "">("");

    // SEO fields
    const [slug, setSlug] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const handleAutoSave = useCallback(async () => {
        // Save draft to localStorage
        const draft = {
            title,
            subtitle,
            content,
            coverImage,
            category,
            tags,
            difficultyLevel,
            slug,
            metaTitle,
            metaDescription,
            savedAt: new Date().toISOString(),
        };
        localStorage.setItem("inkraft-draft", JSON.stringify(draft));
        setLastSaved(new Date());
    }, [title, subtitle, content, coverImage, category, tags, difficultyLevel, slug, metaTitle, metaDescription]);

    const handlePublish = async (publishNow: boolean) => {
        if (!title || !content || !slug || !category) {
            alert("Please fill in title, content, slug, and category");
            return;
        }

        setLoading(true);

        try {
            const readingTime = calculateReadingTime(content);
            const tagsArray = tags.split(",").map(tag => tag.trim()).filter(Boolean);

            const response = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    subtitle,
                    slug,
                    content,
                    excerpt: metaDescription || content.substring(0, 300).replace(/<[^>]*>/g, ""),
                    coverImage,
                    category,
                    tags: tagsArray,
                    difficultyLevel: difficultyLevel || undefined,
                    readingTime,
                    published: publishNow,
                    seo: {
                        title: metaTitle || title,
                        description: metaDescription,
                    },
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            // Clear draft
            localStorage.removeItem("inkraft-draft");

            const post = await response.json();
            router.push(`/blog/${post.slug}`);
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Write a New Article</h1>
                    <p className="text-muted-foreground mt-1">
                        Share your knowledge with the Inkraft community
                    </p>
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
                        placeholder="Start writing your story..."
                    />
                </div>

                {/* Sidebar - 1/3 width */}
                <div className="space-y-6">
                    {/* SEO Panel */}
                    <SEOPanel
                        title={title}
                        slug={slug}
                        metaTitle={metaTitle}
                        metaDescription={metaDescription}
                        onSlugChange={setSlug}
                        onMetaTitleChange={setMetaTitle}
                        onMetaDescriptionChange={setMetaDescription}
                    />

                    {/* Post Settings */}
                    <GlassCard className="space-y-4">
                        <h3 className="font-bold">Post Settings</h3>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Category *
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                            onClick={() => handlePublish(true)}
                            disabled={loading}
                            variant="primary"
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={16} />
                                    Publishing...
                                </>
                            ) : (
                                "Publish Now"
                            )}
                        </Button>
                        <Button
                            onClick={() => handlePublish(false)}
                            disabled={loading}
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
