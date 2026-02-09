import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { nullifyVotes } from "@/lib/alertTriggers";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const params = await context.params;
        const { reason } = await req.json(); // Pass reason in body if possible, or query param

        await dbConnect();

        const count = await nullifyVotes(params.id, session.user.id, reason || "Admin manual action");

        return NextResponse.json({ success: true, nullifiedCount: count });
    } catch (error) {
        console.error("Error nullifying votes:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
