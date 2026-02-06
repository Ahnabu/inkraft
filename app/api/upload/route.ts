import { NextResponse } from "next/server";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
    try {
        // Check authentication - temporarily disabled for testing
        // const session = await auth();
        // if (!session) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        console.log("[IMAGE_UPLOAD] Starting upload process...");

        const formData = await req.formData();
        const file = formData.get("file") as File;

        console.log("[IMAGE_UPLOAD] File received:", file?.name, file?.type, file?.size);

        if (!file) {
            console.error("[IMAGE_UPLOAD] No file in request");
            return new NextResponse("Missing file", { status: 400 });
        }

        // Validate file type (Images only)
        if (!file.type.startsWith("image/")) {
            console.error("[IMAGE_UPLOAD] Invalid file type:", file.type);
            return new NextResponse("Invalid file type. Only images are allowed.", { status: 400 });
        }

        // Validate file type (Images only)
        if (!file.type.startsWith("image/")) {
            console.error("[IMAGE_UPLOAD] Invalid file type:", file.type);
            return new NextResponse("Invalid file type. Only images are allowed.", { status: 400 });
        }

        // Check Cloudinary config
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            console.error("[IMAGE_UPLOAD] Missing Cloudinary credentials");
            return NextResponse.json(
                { error: "Cloudinary not configured. Please add credentials to .env.local" },
                { status: 500 }
            );
        }

        // Convert file to base64
        console.log("[IMAGE_UPLOAD] Converting file to base64...");
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;
        console.log("[IMAGE_UPLOAD] File converted, size:", base64.length);

        // Upload to Cloudinary
        console.log("[IMAGE_UPLOAD] Uploading to Cloudinary...");
        const uploadResponse = await cloudinary.uploader.upload(dataUri, {
            folder: "inkraft-posts",
            transformation: [
                { quality: "auto", fetch_format: "auto" },
                { width: 1200, crop: "limit" },
            ],
        });
        console.log("[IMAGE_UPLOAD] Upload successful:", uploadResponse.secure_url);

        return NextResponse.json({
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            width: uploadResponse.width,
            height: uploadResponse.height,
        });
    } catch (error: any) {
        console.error("[IMAGE_UPLOAD] Error:", error);
        console.error("[IMAGE_UPLOAD] Error stack:", error.stack);
        return NextResponse.json(
            { error: error.message || "Upload failed" },
            { status: 500 }
        );
    }
}
