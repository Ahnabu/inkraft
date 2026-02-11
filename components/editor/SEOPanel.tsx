"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Globe, Search, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

interface SEOPanelProps {
    initialData?: {
        title?: string;
        description?: string;
        keywords?: string[];
        canonical?: string;
        ogImage?: string;
    };
    onChange: (data: {
        title?: string;
        description?: string;
        keywords?: string[];
        canonical?: string;
        ogImage?: string;
    }) => void;
}

export function SEOPanel({ initialData, onChange }: SEOPanelProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [keywords, setKeywords] = useState(initialData?.keywords?.join(", ") || "");
    const [canonical, setCanonical] = useState(initialData?.canonical || "");
    const [ogImage, setOgImage] = useState(initialData?.ogImage || "");

    // Sync state with parent when inputs change
    useEffect(() => {
        onChange({
            title: title || undefined,
            description: description || undefined,
            keywords: keywords ? keywords.split(",").map(k => k.trim()).filter(Boolean) : undefined,
            canonical: canonical || undefined,
            ogImage: ogImage || undefined,
        });
    }, [title, description, keywords, canonical, ogImage]);

    return (
        <div className="space-y-6 p-4">
            <div className="flex items-center gap-2 text-primary mb-2">
                <Search size={20} />
                <h3 className="font-semibold text-lg">SEO Settings</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
                Customize how your post appears in search results and social media.
            </p>

            {/* Meta Title */}
            <div className="space-y-2">
                <label className="text-sm font-medium flex justify-between">
                    Meta Title
                    <span className={`text-xs ${title.length > 60 ? "text-red-500" : "text-muted-foreground"}`}>
                        {title.length}/60
                    </span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter meta title..."
                    className="w-full p-2 rounded-md border border-input bg-background/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                />
                <p className="text-xs text-muted-foreground">
                    Ideally between 50-60 characters.
                </p>
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
                <label className="text-sm font-medium flex justify-between">
                    Meta Description
                    <span className={`text-xs ${description.length > 160 ? "text-red-500" : "text-muted-foreground"}`}>
                        {description.length}/160
                    </span>
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter meta description..."
                    rows={3}
                    className="w-full p-2 rounded-md border border-input bg-background/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground">
                    Ideally between 50-160 characters.
                </p>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                    <Globe size={14} className="text-muted-foreground" />
                    Keywords
                </label>
                <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="react, nextjs, web development"
                    className="w-full p-2 rounded-md border border-input bg-background/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                />
                <p className="text-xs text-muted-foreground">
                    Comma-separated list of keywords.
                </p>
            </div>

            {/* Canonical URL */}
            <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                    <LinkIcon size={14} className="text-muted-foreground" />
                    Canonical URL
                </label>
                <input
                    type="url"
                    value={canonical}
                    onChange={(e) => setCanonical(e.target.value)}
                    placeholder="https://example.com/original-post"
                    className="w-full p-2 rounded-md border border-input bg-background/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                />
                <p className="text-xs text-muted-foreground">
                    Use if this content was originally published elsewhere.
                </p>
            </div>

            {/* OG Image */}
            <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                    <ImageIcon size={14} className="text-muted-foreground" />
                    Social Image URL (OG:Image)
                </label>
                <input
                    type="url"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 rounded-md border border-input bg-background/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                />
                <p className="text-xs text-muted-foreground">
                    Custom image for social media sharing. Defaults to cover image.
                </p>
            </div>

            {/* Search Preview */}
            <div className="mt-8 pt-6 border-t border-border/50">
                <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Search Preview</h4>
                <div className="bg-card p-4 rounded-lg border border-border/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] text-gray-500">I</div>
                        <div className="flex flex-col">
                            <span className="text-xs text-foreground font-medium">Inkraft</span>
                            <span className="text-[10px] text-muted-foreground">inkraft.com › blog › ...</span>
                        </div>
                    </div>
                    <div className="text-lg text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer truncate">
                        {title || "Your Post Title"}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {description || "This is how your post description will appear in search results. Make it catchy and relevant to attract readers."}
                    </div>
                </div>
            </div>
        </div>
    );
}
