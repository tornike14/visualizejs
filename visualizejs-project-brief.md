# VisualizeJS - Project Brief

## 📋 How to Use This Brief

**In your new Claude Project session:**

1. **Upload this .md file** to your VisualizeJS Claude Project
2. **Upload 3 artifact files** as reference examples:
   - `event-loop.html`
   - `hoisting.html`
   - `vdom-visualization.jsx`
3. **Start your first message with:**
   ```
   Reference the visualizejs-project-brief.md file and the 3 artifact examples.

   Let's build this step-by-step:
   1. First, show me the complete file structure
   2. Explain your routing and state management strategy
   3. Then we'll start with Phase 1
   ```

---

## Overview
Building a free, interactive platform for visualizing JavaScript and React concepts through animated demonstrations. Think JavaScript.info meets interactive visualizations with a code playground.

---

## Tech Stack (Final Decision)
```
Next.js 14+ (App Router, default Webpack - NO Turbopack)
TypeScript (strict mode)
Tailwind CSS v3+
shadcn/ui for components
App Router with file-based routing
```

**What we're NOT using:**
- ❌ Framer Motion (existing artifacts use CSS animations)
- ❌ Turbopack (unnecessary for project size)
- ❌ Pages Router (App Router only)
- ❌ External animation libraries (keep it simple)

---

## Existing Assets
I have **4 working visualization artifacts** that need to be integrated:
1. **event-loop.html** - JavaScript Event Loop visualization
2. **hoisting.html** - JavaScript Hoisting visualization
3. **vdom-visualization.jsx** - React Virtual DOM visualization
4. **jwt-visualization.jsx** - JWT Authentication visualization

**I will attach 3 of these artifacts as reference** so you can see the quality, animation style, and interaction patterns we're maintaining.

---

## Project Structure Required

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with sidebar
│   ├── page.tsx                      # Landing page
│   ├── javascript/
│   │   ├── layout.tsx               # Shared layout for JS topics (optional)
│   │   ├── event-loop/
│   │   │   └── page.tsx             # /javascript/event-loop
│   │   └── hoisting/
│   │       └── page.tsx             # /javascript/hoisting
│   └── react/
│       ├── layout.tsx               # Shared layout for React topics (optional)
│       ├── virtual-dom/
│       │   └── page.tsx             # /react/virtual-dom
│       └── jwt/
│           └── page.tsx             # /react/jwt
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx              # Navigation sidebar
│   │   └── TopicToggle.tsx          # JS/React toggle switch
│   ├── visualizations/
│   │   ├── EventLoop.tsx            # Converted from artifact
│   │   ├── Hoisting.tsx             # Converted from artifact
│   │   ├── VirtualDOM.tsx           # Converted from artifact
│   │   └── JWT.tsx                  # Converted from artifact
│   └── ui/
│       └── [shadcn components]      # Button, Card, etc.
├── lib/
│   ├── topics.ts                    # Topic data structure
│   └── utils.ts                     # Helper functions
└── types/
    └── index.ts                     # TypeScript types
```

**Why routes are grouped by category:**
- Better SEO (category in URL: `/javascript/closures`)
- Scales to 50+ topics cleanly
- URL structure matches sidebar organization
- Easier to add category-specific layouts later

---

## Core Features

### 1. Sidebar Navigation
- Collapsible sidebar (desktop) / drawer (mobile)
- Two sections: **JavaScript** and **React**
- Active state highlighting
- Smooth transitions

### 2. JS/React Toggle
- Toggle switch at top of sidebar
- Filters topics by category
- Persists selection (localStorage)
- Smooth content transition

### 3. Visualization Pages
- Each visualization gets its own route (`/event-loop`, `/hoisting`, etc.)
- Full-screen visualization component
- Responsive layout
- Maintains existing animation quality from artifacts

### 4. Code Playground (Future Feature)
- **For now:** Display static visualizations only
- **Phase 2:** Add editable code for applicable concepts (event loop, promises, closures)
- Note this in architecture but don't implement yet

---

## Design Requirements

### Visual Style
- **Dark mode** (primary theme)
- Modern, professional aesthetic matching the artifacts
- Smooth CSS animations (no janky transitions)
- Clean typography (Inter or system fonts)
- Proper spacing and visual hierarchy

### Responsive Design
- Mobile-first approach
- Sidebar becomes drawer on mobile
- Visualizations scale properly on all screens
- Touch-friendly interactions

### Performance
- Lazy load visualization components
- Code splitting per route
- Optimize bundle size
- Fast initial load (<2s on 3G)

---

## Code Quality Standards

### ✅ DO (Senior-level code):
- Clean component architecture (SRP - Single Responsibility Principle)
- Proper TypeScript types (no `any`, use generics where appropriate)
- Composition over prop drilling
- Derive state when possible (don't useState everything)
- Semantic HTML with proper ARIA labels
- Error boundaries for visualizations
- Loading states for route transitions
- Reusable abstractions (DRY principle)
- Performance optimizations (`useMemo`, `useCallback` where needed)
- Consistent naming conventions

### ❌ DO NOT (Junior mistakes):
- No prop drilling (use composition or context)
- No `any` types (use `unknown` and type guards if needed)
- No inline styles mixed with Tailwind
- No massive components (break down >200 lines)
- No `console.log` in production code
- No hardcoded values that should be constants
- No useState abuse (if it can be derived, derive it)
- No mixing .js and .tsx files (TypeScript everywhere)

---

## Topics Data Structure

```typescript
// lib/topics.ts
export type Category = 'javascript' | 'react';

