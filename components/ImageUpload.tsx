"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { ImageIcon, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
    onUpload: (url: string) => void;
    onCancel?: () => void;
}

export function ImageUpload({ onUpload, onCancel }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        setUploading(true);
        toast.loading("Uploading image...", { id: "image-upload" });

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async () => {
                const base64 = reader.result as string;

                // Upload to Cloudinary via API
                const response = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64 }),
                });

                if (!response.ok) {
                    throw new Error("Upload failed");
                }

                const data = await response.json();
                toast.success("Image uploaded successfully!", { id: "image-upload" });
                onUpload(data.url);
            };

            reader.onerror = () => {
                throw new Error("Failed to read file");
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Upload failed";
            toast.error(`Upload error: ${message}`, { id: "image-upload" });
            setUploading(false);
        }
    };

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

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleUpload(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleUpload(files[0]);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                />

                {uploading ? (
                    <div className="space-y-3">
                        <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">
                                Drag and drop an image here, or click to select
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, GIF up to 10MB
                            </p>
                        </div>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            type="button"
                        >
                            <ImageIcon size={16} className="mr-2" />
                            Select Image
                        </Button>
                    </div>
                )}
            </div>

            {onCancel && (
                <div className="flex justify-end">
                    <Button onClick={onCancel} variant="ghost" size="sm" type="button">
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    );
}
