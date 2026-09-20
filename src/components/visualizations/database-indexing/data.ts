import type { TreeNodeData, TreeNodeHighlight } from "@/types/visualization";
import type {
  DatabaseIndexingExample,
  IndexColumn,
  IndexColumnState,
  TablePage,
  TableRow,
  TableRowState,
} from "./types";

/* ------------------------------------------------------------------ */
/* Shared table data: 12 users, 4 rows per heap page                   */
/* ------------------------------------------------------------------ */

interface User {
  id: number;
  email: string;
  last: string;
  first: string;
}

const USERS: User[] = [
  { id: 1, email: "grace@example.com", last: "Hopper", first: "Grace" },
  { id: 2, email: "linus@example.com", last: "Torvalds", first: "Linus" },
  { id: 3, email: "ken@example.com", last: "Thompson", first: "Ken" },
  { id: 4, email: "margaret@example.com", last: "Hamilton", first: "Margaret" },
  { id: 5, email: "dennis@example.com", last: "Ritchie", first: "Dennis" },
  { id: 6, email: "barbara@example.com", last: "Liskov", first: "Barbara" },
  { id: 7, email: "tim@example.com", last: "Berners-Lee", first: "Tim" },
  { id: 8, email: "frances@example.com", last: "Allen", first: "Frances" },
  { id: 9, email: "alan@example.com", last: "Turing", first: "Alan" },
  { id: 10, email: "ada@example.com", last: "Lovelace", first: "Ada" },
  { id: 11, email: "edsger@example.com", last: "Dijkstra", first: "Edsger" },
  { id: 12, email: "radia@example.com", last: "Perlman", first: "Radia" },
];

const ROWS_PER_PAGE = 4;

/** Heap tuple id as (page, slot), both 1-based. */
const ctid = (id: number) =>
  `(${Math.ceil(id / ROWS_PER_PAGE)},${((id - 1) % ROWS_PER_PAGE) + 1})`;

const byEmail = (user: User) => user.email;
const byName = (user: User) => `${user.last}, ${user.first}`;

interface PageOptions {
  visited?: number[];
  match?: number[];
  /** Adds row 13 on a fourth page with the "new" state. */
  newRow?: boolean;
}

const rowState = (id: number, options: PageOptions): TableRowState => {
  if (options.match?.includes(id)) return "match";
  if (options.visited?.includes(id)) return "visited";
  return "idle";
};

const buildPages = (
  keyOf: (user: User) => string,
  options: PageOptions = {},
): TablePage[] => {
  const pages: TablePage[] = [];
  for (let start = 0; start < USERS.length; start += ROWS_PER_PAGE) {
    const pageNumber = start / ROWS_PER_PAGE + 1;
    pages.push({
      id: `page-${pageNumber}`,
      label: `page ${pageNumber}`,
      rows: USERS.slice(start, start + ROWS_PER_PAGE).map(
        (user): TableRow => ({
          id: user.id,
          key: keyOf(user),
          state: rowState(user.id, options),
        }),
      ),
    });
  }
  if (options.newRow) {
    const state: TableRowState = options.match?.includes(13)
      ? "match"
      : options.visited?.includes(13)
        ? "visited"
        : "new";
    pages.push({
      id: "page-4",
      label: "page 4",
      rows: [{ id: 13, key: "donald@example.com", state }],
    });
  }
  return pages;
};

const ALL_IDS = USERS.map((user) => user.id);
const range = (from: number, to: number) =>
  ALL_IDS.filter((id) => id >= from && id <= to);

/* ------------------------------------------------------------------ */
/* B-tree builders                                                     */
/* ------------------------------------------------------------------ */

type Entry = [key: string, rowId: number];

const leaf = (
  id: string,
  label: string,
  entries: Entry[],
  highlight?: TreeNodeHighlight,
): TreeNodeData => ({
  id,
  label,
  highlight,
  props: entries.map(([key, rowId]) => ({ key, value: ctid(rowId) })),
});

const EMAIL_L1: Entry[] = [
  ["ada", 10],
  ["alan", 9],
  ["barbara", 6],
  ["dennis", 5],
];
const EMAIL_L2: Entry[] = [
  ["edsger", 11],
  ["frances", 8],
  ["grace", 1],
  ["ken", 3],
];
const EMAIL_L3: Entry[] = [
  ["linus", 2],
  ["margaret", 4],
  ["radia", 12],
  ["tim", 7],
];

interface EmailTreeHighlights {
  root?: TreeNodeHighlight;
  l1?: TreeNodeHighlight;
  l2?: TreeNodeHighlight;
  l3?: TreeNodeHighlight;
  rootLabel?: string;
}

