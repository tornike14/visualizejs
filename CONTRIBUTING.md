# Contributing to VisualizeJS

Thanks for wanting to help. This project explains JavaScript, React, framework, backend, and AI internals through animations, so contributions range from fixing a typo in a theory page to building a whole new topic.

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
npm run verify
```

Both must pass. CI runs the same two commands.

## Project Conventions

These are enforced in review. Most exist because inconsistency between 45 topics is more expensive than it looks.

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
- Topics with several examples use `useExampleTopic`, `VisualizationToolbar`, and `ExamplePicker`; do not hand-roll the toolbar or step pill.
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

Reconciliation is the reference implementation for topic structure. Event Loop is the reference for sandbox mode. Attention and HTTP Request Lifecycle show the newer shared primitives (HeatmapGrid, PipelineDiagram, MessageFlow).

## Adding a Topic

A topic is registered in several places. The registries are typed by `TopicId`, which is derived from `src/lib/topics.ts`, so once the topic is registered `npm run typecheck` names every place that still needs an entry.

**1. Topic registry** in [`src/lib/topics.ts`](src/lib/topics.ts)

Add an entry with `id`, `title`, `category`, `description`, `difficulty`, and `docsUrl`. The route is derived from category and id. The `id` is the slug used everywhere else, so pick it carefully. `category` must be one of the IDs in `src/lib/categories.ts` (see [`docs/categories.md`](docs/categories.md) to add a new category). Set `toolbar: "simple"` if the topic has no example picker, so the loading skeleton matches.

**2. Component registry** in [`src/components/visualizations/registry.tsx`](src/components/visualizations/registry.tsx)

Add one `dynamic()` entry keyed by the topic id. Routing is generated from the registries by `src/app/[category]/[topic]/page.tsx`; there is no per-topic page file.

**3. Visualization** at `src/components/visualizations/<topic-id>/`

Use `useExampleTopic`, `VisualizationToolbar`, `ExamplePicker`, and `SourceCodePanel` from the shared scaffold. Read [`docs/topic-authoring.md`](docs/topic-authoring.md), or [`docs/react-topic-authoring.md`](docs/react-topic-authoring.md) for React topics.

**4. Theory content** at `src/content/theory/<category>/<topic-id>.ts`

Implements `TopicTheoryContent`: `summary`, `whatItIs`, `howItWorks`, `commonMistakes`, `interviewQuestions`, and `relatedTopicIds`. See [`docs/theory-authoring.md`](docs/theory-authoring.md).

`relatedTopicIds` must hold 3 to 5 valid topic IDs and must not include the topic's own ID.

**5. Theory registry** in [`src/content/theory/index.ts`](src/content/theory/index.ts)

Add the import and the entry in `THEORY_CONTENT_BY_TOPIC_ID`. `VisualizationPageShell` reads this map to render the theory sections beneath the visualization.

**6. SEO metadata** in [`src/lib/metadata.ts`](src/lib/metadata.ts)

Add entries to both `TOPIC_KEYWORDS` (4 to 8 search phrases) and `TOPIC_THEORY_DESCRIPTIONS` (one or two sentences, under 160 characters).

**7. Inbound links**

Add your topic ID to the `relatedTopicIds` of 2 or more existing theory files. A topic nothing links to is a dead end for readers and for search engines. Keep each list within the 3 to 5 range when you do this, swapping out a weaker link if needed.

### Before You Open the PR

```bash
npm run verify
```

Then check that `/your-route` renders with the theory sections below the visualization, the sitemap at `/sitemap.xml` includes the route, and the related topic links at the bottom of the page resolve.

## Pull Requests

- Branch from `develop`, not `main`.
- One topic or one fix per pull request.
- Describe what changed and why. Screenshots or a screen recording help a lot for visualization changes.
- Say which registries you touched when adding a topic.

## Reporting Bugs

Include the topic, the browser, the step where it goes wrong, and what you expected instead. A screen recording is worth more than a paragraph of description.

## Questions

Open a [discussion](https://github.com/tornike14/visualizejs/discussions) or an issue. Asking before building saves everyone time.
