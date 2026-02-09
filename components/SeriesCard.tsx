import Link from "next/link";
import { ISeries } from "@/models/Series";

interface SeriesCardProps {
    series: ISeries & {
        postCount?: number;
    };
}

export default function SeriesCard({ series }: SeriesCardProps) {
    return (
        <Link
            href={`/series/${series.slug}`}
            className="group block p-6 bg-card rounded-xl border border-border transition-all hover:shadow-md"
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Series
                    </span>
                    {series.postCount !== undefined && (
                        <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                            {series.postCount} Parts
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {series.title}
                </h3>

                <p className="text-muted-foreground line-clamp-2 text-sm">
                    {series.description}
                </p>

                <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1">
                    View Series →
                </div>
            </div>
        </Link>
    );
}
