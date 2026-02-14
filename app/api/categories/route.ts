import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { NextResponse } from "next/server";
import { slugify } from "@/lib/utils"; // Assuming utils has slugify or I'll implement it

export async function GET() {
    await dbConnect();

    try {
        const dbCategories = await Category.find({}).sort({ order: 1, name: 1 }).lean();

        // Merge default and DB categories, prioritizing DB if slugs match (to allow overrides)
        // Actually, let's just combine them. 
        // Create a map by slug
        const categoryMap = new Map();

        DEFAULT_CATEGORIES.forEach(cat => {
            categoryMap.set(cat.slug, { ...cat, isDefault: true });
        });

        dbCategories.forEach((cat: any) => {
            categoryMap.set(cat.slug, { ...cat, isDefault: false, _id: cat._id.toString() });
        });

        const mergedCategories = Array.from(categoryMap.values()).sort((a, b) => a.order - b.order);

        return NextResponse.json(mergedCategories);
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const body = await req.json();
        const { name, description, color } = body;

        if (!name || !description) {
            return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
        }

        const slug = slugify(name);

        // Check if exists
        const existing = await Category.findOne({ slug });
        if (existing) {
            return NextResponse.json({ error: "Category already exists" }, { status: 409 });
        }

        // Check if it conflicts with default categories
        if (DEFAULT_CATEGORIES.some(c => c.slug === slug)) {
            return NextResponse.json({ error: "Category already exists in defaults" }, { status: 409 });
        }

        // Get highest order to append
        const lastCategory = await Category.findOne().sort({ order: -1 });
        const lastDefaultOrder = Math.max(...DEFAULT_CATEGORIES.map(c => c.order));
        const newOrder = Math.max(lastCategory?.order || 0, lastDefaultOrder) + 1;

        const newCategory = await Category.create({
            name,
            slug,
            description,
            color: color || "#4F46E5",
            order: newOrder
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error("Failed to create category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
