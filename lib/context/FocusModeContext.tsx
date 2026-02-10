"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface FocusModeContextType {
    isFocusMode: boolean;
    toggleFocusMode: () => void;
    fontSize: number;
    setFocusFontSize: (size: number) => void;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [fontSize, setFontSize] = useState(18); // Default 18px

    useEffect(() => {
        const storedFocus = localStorage.getItem("inkraft_focus_mode");
        const storedSize = localStorage.getItem("inkraft_font_size");
        if (storedFocus) setIsFocusMode(storedFocus === "true");
        if (storedSize) setFontSize(parseInt(storedSize, 10));
    }, []);

    useEffect(() => {
        if (isFocusMode) {
            document.body.classList.add("focus-mode");
            document.documentElement.style.setProperty("--focus-font-size", `${fontSize}px`);
        } else {
            document.body.classList.remove("focus-mode");
            document.documentElement.style.removeProperty("--focus-font-size");
        }
    }, [isFocusMode, fontSize]);

    const toggleFocusMode = () => {
        setIsFocusMode((prev) => {
            const newValue = !prev;
            localStorage.setItem("inkraft_focus_mode", String(newValue));
            return newValue;
        });
    };

    const setFocusFontSize = (size: number) => {
        const newSize = Math.max(14, Math.min(32, size)); // Clamp between 14px and 32px
        setFontSize(newSize);
        localStorage.setItem("inkraft_font_size", String(newSize));
    };

    return (
        <FocusModeContext.Provider value={{ isFocusMode, toggleFocusMode, fontSize, setFocusFontSize }}>
            {children}
        </FocusModeContext.Provider>
    );
}

export function useFocusMode() {
    const context = useContext(FocusModeContext);
    if (context === undefined) {
        throw new Error("useFocusMode must be used within a FocusModeProvider");
    }
    return context;
}
