import type { MetadataRoute } from "next";
import { CATEGORY_LIST } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";
import { topics } from "@/lib/topics";

/**
 * lastModified is deliberately omitted: stamping every URL with the build
 * time tells crawlers nothing and makes real changes indistinguishable.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...CATEGORY_LIST.map((category) => ({
      url: `${SITE_URL}${category.route}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...topics.map((topic) => ({
      url: `${SITE_URL}${topic.route}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
