import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICommentHistory extends Document {
    comment: mongoose.Types.ObjectId;
    previousContent: string;
    editedAt: Date;
    editedBy?: mongoose.Types.ObjectId;
    editReason?: string;
}

const CommentHistorySchema: Schema<ICommentHistory> = new Schema(
    {
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            required: true,
            index: true,
        },
        previousContent: {
            type: String,
            required: true,
        },
        editedAt: {
            type: Date,
            default: Date.now,
        },
        editedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        editReason: {
            type: String,
            maxlength: 200,
        },
    },
    { timestamps: true }
);

// Compound index for efficient history queries
CommentHistorySchema.index({ comment: 1, editedAt: -1 });

const CommentHistory: Model<ICommentHistory> =
    mongoose.models.CommentHistory || mongoose.model<ICommentHistory>("CommentHistory", CommentHistorySchema);

export default CommentHistory;
