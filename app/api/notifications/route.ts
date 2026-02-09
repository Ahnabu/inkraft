import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { auth } from "@/auth";

// GET /api/notifications - Get user's notifications
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const url = new URL(request.url);
        const unreadOnly = url.searchParams.get("unread") === "true";
        const limit = parseInt(url.searchParams.get("limit") || "20");

        const query: Record<string, unknown> = { user: session.user.id };
        if (unreadOnly) {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("actor", "name image")
            .populate("post", "title slug")
            .lean();

        const unreadCount = await Notification.countDocuments({
            user: session.user.id,
            read: false,
        });

        return NextResponse.json({
            notifications: notifications.map((n) => ({
                ...n,
                _id: n._id.toString(),
                user: n.user.toString(),
                actor: n.actor ? {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    _id: (n.actor as any)._id?.toString(),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    name: (n.actor as any).name,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    image: (n.actor as any).image,
                } : null,
                post: n.post ? {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    _id: (n.post as any)._id?.toString(),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    title: (n.post as any).title,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    slug: (n.post as any).slug,
                } : null,
                createdAt: n.createdAt.toISOString(),
            })),
            unreadCount,
        });
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const { notificationIds, markAllRead } = body;

        if (markAllRead) {
            await Notification.updateMany(
                { user: session.user.id, read: false },
                { $set: { read: true } }
            );
        } else if (notificationIds && Array.isArray(notificationIds)) {
            await Notification.updateMany(
                { _id: { $in: notificationIds }, user: session.user.id },
                { $set: { read: true } }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update notifications:", error);
        return NextResponse.json(
            { error: "Failed to update notifications" },
            { status: 500 }
        );
    }
}
