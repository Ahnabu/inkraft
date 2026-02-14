import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminAlert extends Document {
    type: "vote_spike" | "spam_velocity" | "low_trust_engagement" | "repeated_reports" | "suspicious_activity" | "user_report" | "category_request";
    severity: "low" | "medium" | "high" | "critical";
    targetUser?: mongoose.Types.ObjectId;
    targetPost?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    metadata?: Record<string, unknown>;
    resolved: boolean;
    resolvedBy?: mongoose.Types.ObjectId;
    resolvedAt?: Date;
    action?: "dismissed" | "trust_frozen" | "post_hidden" | "user_banned" | "votes_nullified" | "content_shadow_limited" | "trust_adjusted" | "comment_locked" | "category_created";
    createdAt: Date;
    updatedAt: Date;
}

const AdminAlertSchema: Schema<IAdminAlert> = new Schema(
    {
        type: {
            type: String,
            enum: ["vote_spike", "spam_velocity", "low_trust_engagement", "repeated_reports", "suspicious_activity", "user_report", "category_request"],
            required: true,
        },
        severity: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
        },
        targetUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        targetPost: {
            type: Schema.Types.ObjectId,
            ref: "Post",
        },
        title: {
            type: String,
            required: true,
            maxlength: 200,
        },
        description: {
            type: String,
            required: true,
            maxlength: 1000,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
        resolved: {
            type: Boolean,
            default: false,
            index: true,
        },
        resolvedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        resolvedAt: {
            type: Date,
        },
        action: {
            type: String,
            enum: ["dismissed", "trust_frozen", "post_hidden", "user_banned", "votes_nullified", "content_shadow_limited", "trust_adjusted", "comment_locked", "category_created"],
        },
    },
    { timestamps: true }
);

// Index for efficient queries
AdminAlertSchema.index({ resolved: 1, severity: -1, createdAt: -1 });

const AdminAlert: Model<IAdminAlert> =
    mongoose.models.AdminAlert || mongoose.model<IAdminAlert>("AdminAlert", AdminAlertSchema);

export default AdminAlert;
