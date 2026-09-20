import { describe, expect, it } from "vitest";
import {
  buildDifficultySearch,
  countByDifficulty,
  DIFFICULTY_ORDER,
  filterByDifficulty,
  isDifficulty,
  parseDifficultyParam,
} from "./difficulty";
import type { Topic } from "@/types";

const topic = (id: string, difficulty: Topic["difficulty"]): Topic => ({
  id,
  title: id,
  description: "",
  category: "javascript",
  difficulty,
  docsUrl: "https://example.com",
  route: `/javascript/${id}`,
});

const LIST = [
  topic("a", "beginner"),
  topic("b", "intermediate"),
  topic("c", "beginner"),
  topic("d", "advanced"),
];

describe("isDifficulty", () => {
  it("accepts every level in order and rejects anything else", () => {
    for (const level of DIFFICULTY_ORDER)
      expect(isDifficulty(level)).toBe(true);
    expect(isDifficulty("expert")).toBe(false);
    expect(isDifficulty("")).toBe(false);
    expect(isDifficulty(null)).toBe(false);
    expect(isDifficulty("toString")).toBe(false);
  });
});

describe("parseDifficultyParam", () => {
  it("reads a valid level from a query string", () => {
    expect(parseDifficultyParam("?level=advanced")).toBe("advanced");
    expect(parseDifficultyParam("?foo=1&level=beginner")).toBe("beginner");
  });

  it("returns null for a missing, empty, or unknown level", () => {
    expect(parseDifficultyParam("")).toBeNull();
    expect(parseDifficultyParam("?level=")).toBeNull();
    expect(parseDifficultyParam("?level=hard")).toBeNull();
    expect(parseDifficultyParam("?other=beginner")).toBeNull();
  });
});

describe("buildDifficultySearch", () => {
  it("round-trips with the parser", () => {
    for (const level of DIFFICULTY_ORDER) {
      expect(parseDifficultyParam(buildDifficultySearch(level))).toBe(level);
    }
    expect(buildDifficultySearch(null)).toBe("");
  });
});

describe("countByDifficulty", () => {
  it("counts every level, including levels with no topics", () => {
    expect(countByDifficulty(LIST)).toEqual({
      beginner: 2,
      intermediate: 1,
      advanced: 1,
    });
    expect(countByDifficulty([])).toEqual({
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    });
  });
});

describe("filterByDifficulty", () => {
  it("keeps only the requested level in the original order", () => {
    expect(filterByDifficulty(LIST, "beginner").map((t) => t.id)).toEqual([
      "a",
      "c",
    ]);
    expect(filterByDifficulty(LIST, "advanced").map((t) => t.id)).toEqual([
      "d",
    ]);
  });

  it("returns the same list when no level is selected", () => {
    expect(filterByDifficulty(LIST, null)).toBe(LIST);
  });
});
