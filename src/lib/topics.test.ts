import { describe, expect, it } from "vitest";
import { CATEGORIES, CATEGORY_ORDER } from "@/lib/categories";
import {
  getAdjacentTopics,
  getTopicById,
  getTopicsByCategory,
  groupTopics,
  isTopicId,
  topics,
} from "@/lib/topics";
import type { Topic } from "@/types";

const makeTopic = (id: string, group?: string): Topic => ({
  id,
  title: id,
  category: "frameworks",
  description: `${id} description.`,
  difficulty: "beginner",
  docsUrl: "https://example.com",
  route: `/frameworks/${id}`,
  ...(group ? { group } : {}),
});

describe("topic registry", () => {
  it("has at least one topic", () => {
    expect(topics.length).toBeGreaterThan(0);
  });

  it("uses unique kebab-case ids", () => {
    const ids = topics.map((topic) => topic.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("derives every route from the category and id", () => {
    for (const topic of topics) {
      expect(topic.route).toBe(`/${topic.category}/${topic.id}`);
    }
  });

  it("only uses registered categories, and every category has topics", () => {
    for (const topic of topics) {
      expect(CATEGORY_ORDER).toContain(topic.category);
    }
    for (const category of CATEGORY_ORDER) {
      expect(getTopicsByCategory(category).length).toBeGreaterThan(0);
    }
  });

  it("gives every topic a title, description, difficulty, and docs link", () => {
    for (const topic of topics) {
      expect(topic.title.trim().length).toBeGreaterThan(0);
      expect(topic.description.trim().length).toBeGreaterThan(40);
      expect(topic.description.trim().endsWith(".")).toBe(true);
      expect(["beginner", "intermediate", "advanced"]).toContain(
        topic.difficulty,
      );
      expect(() => new URL(topic.docsUrl)).not.toThrow();
      expect(topic.docsUrl.startsWith("https://")).toBe(true);
    }
  });

  it("keeps user-facing copy free of em dashes and emojis", () => {
    for (const topic of topics) {
      const copy = `${topic.title} ${topic.description} ${topic.group ?? ""}`;
      expect(copy).not.toContain("—");
      expect(copy).not.toMatch(/\p{Extended_Pictographic}/u);
    }
  });

  it("only sets toolbar and group to known values", () => {
    for (const topic of topics) {
      if (topic.toolbar !== undefined) {
        expect(["selector", "simple"]).toContain(topic.toolbar);
      }
      if (topic.group !== undefined) {
        expect(topic.group.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("isTopicId", () => {
  it("accepts registered ids and rejects everything else", () => {
    expect(isTopicId("event-loop")).toBe(true);
    expect(isTopicId("closures")).toBe(true);
    expect(isTopicId("Event-Loop")).toBe(false);
    expect(isTopicId("")).toBe(false);
    expect(isTopicId("not-a-topic")).toBe(false);
  });
});

describe("getTopicById", () => {
  it("returns the registry entry with its derived route", () => {
    const topic = getTopicById("closures");
    expect(topic?.category).toBe("javascript");
    expect(topic?.route).toBe("/javascript/closures");
  });

  it("returns undefined for unknown ids", () => {
    expect(getTopicById("missing")).toBeUndefined();
  });
});

describe("getTopicsByCategory", () => {
  it("preserves registry order within a category", () => {
    for (const category of CATEGORY_ORDER) {
      const expected = topics.filter((topic) => topic.category === category);
      expect(getTopicsByCategory(category)).toEqual(expected);
    }
  });

  it("covers every topic exactly once across all categories", () => {
    const seen = CATEGORY_ORDER.flatMap((category) =>
      getTopicsByCategory(category).map((topic) => topic.id),
    );
    expect(seen.sort()).toEqual(topics.map((topic) => topic.id).sort());
  });
});

describe("groupTopics", () => {
  it("returns a single null-labelled group when nothing is grouped", () => {
    const list = [makeTopic("a"), makeTopic("b")];
    expect(groupTopics(list)).toEqual([{ label: null, topics: list }]);
  });

  it("returns an empty list for no topics", () => {
    expect(groupTopics([])).toEqual([]);
  });

  it("puts ungrouped topics first, then groups in first-appearance order", () => {
    const vue1 = makeTopic("vue-1", "Vue");
    const svelte = makeTopic("svelte-1", "Svelte");
    const flat = makeTopic("flat");
    const vue2 = makeTopic("vue-2", "Vue");

    expect(groupTopics([vue1, svelte, flat, vue2])).toEqual([
      { label: null, topics: [flat] },
      { label: "Vue", topics: [vue1, vue2] },
      { label: "Svelte", topics: [svelte] },
    ]);
  });

  it("groups the frameworks category by framework", () => {
    const groups = groupTopics(getTopicsByCategory("frameworks"));
    const labels = groups.map((group) => group.label);
    expect(labels).toEqual(["Vue", "Svelte", "Angular"]);
    for (const group of groups) {
      expect(group.topics.length).toBeGreaterThan(0);
    }
  });
});

describe("getAdjacentTopics", () => {
  it("has no previous topic for the first topic in a category", () => {
    const [first, second] = getTopicsByCategory("javascript");
    expect(getAdjacentTopics(first.id)).toEqual({
      previous: null,
      next: second,
    });
  });

  it("has no next topic for the last topic in a category", () => {
    const list = getTopicsByCategory("ai");
    const last = list[list.length - 1];
    expect(getAdjacentTopics(last.id)).toEqual({
      previous: list[list.length - 2],
      next: null,
    });
  });

  it("returns both neighbours for a topic in the middle", () => {
    const list = getTopicsByCategory("react");
    const { previous, next } = getAdjacentTopics(list[1].id);
    expect(previous).toBe(list[0]);
    expect(next).toBe(list[2]);
  });

  it("never crosses into another category", () => {
    for (const topic of topics) {
      const { previous, next } = getAdjacentTopics(topic.id);
      if (previous) expect(previous.category).toBe(topic.category);
      if (next) expect(next.category).toBe(topic.category);
    }
  });

  it("returns nulls for an unknown topic", () => {
    expect(getAdjacentTopics("missing")).toEqual({
      previous: null,
      next: null,
    });
  });

  it("walks a whole category by following next links", () => {
    for (const category of CATEGORY_ORDER) {
      const list = getTopicsByCategory(category);
      const walked: string[] = [];
      let current: Topic | null = list[0];
      while (current) {
        walked.push(current.id);
        current = getAdjacentTopics(current.id).next;
      }
      expect(walked).toEqual(list.map((topic) => topic.id));
      expect(CATEGORIES[category]).toBeDefined();
    }
  });
});
