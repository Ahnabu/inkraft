"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
    postSlug: string;
    initialSaved: boolean;
    onSaveChange?: (isSaved: boolean) => void;
}

export function SaveButton({ postSlug, initialSaved, onSaveChange }: SaveButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [saved, setSaved] = useState(initialSaved);
    const [loading, setLoading] = useState(false);

    const handleToggleSave = async () => {
        if (!session) {
            toast.error("Please sign in to save posts");
            return;
        }

        setLoading(true);
        // Optimistic update
        const newSavedState = !saved;
        setSaved(newSavedState);

        try {
            const response = await fetch(`/api/posts/${postSlug}/save`, {
                method: "POST",
            });

            if (!response.ok) {
                // Revert if failed
                setSaved(!newSavedState);
                if (response.status === 401) {
                    toast.error("Please sign in to save posts");
                } else {
                    toast.error("Failed to save post");
                }
                return;
            }

            const data = await response.json();

            // Sync with server response
            setSaved(data.saved);
            if (onSaveChange) {
                onSaveChange(data.saved);
            }

            toast.success(data.saved ? "Post saved to your profile" : "Post removed from saved");
            router.refresh();
        } catch (error) {
            // Revert on error
            setSaved(!newSavedState);
            console.error("Error saving post:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleSave}
            disabled={loading}
            className={cn(
                "flex items-center gap-2 transition-all",
                saved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
            )}
            title={saved ? "Remove from saved" : "Save for later"}
        >
            <Bookmark size={20} className={cn(saved && "fill-current")} />
            <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
        </Button>
    );
}
