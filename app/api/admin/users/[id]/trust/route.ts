import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { freezeUserTrust } from "@/lib/alertTriggers";

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const params = await context.params;
        const { action, reason } = await req.json();

        await dbConnect();

        if (action === "freeze") {
            await freezeUserTrust(params.id, session.user.id, reason || "Admin manual action");
            return NextResponse.json({ success: true, message: "Trust frozen" });
        } else if (action === "unfreeze") {
            await User.findByIdAndUpdate(params.id, {
                trustFrozen: false,
                $unset: { trustFrozenAt: 1, trustFrozenBy: 1, trustFrozenReason: 1 }
            });
            return NextResponse.json({ success: true, message: "Trust unfrozen" });
        }

        return new NextResponse("Invalid action", { status: 400 });
    } catch (error) {
        console.error("Error managing trust:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
