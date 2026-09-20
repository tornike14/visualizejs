import { describe, expect, it } from "vitest";
import {
  getRelatedTopicsFromTheory,
  getTheoryContent,
  getTheoryTopicsByCategory,
  hasTheoryContent,
} from "@/content/theory";
import { CATEGORY_ORDER } from "@/lib/categories";
import { getTopicsByCategory, isTopicId, topics } from "@/lib/topics";

const EM_DASH = "—";
const EMOJI = /\p{Extended_Pictographic}/u;

describe("theory registry", () => {
  it("has theory content for every topic", () => {
    for (const topic of topics) {
      expect(hasTheoryContent(topic.id)).toBe(true);
      expect(getTheoryContent(topic.id)).toBeDefined();
    }
  });

  it("returns nothing for unknown topics", () => {
    expect(getTheoryContent("missing")).toBeUndefined();
    expect(hasTheoryContent("missing")).toBe(false);
  });

  it("fills every section for every topic", () => {
    for (const topic of topics) {
      const theory = getTheoryContent(topic.id)!;
      expect(theory.summary.trim().length).toBeGreaterThan(40);
      expect(theory.whatItIs.length).toBeGreaterThan(0);
      expect(theory.howItWorks.length).toBeGreaterThan(0);
      expect(theory.commonMistakes.length).toBeGreaterThan(0);
      expect(theory.interviewQuestions.length).toBeGreaterThan(0);
      for (const mistake of theory.commonMistakes) {
        expect(mistake.title.trim()).not.toBe("");
        expect(mistake.explanation.trim()).not.toBe("");
        expect(mistake.fix.trim()).not.toBe("");
      }
      for (const question of theory.interviewQuestions) {
        expect(question.question.trim()).not.toBe("");
        expect(question.answer.trim()).not.toBe("");
        if (question.codeExample) {
          expect(question.codeExample.code.trim()).not.toBe("");
        }
      }
    }
  });

  it("links three to five related topics that exist and are not itself", () => {
    for (const topic of topics) {
      const ids = getTheoryContent(topic.id)!.relatedTopicIds;
      expect(ids.length).toBeGreaterThanOrEqual(3);
      expect(ids.length).toBeLessThanOrEqual(5);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).not.toContain(topic.id);
      for (const id of ids) {
        expect(isTopicId(id)).toBe(true);
      }
    }
  });

  it("keeps prose free of em dashes and emojis", () => {
    for (const topic of topics) {
      const serialized = JSON.stringify(getTheoryContent(topic.id));
      expect(serialized).not.toContain(EM_DASH);
      expect(serialized).not.toMatch(EMOJI);
    }
  });
});

describe("getTheoryTopicsByCategory", () => {
  it("matches the topic registry because every topic has theory", () => {
    for (const category of CATEGORY_ORDER) {
      expect(getTheoryTopicsByCategory(category)).toEqual(
        getTopicsByCategory(category),
      );
    }
  });
});

describe("getRelatedTopicsFromTheory", () => {
  it("resolves related ids to topics in authored order", () => {
    const theory = getTheoryContent("closures")!;
    const related = getRelatedTopicsFromTheory("closures");
    expect(related.map((topic) => topic.id)).toEqual(theory.relatedTopicIds);
    for (const topic of related) {
      expect(topic.route).toBe(`/${topic.category}/${topic.id}`);
    }
  });

  it("returns an empty list for unknown topics", () => {
    expect(getRelatedTopicsFromTheory("missing")).toEqual([]);
  });
});
