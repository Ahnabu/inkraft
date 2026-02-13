"use client";

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { useLocale } from 'next-intl';

interface TranslationFallbackProps {
    postLocale: string;
    alternates?: Record<string, string>;
}

export function TranslationFallback({ postLocale, alternates }: TranslationFallbackProps) {
    const currentLocale = useLocale();

    if (currentLocale === postLocale) return null;

    const targetLink = alternates?.[currentLocale];
    const currentLangName = currentLocale === 'bn' ? 'Bangla' : 'English';
    const postLangName = postLocale === 'bn' ? 'Bangla' : 'English';

    return (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
                <p className="text-amber-800 dark:text-amber-300 text-sm">
                    {targetLink
                        ? `This article is available in ${currentLangName}.`
                        : `This article is not yet translated to ${currentLangName}. Showing ${postLangName} version.`
                    }
                </p>
                {targetLink && (
                    <Link href={targetLink} className="text-amber-700 dark:text-amber-400 font-medium text-sm hover:underline mt-1 inline-block">
                        Switch to {currentLangName}
                    </Link>
                )}
            </div>
        </div>
    );
}
