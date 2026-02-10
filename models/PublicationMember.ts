import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPublicationMember extends Document {
    publication: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    role: "owner" | "admin" | "editor" | "writer";
    status: "active" | "invited" | "suspended";
    joinedAt: Date;
    invitedBy?: mongoose.Types.ObjectId;
}

const PublicationMemberSchema: Schema<IPublicationMember> = new Schema(
    {
        publication: {
            type: Schema.Types.ObjectId,
            ref: "Publication",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["owner", "admin", "editor", "writer"],
            default: "writer",
        },
        status: {
            type: String,
            enum: ["active", "invited", "suspended"],
            default: "invited",
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
        invitedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

// Compound index to ensure a user is a member of a publication only once
PublicationMemberSchema.index({ publication: 1, user: 1 }, { unique: true });

// Prevent overwrite on HMR
const PublicationMember: Model<IPublicationMember> =
    mongoose.models.PublicationMember || mongoose.model<IPublicationMember>("PublicationMember", PublicationMemberSchema);

export default PublicationMember;
