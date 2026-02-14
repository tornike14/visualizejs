# VisualizeJS Project Status

## 1) Project Snapshot

VisualizeJS is a Next.js App Router project focused on interactive JavaScript concept visualizations.

Current product scope:
- JavaScript track is active with interactive concept pages.
- React track is intentionally reduced to a "Coming Soon" page.
- UI theme has been unified across shell, sidebar, pages, and visualizations using shared design tokens and reusable visualization primitives.

Status:
- `npm run lint` passes
- `npm run build` passes

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
      Tooltip.tsx
      CodeBlock.tsx
      CodeLine.tsx
      ConsoleOutput.tsx
    visualizations/
      EventLoop.tsx
      Hoisting.tsx
      Closures.tsx
      Promises.tsx
      VisualizationLoading.tsx
  hooks/
    useStepPlayback.ts
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
  brand/
    visualizejs-logo.png
docs/
  ultimate.md          (this file, current status)
  TOPIC_AUTHORING.md   (guide for wiring new topics)
```

---

## 5) Architecture Patterns

- **ToolbarPortal**: Transport controls and step explanations render outside the surface card via React context + `createPortal`. The shell provides `ToolbarProvider` + `ToolbarSlot`; visualizations use `ToolbarPortal`.
- **useStepPlayback**: Shared hook for step-driven playback (play, pause, step, reset, speed). All visualizations use it.
- **Syntax tokenizer**: Lightweight regex tokenizer in `syntax.ts`. `CodeBlock` / `CodeLine` components auto-tokenize plain text into colored spans.
- **NeonPanel**: Themed container with tone-colored headers (amber, cyan, green, violet, pink, slate).
- **Step data model**: Each visualization has a hardcoded STEPS array of full-state snapshots. No deltas.
- **External docs link**: Each topic has a `docsUrl` field. The shell renders a small external-link icon next to the title that opens the authoritative documentation page.
- **Responsive source code column**: The two-column visualization grid uses `xl:grid-cols-[auto_minmax(0,1fr)]`. The source code panel sizes to fit its content (no fixed width), preventing long lines from being clipped. The right column fills remaining space.
- **No emojis**: All UI text uses `<strong>` tags for emphasis, never emojis.

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
- `/react`
