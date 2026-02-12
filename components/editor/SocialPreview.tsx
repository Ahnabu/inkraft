"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Twitter, Linkedin } from "lucide-react";
import Image from "next/image";

interface SocialPreviewProps {
    data: {
        title?: string;
        description?: string;
        coverImage?: string;
        ogImage?: string;
        authorName?: string;
        authorImage?: string;
    };
}

export function SocialPreview({ data }: SocialPreviewProps) {
    const [platform, setPlatform] = useState<"twitter" | "linkedin">("twitter");

    const title = data.title || "Your Post Title";
    const description = data.description || "This is a preview of how your post description will appear on social media platforms.";
    const image = data.ogImage || data.coverImage || "/placeholder-social.jpg";
    const domain = "inkraftblog.vercel.app";

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border/50 pb-4">
                <button
                    onClick={() => setPlatform("twitter")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${platform === "twitter"
                        ? "bg-blue-500/10 text-blue-500"
                        : "text-muted-foreground hover:bg-muted"
                        }`}
                >
                    <Twitter size={14} />
                    Twitter
                </button>
                <button
                    onClick={() => setPlatform("linkedin")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${platform === "linkedin"
                        ? "bg-blue-700/10 text-blue-700"
                        : "text-muted-foreground hover:bg-muted"
                        }`}
                >
                    <Linkedin size={14} />
                    LinkedIn
                </button>
            </div>

            <div className="bg-card/50 rounded-xl p-6 border border-border/50">
                {platform === "twitter" ? (
                    /* Twitter Card Preview */
                    <div className="max-w-[400px] mx-auto bg-black rounded-2xl border border-gray-800 overflow-hidden font-sans">
                        <div className="flex items-center gap-3 p-3">
                            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                {data.authorImage && <Image src={data.authorImage} alt="" width={40} height={40} />}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-white text-[15px]">{data.authorName || "Your Name"}</span>
                                <span className="text-gray-500 text-[15px]">@handle</span>
                            </div>
                        </div>
                        <div className="px-3 pb-3 text-white text-[15px]">
                            Check out my latest post on Inkraft! 🚀
                        </div>
                        {image && (
                            <div className="relative aspect-[1.91/1] w-full bg-gray-900 border-t border-b border-gray-800">
                                <Image
                                    src={image}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="bg-black p-3 hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="text-gray-500 text-[13px] uppercase truncate">{domain}</div>
                            <div className="text-white text-[15px] font-medium leading-5 mt-0.5 line-clamp-2">{title}</div>
                            <div className="text-gray-500 text-[15px] leading-5 mt-0.5 line-clamp-2">{description}</div>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-800 text-gray-500 text-[13px]">
                            <span>10:30 AM · Oct 24, 2025</span>
                        </div>
                    </div>
                ) : (
                    /* LinkedIn Card Preview */
                    <div className="max-w-[400px] mx-auto bg-white dark:bg-[#1b1f23] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden font-sans">
                        <div className="p-3 flex gap-3">
                            <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                {data.authorImage && <Image src={data.authorImage} alt="" width={48} height={48} />}
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">{data.authorName || "Your Name"}</div>
                                <div className="text-xs text-gray-500">Author at Inkraft</div>
                                <div className="text-xs text-gray-500">1h • 🌐</div>
                            </div>
                        </div>
                        <div className="px-3 pb-2 text-sm text-gray-900 dark:text-gray-100">
                            Check out my latest article! 👇
                        </div>
                        {image && (
                            <div className="relative aspect-[1.91/1] w-full bg-gray-100 dark:bg-gray-800">
                                <Image
                                    src={image}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="bg-gray-50 dark:bg-[#2b3036] p-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{title}</div>
                            <div className="text-xs text-gray-500 mt-0.5 truncate">{domain}</div>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-gray-500 text-sm font-medium">
                            <span>Like</span>
                            <span>Comment</span>
                            <span>Repost</span>
                            <span>Send</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
