import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import clientPromise from "@/lib/mongodb-adapter";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const start = Date.now();

        // Test Mongoose
        await dbConnect();
        const mongooseState = mongoose.connection.readyState;

        // Test Native Client (Adapter)
        // This is crucial because auth() uses this connection
        const client = await clientPromise;
        const adminDb = client.db().admin();
        await adminDb.ping();
        const adapterStatus = "connected";

        const duration = Date.now() - start;

        const states = {
            0: "disconnected",
            1: "connected",
            2: "connecting",
            3: "disconnecting",
        };

        return NextResponse.json({
            status: "ok",
            mongoose: states[mongooseState as keyof typeof states] || "unknown",
            adapter: adapterStatus,
            latency: `${duration}ms`,
            env: {
                MONGODB_URI: !!process.env.MONGODB_URI,
                AUTH_SECRET: !!process.env.AUTH_SECRET,
                // Check if the value is non-empty (avoid logging the actual secret)
                AUTH_SECRET_SET: (process.env.AUTH_SECRET?.length || 0) > 0,
                NEXTAUTH_URL: process.env.NEXTAUTH_URL,
                VERCEL: !!process.env.VERCEL,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Health check failed";
        const stack = error instanceof Error ? error.stack : undefined;
        return NextResponse.json(
            {
                status: "error",
                message,
                stack,
            },
            { status: 500 }
        );
    }
}
