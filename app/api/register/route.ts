import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { checkBotId } from "botid/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        // Check for bot activity
        const verification = await checkBotId();
        
        if (verification.isBot) {
            return NextResponse.json(
                { message: "Bot detected. Access denied." },
                { status: 403 }
            );
        }

        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json(
            { message: "User created successfully", user: { id: user._id, name: user.name, email: user.email } },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("Registration error:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { message },
            { status: 500 }
        );
    }
}
