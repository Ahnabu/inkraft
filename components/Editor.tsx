"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { BubbleMenu } from "@tiptap/react/menus";
import { FloatingMenu } from "@tiptap/react/menus";
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    ImageIcon,
    Link as LinkIcon,
    Table as TableIcon,
    Code2,
    AlertCircle,
    Info,
    AlertTriangle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { countWords, calculateReadingTime } from "@/lib/readingTime";
import { ImageUpload } from "@/components/ImageUpload";

interface EditorProps {
    content: string;
    onChange: (content: string) => void;
    onAutoSave?: () => void;
    placeholder?: string;
}

export function Editor({ content, onChange, onAutoSave, placeholder = "Start writing your story..." }: EditorProps) {
    const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
    const [showImageUpload, setShowImageUpload] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // We'll use CodeBlockLowlight instead
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto",
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline",
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Typography,
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: "border-collapse table-auto w-full",
                },
            }),
            TableRow,
            TableCell.configure({
                HTMLAttributes: {
                    class: "border border-border p-2",
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: "border border-border p-2 font-bold bg-muted",
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-6",
            },
        },
    });

    // Auto-save every 30 seconds
    useEffect(() => {
        if (onAutoSave && editor) {
            autoSaveInterval.current = setInterval(() => {
                onAutoSave();
            }, 30000); // 30 seconds

            return () => {
                if (autoSaveInterval.current) {
                    clearInterval(autoSaveInterval.current);
                }
            };
        }
    }, [onAutoSave, editor]);

    if (!editor) {
        return <div className="animate-pulse bg-muted rounded-lg h-96" />;
    }

    const wordCount = countWords(editor.getHTML());
    const readingTime = calculateReadingTime(editor.getHTML());

    const addImage = () => {
        setShowImageUpload(true);
    };

    const handleImageUpload = (url: string) => {
        editor.chain().focus().setImage({ src: url }).run();
        setShowImageUpload(false);
    };

    const addLink = () => {
        const url = window.prompt("Enter URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="sticky top-20 z-20 p-3 rounded-lg glass-card border border-border/40 flex flex-wrap items-center gap-2">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("bold") ? "bg-primary text-white" : ""}`}
                    title="Bold (Cmd+B)"
                >
                    <Bold size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("italic") ? "bg-primary text-white" : ""}`}
                    title="Italic (Cmd+I)"
                >
                    <Italic size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("strike") ? "bg-primary text-white" : ""}`}
                    title="Strikethrough"
                >
                    <Strikethrough size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("code") ? "bg-primary text-white" : ""}`}
                    title="Inline Code"
                >
                    <Code size={18} />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-primary text-white" : ""}`}
                    title="Heading 1"
                >
                    <Heading1 size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-primary text-white" : ""}`}
                    title="Heading 2"
                >
                    <Heading2 size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-primary text-white" : ""}`}
                    title="Heading 3"
                >
                    <Heading3 size={18} />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("bulletList") ? "bg-primary text-white" : ""}`}
                    title="Bullet List"
                >
                    <List size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("orderedList") ? "bg-primary text-white" : ""}`}
                    title="Numbered List"
                >
                    <ListOrdered size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("blockquote") ? "bg-primary text-white" : ""}`}
                    title="Quote"
                >
                    <Quote size={18} />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("codeBlock") ? "bg-primary text-white" : ""}`}
                    title="Code Block"
                >
                    <Code2 size={18} />
                </button>
                <button
                    onClick={addTable}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("table") ? "bg-primary text-white" : ""}`}
                    title="Insert Table"
                >
                    <TableIcon size={18} />
                </button>
                <button
                    onClick={addImage}
                    className="p-2 rounded hover:bg-muted transition-colors"
                    title="Insert Image"
                >
                    <ImageIcon size={18} />
                </button>
                <button
                    onClick={addLink}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive("link") ? "bg-primary text-white" : ""}`}
                    title="Add Link (Cmd+K)"
                >
                    <LinkIcon size={18} />
                </button>

                <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{wordCount} words</span>
                    <span>{readingTime} min read</span>
                </div>
            </div>

            {/* Bubble Menu - appears when text is selected */}
            <BubbleMenu editor={editor} className="flex gap-1 p-2 rounded-lg glass-card border border-border/40 shadow-lg">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded hover:bg-muted transition-colors ${editor.isActive("bold") ? "bg-primary text-white" : ""}`}
                >
                    <Bold size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded hover:bg-muted transition-colors ${editor.isActive("italic") ? "bg-primary text-white" : ""}`}
                >
                    <Italic size={16} />
                </button>
                <button
                    onClick={addLink}
                    className={`p-1.5 rounded hover:bg-muted transition-colors ${editor.isActive("link") ? "bg-primary text-white" : ""}`}
                >
                    <LinkIcon size={16} />
                </button>
            </BubbleMenu>

            {/* Floating Menu - appears on empty lines */}
            <FloatingMenu editor={editor} className="flex gap-1 p-2 rounded-lg glass-card border border-border/40 shadow-lg">
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className="p-1.5 rounded hover:bg-muted transition-colors text-sm"
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                >
                    <Code2 size={16} />
                </button>
                <button
                    onClick={addImage}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                >
                    <ImageIcon size={16} />
                </button>
            </FloatingMenu>

            {/* Editor Content */}
            <div className="prose-editor glass-card rounded-lg border border-border/40 min-h-[500px]">
                <EditorContent editor={editor} />
            </div>

            {/* Help Text */}
            <div className="text-xs text-muted-foreground space-y-1">
                <p>💡 <strong>Pro tips:</strong> Type <code>/</code> for quick commands, or use keyboard shortcuts:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <span><code>Cmd+B</code> Bold</span>
                    <span><code>Cmd+I</code> Italic</span>
                    <span><code>Cmd+K</code> Link</span>
                    <span><code>Cmd+Shift+8</code> Bullet list</span>
                </div>
            </div>

            {/* Image Upload Modal */}
            {showImageUpload && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-lg max-w-md w-full">
                        <div className="p-4 border-b border-border">
                            <h3 className="font-bold text-lg">Upload Image</h3>
                        </div>
                        <ImageUpload
                            onUpload={handleImageUpload}
                            onCancel={() => setShowImageUpload(false)}
                        />
                    </div>
                </div>
            )}
        </div >
    );
}
