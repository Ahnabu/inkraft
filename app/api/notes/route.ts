import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return new NextResponse("Missing postId", { status: 400 });
        }

        await dbConnect();

        const query: any = { userId: session.user.id };
        if (postId) {
            query.postId = postId;
        }

        const notes = await Note.find(query)
            .populate("postId", "title slug") // Populate post info for dashboard
            .sort({ createdAt: -1 });

        return NextResponse.json(notes);
    } catch (error) {
        console.error("[NOTES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { postId, paragraphId, content } = body;

        if (!postId || !content) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        await dbConnect();

        const note = await Note.create({
            userId: session.user.id,
            postId,
            paragraphId,
            content,
        });

        return NextResponse.json(note);
    } catch (error) {
        console.error("[NOTES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const body = await req.json();
        const { content } = body;

        if (!id || !content) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        await dbConnect();

        const note = await Note.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { content },
            { new: true }
        );

        if (!note) {
            return new NextResponse("Note not found or unauthorized", { status: 404 });
        }

        return NextResponse.json(note);
    } catch (error) {
        console.error("[NOTES_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const noteId = searchParams.get("id");

        if (!noteId) {
            return new NextResponse("Missing noteId", { status: 400 });
        }

        await dbConnect();

        const note = await Note.findOneAndDelete({
            _id: noteId,
            userId: session.user.id,
        });

        if (!note) {
            return new NextResponse("Note not found or unauthorized", { status: 404 });
        }

        return new NextResponse("Note deleted", { status: 200 });
    } catch (error) {
        console.error("[NOTES_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
