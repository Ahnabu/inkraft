import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISeries extends Document {
    title: string;
    description: string;
    slug: string;
    author: mongoose.Types.ObjectId;
    posts: mongoose.Types.ObjectId[];
    coverImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SeriesSchema: Schema<ISeries> = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a series title"],
            trim: true,
            maxlength: [100, "Title cannot be more than 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Please provide a description"],
            maxlength: [500, "Description cannot be more than 500 characters"],
        },
        slug: {
            type: String,
            required: [true, "Please provide a slug"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        posts: [{
            type: Schema.Types.ObjectId,
            ref: "Post",
        }],
        coverImage: {
            type: String,
        },
    },
    { timestamps: true }
);

const Series: Model<ISeries> =
    mongoose.models.Series || mongoose.model<ISeries>("Series", SeriesSchema);

export default Series;
