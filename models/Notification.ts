import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    type: "new_post" | "comment_reply" | "new_follower" | "series_update";
    actor?: mongoose.Types.ObjectId;
    post?: mongoose.Types.ObjectId;
    series?: mongoose.Types.ObjectId;
    message?: string;
    read: boolean;
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
            enum: ["new_post", "comment_reply", "new_follower", "series_update"],
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
        message: {
            type: String,
            maxlength: 200,
        },
        read: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    { timestamps: true }
);

// Compound index for efficient queries
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });

const Notification: Model<INotification> =
    mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
