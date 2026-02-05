import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserActivity extends Document {
    user: mongoose.Types.ObjectId;
    articlesRead: number; // Total articles read
    lastReadAt: Date;
    contributions: number; // Posts + comments count
    updatedAt: Date;
    createdAt: Date;
}

const UserActivitySchema: Schema<IUserActivity> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        articlesRead: {
            type: Number,
            default: 0,
        },
        lastReadAt: {
            type: Date,
        },
        contributions: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const UserActivity: Model<IUserActivity> =
    mongoose.models.UserActivity ||
    mongoose.model<IUserActivity>("UserActivity", UserActivitySchema);

export default UserActivity;
