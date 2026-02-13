import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeedback extends Document {
    post: mongoose.Types.ObjectId;
    type: "helpful" | "clear" | "more_detail";
    ipHash?: string; // For basic rate limiting/abuse prevention
    createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        type: {
            type: String,
            enum: ["helpful", "clear", "more_detail"],
            required: true,
        },
        ipHash: {
            type: String,
            select: false, // Don't return by default
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Index for efficient querying
FeedbackSchema.index({ post: 1, type: 1 });
FeedbackSchema.index({ post: 1, ipHash: 1 }); // To check if user already gave feedback

const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;
