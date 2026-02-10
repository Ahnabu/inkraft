"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, MessageSquarePlus } from "lucide-react";
import { NotePopover } from "@/components/reader/NotePopover";
import { NoteSidebar } from "@/components/reader/NoteSidebar";
import { Button } from "@/components/ui/Button";

interface SeriesPost {
    _id: string;
    title: string;
    slug: string;
}

interface SeriesContext {
    title: string;
    slug: string;
    posts: SeriesPost[];
    currentIndex: number; // 0-based index of current post in series
}

interface BlogContentProps {
    content: string;
    postId: string; // Added postId
    className?: string;
    series?: SeriesContext;
}

function SeriesNavigation({ series }: { series: SeriesContext }) {
    const { title, slug, posts, currentIndex } = series;
    const totalParts = posts.length;
    const partNumber = currentIndex + 1;
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < totalParts - 1 ? posts[currentIndex + 1] : null;

    return (
        <div className="series-navigation mb-8 p-4 rounded-xl border border-border bg-card/50">
            {/* Series header */}
            <div className="flex items-center gap-2 mb-3">
                <BookOpen size={18} className="text-primary" />
                <Link
                    href={`/series/${slug}`}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                >
                    {title}
                </Link>
                <span className="text-muted-foreground text-sm">
                    • Part {partNumber} of {totalParts}
                </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
                <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(partNumber / totalParts) * 100}%` }}
                />
            </div>

            {/* Prev/Next navigation */}
            <div className="flex justify-between items-center gap-4">
                {prevPost ? (
                    <Link
                        href={`/blog/${prevPost.slug}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group max-w-[45%]"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span className="truncate">{prevPost.title}</span>
                    </Link>
                ) : (
                    <div />
                )}

                {nextPost ? (
                    <Link
                        href={`/blog/${nextPost.slug}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group max-w-[45%] text-right"
                    >
                        <span className="truncate">{nextPost.title}</span>
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <span>✓ Series Complete</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export function BlogContent({ content, postId, className = "", series }: BlogContentProps) {
    const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
    const [selectedParagraphId, setSelectedParagraphId] = useState<string>("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [refreshNotesTrigger, setRefreshNotesTrigger] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        // Add copy button to code blocks
        const codeBlocks = contentRef.current.querySelectorAll("pre");
        codeBlocks.forEach((block) => {
            if (block.querySelector(".copy-button")) return;
            // ... existing code block logic ...
            const button = document.createElement("button");
            button.className = "copy-button";
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span>Copy</span>
            `;
            button.addEventListener("click", async () => {
                const code = block.querySelector("code");
                if (code) {
                    await navigator.clipboard.writeText(code.textContent || "");
                    button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copied!</span>`;
                    setTimeout(() => {
                        button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>`;
                    }, 2000);
                }
            });
            block.style.position = "relative";
            block.appendChild(button);
        });

        // Add anchor links
        const headings = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headings.forEach((heading) => {
            if (!heading.id) {
                heading.id = heading.textContent?.toLowerCase().replace(/[^\w]+/g, '-') || '';
            }
            if (heading.querySelector(".heading-anchor")) return;
            const anchor = document.createElement("a");
            anchor.className = "heading-anchor";
            anchor.href = `#${heading.id}`;
            anchor.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
            const hEl = heading as HTMLElement;
            hEl.style.position = "relative";
            heading.appendChild(anchor);
        });

        // External links
        const links = contentRef.current.querySelectorAll("a");
        links.forEach((link) => {
            const href = link.getAttribute("href");
            if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
                link.setAttribute("target", "_blank");
                link.setAttribute("rel", "noopener noreferrer");
            }
        });

        // Tables
        const tables = contentRef.current.querySelectorAll("table");
        tables.forEach((table) => {
            if (!table.parentElement?.classList.contains("table-wrapper")) {
                const wrapper = document.createElement("div");
                wrapper.className = "table-wrapper";
                table.parentNode?.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });

        // Inject IDs into paragraphs for Notes
        const paragraphs = contentRef.current.querySelectorAll("p");
        paragraphs.forEach((p, index) => {
            if (!p.id) {
                // Simple hash of content + index to be somewhat robust
                const text = p.textContent?.substring(0, 20) || "";
                const hash = text.split("").reduce((a, b) => {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                }, 0);
                p.id = `p-${Math.abs(hash)}-${index}`;
            }
            p.style.position = "relative";
        });
    }, [content]);

    // Handle Text Selection
    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) {
                setSelectionRect(null);
                return;
            }

            // Only show note input if selecting a reasonable amount of text
            if (selection.toString().trim().length < 3) return;

            const range = selection.getRangeAt(0);
            const parentBlock = range.commonAncestorContainer.parentElement?.closest("p");

            if (parentBlock && contentRef.current?.contains(parentBlock) && parentBlock.id) {
                const rect = range.getBoundingClientRect();
                setSelectionRect(rect);
                setSelectedParagraphId(parentBlock.id);
            } else {
                setSelectionRect(null);
            }
        };

        const container = contentRef.current;
        if (container) {
            container.addEventListener("mouseup", handleSelection);
            container.addEventListener("keyup", handleSelection);
        }

        return () => {
            if (container) {
                container.removeEventListener("mouseup", handleSelection);
                container.removeEventListener("keyup", handleSelection);
            }
        };
    }, []);

    const handleSaveNote = async (noteContent: string) => {
        if (!postId) {
            console.error("Missing postId");
            return;
        }

        const res = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                postId,
                paragraphId: selectedParagraphId,
                content: noteContent,
            }),
        });

        if (res.ok) {
            setRefreshNotesTrigger((prev) => prev + 1);
            window.getSelection()?.removeAllRanges();
            setSelectionRect(null);
        } else {
            throw new Error("Failed to save");
        }
    };

    return (
        <>
            {series && <SeriesNavigation series={series} />}
            <div className="relative">
                <div
                    ref={contentRef}
                    className={`blog-content prose dark:prose-invert max-w-none ${className}`}
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                <NotePopover
                    paragraphId={selectedParagraphId}
                    selectionRect={selectionRect}
                    onClose={() => setSelectionRect(null)}
                    onSave={handleSaveNote}
                />
            </div>

            {/* Note Sidebar Toggle */}
            <div className="fixed bottom-24 right-20 z-40 lg:bottom-6 lg:right-20">
                <Button
                    onClick={() => setIsSidebarOpen(true)}
                    variant="outline"
                    className="rounded-full w-12 h-12 p-0 shadow-lg bg-background border border-border"
                    title="View Notes"
                >
                    <MessageSquarePlus size={20} className="text-muted-foreground" />
                </Button>
            </div>

            <NoteSidebar
                postId={postId}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                refreshTrigger={refreshNotesTrigger}
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
                    font-size: 1rem;
                    line-height: 1.75;
                    overflow-x: hidden;
                    max-width: 100%;
                }

                .blog-content h1 {
                    font-size: 2.25rem;
                    font-weight: 700;
                    margin-top: 2.5rem;
                    margin-bottom: 1.25rem;
                    line-height: 1.2;
                    scroll-margin-top: 6rem;
                }

                .blog-content h2 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    line-height: 1.3;
                    scroll-margin-top: 6rem;
                }

                .blog-content h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 1.75rem;
                    margin-bottom: 0.875rem;
                    scroll-margin-top: 6rem;
                }

                .blog-content h4 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    scroll-margin-top: 6rem;
                }

                .blog-content h5 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-top: 1.25rem;
                    margin-bottom: 0.625rem;
                    scroll-margin-top: 6rem;
                }

                .blog-content h6 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                    scroll-margin-top: 6rem;
                }

                .blog-content p {
                    margin-bottom: 1.25rem;
                    line-height: 1.75;
                }

                .blog-content > p:first-child::first-letter {
                    font-size: 3.25rem;
                    font-weight: 700;
                    float: left;
                    line-height: 0.9;
                    margin-right: 0.5rem;
                    margin-top: 0.05em;
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
                    -webkit-overflow-scrolling: touch;
                }

                /* Tablet Screens (1024px and below) */
                @media (max-width: 1024px) {
                    .blog-content {
                        font-size: 0.9675rem;
                    }

                    .blog-content h1 {
                        font-size: 2rem;
                        margin-top: 2.25rem;
                        margin-bottom: 1.125rem;
                    }

                    .blog-content h2 {
                        font-size: 1.75rem;
                        margin-top: 2rem;
                        margin-bottom: 1rem;
                    }

                    .blog-content h3 {
                        font-size: 1.375rem;
                    }

                    .blog-content > p:first-child::first-letter {
                        font-size: 3rem;
                    }

                    .heading-anchor {
                        left: -1.5rem;
                    }
                }

                /* Mobile Landscape & Small Tablets (768px and below) */
                @media (max-width: 768px) {
                    .blog-content {
                        font-size: 0.9375rem;
                        line-height: 1.7;
                    }

                    .blog-content h1 {
                        font-size: 1.75rem;
                        margin-top: 2rem;
                        margin-bottom: 1rem;
                    }

                    .blog-content h2 {
                        font-size: 1.5rem;
                        margin-top: 1.75rem;
                        margin-bottom: 0.875rem;
                    }

                    .blog-content h3 {
                        font-size: 1.25rem;
                        margin-top: 1.5rem;
                        margin-bottom: 0.75rem;
                    }

                    .blog-content h4 {
                        font-size: 1.125rem;
                        margin-top: 1.25rem;
                        margin-bottom: 0.625rem;
                    }

                    .blog-content > p:first-child::first-letter {
                        font-size: 2.5rem;
                        line-height: 0.85;
                    }

                    .blog-content p {
                        margin-bottom: 1rem;
                    }

                    .blog-content ul,
                    .blog-content ol {
                        margin-left: 1rem;
                    }

                    .blog-content pre {
                        padding: 1rem;
                        margin: 1.5rem 0;
                        border-radius: 0.5rem;
                    }

                    .blog-content img {
                        margin: 1.5rem 0;
                        border-radius: 0.5rem;
                        width: 100%;
                        max-width: 100%;
                    }

                    .heading-anchor {
                        display: none;
                    }

                    .table-wrapper {
                        margin: 1.5rem 0;
                        border-radius: 0.5rem;
                    }

                    .blog-content table {
                        font-size: 0.875rem;
                    }

                    .blog-content th,
                    .blog-content td {
                        padding: 0.5rem 0.75rem;
                    }

                    .copy-button {
                        top: 0.5rem;
                        right: 0.5rem;
                        padding: 0.375rem 0.5rem;
                        font-size: 0.75rem;
                    }
                }

                /* Mobile Portrait (640px and below) */
                @media (max-width: 640px) {
                    .blog-content {
                        font-size: 0.9125rem;
                    }

                    .blog-content h1 {
                        font-size: 1.625rem;
                        margin-top: 1.75rem;
                    }

                    .blog-content h2 {
                        font-size: 1.375rem;
                        margin-top: 1.5rem;
                    }

                    .blog-content h3 {
                        font-size: 1.125rem;
                    }

                    .blog-content h4 {
                        font-size: 1.0625rem;
                    }

                    .blog-content > p:first-child::first-letter {
                        font-size: 2.25rem;
                    }

                    .blog-content blockquote {
                        padding: 0.875rem 1.25rem;
                        margin: 1.5rem 0;
                    }

                    .blog-content pre {
                        font-size: 0.875rem;
                        margin: 1.5rem 0;
                    }
                }

                /* Small Mobile (375px and below) */
                @media (max-width: 375px) {
                    .blog-content {
                        font-size: 0.875rem;
                        line-height: 1.65;
                    }

                    .blog-content h1 {
                        font-size: 1.5rem;
                        margin-top: 1.5rem;
                        margin-bottom: 0.875rem;
                    }

                    .blog-content h2 {
                        font-size: 1.25rem;
                        margin-top: 1.375rem;
                        margin-bottom: 0.75rem;
                    }

                    .blog-content h3 {
                        font-size: 1.0625rem;
                        margin-top: 1.25rem;
                        margin-bottom: 0.625rem;
                    }

                    .blog-content h4 {
                        font-size: 1rem;
                        margin-top: 1.125rem;
                        margin-bottom: 0.5rem;
                    }

                    .blog-content > p:first-child::first-letter {
                        font-size: 2rem;
                        line-height: 0.8;
                        margin-right: 0.375rem;
                    }

                    .blog-content p {
                        margin-bottom: 0.875rem;
                    }

                    .blog-content ul,
                    .blog-content ol {
                        margin-left: 0.75rem;
                        padding-left: 0.25rem;
                    }

                    .blog-content blockquote {
                        padding: 0.75rem 1rem;
                        margin: 1.25rem 0;
                        font-size: 0.875rem;
                    }

                    .blog-content pre {
                        padding: 0.875rem;
                        margin: 1.25rem 0;
                        font-size: 0.8125rem;
                    }

                    .blog-content img {
                        margin: 1.25rem 0;
                        width: 100%;
                        max-width: 100%;
                    }

                    .blog-content table {
                        font-size: 0.8125rem;
                    }

                    .blog-content th,
                    .blog-content td {
                        padding: 0.375rem 0.5rem;
                    }

                    .table-wrapper {
                        margin: 1.25rem 0;
                    }

                    .copy-button {
                        padding: 0.25rem 0.375rem;
                        font-size: 0.6875rem;
                    }

                    .copy-button span {
                        display: none;
                    }

                    .copy-button svg {
                        width: 14px;
                        height: 14px;
                    }
                }
            `}</style>
        </>
    );
}
