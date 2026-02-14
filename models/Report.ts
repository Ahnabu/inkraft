import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReport extends Document {
    reporter: mongoose.Types.ObjectId;
    targetType: "Post" | "Comment";
    targetId: mongoose.Types.ObjectId;
    reason: string;
    details?: string;
    status: "pending" | "resolved" | "dismissed";
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema: Schema<IReport> = new Schema(
    {
        reporter: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetType: {
            type: String,
            enum: ["Post", "Comment"],
            required: true,
        },
        targetId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "targetType",
        },
        reason: {
            type: String,
            required: true,
            enum: ["spam", "harassment", "hate_speech", "violence", "misinformation", "other"],
        },
        details: {
            type: String,
            maxlength: 1000,
        },
        status: {
            type: String,
            enum: ["pending", "resolved", "dismissed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Index for efficient queries
ReportSchema.index({ status: 1, createdAt: -1 });

const Report: Model<IReport> =
    mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);

export default Report;
