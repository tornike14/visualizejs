# Categories

Topics are grouped into categories. Everything that depends on a category (label, route, colours, hero copy, SEO keywords, sidebar toggle, landing page sections, sitemap) reads from one registry.

**File:** `src/lib/categories.ts`

## Current Categories

| ID | Label | Route | Accent |
|---|---|---|---|
| `javascript` | JavaScript | `/javascript` | yellow |
| `react` | React | `/react` | cyan |
| `frameworks` | Frameworks | `/frameworks` | emerald |
| `backend` | Backend | `/backend` | violet |
| `ai` | AI | `/ai` | pink |

`CATEGORY_ORDER` controls the order in the sidebar toggle, the landing page, and the sitemap.

## CategoryConfig Fields

| Field | Used by |
|---|---|
| `label`, `headingLabel` | Page titles, sidebar, breadcrumbs, structured data |
| `route` | Links, sitemap, `categoryFromPathname` |
| `tagline`, `description`, `kicker`, `indexTitle` | Landing page sections, category hero, category metadata |
| `iconSrc`, `iconAlt`, `iconShellClass` | Sidebar toggle, landing page, hero |
| `docsLabel` | The external docs link label in the theory section ("on MDN", "on react.dev") |
| `titleAccentClass`, `kickerClass`, `toggleActiveClass`, `badgeClass`, `ctaClass`, `glowRgb`, `hero` | Colours. Keep one hue per category |
| `keywords` | Merged into every topic's SEO keywords in that category |
| `indexKeywords` | Keywords of the category index page |

## Adding a Category

1. Add the ID to the `Category` union in `src/types/index.ts`.
2. Add a `CategoryConfig` entry to `CATEGORIES` and the ID to `CATEGORY_ORDER` in `src/lib/categories.ts`.
3. Add an icon at `public/icons/<id>.svg` (48x48 viewBox, single colour family).
4. Create `src/app/<id>/page.tsx` by copying `src/app/backend/page.tsx` and changing the `CATEGORIES.<id>` reference.
5. Create `src/content/theory/<id>/` for theory files.
6. Add at least one topic (see `docs/topic-authoring.md`). Empty categories still render a hero with no cards.
7. Run `npm run verify`.

Nothing else needs to change. The sidebar, search palette, landing page, sitemap, metadata, and page shell all iterate over `CATEGORY_LIST`.

## Helpers

```typescript
import { CATEGORIES, CATEGORY_LIST, getCategory, categoryFromPathname } from "@/lib/categories";

CATEGORIES.ai.label;               // "AI"
CATEGORY_LIST.map((c) => c.route);  // ["/javascript", "/react", ...]
categoryFromPathname("/backend/jwt-authentication"); // "backend"
```

Never branch on `category === "javascript"` in components. Read the field you need from the config instead.
