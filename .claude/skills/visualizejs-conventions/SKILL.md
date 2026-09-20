---
description: VisualizeJS project conventions, patterns, and key file locations for visualization topic development.
---

# VisualizeJS Conventions

Quick reference for project conventions and file locations. Read the full docs for detailed guidance.

## Key Files

- **Category registry:** `src/lib/categories.ts` (javascript, react, frameworks, backend, ai)
- **Topic registry:** `src/lib/topics.ts` (single source of truth; exports the `TopicId` union; routes derived from category and id)
- **Component registry:** `src/components/visualizations/registry.tsx` (`VISUALIZATIONS`, typed by `TopicId`)
- **Routes:** `src/app/[category]/[topic]/page.tsx` and `src/app/[category]/page.tsx` (generated from the registries, never add per-topic pages)
- **Theory registry:** `src/content/theory/index.ts` (typed by `TopicId`)
- **SEO metadata:** `src/lib/metadata.ts` (TOPIC_KEYWORDS, TOPIC_THEORY_DESCRIPTIONS, typed by `TopicId`)
- **Page shell:** `src/components/layout/VisualizationPageShell.tsx`
- **Topic scaffold:** `src/components/visualization-ui/VisualizationToolbar.tsx`, `SourceCodePanel.tsx`, `ExamplePicker.tsx`, `VisualizationLayout.tsx`
- **UI strings:** `src/lib/visualization/uiCopy.ts` (VISUALIZATION_PANEL_TITLES, VISUALIZATION_EMPTY_STATES)
- **Hooks:** `src/hooks/useExampleTopic.ts` (selector topics), `src/hooks/useStepPlayback.ts` (playback, shortcuts, progress), `src/hooks/useChangeFlash.ts`
- **Progress:** `src/lib/progress/topicProgress.ts`, `src/hooks/useTopicProgress.ts`
- **Search:** `src/components/search/CommandPalette.tsx`
- **Shared types:** `src/types/visualization.ts` (BaseStep, SourceExample, SourceLine), `src/content/theory/types.ts`

## Non-Negotiable Rules

1. No em dashes or AI-sounding language in user-facing content
2. No emojis in step descriptions or UI text
3. Use `VISUALIZATION_PANEL_TITLES` / `VISUALIZATION_EMPTY_STATES` from `uiCopy.ts` (never hardcode)
4. Selector topics use `useExampleTopic` + `VisualizationToolbar` + `ExamplePicker`; never hand-roll the toolbar or step pill
5. Source code renders through `SourceCodePanel`; it owns the `isDone && !isActive` fading guard
6. Topics without an example picker set `toolbar: "simple"` in `src/lib/topics.ts`
7. Theory `relatedTopicIds` must have 3-5 valid IDs (never empty)
8. Components use `"use client"` directive and named exports
9. React components use const arrow form; only Next.js `page.tsx`/`layout.tsx` use `export default function`
10. Component files target 200 lines, hard limit 300
11. State updaters stay pure: no setter calls inside `setState(prev => ...)`
12. Never branch on category IDs; read `CATEGORIES[topic.category]`
13. Run `npm run format`; CI checks Prettier

## Topic Patterns

- **Folder-based (every topic):** `src/components/visualizations/<topic-id>/` with `index.tsx`, `types.ts`, `helpers.ts`, `data.ts`, `components/`
- **Reference implementations:** Reconciliation (selector topic), Closures (no selector), Event Loop (sandbox), Reference vs Value (two selection axes), Attention and HTTP Request Lifecycle (PipelineDiagram, HeatmapGrid, MessageFlow)

## Full Documentation

- `docs/topic-authoring.md` -- topic creation workflow
- `docs/react-topic-authoring.md` -- React topic extensions
- `docs/component-reference.md` -- design system, components, hooks, animations
- `docs/theory-authoring.md` -- theory page authoring
- `docs/sandbox-authoring.md` -- sandbox mode guide
- `docs/architecture.md` -- frontend architecture rules
- `docs/categories.md` -- category registry
- `docs/seo.md` -- SEO implementation
