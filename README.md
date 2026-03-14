# VisualizeJS

Interactive visualizations for JavaScript and React concepts - step through animations that show exactly what the engine does at each stage.

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

- `/javascript` - JavaScript topic landing
- `/javascript/event-loop` - Event Loop visualization
- `/javascript/hoisting` - Hoisting visualization
- `/javascript/closures` - Closures visualization
- `/javascript/promises` - Promises visualization
- `/javascript/prototypal-inheritance` - Prototypal Inheritance visualization
- `/javascript/this-keyword` - this Keyword visualization
- `/javascript/scope-chain` - Scope Chain visualization
- `/react` - React (coming soon)

## Project Docs

- [`docs/topic-authoring.md`](docs/topic-authoring.md) - JS topic creation workflow
- [`docs/react-topic-authoring.md`](docs/react-topic-authoring.md) - React topic extensions
- [`docs/component-reference.md`](docs/component-reference.md) - design system, reusable components, hooks, animations
- [`docs/theory-authoring.md`](docs/theory-authoring.md) - theory page authoring
- [`docs/sandbox-authoring.md`](docs/sandbox-authoring.md) - sandbox mode guide
- [`docs/architecture.md`](docs/architecture.md) - frontend architecture rules
- [`docs/seo.md`](docs/seo.md) - SEO implementation and deployment checklist

## Tech Stack

- [Next.js](https://nextjs.org) App Router
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui primitives
