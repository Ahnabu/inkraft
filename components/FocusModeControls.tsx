"use client";

import { useTranslations } from "next-intl";
import { Type, LineChart, Palette, X } from "lucide-react";
import { useFocusMode } from "@/lib/context/FocusModeContext";
import { cn } from "@/lib/utils";

export function FocusModeControls() {
    const t = useTranslations("focusMode");
    const { isFocusMode, fontSize, lineHeight, theme, setFontSize, setLineHeight, setTheme, toggleFocusMode } = useFocusMode();

    if (!isFocusMode) return null;

    const fontSizes = [
        { value: "small", label: t("fontSize.small"), class: "text-base" },
        { value: "medium", label: t("fontSize.medium"), class: "text-lg" },
        { value: "large", label: t("fontSize.large"), class: "text-xl" },
        { value: "xlarge", label: t("fontSize.xlarge"), class: "text-2xl" },
    ];

    const lineHeights = [
        { value: "compact", label: t("lineHeight.compact") },
        { value: "normal", label: t("lineHeight.normal") },
        { value: "relaxed", label: t("lineHeight.relaxed") },
    ];

    const themes = [
        { value: "light", label: t("theme.light") },
        { value: "dark", label: t("theme.dark") },
        { value: "sepia", label: t("theme.sepia") },
    ];

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl">
            <div className="glass-card border border-primary/20 shadow-2xl rounded-2xl p-3 sm:p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                        <Palette size={18} />
                        {t("title")}
                    </h3>
                    <button
                        onClick={toggleFocusMode}
                        className="p-2 hover:bg-muted rounded-lg transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                        aria-label={t("close")}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Controls Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Font Size */}
                    <div>
                        <label className="block text-xs font-medium mb-2 flex items-center gap-1.5">
                            <Type size={14} />
                            {t("fontSizeLabel")}
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                            {fontSizes.map((size) => (
                                <button
                                    key={size.value}
                                    onClick={() => setFontSize(size.value as any)}
                                    className={cn(
                                        "px-2 py-2 text-xs rounded-lg border transition-colors min-h-[44px] sm:min-h-[36px]",
                                        fontSize === size.value
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card hover:bg-muted border-border"
                                    )}
                                >
                                    {size.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Line Height */}
                    <div>
                        <label className="block text-xs font-medium mb-2 flex items-center gap-1.5">
                            <LineChart size={14} />
                            {t("lineHeightLabel")}
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                            {lineHeights.map((lh) => (
                                <button
                                    key={lh.value}
                                    onClick={() => setLineHeight(lh.value as any)}
                                    className={cn(
                                        "px-2 py-2 text-xs rounded-lg border transition-colors min-h-[44px] sm:min-h-[36px]",
                                        lineHeight === lh.value
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card hover:bg-muted border-border"
                                    )}
                                >
                                    {lh.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Theme */}
                    <div>
                        <label className="block text-xs font-medium mb-2 flex items-center gap-1.5">
                            <Palette size={14} />
                            {t("themeLabel")}
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                            {themes.map((thm) => (
                                <button
                                    key={thm.value}
                                    onClick={() => setTheme(thm.value as any)}
                                    className={cn(
                                        "px-2 py-2 text-xs rounded-lg border transition-colors min-h-[44px] sm:min-h-[36px]",
                                        theme === thm.value
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card hover:bg-muted border-border"
                                    )}
                                >
                                    {thm.value}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
