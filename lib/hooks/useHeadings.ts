"use client";

import { useState, useEffect } from "react";

export interface Heading {
    id: string;
    text: string;
    level: number;
}

export function useHeadings() {
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

    return { headings, activeId, setActiveId };
}
