import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInternalNote extends Document {
    content: string;
    post: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
    resolved: boolean;
}

const InternalNoteSchema: Schema<IInternalNote> = new Schema(
    {
        content: {
            type: String,
            required: [true, "Please provide content"],
            trim: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        resolved: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const InternalNote: Model<IInternalNote> =
    mongoose.models.InternalNote || mongoose.model<IInternalNote>("InternalNote", InternalNoteSchema);

export default InternalNote;
