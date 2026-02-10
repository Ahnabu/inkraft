/**
 * Calculate reading time in minutes from HTML content, accounting for images and code blocks.
 * Base speed: 200 WPM
 * Images: 12 seconds each
 * Code blocks: ~20 seconds each
 * @param html HTML content string
 * @returns Reading time in minutes (rounded up)
 */
export function calculateReadingTime(html: string): number {
    // Count images
    const imageCount = (html.match(/<img/g) || []).length;

    // Count code blocks (pre tags usually wrap code in Tiptap/Markdown)
    const codeBlockCount = (html.match(/<pre/g) || []).length;

    // Strip HTML tags for word count
    const text = html.replace(/<[^>]*>/g, ' ');
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    // Calculate time in seconds
    const wordsPerSecond = 200 / 60; // ~3.33 words per second
    const wordTimeSeconds = wordCount / wordsPerSecond;
    const imageTimeSeconds = imageCount * 12;
    const codeBlockTimeSeconds = codeBlockCount * 20;

    const totalSeconds = wordTimeSeconds + imageTimeSeconds + codeBlockTimeSeconds;
    const minutes = Math.ceil(totalSeconds / 60);

    return Math.max(1, minutes);
}

/**
 * Count words in HTML content
 * @param html HTML content string
 * @returns Word count
 */
export function countWords(html: string): number {
    const text = html.replace(/<[^>]*>/g, ' ');
    return text.trim().split(/\s+/).filter(Boolean).length;
}
