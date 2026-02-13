"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { FocusModeProvider } from "@/lib/context/FocusModeContext";
import { LanguageProvider } from "@/context/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <FocusModeProvider>
                    <LanguageProvider>
                        {children}
                    </LanguageProvider>
                </FocusModeProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
