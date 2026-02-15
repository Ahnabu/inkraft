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
            icon: <BookOpen className="w-12 h-12 text-primary" />,
            title: t("welcome.title"),
            description: t("welcome.description"),
            bgGradient: "from-primary/20 via-blue-500/10 to-transparent"
        },
        {
            id: "values",
            icon: <Zap className="w-12 h-12 text-violet-500" />,
            title: t("values.title"),
            description: t("values.description"),
            bgGradient: "from-violet-500/20 via-purple-500/10 to-transparent"
        },
        {
            id: "community",
            icon: <Shield className="w-12 h-12 text-blue-500" />,
            title: t("community.title"),
            description: t("community.description"),
            bgGradient: "from-blue-500/20 via-cyan-500/10 to-transparent"
        },
        {
            id: "getStarted",
            icon: <Sparkles className="w-10 h-10 text-primary" />,
            title: t("quickStart.title"),
            description: t("quickStart.subtitle"),
            isFinal: true,
            bgGradient: "from-primary/20 via-indigo-500/10 to-transparent"
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
            icon: <PenLine className="w-5 h-5 text-violet-500" />,
            href: "/new",
            bg: "bg-violet-500/10",
            border: "hover:border-violet-500/50",
            shadow: "hover:shadow-violet-500/10"
        },
        {
            id: "authors",
            icon: <Users className="w-5 h-5 text-blue-500" />,
            href: "/authors",
            bg: "bg-blue-500/10",
            border: "hover:border-blue-500/50",
            shadow: "hover:shadow-blue-500/10"
        },
        {
            id: "digest",
            icon: <Newspaper className="w-5 h-5 text-cyan-500" />,
            href: "/digest",
            bg: "bg-cyan-500/10",
            border: "hover:border-cyan-500/50",
            shadow: "hover:shadow-cyan-500/10"
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
                        className="relative w-full max-w-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden"
                    >
                        {/* Dynamic Background Gradient - Reduced Opacity & improved positioning */}
                        <motion.div
                            className={cn(
                                "absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5 dark:to-primary/10 transition-colors duration-700 pointer-events-none",
                            )}
                        />
                        <motion.div
                            className={cn(
                                "absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br opacity-20 dark:opacity-10 transition-colors duration-700 blur-3xl pointer-events-none",
                                steps[step].bgGradient
                            )}
                        />

                        {/* Close Button */}
                        <button
                            onClick={() => handleClose(true)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors z-20 group"
                        >
                            <X size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                        </button>

                        <div className="relative z-10 p-8 md:p-12 flex flex-col items-center text-center min-h-[550px]">

                            {/* Step Content Animation */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="flex-1 flex flex-col items-center justify-center w-full"
                                >
                                    {/* Icon - Reduced background as requested */}
                                    <div className="mb-8 p-3 rounded-2xl bg-primary/5 dark:bg-primary/10 ring-1 ring-inset ring-primary/10">
                                        {steps[step].icon}
                                    </div>

                                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-foreground dark:text-white">
                                        {steps[step].title}
                                    </h2>

                                    <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
                                        {steps[step].description}
                                    </p>

                                    {/* Render Quick Start Cards if Final Step */}
                                    {steps[step].isFinal && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl animate-in fade-in zoom-in duration-500 slide-in-from-bottom-8">
                                            {quickStartFeatures.map((feature) => (
                                                <button
                                                    key={feature.id}
                                                    onClick={() => handleCardClick(feature.href)}
                                                    className={cn(
                                                        "group relative flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 text-left hover:bg-white/10",
                                                        "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5",
                                                        feature.border,
                                                        feature.shadow
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300",
                                                        feature.bg
                                                    )}>
                                                        {feature.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                                                            {t(`quickStart.${feature.id}.title` as any)}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-1 group-hover:text-muted-foreground/80">
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
                            <div className="w-full mt-auto pt-8 space-y-6">
                                {/* Indicators */}
                                <div className="flex justify-center gap-2 mb-6">
                                    {steps.map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "h-1.5 rounded-full transition-all duration-500",
                                                i === step
                                                    ? "w-8 bg-primary shadow-glow"
                                                    : "w-1.5 bg-primary/20 hover:bg-primary/40"
                                            )}
                                        />
                                    ))}
                                </div>

                                {/* Buttons - Hide main button on final step as cards take over */}
                                {!steps[step].isFinal && (
                                    <Button
                                        onClick={nextStep}
                                        size="lg"
                                        className="w-full max-w-sm rounded-full text-lg h-14 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/30 font-semibold"
                                    >
                                        <span className="flex items-center gap-3">
                                            {t("next")} <ChevronRight size={20} strokeWidth={2.5} />
                                        </span>
                                    </Button>
                                )}

                                {steps[step].isFinal && (
                                    <button
                                        onClick={() => handleClose(true)}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-4 py-2"
                                    >
                                        {t("getStarted.dontShow")}
                                    </button>
                                )}


                                {!steps[step].isFinal && (
                                    <button
                                        onClick={() => handleClose(true)}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
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

