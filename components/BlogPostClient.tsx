"use client";

import { useState } from "react";
import { Maximize2, Minimize2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFocusMode } from "@/lib/context/FocusModeContext";
import { cn } from "@/lib/utils";

interface BlogPostClientProps {
    children: React.ReactNode;
}

export function BlogPostClient({ children }: BlogPostClientProps) {
    const { isFocusMode, toggleFocusMode } = useFocusMode();

    return (
        <>
            {/* Floating Actions */}
            <div className="fixed bottom-24 right-6 z-50 lg:bottom-6 flex flex-col gap-4 print:hidden">
                <Button
                    onClick={() => {
                        const event = new CustomEvent('toggle-notes-sidebar');
                        window.dispatchEvent(event);
                    }}
                    variant="ghost"
                    className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all bg-indigo-600 hover:bg-indigo-700 text-white border-none ring-2 ring-indigo-600/20"
                    aria-label="Toggle notes"
                >
                    <StickyNote size={20} />
                </Button>

                <Button
                    onClick={toggleFocusMode}
                    variant="primary"
                    className={cn(
                        "rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all",
                        isFocusMode ? "bg-muted text-foreground hover:bg-muted/80 ring-2 ring-primary" : ""
                    )}
                    aria-label={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
                >
                    {isFocusMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </Button>
            </div>

            {/* Content Wrapper - Focus mode styling is handled globally by body class */}
            <div className={cn("transition-all duration-500", isFocusMode ? "py-8" : "")}>
                {children}
            </div>
        </>
    );
}
