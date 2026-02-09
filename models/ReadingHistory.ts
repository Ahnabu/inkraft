import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReadingHistory extends Document {
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    lastReadAt: Date;
    progress: number; // Percent scroll (0-100)
    completed: boolean;
}

const ReadingHistorySchema: Schema<IReadingHistory> = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    lastReadAt: {
        type: Date,
        default: Date.now
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Compound index for efficient lookup and ensuring one record per user/post
ReadingHistorySchema.index({ user: 1, post: 1 }, { unique: true });
// Index for fetching recent history
ReadingHistorySchema.index({ user: 1, lastReadAt: -1 });

// Prevent overwrite on HMR
const ReadingHistory: Model<IReadingHistory> =
    mongoose.models.ReadingHistory || mongoose.model<IReadingHistory>("ReadingHistory", ReadingHistorySchema);

export default ReadingHistory;
