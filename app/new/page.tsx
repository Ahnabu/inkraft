"use client";

import { useState, useCallback, useEffect } from "react";
import { Editor } from "@/components/Editor";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CategoryRequestDialog } from "@/components/CategoryRequestDialog";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { calculateReadingTime } from "@/lib/readingTime";
import { Loader2, Save } from "lucide-react";
import { ImageUploadButton } from "@/components/ImageUploadButton";
import { toast } from "sonner";
import { useDraftRestoration } from "@/lib/hooks/useDraftRestoration";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

function NewPostContent() {
    const t = useTranslations("Editor");
    const tDraft = useTranslations("Draft");
    const tCommon = useTranslations("Common");
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize from URL params
    const initialLocale = searchParams.get("locale") || "en";
    const translationId = searchParams.get("translationId") || "";

    const [locale, setLocale] = useState(initialLocale);

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

    const [loading, setLoading] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [draftId, setDraftId] = useState("");

    useEffect(() => {
        // Generate a stable ID for this draft session if not restoring
        // We can reuse the localStorage key logic or just create a random one
        // Ideally we persist this draftId in the saved draft
        setDraftId(`draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    }, []);

    // Publication logic
    const [publication, setPublication] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [userPublications, setUserPublications] = useState<any[]>([]);

    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const [pubRes, catRes] = await Promise.all([
                    fetch("/api/publications"),
                    fetch("/api/categories")
                ]);

                if (pubRes.ok) {
                    const data = await pubRes.json();
                    setUserPublications(data.publications || []);
                }

                if (catRes.ok) {
                    const data = await catRes.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch resources", error);
            }
        };
        fetchResources();
    }, []);

    // Draft Restoration
    useDraftRestoration("inkraft-draft", (draft: any) => {
        setTitle(draft.title || "");
        setSubtitle(draft.subtitle || "");
        setContent(draft.content || "");
        setCoverImage(draft.coverImage || "");
        setCategory(draft.category || "");
        setTags(draft.tags || "");
        setDifficultyLevel(draft.difficultyLevel || "");
        setSlug(draft.slug || "");
        setSeoData(draft.seoData || {
            title: draft.metaTitle || "",
            description: draft.metaDescription || "",
            keywords: [],
            canonical: "",
            ogImage: ""
        });
        setPublication(draft.publication || "");
        if (draft.draftId) setDraftId(draft.draftId);
    });

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
            seoData,
            publication,
            savedAt: new Date().toISOString(),
            draftId,
        };
        localStorage.setItem("inkraft-draft", JSON.stringify(draft));
        setLastSaved(new Date());
    }, [title, subtitle, content, coverImage, category, tags, difficultyLevel, slug, seoData, publication]);

    const handlePublish = async (publishNow: boolean) => {
        if (!title || !content || !slug || !category) {
            toast.error(tCommon("validationError") || "Please fill in title, content, slug, and category");
            return;
        }

        setLoading(true);
        toast.loading(publishNow ? t("publishing") : t("saving"), {
            id: "publish-post",
        });

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
                    excerpt: seoData.description || content.substring(0, 300).replace(/<[^>]*>/g, ""),
                    coverImage,
                    category,
                    tags: tagsArray,
                    difficultyLevel: difficultyLevel || undefined,
                    readingTime,
                    published: publishNow,
                    publication: publication || undefined,
                    seo: seoData,
                    locale,
                    translationId: translationId || undefined,
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            // Clear draft
            localStorage.removeItem("inkraft-draft");

            const post = await response.json();
            toast.success(publishNow ? t("publishSuccess") : tDraft("saved"), {
                id: "publish-post",
            });

            setTimeout(() => {
                router.push(`/blog/${post.slug}`);
            }, 500);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to create post";
            toast.error(message, { id: "publish-post" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{t("newArticleTitle")}</h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">
                        {t("newArticleSubtitle")}
                    </p>
                </div>
                {lastSaved && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full self-start md:self-auto">
                        <Save size={14} />
                        <span>{tDraft("lastSaved", { date: lastSaved.toLocaleTimeString() })}</span>
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
                            placeholder={t("titlePlaceholder")}
                            className="w-full text-2xl md:text-4xl font-bold bg-transparent border-none focus:outline-none placeholder:text-muted-foreground"
                        />
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder={t("subtitlePlaceholder")}
                            className="w-full text-xl text-muted-foreground bg-transparent border-none focus:outline-none placeholder:text-muted-foreground"
                        />
                    </GlassCard>

                    {/* Editor */}
                    <Editor
                        content={content}
                        onChange={setContent}
                        onAutoSave={handleAutoSave}
                        placeholder={t("contentPlaceholder")}
                        initialSeo={seoData}
                        onSeoChange={(newSeo) => setSeoData({
                            title: newSeo.title || "",
                            description: newSeo.description || "",
                            keywords: newSeo.keywords || [],
                            canonical: newSeo.canonical || "",
                            ogImage: newSeo.ogImage || "",
                        })}
                        postId={draftId}
                    />
                </div>

                {/* Sidebar - 1/3 width */}
                <div className="space-y-6">
                    {/* SEO Panel */}
                    {/* Post Settings */}
                    <GlassCard className="space-y-4">
                        <h3 className="font-bold">{t("settingsTitle")}</h3>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t("slugLabel")}
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
                                {t("categoryLabel")} *
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                            >
                                <option value="">{t("selectCategory")}</option>
                                {categories.map((cat) => (
                                    <option key={cat.slug} value={cat.slug}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <CategoryRequestDialog />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t("tagsLabel")}
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
                                {t("difficultyLabel")}
                            </label>
                            <select
                                value={difficultyLevel}
                                onChange={(e) => setDifficultyLevel(e.target.value as any)}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                            >
                                <option value="">{t("selectDifficulty")}</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        {/* Publication Selector */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t("publishToLabel")}
                            </label>
                            <select
                                value={publication}
                                onChange={(e) => setPublication(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                            >
                                <option value="">{t("noPublication")}</option>
                                {userPublications.map((pub) => (
                                    <option key={pub._id} value={pub._id}>
                                        {pub.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground mt-1">
                                {t("publicationHelp")}
                            </p>
                        </div>

                        {/* Language Selector */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Language
                            </label>
                            <select
                                value={locale}
                                onChange={(e) => setLocale(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                            >
                                <option value="en">English 🇬🇧</option>
                                <option value="bn">Bangla 🇧🇩</option>
                            </select>
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t("coverImageLabel")}
                            </label>
                            <div className="space-y-2">
                                <input
                                    type="url"
                                    value={coverImage}
                                    onChange={(e) => setCoverImage(e.target.value)}
                                    placeholder={t("coverImagePlaceholder")}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                />
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 border-t border-border"></div>
                                    <span className="text-xs text-muted-foreground">{t("or")}</span>
                                    <div className="flex-1 border-t border-border"></div>
                                </div>
                                <ImageUploadButton onUploadComplete={setCoverImage} />
                            </div>
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
                                    {t("publishing")}
                                </>
                            ) : (
                                t("publishNow")
                            )}
                        </Button>
                        <Button
                            onClick={() => handlePublish(false)}
                            disabled={loading}
                            variant="outline"
                            className="w-full"
                        >
                            {tDraft("save")}
                        </Button>
                    </GlassCard>
                </div>
            </div >
        </div >
    );
}

export default function NewPostPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>}>
            <NewPostContent />
        </Suspense>
    );
}
