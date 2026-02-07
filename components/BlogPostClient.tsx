"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BlogPostClientProps {
    children: React.ReactNode;
}

export function BlogPostClient({ children }: BlogPostClientProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    return (
        <>
            {/* Fullscreen Toggle Button */}
            <div className="fixed bottom-24 right-6 z-50 lg:bottom-6">
                <Button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    variant="primary"
                    className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </Button>
            </div>

            {/* Content Wrapper */}
            <div className={isFullscreen ? "fullscreen-reading-mode" : ""}>
                {children}
            </div>

            {/* Fullscreen Styles */}
            <style jsx global>{`
                .fullscreen-reading-mode {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--background);
                    z-index: 40;
                    overflow-y: auto;
                    padding: 2rem;
                }

                .fullscreen-reading-mode .max-w-4xl {
                    max-width: 800px;
                }

                .fullscreen-reading-mode .navbar-hide {
                    display: none;
                }

                @media (max-width: 768px) {
                    .fullscreen-reading-mode {
                        padding: 1rem;
                    }
                }

                /* Hide elements in fullscreen mode */
                .fullscreen-reading-mode .hide-in-fullscreen {
                    display: none !important;
                }
            `}</style>
        </>
    );
}
