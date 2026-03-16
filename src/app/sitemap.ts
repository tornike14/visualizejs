import type { MetadataRoute } from "next";
import { getTheoryTopicsByCategory } from "@/content/theory";
import { SITE_URL } from "@/lib/constants";
import { topics } from "@/lib/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/javascript`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/react`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const topicRoutes: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${SITE_URL}${topic.route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const theoryRoutes: MetadataRoute.Sitemap = [
    ...getTheoryTopicsByCategory("javascript"),
    ...getTheoryTopicsByCategory("react"),
  ].map((topic) => ({
    url: `${SITE_URL}${topic.route}/theory`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...topicRoutes, ...theoryRoutes];
}
