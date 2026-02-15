"use client";

import { useState } from "react";
import { useHeadings } from "@/lib/hooks/useHeadings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import * as Dialog from "@radix-ui/react-dialog";
import { List, X } from "lucide-react";

export function MobileTOC() {
    const { headings, activeId, setActiveId } = useHeadings();
    const [open, setOpen] = useState(false);

    if (headings.length === 0) return null;

    const activeHeading = headings.find(h => h.id === activeId);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button
                    variant="primary" // Corrected variant
                    size="icon"
                    className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 shadow-xl xl:hidden hover:scale-105 transition-transform"
                    aria-label="Table of Contents"
                >
                    <List className="w-6 h-6" />
                    <span className="sr-only">Table of Contents</span>
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" />
                <Dialog.Content className="fixed z-50 bottom-4 left-4 right-4 max-h-[60vh] outline-none rounded-2xl bg-card border border-border shadow-2xl animate-in slide-in-from-bottom-10 duration-200 p-0 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                        <Dialog.Title className="text-lg font-semibold">
                            Contents
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <X className="w-4 h-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </Dialog.Close>
                    </div>

                    <div className="overflow-y-auto p-4 custom-scrollbar">
                        <nav className="space-y-1">
                            {headings.map((heading) => (
                                <a
                                    key={heading.id}
                                    href={`#${heading.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const element = document.getElementById(heading.id);
                                        if (element) {
                                            const offset = 100;
                                            const elementPosition = element.getBoundingClientRect().top;
                                            const offsetPosition = elementPosition + window.pageYOffset - offset;

                                            window.scrollTo({
                                                top: offsetPosition,
                                                behavior: "smooth"
                                            });
                                            setActiveId(heading.id);
                                            setOpen(false);
                                        }
                                    }}
                                    className={cn(
                                        "block py-2 px-3 text-sm transition-all duration-200 rounded-lg",
                                        heading.level === 3 && "pl-6 text-xs",
                                        activeId === heading.id
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {heading.text}
                                </a>
                            ))}
                        </nav>
                    </div>
                    {/* Active Section Indicator */}
                    {activeHeading && (
                        <div className="p-3 border-t border-border bg-muted/20 text-xs text-muted-foreground flex items-center justify-between">
                            <span>Reading: {activeHeading.text}</span>
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
