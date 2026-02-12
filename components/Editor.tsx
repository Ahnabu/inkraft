"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { BubbleMenu } from "@tiptap/react/menus";
import { FloatingMenu } from "@tiptap/react/menus";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

const lowlight = createLowlight(common);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
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
    Undo,
    Redo,
    GripHorizontal,
    Upload,
    Maximize,
    Minimize,
    Settings,
} from "lucide-react";
import { SEOPanel } from "@/components/editor/SEOPanel";
import { SocialPreview } from "@/components/editor/SocialPreview";
import { AIBubbleMenu } from "@/components/editor/AIBubbleMenu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef, useState } from "react";
import { countWords, calculateReadingTime } from "@/lib/readingTime";
import { ImageUpload } from "@/components/ImageUpload";
import { ImportModal } from "@/components/ImportModal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SeoData {
    title?: string;
    description?: string;
    keywords?: string[];
    canonical?: string;
    ogImage?: string;
}

interface EditorProps {
    content: string;
    onChange: (content: string) => void;
    onAutoSave?: () => void;
    placeholder?: string;
    initialSeo?: SeoData;
    onSeoChange?: (seo: SeoData) => void;
}

export function Editor({
    content,
    onChange,
    onAutoSave,
    placeholder = "Start writing your story...",
    initialSeo,
    onSeoChange
}: EditorProps) {
    const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [isCalmMode, setIsCalmMode] = useState(false);

    // SEO State
    const [seoData, setSeoData] = useState<SeoData>({
        title: initialSeo?.title || "",
        description: initialSeo?.description || "",
        keywords: initialSeo?.keywords || [],
        canonical: initialSeo?.canonical || "",
        ogImage: initialSeo?.ogImage || "",
    });

    // Notify parent of SEO changes
    useEffect(() => {
        if (onSeoChange) {
            onSeoChange(seoData);
        }
    }, [seoData, onSeoChange]);

    // Toggle body class for Calm Mode to hide other elements if needed, 
    // though purely CSS on the editor container should suffice for covering them.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isCalmMode) {
                setIsCalmMode(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isCalmMode]);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // We use CodeBlockLowlight instead
            }),
            CodeBlockLowlight.configure({
                lowlight,
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
            TextStyle,
            FontFamily,
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
            // Preserve formatting when pasting from external sources like Google Docs
            transformPastedHTML(html) {
                // Ensure list structures are preserved
                // Convert common list patterns to proper HTML lists
                let processedHtml = html;

                // Preserve existing ul/ol tags
                if (html.includes('<ul') || html.includes('<ol')) {
                    return html;
                }

                // Convert bullet points (•, -, *) to proper lists
                const lines = html.split(/\n|<br\s*\/?>/);
                const listItems: string[] = [];
                let inList = false;

                lines.forEach(line => {
                    const trimmed = line.trim();
                    // Check for bullet point patterns
                    if (trimmed.match(/^[•\-\*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
                        const content = trimmed.replace(/^[•\-\*]\s+/, '').replace(/^\d+\.\s+/, '');
                        listItems.push(`<li>${content}</li>`);
                        inList = true;
                    } else if (inList && trimmed) {
                        // End of list
                        processedHtml = processedHtml.replace(
                            listItems.join(''),
                            `<ul>${listItems.join('')}</ul>`
                        );
                        listItems.length = 0;
                        inList = false;
                    }
                });

                // Handle remaining list items
                if (listItems.length > 0) {
                    processedHtml = `<ul>${listItems.join('')}</ul>`;
                }

                return processedHtml || html;
            },
            transformPastedText(text) {
                // Convert plain text bullet points to HTML lists
                const lines = text.split('\n');
                const listItems: string[] = [];

                lines.forEach(line => {
                    const trimmed = line.trim();
                    if (trimmed.match(/^[•\-\*]\s+/)) {
                        const content = trimmed.replace(/^[•\-\*]\s+/, '');
                        listItems.push(`<li>${content}</li>`);
                    } else if (trimmed.match(/^\d+\.\s+/)) {
                        const content = trimmed.replace(/^\d+\.\s+/, '');
                        listItems.push(`<li>${content}</li>`);
                    }
                });

                if (listItems.length > 0) {
                    return `<ul>${listItems.join('')}</ul>`;
                }

                return text;
            },
        },
        immediatelyRender: false,
    });

    // Auto-save every 30 seconds
    useEffect(() => {
        if (onAutoSave && editor) {
            autoSaveInterval.current = setInterval(() => {
                onAutoSave();
            }, 5000); // 5 seconds

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

    const handleImport = (content: string, title?: string) => {
        if (title) {
            // We can't easily set the title from here as it's likely managed by the parent
            // But we can insert it as an H1 if needed, or better, let the parent handle it
            // For now, we'll just set the content
            console.log("Imported title:", title); // Placeholder for future parent communication
        }
        editor?.commands.setContent(content);
        setShowImportModal(false);
    };

    return (
        <div className={cn(
            "space-y-4 transition-all duration-300 ease-in-out",
            isCalmMode && "fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm p-4 md:p-8 lg:p-12 overflow-y-auto h-screen w-screen"
        )}>
            {/* Toolbar - Draggable & Theme Aware */}
            <motion.div
                className={cn(
                    "sticky top-20 z-20 p-2 rounded-xl glass-card border border-border/50 shadow-lg flex flex-wrap items-center gap-1 backdrop-blur-md bg-white/80 dark:bg-black/80",
                    isCalmMode && "max-w-4xl mx-auto top-4"
                )}
                drag
                dragMomentum={false}
                whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Drag Handle */}
                <div className="mr-1 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-foreground transition-colors p-1">
                    <GripHorizontal size={20} />
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
                        title="Undo (Cmd+Z)"
                    >
                        <Undo size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
                        title="Redo (Cmd+Shift+Z)"
                    >
                        <Redo size={18} />
                    </button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("bold") ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Bold (Cmd+B)"
                >
                    <Bold size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("italic") ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Italic (Cmd+I)"
                >
                    <Italic size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("strike") ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Strikethrough"
                >
                    <Strikethrough size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("code") ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Inline Code"
                >
                    <Code size={18} />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Heading 1"
                >
                    <Heading1 size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Heading 2"
                >
                    <Heading2 size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Heading 3"
                >
                    <Heading3 size={18} />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("bulletList") ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Bullet List"
                >
                    <List size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("orderedList") ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Numbered List"
                >
                    <ListOrdered size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("blockquote") ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Quote"
                >
                    <Quote size={18} />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("codeBlock") ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Code Block"
                >
                    <Code2 size={18} />
                </button>
                <button
                    onClick={addTable}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("table") ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Insert Table"
                >
                    <TableIcon size={18} />
                </button>
                <button
                    onClick={addImage}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Insert Image"
                >
                    <ImageIcon size={18} />
                </button>
                <button
                    onClick={addLink}
                    className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("link") ? "bg-primary text-white shadow-sm" : ""}`}
                    title="Add Link (Cmd+K)"
                >
                    <LinkIcon size={18} />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    onClick={() => setIsCalmMode(!isCalmMode)}
                    className={cn(
                        "p-2 rounded-lg hover:bg-muted transition-colors",
                        isCalmMode && "bg-primary text-white shadow-sm"
                    )}
                    title={isCalmMode ? "Exit Calm Mode (Esc)" : "Enter Calm Mode"}
                >
                    {isCalmMode ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
                <div className="w-px h-6 bg-border mx-1" />
                <div className="w-px h-6 bg-border mx-1" />

                {/* SEO Settings */}
                <Sheet>
                    <SheetTrigger asChild>
                        <button
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="Post Settings (SEO & Social)"
                        >
                            <Settings size={18} />
                        </button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>Post Settings</SheetTitle>
                        </SheetHeader>
                        <Tabs defaultValue="seo" className="mt-6">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
                                <TabsTrigger value="social">Social Preview</TabsTrigger>
                            </TabsList>
                            <TabsContent value="seo" className="mt-4">
                                <SEOPanel
                                    initialData={seoData}
                                    onChange={setSeoData}
                                />
                            </TabsContent>
                            <TabsContent value="social" className="mt-4">
                                <SocialPreview
                                    data={{
                                        ...seoData,
                                        // authorName: "You", // TODO: Pass user info
                                    }}
                                />
                            </TabsContent>
                        </Tabs>
                    </SheetContent>
                </Sheet>

                <button
                    onClick={() => setShowImportModal(true)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Import Content (Markdown/HTML)"
                >
                    <Upload size={18} />
                </button>

                <div className="ml-auto flex items-center gap-4 text-xs font-medium text-muted-foreground px-2">
                    <span>{wordCount} words</span>
                    <span>{readingTime} min read</span>
                </div>
            </motion.div>

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

            {editor && <AIBubbleMenu editor={editor} />}
            {/* Editor Content */}
            <div className={cn(
                "prose-editor glass-card rounded-lg border border-border/40 min-h-[500px]",
                isCalmMode && "max-w-4xl mx-auto shadow-none border-none bg-transparent min-h-[calc(100vh-100px)]",
            )}>
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

            {/* Import Modal */}
            {showImportModal && (
                <ImportModal
                    onImport={handleImport}
                    onClose={() => setShowImportModal(false)}
                />
            )}
        </div >
    );
}
