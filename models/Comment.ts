import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
    content: string; // Markdown
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    parentComment?: mongoose.Types.ObjectId; // For threading
    depth: number; // 0 = top-level, max 2
    edited: boolean;
    editedAt?: Date;
    deleted: boolean; // Soft delete
    deletedAt?: Date;
    reportCount: number;
    moderationStatus: "pending" | "approved" | "rejected";
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
    {
        content: {
            type: String,
            required: [true, "Comment content is required"],
            maxlength: [5000, "Comment cannot exceed 5000 characters"],
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        depth: {
            type: Number,
            default: 0,
            min: 0,
            max: 2, // Limit nesting to 2 levels (parent → reply)
        },
        edited: {
            type: Boolean,
            default: false,
        },
        editedAt: {
            type: Date,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
        },
        reportCount: {
            type: Number,
            default: 0,
        },
        moderationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "approved", // Auto-approve, can be "pending" for new users
        },
    },
    { timestamps: true }
);

// Indexes
CommentSchema.index({ post: 1, deleted: 1, createdAt: -1 }); // For fetching post comments
CommentSchema.index({ parentComment: 1 }); // For threading
CommentSchema.index({ author: 1, createdAt: -1 }); // For user's comments

const Comment: Model<IComment> =
    mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
