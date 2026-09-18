import type { MetadataRoute } from "next";
import { CATEGORY_LIST } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";
import { topics } from "@/lib/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...CATEGORY_LIST.map((category) => ({
      url: `${SITE_URL}${category.route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];

  const topicRoutes: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${SITE_URL}${topic.route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...topicRoutes];
}
