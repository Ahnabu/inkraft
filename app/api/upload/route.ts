import { NextResponse } from "next/server";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
    try {
        // Check authentication
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { image } = body; // Base64 encoded image

        if (!image) {
            return new NextResponse("Missing image data", { status: 400 });
        }

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "inkraft-posts", // Organize uploads in a folder
            transformation: [
                { quality: "auto", fetch_format: "auto" }, // Automatic optimization
                { width: 1200, crop: "limit" }, // Max width for blog images
            ],
        });

        return NextResponse.json({
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            width: uploadResponse.width,
            height: uploadResponse.height,
        });
    } catch (error: any) {
        console.error("[IMAGE_UPLOAD]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
