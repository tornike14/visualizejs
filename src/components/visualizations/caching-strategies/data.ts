import type { FlowActor, FlowMessage } from "@/components/visualization-ui/MessageFlow";
import type { MetricBar } from "@/components/visualization-ui/MetricBars";
import type { TokenChip } from "@/components/visualization-ui/TokenChips";
import type { CacheEntry, CachingExample, QueuedWrite, SourceRow } from "./types";

export const ACTORS: FlowActor[] = [
  { id: "app", label: "App" },
  { id: "cache", label: "Cache" },
  { id: "db", label: "Database" },
];

/* ── shared builders ── */

const msg = (
  id: string,
  from: string,
  to: string,
  label: string,
  detail: string,
  status: FlowMessage["status"],
): FlowMessage => ({ id, from, to, label, detail, status });

const latencyBar = (id: string, label: string, ms: number): MetricBar => ({
  id,
  label,
  value: ms / 125,
  display: `${ms} ms`,
  tone: ms > 50 ? "amber" : "green",
});

const countBar = (
  id: string,
  label: string,
  count: number,
  max: number,
  tone: MetricBar["tone"],
): MetricBar => ({ id, label, value: count / max, display: String(count), tone });

const asideStats = (
  hits: number,
  misses: number,
  latencyMs: number | null,
  dbQueries: number,
): MetricBar[] => {
  const total = hits + misses;
  return [
    {
      id: "ratio",
      label: "hit ratio",
      value: total === 0 ? 0 : hits / total,
      display: total === 0 ? "0 / 0" : `${Math.round((hits / total) * 100)}% (${hits}/${total})`,
      tone: "cyan",
    },
    latencyMs === null
      ? { id: "latency", label: "last read", value: 0, display: "n/a", tone: "slate" }
      : latencyBar("latency", "last read", latencyMs),
    countBar("db", "db queries", dbQueries, 4, "violet"),
  ];
};

const writeStats = (
  writeMs: number | null,
  queued: number,
  behind: number,
): MetricBar[] => [
  writeMs === null
    ? { id: "wlat", label: "write latency", value: 0, display: "n/a", tone: "slate" }
    : latencyBar("wlat", "write latency", writeMs),
  countBar("queued", "queued writes", queued, 2, "amber"),
  countBar("behind", "rows behind", behind, 2, behind > 0 ? "rose" : "green"),
];

const lruStats = (
  size: number,
  hits: number,
  misses: number,
  evictions: number,
): MetricBar[] => [
  { id: "size", label: "size", value: size / 3, display: `${size} / 3`, tone: "cyan" },
  countBar("hits", "hits", hits, 3, "green"),
  countBar("misses", "misses", misses, 3, "rose"),
  countBar("evict", "evictions", evictions, 3, "violet"),
];

const user42 = (value: string, ttl: string, state: CacheEntry["state"]): CacheEntry => ({
  key: "user:42",
  value,
  ttl,
  state,
});

const dbAda: SourceRow[] = [{ key: "users.id = 42", value: '{ name: "Ada" }' }];
const dbAdaL: SourceRow[] = [{ key: "users.id = 42", value: '{ name: "Ada L." }' }];

const getMiss = (suffix: string): FlowMessage[] => [
  msg(`get-${suffix}`, "app", "cache", "GET user:42", "1 ms", "done"),
  msg(`nil-${suffix}`, "cache", "app", "nil", "miss", "failed"),
];

const getHit = (suffix: string, value: string, wrong = false): FlowMessage[] => [
  msg(`get-${suffix}`, "app", "cache", "GET user:42", "1 ms", "done"),
  msg(`hit-${suffix}`, "cache", "app", value, wrong ? "hit, stale" : "hit", wrong ? "failed" : "active"),
];

/* ── LRU builders ── */

const lruEntry = (key: string, value: number, state: CacheEntry["state"] = "fresh"): CacheEntry => ({
  key,
  value: String(value),
  ttl: "none",
  state,
});

const recency = (order: [string, number][], evicted?: [string, number]): TokenChip[] => {
  const chips: TokenChip[] = order.map(([key, value], index) => ({
    id: key,
    label: `${key} = ${value}`,
    value: index === 0 ? "most recent" : index === order.length - 1 ? "least recent" : undefined,
    tone: index === 0 ? "active" : index === order.length - 1 ? "amber" : "neutral",
  }));
  if (evicted) {
    chips.push({ id: evicted[0], label: `${evicted[0]} = ${evicted[1]}`, value: "evicted", tone: "miss" });
  }
  return chips;
};

