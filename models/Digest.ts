import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDigest extends Document {
    title: string;
    slug: string;
    description?: string;
    posts: mongoose.Types.ObjectId[]; // Ordered list of posts in the digest
    editorPicks: mongoose.Types.ObjectId[]; // Special highlighted posts
    published: boolean;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const DigestSchema = new Schema<IDigest>(
    {
        title: {
            type: String,
            required: [true, "Please provide a title for the digest"],
            maxlength: [100, "Title cannot be more than 100 characters"],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            maxlength: [500, "Description cannot be more than 500 characters"],
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        editorPicks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        published: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
DigestSchema.index({ published: 1, publishedAt: -1 });


const Digest: Model<IDigest> = mongoose.models.Digest || mongoose.model<IDigest>("Digest", DigestSchema);

export default Digest;
