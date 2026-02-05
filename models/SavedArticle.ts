import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISavedArticle extends Document {
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    createdAt: Date;
}

const SavedArticleSchema: Schema<ISavedArticle> = new Schema(
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
    },
    { timestamps: true }
);

// Compound index to ensure a user can't save the same post twice
SavedArticleSchema.index({ user: 1, post: 1 }, { unique: true });

// Prevent overwrite on HMR
const SavedArticle: Model<ISavedArticle> =
    mongoose.models.SavedArticle || mongoose.model<ISavedArticle>("SavedArticle", SavedArticleSchema);

export default SavedArticle;
