"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface LanguageContextType {
    alternateLinks: Record<string, string>;
    setAlternateLinks: (links: Record<string, string>) => void;
}

const LanguageContext = createContext<LanguageContextType>({
    alternateLinks: {},
    setAlternateLinks: () => { },
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [alternateLinks, setAlternateLinks] = useState<Record<string, string>>({});

    return (
        <LanguageContext.Provider value={{ alternateLinks, setAlternateLinks }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
