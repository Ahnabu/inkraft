"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useDraftRestoration<T>(key: string, onRestore: (draft: T) => void) {
    const t = useTranslations("Draft");
    const hasChecked = useRef(false);

    useEffect(() => {
        if (hasChecked.current || !key) return;

        const saved = localStorage.getItem(key);
        if (!saved) return;

        try {
            const draft = JSON.parse(saved) as T;
            // Basic validation: Check if it has content or title
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((draft as any).content || (draft as any).title) {
                toast(t("found"), {
                    description: t("lastSaved", { date: new Date((draft as any).savedAt || Date.now()).toLocaleString() }),
                    action: {
                        label: t("restore"),
                        onClick: () => {
                            onRestore(draft);
                            toast.success(t("restored"));
                        },
                    },
                    duration: 10000, // Show for 10 seconds
                    closeButton: true,
                });
            }
        } catch (e) {
            console.error("Failed to parse draft", e);
        }

        hasChecked.current = true;
    }, [key, onRestore, t]);
}
