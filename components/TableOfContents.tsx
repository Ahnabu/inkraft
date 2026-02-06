"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

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
        <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-foreground/80">
                <List size={20} />
                <span>Table of Contents</span>
            </div>
            <nav className="space-y-1">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(heading.id)?.scrollIntoView({
                                behavior: "smooth"
                            });
                            setActiveId(heading.id);
                        }}
                        className={cn(
                            "block text-sm py-1 transition-colors border-l-2 pl-4",
                            heading.level === 3 && "ml-4",
                            activeId === heading.id
                                ? "border-primary text-primary font-medium"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}
