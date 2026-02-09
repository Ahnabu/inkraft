
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        // Only allow updating own settings
        if (session.user.id !== id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { isSavedPostsPublic } = body;

        await dbConnect();

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...(typeof isSavedPostsPublic === 'boolean' && { isSavedPostsPublic })
                }
            },
            { new: true, select: "isSavedPostsPublic" }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            settings: {
                isSavedPostsPublic: updatedUser.isSavedPostsPublic
            }
        });

    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json(
            { error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
