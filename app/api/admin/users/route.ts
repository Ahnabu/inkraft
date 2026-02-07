import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
    try {
        const session = await auth();

        // @ts-expect-error - role property not in default session type
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";
        const role = searchParams.get("role") || "";
        const banned = searchParams.get("banned") || "";

        const skip = (page - 1) * limit;

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        if (role) {
            query.role = role;
        }

        if (banned === "true") {
            query.banned = true;
        } else if (banned === "false") {
            query.banned = false;
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(query),
        ]);

        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
