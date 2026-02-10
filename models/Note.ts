import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
    userId: string;
    postId: string;
    paragraphId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        postId: {
            type: String, // Storing as string to match Post ID usage, could be ObjectId if we want ref
            required: true,
            index: true,
        },
        paragraphId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient querying of a user's notes on a specific post
NoteSchema.index({ userId: 1, postId: 1 });

export default mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);
