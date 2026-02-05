import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    description: string; // SEO text
    color: string; // Hex color for category accent
    featuredPost?: mongoose.Types.ObjectId;
    order: number; // Display order
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a category name"],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Please provide a slug"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, "Please provide a description for SEO"],
            maxlength: [500, "Description cannot be more than 500 characters"],
        },
        color: {
            type: String,
            default: "#4F46E5", // Inkraft primary color
        },
        featuredPost: {
            type: Schema.Types.ObjectId,
            ref: "Post",
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Prevent overwrite on HMR
const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
