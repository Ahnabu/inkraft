// Simple in-memory rate limiter for comments
// In production, use Redis or similar distributed cache

interface RateLimitEntry {
    count: number;
    resetTime: number;
    timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limits based on user trust level
export const RATE_LIMITS = {
    newUser: { limit: 3, window: 3600000 }, // 3 comments per hour
    regular: { limit: 10, window: 3600000 }, // 10 comments per hour
    trusted: { limit: 30, window: 3600000 }, // 30 comments per hour
};

/**
 * Determine rate limit tier based on user trust score
 */
export function getRateLimitTier(trustScore: number): keyof typeof RATE_LIMITS {
    if (trustScore >= 1.5) return "trusted";
    if (trustScore >= 1.0) return "regular";
    return "newUser";
}

/**
 * Check if user has exceeded rate limit
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
    userId: string,
    trustScore: number
): { allowed: boolean; remaining: number; resetTime: number } {
    const tier = getRateLimitTier(trustScore);
    const { limit, window } = RATE_LIMITS[tier];
    const now = Date.now();

    let entry = rateLimitStore.get(userId);

    if (!entry || now > entry.resetTime) {
        // Create new entry or reset expired one
        entry = {
            count: 0,
            resetTime: now + window,
            timestamps: [],
        };
        rateLimitStore.set(userId, entry);
    }

    // Clean up old timestamps outside the window
    entry.timestamps = entry.timestamps.filter((ts) => now - ts < window);

    if (entry.timestamps.length >= limit) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime,
        };
    }

    return {
        allowed: true,
        remaining: limit - entry.timestamps.length,
        resetTime: entry.resetTime,
    };
}

/**
 * Record a comment for rate limiting
 */
export function recordComment(userId: string) {
    const entry = rateLimitStore.get(userId);
    if (entry) {
        entry.timestamps.push(Date.now());
        entry.count++;
    }
}

/**
 * Clean up old entries (call periodically)
 */
export function cleanupRateLimitStore() {
    const now = Date.now();
    for (const [userId, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime + 3600000) {
            // Clean up 1 hour after reset
            rateLimitStore.delete(userId);
        }
    }
}

// Clean up every hour
if (typeof setInterval !== "undefined") {
    setInterval(cleanupRateLimitStore, 3600000);
}