const queued = (id: string, label: string, status: QueuedWrite["status"]): QueuedWrite => ({
  id,
  label,
  status,
});

export const EXAMPLES: CachingExample[] = [
  /* ── Cache-aside ── */
  {
    id: "aside",
    title: "Cache-aside",
    description:
      "The application checks the cache first, falls back to the database on a miss, and fills the cache with a TTL. Shows expiry, a stale read after an update, and the invalidation fix.",
    kind: "aside",
    codeLines: [
      { num: 1, text: "async function getUser(id) {" },
      { num: 2, text: "  const key = `user:${id}`;" },
      { num: 3, text: "  const cached = await redis.get(key);" },
      { num: 4, text: "  if (cached) return JSON.parse(cached);" },
      { num: 5, text: "  const row = await db.query('SELECT * FROM users WHERE id = $1', [id]);" },
      { num: 6, text: "  await redis.set(key, JSON.stringify(row), 'EX', 60);" },
      { num: 7, text: "  return row;" },
      { num: 8, text: "}" },
      { num: 9, text: "" },
      { num: 10, text: "async function updateUser(id, patch) {" },
      { num: 11, text: "  await db.query('UPDATE users SET name = $1 WHERE id = $2', [patch.name, id]);" },
      { num: 12, text: "  // missing: await redis.del(`user:${id}`);" },
      { num: 13, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "<code>getUser(42)</code> builds the cache key <code>user:42</code>. The cache is a key-value copy that sits in front of the database, and the key is the only thing the two share, so it must be built the same way on every path.",
        activeLine: 2,
        doneLines: [1],
        cache: [],
        database: dbAda,
        messages: [],
        activeActorId: "app",
        stats: asideStats(0, 0, null, 0),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          '<code>redis.get</code> answers in about 1 ms with <code>nil</code>: a <span class="hl-loop">miss</span>. In cache-aside the application owns the lookup, the cache never talks to the database on its own.',
        activeLine: 3,
        doneLines: [1, 2],
        cache: [],
        database: dbAda,
        messages: getMiss("1"),
        activeActorId: "cache",
        stats: asideStats(0, 1, null, 0),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "The <code>if</code> falls through because there is nothing to parse. A miss costs the cache round trip plus the full query, so a cold cache is slightly slower than no cache at all.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        cache: [],
        database: dbAda,
        messages: getMiss("1"),
        activeActorId: "app",
        stats: asideStats(0, 1, null, 0),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "The application queries Postgres, the source of truth. This is the 120 ms the cache exists to avoid: disk reads, query planning, and a network hop to a machine that every other request is also hitting.",
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        cache: [],
        database: dbAda,
        messages: [
          ...getMiss("1"),
          msg("sel-1", "app", "db", "SELECT ... WHERE id = 42", "120 ms", "active"),
          msg("row-1", "db", "app", '{ name: "Ada" }', "1 row", "active"),
        ],
        activeActorId: "db",
        stats: asideStats(0, 1, null, 1),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "The row is serialized and stored with <code>EX 60</code>, a 60 second TTL. The TTL is a safety net: even if invalidation is forgotten later, this copy dies on its own within a minute.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        cache: [user42('{ name: "Ada" }', "60 s", "fresh")],
        database: dbAda,
        messages: [
          ...getMiss("1"),
          msg("sel-1", "app", "db", "SELECT ... WHERE id = 42", "120 ms", "done"),
          msg("row-1", "db", "app", '{ name: "Ada" }', "1 row", "done"),
          msg("set-1", "app", "cache", "SET user:42 EX 60", "1 ms", "active"),
        ],
        activeActorId: "cache",
        stats: asideStats(0, 1, null, 1),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "The caller gets the row after about 122 ms. Nothing was saved on this request. The payoff is deferred to every later call that finds the key.",
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        cache: [user42('{ name: "Ada" }', "60 s", "fresh")],
        database: dbAda,
        messages: [
          ...getMiss("1"),
          msg("sel-1", "app", "db", "SELECT ... WHERE id = 42", "120 ms", "done"),
          msg("row-1", "db", "app", '{ name: "Ada" }', "1 row", "done"),
          msg("set-1", "app", "cache", "SET user:42 EX 60", "1 ms", "done"),
        ],
        activeActorId: "app",
        stats: asideStats(0, 1, 122, 1),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          'Five seconds later a second <code>getUser(42)</code> finds the key: a <span class="hl-task">hit</span> with 55 s of TTL left. Redis serves it from memory in about 1 ms.',
        activeLine: 3,
        doneLines: [1, 2],
        cache: [user42('{ name: "Ada" }', "55 s", "hit")],
        database: dbAda,
        messages: getHit("2", '{ name: "Ada" }'),
        activeActorId: "cache",
        stats: asideStats(1, 1, 122, 1),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "The parsed object returns in about 2 ms, sixty times faster than the miss, and the database never saw the request. Caches buy two things: lower latency for the caller and lower load on the source.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        cache: [user42('{ name: "Ada" }', "55 s", "hit")],
        database: dbAda,
        messages: [
          msg("get-2", "app", "cache", "GET user:42", "1 ms", "done"),
          msg("hit-2", "cache", "app", '{ name: "Ada" }', "hit", "done"),
        ],
        activeActorId: "app",
        stats: asideStats(1, 1, 2, 1),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "At t = 60 s the key expires and Redis drops it. If hundreds of requests arrive in that same instant they all miss and all run the same query, the <strong>thundering herd</strong>. Mitigations: a per-key lock so one caller refills, jittered TTLs, or serving the stale value while one request revalidates.",
        activeLine: null,
        doneLines: [1, 2, 3, 4],
        cache: [user42('{ name: "Ada" }', "expired", "expired")],
        database: dbAda,
        messages: [],
        activeActorId: "cache",
        stats: asideStats(1, 1, 2, 1),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "The next call at t = 61 s misses, queries, and refills the key for another 60 s. The hit ratio after three reads is 33%, which is why cache effectiveness is judged over a window of traffic, not per request.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        cache: [user42('{ name: "Ada" }', "60 s", "fresh")],
        database: dbAda,
        messages: [
          ...getMiss("3"),
          msg("sel-3", "app", "db", "SELECT ... WHERE id = 42", "120 ms", "done"),
          msg("row-3", "db", "app", '{ name: "Ada" }', "1 row", "done"),
          msg("set-3", "app", "cache", "SET user:42 EX 60", "1 ms", "active"),
        ],
        activeActorId: "cache",
        stats: asideStats(1, 2, 122, 2),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "<code>updateUser(42, { name: 'Ada L.' })</code> writes the new name straight to Postgres. The database now says <code>Ada L.</code> while the cache still holds <code>Ada</code> with 58 s left. The two copies have diverged.",
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10],
        cache: [user42('{ name: "Ada" }', "58 s", "stale")],
        database: dbAdaL,
        messages: [
          msg("upd-1", "app", "db", "UPDATE users SET name = 'Ada L.'", "120 ms", "active"),
          msg("ok-1", "db", "app", "UPDATE 1", "committed", "active"),
        ],
        activeActorId: "db",
        stats: asideStats(1, 2, 122, 3),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          'Line 12 never ran, so the next read hits the cache and returns <code>Ada</code>: a <span class="hl-loop">stale read</span>, fast and wrong. Invalidation is the hard problem because the code that writes has to know every key the write affects.',
        activeLine: 4,
        doneLines: [1, 2, 3, 10, 11],
        cache: [user42('{ name: "Ada" }', "57 s", "stale")],
        database: dbAdaL,
        messages: getHit("4", '{ name: "Ada" }', true),
        activeActorId: "app",
        stats: asideStats(2, 2, 2, 3),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "The fix is one line after the <code>UPDATE</code>: <code>await redis.del('user:42')</code>. Deleting instead of overwriting is safer, because the next reader rebuilds the entry from the row the database actually has.",
        activeLine: 12,
        doneLines: [1, 2, 3, 4, 10, 11],
        cache: [],
        database: dbAdaL,
        messages: [
          msg("upd-1", "app", "db", "UPDATE users SET name = 'Ada L.'", "120 ms", "done"),
          msg("del-1", "app", "cache", "DEL user:42", "1 ms", "active"),
        ],
        activeActorId: "cache",
        stats: asideStats(2, 2, 2, 3),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "The following read misses once, fetches <code>Ada L.</code>, and caches it. HTTP caching works the same way one layer out: <code>Cache-Control: max-age</code> is the TTL, and an <code>ETag</code> revalidation is the check that a cached copy still matches the origin.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5, 10, 11, 12],
        cache: [user42('{ name: "Ada L." }', "60 s", "fresh")],
        database: dbAdaL,
        messages: [
          ...getMiss("5"),
          msg("sel-5", "app", "db", "SELECT ... WHERE id = 42", "120 ms", "done"),
          msg("row-5", "db", "app", '{ name: "Ada L." }', "1 row", "done"),
          msg("set-5", "app", "cache", "SET user:42 EX 60", "1 ms", "active"),
        ],
        activeActorId: "cache",
        stats: asideStats(2, 3, 122, 4),
        queue: [],
        recency: [],
      },
    ],
  },

  /* ── Write-through and write-behind ── */
  {
    id: "write",
    title: "Write-through and write-behind",
    description:
      "Write-through updates the database and the cache on every write. Write-behind updates the cache and queues the database write, trading durability for speed.",
    kind: "write",
    codeLines: [
      { num: 1, text: "// write-through: database and cache change together" },
      { num: 2, text: "async function saveUserThrough(id, user) {" },
      { num: 3, text: "  await db.query('UPDATE users SET name = $1 WHERE id = $2', [user.name, id]);" },
      { num: 4, text: "  await redis.set(`user:${id}`, JSON.stringify(user));" },
      { num: 5, text: "}" },
      { num: 6, text: "" },
      { num: 7, text: "// write-behind: cache changes now, database catches up later" },
      { num: 8, text: "const pending = [];" },
      { num: 9, text: "async function saveUserBehind(id, user) {" },
      { num: 10, text: "  await redis.set(`user:${id}`, JSON.stringify(user));" },
      { num: 11, text: "  pending.push({ id, user });" },
      { num: 12, text: "}" },
      { num: 13, text: "setInterval(async () => {" },
      { num: 14, text: "  const batch = pending.splice(0, 100);" },
      { num: 15, text: "  for (const w of batch) {" },
      { num: 16, text: "    await db.query('UPDATE users SET name = $1 WHERE id = $2', [w.user.name, w.id]);" },
      { num: 17, text: "  }" },
      { num: 18, text: "}, 1000);" },
    ],
    steps: [
      {
        descriptionHtml:
          "<code>saveUserThrough(42, { name: 'Ada L.' })</code> writes the database first. Ordering matters: if the process dies between lines 3 and 4 the cache is stale but the write survived, the reverse order could lose the write entirely.",
        activeLine: 3,
        doneLines: [1, 2],
        cache: [user42('{ name: "Ada" }', "none", "stale")],
        database: [
          { key: "users.id = 42", value: '{ name: "Ada L." }' },
          { key: "users.id = 7", value: '{ name: "Grace" }' },
          { key: "users.id = 9", value: '{ name: "Linus" }' },
        ],
        messages: [
          msg("wt-upd", "app", "db", "UPDATE users SET name = 'Ada L.'", "120 ms", "active"),
          msg("wt-ok", "db", "app", "UPDATE 1", "committed", "active"),
        ],
        activeActorId: "db",
        stats: writeStats(null, 0, 0),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "The cache is overwritten with the same object. For the 120 ms the query took, a concurrent reader would have seen <code>Ada</code> from the cache while the database already said <code>Ada L.</code>, a short window but not zero.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        cache: [user42('{ name: "Ada L." }', "none", "fresh")],
        database: [
          { key: "users.id = 42", value: '{ name: "Ada L." }' },
          { key: "users.id = 7", value: '{ name: "Grace" }' },
          { key: "users.id = 9", value: '{ name: "Linus" }' },
        ],
        messages: [
          msg("wt-upd", "app", "db", "UPDATE users SET name = 'Ada L.'", "120 ms", "done"),
          msg("wt-ok", "db", "app", "UPDATE 1", "committed", "done"),
          msg("wt-set", "app", "cache", "SET user:42", "1 ms", "active"),
        ],
        activeActorId: "cache",
        stats: writeStats(null, 0, 0),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "The write returns after about 122 ms, and the cache is never cold for this key. The costs: every write pays database latency plus a cache write, and rows that are written but never read still take up cache memory.",
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        cache: [user42('{ name: "Ada L." }', "none", "fresh")],
        database: [
          { key: "users.id = 42", value: '{ name: "Ada L." }' },
          { key: "users.id = 7", value: '{ name: "Grace" }' },
          { key: "users.id = 9", value: '{ name: "Linus" }' },
        ],
        messages: [
          msg("wt-upd", "app", "db", "UPDATE users SET name = 'Ada L.'", "120 ms", "done"),
          msg("wt-ok", "db", "app", "UPDATE 1", "committed", "done"),
          msg("wt-set", "app", "cache", "SET user:42", "1 ms", "done"),
        ],
        activeActorId: "app",
        stats: writeStats(122, 0, 0),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          'A read of <code>user:42</code> through the cache-aside path is a <span class="hl-task">hit</span> and returns <code>Ada L.</code>. Write-through keeps the cache and the database in agreement at the cost of slower writes.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5],
        cache: [user42('{ name: "Ada L." }', "none", "hit")],
        database: [
          { key: "users.id = 42", value: '{ name: "Ada L." }' },
          { key: "users.id = 7", value: '{ name: "Grace" }' },
          { key: "users.id = 9", value: '{ name: "Linus" }' },
        ],
        messages: getHit("wt", '{ name: "Ada L." }'),
        activeActorId: "cache",
        stats: writeStats(122, 0, 0),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "<code>saveUserBehind(7, { name: 'Grace H.' })</code> touches only the cache. Postgres still has <code>Grace</code>. The cache is now ahead of the source of truth, which is the opposite of the stale-read problem.",
        activeLine: 10,
        doneLines: [1, 2, 3, 4, 5, 7, 8, 9],
        cache: [
          user42('{ name: "Ada L." }', "none", "fresh"),
          { key: "user:7", value: '{ name: "Grace H." }', ttl: "none", state: "pending" },
        ],
        database: [
          { key: "users.id = 42", value: '{ name: "Ada L." }' },
          { key: "users.id = 7", value: '{ name: "Grace" }' },
          { key: "users.id = 9", value: '{ name: "Linus" }' },
        ],
        messages: [msg("wb-set-7", "app", "cache", "SET user:7", "1 ms", "active")],
        activeActorId: "cache",
        stats: writeStats(122, 0, 1),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "The write is appended to <code>pending</code> and the function returns after about 2 ms, sixty times faster than write-through. The caller has been told the save succeeded before any durable store has seen it.",
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 7, 8, 9, 10],
        cache: [
          user42('{ name: "Ada L." }', "none", "fresh"),
          { key: "user:7", value: '{ name: "Grace H." }', ttl: "none", state: "pending" },
        ],
        database: [
          { key: "users.id = 42", value: '{ name: "Ada L." }' },
          { key: "users.id = 7", value: '{ name: "Grace" }' },
          { key: "users.id = 9", value: '{ name: "Linus" }' },
        ],
        messages: [msg("wb-set-7", "app", "cache", "SET user:7", "1 ms", "done")],
        activeActorId: "app",
        stats: writeStats(2, 1, 1),
        queue: [queued("w7", "UPDATE users SET name = 'Grace H.' WHERE id = 7", "pending")],
        recency: [],
      },
      {
        descriptionHtml:
          "<code>saveUserBehind(9, { name: 'Linus T.' })</code> queues a second write. Anything that reads Postgres directly, a report, another service, a replica, sees two old names, and the cache must not evict these keys before they flush.",
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 7, 8, 9, 10],
        cache: [
          user42('{ name: "Ada L." }', "none", "fresh"),
          { key: "user:7", value: '{ name: "Grace H." }', ttl: "none", state: "pending" },
          { key: "user:9", value: '{ name: "Linus T." }', ttl: "none", state: "pending" },
        ],
        database: [
          { key: "users.id = 42", value: '{ name: "Ada L." }' },
          { key: "users.id = 7", value: '{ name: "Grace" }' },
          { key: "users.id = 9", value: '{ name: "Linus" }' },
        ],
        messages: [
          msg("wb-set-7", "app", "cache", "SET user:7", "1 ms", "done"),
          msg("wb-set-9", "app", "cache", "SET user:9", "1 ms", "done"),
        ],
        activeActorId: "app",
        stats: writeStats(2, 2, 2),
        queue: [
          queued("w7", "UPDATE users SET name = 'Grace H.' WHERE id = 7", "pending"),
          queued("w9", "UPDATE users SET name = 'Linus T.' WHERE id = 9", "pending"),
        ],
        recency: [],
      },
      {
        descriptionHtml:
          "If the process crashes now, both queued writes vanish: the cache says <code>Grace H.</code>, the database says <code>Grace</code>, and once the cache restarts even that trace is gone. Production write-behind keeps the queue in something durable, such as Redis Streams or Kafka.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12],
        cache: [
          user42('{ name: "Ada L." }', "none", "fresh"),
          { key: "user:7", value: '{ name: "Grace H." }', ttl: "none", state: "pending" },
          { key: "user:9", value: '{ name: "Linus T." }', ttl: "none", state: "pending" },
        ],
        database: [
          { key: "users.id = 42", value: '{ name: "Ada L." }' },
          { key: "users.id = 7", value: '{ name: "Grace" }' },
          { key: "users.id = 9", value: '{ name: "Linus" }' },
        ],
        messages: [
          msg("wb-set-7", "app", "cache", "SET user:7", "1 ms", "done"),
          msg("wb-set-9", "app", "cache", "SET user:9", "1 ms", "done"),
        ],
        activeActorId: "app",
        stats: writeStats(2, 2, 2),
        queue: [
          queued("w7", "UPDATE users SET name = 'Grace H.' WHERE id = 7", "pending"),
          queued("w9", "UPDATE users SET name = 'Linus T.' WHERE id = 9", "pending"),
        ],
        recency: [],
      },
      {
        descriptionHtml:
          "The interval fires after 1000 ms and <code>splice</code> takes up to 100 queued writes as one batch. Batching is the second benefit of write-behind: a burst of updates to the same row can collapse into a single database write.",
        activeLine: 14,
        doneLines: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13],
        cache: [
          user42('{ name: "Ada L." }', "none", "fresh"),
          { key: "user:7", value: '{ name: "Grace H." }', ttl: "none", state: "pending" },
          { key: "user:9", value: '{ name: "Linus T." }', ttl: "none", state: "pending" },
        ],
        database: [
          { key: "users.id = 42", value: '{ name: "Ada L." }' },
          { key: "users.id = 7", value: '{ name: "Grace" }' },
          { key: "users.id = 9", value: '{ name: "Linus" }' },
        ],
        messages: [],
        activeActorId: "app",
        stats: writeStats(2, 2, 2),
        queue: [
          queued("w7", "UPDATE users SET name = 'Grace H.' WHERE id = 7", "active"),
          queued("w9", "UPDATE users SET name = 'Linus T.' WHERE id = 9", "active"),
        ],
        recency: [],
      },
      {
        descriptionHtml:
          "The first <code>UPDATE</code> lands and row 7 is durable. The caller that wrote it moved on a second ago, which is why write-behind is chosen for counters, view tallies, and session touches rather than payments.",
        activeLine: 16,
        doneLines: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        cache: [
          user42('{ name: "Ada L." }', "none", "fresh"),
          { key: "user:7", value: '{ name: "Grace H." }', ttl: "none", state: "fresh" },
          { key: "user:9", value: '{ name: "Linus T." }', ttl: "none", state: "pending" },
        ],
        database: [
          { key: "users.id = 42", value: '{ name: "Ada L." }' },
          { key: "users.id = 7", value: '{ name: "Grace H." }' },
          { key: "users.id = 9", value: '{ name: "Linus" }' },
        ],
        messages: [
          msg("fl-7", "app", "db", "UPDATE ... WHERE id = 7", "120 ms", "done"),
          msg("fl-9", "app", "db", "UPDATE ... WHERE id = 9", "120 ms", "active"),
        ],
        activeActorId: "db",
        stats: writeStats(2, 1, 1),
        queue: [
          queued("w7", "UPDATE users SET name = 'Grace H.' WHERE id = 7", "done"),
          queued("w9", "UPDATE users SET name = 'Linus T.' WHERE id = 9", "active"),
        ],
        recency: [],
      },
      {
        descriptionHtml:
          "The batch drains and the database catches up with the cache. Write-through pays 122 ms per write for agreement at all times. Write-behind pays 2 ms and accepts a window where the only copy of the data lives in a queue.",
        activeLine: 17,
        doneLines: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        cache: [
          user42('{ name: "Ada L." }', "none", "fresh"),
          { key: "user:7", value: '{ name: "Grace H." }', ttl: "none", state: "fresh" },
          { key: "user:9", value: '{ name: "Linus T." }', ttl: "none", state: "fresh" },
        ],
        database: [
          { key: "users.id = 42", value: '{ name: "Ada L." }' },
          { key: "users.id = 7", value: '{ name: "Grace H." }' },
          { key: "users.id = 9", value: '{ name: "Linus T." }' },
        ],
        messages: [
          msg("fl-7", "app", "db", "UPDATE ... WHERE id = 7", "120 ms", "done"),
          msg("fl-9", "app", "db", "UPDATE ... WHERE id = 9", "120 ms", "done"),
        ],
        activeActorId: "db",
        stats: writeStats(2, 0, 0),
        queue: [
          queued("w7", "UPDATE users SET name = 'Grace H.' WHERE id = 7", "done"),
          queued("w9", "UPDATE users SET name = 'Linus T.' WHERE id = 9", "done"),
        ],
        recency: [],
      },
    ],
  },

  /* ── LRU eviction ── */
  {
    id: "lru",
    title: "LRU eviction",
    description:
      "A cache with capacity 3 built on a Map. Reads move a key to the most recent position, and a full cache evicts the least recently used key.",
    kind: "lru",
    codeLines: [
      { num: 1, text: "class LRUCache {" },
      { num: 2, text: "  constructor(capacity) {" },
      { num: 3, text: "    this.capacity = capacity;" },
      { num: 4, text: "    this.map = new Map(); // iterates in insertion order" },
      { num: 5, text: "  }" },
      { num: 6, text: "  get(key) {" },
      { num: 7, text: "    if (!this.map.has(key)) return undefined;" },
      { num: 8, text: "    const value = this.map.get(key);" },
      { num: 9, text: "    this.map.delete(key);" },
      { num: 10, text: "    this.map.set(key, value); // re-insert: now the newest" },
      { num: 11, text: "    return value;" },
      { num: 12, text: "  }" },
      { num: 13, text: "  set(key, value) {" },
      { num: 14, text: "    if (this.map.has(key)) this.map.delete(key);" },
      { num: 15, text: "    else if (this.map.size >= this.capacity) {" },
      { num: 16, text: "      this.map.delete(this.map.keys().next().value); // oldest" },
      { num: 17, text: "    }" },
      { num: 18, text: "    this.map.set(key, value);" },
      { num: 19, text: "  }" },
      { num: 20, text: "}" },
      { num: 21, text: "const cache = new LRUCache(3);" },
    ],
    steps: [
      {
        descriptionHtml:
          "<code>new LRUCache(3)</code> creates an empty <code>Map</code>. A bounded cache has to pick a victim when it is full, and LRU bets that a key nobody touched recently will not be touched soon. The <code>Map</code> trick: its first key is always the oldest insertion.",
        activeLine: 4,
        doneLines: [1, 2, 3, 21],
        cache: [],
        database: [],
        messages: [],
        stats: lruStats(0, 0, 0, 0),
        queue: [],
        recency: [],
      },
      {
        descriptionHtml:
          "<code>cache.set('a', 1)</code>: the key is new and the map is below capacity, so both guards are skipped and <code>a</code> is inserted. It is the only entry, so it is both the newest and the oldest.",
        activeLine: 18,
        doneLines: [1, 2, 3, 4, 5, 13, 14, 15, 21],
        cache: [lruEntry("a", 1)],
        database: [],
        messages: [],
        stats: lruStats(1, 0, 0, 0),
        queue: [],
        recency: recency([["a", 1]]),
      },
      {
        descriptionHtml:
          "<code>cache.set('b', 2)</code> appends to the end of the map. The recency list is read newest first: <code>b</code> then <code>a</code>. No pointers are maintained by hand, the insertion order is the recency order.",
        activeLine: 18,
        doneLines: [1, 2, 3, 4, 5, 13, 14, 15, 21],
        cache: [lruEntry("a", 1), lruEntry("b", 2)],
        database: [],
        messages: [],
        stats: lruStats(2, 0, 0, 0),
        queue: [],
        recency: recency([["b", 2], ["a", 1]]),
      },
      {
        descriptionHtml:
          "<code>cache.set('c', 3)</code> fills the cache to its capacity of 3. From now on every insert of a new key must evict something, and <code>a</code> is the current candidate.",
        activeLine: 18,
        doneLines: [1, 2, 3, 4, 5, 13, 14, 15, 21],
        cache: [lruEntry("a", 1), lruEntry("b", 2), lruEntry("c", 3)],
        database: [],
        messages: [],
        stats: lruStats(3, 0, 0, 0),
        queue: [],
        recency: recency([["c", 3], ["b", 2], ["a", 1]]),
      },
      {
        descriptionHtml:
          '<code>cache.get(\'a\')</code> is a <span class="hl-task">hit</span>. The entry is deleted and re-inserted, which moves it to the end of the map. <code>a</code> is now the newest and <code>b</code> has become the least recently used.',
        activeLine: 10,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 21],
        cache: [lruEntry("a", 1, "hit"), lruEntry("b", 2), lruEntry("c", 3)],
        database: [],
        messages: [],
        stats: lruStats(3, 1, 0, 0),
        queue: [],
        recency: recency([["a", 1], ["c", 3], ["b", 2]]),
      },
      {
        descriptionHtml:
          "The value <code>1</code> is returned. A read in an LRU cache is not free of side effects: touching a key protects it from eviction, and a scan that reads every key once can flush the genuinely hot entries.",
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 21],
        cache: [lruEntry("a", 1, "hit"), lruEntry("b", 2), lruEntry("c", 3)],
        database: [],
        messages: [],
        stats: lruStats(3, 1, 0, 0),
        queue: [],
        recency: recency([["a", 1], ["c", 3], ["b", 2]]),
      },
      {
        descriptionHtml:
          '<code>cache.set(\'d\', 4)</code>: the key is new and the size equals the capacity, so the oldest key is evicted. <code>this.map.keys().next().value</code> is <code>b</code>, the entry nothing has touched since it was written. It is <span class="hl-loop">deleted</span>.',
        activeLine: 16,
        doneLines: [1, 2, 3, 4, 5, 13, 14, 15, 21],
        cache: [lruEntry("a", 1), lruEntry("b", 2, "evicted"), lruEntry("c", 3)],
        database: [],
        messages: [],
        stats: lruStats(2, 1, 0, 1),
        queue: [],
        recency: recency([["a", 1], ["c", 3]], ["b", 2]),
      },
      {
        descriptionHtml:
          "<code>d</code> is inserted at the end and the cache is full again. Both the eviction and the insert are O(1), which is the same complexity a hand-written doubly linked list plus hash map would give.",
        activeLine: 18,
        doneLines: [1, 2, 3, 4, 5, 13, 14, 15, 16, 17, 21],
        cache: [lruEntry("a", 1), lruEntry("c", 3), lruEntry("d", 4)],
        database: [],
        messages: [],
        stats: lruStats(3, 1, 0, 1),
        queue: [],
        recency: recency([["d", 4], ["a", 1], ["c", 3]]),
      },
      {
        descriptionHtml:
          '<code>cache.get(\'b\')</code> is a <span class="hl-loop">miss</span> and returns <code>undefined</code>. In a cache-aside setup this miss becomes a database query. If <code>b</code> turns out to be hot, the capacity is too small or LRU is the wrong policy for this workload.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6, 13, 21],
        cache: [lruEntry("a", 1), lruEntry("c", 3), lruEntry("d", 4)],
        database: [],
        messages: [],
        stats: lruStats(3, 1, 1, 1),
        queue: [],
        recency: recency([["d", 4], ["a", 1], ["c", 3]]),
      },
      {
        descriptionHtml:
          '<code>cache.get(\'c\')</code> is a <span class="hl-task">hit</span> and moves <code>c</code> to the front. <code>a</code> drops to the least recent position even though it was read earlier, because recency only counts the last touch.',
        activeLine: 10,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 21],
        cache: [lruEntry("a", 1), lruEntry("c", 3, "hit"), lruEntry("d", 4)],
        database: [],
        messages: [],
        stats: lruStats(3, 2, 1, 1),
        queue: [],
        recency: recency([["c", 3], ["d", 4], ["a", 1]]),
      },
      {
        descriptionHtml:
          "<code>cache.set('e', 5)</code> evicts <code>a</code>. Redis does the same job approximately: <code>maxmemory-policy allkeys-lru</code> samples five keys and evicts the least recently used of those instead of tracking a full list, and <code>allkeys-lfu</code> counts frequency for workloads where one-off keys would otherwise flush the hot set.",
        activeLine: 18,
        doneLines: [1, 2, 3, 4, 5, 13, 14, 15, 16, 17, 21],
        cache: [lruEntry("c", 3), lruEntry("d", 4), lruEntry("e", 5)],
        database: [],
        messages: [],
        stats: lruStats(3, 2, 1, 2),
        queue: [],
        recency: recency([["e", 5], ["c", 3], ["d", 4]], ["a", 1]),
      },
    ],
  },
];
