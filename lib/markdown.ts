import { marked } from "marked";
import DOMPurify from "dompurify";

// Custom renderer for better HTML output
const renderer = new marked.Renderer();

// Customize heading rendering with IDs for TOC
renderer.heading = ({ text, depth }) => {
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${depth} id="${id}">${text}</h${depth}>`;
};

// Customize code blocks with language class
renderer.code = ({ text, lang }) => {
    const language = lang || 'plaintext';
    return `<pre><code class="language-${language}">${text}</code></pre>`;
};

// Customize blockquotes
renderer.blockquote = ({ text }) => {
    return `<blockquote>${text}</blockquote>`;
};

// Customize images with figure wrapper
renderer.image = ({ href, title, text }) => {
    const titleAttr = title ? `title="${title}"` : '';
    if (title) {
        return `<figure><img src="${href}" alt="${text}" ${titleAttr} loading="lazy" /><figcaption>${title}</figcaption></figure>`;
    }
    return `<img src="${href}" alt="${text}" loading="lazy" />`;
};

// Customize tables to be responsive
renderer.table = (token) => {
    const header = token.header;
    const body = token.rows;
    return `<div class="table-wrapper"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
};

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
    gfm: true,
    breaks: true,
    renderer: renderer,
});

/**
 * Enhanced markdown to HTML conversion for blog posts
 * Supports: headings, bold, italic, code, links, lists, blockquotes, images, tables
 */
export function renderMarkdown(content: string): string {
    if (!content) return "";

    // Convert markdown to HTML
    const rawHtml = marked.parse(content) as string;

    // Sanitize HTML with extended tag support for blog posts
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
            // Text formatting
            "p", "br", "strong", "em", "b", "i", "u", "s", "mark",
            "code", "pre", "kbd", "sub", "sup", "small",
            // Links
            "a",
            // Lists
            "ul", "ol", "li", "dl", "dt", "dd",
            // Quotes and blocks
            "blockquote", "cite",
            // Headings
            "h1", "h2", "h3", "h4", "h5", "h6",
            // Tables
            "table", "thead", "tbody", "tfoot", "tr", "th", "td",
            // Divisions
            "div", "span", "hr",
            // Images and media
            "img", "figure", "figcaption",
            // Abbreviations
            "abbr",
        ],
        ALLOWED_ATTR: [
            "href", "title", "target", "rel",
            "class", "id",
            "src", "alt", "loading",
            "colspan", "rowspan",
            "start", "type",
        ],
        ALLOW_DATA_ATTR: false,
    });

    return cleanHtml;
}

/**
 * Render markdown with syntax highlighting support
 * This is an enhanced version for full blog post rendering
 */
export function renderBlogMarkdown(content: string): string {
    if (!content) return "";

    // Process callout boxes (custom syntax)
    let processedContent = content.replace(
        /:::(\w+)\s+([\s\S]*?):::/g,
        (_, type, text) => {
            return `<div class="callout ${type.toLowerCase()}">${text.trim()}</div>`;
        }
    );

    // Convert markdown to HTML
    const rawHtml = marked.parse(processedContent) as string;

    // Sanitize HTML
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
            "p", "br", "strong", "em", "b", "i", "u", "s", "mark",
            "code", "pre", "kbd", "sub", "sup", "small",
            "a", "ul", "ol", "li", "dl", "dt", "dd",
            "blockquote", "cite",
            "h1", "h2", "h3", "h4", "h5", "h6",
            "table", "thead", "tbody", "tfoot", "tr", "th", "td",
            "div", "span", "hr",
            "img", "figure", "figcaption",
            "abbr",
        ],
        ALLOWED_ATTR: [
            "href", "title", "target", "rel",
            "class", "id",
            "src", "alt", "loading",
            "colspan", "rowspan",
            "start", "type",
        ],
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
