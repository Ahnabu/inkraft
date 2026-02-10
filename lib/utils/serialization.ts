import TurndownService from "turndown";

const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
});

// Configure turndown to roughly match our editor's output style
turndownService.addRule("strikethrough", {
    filter: ["del", "s", "strike"] as any,
    replacement: function (content) {
        return "~" + content + "~";
    },
});

export function htmlToMarkdown(html: string): string {
    return turndownService.turndown(html);
}

export function getSelectionHtml(): string {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return "";

    const container = document.createElement("div");
    for (let i = 0; i < selection.rangeCount; i++) {
        container.appendChild(selection.getRangeAt(i).cloneContents());
    }
    return container.innerHTML;
}
