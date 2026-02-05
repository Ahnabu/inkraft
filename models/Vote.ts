import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVote extends Document {
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    voteType: "upvote" | "downvote";
    weight: number; // For trusted user weighting
    createdAt: Date;
    updatedAt: Date;
}

const VoteSchema: Schema<IVote> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        voteType: {
            type: String,
            enum: ["upvote", "downvote"],
            required: true,
        },
        weight: {
            type: Number,
            default: 1.0,
            min: 0.5,
            max: 2.0,
        },
    },
    { timestamps: true }
);

// Unique index: one vote per user per post
VoteSchema.index({ user: 1, post: 1 }, { unique: true });

// Index for querying votes by post
VoteSchema.index({ post: 1, voteType: 1 });

const Vote: Model<IVote> =
    mongoose.models.Vote || mongoose.model<IVote>("Vote", VoteSchema);

export default Vote;
