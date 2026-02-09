/**
 * Trust-based feature gating for users
 * Users earn trust through positive interactions (upvotes, quality content)
 * Trust score affects what features they can use
 */

// Trust level thresholds
const TRUST_LEVELS = {
    HIGH: 1.5,      // Full access to all features
    MEDIUM: 1.0,    // Standard features (links, code blocks)
    LOW: 0.5,       // Limited features
    NEW: 0,         // New users, most restricted
};

type Feature =
    | "links"              // Can include links in comments
    | "codeBlocks"         // Can use code blocks in comments
    | "unlimitedReplies"   // No rate limit on replies
    | "skipModeration"     // Comments auto-approved
    | "editHistory"        // Can view edit history
    | "richFormatting";    // Bold, italic, etc.

interface UserTrustData {
    trustScore: number;
    totalComments?: number;
    commentKarma?: number;
    accountAgeMonths?: number;
    verified?: boolean;
}

/**
 * Check if user has permission to use a feature based on trust score
 */
export function canUseFeature(user: UserTrustData, feature: Feature): boolean {
    const { trustScore, verified, accountAgeMonths = 0 } = user;

    // Verified users get full access
    if (verified) return true;

    // Feature gates based on trust level
    switch (feature) {
        case "skipModeration":
            return trustScore >= TRUST_LEVELS.HIGH;

        case "unlimitedReplies":
            return trustScore >= TRUST_LEVELS.HIGH && accountAgeMonths >= 3;

        case "links":
        case "codeBlocks":
        case "richFormatting":
            return trustScore >= TRUST_LEVELS.MEDIUM;

        case "editHistory":
            return trustScore >= TRUST_LEVELS.LOW;

        default:
            return false;
    }
}

/**
 * Get allowed features for a user
 */
export function getAllowedFeatures(user: UserTrustData): Feature[] {
    const features: Feature[] = [
        "links", "codeBlocks", "unlimitedReplies",
        "skipModeration", "editHistory", "richFormatting"
    ];

    return features.filter(f => canUseFeature(user, f));
}

/**
 * Calculate moderation mode for a user's comment
 * Returns "approved" for high-trust users, "pending" for new/low-trust
 */
export function getCommentModerationStatus(user: UserTrustData): "pending" | "approved" {
    if (canUseFeature(user, "skipModeration")) {
        return "approved";
    }
    return "pending";
}

/**
 * Get user trust level label for display
 */
export function getTrustLevelLabel(trustScore: number): string {
    if (trustScore >= TRUST_LEVELS.HIGH) return "Trusted";
    if (trustScore >= TRUST_LEVELS.MEDIUM) return "Active";
    if (trustScore >= TRUST_LEVELS.LOW) return "Member";
    return "New";
}

/**
 * Sanitize comment content based on trust level
 * Strips features user doesn't have access to
 */
export function sanitizeCommentContent(
    content: string,
    user: UserTrustData
): string {
    let sanitized = content;

    // Strip links if not allowed
    if (!canUseFeature(user, "links")) {
        // Convert links to plain text
        sanitized = sanitized.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        sanitized = sanitized.replace(/https?:\/\/[^\s]+/g, '[link removed]');
    }

    // Strip code blocks if not allowed
    if (!canUseFeature(user, "codeBlocks")) {
        sanitized = sanitized.replace(/```[\s\S]*?```/g, '[code removed]');
        sanitized = sanitized.replace(/`[^`]+`/g, '[code removed]');
    }

    return sanitized;
}
