"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Sparkles, Loader2, Wand2, Maximize2, Minimize2, Volume2 } from "lucide-react";
import { toast } from "sonner";

export function AIBubbleMenu({ editor }: { editor: Editor }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const handleAIAction = async (action: string) => {
        const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to
        );

        if (!selectedText) {
            toast.warning("Please select text to use AI features.");
            return;
        }

        setIsGenerating(true);
        setShowOptions(false);

        try {
            const response = await fetch("/api/ai/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: selectedText,
                    action,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to generate AI response");
            }

            const data = await response.json();
            const result = data.result;

            // Replace selected text with AI-generated text
            editor
                .chain()
                .focus()
                .deleteSelection()
                .insertContent(result)
                .run();

            toast.success("AI suggestion applied!");
        } catch (error: any) {
            console.error("AI generation error:", error);
            toast.error(error.message || "Failed to generate AI response. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <BubbleMenu
            editor={editor}
            pluginKey="aibubblemenu"
            shouldShow={({ editor }) => {
                const { from, to } = editor.state.selection;
                const text = editor.state.doc.textBetween(from, to);
                return text.length > 0 && !isGenerating;
            }}
        >
            <div className="flex items-center gap-1 p-1 rounded-lg bg-card border border-border shadow-lg">
                {!showOptions ? (
                    <button
                        onClick={() => setShowOptions(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all font-medium text-sm"
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                <span>Ask AI</span>
                            </>
                        )}
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => handleAIAction("improve")}
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
                            title="Improve Writing"
                        >
                            <Wand2 size={16} />
                            <span>Improve</span>
                        </button>
                        <button
                            onClick={() => handleAIAction("expand")}
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
                            title="Expand Content"
                        >
                            <Maximize2 size={16} />
                            <span>Expand</span>
                        </button>
                        <button
                            onClick={() => handleAIAction("shorten")}
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
                            title="Shorten Text"
                        >
                            <Minimize2 size={16} />
                            <span>Shorten</span>
                        </button>
                        <button
                            onClick={() => handleAIAction("tone")}
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
                            title="Change Tone"
                        >
                            <Volume2 size={16} />
                            <span>Tone</span>
                        </button>
                        <button
                            onClick={() => setShowOptions(false)}
                            className="px-2 py-2 rounded-md hover:bg-muted transition-colors text-sm text-muted-foreground"
                            title="Close"
                        >
                            ✕
                        </button>
                    </>
                )}
            </div>
        </BubbleMenu>
    );
}