const emailTree = (h: EmailTreeHighlights = {}): TreeNodeData => ({
  id: "root",
  label: h.rootLabel ?? "root  [ edsger | linus ]",
  highlight: h.root,
  children: [
    leaf("l1", "leaf 1", EMAIL_L1, h.l1),
    leaf("l2", "leaf 2", EMAIL_L2, h.l2),
    leaf("l3", "leaf 3", EMAIL_L3, h.l3),
  ],
});

interface SplitTreeHighlights {
  root?: TreeNodeHighlight;
  l1a?: TreeNodeHighlight;
  l1b?: TreeNodeHighlight;
  promoted?: boolean;
}

const emailTreeAfterSplit = (h: SplitTreeHighlights = {}): TreeNodeData => ({
  id: "root",
  label: h.promoted
    ? "root  [ dennis | edsger | linus ]"
    : "root  [ edsger | linus ]",
  highlight: h.root,
  children: [
    leaf(
      "l1",
      "leaf 1",
      [
        ["ada", 10],
        ["alan", 9],
        ["barbara", 6],
      ],
      h.l1a,
    ),
    leaf(
      "l1b",
      "leaf 1b",
      [
        ["dennis", 5],
        ["donald", 13],
      ],
      h.l1b,
    ),
    leaf("l2", "leaf 2", EMAIL_L2),
    leaf("l3", "leaf 3", EMAIL_L3),
  ],
});

const NAME_L1: Entry[] = [
  ["Allen, Frances", 8],
  ["Berners-Lee, Tim", 7],
  ["Dijkstra, Edsger", 11],
  ["Hamilton, Margaret", 4],
];
const NAME_L2: Entry[] = [
  ["Hopper, Grace", 1],
  ["Liskov, Barbara", 6],
  ["Lovelace, Ada", 10],
  ["Perlman, Radia", 12],
];
const NAME_L3: Entry[] = [
  ["Ritchie, Dennis", 5],
  ["Thompson, Ken", 3],
  ["Torvalds, Linus", 2],
  ["Turing, Alan", 9],
];

interface NameTreeHighlights {
  root?: TreeNodeHighlight;
  l1?: TreeNodeHighlight;
  l2?: TreeNodeHighlight;
  l3?: TreeNodeHighlight;
}

const nameTree = (h: NameTreeHighlights = {}): TreeNodeData => ({
  id: "root",
  label: "root  [ Hopper | Ritchie ]",
  highlight: h.root,
  children: [
    leaf("l1", "leaf 1", NAME_L1, h.l1),
    leaf("l2", "leaf 2", NAME_L2, h.l2),
    leaf("l3", "leaf 3", NAME_L3, h.l3),
  ],
});

/* ------------------------------------------------------------------ */
/* Index column builders                                               */
/* ------------------------------------------------------------------ */

const emailColumns = (state: IndexColumnState): IndexColumn[] => [
  { name: "email", position: 1, state },
];

const nameColumns = (
  last: IndexColumnState,
  first: IndexColumnState,
): IndexColumn[] => [
  { name: "last_name", position: 1, state: last },
  { name: "first_name", position: 2, state: first },
];

/* ------------------------------------------------------------------ */
/* Example 1: full scan vs index                                       */
/* ------------------------------------------------------------------ */

const SCAN_FILTER = "Filter: email = 'ada@example.com'";
const SCAN_COND = "Index Cond: email = 'ada@example.com'";

