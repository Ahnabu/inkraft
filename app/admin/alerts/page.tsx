import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import AdminAlert from "@/models/AdminAlert";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from "@/models/User";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Post from "@/models/Post";
import Link from "next/link";
import { AlertTriangle, CheckCircle, Shield, Clock, User as UserIcon, FileText, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function getAlerts(showResolved: boolean) {
    await dbConnect();
    const query: Record<string, unknown> = {};
    if (!showResolved) {
        query.resolved = false;
    }

    const alerts = await AdminAlert.find(query)
        .sort({ severity: -1, createdAt: -1 })
        .limit(50)
        .populate("targetUser", "name email image")
        .populate("targetPost", "title slug")
        .populate("resolvedBy", "name")
        .lean();

    return alerts;
}

export default async function AdminAlertsPage({
    searchParams,
}: {
    searchParams: Promise<{ showResolved?: string }>;
}) {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
        redirect("/");
    }

    const params = await searchParams;
    const showResolved = params?.showResolved === "true";
    const alerts = await getAlerts(showResolved);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical": return "bg-red-500/10 text-red-500 border-red-500/20";
            case "high": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            default: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "vote_spike": return "📈";
            case "spam_velocity": return "🚨";
            case "low_trust_engagement": return "⚠️";
            case "repeated_reports": return "🚩";
            default: return "🔍";
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                        <AlertTriangle size={24} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Admin Alerts</h1>
                        <p className="text-muted-foreground text-sm">
                            {alerts.filter(a => !a.resolved).length} pending alerts
                        </p>
                    </div>
                </div>

                <Link
                    href={showResolved ? "/admin/alerts" : "/admin/alerts?showResolved=true"}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                >
                    {showResolved ? "Hide Resolved" : "Show Resolved"}
                </Link>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
                {alerts.length === 0 ? (
                    <div className="text-center py-16 bg-card rounded-xl border border-border">
                        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
                        <p className="text-muted-foreground">No pending alerts at this time.</p>
                    </div>
                ) : (
                    alerts.map((alert) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const targetUser = alert.targetUser as any;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const targetPost = alert.targetPost as any;

                        return (
                            <div
                                key={alert._id.toString()}
                                className={`p-5 rounded-xl border ${alert.resolved
                                        ? "bg-muted/30 border-border opacity-60"
                                        : "bg-card border-border"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Severity badge */}
                                    <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase border ${getSeverityColor(alert.severity)}`}>
                                        {alert.severity}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{getTypeIcon(alert.type)}</span>
                                            <h3 className="font-semibold">{alert.title}</h3>
                                            {alert.resolved && (
                                                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-xs font-medium">
                                                    Resolved
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-muted-foreground text-sm mb-3">
                                            {alert.description}
                                        </p>

                                        {/* Targets */}
                                        <div className="flex flex-wrap gap-3 text-sm">
                                            {targetUser && (
                                                <Link
                                                    href={`/profile/${targetUser._id}`}
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
                                                >
                                                    <UserIcon size={14} />
                                                    <span>{targetUser.name}</span>
                                                </Link>
                                            )}
                                            {targetPost && (
                                                <Link
                                                    href={`/blog/${targetPost.slug}`}
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
                                                >
                                                    <FileText size={14} />
                                                    <span className="max-w-[200px] truncate">{targetPost.title}</span>
                                                </Link>
                                            )}
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <Clock size={14} />
                                                {new Date(alert.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {!alert.resolved && (
                                        <Link
                                            href={`/admin/alerts/${alert._id}`}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            Review
                                            <ChevronRight size={14} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
