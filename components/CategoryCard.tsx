import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
    name: string;
    slug: string;
    description: string;
    color: string;
    postCount?: number;
    className?: string;
}

export function CategoryCard({
    name,
    slug,
    description,
    color,
    postCount,
    className,
}: CategoryCardProps) {
    return (
        <Link href={`/category/${slug}`}>
            <div
                className={cn(
                    "group relative overflow-hidden rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-xl border border-border/40 hover:border-primary/50 bg-background",
                    className
                )}
            >
                {/* Color accent bar */}
                <div
                    className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2"
                    style={{ backgroundColor: color }}
                />

                <div className="pl-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                            {name}
                        </h3>
                        {postCount !== undefined && (
                            <span className="text-sm text-muted-foreground">
                                {postCount} {postCount === 1 ? "article" : "articles"}
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>
        </Link>
    );
}
