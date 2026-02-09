import mongoose, { Schema } from "mongoose";

// Schema for tracking individual post views with geographic data
const PostAnalyticsSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    postSlug: {
      type: String,
      required: true,
      index: true,
    },
    // IP hash for privacy (not storing raw IPs)
    ipHash: {
      type: String,
      required: true,
    },
    // Geographic data from IP
    country: {
      type: String,
      default: "Unknown",
    },
    countryCode: {
      type: String,
      default: "XX",
    },
    city: {
      type: String,
      default: "Unknown",
    },
    region: {
      type: String,
      default: "Unknown",
    },
    // User agent info
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },
    browser: {
      type: String,
      default: "unknown",
    },
    os: {
      type: String,
      default: "unknown",
    },
    // Referrer information
    referrer: {
      type: String,
      default: "direct",
    },
    referrerDomain: {
      type: String,
      default: "direct",
    },
    // Session tracking
    sessionId: {
      type: String,
      index: true,
    },
    // Engagement metrics
    timeOnPage: {
      type: Number, // seconds
      default: 0,
    },
    scrollDepth: {
      type: Number, // percentage
      default: 0,
    },
    // Completion tracking
    reachedEnd: {
      type: Boolean,
      default: false,
    },
    exitScrollDepth: {
      type: Number, // percentage where they left
      default: 0,
    },
    // Timestamps
    viewedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
PostAnalyticsSchema.index({ postId: 1, viewedAt: -1 });
PostAnalyticsSchema.index({ postSlug: 1, viewedAt: -1 });
PostAnalyticsSchema.index({ countryCode: 1 });
PostAnalyticsSchema.index({ viewedAt: -1 });

// Virtual for grouping
PostAnalyticsSchema.virtual("post", {
  ref: "Post",
  localField: "postId",
  foreignField: "_id",
  justOne: true,
});

export default mongoose.models.PostAnalytics ||
  mongoose.model("PostAnalytics", PostAnalyticsSchema);
