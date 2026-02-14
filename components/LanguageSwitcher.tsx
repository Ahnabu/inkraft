"use client";

import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const languages = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "bn", name: "বাংলা", nativeName: "বাংলা", flag: "🇧🇩" },
];

export function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const { alternateLinks } = useLanguage();

    const currentLocale = typeof document !== "undefined"
        ? document.documentElement.lang
        : "en";

    const handleLanguageChange = async (langCode: string) => {
        // If we have an alternate link for this language, configure cookie and navigate
        if (alternateLinks[langCode]) {
            document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000`;
            window.location.href = alternateLinks[langCode];
            return;
        }

        // Default behavior: Set cookie and reload current page
        document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000`;
        window.location.reload();
    };

    const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-200 border border-primary/20 shadow-sm group"
                title="Switch Language"
            >
                <Globe size={18} className="text-primary group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-semibold text-primary hidden sm:inline">
                    {currentLanguage.nativeName}
                </span>
                <span className="text-base sm:hidden">
                    {currentLanguage.flag}
                </span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-muted/30 backdrop-blur-xl border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-3 border-b border-border/50">
                            <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                                <Globe size={14} className="text-primary" />
                                Switch Language
                            </div>
                        </div>
                        <div className="p-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${currentLocale === lang.code
                                        ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-semibold shadow-sm border border-primary/20"
                                        : "hover:bg-muted text-foreground hover:translate-x-0.5"
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="text-xl">{lang.flag}</span>
                                        <div className="flex flex-col items-start">
                                            <span className="text-base font-medium">{lang.nativeName}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {lang.name}
                                            </span>
                                        </div>
                                    </span>
                                    {currentLocale === lang.code && (
                                        <Check size={18} className="text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
