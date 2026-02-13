"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface TranslationLinkerProps {
    links: Record<string, string>;
}

export function TranslationLinker({ links }: TranslationLinkerProps) {
    const { setAlternateLinks } = useLanguage();

    useEffect(() => {
        setAlternateLinks(links);

        // Reset on unmount
        return () => {
            setAlternateLinks({});
        };
    }, [links, setAlternateLinks]);

    return null;
}
