"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { MessageSquarePlus, X, Copy } from "lucide-react";
import { toast } from "sonner";

interface NotePopoverProps {
    paragraphId: string;
    selectionRect: DOMRect | null;
    onClose: () => void;
    onSave: (note: string) => Promise<void>;
}

export function NotePopover({ paragraphId, selectionRect, onClose, onSave }: NotePopoverProps) {
    const [note, setNote] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const [mode, setMode] = useState<"menu" | "note">("menu");

    useEffect(() => {
        if (selectionRect) {
            setIsOpen(true);
            setMode("menu"); // Reset to menu on new selection
        } else {
            setIsOpen(false);
        }
    }, [selectionRect]);

    useEffect(() => {
        if (isOpen && mode === "note" && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, mode]);

    if (!selectionRect || !isOpen) return null;

    const top = selectionRect.top + window.scrollY - (mode === "menu" ? 50 : 100); // Adjust position based on height
    const left = selectionRect.left + window.scrollX + selectionRect.width / 2;

    const handleCopy = () => {
        const selection = window.getSelection();
        if (selection) {
            // We need to get the HTML content. 
            // Since we are in the browser, we can use a temporary element or the helper.
            // But we can't import the helper easily if it uses 'turndown' which might be heavy?
            // Actually, we can import it.
            import("@/lib/utils/serialization").then(({ htmlToMarkdown, getSelectionHtml }) => {
                const html = getSelectionHtml();
                const markdown = htmlToMarkdown(html);
                navigator.clipboard.writeText(markdown).then(() => {
                    toast.success("Copied as Markdown");
                    onClose();
                });
            });
        }
    };

    const handleSave = async () => {
        if (!note.trim()) return;
        setSaving(true);
        try {
            await onSave(note);
            setNote("");
            onClose();
        } catch (error) {
            console.error("Failed to save note", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="absolute z-[60] flex flex-col gap-2 p-3 bg-card border border-border rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200 ring-1 ring-black/5"
            style={{
                top,
                left,
                transform: "translateX(-50%)",
                width: mode === "menu" ? "auto" : "min(90vw, 20rem)"
            }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            {mode === "menu" ? (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMode("note")}
                        className="h-8 px-2 text-xs flex items-center gap-1.5"
                    >
                        <MessageSquarePlus size={14} />
                        Add Note
                    </Button>
                    <div className="w-px h-4 bg-border" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-8 px-2 text-xs flex items-center gap-1.5"
                    >
                        <Copy size={14} />
                        Copy MD
                    </Button>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-muted-foreground">Add Private Note</span>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                            <X size={14} />
                        </button>
                    </div>
                    <textarea
                        ref={inputRef}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        onMouseDown={(e) => e.stopPropagation()}
                        placeholder="Type your private note here..."
                        className="w-full h-24 p-3 text-sm bg-muted/50 hover:bg-muted/80 transition-colors rounded-lg border-none focus:ring-2 focus:ring-primary/50 resize-none outline-none"
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMode("menu")}
                            className="flex-1 text-xs"
                        >
                            Back
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={saving || !note.trim()}
                            className="flex-1 text-xs"
                        >
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
