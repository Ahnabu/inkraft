import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Feedback from "@/lib/models/Feedback";
import Post from "@/models/Post";

export async function POST(req: Request) {
    try {
        const session = await auth();
        await dbConnect();

        const body = await req.json();
        const { postId, type } = body;

        if (!postId || !type) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const userId = session?.user?.id;
        // Simple session ID handling for anonymous users could be done via cookies,
        // but for this implementation we'll require login or just track by userId if available.
        // If not logged in, we'll just skip saving for now to prevent spam, or we could generate a temp ID.
        // Let's require login for quality for now, or use a client-generated ID if we really want anaon.
        // The implementation plan implies "Quality signal", so requiring auth is safer.

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Upsert feedback
        const feedback = await Feedback.findOneAndUpdate(
            { postId, userId },
            { type },
            { upsert: true, new: true }
        );

        return NextResponse.json(feedback);

    } catch (error) {
        console.error("[FEEDBACK_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return new NextResponse("Missing postId", { status: 400 });
        }

        await dbConnect();

        // Aggregate counts
        const stats = await Feedback.aggregate([
            { $match: { postId: new mongoose.Types.ObjectId(postId) } },
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]);

        const result = {
            helpful: 0,
            clear: 0,
            "needs-more": 0
        };

        stats.forEach((stat: { _id: "helpful" | "clear" | "needs-more", count: number }) => {
            result[stat._id] = stat.count;
        });

        // Check if current user has given feedback
        const session = await auth();
        let userFeedback = null;
        if (session?.user?.id) {
            const fb = await Feedback.findOne({ postId, userId: session.user.id });
            if (fb) userFeedback = fb.type;
        }

        return NextResponse.json({ stats: result, userFeedback });

    } catch (error) {
        console.error("[FEEDBACK_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

import mongoose from "mongoose";
