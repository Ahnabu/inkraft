/**
 * Calculate reading time in minutes from HTML content
 * @param html HTML content string
 * @returns Reading time in minutes (rounded up)
 */
export function calculateReadingTime(html: string): number {
    // Strip HTML tags
    const text = html.replace(/<[^>]*>/g, '');

    // Count words (split by whitespace)
    const words = text.trim().split(/\s+/).filter(Boolean).length;

    // Average reading speed: 200 words per minute
    const minutes = Math.ceil(words / 200);

    return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Count words in HTML content
 * @param html HTML content string
 * @returns Word count
 */
export function countWords(html: string): number {
    const text = html.replace(/<[^>]*>/g, '');
    return text.trim().split(/\s+/).filter(Boolean).length;
}
