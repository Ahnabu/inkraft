import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getBaseUrl();
    
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/dashboard", "/settings", "/new", "/edit/*"],
            },
            {
                userAgent: "Googlebot",
                allow: "/",
                disallow: ["/api/", "/dashboard", "/settings", "/new", "/edit/*"],
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
