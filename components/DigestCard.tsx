import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface DigestCardProps {
    digest: {
        _id: string;
        title: string;
        slug: string;
        description?: string;
        publishedAt?: string;
        editorPicks?: Array<{
            title: string;
            coverImage?: string;
            slug: string;
        }>;
    };
}

export function DigestCard({ digest }: DigestCardProps) {
    return (
        <Link href={`/digest/${digest.slug}`} className="block group h-full">
            <GlassCard className="h-full hover:border-primary/50 transition-colors overflow-hidden flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={14} />
                            Weekly Digest
                        </span>
                        {digest.publishedAt && (
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(digest.publishedAt), "MMMM d, yyyy")}
                            </span>
                        )}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {digest.title}
                    </h3>

                    {digest.description && (
                        <p className="text-muted-foreground mb-6 line-clamp-3 flex-1">
                            {digest.description}
                        </p>
                    )}

                    {/* Editor Picks Preview */}
                    {digest.editorPicks && digest.editorPicks.length > 0 && (
                        <div className="mt-auto pt-6 border-t border-border">
                            <p className="text-xs font-medium text-muted-foreground mb-3">Highlights</p>
                            <div className="space-y-3">
                                {digest.editorPicks.slice(0, 3).map((pick, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        {pick.coverImage ? (
                                            <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 bg-muted">
                                                <Image
                                                    src={pick.coverImage}
                                                    alt={pick.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                                <span className="text-xs font-bold text-primary">#{i + 1}</span>
                                            </div>
                                        )}
                                        <span className="text-sm font-medium line-clamp-1">{pick.title}</span>
                                    </div>
                                ))}
                                {digest.editorPicks.length > 3 && (
                                    <p className="text-xs text-muted-foreground pl-13">
                                        + {digest.editorPicks.length - 3} more stories
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex items-center text-sm font-semibold text-primary">
                        Read Digest <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </GlassCard>
        </Link>
    );
}