const scanExample: DatabaseIndexingExample = {
  id: "scan",
  title: "Full scan vs index",
  description:
    "The same equality query before and after CREATE INDEX: 12 comparisons across every page, or 3 page reads down a B-tree.",
  kind: "scan",
  indexName: "users_email_idx",
  codeLines: [
    { num: 1, text: "-- users: 12 rows stored in 3 heap pages" },
    { num: 2, text: "SELECT * FROM users" },
    { num: 3, text: "WHERE email = 'ada@example.com';" },
    { num: 4, text: "" },
    { num: 5, text: "-- build a sorted B-tree over email" },
    { num: 6, text: "CREATE INDEX users_email_idx" },
    { num: 7, text: "  ON users (email);" },
    { num: 8, text: "" },
    { num: 9, text: "-- same query, now with a usable index" },
    { num: 10, text: "SELECT * FROM users" },
    { num: 11, text: "WHERE email = 'ada@example.com';" },
    { num: 12, text: "" },
    { num: 13, text: "-- only the indexed column: no heap fetch" },
    { num: 14, text: "SELECT email FROM users" },
    { num: 15, text: "WHERE email = 'ada@example.com';" },
  ],
  steps: [
    {
      descriptionHtml:
        'The query arrives and the <span class="hl-micro">planner</span> checks the catalog for an index on <code>email</code>. There is none, so the only way to find matching rows is a <span class="hl-stack">Seq Scan</span> that reads every heap page.',
      activeLine: 2,
      doneLines: [],
      pages: buildPages(byEmail),
      tree: null,
      plan: [
        {
          id: "seq",
          operation: "Seq Scan on users",
          detail: SCAN_FILTER,
          reads: "0",
          rows: "0",
          status: "pending",
        },
      ],
      indexColumns: [],
      writeLog: [],
    },
    {
      descriptionHtml:
        'Page 1 is read into the buffer pool and each of its 4 rows is compared against the filter. None match, but every row still had to be examined, because a <span class="hl-api">heap page</span> keeps rows in insertion order, not key order.',
      activeLine: 3,
      doneLines: [2],
      pages: buildPages(byEmail, { visited: range(1, 4) }),
      tree: null,
      plan: [
        {
          id: "seq",
          operation: "Seq Scan on users",
          detail: SCAN_FILTER,
          reads: "1",
          rows: "4",
          status: "running",
        },
      ],
      indexColumns: [],
      writeLog: [],
    },
    {
      descriptionHtml:
        "Page 2 follows. The scan has no way to know where the matching row is, so the work grows in step with the table size. This is the O(n) cost: double the rows, double the reads.",
      activeLine: 3,
      doneLines: [2],
      pages: buildPages(byEmail, { visited: range(1, 8) }),
      tree: null,
      plan: [
        {
          id: "seq",
          operation: "Seq Scan on users",
          detail: SCAN_FILTER,
          reads: "2",
          rows: "8",
          status: "running",
        },
      ],
      indexColumns: [],
      writeLog: [],
    },
    {
      descriptionHtml:
        "Page 3 holds the match at slot 2. The scan still compares slots 3 and 4, since without a unique constraint it cannot assume the match is the only one. <strong>12 comparisons for 1 result.</strong>",
      activeLine: 3,
      doneLines: [2],
      pages: buildPages(byEmail, { visited: range(1, 12), match: [10] }),
      tree: null,
      plan: [
        {
          id: "seq",
          operation: "Seq Scan on users",
          detail: SCAN_FILTER,
          reads: "3",
          rows: "12",
          elapsed: "0.041 ms",
          status: "done",
        },
      ],
      indexColumns: [],
      writeLog: [],
    },
    {
      descriptionHtml:
        "On 12 rows this cost 3 page reads. At a million rows the same query reads roughly 12,000 pages, and every inserted row makes it slower. The fix is a separate structure that already knows where <code>'ada@example.com'</code> lives.",
      activeLine: 5,
      doneLines: [2, 3],
      pages: buildPages(byEmail),
      tree: null,
      plan: [
        {
          id: "seq",
          operation: "Seq Scan on users",
          detail: SCAN_FILTER,
          reads: "3",
          rows: "12",
          elapsed: "0.041 ms",
          status: "done",
        },
      ],
      indexColumns: [],
      writeLog: [],
    },
    {
      descriptionHtml:
        '<code>CREATE INDEX</code> sorts the 12 email values and packs them into <span class="hl-task">leaf pages</span>. Each leaf entry stores the key and the tuple id (page, slot) of its heap row, so the index is a separate sorted copy of the column plus pointers back to the table.',
      activeLine: 6,
      doneLines: [2, 3],
      pages: buildPages(byEmail),
      tree: emailTree({
        l1: "added",
        l2: "added",
        l3: "added",
        rootLabel: "root",
      }),
      plan: [],
      indexColumns: emailColumns("idle"),
      writeLog: [],
    },
    {
      descriptionHtml:
        "The root page stores one separator per boundary: <code>edsger</code> and <code>linus</code>. Keys below <code>edsger</code> live in leaf 1, keys from <code>edsger</code> up to <code>linus</code> in leaf 2, the rest in leaf 3. Every leaf sits at the same depth, which is what keeps the tree balanced.",
      activeLine: 7,
      doneLines: [2, 3, 6],
      pages: buildPages(byEmail),
      tree: emailTree({ root: "added" }),
      activeNodeId: "root",
      plan: [],
      indexColumns: emailColumns("idle"),
      writeLog: [],
    },
    {
      descriptionHtml:
        'The query runs again. The <span class="hl-micro">planner</span> now sees <code>users_email_idx</code> and reads the column statistics: 12 distinct values in 12 rows, so an equality predicate selects about 1 row. Touching 1 row through the index is estimated cheaper than reading every page, so it picks an <span class="hl-task">Index Scan</span>.',
      activeLine: 10,
      doneLines: [2, 3, 6, 7],
      pages: buildPages(byEmail),
      tree: emailTree(),
      plan: [
        {
          id: "seq",
          operation: "Seq Scan on users",
          detail: "estimated 3 page reads and 12 comparisons, rejected",
          reads: "0",
          rows: "0",
          status: "rejected",
        },
        {
          id: "idx",
          operation: "Index Scan using users_email_idx",
          detail: SCAN_COND,
          reads: "0",
          rows: "0",
          status: "pending",
        },
      ],
      indexColumns: emailColumns("used"),
      writeLog: [],
    },
    {
      descriptionHtml:
        "Read 1: the root page. <code>ada</code> sorts before <code>edsger</code>, so the search follows the leftmost child pointer. One comparison rules out two thirds of the table without reading it.",
      activeLine: 11,
      doneLines: [2, 3, 6, 7, 10],
      pages: buildPages(byEmail),
      tree: emailTree({ root: "active" }),
      activeNodeId: "root",
      plan: [
        {
          id: "seq",
          operation: "Seq Scan on users",
          detail: "estimated 3 page reads and 12 comparisons, rejected",
          reads: "0",
          rows: "0",
          status: "rejected",
        },
        {
          id: "idx",
          operation: "Index Scan using users_email_idx",
          detail: SCAN_COND,
          reads: "1",
          rows: "1",
          status: "running",
        },
      ],
      indexColumns: emailColumns("used"),
      writeLog: [],
    },
    {
      descriptionHtml:
        "Read 2: leaf 1. A binary search over its sorted keys finds <code>ada</code> in the first slot with tuple id <code>(3,2)</code>. No other leaf is touched, and the same descent would take 3 or 4 reads on a tree holding millions of keys.",
      activeLine: 11,
      doneLines: [2, 3, 6, 7, 10],
      pages: buildPages(byEmail),
      tree: emailTree({ l1: "active" }),
      activeNodeId: "l1",
      plan: [
        {
          id: "seq",
          operation: "Seq Scan on users",
          detail: "estimated 3 page reads and 12 comparisons, rejected",
          reads: "0",
          rows: "0",
          status: "rejected",
        },
        {
          id: "idx",
          operation: "Index Scan using users_email_idx",
          detail: SCAN_COND,
          reads: "2",
          rows: "3",
          status: "running",
        },
      ],
      indexColumns: emailColumns("used"),
      writeLog: [],
    },
    {
      descriptionHtml:
        "Read 3: heap page 3, slot 2. The row is fetched by its tuple id and returned. Three page reads replaced a full scan, and because each index page holds hundreds of keys, height grows with log(n): this is why O(log n) beats O(n) as tables grow.",
      activeLine: 11,
      doneLines: [2, 3, 6, 7, 10],
      pages: buildPages(byEmail, { match: [10] }),
      tree: emailTree({ l1: "active" }),
      activeNodeId: "l1",
      plan: [
        {
          id: "seq",
          operation: "Seq Scan on users",
          detail: "estimated 3 page reads and 12 comparisons, rejected",
          reads: "0",
          rows: "0",
          status: "rejected",
        },
        {
          id: "idx",
          operation: "Index Scan using users_email_idx",
          detail: SCAN_COND,
          reads: "3",
          rows: "3",
          elapsed: "0.019 ms",
          status: "done",
        },
      ],
      indexColumns: emailColumns("used"),
      writeLog: [],
    },
    {
      descriptionHtml:
        'Covering case: this query only needs <code>email</code>, which the leaf entry already stores. The planner answers from the index alone, an <span class="hl-task">Index Only Scan</span>, and skips the heap fetch when the visibility map confirms the page has no unvacuumed changes.',
      activeLine: 14,
      doneLines: [2, 3, 6, 7, 10, 11],
      pages: buildPages(byEmail),
      tree: emailTree({ l1: "active" }),
      activeNodeId: "l1",
      plan: [
        {
          id: "only",
          operation: "Index Only Scan using users_email_idx",
          detail: `${SCAN_COND}, Heap Fetches: 0`,
          reads: "2",
          rows: "3",
          elapsed: "0.012 ms",
          status: "done",
        },
      ],
      indexColumns: emailColumns("used"),
      writeLog: [],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Example 2: composite index and column order                         */
/* ------------------------------------------------------------------ */

const FULL_COND = "Index Cond: last_name = 'Lovelace' AND first_name = 'Ada'";
const PREFIX_COND = "Index Cond: last_name = 'Lovelace'";
const NO_PREFIX = "no condition on leading column last_name, rejected";
const FIRST_FILTER = "Filter: first_name = 'Ada'";

const compositeExample: DatabaseIndexingExample = {
  id: "composite",
  title: "Composite index and column order",
  description:
    "One index on (last_name, first_name) serves a full key, a leading prefix, and an ORDER BY, but not a filter on first_name alone.",
  kind: "composite",
  indexName: "users_name_idx",
  codeLines: [
    { num: 1, text: "CREATE INDEX users_name_idx" },
    { num: 2, text: "  ON users (last_name, first_name);" },
    { num: 3, text: "" },
    { num: 4, text: "-- A: both columns, full key match" },
    { num: 5, text: "SELECT * FROM users" },
    { num: 6, text: "WHERE last_name = 'Lovelace' AND first_name = 'Ada';" },
    { num: 7, text: "" },
    { num: 8, text: "-- B: leading column only, prefix match" },
    { num: 9, text: "SELECT * FROM users WHERE last_name = 'Lovelace';" },
    { num: 10, text: "" },
    { num: 11, text: "-- C: second column only, index unusable" },
    { num: 12, text: "SELECT * FROM users WHERE first_name = 'Ada';" },
    { num: 13, text: "" },
    { num: 14, text: "-- D: the index order satisfies the sort" },
    { num: 15, text: "SELECT * FROM users ORDER BY last_name, first_name;" },
  ],
  steps: [
    {
      descriptionHtml:
        "<code>CREATE INDEX</code> builds one B-tree whose keys are <code>(last_name, first_name)</code> pairs. Entries sort by <code>last_name</code> first, and only entries sharing a <code>last_name</code> are ordered by <code>first_name</code>. Column order decides everything that follows.",
      activeLine: 1,
      doneLines: [],
      pages: buildPages(byName),
      tree: nameTree({ l1: "added", l2: "added", l3: "added" }),
      plan: [],
      indexColumns: nameColumns("idle", "idle"),
      writeLog: [],
    },
    {
      descriptionHtml:
        "The root separators are <code>Hopper</code> and <code>Ritchie</code>. Leaf pages are also linked left to right, so once a search lands on a leaf it can walk forward through keys in order without returning to the root.",
      activeLine: 2,
      doneLines: [1],
      pages: buildPages(byName),
      tree: nameTree({ root: "added" }),
      activeNodeId: "root",
      plan: [],
      indexColumns: nameColumns("idle", "idle"),
      writeLog: [],
    },
    {
      descriptionHtml:
        'Query A filters on both columns. The <span class="hl-micro">planner</span> matches <code>last_name</code> to column 1 and <code>first_name</code> to column 2, a full key, so the whole predicate becomes an index condition and no rows need a separate filter step.',
      activeLine: 5,
      doneLines: [1, 2],
      pages: buildPages(byName),
      tree: nameTree(),
      plan: [
        {
          id: "a",
          operation: "Index Scan using users_name_idx",
          detail: FULL_COND,
          reads: "0",
          rows: "0",
          status: "pending",
        },
      ],
      indexColumns: nameColumns("used", "used"),
      writeLog: [],
    },
    {
      descriptionHtml:
        "Read 1: the root. <code>(Lovelace, Ada)</code> sorts at or after <code>Hopper</code> and before <code>Ritchie</code>, so the search follows the middle pointer to leaf 2. Comparison happens on the pair, column 1 first.",
      activeLine: 6,
      doneLines: [1, 2, 5],
      pages: buildPages(byName),
      tree: nameTree({ root: "active" }),
      activeNodeId: "root",
      plan: [
        {
          id: "a",
          operation: "Index Scan using users_name_idx",
          detail: FULL_COND,
          reads: "1",
          rows: "2",
          status: "running",
        },
      ],
      indexColumns: nameColumns("used", "used"),
      writeLog: [],
    },
    {
      descriptionHtml:
        "Read 2: leaf 2 finds <code>Lovelace, Ada</code> with tuple id <code>(3,2)</code>. Read 3: heap page 3 returns the row. Three reads, exactly the same cost as a single column lookup.",
      activeLine: 6,
      doneLines: [1, 2, 5],
      pages: buildPages(byName, { match: [10] }),
      tree: nameTree({ l2: "active" }),
      activeNodeId: "l2",
      plan: [
        {
          id: "a",
          operation: "Index Scan using users_name_idx",
          detail: FULL_COND,
          reads: "3",
          rows: "4",
          elapsed: "0.020 ms",
          status: "done",
        },
      ],
      indexColumns: nameColumns("used", "used"),
      writeLog: [],
    },
    {
      descriptionHtml:
        "Query B filters on <code>last_name</code> only. That is a <strong>leftmost prefix</strong> of the key, so the index still applies: the search descends to the first entry with <code>last_name = 'Lovelace'</code> and walks right while the prefix keeps matching.",
      activeLine: 9,
      doneLines: [1, 2, 5, 6],
      pages: buildPages(byName),
      tree: nameTree(),
      plan: [
        {
          id: "b",
          operation: "Index Scan using users_name_idx",
          detail: PREFIX_COND,
          reads: "0",
          rows: "0",
          status: "pending",
        },
      ],
      indexColumns: nameColumns("used", "unused"),
      writeLog: [],
    },
    {
      descriptionHtml:
        "The descent lands on leaf 2 again. The scan returns <code>Lovelace, Ada</code>, reads the next key, <code>Perlman</code>, sees the prefix no longer matches, and stops. A range on the leading column is a short walk along one or two leaves.",
      activeLine: 9,
      doneLines: [1, 2, 5, 6],
      pages: buildPages(byName, { match: [10] }),
      tree: nameTree({ l2: "active" }),
      activeNodeId: "l2",
      plan: [
        {
          id: "b",
          operation: "Index Scan using users_name_idx",
          detail: PREFIX_COND,
          reads: "3",
          rows: "5",
          elapsed: "0.021 ms",
          status: "done",
        },
      ],
      indexColumns: nameColumns("used", "unused"),
      writeLog: [],
    },
    {
      descriptionHtml:
        'Query C filters on <code>first_name</code> alone. Entries are ordered by <code>last_name</code>, so an <code>Ada</code> could sit under any surname anywhere in the tree. With no prefix to descend by, the <span class="hl-micro">planner</span> rejects the index and falls back to a <span class="hl-stack">Seq Scan</span>.',
      activeLine: 12,
      doneLines: [1, 2, 5, 6, 9],
      pages: buildPages(byName),
      tree: nameTree(),
      plan: [
        {
          id: "c-idx",
          operation: "Index Scan using users_name_idx",
          detail: NO_PREFIX,
          reads: "0",
          rows: "0",
          status: "rejected",
        },
        {
          id: "c-seq",
          operation: "Seq Scan on users",
          detail: FIRST_FILTER,
          reads: "0",
          rows: "0",
          status: "pending",
        },
      ],
      indexColumns: nameColumns("unused", "blocked"),
      writeLog: [],
    },
    {
      descriptionHtml:
        "All 3 pages are read and all 12 rows compared for 1 match. Serving this query needs a second index led by <code>first_name</code>. The order of columns in an index decides which predicates it can answer, not just which columns it contains.",
      activeLine: 12,
      doneLines: [1, 2, 5, 6, 9],
      pages: buildPages(byName, { visited: range(1, 12), match: [10] }),
      tree: nameTree(),
      plan: [
        {
          id: "c-idx",
          operation: "Index Scan using users_name_idx",
          detail: NO_PREFIX,
          reads: "0",
          rows: "0",
          status: "rejected",
        },
        {
          id: "c-seq",
          operation: "Seq Scan on users",
          detail: FIRST_FILTER,
          reads: "3",
          rows: "12",
          elapsed: "0.044 ms",
          status: "done",
        },
      ],
      indexColumns: nameColumns("unused", "blocked"),
      writeLog: [],
    },
    {
      descriptionHtml:
        '<code>ORDER BY last_name, first_name</code> asks for exactly the index order. The <span class="hl-micro">planner</span> walks the leaf chain from leaf 1 to leaf 3 and emits rows already sorted, so no Sort node runs. Put equality columns first and the range or sort column last when designing a composite key.',
      activeLine: 15,
      doneLines: [1, 2, 5, 6, 9, 12],
      pages: buildPages(byName, { match: range(1, 12) }),
      tree: nameTree({ l1: "active", l2: "active", l3: "active" }),
      plan: [
        {
          id: "d",
          operation: "Index Scan using users_name_idx",
          detail: "no Index Cond, leaf chain walked in key order, no Sort node",
          reads: "4 index + 3 heap",
          rows: "12",
          elapsed: "0.058 ms",
          status: "done",
        },
      ],
      indexColumns: nameColumns("used", "used"),
      writeLog: [],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Example 3: the cost of indexes                                      */
/* ------------------------------------------------------------------ */

const COUNT_FILTER = "Filter: lower(email) = 'ada@example.com'";
const EXPR_REJECT = "predicate is on lower(email), not on email, rejected";

const WRITE_HEAP = {
  id: "heap",
  target: "heap page 4, slot 1",
  detail: "row 13 written, tuple id (4,1)",
  tone: "heap",
} as const;
const WRITE_WAL = {
  id: "wal",
  target: "WAL record",
  detail: "heap insert logged for crash recovery",
  tone: "wal",
} as const;
const WRITE_PKEY = {
  id: "pkey",
  target: "users_pkey",
  detail: "key 13 appended to the rightmost leaf, 1 page written",
  tone: "index",
} as const;
const WRITE_SPLIT = {
  id: "split",
  target: "users_email_idx leaf 1",
  detail: "full, split into leaf 1 and leaf 1b, 2 pages written",
  tone: "split",
} as const;
const WRITE_ROOT = {
  id: "root",
  target: "users_email_idx root",
  detail: "separator dennis added, 1 page written",
  tone: "index",
} as const;
const WRITE_NAME = {
  id: "name",
  target: "users_name_idx leaf 2",
  detail:
    "(Knuth, Donald) lands in a full leaf: split plus root separator, 3 pages written",
  tone: "split",
} as const;

const writesExample: DatabaseIndexingExample = {
  id: "writes",
  title: "The cost of indexes",
  description:
    "One INSERT on a table with three indexes: a heap write, three B-tree inserts, a leaf split, then a query that none of the indexes can serve.",
  kind: "writes",
  indexName: "users_email_idx",
  codeLines: [
    { num: 1, text: "-- users already has three indexes:" },
    { num: 2, text: "--   users_pkey       (id)" },
    { num: 3, text: "--   users_email_idx  (email)" },
    { num: 4, text: "--   users_name_idx   (last_name, first_name)" },
    { num: 5, text: "" },
    { num: 6, text: "INSERT INTO users (id, email, last_name, first_name)" },
    { num: 7, text: "VALUES (13, 'donald@example.com', 'Knuth', 'Donald');" },
    { num: 8, text: "" },
    { num: 9, text: "-- a function on the column defeats users_email_idx" },
    { num: 10, text: "SELECT COUNT(*) FROM users" },
    { num: 11, text: "WHERE lower(email) = 'ada@example.com';" },
  ],
  steps: [
    {
      descriptionHtml:
        "The <code>INSERT</code> arrives. The heap row is only part of the work: every index on <code>users</code> keeps its own sorted copy of the columns it covers, so each of the three B-trees must accept the new key before the statement completes.",
      activeLine: 6,
      doneLines: [],
      pages: buildPages(byEmail),
      tree: emailTree(),
      plan: [],
      indexColumns: [],
      writeLog: [],
    },
    {
      descriptionHtml:
        'Pages 1 to 3 are full, so the row lands on a fresh page 4 at slot 1 and gets tuple id <code>(4,1)</code>. The change is written to the <span class="hl-api">write-ahead log</span> first, then the page is marked dirty in the buffer pool.',
      activeLine: 7,
      doneLines: [6],
      pages: buildPages(byEmail, { newRow: true }),
      tree: emailTree(),
      plan: [],
      indexColumns: [],
      writeLog: [WRITE_HEAP, WRITE_WAL],
    },
    {
      descriptionHtml:
        "<code>users_pkey</code> receives key <code>13</code>. Ids increase monotonically, so the key appends at the end of the rightmost leaf, which still has room. This is the cheapest kind of index insert: one leaf page dirtied.",
      activeLine: 2,
      doneLines: [6, 7],
      pages: buildPages(byEmail, { newRow: true }),
      tree: emailTree(),
      plan: [],
      indexColumns: [],
      writeLog: [WRITE_HEAP, WRITE_WAL, WRITE_PKEY],
    },
    {
      descriptionHtml:
        '<code>users_email_idx</code> must place <code>donald</code> in sorted position. The insert descends like a lookup: <code>donald</code> sorts before <code>edsger</code>, so it belongs in <span class="hl-task">leaf 1</span>.',
      activeLine: 3,
      doneLines: [2, 6, 7],
      pages: buildPages(byEmail, { newRow: true }),
      tree: emailTree({ root: "active" }),
      activeNodeId: "root",
      plan: [],
      indexColumns: [],
      writeLog: [WRITE_HEAP, WRITE_WAL, WRITE_PKEY],
    },
    {
      descriptionHtml:
        "Leaf 1 already holds 4 keys, its capacity in this scaled-down tree (a real 8 KB leaf holds a few hundred). There is no free slot for <code>donald</code>, so the leaf has to <strong>split</strong> before the key can go in.",
      activeLine: 3,
      doneLines: [2, 6, 7],
      pages: buildPages(byEmail, { newRow: true }),
      tree: emailTree({ l1: "updated" }),
      activeNodeId: "l1",
      plan: [],
      indexColumns: [],
      writeLog: [WRITE_HEAP, WRITE_WAL, WRITE_PKEY],
    },
    {
      descriptionHtml:
        "The split keeps the lower half, <code>ada, alan, barbara</code>, in leaf 1 and moves the upper half, <code>dennis, donald</code>, into a newly allocated leaf 1b. Two leaf pages are written where a simple insert would have written one.",
      activeLine: 3,
      doneLines: [2, 6, 7],
      pages: buildPages(byEmail, { newRow: true }),
      tree: emailTreeAfterSplit({ l1a: "updated", l1b: "added" }),
      activeNodeId: "l1b",
      plan: [],
      indexColumns: [],
      writeLog: [WRITE_HEAP, WRITE_WAL, WRITE_PKEY, WRITE_SPLIT],
    },
    {
      descriptionHtml:
        "The first key of the new leaf, <code>dennis</code>, is copied up into the root as a separator: <code>dennis | edsger | linus</code>. If the root itself were full it would split too and the tree would gain a level, which is how a B-tree grows while staying balanced.",
      activeLine: 3,
      doneLines: [2, 6, 7],
      pages: buildPages(byEmail, { newRow: true }),
      tree: emailTreeAfterSplit({
        root: "updated",
        l1b: "added",
        promoted: true,
      }),
      activeNodeId: "root",
      plan: [],
      indexColumns: [],
      writeLog: [WRITE_HEAP, WRITE_WAL, WRITE_PKEY, WRITE_SPLIT, WRITE_ROOT],
    },
    {
      descriptionHtml:
        "<code>users_name_idx</code> gets <code>(Knuth, Donald)</code>, which sorts into a full leaf and splits as well. One inserted row became 8 dirty pages plus WAL: this is <strong>write amplification</strong>. Every extra index adds at least one page write to each INSERT, DELETE, or UPDATE of an indexed column.",
      activeLine: 4,
      doneLines: [2, 3, 6, 7],
      pages: buildPages(byEmail, { newRow: true }),
      tree: emailTreeAfterSplit({ promoted: true }),
      plan: [],
      indexColumns: [],
      writeLog: [
        WRITE_HEAP,
        WRITE_WAL,
        WRITE_PKEY,
        WRITE_SPLIT,
        WRITE_ROOT,
        WRITE_NAME,
      ],
    },
    {
      descriptionHtml:
        'The <code>COUNT</code> query wraps <code>email</code> in <code>lower()</code>. The index stores raw <code>email</code> values and the <span class="hl-micro">planner</span> cannot assume <code>lower(email)</code> sorts the same way, so <code>users_email_idx</code> is unusable and it plans a <span class="hl-stack">Seq Scan</span> over all 4 pages.',
      activeLine: 10,
      doneLines: [6, 7],
      pages: buildPages(byEmail, { newRow: true }),
      tree: emailTreeAfterSplit({ promoted: true }),
      plan: [
        {
          id: "cnt-idx",
          operation: "Index Scan using users_email_idx",
          detail: EXPR_REJECT,
          reads: "0",
          rows: "0",
          status: "rejected",
        },
        {
          id: "cnt-seq",
          operation: "Aggregate over Seq Scan on users",
          detail: COUNT_FILTER,
          reads: "0",
          rows: "0",
          status: "pending",
        },
      ],
      indexColumns: [],
      writeLog: [
        WRITE_HEAP,
        WRITE_WAL,
        WRITE_PKEY,
        WRITE_SPLIT,
        WRITE_ROOT,
        WRITE_NAME,
      ],
    },
    {
      descriptionHtml:
        "4 pages, 13 comparisons, 1 match, and the three indexes paid for on every write did nothing here. An expression index on <code>lower(email)</code> would serve this query. Index the exact shape of the predicates you run, and drop indexes no query uses.",
      activeLine: 11,
      doneLines: [6, 7, 10],
      pages: buildPages(byEmail, {
        newRow: true,
        visited: [...range(1, 12), 13],
        match: [10],
      }),
      tree: emailTreeAfterSplit({ promoted: true }),
      plan: [
        {
          id: "cnt-idx",
          operation: "Index Scan using users_email_idx",
          detail: EXPR_REJECT,
          reads: "0",
          rows: "0",
          status: "rejected",
        },
        {
          id: "cnt-seq",
          operation: "Aggregate over Seq Scan on users",
          detail: `${COUNT_FILTER}, count = 1`,
          reads: "4",
          rows: "13",
          elapsed: "0.048 ms",
          status: "done",
        },
      ],
      indexColumns: [],
      writeLog: [
        WRITE_HEAP,
        WRITE_WAL,
        WRITE_PKEY,
        WRITE_SPLIT,
        WRITE_ROOT,
        WRITE_NAME,
      ],
    },
  ],
};

export const EXAMPLES: DatabaseIndexingExample[] = [
  scanExample,
  compositeExample,
  writesExample,
];
