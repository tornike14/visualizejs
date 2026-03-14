---
description: VisualizeJS project conventions, patterns, and key file locations for visualization topic development.
---

# VisualizeJS Conventions

Quick reference for project conventions and file locations. Read the full docs for detailed guidance.

## Key Files

- **Topic registry:** `src/lib/topics.ts` (single source of truth for all topics)
- **Theory registry:** `src/content/theory/index.ts`
- **SEO metadata:** `src/lib/metadata.ts` (TOPIC_KEYWORDS, TOPIC_THEORY_DESCRIPTIONS)
- **Page shell:** `src/components/layout/VisualizationPageShell.tsx` (SELECTOR_TOOLBAR_TOPIC_IDS)
- **UI strings:** `src/lib/visualization/uiCopy.ts` (VISUALIZATION_PANEL_TITLES, VISUALIZATION_EMPTY_STATES)
- **Playback engine:** `src/hooks/useStepPlayback.ts`
- **Change detection:** `src/hooks/useChangeFlash.ts`
- **Theory types:** `src/content/theory/types.ts`

## Non-Negotiable Rules

1. No em dashes or AI-sounding language in user-facing content
2. No emojis in step descriptions or UI text
3. Use `VISUALIZATION_PANEL_TITLES` / `VISUALIZATION_EMPTY_STATES` from `uiCopy.ts` (never hardcode)
4. Wrap `setActiveExampleId` in a `handleExampleChange` callback
5. Add ExampleSelector topics to `SELECTOR_TOOLBAR_TOPIC_IDS` in `VisualizationPageShell.tsx`
6. Theory `relatedTopicIds` must have 3-5 valid IDs (never empty)
7. Code line fading guard: `isDone && !isActive` (never fade active lines)
8. Components use `"use client"` directive and named exports
9. React components use const form, not function declarations
10. Component files target 200 lines, hard limit 300

## Topic Patterns

- **Single-file:** `src/components/visualizations/TopicName.tsx` (legacy JS)
- **Folder-based:** `src/components/visualizations/<topic-id>/` with `index.tsx`, `types.ts`, `helpers.ts`, `data.ts`, `components/` (React, complex JS)
- **Reference implementations:** Reconciliation (React folder pattern), Event Loop (sandbox)

## Full Documentation

- `docs/topic-authoring.md` -- JS topic creation workflow
- `docs/react-topic-authoring.md` -- React topic extensions
- `docs/component-reference.md` -- design system, components, hooks, animations
- `docs/theory-authoring.md` -- theory page authoring
- `docs/sandbox-authoring.md` -- sandbox mode guide
- `docs/architecture.md` -- frontend architecture rules
- `docs/seo.md` -- SEO implementation
