"use client";

import { Share2, Twitter, Linkedin, Link2, Check, Facebook, Instagram } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
    title: string;
    url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        // Instagram doesn't support direct URL sharing, so we'll copy the link
        // Threads uses a similar pattern to Twitter
        threads: `https://threads.net/intent/post?text=${encodeURIComponent(title + ' ' + url)}`,
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleInstagramShare = () => {
        // Instagram doesn't support URL sharing, so copy link and notify user
        copyToClipboard();
        toast.success("Link copied! You can now paste it in your Instagram post or story.");
    };

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Share2 size={16} />
                Share:
            </span>
            <div className="flex gap-2 flex-wrap">
                <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Share on Facebook"
                    title="Share on Facebook"
                >
                    <Facebook size={18} />
                </a>
                <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Share on Twitter"
                    title="Share on Twitter"
                >
                    <Twitter size={18} />
                </a>
                <a
                    href={shareLinks.threads}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Share on Threads"
                    title="Share on Threads"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.186 3.094c-2.167 0-3.97.857-5.348 2.548l1.483 1.03c1.03-1.266 2.336-1.896 3.865-1.896 1.483 0 2.67.63 3.52 1.87.85 1.24 1.275 2.91 1.275 5.01 0 2.1-.425 3.77-1.275 5.01-.85 1.24-2.037 1.87-3.52 1.87-1.483 0-2.67-.63-3.52-1.87-.85-1.24-1.275-2.91-1.275-5.01 0-.425.03-.85.09-1.275l-1.8-.18c-.09.485-.135.97-.135 1.455 0 2.55.605 4.59 1.815 6.12 1.21 1.53 2.835 2.295 4.875 2.295 2.04 0 3.665-.765 4.875-2.295 1.21-1.53 1.815-3.57 1.815-6.12 0-2.55-.605-4.59-1.815-6.12-1.21-1.53-2.835-2.295-4.875-2.295z" />
                    </svg>
                </a>
                <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Share on LinkedIn"
                    title="Share on LinkedIn"
                >
                    <Linkedin size={18} />
                </a>
                <button
                    onClick={handleInstagramShare}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Share on Instagram"
                    title="Copy link for Instagram"
                >
                    <Instagram size={18} />
                </button>
                <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Copy link"
                    title="Copy link"
                >
                    {copied ? <Check size={18} className="text-green-500" /> : <Link2 size={18} />}
                </button>
            </div>
        </div>
    );
}
