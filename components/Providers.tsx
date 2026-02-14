"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { FocusModeProvider } from "@/lib/context/FocusModeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    // Suppress Vercel Analytics warnings when blocked by ad blockers
    useEffect(() => {
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;

        console.error = (...args: any[]) => {
            const message = args.join(' ');
            // Suppress Vercel Analytics blocked script errors
            if (
                message.includes('Failed to load script from /_vercel/insights/script.js') ||
                message.includes('ERR_BLOCKED_BY_CLIENT') ||
                message.includes('[Vercel Web Analytics]')
            ) {
                return;
            }
            originalConsoleError.apply(console, args);
        };

        console.warn = (...args: any[]) => {
            const message = args.join(' ');
            // Suppress Vercel Analytics warnings
            if (
                message.includes('_vercel/insights') ||
                message.includes('[Vercel Web Analytics]')
            ) {
                return;
            }
            originalConsoleWarn.apply(console, args);
        };

        return () => {
            console.error = originalConsoleError;
            console.warn = originalConsoleWarn;
        };
    }, []);

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
