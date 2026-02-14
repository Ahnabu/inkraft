"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { FocusModeProvider } from "@/lib/context/FocusModeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    // Suppress Vercel Analytics and Speed Insights warnings when blocked by ad blockers
    useEffect(() => {
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        const originalConsoleLog = console.log;

        console.error = (...args: unknown[]) => {
            const message = args.join(' ');
            // Suppress Vercel Analytics and Speed Insights blocked script errors
            if (
                message.includes('/_vercel/insights') ||
                message.includes('/_vercel/speed-insights') ||
                message.includes('ERR_BLOCKED_BY_CLIENT') ||
                message.includes('[Vercel Web Analytics]') ||
                message.includes('[Vercel Speed Insights]') ||
                message.includes('Failed to load script from /_vercel/')
            ) {
                return;
            }
            originalConsoleError.apply(console, args);
        };

        console.warn = (...args: unknown[]) => {
            const message = args.join(' ');
            // Suppress Vercel Analytics and Speed Insights warnings
            if (
                message.includes('_vercel/insights') ||
                message.includes('_vercel/speed-insights') ||
                message.includes('[Vercel Web Analytics]') ||
                message.includes('[Vercel Speed Insights]')
            ) {
                return;
            }
            originalConsoleWarn.apply(console, args);
        };

        console.log = (...args: unknown[]) => {
            const message = args.join(' ');
            // Suppress Apollo DevTools messages
            if (
                message.includes('Apollo DevTools') ||
                message.includes('apollo-client-developer')
            ) {
                return;
            }
            originalConsoleLog.apply(console, args);
        };

        return () => {
            console.error = originalConsoleError;
            console.warn = originalConsoleWarn;
            console.log = originalConsoleLog;
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
