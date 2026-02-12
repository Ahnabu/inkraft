"use client";

import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslations } from "next-intl";

const languages = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "bn", name: "বাংলা", nativeName: "বাংলা", flag: "🇧🇩" },
];

export function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("LanguageSwitcher");

    const currentLocale = typeof document !== "undefined"
        ? document.documentElement.lang
        : "en";

    const handleLanguageChange = async (langCode: string) => {
        // Set cookie
        document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000`;

        // Reload page to apply new locale
        window.location.reload();
    };

    const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-200 text-foreground border border-primary/20 shadow-sm"
                title={t("switchLanguage")}
            >
                <Globe size={18} className="text-primary" />
                <span className="text-sm font-medium hidden sm:inline">
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
                                {t("switchLanguage")}
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
