import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeedback extends Document {
    postId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId; // Optional: can be anonymous (session-based or IP-based limitation in real app, but for now we'll stick to userId if grounded, or just allow it) -> Plan said "quality signal", usually implies logged in or fingerprinted. Let's make userId optional but encourage it.
    sessionId?: string; // For anonymous users
    type: "helpful" | "clear" | "needs-more";
    createdAt: Date;
}

const FeedbackSchema: Schema<IFeedback> = new Schema(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
        sessionId: {
            type: String,
            index: true,
        },
        type: {
            type: String,
            enum: ["helpful", "clear", "needs-more"],
            required: true,
        },
    },
    { timestamps: true }
);

// Prevent duplicate feedback from same user/session for same post
FeedbackSchema.index({ postId: 1, userId: 1 }, { unique: true, partialFilterExpression: { userId: { $exists: true } } });
FeedbackSchema.index({ postId: 1, sessionId: 1 }, { unique: true, partialFilterExpression: { sessionId: { $exists: true } } });

const Feedback: Model<IFeedback> =
    mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;
