"use client";

import { cn } from "@/lib/utils";
import { useHeadings } from "@/lib/hooks/useHeadings";

export function TableOfContents() {
    const { headings, activeId, setActiveId } = useHeadings();

    if (headings.length === 0) return null;

    return (
        <div className="space-y-3 py-4 px-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-4">
                Contents
            </h3>
            <nav className="space-y-0.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                {headings.map((heading, index) => {
                    // Logic for collapsing:
                    // Show H2s always.
                    // Show H3s only if:
                    // 1. It is the active item
                    // 2. OR its parent H2 is the active item (or contains the active item)
                    // 3. OR the active item is a sibling H3

                    // Simple "Smart" approach for now:
                    // If activeId is an H2, show its H3 children.
                    // If activeId is an H3, show its siblings and parent H2.

                    // Determine if we should show this heading
                    let isVisible = true;
                    if (heading.level === 3) {
                        // Find parent H2
                        let parentH2Id = "";
                        for (let i = index - 1; i >= 0; i--) {
                            if (headings[i].level === 2) {
                                parentH2Id = headings[i].id;
                                break;
                            }
                        }

                        // Find active heading object
                        const activeHeading = headings.find(h => h.id === activeId);
                        const activeLevel = activeHeading?.level || 2;

                        // If active is H2, show its children
                        if (activeLevel === 2 && activeId === parentH2Id) {
                            isVisible = true;
                        }
                        // If active is H3, show if it belongs to same parent
                        else if (activeLevel === 3) {
                            // Find parent of active H3
                            const activeIndex = headings.findIndex(h => h.id === activeId);
                            let activeParentH2Id = "";
                            for (let i = activeIndex - 1; i >= 0; i--) {
                                if (headings[i].level === 2) {
                                    activeParentH2Id = headings[i].id;
                                    break;
                                }
                            }
                            isVisible = parentH2Id === activeParentH2Id;
                        } else {
                            isVisible = false;
                        }
                    }

                    if (!isVisible && heading.level !== 2) return null;

                    return (
                        <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById(heading.id);
                                if (element) {
                                    const offset = 100; // Offset for sticky header
                                    const elementPosition = element.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: "smooth"
                                    });
                                    setActiveId(heading.id);
                                }
                            }}
                            className={cn(
                                "block py-2 px-2 text-sm transition-all duration-200 border-l-2 rounded-r",
                                heading.level === 2 && "font-normal",
                                heading.level === 3 && "pl-6 text-xs",
                                activeId === heading.id
                                    ? "border-primary text-primary font-medium bg-primary/5"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30"
                            )}
                        >
                            <span className="line-clamp-2 leading-snug">{heading.text}</span>
                        </a>
                    );
                })}
            </nav>
        </div>
    );
}
