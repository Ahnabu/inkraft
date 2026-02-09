
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findById(session.user.id)
            .populate({
                path: "savedPosts",
                select: "title slug excerpt coverImage readingTime author category",
                populate: {
                    path: "author",
                    select: "name"
                }
            })
            .lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ posts: user.savedPosts });

    } catch (error) {
        console.error("Error fetching saved posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch saved posts" },
            { status: 500 }
        );
    }
}
