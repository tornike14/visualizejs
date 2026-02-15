# VisualizeJS

Interactive visualizations for JavaScript and React concepts — step through animations that show exactly what the engine does at each stage.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/javascript` by default.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (webpack mode) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Routes

- `/javascript` — JavaScript topic landing
- `/javascript/event-loop` — Event Loop visualization
- `/javascript/hoisting` — Hoisting visualization
- `/javascript/closures` — Closures visualization
- `/javascript/promises` — Promises visualization
- `/react` — React (coming soon)

## Project Docs

- [`docs/ultimate.md`](docs/ultimate.md) — architecture, file structure, conventions, and current status
- [`docs/TOPIC_AUTHORING.md`](docs/TOPIC_AUTHORING.md) — guide for adding new visualization topics

## Tech Stack

- [Next.js](https://nextjs.org) App Router
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui primitives
