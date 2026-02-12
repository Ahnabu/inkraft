"use client";

import { useCompletion } from "ai/react";
import { useState } from "react";
import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Sparkles, Loader2, ArrowRight, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AIBubbleMenuProps {
    editor: Editor;
}

export function AIBubbleMenu({ editor }: AIBubbleMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { completion, complete, isLoading, setCompletion } = useCompletion({
        api: "/api/ai/generate",
        onError: (err) => {
            toast.error(err.message || "Failed to generate AI response");
        },
    });

    const handleAskAI = async (command: string) => {
        const selection = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            " "
        );

        if (!selection) {
            toast.error("Please select some text first");
            return;
        }

        await complete(command, {
            body: { context: selection },
        });
    };

    const applyExplanation = () => {
        if (!completion) return;

        // Append the completion after the selection or replace it?
        // Let's replace the selection with the completion
        editor.chain().focus().insertContent(completion).run();
        setCompletion("");
        setIsOpen(false);
    };

    const discardCallback = () => {
        setCompletion("");
        setIsOpen(false);
    };

    if (!editor) return null;

    return (
        <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100, maxWidth: 400 }}
            className="flex flex-col bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl overflow-hidden p-1 min-w-[300px]"
        >
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors w-full"
                >
                    <Sparkles size={16} />
                    Ask AI
                </button>
            ) : (
                <div className="flex flex-col gap-2 p-2">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-1">
                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            <Sparkles size={12} className="text-purple-500" />
                            AI Assistant
                        </span>
                        <button onClick={discardCallback} className="text-muted-foreground hover:text-foreground">
                            <X size={14} />
                        </button>
                    </div>

                    {/* Completion Area */}
                    {completion && (
                        <div className="bg-muted/50 rounded-md p-3 text-sm my-2 max-h-[200px] overflow-y-auto prose dark:prose-invert">
                            {completion}
                        </div>
                    )}

                    {/* Actions */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-4 text-muted-foreground gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-xs">Generating...</span>
                        </div>
                    ) : completion ? (
                        <div className="flex gap-2">
                            <button
                                onClick={discardCallback}
                                className="flex-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                onClick={applyExplanation}
                                className="flex-1 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors flex items-center justify-center gap-1.5"
                            >
                                <ArrowRight size={12} />
                                Replace Selection
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-1">
                            <button
                                onClick={() => handleAskAI("Improve grammar and flow")}
                                className="text-left px-2 py-1.5 text-sm hover:bg-muted rounded transition-colors flex items-center gap-2"
                            >
                                <span className="text-lg">✨</span> Improve writing
                            </button>
                            <button
                                onClick={() => handleAskAI("Make it more concise")}
                                className="text-left px-2 py-1.5 text-sm hover:bg-muted rounded transition-colors flex items-center gap-2"
                            >
                                <span className="text-lg">✂️</span> Make concise
                            </button>
                            <button
                                onClick={() => handleAskAI("Explain this concept")}
                                className="text-left px-2 py-1.5 text-sm hover:bg-muted rounded transition-colors flex items-center gap-2"
                            >
                                <span className="text-lg">🤔</span> Explain concept
                            </button>
                            <button
                                onClick={() => handleAskAI("Fix spelling errors")}
                                className="text-left px-2 py-1.5 text-sm hover:bg-muted rounded transition-colors flex items-center gap-2"
                            >
                                <span className="text-lg">📝</span> Fix spelling
                            </button>
                        </div>
                    )}
                </div>
            )}
        </BubbleMenu>
    );
}
