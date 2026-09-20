import { describe, expect, it } from "vitest";
import { CATEGORIES, CATEGORY_LIST } from "@/lib/categories";
import { CREATOR_NAME, SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  createCategoryMetadata,
  createTopicMetadata,
  createTopicStructuredData,
  getTopicDescription,
  getTopicKeywords,
} from "@/lib/metadata";
import { getTopicById, topics } from "@/lib/topics";
import type { Topic } from "@/types";

const closures = getTopicById("closures")!;

/** Narrows the structured data pair so each schema can be inspected. */
const structuredData = (topic: Topic, summary?: string) => {
  const [article, breadcrumbs] = createTopicStructuredData(topic, summary);
  if (!("headline" in article) || !("itemListElement" in breadcrumbs)) {
    throw new Error("Unexpected structured data order");
  }
  return { article, breadcrumbs };
};

describe("getTopicKeywords", () => {
  it("starts with the title and the id as words", () => {
    const keywords = getTopicKeywords(closures);
    expect(keywords[0]).toBe("Closures");
    expect(keywords[1]).toBe("closures");
  });

  it("splits hyphenated ids into words", () => {
    const keywords = getTopicKeywords(getTopicById("event-loop")!);
    expect(keywords[1]).toBe("event loop");
  });

  it("includes the category keywords after the topic keywords", () => {
    const keywords = getTopicKeywords(closures);
    for (const keyword of CATEGORIES.javascript.keywords) {
      expect(keywords).toContain(keyword);
    }
    const firstCategoryIndex = keywords.indexOf(
      CATEGORIES.javascript.keywords[0],
    );
    expect(firstCategoryIndex).toBeGreaterThan(1);
  });

  it("dedupes and never returns blank entries", () => {
    for (const topic of topics) {
      const keywords = getTopicKeywords(topic);
      expect(new Set(keywords).size).toBe(keywords.length);
      expect(keywords.every((keyword) => keyword.trim() === keyword)).toBe(
        true,
      );
      expect(keywords.every((keyword) => keyword.length > 0)).toBe(true);
      expect(keywords.length).toBeGreaterThan(4);
    }
  });
});

describe("getTopicDescription", () => {
  it("has a theory description for every topic", () => {
    for (const topic of topics) {
      const description = getTopicDescription(topic);
      expect(description.trim().length).toBeGreaterThan(40);
      expect(description).not.toContain("—");
    }
  });
});

describe("createTopicMetadata", () => {
  const metadata = createTopicMetadata(closures);

  it("builds the title from the topic and category", () => {
    expect(metadata.title).toBe("Closures in JavaScript, Visualized");
    expect(metadata.category).toBe("JavaScript");
  });

  it("points the canonical, Open Graph, and structured URLs at the route", () => {
    expect(metadata.alternates?.canonical).toBe(
      `${SITE_URL}/javascript/closures`,
    );
    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/javascript/closures`);
  });

  it("uses the theory description everywhere", () => {
    const description = getTopicDescription(closures);
    expect(metadata.description).toBe(description);
    expect(metadata.openGraph?.description).toBe(description);
    expect(metadata.twitter?.description).toBe(description);
  });

  it("brands social titles with the site name", () => {
    expect(metadata.openGraph?.title).toBe(
      `Closures in JavaScript, Visualized | ${SITE_NAME}`,
    );
    expect(metadata.twitter?.title).toBe(
      `Closures in JavaScript, Visualized | ${SITE_NAME}`,
    );
    expect(metadata.openGraph).toMatchObject({
      siteName: SITE_NAME,
      type: "article",
      locale: "en_US",
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("allows indexing", () => {
    expect(metadata.robots).toEqual({
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    });
  });

  it("carries the curated keywords", () => {
    expect(metadata.keywords).toEqual(getTopicKeywords(closures));
  });
});

describe("createTopicStructuredData", () => {
  it("returns a TechArticle and a BreadcrumbList", () => {
    const { article, breadcrumbs } = structuredData(closures);
    expect(article["@type"]).toBe("TechArticle");
    expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
  });

  it("describes the article with the topic's metadata", () => {
    const { article } = structuredData(closures);
    expect(article).toMatchObject({
      headline: "Closures in JavaScript, Visualized",
      description: getTopicDescription(closures),
      url: `${SITE_URL}/javascript/closures`,
      inLanguage: "en-US",
      keywords: getTopicKeywords(closures).join(", "),
      mainEntityOfPage: `${SITE_URL}/javascript/closures`,
      about: { name: "Closures", description: closures.description },
      author: { name: CREATOR_NAME },
      publisher: { name: SITE_NAME, url: SITE_URL },
    });
  });

  it("prefers a supplied summary over the theory description", () => {
    const { article } = structuredData(closures, "Short summary.");
    expect(article.description).toBe("Short summary.");
  });

  it("maps difficulty to schema.org proficiency levels", () => {
    const byDifficulty = new Map(
      topics.map((topic) => [topic.difficulty, topic]),
    );
    const level = (difficulty: "beginner" | "intermediate" | "advanced") =>
      structuredData(byDifficulty.get(difficulty)!).article.proficiencyLevel;
    expect(level("beginner")).toBe("Beginner");
    expect(level("intermediate")).toBe("Beginner");
    expect(level("advanced")).toBe("Expert");
  });

  it("builds a three-level breadcrumb trail", () => {
    const { breadcrumbs } = structuredData(closures);
    expect(breadcrumbs.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "JavaScript Concepts",
        item: `${SITE_URL}/javascript`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Closures",
        item: `${SITE_URL}/javascript/closures`,
      },
    ]);
  });
});

describe("createCategoryMetadata", () => {
  const react = CATEGORIES.react;
  const metadata = createCategoryMetadata(react, 7);

  it("uses the index title and mentions the topic count", () => {
    expect(metadata.title).toBe(react.indexTitle);
    expect(metadata.description).toBe(
      `Explore 7 interactive React visualizations. ${react.description}`,
    );
  });

  it("points at the category route", () => {
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/react`);
    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/react`);
    expect(metadata.openGraph).toMatchObject({ type: "website" });
  });

  it("merges index and category keywords without duplicates", () => {
    const keywords = metadata.keywords as string[];
    expect(new Set(keywords).size).toBe(keywords.length);
    for (const keyword of [...react.indexKeywords, ...react.keywords]) {
      expect(keywords).toContain(keyword);
    }
  });

  it("works for every category", () => {
    for (const category of CATEGORY_LIST) {
      const result = createCategoryMetadata(category, 3);
      expect(result.title).toBe(category.indexTitle);
      expect(result.alternates?.canonical).toBe(`${SITE_URL}${category.route}`);
    }
  });
});
