import { describe, expect, it } from "vitest";
import {
  chainHighlightClass,
  chainLabelClass,
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";

describe("createKindBadgeClass", () => {
  it("looks up the class for a kind", () => {
    const badge = createKindBadgeClass<"lookup" | "block">({
      lookup: "violet",
      block: "cyan",
    });
    expect(badge("lookup")).toBe("violet");
    expect(badge("block")).toBe("cyan");
  });
});

describe("createKindLabel", () => {
  it("looks up the label for a kind", () => {
    const label = createKindLabel<"a" | "b">({ a: "Alpha", b: "Beta" });
    expect(label("b")).toBe("Beta");
  });
});

describe("chain highlight helpers", () => {
  it("returns a distinct class per highlight state", () => {
    const states = ["active", "searching", "found", "none", undefined] as const;
    const boxes = states.map((state) => chainHighlightClass(state));
    const labels = states.map((state) => chainLabelClass(state));
    expect(new Set(boxes.slice(0, 3)).size).toBe(3);
    expect(new Set(labels.slice(0, 3)).size).toBe(3);
  });

  it("treats none and undefined the same", () => {
    expect(chainHighlightClass("none")).toBe(chainHighlightClass(undefined));
    expect(chainLabelClass("none")).toBe(chainLabelClass(undefined));
  });

  it("colours states consistently between box and label", () => {
    expect(chainHighlightClass("active")).toContain("amber");
    expect(chainLabelClass("active")).toContain("amber");
    expect(chainHighlightClass("searching")).toContain("violet");
    expect(chainLabelClass("searching")).toContain("violet");
    expect(chainHighlightClass("found")).toContain("emerald");
    expect(chainLabelClass("found")).toContain("emerald");
  });
});
