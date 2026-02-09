
"use client";

import { useState } from "react";
import { Upload, FileText, FileCode, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImportModalProps {
    onImport: (content: string, title?: string, tags?: string[]) => void;
    onClose: () => void;
}

export function ImportModal({ onImport, onClose }: ImportModalProps) {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        // Validate file type
        const isMarkdown = file.name.endsWith(".md") || file.name.endsWith(".markdown");
        const isHTML = file.name.endsWith(".html") || file.type === "text/html";

        if (!isMarkdown && !isHTML) {
            toast.error("Please upload a Markdown (.md) or HTML (.html) file");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", isMarkdown ? "markdown" : "medium");

        try {
            const response = await fetch("/api/posts/import", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Import failed");

            const data = await response.json();

            toast.success("Content imported successfully");
            onImport(data.content, data.title, data.tags);
            onClose();

        } catch (error) {
            console.error(error);
            toast.error("Failed to import file");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-background rounded-xl max-w-md w-full shadow-2xl border border-border">
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h3 className="font-semibold text-lg">Import Content</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Loader2 size={32} className="animate-spin text-primary" />
                                <p>Processing file...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-center gap-4 mb-4 text-muted-foreground">
                                    <FileCode size={32} />
                                    <FileText size={32} />
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Drag & drop your file here, or click to select.<br />
                                    Supports <strong>Markdown</strong> (.md) and <strong>Medium Export</strong> (.html)
                                </p>
                                <label className="inline-flex cursor-pointer">
                                    <span className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                        <Upload size={16} />
                                        Select File
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".md,.markdown,.html"
                                        onChange={handleChange}
                                    />
                                </label>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
