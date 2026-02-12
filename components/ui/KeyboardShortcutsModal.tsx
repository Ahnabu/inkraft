"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFocusMode } from "@/lib/context/FocusModeContext";

interface ShortcutGroup {
    category: string;
    shortcuts: {
        keys: string[];
        description: string;
    }[];
}

const SHORTCUTS: ShortcutGroup[] = [
    {
        category: "Navigation",
        shortcuts: [
            { keys: ["g", "h"], description: "Go to Home" },
            { keys: ["g", "p"], description: "Go to Profile" },
            { keys: ["/"], description: "Search" },
            { keys: ["?"], description: "Show Keyboard Shortcuts" },
        ],
    },
    {
        category: "Editor",
        shortcuts: [
            { keys: ["mod", "s"], description: "Save Draft" },
            { keys: ["mod", "b"], description: "Bold" },
            { keys: ["mod", "i"], description: "Italic" },
            { keys: ["mod", "k"], description: "Insert Link" },
            { keys: ["mod", "shift", "8"], description: "Bullet List" },
        ],
    },
    {
        category: "Reading",
        shortcuts: [
            { keys: ["f"], description: "Toggle Focus Mode" },
            { keys: ["esc"], description: "Exit Focus Mode" },
        ],
    },
];

export function KeyboardShortcutsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const { toggleFocusMode } = useFocusMode();

    // Toggle modal with '?' (shift+/)
    useHotkeys("shift+/", () => setIsOpen((prev) => !prev));

    // Navigation
    useHotkeys("g+h", () => router.push("/"));
    useHotkeys("g+p", () => {
        if (session?.user?.id) {
            router.push(`/profile/${session.user.id}`);
        } else {
            router.push("/api/auth/signin");
        }
    });
    useHotkeys("/", (e) => {
        e.preventDefault(); // Prevent typing "/" if focusing an input
        router.push("/explore");
    });

    // Reading
    useHotkeys("f", () => toggleFocusMode());
    useHotkeys("esc", () => {
        if (isOpen) setIsOpen(false);
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Keyboard className="w-5 h-5" />
                        Keyboard Shortcuts
                    </DialogTitle>
                    <DialogDescription>
                        Boost your productivity with these shortcuts.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {SHORTCUTS.map((group) => (
                        <div key={group.category} className="space-y-3">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                                {group.category}
                            </h3>
                            <div className="space-y-2">
                                {group.shortcuts.map((shortcut) => (
                                    <div
                                        key={shortcut.description}
                                        className="flex items-center justify-between group"
                                    >
                                        <span className="text-sm">{shortcut.description}</span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key) => (
                                                <kbd
                                                    key={key}
                                                    className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded-md min-w-[20px] text-center capitalize"
                                                >
                                                    {key === "mod" ? "Cmd/Ctrl" : key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
