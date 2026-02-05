import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
    gfm: true,
    breaks: true,
});

/**
 * Sanitize and render markdown to HTML
 * Supports: bold, italic, code, links, lists
 * Blocks: images, videos, iframes (spam prevention)
 */
export function renderMarkdown(content: string): string {
    if (!content) return "";

    // Convert markdown to HTML
    const rawHtml = marked.parse(content) as string;

    // Sanitize HTML
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
            "p",
            "br",
            "strong",
            "em",
            "code",
            "pre",
            "a",
            "ul",
            "ol",
            "li",
            "blockquote",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
        ],
        ALLOWED_ATTR: ["href", "class"],
        ALLOW_DATA_ATTR: false,
    });

    return cleanHtml;
}

/**
 * Strip markdown to plain text for previews
 */
export function stripMarkdown(content: string): string {
    if (!content) return "";

    return content
        .replace(/```[\s\S]*?```/g, "") // Remove code blocks
        .replace(/`([^`]+)`/g, "$1") // Remove inline code backticks
        .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
        .replace(/\*([^*]+)\*/g, "$1") // Remove italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
        .replace(/^#+\s+/gm, "") // Remove headers
        .replace(/^[-*+]\s+/gm, "") // Remove list markers
        .replace(/^\d+\.\s+/gm, "") // Remove numbered list markers
        .trim();
}

/**
 * Validate markdown content (check for spam patterns)
 */
export function validateMarkdownContent(content: string): {
    valid: boolean;
    error?: string;
} {
    if (!content || content.trim().length === 0) {
        return { valid: false, error: "Content is required" };
    }

    if (content.length > 5000) {
        return { valid: false, error: "Content too long (max 5000 characters)" };
    }

    // Check for excessive links (spam indicator)
    const linkMatches = content.match(/\[([^\]]+)\]\([^)]+\)/g) || [];
    if (linkMatches.length > 5) {
        return { valid: false, error: "Too many links (max 5)" };
    }

    // Check for URLs without markdown syntax (spam)
    const rawUrlMatches =
        content.match(
            /(?<!\()(https?:\/\/[^\s\)]+)(?!\))/g
        ) || [];
    if (rawUrlMatches.length > 2) {
        return {
            valid: false,
            error: "Please use markdown link syntax: [text](url)",
        };
    }

    return { valid: true };
}
