/**
 * Utilities for managing multi-language post content
 */

export type Locale = "en" | "bn";

export interface PostTranslation {
    title?: string;
    excerpt?: string;
    content?: string;
}

export interface PostWithTranslations {
    slug: string;
    locale: Locale;
    title: string;
    excerpt?: string;
    content: string;
    translations?: {
        en?: PostTranslation;
        bn?: PostTranslation;
    };
}

/**
 * Get the displayable content for a post in the user's preferred locale
 * Falls back to original language if translation doesn't exist
 */
export function getLocalizedContent(
    post: PostWithTranslations,
    userLocale: Locale
): {
    title: string;
    excerpt?: string;
    content: string;
    language: Locale;
    isFallback: boolean;
} {
    //Try to get translated content
    if (post.translations?.[userLocale]?.title && post.translations[userLocale]?.content) {
        return {
            title: post.translations[userLocale].title!,
            excerpt: post.translations[userLocale].excerpt,
            content: post.translations[userLocale].content!,
            language: userLocale,
            isFallback: false,
        };
    }

    // Fallback to original
    return {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        language: post.locale,
        isFallback: userLocale !== post.locale,
    };
}

/**
 * Check if a post has translation for a specific locale
 */
export function hasTranslation(post: PostWithTranslations, locale: Locale): boolean {
    return !!(
        post.translations?.[locale]?.title &&
        post.translations[locale]?.content
    );
}

/**
 * Get available languages for a post
 */
export function getAvailableLanguages(post: PostWithTranslations): Locale[] {
    const languages: Locale[] = [post.locale];

    if (hasTranslation(post, "en") && post.locale !== "en") {
        languages.push("en");
    }
    if (hasTranslation(post, "bn") && post.locale !== "bn") {
        languages.push("bn");
    }

    return languages;
}

/**
 * Generate hreflang tags for SEO
 */
export function generateHreflangTags(
    post: PostWithTranslations,
    baseUrl: string
): { hreflang: string; href: string }[] {
    const tags: { hreflang: string; href: string }[] = [];
    const slug = post?.slug || "";

    const availableLanguages = getAvailableLanguages(post as any);

    availableLanguages.forEach((lang) => {
        tags.push({
            hreflang: lang === "en" ? "en" : "bn",
            href: `${baseUrl}/blog/${slug}?lang=${lang}`,
        });
    });

    // Add x-default (usually primary language)
    tags.push({
        hreflang: "x-default",
        href: `${baseUrl}/blog/${slug}`,
    });

    return tags;
}
