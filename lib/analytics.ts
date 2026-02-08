import crypto from "crypto";
import { UAParser } from "ua-parser-js";

/**
 * Lazy load geoip-lite to avoid build-time issues
 */
function getGeoIP() {
  // Only load in runtime, not during build
  if (typeof window === "undefined" && process.env.NODE_ENV !== "test") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require("geoip-lite");
    } catch (error) {
      console.warn("geoip-lite not available:", error);
      return null;
    }
  }
  return null;
}

/**
 * Hash IP address for privacy compliance (GDPR)
 */
export function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip + process.env.IP_SALT || "inkraft-salt").digest("hex");
}

/**
 * Get geographic location from IP address
 */
export function getLocationFromIP(ip: string) {
  // Handle localhost and private IPs
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return {
      country: "Local",
      countryCode: "LC",
      city: "Local",
      region: "Local",
    };
  }

  const geoip = getGeoIP();
  if (!geoip) {
    return {
      country: "Unknown",
      countryCode: "XX",
      city: "Unknown",
      region: "Unknown",
    };
  }

  const geo = geoip.lookup(ip);
  
  if (!geo) {
    return {
      country: "Unknown",
      countryCode: "XX",
      city: "Unknown",
      region: "Unknown",
    };
  }

  return {
    country: geo.country || "Unknown",
    countryCode: geo.country || "XX",
    city: geo.city || "Unknown",
    region: geo.region || "Unknown",
  };
}

/**
 * Parse user agent to get device, browser, and OS info
 */
export function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Determine device type
  let device: "desktop" | "mobile" | "tablet" | "unknown" = "unknown";
  if (result.device.type === "mobile") device = "mobile";
  else if (result.device.type === "tablet") device = "tablet";
  else if (result.browser.name) device = "desktop";

  return {
    device,
    browser: result.browser.name || "unknown",
    os: result.os.name || "unknown",
  };
}

/**
 * Extract client IP from request headers (handles proxies)
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }

  // Fallback to localhost for development
  return "127.0.0.1";
}

/**
 * Parse referrer URL to get domain
 */
export function parseReferrer(referrer: string | null): { referrer: string; referrerDomain: string } {
  if (!referrer) {
    return {
      referrer: "direct",
      referrerDomain: "direct",
    };
  }

  try {
    const url = new URL(referrer);
    return {
      referrer,
      referrerDomain: url.hostname,
    };
  } catch {
    return {
      referrer: "direct",
      referrerDomain: "direct",
    };
  }
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}
