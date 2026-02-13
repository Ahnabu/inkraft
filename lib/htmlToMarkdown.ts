/**
 * Simple HTML to Markdown converter
 * Handles basic formatting: bold, italic, links, lists, headers, code, blockquotes
 */
export function htmlToMarkdown(html: string): string {
    // Create a temporary DOM element to parse HTML
    const div = document.createElement('div');
    div.innerHTML = html;

    // Helper to process nodes recursively
    function processNode(node: Node): string {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || '';
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();
        let content = Array.from(el.childNodes).map(processNode).join('');

        switch (tagName) {
            case 'strong':
            case 'b':
                return `**${content}**`;
            case 'em':
            case 'i':
                return `*${content}*`;
            case 'a':
                const href = el.getAttribute('href');
                return href ? `[${content}](${href})` : content;
            case 'code':
                return `\`${content}\``;
            case 'pre':
                return `\n\`\`\`\n${content}\n\`\`\`\n`;
            case 'blockquote':
                return `\n> ${content.trim().replace(/\n/g, '\n> ')}\n`;
            case 'ul':
            case 'ol':
                return `\n${content}\n`;
            case 'li':
                return `- ${content}\n`;
            case 'h1':
                return `\n# ${content}\n`;
            case 'h2':
                return `\n## ${content}\n`;
            case 'h3':
                return `\n### ${content}\n`;
            case 'h4':
                return `\n#### ${content}\n`;
            case 'h5':
                return `\n##### ${content}\n`;
            case 'h6':
                return `\n###### ${content}\n`;
            case 'p':
                return `\n${content}\n`;
            case 'br':
                return '\n';
            case 'div':
            case 'span':
            default:
                return content;
        }
    }

    // Process and clean up common markdown issues
    let markdown = processNode(div);

    // Fix multiple newlines
    markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n');

    return markdown.trim();
}
