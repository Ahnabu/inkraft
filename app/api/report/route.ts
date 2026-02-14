import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Report from "@/models/Report";
import AdminAlert from "@/models/AdminAlert";
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { targetType, targetId, reason, details } = await req.json();

        if (!targetType || !targetId || !reason) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        // Validate target exists
        let target;
        let targetOwnerId;
        let alertTitle = "";
        let alertDescription = "";

        if (targetType === "Post") {
            target = await Post.findById(targetId).select("title author slug");
            if (!target) return NextResponse.json({ error: "Post not found" }, { status: 404 });
            targetOwnerId = target.author;
            alertTitle = `Report: Post "${target.title.substring(0, 30)}..."`;
            alertDescription = `User ${session.user.name} reported a post for ${reason}. Details: ${details || "None"}`;
        } else if (targetType === "Comment") {
            target = await Comment.findById(targetId).populate("author", "name").populate("post", "title slug");
            if (!target) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
            targetOwnerId = target.author?._id;
            alertTitle = `Report: Comment by ${target.author?.name || "Unknown"}`;
            alertDescription = `User ${session.user.name} reported a comment on "${target.post?.title.substring(0, 20)}..." for ${reason}. Details: ${details || "None"}`;
        } else {
            return NextResponse.json({ error: "Invalid target type" }, { status: 400 });
        }

        // Create Report
        const report = await Report.create({
            reporter: session.user.id,
            targetType,
            targetId,
            reason,
            details,
            status: "pending",
        });

        // Create Admin Alert
        // Check if there are already repeated reports for this target
        const recentReports = await Report.countDocuments({
            targetType,
            targetId,
            createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
        });

        const severity = recentReports > 5 ? "high" : recentReports > 2 ? "medium" : "low";

        await AdminAlert.create({
            type: "user_report",
            severity,
            title: alertTitle,
            description: alertDescription,
            targetUser: targetOwnerId,
            targetPost: targetType === "Post" ? targetId : target.post?._id, // If comment, link to post
            metadata: {
                reportId: report._id,
                reporterId: session.user.id,
                reason,
                details,
                targetType
            },
            resolved: false,
        });

        return NextResponse.json({ success: true, reportId: report._id });

    } catch (error) {
        console.error("Error creating report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
