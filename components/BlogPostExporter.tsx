"use client";

import { Download, FileJson, FileText, FileType } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import TurndownService from "turndown";
import { toast } from "sonner"; // Assuming sonner is used for toasts

interface BlogPostExporterProps {
    post: {
        title: string;
        slug: string;
        content: string; // HTML content
        [key: string]: any;
    };
}

export function BlogPostExporter({ post }: BlogPostExporterProps) {
    const handlePdfExport = async () => {
        const content = document.getElementById("blog-content");
        if (!content) {
            toast.error("Could not find blog content");
            return;
        }

        const promise = new Promise(async (resolve, reject) => {
            try {
                const canvas = await html2canvas(content, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                });

                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "px",
                    format: [canvas.width, canvas.height],
                });

                pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
                pdf.save(`${post.slug}.pdf`);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });

        toast.promise(promise, {
            loading: "Generating PDF...",
            success: "PDF downloaded successfully",
            error: "Failed to generate PDF",
        });
    };

    const handleMarkdownExport = () => {
        try {
            const turndownService = new TurndownService({
                headingStyle: "atx",
                codeBlockStyle: "fenced",
            });
            const markdown = turndownService.turndown(post.content);
            const blob = new Blob([markdown], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${post.slug}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("Markdown downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate Markdown");
        }
    };

    const handleJsonExport = () => {
        try {
            const jsonString = JSON.stringify(post, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${post.slug}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("JSON downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate JSON");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Download size={16} />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handlePdfExport}>
                    <FileType className="mr-2 h-4 w-4" />
                    <span>PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMarkdownExport}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Markdown</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleJsonExport}>
                    <FileJson className="mr-2 h-4 w-4" />
                    <span>JSON</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
