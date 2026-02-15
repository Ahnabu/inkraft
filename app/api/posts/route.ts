import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { calculateReadingTime } from "@/lib/readingTime";
import { submitToIndexNow } from "@/lib/indexnow";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        // Check for bot activity
        const verification = await checkBotId();

        if (verification.isBot) {
            return new NextResponse("Bot detected. Access denied.", { status: 403 });
        }

        const session = await auth();

        // For demo purposes, if no session, we might allow it or mock it.
        // Ideally: if (!session) return new NextResponse("Unauthorized", { status: 401 });

        // Mock user ID if no session (development only shortcut)
        const authorId = session?.user?.id || "65c3f9b0e1b2c3d4e5f6a7b8"; // Random ObjectID

        await dbConnect();

        const body = await req.json();
        const {
            title,
            subtitle,
            content,
            excerpt,
            slug,
            coverImage,
            category,
            tags,
            difficultyLevel,
            readingTime,
            published,
            seo,
            publication
        } = body;

        if (!title || !content || !slug || !category) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Check slug uniqueness
        const existingPost = await Post.findOne({ slug });
        if (existingPost) {
            return new NextResponse("Slug already exists", { status: 409 });
        }

        // Calculate reading time server-side
        const calculatedReadingTime = calculateReadingTime(content);

        // Create post
        const post = await Post.create({
            title,
            subtitle,
            slug,
            content,
            excerpt,
            coverImage,
            category,
            tags: tags || [],
            difficultyLevel,
            readingTime: calculatedReadingTime,
            published,
            author: authorId as string,
            publishedAt: published ? new Date() : undefined,
            lastUpdatedAt: new Date(),
            seo: seo || {},
            publication: body.publication,
            locale: body.locale || 'en',
            translationId: body.translationId || crypto.randomUUID(),
        });

        // Submit to IndexNow if published
        if (published) {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://inkraftblog.vercel.app';
                const postUrl = `${baseUrl}/blog/${slug}`;
                // Fire and forget - or await if you want to be sure
                await submitToIndexNow([postUrl]);
            } catch (e) {
                console.error("IndexNow submission error:", e);
            }
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("[POST_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
