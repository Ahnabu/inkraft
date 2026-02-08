/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { getBaseUrl } from "./utils";

interface SEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: "website" | "article" | "profile";
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
}

/**
 * Generate comprehensive SEO metadata
 */
export function generateSEO(config: SEOConfig): Metadata {
    const baseUrl = getBaseUrl();
    const {
        title,
        description,
        keywords = [],
        image = `${baseUrl}/api/og`,
        url = baseUrl,
        type = "website",
        publishedTime,
        modifiedTime,
        author,
        section,
        tags = [],
    } = config;

    const metadata: Metadata = {
        title,
        description,
        keywords,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Inkraft",
            locale: "en_US",
            type,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
            creator: "@inkraft",
            site: "@inkraft",
        },
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };

    // Add article-specific metadata
    if (type === "article" && metadata.openGraph) {
        (metadata.openGraph as any).publishedTime = publishedTime;
        (metadata.openGraph as any).modifiedTime = modifiedTime;
        (metadata.openGraph as any).authors = author ? [author] : [];
        (metadata.openGraph as any).section = section;
        (metadata.openGraph as any).tags = tags;
    }

    return metadata;
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema() {
    const baseUrl = getBaseUrl();
    
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Inkraft",
        alternateName: "Inkraft Blog",
        url: baseUrl,
        logo: `${baseUrl}/icon-512.png`,
        description: "Premium blogging platform for high-quality tech content on AI, Programming, Cybersecurity, and Web Development.",
        sameAs: [
            "https://twitter.com/inkraft",
            "https://github.com/inkraft",
        ],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            email: "support@inkraft.com",
        },
    };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

/**
 * Generate JSON-LD structured data for article
 */
export function generateArticleSchema(article: {
    title: string;
    subtitle?: string;
    description: string;
    image?: string;
    publishedDate: string;
    modifiedDate: string;
    authorName: string;
    authorUrl?: string;
    authorImage?: string;
    authorBio?: string;
    url: string;
    keywords: string[];
    category: string;
    wordCount: number;
    readingTime: number;
    views?: number;
    upvotes?: number;
    comments?: number;
}) {
    const baseUrl = getBaseUrl();

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        alternativeHeadline: article.subtitle,
        description: article.description,
        image: article.image
            ? {
                  "@type": "ImageObject",
                  url: article.image,
                  width: 1200,
                  height: 630,
              }
            : `${baseUrl}/api/og?title=${encodeURIComponent(article.title)}`,
        datePublished: article.publishedDate,
        dateModified: article.modifiedDate,
        author: {
            "@type": "Person",
            name: article.authorName,
            url: article.authorUrl,
            image: article.authorImage,
            description: article.authorBio,
        },
        publisher: {
            "@type": "Organization",
            name: "Inkraft",
            url: baseUrl,
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/icon-512.png`,
                width: 512,
                height: 512,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": article.url,
        },
        keywords: article.keywords.join(", "),
        articleSection: article.category,
        wordCount: article.wordCount,
        timeRequired: `PT${article.readingTime}M`,
        url: article.url,
        inLanguage: "en-US",
        interactionStatistic: [
            {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/ReadAction",
                userInteractionCount: article.views || 0,
            },
            {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/LikeAction",
                userInteractionCount: article.upvotes || 0,
            },
            {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/CommentAction",
                userInteractionCount: article.comments || 0,
            },
        ],
    };
}

/**
 * Generate JSON-LD structured data for FAQ
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

/**
 * Generate JSON-LD structured data for website search
 */
export function generateWebsiteSchema() {
    const baseUrl = getBaseUrl();

    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Inkraft",
        alternateName: ["Inkraft Blog", "Inkraft Platform"],
        url: baseUrl,
        description: "Premium blogging platform for high-quality tech content.",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${baseUrl}/explore?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
    const baseUrl = getBaseUrl();
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
}

/**
 * Generate Open Graph image URL
 */
export function generateOGImageUrl(title: string, description?: string): string {
    const baseUrl = getBaseUrl();
    const params = new URLSearchParams();
    params.set("title", title);
    if (description) params.set("description", description);
    return `${baseUrl}/api/og?${params.toString()}`;
}

/**
 * Validate and format title for SEO
 * Max length: 60 characters for optimal display
 */
export function formatSEOTitle(title: string, suffix: string = "Inkraft"): string {
    const maxLength = 60;
    const fullTitle = `${title} | ${suffix}`;
    
    if (fullTitle.length <= maxLength) {
        return fullTitle;
    }
    
    // Truncate title to fit within maxLength
    const availableLength = maxLength - suffix.length - 3; // 3 for " | "
    const truncatedTitle = title.substring(0, availableLength - 3) + "...";
    return `${truncatedTitle} | ${suffix}`;
}

/**
 * Validate and format description for SEO
 * Recommended length: 150-160 characters
 */
export function formatSEODescription(description: string): string {
    const maxLength = 160;
    
    if (description.length <= maxLength) {
        return description;
    }
    
    // Truncate at last complete word before maxLength
    const truncated = description.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(" ");
    return truncated.substring(0, lastSpace) + "...";
}

/**
 * Extract keywords from content
 */
export function extractKeywords(content: string, count: number = 10): string[] {
    // Remove HTML tags and special characters
    const text = content
        .replace(/<[^>]*>/g, " ")
        .replace(/[^\w\s]/g, " ")
        .toLowerCase();

    // Split into words and filter common words
    const commonWords = new Set([
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "up", "about", "into", "through", "during",
        "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
        "do", "does", "did", "will", "would", "could", "should", "may", "might",
        "can", "this", "that", "these", "those", "it", "its", "as", "which",
    ]);

    const words = text
        .split(/\s+/)
        .filter((word) => word.length > 3 && !commonWords.has(word));

    // Count word frequency
    const frequency: Record<string, number> = {};
    words.forEach((word) => {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    // Sort by frequency and return top keywords
    return Object.entries(frequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, count)
        .map(([word]) => word);
}
