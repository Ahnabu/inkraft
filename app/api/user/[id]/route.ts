import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// GET: Fetch user profile
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        await dbConnect();

        const user = await User.findById(params.id).select("-password").lean();

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json({
            ...user,
            _id: user._id.toString(),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt ? user.updatedAt.toISOString() : user.createdAt.toISOString(),
        });
    } catch (error: any) {
        console.error("[GET_USER]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PATCH: Update user profile
export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const params = await context.params;

        // Check if user is updating their own profile
        if (session.user.id !== params.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const { name, bio, socialLinks } = await req.json();

        await dbConnect();

        const user = await User.findById(params.id);
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Update fields
        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (socialLinks) {
            user.socialLinks = {
                website: socialLinks.website || undefined,
                twitter: socialLinks.twitter || undefined,
                linkedin: socialLinks.linkedin || undefined,
            };
        }

        await user.save();

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                _id: user._id.toString(),
                name: user.name,
                bio: user.bio,
                socialLinks: user.socialLinks,
            },
        });
    } catch (error: any) {
        console.error("[PATCH_USER]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
