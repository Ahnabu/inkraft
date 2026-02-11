import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if valid email format (backend validation backup)
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        try {
            await Subscriber.create({ email });
            return NextResponse.json(
                { message: "Successfully subscribed to the newsletter!" },
                { status: 201 }
            );
        } catch (error: any) {
            // Duplicate key error
            if (error.code === 11000) {
                return NextResponse.json(
                    { message: "You are already subscribed!" }, // Not an error status, just info
                    { status: 200 }
                );
            }
            throw error;
        }

    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
