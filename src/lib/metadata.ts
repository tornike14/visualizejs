import type { Metadata } from "next";
import type { Topic } from "@/types";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export function createTopicMetadata(topic: Topic): Metadata {
  const title = `${topic.title} Visualization`;
  const categoryLabel = topic.category === "javascript" ? "JavaScript" : "React";
  const canonicalUrl = `${SITE_URL}${topic.route}`;

  return {
    title,
    description: topic.description,
    keywords: [
      "VisualizeJS",
      topic.title,
      categoryLabel,
      "interactive visualization",
      "JavaScript concepts",
      "React concepts",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: topic.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: topic.description,
    },
  };
}
