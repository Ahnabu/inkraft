import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email address"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address",
        ],
    },
    isVerified: {
        type: Boolean,
        default: true, // Defaulting to true for now as we don't have email sending set up yet
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
    verificationToken: String,
    tokenExpires: Date,
});

export default mongoose.models.Subscriber ||
    mongoose.model("Subscriber", SubscriberSchema);
