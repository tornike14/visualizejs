# VisualizeJS

[![Live site](https://img.shields.io/badge/live-visualizejs.com-3fb950?style=flat-square&labelColor=24292f)](https://visualizejs.com) [![CI](https://img.shields.io/github/actions/workflow/status/tornike14/visualizejs/ci.yml?branch=develop&style=flat-square&label=CI&labelColor=24292f)](https://github.com/tornike14/visualizejs/actions/workflows/ci.yml) [![Topics](https://img.shields.io/badge/topics-28-a371f7?style=flat-square&labelColor=24292f)](#topics) [![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white&labelColor=24292f)](https://nextjs.org) [![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=61DAFB&labelColor=24292f)](https://react.dev) [![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=24292f)](https://www.typescriptlang.org) [![License](https://img.shields.io/github/license/tornike14/visualizejs?style=flat-square&color=3fb950&labelColor=24292f)](LICENSE)

Interactive visualizations for JavaScript and React concepts. Step through animations that show what the engine does at each stage, then read the theory behind it.

28 topics. Each one pairs a step-by-step visualization with theory sections covering how it works, common mistakes, and interview questions, all on a single page.

[![VisualizeJS homepage](docs/images/homepage.jpg)](https://visualizejs.com)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/javascript` by default.

Node 20 or newer is required.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (webpack mode) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Topics

Each topic lives at a single route, with the visualization at the top and the theory sections below it.

### JavaScript (17)

| Topic | Difficulty |
|---|---|
| [Event Loop](/javascript/event-loop) | Intermediate |
| [Hoisting](/javascript/hoisting) | Beginner |
| [Execution Context](/javascript/execution-context) | Intermediate |
| [Closures](/javascript/closures) | Intermediate |
| [Promises](/javascript/promises) | Intermediate |
| [this Keyword](/javascript/this-keyword) | Intermediate |
| [Scope Chain](/javascript/scope-chain) | Intermediate |
| [Type Coercion](/javascript/type-coercion) | Beginner |
| [Destructuring](/javascript/destructuring) | Beginner |
| [Spread & Rest](/javascript/spread-rest) | Beginner |
| [Prototypal Inheritance](/javascript/prototypal-inheritance) | Advanced |
| [Reference vs Value](/javascript/reference-value) | Beginner |
| [Heap & Stack](/javascript/heap-stack) | Advanced |
| [Garbage Collection](/javascript/garbage-collection) | Advanced |
| [Generators & Iterators](/javascript/generators) | Advanced |
| [Event Delegation](/javascript/event-delegation) | Beginner |
| [Modules & Imports](/javascript/modules-imports) | Intermediate |

### React (11)

| Topic | Difficulty |
|---|---|
| [Virtual DOM](/react/virtual-dom) | Beginner |
| [Reconciliation](/react/reconciliation) | Intermediate |
| [Context Propagation](/react/context-propagation) | Intermediate |
| [Fiber Tree](/react/fiber-tree) | Advanced |
| [Hooks](/react/hooks) | Intermediate |
| [Render Cycle](/react/render-cycle) | Advanced |
| [Memoization](/react/memoization) | Intermediate |
| [Suspense](/react/suspense) | Intermediate |
| [Server Components](/react/server-components) | Advanced |
| [Error Boundaries](/react/error-boundaries) | Intermediate |
| [useEffect Lifecycle](/react/use-effect-lifecycle) | Beginner |

Some topics also have a sandbox mode where you can edit the code and watch the visualization respond. Event Loop is the reference implementation.

## Project Structure

```
src/
  app/                      Next.js App Router routes
  components/
    layout/                 Page shell, navigation
    visualization-ui/       Shared primitives (NeonPanel, CodeBlock, TransportControls)
    visualizations/         One folder per topic
  content/theory/           Theory content, one file per topic
  hooks/                    useStepPlayback, useChangeFlash
  lib/
    topics.ts               Topic registry, the single source of truth
    metadata.ts             SEO metadata factory
    sandbox/                Sandbox mode infrastructure
```

Adding a topic touches several registries. [`CONTRIBUTING.md`](CONTRIBUTING.md) lists all of them.

## Environment Variables

All are optional and have working defaults. Copy [`.env.example`](.env.example) to `.env.local` to override.

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://visualizejs.com` | Canonical URLs, sitemap, Open Graph tags |
| `NEXT_PUBLIC_CREATOR_LINKEDIN_URL` | Maintainer's profile | Credit link in the footer |
| `NEXT_PUBLIC_CREATOR_AVATAR_SRC` | `/personal-image.png` | Avatar in the footer |

If you fork this, set the last two to your own.

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) first. New topics are welcome, and the authoring docs below walk through the process.

## Documentation

| Doc | Covers |
|---|---|
| [`docs/topic-authoring.md`](docs/topic-authoring.md) | JavaScript topic creation workflow |
| [`docs/react-topic-authoring.md`](docs/react-topic-authoring.md) | React topic extensions |
| [`docs/component-reference.md`](docs/component-reference.md) | Design system, components, hooks, animations |
| [`docs/theory-authoring.md`](docs/theory-authoring.md) | Theory content authoring |
| [`docs/sandbox-authoring.md`](docs/sandbox-authoring.md) | Sandbox mode |
| [`docs/architecture.md`](docs/architecture.md) | Frontend architecture rules |
| [`docs/seo.md`](docs/seo.md) | SEO implementation |

## Tech Stack

- [Next.js 16](https://nextjs.org) App Router
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- [shadcn/ui](https://ui.shadcn.com) primitives
- CodeMirror 6 and Acorn for sandbox mode

## License

[MIT](LICENSE)
