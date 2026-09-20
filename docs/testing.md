# Testing

The project uses [Vitest](https://vitest.dev) with a jsdom environment and
React Testing Library. Tests run in CI before the step audit and the build.

## Commands

| Command                 | What it does                                            |
| ----------------------- | ------------------------------------------------------- |
| `npm run test`          | Run the whole suite once                                |
| `npm run test:watch`    | Re-run affected tests as files change                   |
| `npm run test:coverage` | Run once and write a V8 coverage report                 |
| `npx vitest run <path>` | Run a single file, for example `src/lib/topics.test.ts` |

Configuration lives in `vitest.config.mts`. The `@/` alias resolves to `src/`,
and `src/test/setup.ts` runs before every file: it loads the jest-dom
matchers, bridges jsdom's `localStorage` onto the global (newer Node
versions ship their own experimental global that would otherwise shadow it),
stubs `matchMedia` as a non-hover device, and cleans up rendered components
and storage after each test.

## Where tests live

Unit and component tests sit next to the code they cover as `*.test.ts` or
`*.test.tsx`. Cross-cutting checks that sweep every topic live in
`src/test/conventions/`. The pure rules behind `npm run audit:steps` are in
`scripts/lib/stepAudit.ts` and are tested there too.

## What is covered

- **Registries**: `src/lib/topics.ts`, `src/lib/categories.ts`, the theory
  registry, `src/lib/metadata.ts`, and the sitemap and robots routes. These
  tests check ids, derived routes, keyword and description generation,
  structured data, and that every topic links three to five real related
  topics.
- **Content conventions** (`src/test/conventions/topicContent.test.ts`):
  every topic folder has `index.tsx`, `data.ts`, and `types.ts`, uses
  `"use client"` and named exports, keeps files at or under 300 lines, reads
  panel titles from `uiCopy.ts`, numbers code lines from 1, passes the step
  audit without errors, keeps step copy free of em dashes and emojis, and
  (for AI topics) carries `simpleHtml` on every step. Topics that do not drive
  a source panel are listed in `NON_SOURCE_TOPICS` in that file.
- **Sandbox**: the acorn parser wrapper, the shared generator utilities, the
  event loop step generator (ordering semantics, line tracking, error
  messages, HTML escaping), and the sandbox configs.
- **Stores**: topic progress and explanation mode, including cross-tab
  `storage` events and storage failures.
- **Hooks**: playback (auto-advance, keyboard shortcuts, reset keys,
  progress marking), example selection, change flashes, sandbox mode and UI
  state, focus trap, click outside, and hover detection.
- **Shared UI**: `SourceCodePanel` (including the active-over-done guard),
  `CodeLine` and `CodeBlock`, `ExplanationToggle`, `TransportControls`, and
  `ExampleSelector`.
- **Search**: the ranking in `filterTopics`.

## Adding tests

- Prefer testing behaviour through public functions and rendered output.
  Query the DOM by role and accessible name rather than by class.
- Hooks are tested with `renderHook` from React Testing Library. Wrap state
  changes in `act`, and use `vi.useFakeTimers()` for anything on a timer.
- Modules that cache in module scope (the stores) are loaded fresh with
  `vi.resetModules()` followed by a dynamic import.
- A new topic needs no test of its own: the convention suite picks it up
  from the registry. If its data does not use numbered code lines, add its
  id to `NON_SOURCE_TOPICS`.
- New library code, hooks, and shared primitives should ship with tests in
  the same change.
