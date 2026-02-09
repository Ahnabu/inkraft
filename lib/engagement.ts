/**
 * Calculate trust multiplier for vote weighting
 * Based on account age, reading activity, and contributions
 */
export function calculateTrustMultiplier(
    accountAgeDays: number,
    articlesRead: number,
    contributions: number,
    followersCount: number = 0 // New signal
): number {
    const ageScore = Math.min(0.3, (accountAgeDays / 90) * 0.3);
    const readingScore = Math.min(0.4, (articlesRead / 100) * 0.4);
    const contributionScore = Math.min(0.3, (contributions / 20) * 0.3);
    const socialScore = Math.min(0.5, (followersCount / 50) * 0.5); // Cap at 50 followers for max boost

    const trustMultiplier = ageScore + readingScore + contributionScore + socialScore;

    // Clamp between 0.5 and 2.0 (New: can go up to 2.5 with social proof)
    return Math.min(2.5, Math.max(0.5, 1.0 + trustMultiplier));
}

/**
 * Calculate vote weight for a user
 */
export function calculateVoteWeight(
    accountAgeDays: number,
    articlesRead: number,
    contributions: number,
    followersCount: number = 0
): number {
    const baseWeight = 1.0;
    const trustMultiplier = calculateTrustMultiplier(
        accountAgeDays,
        articlesRead,
        contributions,
        followersCount
    );

    return baseWeight * trustMultiplier;
}

/**
 * Calculate engagement score for ranking posts
 * @param upvotes - Total upvotes with weight
 * @param downvotes - Total downvotes with weight  
 * @param commentCount - Number of comments
 * @param daysSincePublish - Days since publication
 */
export function calculateEngagementScore(
    upvotes: number,
    downvotes: number,
    commentCount: number,
    daysSincePublish: number
): number {
    const voteScore = upvotes * 2 - downvotes;
    const commentScore = commentCount * 2; // Increased weight for comments
    // Gravity-based decay: Score / (Time + 2)^1.8
    const timeFactor = Math.pow(daysSincePublish + 2, 1.8);

    return (voteScore + commentScore) / timeFactor;
}

/**
 * Calculate trending score based on engagement velocity
 * @param recentUpvotes - Upvotes in time window
 * @param recentComments - Comments in time window
 * @param hoursSincePublish - Hours since publication
 */
export function calculateTrendingScore(
    recentUpvotes: number,
    recentComments: number,
    hoursSincePublish: number
): number {
    // Prevent division by zero and boost very new posts
    const timeDivider = Math.max(0.5, hoursSincePublish);

    const engagementPoints = recentUpvotes + recentComments * 2.0;
    return engagementPoints / timeDivider;
}

/**
 * Get account age in days
 */
export function getAccountAgeDays(createdAt: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
