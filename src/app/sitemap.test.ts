import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { CATEGORY_LIST } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";
import { topics } from "@/lib/topics";

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  it("lists the home page first with top priority", () => {
    expect(entries[0]).toMatchObject({ url: SITE_URL, priority: 1 });
  });

  it("lists every category and every topic exactly once", () => {
    expect(entries).toHaveLength(1 + CATEGORY_LIST.length + topics.length);
    expect(new Set(urls).size).toBe(urls.length);
    for (const category of CATEGORY_LIST) {
      expect(urls).toContain(`${SITE_URL}${category.route}`);
    }
    for (const topic of topics) {
      expect(urls).toContain(`${SITE_URL}${topic.route}`);
    }
  });

  it("ranks categories above topics", () => {
    const priority = (url: string) =>
      entries.find((entry) => entry.url === url)?.priority;
    expect(priority(`${SITE_URL}${CATEGORY_LIST[0].route}`)).toBe(0.9);
    expect(priority(`${SITE_URL}${topics[0].route}`)).toBe(0.8);
  });

  it("does not stamp a build time on every entry", () => {
    for (const entry of entries) {
      expect(entry.lastModified).toBeUndefined();
    }
  });
});

describe("robots", () => {
  const result = robots();

  it("allows every crawler on the whole site", () => {
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) {
      expect(rule.allow).toBe("/");
      expect(rule.disallow).toBeUndefined();
    }
    expect(rules.map((rule) => rule.userAgent)).toContain("*");
  });

  it("points at the sitemap and host", () => {
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
    expect(result.host).toBe(new URL(SITE_URL).host);
  });
});
