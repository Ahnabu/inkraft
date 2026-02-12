"use client";

import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslations } from "next-intl";

const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "bn", name: "Bangla", nativeName: "বাংলা" },
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
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title={t("switchLanguage")}
            >
                <Globe size={18} />
                <span className="text-sm font-medium hidden sm:inline">
                    {currentLanguage.nativeName}
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
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2">
                            <div className="text-xs font-semibold text-muted-foreground px-3 py-2">
                                {t("switchLanguage")}
                            </div>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${currentLocale === lang.code
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "hover:bg-muted text-foreground"
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-base">{lang.nativeName}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {lang.name}
                                        </span>
                                    </span>
                                    {currentLocale === lang.code && (
                                        <Check size={16} className="text-primary" />
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
