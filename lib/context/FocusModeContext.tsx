"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface FocusModeContextType {
    isFocusMode: boolean;
    toggleFocusMode: () => void;
    fontSize: "small" | "medium" | "large" | "xlarge";
    setFontSize: (size: "small" | "medium" | "large" | "xlarge") => void;
    lineHeight: "compact" | "normal" | "relaxed";
    setLineHeight: (height: "compact" | "normal" | "relaxed") => void;
    theme: "light" | "dark" | "sepia";
    setTheme: (theme: "light" | "dark" | "sepia") => void;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [fontSize, setFontSizeState] = useState<"small" | "medium" | "large" | "xlarge">("medium");
    const [lineHeight, setLineHeightState] = useState<"compact" | "normal" | "relaxed">("normal");
    const [theme, setThemeState] = useState<"light" | "dark" | "sepia">("light");

    // Load from localStorage on mount
    useEffect(() => {
        const storedFocus = localStorage.getItem("inkraft_focus_mode");
        const storedFontSize = localStorage.getItem("inkraft_focus_fontSize");
        const storedLineHeight = localStorage.getItem("inkraft_focus_lineHeight");
        const storedTheme = localStorage.getItem("inkraft_focus_theme");

        if (storedFocus) setIsFocusMode(storedFocus === "true");
        if (storedFontSize) setFontSizeState(storedFontSize as any);
        if (storedLineHeight) setLineHeightState(storedLineHeight as any);
        if (storedTheme) setThemeState(storedTheme as any);
    }, []);

    // Apply focus mode  styles
    useEffect(() => {
        if (isFocusMode) {
            document.body.classList.add("focus-mode");
            document.body.setAttribute("data-focus-font", fontSize);
            document.body.setAttribute("data-focus-line-height", lineHeight);
            document.body.setAttribute("data-focus-theme", theme);
        } else {
            document.body.classList.remove("focus-mode");
            document.body.removeAttribute("data-focus-font");
            document.body.removeAttribute("data-focus-line-height");
            document.body.removeAttribute("data-focus-theme");
        }
    }, [isFocusMode, fontSize, lineHeight, theme]);

    const toggleFocusMode = () => {
        setIsFocusMode((prev) => {
            const newValue = !prev;
            localStorage.setItem("inkraft_focus_mode", String(newValue));
            return newValue;
        });
    };

    const setFontSize = (size: "small" | "medium" | "large" | "xlarge") => {
        setFontSizeState(size);
        localStorage.setItem("inkraft_focus_fontSize", size);
    };

    const setLineHeight = (height: "compact" | "normal" | "relaxed") => {
        setLineHeightState(height);
        localStorage.setItem("inkraft_focus_lineHeight", height);
    };

    const setTheme = (themeValue: "light" | "dark" | "sepia") => {
        setThemeState(themeValue);
        localStorage.setItem("inkraft_focus_theme", themeValue);
    };

    return (
        <FocusModeContext.Provider value={{
            isFocusMode,
            toggleFocusMode,
            fontSize,
            setFontSize,
            lineHeight,
            setLineHeight,
            theme,
            setTheme
        }}>
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
