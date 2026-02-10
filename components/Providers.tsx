"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { FocusModeProvider } from "@/lib/context/FocusModeContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <FocusModeProvider>
                    {children}
                </FocusModeProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
