import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const start = Date.now();
        await dbConnect();
        const duration = Date.now() - start;

        const state = mongoose.connection.readyState;
        const states = {
            0: "disconnected",
            1: "connected",
            2: "connecting",
            3: "disconnecting",
        };

        return NextResponse.json({
            status: "ok",
            database: states[state as keyof typeof states] || "unknown",
            latency: `${duration}ms`,
            env: {
                // Do not expose values, just existence
                MONGODB_URI: !!process.env.MONGODB_URI,
                AUTH_SECRET: !!process.env.AUTH_SECRET,
                NEXTAUTH_URL: process.env.NEXTAUTH_URL,
                VERCEL_URL: process.env.VERCEL_URL,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                status: "error",
                message: error.message,
                stack: error.stack,
            },
            { status: 500 }
        );
    }
}
