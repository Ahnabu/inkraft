"use client";

import { useState, useEffect } from "react";
import { X, Save, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import { Post } from "@/app/admin/AdminClient"; // Reuse interface or duplicate if needed

interface InternalNote {
    _id: string;
    content: string;
    author: {
        name: string;
        image?: string;
    };
    createdAt: string;
    resolved: boolean;
}

interface PostWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post;
    onUpdate: (updatedPost: Post) => void;
}

export function PostWorkflowModal({ isOpen, onClose, post, onUpdate }: PostWorkflowModalProps) {
    const [status, setStatus] = useState(post.published ? "published" : "draft"); // Simple init, will be refined
    const [notes, setNotes] = useState<InternalNote[]>([]);
    const [newNote, setNewNote] = useState("");
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [submittingNote, setSubmittingNote] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Initial status load - in real implementation, post should have 'status' field.
    // Assuming post prop might not have it yet if type mismatch, but API supports it.
    useEffect(() => {
        if (isOpen && post) {
            // Fetch latest post details to get status if not in list view yet?
            // Or just trust props.
            // Let's assume props are fresh enough or fetch notes first.
            fetchNotes();
            // If post has status field, use it.
            setStatus(post.status || (post.published ? "published" : "draft"));
        }
    }, [isOpen, post]);

    const fetchNotes = async () => {
        setLoadingNotes(true);
        try {
            const res = await fetch(`/api/admin/posts/${post._id}/notes`);
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
            toast.error("Failed to load notes");
        } finally {
            setLoadingNotes(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        setUpdatingStatus(true);
        try {
            const res = await fetch(`/api/admin/posts/${post._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                const updatedPost = await res.json();
                setStatus(newStatus);
                onUpdate(updatedPost);
                toast.success(`Status updated to ${newStatus}`);
            } else {
                throw new Error("Failed update");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setSubmittingNote(true);
        try {
            const res = await fetch(`/api/admin/posts/${post._id}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newNote }),
            });

            if (res.ok) {
                const note = await res.json();
                setNotes([note, ...notes]);
                setNewNote("");
                toast.success("Note added");
            } else {
                throw new Error("Failed to add note");
            }
        } catch (error) {
            console.error("Error adding note:", error);
            toast.error("Failed to add note");
        } finally {
            setSubmittingNote(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <GlassCard className="w-full max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-start bg-muted/30">
                    <div>
                        <h2 className="text-xl font-bold">{post.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Editorial Workflow Management
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Status Section */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Current Status
                        </label>
                        <div className="flex gap-3 flex-wrap">
                            {["draft", "submitted", "needs_revision", "scheduled", "published"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleStatusChange(s)}
                                    disabled={updatingStatus}
                                    className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 capitalize ${status === s
                                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                                            : "bg-background border-border hover:bg-muted"
                                        } ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {status === s && <CheckCircle className="h-4 w-4" />}
                                    {s.replace("_", " ")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" /> Internal Notes
                            </label>
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                {notes.length}
                            </span>
                        </div>

                        {/* Add Note */}
                        <div className="flex gap-2">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add an editorial note..."
                                className="flex-1 min-h-[80px] p-3 rounded-lg bg-secondary/50 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddNote();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleAddNote}
                                disabled={submittingNote || !newNote.trim()}
                                className="h-auto self-end"
                            >
                                <Save className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Notes List */}
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {loadingNotes ? (
                                <div className="space-y-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
                                    ))}
                                </div>
                            ) : notes.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                                    No notes yet
                                </div>
                            ) : (
                                notes.map((note) => (
                                    <div key={note._id} className="bg-card border border-border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                {note.author.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={note.author.image}
                                                        alt={note.author.name}
                                                        className="w-5 h-5 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center text-[10px] font-bold text-primary">
                                                        {note.author.name?.[0]}
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium">{note.author.name}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                                            {note.content}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
