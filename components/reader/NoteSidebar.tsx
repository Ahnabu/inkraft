"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Button } from "@/components/ui/Button";
import { X, Trash2, StickyNote } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { INote } from "@/models/Note";
import { toast } from "sonner";

interface NoteSidebarProps {
    postId: string;
    isOpen: boolean;
    onClose: () => void;
    refreshTrigger: number;
}

export function NoteSidebar({ postId, isOpen, onClose, refreshTrigger }: NoteSidebarProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchNotes();
        }
    }, [isOpen, postId, refreshTrigger]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/notes?postId=${postId}`);
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
        } catch (error) {
            console.error("Failed to fetch notes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (noteId: string) => {
        try {
            const res = await fetch(`/api/notes?id=${noteId}`, { method: "DELETE" });
            if (res.ok) {
                setNotes(notes.filter((n) => n._id !== noteId));
                toast.success("Note deleted");
            }
        } catch (error) {
            toast.error("Failed to delete note");
        }
    };

    const scrollToParagraph = (paragraphId: string) => {
        const element = document.getElementById(paragraphId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add("bg-primary/10", "transition-colors", "duration-1000");
            setTimeout(() => {
                element.classList.remove("bg-primary/10");
            }, 2000);
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-border h-16">
                    <div className="flex items-center gap-2">
                        <StickyNote size={18} className="text-primary" />
                        <h2 className="font-bold">My Notes</h2>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {notes.length}
                        </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                        <X size={18} />
                    </Button>
                </div>

                <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="text-center text-muted-foreground py-8">Loading...</div>
                    ) : notes.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8 text-sm">
                            <p>No notes yet.</p>
                            <p className="mt-1">Highlight text to add a note.</p>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div
                                key={note._id}
                                className="group relative bg-card hover:bg-muted/50 border border-border rounded-lg p-3 transition-colors text-left"
                            >
                                <div
                                    className="cursor-pointer"
                                    onClick={() => scrollToParagraph(note.paragraphId)}
                                >
                                    <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(note._id);
                                    }}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                                    title="Delete note"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
