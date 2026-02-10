import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Publication from "@/models/Publication";
import PublicationMember from "@/models/PublicationMember";

// GET: Get publication details
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        await dbConnect();

        // Can search by ID or Slug
        const isId = id.match(/^[0-9a-fA-F]{24}$/);
        const query = isId ? { _id: id } : { slug: id };

        const publication = await Publication.findOne(query)
            .populate("owner", "name image")
            .lean();

        if (!publication) {
            return NextResponse.json(
                { error: "Publication not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ publication });
    } catch (error) {
        console.error("Error fetching publication:", error);
        return NextResponse.json(
            { error: "Failed to fetch publication" },
            { status: 500 }
        );
    }
}

// PUT: Update publication details
export async function PUT(
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

        // Verify user is an admin or owner of the publication
        const member = await PublicationMember.findOne({
            publication: id,
            user: session.user.id,
            status: "active",
            role: { $in: ["owner", "admin"] }
        });

        if (!member) {
            return NextResponse.json(
                { error: "You do not have permission to update this publication" },
                { status: 403 }
            );
        }

        const updates = await req.json();

        // Prevent updating critical fields directly if needed protection
        delete updates.owner;
        delete updates.stats;
        delete updates.followers;

        const publication = await Publication.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ publication });
    } catch (error) {
        console.error("Error updating publication:", error);
        return NextResponse.json(
            { error: "Failed to update publication" },
            { status: 500 }
        );
    }
}
