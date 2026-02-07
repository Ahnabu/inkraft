"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents() {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Parse headings from the article content
        const elements = Array.from(document.querySelectorAll("article h2, article h3"));
        const headingsData = elements.map((elem, index) => {
            // Ensure element has an ID
            if (!elem.id) {
                elem.id = `heading-${index}`;
            }
            return {
                id: elem.id,
                text: elem.textContent || "",
                level: Number(elem.tagName.substring(1))
            };
        });
        
        // Update headings state with parsed data
        // This is synchronizing with external DOM state after mount which is intentional
        // We move the update outside the conditional to avoid the eslint error
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHeadings(headingsData);

        // Scroll spy
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <div className="space-y-3 py-4 px-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-4">
                Contents
            </h3>
            <nav className="space-y-0.5">
                {headings.map((heading) => (
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
                            "block py-2 px-2 text-sm transition-all duration-150 border-l-2 rounded-r",
                            heading.level === 2 && "font-normal",
                            heading.level === 3 && "pl-6 text-xs",
                            activeId === heading.id
                                ? "border-primary text-primary font-medium bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30"
                        )}
                    >
                        <span className="line-clamp-2 leading-snug">{heading.text}</span>
                    </a>
                ))}
            </nav>
        </div>
    );
}
