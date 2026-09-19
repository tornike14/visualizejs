import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  auditExample,
  flattenExamples,
  type AuditExample,
  type TopicDataModule,
} from "../../../scripts/lib/stepAudit";
import { CATEGORIES } from "@/lib/categories";
import { topics } from "@/lib/topics";
import { VISUALIZATION_PANEL_TITLES } from "@/lib/visualization/uiCopy";

/**
 * Guards the authoring conventions from CLAUDE.md across every topic: the
 * folder shape, the client directive, step data shape, plain-language copy
 * for AI topics, and the ban on em dashes and emojis in reader-facing text.
 */

const VISUALIZATIONS_ROOT = resolve(
  process.cwd(),
  "src/components/visualizations",
);
const COMPONENTS_ROOT = resolve(process.cwd(), "src/components");
const EM_DASH = "—";
const EMOJI = /\p{Extended_Pictographic}/u;
const HARD_LINE_LIMIT = 300;

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Matches any shared panel title written as a string literal. */
const PANEL_TITLE_LITERAL = new RegExp(
  `["'](${Object.values(VISUALIZATION_PANEL_TITLES).map(escapeRegExp).join("|")})["']`,
);

/** Lines in a file, not counting the trailing newline Prettier adds. */
const countLines = (content: string) =>
  content.split("\n").length - (content.endsWith("\n") ? 1 : 0);

/**
 * Topics whose examples are not driven by numbered source lines. They still
 * carry steps with descriptions, but there is no code panel to audit.
 */
const NON_SOURCE_TOPICS = new Set(["hoisting"]);

interface StepLike {
  descriptionHtml: string;
  simpleHtml?: string;
  activeLine: number | null;
  doneLines: number[];
}

const topicDirs = readdirSync(VISUALIZATIONS_ROOT).filter((entry) =>
  statSync(join(VISUALIZATIONS_ROOT, entry)).isDirectory(),
);

const loadModule = async (topicId: string): Promise<TopicDataModule> => {
  const file = join(VISUALIZATIONS_ROOT, topicId, "data.ts");
  return (await import(/* @vite-ignore */ file)) as TopicDataModule;
};

const loadExamples = async (topicId: string): Promise<AuditExample[]> =>
  flattenExamples(await loadModule(topicId));

/** Steps grouped by example id, whether or not the example has source lines. */
const loadSteps = async (
  topicId: string,
): Promise<{ id: string; steps: StepLike[] }[]> => {
  const mod = await loadModule(topicId);
  if (mod.STEPS) return [{ id: "default", steps: mod.STEPS }];
  return (mod.EXAMPLES ?? []).flatMap((example) => {
    if (example.variants) {
      return example.variants.map((variant) => ({
        id: `${example.id}/${variant.methodId}`,
        steps: variant.steps as StepLike[],
      }));
    }
    const steps = (example as { steps?: StepLike[] }).steps;
    return steps ? [{ id: example.id, steps }] : [];
  });
};

const listFiles = (dir: string, matcher: RegExp): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return listFiles(full, matcher);
    return matcher.test(entry) ? [full] : [];
  });

describe("topic folders", () => {
  it("exist for every registered topic with the required files", () => {
    for (const topic of topics) {
      const dir = join(VISUALIZATIONS_ROOT, topic.id);
      for (const file of ["index.tsx", "data.ts", "types.ts"]) {
        expect(existsSync(join(dir, file)), `${topic.id}/${file}`).toBe(true);
      }
    }
  });

  it("have no orphan folders without a registry entry", () => {
    const ids = new Set(topics.map((topic) => topic.id));
    for (const dir of topicDirs) {
      expect(ids.has(dir), `orphan folder ${dir}`).toBe(true);
    }
  });

  it("declare the client directive and use named exports", () => {
    for (const topic of topics) {
      const source = readFileSync(
        join(VISUALIZATIONS_ROOT, topic.id, "index.tsx"),
        "utf8",
      );
      expect(source.startsWith('"use client"'), topic.id).toBe(true);
      expect(source, topic.id).not.toMatch(/export default/);
    }
  });
});

