
import Link from "next/link";
import {
    StickyNote,
    ArrowUp
} from "lucide-react";

interface DashboardNotesProps {
    notes: any[];
}

export function DashboardNotes({ notes }: DashboardNotesProps) {
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">My Notes</h2>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                        {notes.length}
                    </span>
                </div>
            </div>

            {notes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-muted/10">
                    {notes.map((note: any) => (
                        <Link
                            key={note._id}
                            href={`/blog/${note.postId?.slug || '#'}#${note.paragraphId}`}
                            className="block group h-full"
                        >
                            <div className="bg-card hover:bg-card/80 hover:shadow-md border border-border rounded-lg p-5 h-full transition-all flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors"></div>
                                <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                                    <StickyNote size={14} className="text-primary" />
                                    <span className="truncate max-w-[150px] font-medium text-foreground">
                                        {note.postId?.title || 'Unknown Post'}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-foreground/90 line-clamp-4 flex-1 whitespace-pre-wrap leading-relaxed italic">
                                    &ldquo;{note.content}&rdquo;
                                </p>
                                <div className="mt-4 pt-3 border-t border-border/50 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 justify-end">
                                    View in context <ArrowUp size={12} className="rotate-45" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center text-muted-foreground">
                    <StickyNote size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="font-medium">You haven&apos;t added any private notes yet.</p>
                    <p className="text-sm mt-1">Highlight text in any article to add a note.</p>
                </div>
            )}
        </div>
    );
}
