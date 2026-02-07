import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();

        // @ts-expect-error - role property not in default session type
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { id } = await params;
        const body = await request.json();

        // Prevent admin from demoting themselves
        if (id === session.user.id && body.role && body.role !== "admin") {
            return NextResponse.json(
                { error: "Cannot change your own admin role" },
                { status: 400 }
            );
        }

        // Prevent admin from banning themselves
        if (id === session.user.id && body.banned === true) {
            return NextResponse.json(
                { error: "Cannot ban yourself" },
                { status: 400 }
            );
        }

        const allowedUpdates = ["role", "banned", "trustScore"];
        const updates: Record<string, unknown> = {};

        for (const key of allowedUpdates) {
            if (body[key] !== undefined) {
                updates[key] = body[key];
            }
        }

        const user = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();

        // @ts-expect-error - role property not in default session type
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { id } = await params;

        // Prevent admin from deleting themselves
        if (id === session.user.id) {
            return NextResponse.json(
                { error: "Cannot delete yourself" },
                { status: 400 }
            );
        }

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Delete user's posts and comments
        await Promise.all([
            Post.deleteMany({ author: id }),
            Comment.deleteMany({ author: id }),
            User.findByIdAndDelete(id),
        ]);

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
