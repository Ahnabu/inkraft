import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import Feedback from "@/models/Feedback";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { postId, type } = body;

        if (!postId || !["helpful", "clear", "more_detail"].includes(type)) {
            return new NextResponse("Invalid request", { status: 400 });
        }

        // Generate IP hash for rate limiting / uniqueness
        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") || "unknown";
        const ipHash = crypto
            .createHash("sha256")
            .update(ip + (process.env.IP_SALT || "salt"))
            .digest("hex");

        // Check for existing feedback from this IP
        const existing = await Feedback.findOne({
            post: postId,
            type,
            ipHash
        });

        if (existing) {
            // If already exists, we could toggle it off if we wanted, 
            // but for simple feedback, let's just return success (idempotent) or 409.
            // Let's return success to not confuse the UI if they click again.
            return NextResponse.json({ success: true, message: "Feedback already received" });
        }

        await Feedback.create({
            post: postId,
            type,
            ipHash
        });

        return NextResponse.json({ success: true });

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

        // Check if current user (via IP) has given feedback
        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") || "unknown";
        const ipHash = crypto
            .createHash("sha256")
            .update(ip + (process.env.IP_SALT || "salt"))
            .digest("hex");

        const userFeedback = await Feedback.find({
            post: postId,
            ipHash
        }).select("type").lean();

        // Since we are anonymous, "stats" might be overkill to return to public API 
        // if we want to keep it "Silent". 
        // But maybe the user wants to see their own state.

        return NextResponse.json({
            userFeedback: userFeedback.map((f: any) => f.type)
        });

    } catch (error) {
        console.error("[FEEDBACK_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

