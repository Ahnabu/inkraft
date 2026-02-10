import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import PublicationMember from "@/models/PublicationMember";
import User from "@/models/User";

// GET: List members of a publication
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        await dbConnect();

        const members = await PublicationMember.find({ publication: id })
            .populate("user", "name image email bio")
            .sort({ role: 1, joinedAt: -1 }); // Owner first, then others

        return NextResponse.json({ members });
    } catch (error) {
        console.error("Error fetching members:", error);
        return NextResponse.json(
            { error: "Failed to fetch members" },
            { status: 500 }
        );
    }
}

// POST: Add/Invite a member
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Check permissions (Owner/Admin only)
        const requester = await PublicationMember.findOne({
            publication: id,
            user: session.user.id,
            status: "active",
            role: { $in: ["owner", "admin"] }
        });

        if (!requester) {
            return NextResponse.json(
                { error: "You do not have permission to invite members" },
                { status: 403 }
            );
        }

        const { email, role } = await req.json();

        // Find user by email
        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return NextResponse.json(
                { error: "User not found with that email" },
                { status: 404 }
            );
        }

        // Check if already a member
        const existingMember = await PublicationMember.findOne({
            publication: id,
            user: userToInvite._id
        });

        if (existingMember) {
            return NextResponse.json(
                { error: "User is already a member or invited" },
                { status: 409 }
            );
        }

        // Create membership
        const membership = await PublicationMember.create({
            publication: id,
            user: userToInvite._id,
            role: role || "writer",
            status: "active", // Auto-activate for now (simplified)
            invitedBy: session.user.id
        });

        return NextResponse.json({ membership }, { status: 201 });

    } catch (error) {
        console.error("Error inviting member:", error);
        return NextResponse.json(
            { error: "Failed to invite member" },
            { status: 500 }
        );
    }
}
