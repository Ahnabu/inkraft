import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
    title: string;
    slug: string;
    subtitle?: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    author: mongoose.Types.ObjectId;
    series?: mongoose.Types.ObjectId;
    category: string; // Single category (Technology, AI, etc.)
    tags: string[];
    published: boolean;
    status: "draft" | "submitted" | "needs_revision" | "scheduled" | "published" | "archived";
    publishedAt?: Date;
    lastUpdatedAt?: Date;
    readingTime: number; // Auto-calculated in minutes
    difficultyLevel?: "Beginner" | "Intermediate" | "Advanced";
    views: number;
    saves: number;
    upvotes: number;
    downvotes: number;
    commentCount: number;
    engagementScore: number; // Calculated field for ranking
    trendingScore: number; // Recalculated periodically
    adPlacement: "after-40" | "end" | "none";
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
        canonical?: string;
        ogImage?: string;
        structuredData?: Record<string, any>; // JSON-LD
    };
    editorsPick?: boolean;
    publication?: mongoose.Types.ObjectId;
    locale: string; // Primary language: 'en' or 'bn'
    translations?: {
        en?: {
            title?: string;
            excerpt?: string;
            content?: string;
        };
        bn?: {
            title?: string;
            excerpt?: string;
            content?: string;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema<IPost> = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Please provide a slug"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        subtitle: {
            type: String,
            maxlength: [200, "Subtitle cannot be more than 200 characters"],
        },
        content: {
            type: String,
            required: [true, "Please provide content"],
        },
        excerpt: {
            type: String,
            maxlength: [300, "Excerpt cannot be more than 300 characters"],
        },
        coverImage: {
            type: String,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        series: {
            type: Schema.Types.ObjectId,
            ref: "Series",
        },
        category: {
            type: String,
            required: [true, "Please select a category"],
        },
        tags: [{ type: String }],
        published: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["draft", "submitted", "needs_revision", "scheduled", "published", "archived"],
            default: "draft",
        },
        publishedAt: {
            type: Date,
        },
        lastUpdatedAt: {
            type: Date,
        },
        readingTime: {
            type: Number,
            default: 0,
        },
        difficultyLevel: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
        },
        views: {
            type: Number,
            default: 0,
        },
        saves: {
            type: Number,
            default: 0,
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        downvotes: {
            type: Number,
            default: 0,
        },
        commentCount: {
            type: Number,
            default: 0,
        },
        engagementScore: {
            type: Number,
            default: 0,
            index: true, // For ranking queries
        },
        trendingScore: {
            type: Number,
            default: 0,
            index: true,
        },
        adPlacement: {
            type: String,
            enum: ["after-40", "end", "none"],
            default: "end",
        },
        seo: {
            title: String,
            description: String,
            keywords: [String],
            canonical: String,
            ogImage: String,
        },
        editorsPick: {
            type: Boolean,
            default: false,
        },
        publication: {
            type: Schema.Types.ObjectId,
            ref: "Publication",
        },
        locale: {
            type: String,
            enum: ["en", "bn"],
            default: "en",
            required: true,
        },
        translations: {
            en: {
                title: String,
                excerpt: String,
                content: String,
            },
            bn: {
                title: String,
                excerpt: String,
                content: String,
            },
        },
    },
    { timestamps: true }
);

// Prevent overwrite on HMR
const Post: Model<IPost> =
    mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
