
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

            // Configure marked for syntax highlighting classes
            // This ensures <code> blocks get class="language-js" etc.
            content = await marked.parse(mdContent, {
                gfm: true,
                breaks: true,
            });

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
            const elementsToRemove = [
                "header",
                "footer",
                ".graf--title",
                ".graf--subtitle",
                ".section-divider",
            ];

            elementsToRemove.forEach(selector => {
                const els = article.querySelectorAll(selector);
                els.forEach(el => el.remove());
            });

            // Unwrap <figure> tags for images to simple <img> for TipTap compatibility if needed
            // TipTap can handle figure/img but simple is often better for editors
            const figures = article.querySelectorAll("figure");
            figures.forEach(figure => {
                const img = figure.querySelector("img");
                const caption = figure.querySelector("figcaption");

                if (img) {
                    // Create a clean image element
                    const newImg = doc.createElement("img");
                    newImg.src = img.src;
                    newImg.alt = img.alt || caption?.textContent || "";

                    // Replace figure with just the image
                    figure.replaceWith(newImg);

                    // Append caption if it existed (as a paragraph)
                    if (caption && caption.textContent) {
                        const p = doc.createElement("p");
                        p.textContent = caption.textContent;
                        p.className = "text-center text-sm text-muted-foreground italic mt-2";
                        newImg.after(p);
                    }
                }
            });

            content = article.innerHTML;
        } else {
            return NextResponse.json({ error: "Invalid import type" }, { status: 400 });
        }

        // Sanitize the HTML
        // Allow img tags and attributes needed for TipTap and normal rendering
        const cleanContent = DOMPurify.sanitize(content, {
            ADD_TAGS: ["iframe"], // Allow embeds if any
            ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "target", "class"],
        });

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