export interface Topic {
  id: string;
  title: string;
  category: Category;
  route: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const topics: Topic[] = [
  {
    id: 'event-loop',
    title: 'Event Loop',
    category: 'javascript',
    route: '/javascript/event-loop',
    description: 'Visualize how JavaScript handles asynchronous operations',
    difficulty: 'intermediate'
  },
  {
    id: 'hoisting',
    title: 'Hoisting',
    category: 'javascript',
    route: '/javascript/hoisting',
    description: 'Understand variable and function hoisting behavior',
    difficulty: 'beginner'
  },
  {
    id: 'virtual-dom',
    title: 'Virtual DOM',
    category: 'react',
    route: '/react/virtual-dom',
    description: 'See how React efficiently updates the DOM',
    difficulty: 'intermediate'
  },
  {
    id: 'jwt',
    title: 'JWT Authentication',
    category: 'react',
    route: '/react/jwt',
    description: 'Visualize JWT token-based authentication flow',
    difficulty: 'advanced'
  }
];
```

---

## SEO Requirements

- Next.js Metadata API for each route
- Proper meta titles and descriptions
- Open Graph tags for social sharing
- Semantic HTML structure
- Descriptive alt text for any images

---

## Deployment

- Target: **Vercel** (zero-config Next.js deployment)
- Domain: **visualizejs.com** (to be purchased)
- Environment: Production-ready from day 1
- Analytics: Consider Vercel Analytics or Plausible (privacy-focused)

---

## Development Workflow

### Phase 1: Foundation (Start Here)
1. **Show me the complete file structure** before writing code
2. **Explain routing strategy** and layout composition
3. **Set up the project** with proper TypeScript config
4. Create root layout with sidebar
5. Implement JS/React toggle with state management

### Phase 2: Visualization Integration
6. Convert artifacts to TypeScript components
7. Create individual routes for each visualization
8. Ensure animations work properly
9. Test responsive behavior

### Phase 3: Polish
10. Add loading states and error boundaries
11. Optimize performance (code splitting, lazy loading)
12. SEO optimization
13. Final responsive testing

---

## Key Principles

1. **Ship incrementally** - Build one feature at a time, test, then move on
2. **Ask when uncertain** - If multiple approaches exist, present tradeoffs and ask
3. **Maintain quality** - I'm a Senior SWE, code should reflect that
4. **Keep it simple** - No over-engineering, no premature optimization
5. **Preserve existing quality** - The artifacts already work well, don't break them

---

## Questions to Address First

Before writing any code:
1. **Routing strategy**: Parallel routes, route groups, or simple file-based routing?
2. **State management**: Context for toggle state, or URL params?
3. **Component conversion**: Keep artifacts as-is, or refactor for consistency?
4. **Styling approach**: Pure Tailwind, or Tailwind + CSS modules for complex animations?

---

## Expected Output

Start by:
1. Showing the complete file structure
2. Explaining architectural decisions with tradeoffs
3. Setting up the Next.js project with proper config
4. Building incrementally - one feature at a time

Let's build this properly. 💪

---

**Author:** Tornike Nizharadze
**Role:** Senior Software Engineer (React, Next.js, TypeScript)
**Goal:** Production-ready educational platform, not a tutorial project
