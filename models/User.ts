import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string; // Hashed password for credentials login
    image?: string;
    role: "admin" | "author" | "reader";
    banned: boolean;
    bio?: string;
    categories: string[]; // Writing categories for authors
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        website?: string;
    };
    savedPosts: mongoose.Types.ObjectId[]; // ObjectIds of saved posts
    trustScore: number; // For vote weighting (0.5 - 2.0)
    totalUpvotes: number;
    commentCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            maxlength: [60, "Name cannot be more than 60 characters"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            select: false,
        },
        image: {
            type: String,
        },
        role: {
            type: String,
            enum: ["admin", "author", "reader"],
            default: "reader",
        },
        banned: {
            type: Boolean,
            default: false,
        },
        bio: {
            type: String,
            maxlength: [500, "Bio cannot exceed 500 characters"],
        },
        trustScore: {
            type: Number,
            default: 1.0,
            min: 0.5,
            max: 2.0,
        },
        totalUpvotes: {
            type: Number,
            default: 0,
        },
        commentCount: {
            type: Number,
            default: 0,
        },
        categories: [{ type: String }],
        socialLinks: {
            twitter: String,
            linkedin: String,
            website: String,
        },
        savedPosts: [{
            type: Schema.Types.ObjectId,
            ref: "Post",
        }],
    },
    { timestamps: true }
);

// Prevent overwrite on HMR
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
