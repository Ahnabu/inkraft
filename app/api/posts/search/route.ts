import { NextResponse } from "next/server";
import { searchPosts } from "@/lib/data/posts";
import { getLocale } from "next-intl/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const locale = await getLocale();

        const q = searchParams.get("q") || undefined;
        const category = searchParams.get("category") || undefined;
        const tag = searchParams.get("tag") || undefined;
        const sort = (searchParams.get("sort") as "latest" | "trending" | "top") || "latest";
        const editorsPick = searchParams.get("editorsPick") === "true";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");

        const result = await searchPosts({
            q,
            category,
            tag,
            sort,
            editorsPick,
            page,
            limit,
            locale
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
