"use client";

import { useState } from "react";
import { Sparkles, X, Wand2, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface AIAssistantProps {
    editor: any; // TipTap editor instance
    isOpen: boolean;
    onClose: () => void;
    postId: string;
}

export function AIAssistant({ editor, isOpen, onClose, postId }: AIAssistantProps) {
    const t = useTranslations("AIAssistant"); // Accessing i18n
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Get selected text
    const selection = editor?.state.selection;
    const selectedText = selection ? editor?.state.doc.textBetween(selection.from, selection.to, " ") : "";

    const handleAIRequest = async (type: string) => {
        if (!selectedText && type !== "continue_writing") {
            toast.error("Please select some text first");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: selectedText,
                    type,
                    postId,
                    context: editor?.getText() // Send full context if needed
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403) {
                    setError(data.message);
                } else {
                    throw new Error(data.error || "Failed to generate AI response");
                }
                return;
            }

            setResult(data.result);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const applyResult = () => {
        if (result) {
            editor?.chain().focus().insertContent(result).run(); // Replace or insert
            onClose();
            setResult(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-4 top-24 z-50 w-80 animate-in slide-in-from-right-10 fade-in duration-300">
            <GlassCard className="p-4 shadow-xl border-primary/20">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <Sparkles size={16} />
                        <span>AI Assistant</span>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={16} />
                    </button>
                </div>

                {!selectedText && !result && !isLoading && (
                    <div className="text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
                        Select text in the editor to improve it, or choose an option below.
                    </div>
                )}

                {/* Error State (Quota) */}
                {error && (
                    <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <div>{error}</div>
                    </div>
                )}

                {/* Options */}
                {!result && !error && (
                    <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Actions</div>

                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleAIRequest("improve_writing")}
                            disabled={isLoading || !selectedText}
                        >
                            <Wand2 size={14} className="mr-2" />
                            Improve Writing
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleAIRequest("fix_grammar")}
                            disabled={isLoading || !selectedText}
                        >
                            <Check size={14} className="mr-2" />
                            Fix Grammar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleAIRequest("make_concise")}
                            disabled={isLoading || !selectedText}
                        >
                            <ParsedIcon icon="minimize" className="mr-2 h-3 w-3" />
                            Make Concise
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleAIRequest("complete_sentence")}
                            disabled={isLoading || !selectedText}
                        >
                            <ParsedIcon icon="arrow-right" className="mr-2 h-3 w-3" />
                            Complete Thought
                        </Button>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="py-8 text-center flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="animate-spin mb-2" size={24} />
                        <span className="text-sm">Thinking...</span>
                    </div>
                )}

                {/* Result Preview */}
                {result && (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                        <div className="text-xs font-semibold mb-2 text-muted-foreground">Suggestion:</div>
                        <div className="p-3 bg-secondary/50 rounded-lg text-sm mb-4 border border-border max-h-60 overflow-y-auto">
                            {result}
                        </div>
                        <div className="flex gap-2">
                            <Button className="flex-1" size="sm" onClick={applyResult}>
                                Apply
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setResult(null)}>
                                Discard
                            </Button>
                        </div>
                    </div>
                )}

            </GlassCard>
        </div>
    );
}

// Helper to avoid lucide import errors if icons missing in specific version
function ParsedIcon({ icon, className }: { icon: string, className?: string }) {
    if (icon === "minimize") return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" /><path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" /></svg>;
    if (icon === "arrow-right") return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
    return null;
}
