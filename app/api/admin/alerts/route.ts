import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import AdminAlert from "@/models/AdminAlert";
import User from "@/models/User";
import Post from "@/models/Post";
import { nullifyVotes, freezeUserTrust } from "@/lib/alertTriggers";

export const dynamic = 'force-dynamic';

// GET: Fetch alerts
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const resolved = searchParams.get("resolved");
        const type = searchParams.get("type");
        const limit = parseInt(searchParams.get("limit") || "50");

        await dbConnect();

        const query: Record<string, unknown> = {};
        if (resolved !== null) query.resolved = resolved === "true";
        if (type) query.type = type;

        const alerts = await AdminAlert.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("targetUser", "name email trustScore image")
            .populate("targetPost", "title slug")
            .populate("resolvedBy", "name");

        return NextResponse.json({ alerts });
    } catch (error) {
        console.error("Error fetching alerts:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PATCH: Resolve alert / take action
export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const { alertId, action, reason } = await req.json();

        if (!alertId || !action) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        await dbConnect();

        const alert = await AdminAlert.findById(alertId);
        if (!alert) {
            return new NextResponse("Alert not found", { status: 404 });
        }

        if (alert.resolved) {
            return new NextResponse("Alert already resolved", { status: 400 });
        }

        // Perform action
        if (action === "dismiss") {
            alert.action = "dismissed";
        } else if (action === "ban_user") {
            if (alert.targetUser) {
                await User.findByIdAndUpdate(alert.targetUser, { banned: true });
                alert.action = "user_banned";
            }
        } else if (action === "freeze_trust") {
            if (alert.targetUser) {
                await freezeUserTrust(alert.targetUser.toString(), session.user.id, reason || "Admin action from alert");
                alert.action = "trust_frozen";
            }
        } else if (action === "nullify_votes") {
            if (alert.targetPost) {
                await nullifyVotes(alert.targetPost.toString(), session.user.id, reason || "Admin action from alert");
                alert.action = "votes_nullified";
            }
        }

        // Mark resolved
        alert.resolved = true;
        alert.resolvedBy = session.user.id as any;
        alert.resolvedAt = new Date();
        await alert.save();

        return NextResponse.json({ success: true, alert });
    } catch (error) {
        console.error("Error updating alert:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
