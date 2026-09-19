# VisualizeJS

Interactive visualizations of JavaScript, React, framework (Vue, Svelte, Angular), backend, and AI internals. Next.js 16, React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui.

## Build Commands

- `npm run dev` -- dev server (webpack mode)
- `npm run build` -- production build (webpack mode)
- `npm run lint` -- ESLint
- `npm run typecheck` -- TypeScript (also validates every topic registry)
- `npm run format` / `npm run format:check` -- Prettier
- `npm run audit:steps` -- checks every step's activeLine and doneLines against its code (`-- <topic>` to narrow, `-- --strict` for extra hints)
- `npm run verify` -- lint, typecheck, format check, step audit, build (what CI runs)
- `npm run start` -- serve production build

## Project Structure

- `src/lib/categories.ts` -- category registry (labels, routes, colours, SEO). Never branch on category IDs in components
- `src/lib/topics.ts` -- topic registry and the `TopicId` union derived from it. Routes are derived from category and id
- `src/components/visualizations/registry.tsx` -- `VISUALIZATIONS`, lazy component per topic, typed by `TopicId`
- `src/app/[category]/[topic]/page.tsx` -- the one topic route; `src/app/[category]/page.tsx` -- category index
- `src/content/theory/index.ts` -- theory content registry, typed by `TopicId`
- `src/lib/metadata.ts` -- SEO metadata factory, keyword maps, theory descriptions, typed by `TopicId`
- `src/components/layout/VisualizationPageShell.tsx` -- page shell (header, toolbar slot, theory, pager)
- `src/components/visualization-ui/` -- shared viz primitives (VisualizationToolbar, SourceCodePanel, ExamplePicker, ExplanationToggle, FlowConnector, VisualizationLayout, NeonPanel, CodeBlock, TransportControls, ComponentTreeDiagram, PipelineDiagram, TokenChips, HeatmapGrid, MetricBars, MessageFlow)
- `src/hooks/useExampleTopic.ts` -- example selection + playback + current step for selector topics
- `src/hooks/useStepPlayback.ts` -- playback engine (keyboard shortcuts, marks topic progress)
- `src/hooks/useChangeFlash.ts` -- panel change detection
- `src/lib/progress/topicProgress.ts` -- localStorage completion tracking
- `src/components/search/CommandPalette.tsx` -- Cmd+K topic search
- `src/lib/visualization/uiCopy.ts` -- shared UI strings (VISUALIZATION_PANEL_TITLES, VISUALIZATION_EMPTY_STATES)
- `src/lib/sandbox/` -- sandbox mode infrastructure; `src/components/sandbox/` -- sandbox UI
- `src/types/visualization.ts` -- BaseStep, SourceExample, SourceLine, tree types
- `src/content/theory/types.ts` -- TopicTheoryContent interface

## Non-Negotiable Conventions

- No em dashes or AI-sounding language in user-facing content
- No emojis in step descriptions or UI text
- Use `VISUALIZATION_PANEL_TITLES` and `VISUALIZATION_EMPTY_STATES` from `uiCopy.ts` (never hardcode panel titles)
- Selector topics use `useExampleTopic(EXAMPLES)` and render `VisualizationToolbar` with an `ExamplePicker` in `leading`; do not hand-roll the toolbar, step pill, or source panel
- Source code goes through `SourceCodePanel` (it owns the `isDone && !isActive` fading guard)
- Topics without an example picker set `toolbar: "simple"` in `src/lib/topics.ts`; topics listed under a sub-heading set `group`
- AI topics carry `simpleHtml` on every step (plain-language version); keep it in sync when editing `descriptionHtml`
- Every topic needs an entry in `VISUALIZATIONS`, `THEORY_CONTENT_BY_TOPIC_ID`, `TOPIC_KEYWORDS`, and `TOPIC_THEORY_DESCRIPTIONS`; `npm run typecheck` fails otherwise
- Theory `relatedTopicIds` must be populated (3-5 IDs, never empty)
- React components use const arrow form (`const Component = () =>`); Next.js `page.tsx` and `layout.tsx` keep `export default function`
- State updaters stay pure: never call another setter inside a `setState(prev => ...)` callback
- Component files target 200 lines or fewer, hard limit at 300
- Visualization components use `"use client"` directive and named exports
- Run `npm run format` before finishing; CI checks formatting

## Topic Patterns

- **Folder-based:** `src/components/visualizations/<topic-id>/` with `index.tsx`, `types.ts`, `helpers.ts`, `data.ts`, `components/`. Every topic uses this shape
- **Step type:** topic step interfaces extend `BaseStep` from `src/types/visualization.ts`
- **Reference implementations:** Reconciliation (selector topic), Closures (no selector), Event Loop (sandbox), Reference vs Value (two selection axes), Attention and HTTP Request Lifecycle (newer primitives)
- **Categories:** javascript, react, frameworks, backend, ai. Theory lives in `src/content/theory/<category>/`; routes are generated from the registry

## Documentation

- `docs/topic-authoring.md` -- JS topic creation workflow
- `docs/react-topic-authoring.md` -- React topic extensions
- `docs/component-reference.md` -- design system, reusable components, hooks, animations
- `docs/theory-authoring.md` -- theory page authoring
- `docs/sandbox-authoring.md` -- sandbox mode guide
- `docs/architecture.md` -- frontend architecture rules
- `docs/categories.md` -- category registry and how to add a category
- `docs/seo.md` -- SEO implementation