describe("component file size", () => {
  it(`keeps every component file at or under ${HARD_LINE_LIMIT} lines`, () => {
    const oversized = listFiles(COMPONENTS_ROOT, /\.tsx$/)
      .filter((file) => !file.endsWith(".test.tsx"))
      .map((file) => ({
        file: file.slice(COMPONENTS_ROOT.length + 1),
        lines: countLines(readFileSync(file, "utf8")),
      }))
      .filter((entry) => entry.lines > HARD_LINE_LIMIT);
    expect(oversized).toEqual([]);
  });
});

describe("panel titles", () => {
  it("come from uiCopy rather than string literals", () => {
    const offenders = listFiles(VISUALIZATIONS_ROOT, /\.tsx?$/)
      .filter((file) => !/\.test\.tsx?$/.test(file))
      .filter((file) => PANEL_TITLE_LITERAL.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });
});

describe.each(topics.map((topic) => [topic.id, topic.category] as const))(
  "step data for %s",
  (topicId, category) => {
    it("has at least one example with steps", async () => {
      const groups = await loadSteps(topicId);
      expect(groups.length).toBeGreaterThan(0);
      const ids = groups.map((group) => group.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const group of groups) {
        expect(group.steps.length, group.id).toBeGreaterThan(0);
      }
    });

    it("either drives a source panel or is listed as a non-source topic", async () => {
      const examples = await loadExamples(topicId);
      expect(examples.length > 0).toBe(!NON_SOURCE_TOPICS.has(topicId));
    });

    it("numbers code lines consecutively from 1", async () => {
      const examples = await loadExamples(topicId);
      const ids = examples.map((example) => example.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const example of examples) {
        expect(example.steps.length, example.id).toBeGreaterThan(0);
        expect(example.codeLines.length, example.id).toBeGreaterThan(0);
        example.codeLines.forEach((line, index) => {
          expect(line.num, `${example.id} line ${index}`).toBe(index + 1);
          expect(typeof line.text).toBe("string");
        });
      }
    });

    it("shapes every source-driven step like BaseStep", async () => {
      for (const example of await loadExamples(topicId)) {
        example.steps.forEach((step: StepLike, index) => {
          const tag = `${example.id} #${index + 1}`;
          expect(typeof step.descriptionHtml, tag).toBe("string");
          expect(step.descriptionHtml.trim().length, tag).toBeGreaterThan(0);
          expect(
            step.activeLine === null || Number.isInteger(step.activeLine),
            tag,
          ).toBe(true);
          expect(Array.isArray(step.doneLines), tag).toBe(true);
          expect(new Set(step.doneLines).size, tag).toBe(step.doneLines.length);
          for (const line of step.doneLines) {
            expect(Number.isInteger(line), tag).toBe(true);
          }
        });
      }
    });

    it("passes the step audit without errors", async () => {
      for (const example of await loadExamples(topicId)) {
        expect(auditExample(example).errors).toEqual([]);
      }
    });

    it("keeps step copy free of em dashes and emojis", async () => {
      for (const example of await loadSteps(topicId)) {
        example.steps.forEach((step, index) => {
          const tag = `${example.id} #${index + 1}`;
          const copy = JSON.stringify(step);
          expect(copy, tag).not.toContain(EM_DASH);
          expect(copy, tag).not.toMatch(EMOJI);
        });
      }
    });

    if (category === "ai") {
      it("carries a plain-language simpleHtml on every step", async () => {
        for (const example of await loadSteps(topicId)) {
          example.steps.forEach((step, index) => {
            const tag = `${example.id} #${index + 1}`;
            expect(typeof step.simpleHtml, tag).toBe("string");
            expect(step.simpleHtml?.trim().length, tag).toBeGreaterThan(0);
          });
        }
      });
    }

    it("belongs to a registered category", () => {
      expect(CATEGORIES[category]).toBeDefined();
    });
  },
);
