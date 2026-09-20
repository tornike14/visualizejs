import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  CATEGORY_LIST,
  CATEGORY_ORDER,
  categoryFromPathname,
  getCategory,
  isCategory,
} from "@/lib/categories";

const RGB_TRIPLET = /^\d{1,3} \d{1,3} \d{1,3}$/;

describe("category registry", () => {
  it("orders every registered category exactly once", () => {
    expect([...CATEGORY_ORDER].sort()).toEqual(Object.keys(CATEGORIES).sort());
    expect(new Set(CATEGORY_ORDER).size).toBe(CATEGORY_ORDER.length);
  });

  it("lists categories in display order", () => {
    expect(CATEGORY_LIST.map((category) => category.id)).toEqual(
      CATEGORY_ORDER,
    );
  });

  it("keys each config by its own id and routes to /<id>", () => {
    for (const [key, config] of Object.entries(CATEGORIES)) {
      expect(config.id).toBe(key);
      expect(config.route).toBe(`/${key}`);
    }
  });

  it("ships an icon for every category", () => {
    for (const config of CATEGORY_LIST) {
      expect(config.iconSrc).toBe(`/icons/${config.id}.svg`);
      expect(existsSync(resolve("public", config.iconSrc.slice(1)))).toBe(true);
      expect(config.iconAlt.trim().length).toBeGreaterThan(0);
    }
  });

  it("uses RGB triplets for glow and hero colours", () => {
    for (const config of CATEGORY_LIST) {
      expect(config.glowRgb).toMatch(RGB_TRIPLET);
      expect(config.hero.accent).toMatch(RGB_TRIPLET);
      expect(config.hero.accentSoft).toMatch(RGB_TRIPLET);
      expect(config.hero.secondary).toMatch(RGB_TRIPLET);
    }
  });

  it("fills in all copy and keyword fields", () => {
    for (const config of CATEGORY_LIST) {
      for (const field of [
        config.label,
        config.headingLabel,
        config.tagline,
        config.description,
        config.kicker,
        config.docsLabel,
        config.indexTitle,
      ]) {
        expect(field.trim().length).toBeGreaterThan(0);
        expect(field).not.toContain("—");
      }
      expect(config.keywords.length).toBeGreaterThan(0);
      expect(config.indexKeywords.length).toBeGreaterThan(0);
      expect(new Set(config.indexKeywords).size).toBe(
        config.indexKeywords.length,
      );
    }
  });
});

describe("getCategory", () => {
  it("returns the config for an id", () => {
    expect(getCategory("react")).toBe(CATEGORIES.react);
  });
});

describe("isCategory", () => {
  it("accepts registered ids only", () => {
    expect(isCategory("javascript")).toBe(true);
    expect(isCategory("ai")).toBe(true);
    expect(isCategory("JavaScript")).toBe(false);
    expect(isCategory("")).toBe(false);
    expect(isCategory("toString")).toBe(false);
  });
});

describe("categoryFromPathname", () => {
  it("reads the first path segment", () => {
    expect(categoryFromPathname("/react")).toBe("react");
    expect(categoryFromPathname("/backend/jwt-authentication")).toBe("backend");
  });

  it("falls back to javascript for unknown or empty paths", () => {
    expect(categoryFromPathname("/")).toBe("javascript");
    expect(categoryFromPathname("")).toBe("javascript");
    expect(categoryFromPathname("/about")).toBe("javascript");
    expect(categoryFromPathname("react")).toBe("javascript");
  });
});
