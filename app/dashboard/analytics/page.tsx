import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AuthorAnalyticsDashboard } from "@/components/AuthorAnalyticsDashboard";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";

export default async function AnalyticsPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/signin");
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-primary mb-1">
                            <BarChart3 size={20} />
                            <span className="text-sm font-medium">Analytics Dashboard</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Content Performance</h1>
                    </div>
                </div>

                {/* Analytics Dashboard */}
                <AuthorAnalyticsDashboard />
            </div>
        </div>
    );
}
