#!/usr/bin/env node
/**
 * Verifies that every topic is registered everywhere it needs to be.
 *
 * Adding a topic touches eight places. Missing one produces a page that half
 * works: a route with no theory link, a theory page absent from the sitemap, a
 * loading skeleton of the wrong shape. TypeScript cannot catch these because
 * every registry is independently valid on its own.
 *
 * Run with: node scripts/check-registries.mjs
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const problems = [];
const fail = (message) => problems.push(message);

const read = (path) => readFileSync(path, "utf8");
const exists = (path) => existsSync(path);

/* ── Parse the topic registry ── */

const topicsSource = read("src/lib/topics.ts");
const topics = [
  ...topicsSource.matchAll(
    /id: "([^"]+)",\s*\n\s*title: "([^"]+)",\s*\n\s*category: "([^"]+)",\s*\n\s*route: "([^"]+)"/g,
  ),
].map(([, id, title, category, route]) => ({ id, title, category, route }));

if (topics.length === 0) {
  fail("Could not parse any topics from src/lib/topics.ts");
  report();
}

const topicIds = new Set(topics.map((t) => t.id));

/* ── Read the registries that reference topics ── */

const theoryIndex = read("src/content/theory/index.ts");
const metadata = read("src/lib/metadata.ts");
const pageShell = read("src/components/layout/VisualizationPageShell.tsx");

const mapKeys = (source, mapName) => {
  const block = source.match(
    new RegExp(`${mapName}[^=]*=\\s*\\{([\\s\\S]*?)\\n\\};`),
  );
  if (!block) {
    fail(`Could not locate ${mapName}`);
    return new Set();
  }
  return new Set(
    [...block[1].matchAll(/^\s{2}"?([a-z0-9-]+)"?:/gm)].map((m) => m[1]),
  );
};

const theoryRegistry = mapKeys(theoryIndex, "THEORY_CONTENT_BY_TOPIC_ID");
const keywordRegistry = mapKeys(metadata, "TOPIC_KEYWORDS");
const descriptionRegistry = mapKeys(metadata, "TOPIC_THEORY_DESCRIPTIONS");

const selectorBlock = pageShell.match(
  /SELECTOR_TOOLBAR_TOPIC_IDS = new Set\(\[([\s\S]*?)\]\)/,
);
const selectorRegistry = new Set(
  selectorBlock
    ? [...selectorBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
    : [],
);
if (!selectorBlock) fail("Could not locate SELECTOR_TOOLBAR_TOPIC_IDS");

/* ── Per-topic checks ── */

const inbound = new Map(topics.map((t) => [t.id, 0]));

for (const topic of topics) {
  const { id, category, route } = topic;

  const routeFile = `src/app${route}/page.tsx`;
  if (!exists(routeFile)) fail(`${id}: missing route at ${routeFile}`);

  const componentDir = `src/components/visualizations/${id}`;
  if (!exists(componentDir))
    fail(`${id}: missing visualization at ${componentDir}/`);

  const theoryFile = `src/content/theory/${category}/${id}.ts`;
  if (!exists(theoryFile)) {
    fail(`${id}: missing theory content at ${theoryFile}`);
    continue;
  }

  if (!theoryRegistry.has(id))
    fail(`${id}: not registered in THEORY_CONTENT_BY_TOPIC_ID (absent from sitemap)`);
  if (!keywordRegistry.has(id)) fail(`${id}: missing from TOPIC_KEYWORDS`);
  if (!descriptionRegistry.has(id))
    fail(`${id}: missing from TOPIC_THEORY_DESCRIPTIONS`);

  // ExampleSelector topics need a matching toolbar skeleton variant.
  const usesSelector = readdirSync(componentDir, { recursive: true })
    .filter((f) => typeof f === "string" && /\.tsx?$/.test(f))
    .some((f) => read(join(componentDir, f)).includes("ExampleSelector"));

  if (usesSelector && !selectorRegistry.has(id))
    fail(`${id}: uses ExampleSelector but is absent from SELECTOR_TOOLBAR_TOPIC_IDS`);
  if (!usesSelector && selectorRegistry.has(id))
    fail(`${id}: listed in SELECTOR_TOOLBAR_TOPIC_IDS but has no ExampleSelector`);

  // Related topics: 3 to 5 valid IDs, no self-reference, no duplicates.
  const theorySource = read(theoryFile);
  const relatedBlock = theorySource.match(/relatedTopicIds:\s*\[([^\]]*)\]/);
  if (!relatedBlock) {
    fail(`${id}: theory content has no relatedTopicIds`);
    continue;
  }

  const related = [...relatedBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

  if (related.length < 3 || related.length > 5)
    fail(`${id}: relatedTopicIds has ${related.length} entries, expected 3 to 5`);
  if (related.includes(id)) fail(`${id}: relatedTopicIds references itself`);
  if (new Set(related).size !== related.length)
    fail(`${id}: relatedTopicIds contains duplicates`);

  for (const ref of related) {
    if (!topicIds.has(ref)) {
      fail(`${id}: relatedTopicIds references unknown topic "${ref}"`);
      continue;
    }
    inbound.set(ref, inbound.get(ref) + 1);
  }
}

/* ── Whole-graph checks ── */

for (const [id, count] of inbound) {
  if (count === 0)
    fail(`${id}: no theory page links to it, leaving it orphaned for readers and search`);
}

for (const id of theoryRegistry) {
  if (!topicIds.has(id))
    fail(`THEORY_CONTENT_BY_TOPIC_ID has "${id}", which is not a registered topic`);
}

/* ── Content conventions ── */

const contentFiles = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (/\.tsx?$/.test(entry.name)) contentFiles.push(path);
  }
};
walk("src/content");
walk("src/components/visualizations");

for (const file of contentFiles) {
  if (read(file).includes("—"))
    fail(`${file}: contains an em dash, which is not allowed in user-facing content`);
}

/* ── Report ── */

function report() {
  if (problems.length > 0) {
    console.error(`\nRegistry check failed with ${problems.length} problem(s):\n`);
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error("");
    process.exit(1);
  }

  console.log(
    `Registry check passed. ${topics.length} topics fully registered across all eight registries.`,
  );
}

report();
