"use client";

import { useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ImageUploadButtonProps {
    onUploadComplete: (url: string) => void;
}

export function ImageUploadButton({ onUploadComplete }: ImageUploadButtonProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5MB");
            return;
        }

        setError("");
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            onUploadComplete(data.url);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Upload failed";
            setError(message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label htmlFor="image-upload">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    className="w-full cursor-pointer"
                    onClick={() => document.getElementById("image-upload")?.click()}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={16} />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload size={16} className="mr-2" />
                            Upload Image
                        </>
                    )}
                </Button>
            </label>
            <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <X size={12} />
                    {error}
                </p>
            )}
        </div>
    );
}
