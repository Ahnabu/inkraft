"use client";

import { Globe, Info } from "lucide-react";
import { useState } from "react";

interface LanguageTabsProps {
    currentLang: "en" | "bn";
    onLangChange: (lang: "en" | "bn") => void;
    hasEnContent: boolean;
    hasBnContent: boolean;
}

export function LanguageTabs({
    currentLang,
    onLangChange,
    hasEnContent,
    hasBnContent,
}: LanguageTabsProps) {
    const [showGuide, setShowGuide] = useState(false);

    const tabs = [
        {
            code: "en" as const,
            name: "English",
            hasContent: hasEnContent,
        },
        {
            code: "bn" as const,
            name: "বাংলা",
            hasContent: hasBnContent,
        },
    ];

    return (
        <div className="border-b border-border bg-card">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.code}
                            onClick={() => onLangChange(tab.code)}
                            className={`relative flex items-center gap-2 px 4 py-2 rounded-t-lg transition-all font-medium text-sm ${currentLang === tab.code
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                        >
                            <Globe size={16} />
                            <span>{tab.name}</span>
                            {tab.hasContent && (
                                <span className="w-2 h-2 rounded-full bg-green-500" title="Has content" />
                            )}
                            {!tab.hasContent && currentLang !== tab.code && (
                                <span className="w-2 h-2 rounded-full bg-muted" title="No content" />
                            )}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setShowGuide(!showGuide)}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted/50"
                    title="Translation Guide"
                >
                    <Info size={16} />
                    <span className="hidden sm:inline">Guide</span>
                </button>
            </div>

            {/* Inline Guide */}
            {showGuide && (
                <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-2 text-primary flex items-center gap-2">
                            <Info size={16} />
                            Multi-language Publishing Guide
                        </h4>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                            <li>✓ Write your post in your primary language first</li>
                            <li>✓ Switch tabs to add translations (optional)</li>
                            <li>✓ Each language saves title, excerpt, and content separately</li>
                            <li>✓ Posts without translation will show in the original language</li>
                            <li>✓ Green dot = has content, Gray dot = empty</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
