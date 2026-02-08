"use client";

import { useEffect } from "react";

interface BlogContentProps {
    content: string;
    className?: string;
}

export function BlogContent({ content, className = "" }: BlogContentProps) {
    useEffect(() => {
        // Add copy button to code blocks
        const codeBlocks = document.querySelectorAll(".blog-content pre");
        
        codeBlocks.forEach((block) => {
            // Skip if button already exists
            if (block.querySelector(".copy-button")) return;

            const button = document.createElement("button");
            button.className = "copy-button";
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copy</span>
            `;
            
            button.addEventListener("click", async () => {
                const code = block.querySelector("code");
                if (code) {
                    await navigator.clipboard.writeText(code.textContent || "");
                    button.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Copied!</span>
                    `;
                    setTimeout(() => {
                        button.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span>Copy</span>
                        `;
                    }, 2000);
                }
            });

            const blockElement = block as HTMLElement;
            blockElement.style.position = "relative";
            block.appendChild(button);
        });

        // Add anchor links to headings
        const headings = document.querySelectorAll(".blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5, .blog-content h6");
        
        headings.forEach((heading) => {
            if (!heading.id) {
                heading.id = heading.textContent?.toLowerCase().replace(/[^\w]+/g, '-') || '';
            }

            // Skip if anchor already exists
            if (heading.querySelector(".heading-anchor")) return;

            const anchor = document.createElement("a");
            anchor.className = "heading-anchor";
            anchor.href = `#${heading.id}`;
            anchor.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
            `;
            
            const headingElement = heading as HTMLElement;
            headingElement.style.position = "relative";
            heading.appendChild(anchor);
        });

        // Make external links open in new tab
        const links = document.querySelectorAll(".blog-content a");
        links.forEach((link) => {
            const href = link.getAttribute("href");
            if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
                link.setAttribute("target", "_blank");
                link.setAttribute("rel", "noopener noreferrer");
            }
        });

        // Add responsive wrapper to tables
        const tables = document.querySelectorAll(".blog-content table");
        tables.forEach((table) => {
            if (!table.parentElement?.classList.contains("table-wrapper")) {
                const wrapper = document.createElement("div");
                wrapper.className = "table-wrapper";
                table.parentNode?.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    }, [content]);

    return (
        <>
            <div
                className={`blog-content prose prose-lg dark:prose-invert max-w-none ${className}`}
                dangerouslySetInnerHTML={{ __html: content }}
            />
            <style jsx global>{`
                .copy-button {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0.75rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.375rem;
                    color: #fff;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    backdrop-filter: blur(8px);
                }

                .copy-button:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .copy-button svg {
                    flex-shrink: 0;
                }

                /* Blog Content Styling */
                .blog-content {
                    color: hsl(var(--foreground) / 0.9);
                    font-size: 1.125rem;
                    line-height: 1.8;
                }

                .blog-content h1 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-top: 3rem;
                    margin-bottom: 1.5rem;
                    line-height: 1.2;
                    scroll-margin-top: 6rem;
                }

                .blog-content h2 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-top: 2.5rem;
                    margin-bottom: 1.25rem;
                    line-height: 1.3;
                    scroll-margin-top: 6rem;
                }

                .blog-content h3 {
                    font-size: 1.75rem;
                    font-weight: 600;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    scroll-margin-top: 6rem;
                }

                .blog-content h4 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 1.75rem;
                    margin-bottom: 0.875rem;
                    scroll-margin-top: 6rem;
                }

                .blog-content h5 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    scroll-margin-top: 6rem;
                }

                .blog-content h6 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                    scroll-margin-top: 6rem;
                }

                .blog-content p {
                    margin-bottom: 1.5rem;
                    line-height: 1.8;
                }

                .blog-content p:first-of-type::first-letter {
                    font-size: 3.5rem;
                    font-weight: 700;
                    float: left;
                    line-height: 1;
                    margin-right: 0.5rem;
                    margin-top: 0.1em;
                    color: hsl(var(--primary));
                }

                .blog-content a {
                    color: hsl(var(--primary));
                    text-decoration: underline;
                    text-underline-offset: 4px;
                    text-decoration-color: hsl(var(--primary) / 0.3);
                }

                .blog-content a:hover {
                    text-decoration-color: hsl(var(--primary) / 0.6);
                }

                .blog-content ul,
                .blog-content ol {
                    margin-bottom: 1.5rem;
                    margin-left: 1.5rem;
                    padding-left: 0.5rem;
                }

                .blog-content ul li,
                .blog-content ol li {
                    margin-bottom: 0.5rem;
                    line-height: 1.7;
                }

                .blog-content blockquote {
                    border-left: 4px solid hsl(var(--primary));
                    background: hsl(var(--primary) / 0.05);
                    padding: 1rem 1.5rem;
                    margin: 2rem 0;
                    font-style: italic;
                    border-radius: 0 0.5rem 0.5rem 0;
                }

                .blog-content code {
                    background: hsl(var(--primary) / 0.1);
                    color: hsl(var(--primary));
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.9em;
                    font-family: 'Consolas', 'Monaco', monospace;
                }

                .blog-content pre {
                    background: #1a1a1a;
                    color: #e4e4e7;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    margin: 2rem 0;
                    overflow-x: auto;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .blog-content pre code {
                    background: transparent;
                    color: inherit;
                    padding: 0;
                    border-radius: 0;
                    font-size: 0.95rem;
                }

                .blog-content img {
                    border-radius: 0.75rem;
                    margin: 2rem 0;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    max-width: 100%;
                    height: auto;
                }

                .blog-content table {
                    width: 100%;
                    margin: 2rem 0;
                    border-collapse: collapse;
                    border-radius: 0.5rem;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .blog-content th {
                    background: hsl(var(--primary) / 0.1);
                    padding: 0.75rem 1rem;
                    text-align: left;
                    font-weight: 600;
                    border-bottom: 2px solid hsl(var(--primary) / 0.2);
                }

                .blog-content td {
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid hsl(var(--border) / 0.5);
                }

                .blog-content tbody tr:hover {
                    background: hsl(var(--muted) / 0.3);
                }

                .blog-content hr {
                    margin: 3rem 0;
                    border: none;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, hsl(var(--border)), transparent);
                }

                .blog-content strong {
                    font-weight: 700;
                    color: hsl(var(--foreground));
                }

                .blog-content em {
                    font-style: italic;
                }

                @media (max-width: 768px) {
                    .blog-content {
                        font-size: 1rem;
                    }

                    .blog-content h1 {
                        font-size: 2rem;
                    }

                    .blog-content h2 {
                        font-size: 1.75rem;
                    }

                    .blog-content h3 {
                        font-size: 1.5rem;
                    }

                    .blog-content p:first-of-type::first-letter {
                        font-size: 2.5rem;
                    }
                }

                .heading-anchor {
                    position: absolute;
                    left: -2rem;
                    opacity: 0;
                    color: var(--primary);
                    transition: opacity 0.2s;
                    text-decoration: none;
                }

                .blog-content h1:hover .heading-anchor,
                .blog-content h2:hover .heading-anchor,
                .blog-content h3:hover .heading-anchor,
                .blog-content h4:hover .heading-anchor,
                .blog-content h5:hover .heading-anchor,
                .blog-content h6:hover .heading-anchor {
                    opacity: 1;
                }

                .table-wrapper {
                    overflow-x: auto;
                    margin: 2rem 0;
                    border-radius: 0.5rem;
                }

                @media (max-width: 768px) {
                    .heading-anchor {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
}
