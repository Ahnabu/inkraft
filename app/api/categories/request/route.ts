
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import AdminAlert from "@/models/AdminAlert";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const { name, description } = await req.json();

        if (!name || !description) {
            return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
        }

        // Create an alert for admins
        await AdminAlert.create({
            type: "category_request",
            severity: "medium",
            title: `New Category Request: ${name}`,
            description: `User ${session.user.name} requested a new category: "${name}". \n\nProposed Description: ${description}`,
            targetUser: session.user.id,
            metadata: {
                requestedCategoryName: name,
                requestedCategoryDescription: description,
                requesterId: session.user.id,
                requesterName: session.user.name,
                requesterEmail: session.user.email
            },
            resolved: false,
        });

        return NextResponse.json({ success: true, message: "Category request submitted to admins." }, { status: 201 });
    } catch (error) {
        console.error("Failed to submit category request:", error);
        return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
    }
}
