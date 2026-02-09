
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import matter from "gray-matter";
import { marked } from "marked";
import { JSDOM } from "jsdom";
import DOMPurify from "isomorphic-dompurify";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string; // "markdown" | "medium"

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const text = new TextDecoder("utf-8").decode(buffer);

        let title = "";
        let content = "";
        let tags: string[] = [];

        if (type === "markdown") {
            // Parse Frontmatter using gray-matter
            const { data, content: mdContent } = matter(text);

            title = data.title || file.name.replace(/\.md$/, "");

            if (data.tags) {
                if (Array.isArray(data.tags)) {
                    tags = data.tags;
                } else if (typeof data.tags === 'string') {
                    tags = data.tags.split(',').map((t: string) => t.trim());
                }
            }

            // Convert Markdown to HTML
            content = await marked.parse(mdContent);

        } else if (type === "medium") {
            // Medium exports are HTML files
            const dom = new JSDOM(text);
            const doc = dom.window.document;

            const h1 = doc.querySelector("h1");
            title = h1?.textContent || file.name.replace(/\.html$/, "");

            if (h1) h1.remove();

            // Select the main article content. Medium exports often wrap in .h-entry or verify existing structure
            // Fallback to body if no specific container found
            const article = doc.querySelector(".h-entry") || doc.querySelector("article") || doc.body;

            // Cleanup common Medium export noise
            // Remove the "Written by" header if exists
            const header = article.querySelector("header");
            if (header) header.remove();

            // Remove footer which often contains "Originally published at..."
            const footer = article.querySelector("footer");
            if (footer) footer.remove();

            content = article.innerHTML;
        } else {
            return NextResponse.json({ error: "Invalid import type" }, { status: 400 });
        }

        // Sanitize the HTML
        const cleanContent = DOMPurify.sanitize(content);

        return NextResponse.json({
            title,
            content: cleanContent,
            tags
        });

    } catch (error) {
        console.error("Import error:", error);
        return NextResponse.json(
            { error: "Failed to process file" },
            { status: 500 }
        );
    }
}
