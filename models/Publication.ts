import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPublication extends Document {
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    coverImage?: string;
    owner: mongoose.Types.ObjectId;
    branding?: {
        primaryColor?: string;
        accentColor?: string;
        customCss?: string;
    };
    socialLinks?: {
        twitter?: string;
        website?: string;
        linkedin?: string;
        instagram?: string;
    };
    followers: mongoose.Types.ObjectId[];
    stats: {
        totalPosts: number;
        totalViews: number;
        totalFollowers: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const PublicationSchema: Schema<IPublication> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a publication name"],
            trim: true,
            maxlength: [100, "Name cannot be more than 100 characters"],
        },
        slug: {
            type: String,
            required: [true, "Please provide a slug"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            maxlength: [500, "Description cannot be more than 500 characters"],
        },
        logo: String,
        coverImage: String,
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        branding: {
            primaryColor: String,
            accentColor: String,
            customCss: String,
        },
        socialLinks: {
            twitter: String,
            website: String,
            linkedin: String,
            instagram: String,
        },
        followers: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        stats: {
            totalPosts: { type: Number, default: 0 },
            totalViews: { type: Number, default: 0 },
            totalFollowers: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

// Prevent overwrite on HMR
const Publication: Model<IPublication> =
    mongoose.models.Publication || mongoose.model<IPublication>("Publication", PublicationSchema);

export default Publication;
