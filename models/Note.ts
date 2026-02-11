import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
    userId: string;
    postId: string | Schema.Types.ObjectId;
    paragraphId?: string;
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true,
        },
        paragraphId: {
            type: String,
            required: false,
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
