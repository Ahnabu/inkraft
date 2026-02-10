import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import InternalNote from "@/models/InternalNote";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        const notes = await InternalNote.find({ post: id })
            .populate("author", "name image")
            .sort({ createdAt: -1 });

        return NextResponse.json(notes);
    } catch (error) {
        console.error("Error fetching internal notes:", error);
        return NextResponse.json(
            { error: "Failed to fetch notes" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        if (!body.content) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        const note = await InternalNote.create({
            content: body.content,
            post: id,
            author: session.user.id,
            resolved: false,
        });

        const populatedNote = await InternalNote.findById(note._id).populate(
            "author",
            "name image"
        );

        return NextResponse.json(populatedNote);
    } catch (error) {
        console.error("Error creating internal note:", error);
        return NextResponse.json(
            { error: "Failed to create note" },
            { status: 500 }
        );
    }
}
