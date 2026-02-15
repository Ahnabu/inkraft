"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, BookOpen, Shield, Sparkles, Zap, Compass, PenLine, Users, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function OnboardingModal() {
    const t = useTranslations("Onboarding");
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // Check if user has seen onboarding
        const hasSeen = localStorage.getItem("inkraft_onboarding_seen");
        if (!hasSeen) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = (dontShowAgain: boolean) => {
        setIsOpen(false);
        if (dontShowAgain) {
            localStorage.setItem("inkraft_onboarding_seen", "true");
        }
    };

    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            handleClose(true);
        }
    };

    const handleCardClick = (href: string) => {
        handleClose(true);
        router.push(href);
    };

    const steps = [
        {
            id: "welcome",
            icon: <BookOpen className="w-16 h-16 text-primary mb-6" />,
            title: t("welcome.title"),
            description: t("welcome.description"),
            bgGradient: "from-primary/20 via-primary/5 to-transparent"
        },
        {
            id: "values",
            icon: <Zap className="w-16 h-16 text-amber-500 mb-6" />,
            title: t("values.title"),
            description: t("values.description"),
            bgGradient: "from-amber-500/20 via-amber-500/5 to-transparent"
        },
        {
            id: "community",
            icon: <Shield className="w-16 h-16 text-emerald-500 mb-6" />,
            title: t("community.title"),
            description: t("community.description"),
            bgGradient: "from-emerald-500/20 via-emerald-500/5 to-transparent"
        },
        {
            id: "getStarted",
            icon: <Sparkles className="w-12 h-12 text-purple-500 mb-4" />,
            title: t("quickStart.title"),
            description: t("quickStart.subtitle"),
            isFinal: true,
            bgGradient: "from-purple-500/20 via-purple-500/5 to-transparent"
        }
    ];

    const quickStartFeatures = [
        {
            id: "explore",
            icon: <Compass className="w-5 h-5 text-primary" />,
            href: "/explore",
            bg: "bg-primary/10",
            border: "hover:border-primary/50",
            shadow: "hover:shadow-primary/10"
        },
        {
            id: "write",
            icon: <PenLine className="w-5 h-5 text-blue-500" />,
            href: "/new",
            bg: "bg-blue-500/10",
            border: "hover:border-blue-500/50",
            shadow: "hover:shadow-blue-500/10"
        },
        {
            id: "authors",
            icon: <Users className="w-5 h-5 text-purple-500" />,
            href: "/authors",
            bg: "bg-purple-500/10",
            border: "hover:border-purple-500/50",
            shadow: "hover:shadow-purple-500/10"
        },
        {
            id: "digest",
            icon: <Newspaper className="w-5 h-5 text-emerald-500" />,
            href: "/digest",
            bg: "bg-emerald-500/10",
            border: "hover:border-emerald-500/50",
            shadow: "hover:shadow-emerald-500/10"
        },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                        onClick={() => handleClose(false)}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-2xl bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden"
                    >
                        {/* Dynamic Background Gradient */}
                        <motion.div
                            className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-50 transition-colors duration-700",
                                steps[step].bgGradient
                            )}
                        />

                        {/* Close Button */}
                        <button
                            onClick={() => handleClose(true)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors z-20"
                        >
                            <X size={20} className="text-muted-foreground" />
                        </button>

                        <div className="relative z-10 p-8 md:p-10 flex flex-col items-center text-center min-h-[500px]">

                            {/* Step Content Animation */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-1 flex flex-col items-center justify-center w-full"
                                >
                                    {steps[step].icon}
                                    <h2 className="text-3xl font-bold mb-3 tracking-tight">
                                        {steps[step].title}
                                    </h2>
                                    <p className="text-lg text-muted-foreground max-w-md mb-8">
                                        {steps[step].description}
                                    </p>

                                    {/* Render Quick Start Cards if Final Step */}
                                    {steps[step].isFinal && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
                                            {quickStartFeatures.map((feature) => (
                                                <button
                                                    key={feature.id}
                                                    onClick={() => handleCardClick(feature.href)}
                                                    className={cn(
                                                        "group relative flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 transition-all duration-300 text-left",
                                                        "hover:-translate-y-1 hover:shadow-lg",
                                                        feature.border,
                                                        feature.shadow
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                        feature.bg
                                                    )}>
                                                        {feature.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-sm group-hover:text-foreground transition-colors">
                                                            {t(`quickStart.${feature.id}.title` as any)}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                                            {t(`quickStart.${feature.id}.description` as any)}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Controls */}
                            <div className="w-full mt-8 space-y-6">
                                {/* Indicators */}
                                <div className="flex justify-center gap-2 mb-6">
                                    {steps.map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "h-1.5 rounded-full transition-all duration-300",
                                                i === step
                                                    ? "w-8 bg-primary"
                                                    : "w-1.5 bg-primary/20"
                                            )}
                                        />
                                    ))}
                                </div>

                                {/* Buttons - Hide main button on final step as cards take over */}
                                {!steps[step].isFinal && (
                                    <Button
                                        onClick={nextStep}
                                        size="lg"
                                        className="w-full max-w-sm rounded-full text-lg h-12 shadow-lg transition-all hover:scale-[1.02]"
                                    >
                                        <span className="flex items-center gap-2">
                                            {t("next")} <ChevronRight size={18} />
                                        </span>
                                    </Button>
                                )}

                                {steps[step].isFinal && (
                                    <button
                                        onClick={() => handleClose(true)}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
                                    >
                                        {t("getStarted.dontShow")}
                                    </button>
                                )}


                                {!steps[step].isFinal && (
                                    <button
                                        onClick={() => handleClose(true)}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {t("skip")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

