import mongoose, { Schema, Document, Model } from "mongoose";

export type NotificationType =
    | "new_post"
    | "comment_reply"
    | "new_follower"
    | "series_update"
    | "category_post"      // New post in followed category
    | "upvote_milestone"   // Post reached upvote milestone (10, 50, 100, etc.)
    | "admin_announcement"; // Admin broadcast

export type NotificationState = "unread" | "read" | "archived";

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    type: NotificationType;
    actor?: mongoose.Types.ObjectId;
    post?: mongoose.Types.ObjectId;
    series?: mongoose.Types.ObjectId;
    category?: string; // For category_post notifications
    message?: string;
    // Legacy field - kept for backward compatibility
    read: boolean;
    // New state field for richer notification management
    state: NotificationState;
    // Batching support - group similar notifications
    batchKey?: string; // e.g., "category-technology-2026-02-09"
    batchCount: number; // How many events this notification represents
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: [
                "new_post",
                "comment_reply",
                "new_follower",
                "series_update",
                "category_post",
                "upvote_milestone",
                "admin_announcement"
            ],
            required: true,
        },
        actor: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
        },
        series: {
            type: Schema.Types.ObjectId,
            ref: "Series",
        },
        category: {
            type: String,
        },
        message: {
            type: String,
            maxlength: 200,
        },
        read: {
            type: Boolean,
            default: false,
            index: true,
        },
        state: {
            type: String,
            enum: ["unread", "read", "archived"],
            default: "unread",
            index: true,
        },
        batchKey: {
            type: String,
            index: true,
        },
        batchCount: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

// Compound indexes for efficient queries
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, state: 1, createdAt: -1 });
NotificationSchema.index({ batchKey: 1, state: 1 }); // For batch aggregation

const Notification: Model<INotification> =
    mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
