// Default categories for Inkraft platform

export interface CategoryConfig {
    name: string;
    slug: string;
    description: string;
    color: string;
    order: number;
}

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
    {
        name: "Technology",
        slug: "technology",
        description: "Explore the latest trends in technology, from hardware innovations to software breakthroughs that are shaping our digital future.",
        color: "#4F46E5", // Indigo
        order: 1,
    },
    {
        name: "AI & Future",
        slug: "ai-future",
        description: "Dive deep into artificial intelligence, machine learning, and emerging technologies that will define tomorrow's world.",
        color: "#7C3AED", // Violet
        order: 2,
    },
    {
        name: "Programming",
        slug: "programming",
        description: "Master programming languages, frameworks, and best practices. From beginner tutorials to advanced architecture patterns.",
        color: "#2563EB", // Blue
        order: 3,
    },
    {
        name: "Cybersecurity",
        slug: "cybersecurity",
        description: "Stay safe online with insights on security best practices, threat analysis, and privacy protection in the digital age.",
        color: "#DC2626", // Red
        order: 4,
    },
    {
        name: "Product & Startups",
        slug: "product-startups",
        description: "Learn from founders and product leaders about building, scaling, and growing successful digital products and ventures.",
        color: "#059669", // Emerald
        order: 5,
    },
    {
        name: "Guides",
        slug: "guides",
        description: "Step-by-step guides and how-to articles to help you master new skills and solve complex problems effectively.",
        color: "#EA580C", // Orange
        order: 6,
    },
    {
        name: "Case Studies",
        slug: "case-studies",
        description: "Real-world examples and in-depth analysis of successful projects, products, and business strategies.",
        color: "#0891B2", // Cyan
        order: 7,
    },
    {
        name: "Opinions",
        slug: "opinions",
        description: "Thought-provoking perspectives and commentary on technology, business, and the future of work.",
        color: "#9333EA", // Purple
        order: 8,
    },
    {
        name: "Personal",
        slug: "personal",
        description: "Personal stories, life lessons, and reflections on the journey of growth and discovery.",
        color: "#EC4899", // Pink
        order: 9,
    },
];

// Helper to get category by slug
export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
    return DEFAULT_CATEGORIES.find(cat => cat.slug === slug);
}

// Helper to get all category slugs
export function getAllCategorySlugs(): string[] {
    return DEFAULT_CATEGORIES.map(cat => cat.slug);
}
