# VisualizeJS

Interactive JavaScript and React concept visualizations. Next.js 16, React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui.

## Build Commands

- `npm run dev` -- dev server (webpack mode)
- `npm run build` -- production build (webpack mode)
- `npm run lint` -- ESLint
- `npm run start` -- serve production build

## Project Structure

- `src/lib/topics.ts` -- topic registry (single source of truth for all topics)
- `src/content/theory/index.ts` -- theory content registry
- `src/lib/metadata.ts` -- SEO metadata factory, keyword maps, theory descriptions
- `src/components/layout/VisualizationPageShell.tsx` -- page shell + SELECTOR_TOOLBAR_TOPIC_IDS
- `src/components/visualization-ui/` -- shared viz primitives (NeonPanel, CodeBlock, TransportControls, ExampleSelector, ComponentTreeDiagram)
- `src/hooks/useStepPlayback.ts` -- shared playback engine
- `src/hooks/useChangeFlash.ts` -- panel change detection
- `src/lib/visualization/uiCopy.ts` -- shared UI strings (VISUALIZATION_PANEL_TITLES, VISUALIZATION_EMPTY_STATES)
- `src/lib/sandbox/` -- sandbox mode infrastructure
- `src/content/theory/types.ts` -- TopicTheoryContent interface

## Non-Negotiable Conventions

- No em dashes or AI-sounding language in user-facing content
- No emojis in step descriptions or UI text
- Use `VISUALIZATION_PANEL_TITLES` and `VISUALIZATION_EMPTY_STATES` from `uiCopy.ts` (never hardcode panel titles)
- Wrap `setActiveExampleId` in a `handleExampleChange` callback
- Add ExampleSelector topics to `SELECTOR_TOOLBAR_TOPIC_IDS` in `VisualizationPageShell.tsx`
- Theory `relatedTopicIds` must be populated (3-5 IDs, never empty)
- Code line fading guard: `isDone && !isActive` (never fade active lines)
- React components use const form (`const Component = () =>`), not function declarations
- Component files target 200 lines or fewer, hard limit at 300
- Visualization components use `"use client"` directive and named exports

## Topic Patterns

- **Single-file:** `src/components/visualizations/TopicName.tsx` (legacy JS topics: EventLoop, Hoisting, Closures, Promises, TypeCoercion)
- **Folder-based:** `src/components/visualizations/<topic-id>/` with `index.tsx`, `types.ts`, `helpers.ts`, `data.ts`, `components/` (all React topics, most newer JS topics)
- **Reference implementations:** Reconciliation (React folder pattern), Event Loop (sandbox)

## Documentation

- `docs/topic-authoring.md` -- JS topic creation workflow
- `docs/react-topic-authoring.md` -- React topic extensions
- `docs/component-reference.md` -- design system, reusable components, hooks, animations
- `docs/theory-authoring.md` -- theory page authoring
- `docs/sandbox-authoring.md` -- sandbox mode guide
- `docs/architecture.md` -- frontend architecture rules
- `docs/seo.md` -- SEO implementation
