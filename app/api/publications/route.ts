import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Publication from "@/models/Publication";
import PublicationMember from "@/models/PublicationMember";
import { slugify } from "@/lib/utils";

// GET: List publications the user is a member of
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Find memberships for this user
        const memberships = await PublicationMember.find({
            user: session.user.id,
            status: "active"
        }).populate("publication");

        // Extract publications from memberships
        const publications = memberships.map(m => m.publication);

        return NextResponse.json({ publications });
    } catch (error) {
        console.error("Error fetching publications:", error);
        return NextResponse.json(
            { error: "Failed to fetch publications" },
            { status: 500 }
        );
    }
}

// POST: Create a new publication
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description, slug: providedSlug } = await req.json();

        if (!name) {
            return NextResponse.json(
                { error: "Publication name is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Generate slug if not provided, or sanitize provided one
        let slug = providedSlug ? slugify(providedSlug) : slugify(name);

        // Check for slug uniqueness
        const existingPub = await Publication.findOne({ slug });
        if (existingPub) {
            return NextResponse.json(
                { error: "Publication URL is already taken" },
                { status: 409 }
            );
        }

        // Create the publication
        const publication = await Publication.create({
            name,
            slug,
            description,
            owner: session.user.id,
            branding: {
                primaryColor: "#000000", // Default black
            },
            stats: {
                totalPosts: 0,
                totalViews: 0,
                totalFollowers: 0
            }
        });

        // Add creator as the owner member
        await PublicationMember.create({
            publication: publication._id,
            user: session.user.id,
            role: "owner",
            status: "active",
            joinedAt: new Date(),
        });

        return NextResponse.json({ publication }, { status: 201 });
    } catch (error) {
        console.error("Error creating publication:", error);
        return NextResponse.json(
            { error: "Failed to create publication" },
            { status: 500 }
        );
    }
}
