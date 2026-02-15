# VisualizeJS Project Status

## 1) Project Snapshot

VisualizeJS is a Next.js App Router project focused on interactive JavaScript concept visualizations.

Current product scope:
- JavaScript track is active with interactive concept pages.
- React track is intentionally reduced to a "Coming Soon" page.
- UI theme has been unified across shell, sidebar, pages, and visualizations using shared design tokens and reusable visualization primitives.

Status:
- `npm run lint` — passes (0 errors)
- `npm run build` — passes

---

## 2) Tech Stack

- Next.js `16.1.6` (App Router, webpack mode)
- React `19.2.3`
- TypeScript (strict mode)
- Tailwind CSS v4 + shadcn/ui primitives
- ESLint (Next core-web-vitals + TypeScript config)

Scripts:
- `npm run dev` -> `next dev --webpack`
- `npm run build` -> `next build --webpack`
- `npm run start` -> `next start`
- `npm run lint` -> `eslint`

---

## 3) Current Route Map

- `/` -> redirects to `/javascript`
- `/javascript` -> JavaScript landing page
- `/javascript/event-loop` -> Event Loop visualization
- `/javascript/hoisting` -> Hoisting visualization
- `/javascript/closures` -> Closures visualization
- `/javascript/promises` -> Promises visualization
- `/javascript/prototypal-inheritance` -> Prototypal Inheritance visualization
- `/javascript/this-keyword` -> this Keyword visualization
- `/javascript/scope-chain` -> Scope Chain visualization
- `/react` -> React "Coming Soon" page

Removed routes:
- `/react/virtual-dom`
- `/react/jwt`
- `/javascript/execution-context-scope-chain`

---

## 4) Current Key File Structure

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    loading.tsx
    javascript/
      page.tsx
      event-loop/page.tsx
      hoisting/page.tsx
      closures/page.tsx
      promises/page.tsx
      prototypal-inheritance/page.tsx
      this-keyword/page.tsx
      scope-chain/page.tsx
    react/
      page.tsx
  components/
    ErrorBoundary.tsx
    layout/
      AppTheme.tsx
      Sidebar.tsx
      TopicToggle.tsx
      CategoryTopicsPage.tsx
      VisualizationPageShell.tsx
      ToolbarPortal.tsx
    visualization-ui/
      NeonPanel.tsx
      TransportControls.tsx
      ExampleSelector.tsx
      Tooltip.tsx
      CodeBlock.tsx
      CodeLine.tsx
      ConsoleOutput.tsx
    visualizations/
      EventLoop.tsx
      Hoisting.tsx
      Closures.tsx
      Promises.tsx
      PrototypalInheritance.tsx
      ThisKeyword.tsx
      ScopeChain.tsx
      VisualizationLoading.tsx
  hooks/
    useStepPlayback.ts
    useClickOutside.ts
  lib/
    topics.ts
    metadata.ts
    constants.ts
    utils.ts
    visualization/
      syntax.ts
      uiCopy.ts
  types/
    index.ts
public/
  icons/
    javascript.svg
    react.svg
  personal-image.png
docs/
  ultimate.md          (this file, current status)
  TOPIC_AUTHORING.md   (guide for wiring new topics)
```

---

## 5) Architecture Patterns

- **ToolbarPortal + skeleton slot**: Transport controls and step explanations render outside the surface card via React context + `createPortal`. `ToolbarSlot` shows a pre-hydration skeleton (simple or selector variant) to prevent layout jump on hard refresh, then swaps to real portaled content.
- **TransportControls owns step pill**: Step position is rendered inline in `TransportControls` (left of Reset) via `stepIndex`/`totalSteps`; visualizations no longer render a separate step pill.
- **useStepPlayback**: Shared hook for step-driven playback (play, pause, step, reset, speed). Speed options are `0.25x` to `2x`; default is `1x`.
- **useClickOutside**: Shared hook that handles outside-click dismissal and Escape key for dropdowns. Used by `ExampleSelector` and `TransportControls`.
- **ExampleSelector**: Shared dropdown for switching sub-examples, with optional `renderBadge`. Used by Hoisting, Promises, Prototypal Inheritance, Scope Chain, and this Keyword.
- **Tooltip behavior by device**: Tooltips render only on hover-capable devices (`(hover: hover) and (pointer: fine)`), so mobile/touch UIs stay clean.
- **Sidebar footer and profile CTA**: Sidebar includes a compact LinkedIn follow pill with profile image and copyright.
- **Mobile nav pattern**: On mobile, brand logo remains visible at top-left, burger is fixed top-right, and full sidebar content (including footer extras) opens in the sheet.
- **Syntax tokenizer**: Lightweight regex tokenizer in `syntax.ts`. `CodeBlock` / `CodeLine` auto-tokenize plain text into colored spans.
- **NeonPanel**: Themed container with tone-colored headers (amber, cyan, green, violet, pink, slate).
- **Step data model**: Each visualization uses hardcoded full-state snapshots (`STEPS` arrays), no deltas.
- **External docs link**: Each topic has `docsUrl`; shell renders an external docs icon beside the title.
- **Responsive source code column**: Layout uses `xl:grid-cols-[auto_minmax(0,1fr)]` so code can size to content while right column fills remaining space.
- **No emojis**: UI text uses semantic emphasis (`<strong>`) and avoids emojis.

---

## 6) Conventions

1. Keep one H1 at page shell level.
2. Use `NeonPanel` + `TransportControls` for interactive visualizations.
3. Use step data models (not hardcoded DOM-driven behavior).
4. Code line fading guard: `isDone && !isActive` (never fade active lines).
5. `description` field on topics is used for SEO metadata and category landing cards only, not shown on the visualization page.
6. See `docs/TOPIC_AUTHORING.md` for the full wiring guide.

---

## 7) Verification Snapshot

Latest generated routes:
- `/`
- `/_not-found`
- `/javascript`
- `/javascript/closures`
- `/javascript/event-loop`
- `/javascript/hoisting`
- `/javascript/promises`
- `/javascript/prototypal-inheritance`
- `/javascript/this-keyword`
- `/javascript/scope-chain`
- `/react`
