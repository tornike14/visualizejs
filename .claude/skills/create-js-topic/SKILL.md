---
description: Create a new visualization topic in any category (JavaScript, Frameworks, Backend, AI), scaffold all required files, register in topic and theory registries, and verify the build passes.
---

# Create Topic

Scaffold a new visualization topic end-to-end for any non-React category (for React use `create-react-topic`). This skill handles the full multi-file workflow from topic registration to build verification.

## When to Use

When the user asks to create, add, or build a new topic or visualization in the javascript, frameworks, backend, or ai category.

## Workflow

1. **Gather inputs** from the user:
   - Category (`javascript`, `frameworks`, `backend`, or `ai`; see `src/lib/categories.ts`)
   - Topic ID (kebab-case, e.g., `async-await`)
   - Title (display name, e.g., "Async/Await")
   - Difficulty (`beginner`, `intermediate`, or `advanced`)
   - `docsUrl` (MDN or authoritative reference URL)
   - Description (1-2 sentences for SEO and landing page cards)
   - Whether it uses ExampleSelector (multiple sub-examples)

2. **Register the topic** in `src/lib/topics.ts`. Add to `TOPIC_DEFINITIONS` following the existing order convention. The route is derived; set `toolbar: "simple"` only if the topic has no example picker. Once registered, `npm run typecheck` reports every registry that still lacks an entry.

3. **Add SEO keywords** in `src/lib/metadata.ts` under `TOPIC_KEYWORDS`. Add 4-7 relevant search terms.

4. **Register the component** in `VISUALIZATIONS` in `src/components/visualizations/registry.tsx` (one `dynamic()` entry keyed by topic id). Routing is generated from the registry.

5. **Scaffold the visualization folder** at `src/components/visualizations/<topic-id>/` with `index.tsx`, `types.ts`, `helpers.ts`, `data.ts`, `components/`.
   - Read `docs/topic-authoring.md` for the full skeleton template.
   - Read `docs/component-reference.md` for component APIs and hooks, including PipelineDiagram, TokenChips, HeatmapGrid, MetricBars, and MessageFlow for backend and AI topics.
   - Use `useExampleTopic(EXAMPLES)` with 2 or 3 examples, `VisualizationToolbar` with an `ExamplePicker` in `leading`, and `SourceCodePanel` for the code.

6. **Extend the shared types:** the step interface extends `BaseStep`, the example interface extends `SourceExample<Step>` (both from `src/types/visualization.ts`).

7. **Create theory content** at `src/content/theory/<category>/<id>.ts`. Read `docs/theory-authoring.md` for field-by-field guidance and tone requirements.

8. **Register theory** in `src/content/theory/index.ts`. Import and add to `THEORY_CONTENT_BY_TOPIC_ID`.

9. **Add theory description** in `src/lib/metadata.ts` under `TOPIC_THEORY_DESCRIPTIONS`.

10. **Add inbound links:** add the new ID to `relatedTopicIds` of 2 or more existing theory files (keep each list at 3 to 5).

11. **Verify:** Run `npm run audit:steps -- <id>` and fix anything it flags, then `npm run verify` (lint, typecheck, format, step audit, build).

## Key Files

- `src/lib/topics.ts` -- topic registry
- `src/lib/metadata.ts` -- keywords and theory descriptions
- `src/components/visualizations/registry.tsx` -- component registry
- `src/components/visualizations/` -- visualization component (new)
- `src/content/theory/<category>/<id>.ts` -- theory content (new)
- `src/content/theory/index.ts` -- theory registry

## Documentation

- `docs/topic-authoring.md` -- full topic workflow and checklist
- `docs/categories.md` -- category registry
- `docs/component-reference.md` -- component APIs, hooks, animations
- `docs/theory-authoring.md` -- theory content requirements

## Non-Negotiable Rules

- No em dashes or AI-sounding language in content
- No emojis in step descriptions or UI text
- Use `VISUALIZATION_PANEL_TITLES` and `VISUALIZATION_EMPTY_STATES` from `uiCopy.ts`
- Use `useExampleTopic` + `VisualizationToolbar` + `ExamplePicker`; never hand-roll the toolbar or step pill
- Theory `relatedTopicIds` must have 3-5 valid IDs (never empty)
- Source code renders through `SourceCodePanel`
- Components use `"use client"` directive and named exports
