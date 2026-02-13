"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Button } from "@/components/ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, StickyNote, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface NoteSidebarProps {
    postId: string;
    isOpen: boolean;
    onClose: () => void;
    refreshTrigger: number;
}

export function NoteSidebar({ postId, isOpen, onClose, refreshTrigger }: NoteSidebarProps) {
    const t = useTranslations("Notes");
    const tCommon = useTranslations("Common");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNoteContent, setNewNoteContent] = useState("");

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
                toast.success(t("noteDeleted"));
            }
        } catch (error) {
            toast.error(t("deleteFailed"));
        }
    };

    const handleEditStart = (note: any) => {
        setEditingNoteId(note._id);
        setEditContent(note.content);
    };

    const handleAddNote = async () => {
        if (!newNoteContent.trim()) return;

        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId,
                    content: newNoteContent,
                    // paragraphId is optional for general notes
                }),
            });

            if (res.ok) {
                const savedNote = await res.json();
                setNotes([savedNote, ...notes]);
                setNewNoteContent("");
                setIsAddingNote(false);
                toast.success(t("noteAdded"));
            } else {
                toast.error(t("addFailed"));
            }
        } catch (error) {
            console.error("Failed to add note", error);
            toast.error(t("addFailed"));
        }
    };

    const handleEditSave = async (noteId: string) => {
        try {
            const res = await fetch(`/api/notes?id=${noteId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editContent }),
            });
            if (res.ok) {
                setNotes(notes.map(n => n._id === noteId ? { ...n, content: editContent } : n));
                setEditingNoteId(null);
                toast.success(t("noteUpdated"));
            }
        } catch (error) {
            toast.error(t("updateFailed"));
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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop (mobile only or if needed) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/20 backdrop-blur-sm z-40 lg:hidden"
                    />

                    {/* Floating Card Sidebar */}
                    <motion.div
                        drag
                        dragMomentum={false}
                        initial={{ opacity: 0, scale: 0.95, y: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed top-[20%] right-6 w-80 max-h-[60vh] flex flex-col bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl z-50 overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 cursor-move active:cursor-grabbing">
                            <div className="flex items-center gap-2">
                                <StickyNote size={18} className="text-primary" />
                                <h2 className="font-semibold text-foreground">{t("myNotes")}</h2>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                                    {notes.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsAddingNote(!isAddingNote)}
                                    className={cn("h-8 w-8 p-0 hover:bg-muted", isAddingNote && "bg-muted text-primary")}
                                    title={t("addNote")}
                                >
                                    <Plus size={18} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-muted">
                                    <X size={18} />
                                </Button>
                            </div>
                        </div>

                        {/* Add New Note Area */}
                        <AnimatePresence>
                            {isAddingNote && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-b border-border bg-muted/20 overflow-hidden"
                                >
                                    <div className="p-3 space-y-2">
                                        <textarea
                                            value={newNoteContent}
                                            onChange={(e) => setNewNoteContent(e.target.value)}
                                            placeholder={t("generalNotePlaceholder")}
                                            className="w-full p-2 text-sm bg-background/50 rounded-md border border-border focus:ring-1 focus:ring-primary min-h-[80px] resize-none outline-none"
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => setIsAddingNote(false)} className="h-7 text-xs">{tCommon("cancel")}</Button>
                                            <Button size="sm" onClick={handleAddNote} disabled={!newNoteContent.trim()} className="h-7 text-xs">{t("addNote")}</Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm">{t("loadingNotes")}</span>
                                </div>
                            ) : notes.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8 text-sm bg-muted/20 rounded-lg border border-border/50 p-4">
                                    <StickyNote size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>{t("noNotes")}</p>
                                    <p className="mt-1 text-xs">{t("highlightTip")}</p>
                                </div>
                            ) : (
                                notes.map((note) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={note._id}
                                        className="group relative bg-muted/30 hover:bg-muted/50 border border-border rounded-lg p-3 transition-colors text-left"
                                    >
                                        {editingNoteId === note._id ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full p-2 text-sm bg-background rounded-md border border-border focus:ring-1 focus:ring-primary min-h-[80px] resize-none"
                                                    autoFocus
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <Button size="sm" variant="ghost" onClick={() => setEditingNoteId(null)} className="h-7 text-xs">{tCommon("cancel")}</Button>
                                                    <Button size="sm" onClick={() => handleEditSave(note._id)} className="h-7 text-xs">{tCommon("save")}</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div
                                                    className={cn("space-y-1", note.paragraphId && "cursor-pointer hover:opacity-80 transition-opacity")}
                                                    onClick={() => note.paragraphId && scrollToParagraph(note.paragraphId)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] text-muted-foreground font-medium bg-muted/50 px-1.5 py-0.5 rounded">
                                                            {note.paragraphId ? t("contextualNote") : t("generalNote")}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{note.content}</p>
                                                </div>
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-background/90 p-1 rounded-md border border-border shadow-sm backdrop-blur-sm">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleEditStart(note); }}
                                                        className="p-1 text-muted-foreground hover:text-primary transition-colors hover:bg-muted rounded"
                                                        title={tCommon("edit")}
                                                    >
                                                        <StickyNote size={12} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(note._id); }}
                                                        className="p-1 text-muted-foreground hover:text-destructive transition-colors hover:bg-muted rounded"
                                                        title={tCommon("delete")}
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer / Tip */}
                        <div className="p-3 bg-muted/30 border-t border-border text-[10px] text-center text-muted-foreground">
                            {t("privateDisclaimer")}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
