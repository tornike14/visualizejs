# Contributing to VisualizeJS

Thanks for wanting to help. This project explains JavaScript and React internals through animations, so contributions range from fixing a typo in a theory page to building a whole new topic.

## Ways to Contribute

- **Report a bug.** Open an issue with the topic, the step number, and what you expected.
- **Correct the content.** If a theory page states something inaccurate, that matters more than any feature. Cite a spec or the React docs where you can.
- **Improve an existing visualization.** Clearer steps, better labels, missing edge cases.
- **Add a topic.** The largest kind of contribution. Read the section below before starting.

For anything beyond a small fix, open an issue first so we can agree on the approach before you spend time on it.

## Setup

```bash
npm install
npm run dev
```

Node 20 or newer. Before opening a pull request:

```bash
npm run lint
npm run build
```

Both must pass. CI runs the same two commands.

## Project Conventions

These are enforced in review. Most exist because inconsistency between 28 topics is more expensive than it looks.

**Content**

- No em dashes anywhere in user-facing text.
- No emojis in step descriptions or UI text.
- Write plainly. Avoid marketing language and filler such as "powerful", "seamless", or "it's worth noting".
- Explain the mechanism. "React marks the fiber for work" beats "React handles it efficiently".

**Code**

- React components use const form (`const Component = () =>`), not function declarations.
- Visualization components need the `"use client"` directive and named exports.
- Component files target 200 lines, hard limit 300. Split into `components/` when you exceed it. Data files (`data.ts`) are exempt since they hold content.
- Import panel titles and empty states from `src/lib/visualization/uiCopy.ts`. Never hardcode them.
- Wrap `setActiveExampleId` in a `handleExampleChange` callback rather than passing the setter to `onSelect` directly.
- Code line fading uses the guard `isDone && !isActive`. Never fade an active line.

**Structure**

Topics use a folder under `src/components/visualizations/<topic-id>/`:

```
index.tsx        Main component, wires playback and layout
types.ts         Topic-specific types
data.ts          Examples and step definitions
helpers.ts       Pure functions used by the panels
components/      Panel components
```

Reconciliation is the reference implementation for React topics. Event Loop is the reference for sandbox mode.

## Adding a Topic

A topic is not finished when the visualization renders. It is registered in several places, and missing one produces a page that half works. Work through all of these.

**1. Topic registry** in [`src/lib/topics.ts`](src/lib/topics.ts)

Add an entry with `id`, `title`, `category`, `route`, `description`, `difficulty`, and `docsUrl`. The `id` is the slug used everywhere else, so pick it carefully.

**2. Route** at `src/app/<category>/<topic-id>/page.tsx`

Copy an existing page. It resolves the topic with `getTopicOrThrow`, lazy-loads the visualization with `next/dynamic`, wraps it in `ErrorBoundary` and `VisualizationPageShell`, and exports `createTopicMetadata(topic)`.

**3. Visualization** at `src/components/visualizations/<topic-id>/`

Use `useStepPlayback` from `src/hooks/useStepPlayback.ts` for transport controls. Read [`docs/topic-authoring.md`](docs/topic-authoring.md), or [`docs/react-topic-authoring.md`](docs/react-topic-authoring.md) for React topics.

**4. Theory content** at `src/content/theory/<category>/<topic-id>.ts`

Implements `TopicTheoryContent`: `summary`, `whatItIs`, `howItWorks`, `commonMistakes`, `interviewQuestions`, and `relatedTopicIds`. See [`docs/theory-authoring.md`](docs/theory-authoring.md).

`relatedTopicIds` must hold 3 to 5 valid topic IDs and must not include the topic's own ID.

**5. Theory registry** in [`src/content/theory/index.ts`](src/content/theory/index.ts)

Add the import and the entry in `THEORY_CONTENT_BY_TOPIC_ID`. The sitemap derives from this map, so a topic missing here will not be indexed.

**6. SEO metadata** in [`src/lib/metadata.ts`](src/lib/metadata.ts)

Add entries to both `TOPIC_KEYWORDS` (4 to 8 search phrases) and `TOPIC_THEORY_DESCRIPTIONS` (one or two sentences, under 160 characters).

**7. Toolbar registry** in [`src/components/layout/VisualizationPageShell.tsx`](src/components/layout/VisualizationPageShell.tsx)

If your topic uses `ExampleSelector`, add its ID to `SELECTOR_TOOLBAR_TOPIC_IDS`. Skipping this makes the loading skeleton the wrong shape.

**8. Inbound links**

Add your topic ID to the `relatedTopicIds` of 2 or more existing theory files. A topic nothing links to is a dead end for readers and for search engines. Keep each list within the 3 to 5 range when you do this, swapping out a weaker link if needed.

### Before You Open the PR

```bash
npm run lint
npm run build
```

Then check that `/your-route` and `/your-route/theory` both render, the sitemap at `/sitemap.xml` includes both, and the related topic links at the bottom of the theory page resolve.

## Pull Requests

- Branch from `develop`, not `main`.
- One topic or one fix per pull request.
- Describe what changed and why. Screenshots or a screen recording help a lot for visualization changes.
- Say which registries you touched when adding a topic.

## Reporting Bugs

Include the topic, the browser, the step where it goes wrong, and what you expected instead. A screen recording is worth more than a paragraph of description.

## Questions

Open a [discussion](https://github.com/tornike14/visualizejs/discussions) or an issue. Asking before building saves everyone time.
