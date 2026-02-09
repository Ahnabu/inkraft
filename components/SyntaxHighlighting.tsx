
"use client";

import { useEffect } from "react";

export function SyntaxHighlighting() {
    useEffect(() => {
        // Load the CSS for syntax highlighting from a CDN or local assets
        // Using Atom One Dark theme for a modern look that works well in both light/dark modes
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css";
        link.dataset.highlight = "true";

        // Check if already exists to avoid duplicates
        if (!document.querySelector('link[data-highlight="true"]')) {
            document.head.appendChild(link);
        }

        return () => {
            // Optional: remove on unmount if we want to be strict, but usually fine to keep
            // document.head.removeChild(link);
        };
    }, []);

    return null;
}
