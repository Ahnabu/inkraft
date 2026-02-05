"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Check, AlertCircle } from "lucide-react";

interface SEOPanelProps {
    title: string;
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    onSlugChange: (slug: string) => void;
    onMetaTitleChange: (title: string) => void;
    onMetaDescriptionChange: (description: string) => void;
}

export function SEOPanel({
    title,
    slug,
    metaTitle,
    metaDescription,
    onSlugChange,
    onMetaTitleChange,
    onMetaDescriptionChange,
}: SEOPanelProps) {
    const [localSlug, setLocalSlug] = useState(slug);
    const [localMetaTitle, setLocalMetaTitle] = useState(metaTitle || title);
    const [localMetaDescription, setLocalMetaDescription] = useState(metaDescription || "");

    // Auto-generate slug from title
    useEffect(() => {
        if (!slug && title) {
            const autoSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            setLocalSlug(autoSlug);
            onSlugChange(autoSlug);
        }
    }, [title, slug, onSlugChange]);

    // Auto-set meta title from title
    useEffect(() => {
        if (!metaTitle && title) {
            setLocalMetaTitle(title);
        }
    }, [title, metaTitle]);

    const handleSlugChange = (value: string) => {
        const sanitized = value
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        setLocalSlug(sanitized);
        onSlugChange(sanitized);
    };

    const handleMetaTitleChange = (value: string) => {
        setLocalMetaTitle(value);
        onMetaTitleChange(value);
    };

    const handleMetaDescriptionChange = (value: string) => {
        setLocalMetaDescription(value);
        onMetaDescriptionChange(value);
    };

    const metaTitleLength = localMetaTitle.length;
    const metaDescriptionLength = localMetaDescription.length;
    const metaTitleStatus = metaTitleLength >= 50 && metaTitleLength <= 60 ? "good" : "warning";
    const metaDescriptionStatus = metaDescriptionLength >= 150 && metaDescriptionLength <= 160 ? "good" : "warning";

    return (
        <GlassCard className="space-y-6">
            <div>
                <h3 className="text-lg font-bold mb-4">SEO Settings</h3>
            </div>

            {/* Slug */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    URL Slug
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/blog/</span>
                    <input
                        type="text"
                        value={localSlug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        placeholder="article-slug"
                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Meta Title */}
            <div>
                <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                    <span>Meta Title</span>
                    <span className={`text-xs ${metaTitleStatus === 'good' ? 'text-green-600' : 'text-orange-600'}`}>
                        {metaTitleLength}/60 {metaTitleStatus === 'good' ? '✓' : '⚠'}
                    </span>
                </label>
                <input
                    type="text"
                    value={localMetaTitle}
                    onChange={(e) => handleMetaTitleChange(e.target.value)}
                    placeholder="SEO-optimized title (50-60 chars)"
                    maxLength={70}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Meta Description */}
            <div>
                <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                    <span>Meta Description</span>
                    <span className={`text-xs ${metaDescriptionStatus === 'good' ? 'text-green-600' : 'text-orange-600'}`}>
                        {metaDescriptionLength}/160 {metaDescriptionStatus === 'good' ? '✓' : '⚠'}
                    </span>
                </label>
                <textarea
                    value={localMetaDescription}
                    onChange={(e) => handleMetaDescriptionChange(e.target.value)}
                    placeholder="SEO-optimized description (150-160 chars)"
                    maxLength={200}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
            </div>

            {/* Google SERP Preview */}
            <div>
                <label className="block text-sm font-medium mb-2">Google Preview</label>
                <div className="p-4 rounded-lg border border-border bg-background/50">
                    <div className="text-sm text-blue-600 mb-1">
                        inkraft.com › blog › {localSlug || 'article-slug'}
                    </div>
                    <div className="text-lg text-blue-800 dark:text-blue-400 font-medium mb-1 line-clamp-1">
                        {localMetaTitle || title || "Article Title"}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                        {localMetaDescription || "Add a meta description to see how it appears in search results..."}
                    </div>
                </div>
            </div>

            {/* SEO Tips */}
            <div className="pt-4 border-t border-border/40">
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>
                        Optimal SEO: Title 50-60 chars, Description 150-160 chars. Include target keywords naturally.
                    </span>
                </p>
            </div>
        </GlassCard>
    );
}
