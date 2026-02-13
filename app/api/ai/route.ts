import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const maxDuration = 30; // Timeout for AI responses

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { prompt, type, postId, context } = await req.json();

        if (!prompt || !type || !postId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        await dbConnect();
        const user = await User.findById(session.user.id);

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Quota Logic
        const usedPostCount = user.aiUsedPostIds.length;
        const hasUsedOnCurrentPost = user.aiUsedPostIds.includes(postId);

        // If allowance is exceeded and this is a NEW post for AI usage
        if (usedPostCount >= user.aiAllowance && !hasUsedOnCurrentPost) {
            return NextResponse.json({
                error: "Quota exceeded",
                message: `You have used your AI allowance of ${user.aiAllowance} posts. Contact support to increase your limit.`
            }, { status: 403 });
        }

        // --- Mock AI Logic for MVP (Replace with OpenAI call later) ---
        // We simulate a delay and return improved text based on the operation type

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency

        let result = "";

        if (type === "improve_writing") {
            result = `[Improved] ${prompt}`;
        } else if (type === "fix_grammar") {
            result = `[Grammar Fixed] ${prompt}`;
        } else if (type === "make_concise") {
            result = `[Concise] ${prompt}`;
        } else if (type === "complete_sentence") {
            result = `${prompt} ...and continues to explore the implications of this fascinating topic, weaving together threads of innovation and tradition.`;
        } else {
            result = `[AI] ${prompt}`;
        }

        // --- Update Quota ---
        if (!hasUsedOnCurrentPost) {
            user.aiUsedPostIds.push(postId);
            await user.save();
        }

        return NextResponse.json({ result, remainingQuota: user.aiAllowance - user.aiUsedPostIds.length });

    } catch (error) {
        console.error("[AI_API_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
