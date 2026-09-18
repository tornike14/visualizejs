import type { MetricBar } from "@/components/visualization-ui/MetricBars";
import type { TokenChip } from "@/components/visualization-ui/TokenChips";
import type {
  RateLimitExample,
  RateLimitStep,
  RequestLogEntry,
} from "./types";

/* ── shared builders ── */

type Verdict = "ok" | "rej";

const fmt = (t: number) => `t=${t.toFixed(1)} s`;

const timeline = (times: number[], verdicts: Verdict[]): TokenChip[] =>
  times.map((t, i) => {
    const v = verdicts[i];
    return {
      id: `req-${i}`,
      label: fmt(t),
      value: v === "ok" ? "200" : v === "rej" ? "429" : "pending",
      tone: v === "ok" ? "match" : v === "rej" ? "miss" : "muted",
    };
  });

const entry = (
  i: number,
  t: number,
  verdict: Verdict,
  detail: string,
): RequestLogEntry => ({
  id: `log-${i}`,
  time: fmt(t),
  decision: verdict === "ok" ? "accepted" : "rejected",
  status: verdict === "ok" ? 200 : 429,
  detail,
});

/* ── Example 1: token bucket ── */

const BUCKET_TIMES = [0, 0, 0, 0.5, 1, 1.2, 1.5, 4];
const BUCKET_VERDICTS: Verdict[] = ["ok", "ok", "ok", "ok", "ok", "ok", "rej", "ok"];
const BUCKET_DETAILS = [
  "tokens 5 -> 4",
  "tokens 4 -> 3",
  "tokens 3 -> 2",
  "refill +0.5, tokens 2.5 -> 1.5",
  "refill +0.5, tokens 2.0 -> 1.0",
  "refill +0.2, tokens 1.2 -> 0.2",
  "refill +0.3, tokens 0.5 < 1, Retry-After: 1",
  "refill +2.5, tokens 3.0 -> 2.0",
];

const bucketBar = (tokens: number): MetricBar[] => [
  {
    id: "tokens",
    label: "tokens",
    value: tokens / 5,
    display: `${tokens.toFixed(1)} / 5`,
    tone: tokens >= 1 ? "cyan" : "rose",
    active: true,
  },
];

const bucketStep = (
  descriptionHtml: string,
  activeLine: number | null,
  doneLines: number[],
  tokens: number,
  decided: number,
  stateNote: string,
): RateLimitStep => ({
  descriptionHtml,
  activeLine,
  doneLines,
  bars: bucketBar(tokens),
  stateChips: [],
  stateNote,
  log: BUCKET_TIMES.slice(0, decided).map((t, i) =>
    entry(i, t, BUCKET_VERDICTS[i], BUCKET_DETAILS[i]),
  ),
  timeline: timeline(BUCKET_TIMES, BUCKET_VERDICTS.slice(0, decided)),
});

const tokenBucket: RateLimitExample = {
  id: "token-bucket",
  title: "Token bucket",
  description:
    "A bucket holds up to 5 tokens and refills at 1 token per second. Each request spends one token, so bursts are allowed up to the capacity and the long-run rate is capped.",
  kind: "bucket",
  stateTitle: "Bucket",
  codeLines: [
    { num: 1, text: "const CAPACITY = 5, REFILL_PER_SEC = 1;" },
    { num: 2, text: "const buckets = new Map(); // key -> { tokens, last }" },
    { num: 3, text: "" },
    { num: 4, text: "function allow(key, now) {" },
    { num: 5, text: "  const b = buckets.get(key) ?? { tokens: CAPACITY, last: now };" },
    { num: 6, text: "  const elapsed = (now - b.last) / 1000;" },
    { num: 7, text: "  b.tokens = Math.min(CAPACITY, b.tokens + elapsed * REFILL_PER_SEC);" },
    { num: 8, text: "  b.last = now;" },
    { num: 9, text: "  const ok = b.tokens >= 1;" },
    { num: 10, text: "  if (ok) b.tokens -= 1;" },
    { num: 11, text: "  buckets.set(key, b);" },
    { num: 12, text: "  return ok;" },
    { num: 13, text: "}" },
    { num: 14, text: "" },
    { num: 15, text: "app.use((req, res, next) => {" },
    { num: 16, text: "  if (allow(req.ip, Date.now())) return next();" },
    { num: 17, text: "  res.set(\"Retry-After\", \"1\");" },
    { num: 18, text: "  res.status(429).send(\"Too Many Requests\");" },
    { num: 19, text: "});" },
  ],
  steps: [
    bucketStep(
      'The limiter keeps one bucket per client key, here <code>req.ip</code>. A bucket starts <span class="hl-api">full at 5 tokens</span> and records <code>last</code>, the time it was last refilled. Nothing is stored until the first request arrives.',
      2,
      [1],
      5,
      0,
      "capacity 5, refill 1 token / s, key = req.ip",
    ),
    bucketStep(
      'First request at <code>t=0</code>. No bucket exists for this IP, so line 5 creates one with 5 tokens. Elapsed time is 0, the check on line 9 passes, and one token is spent: <span class="hl-task">5 to 4</span>.',
      10,
      [1, 2, 4, 5, 6, 7, 8, 9],
      4,
      1,
      "last refill t=0.0 s",
    ),
    bucketStep(
      'Second request in the same burst, still <code>t=0</code>. No time has passed so no refill happens, but the bucket has tokens to spare. <span class="hl-task">4 to 3</span>. Bursts are what the bucket is for.',
      10,
      [1, 2, 4, 5, 6, 7, 8, 9],
      3,
      2,
      "last refill t=0.0 s",
    ),
    bucketStep(
      'Third request at <code>t=0</code>. Tokens drop <span class="hl-task">3 to 2</span>. Three requests were served in the same millisecond because the bucket was full, which a fixed rate of 1 per second would never allow.',
      10,
      [1, 2, 4, 5, 6, 7, 8, 9],
      2,
      3,
      "last refill t=0.0 s",
    ),
    bucketStep(
      'Request at <code>t=0.5</code>. Line 7 adds <code>elapsed * REFILL_PER_SEC</code>, so <span class="hl-stack">0.5 s adds 0.5 tokens</span>: 2 becomes 2.5. The request spends one, leaving 1.5. Refill is lazy, computed only when a request arrives.',
      7,
      [1, 2, 4, 5, 6],
      1.5,
      4,
      "last refill t=0.5 s, +0.5 tokens",
    ),
    bucketStep(
      'Request at <code>t=1.0</code>. Another 0.5 s has passed, so 1.5 refills to 2.0 and the spend leaves <span class="hl-task">1.0</span>. The bucket is draining faster than it refills because requests keep arriving at more than 1 per second.',
      10,
      [1, 2, 4, 5, 6, 7, 8, 9],
      1,
      5,
      "last refill t=1.0 s, +0.5 tokens",
    ),
    bucketStep(
      'Request at <code>t=1.2</code>. Only 0.2 s elapsed, so the refill is 0.2 and the bucket holds 1.2. That is still at least 1, so it is accepted and drops to <span class="hl-stack">0.2</span>. Fractional tokens are kept so the refill math stays exact.',
      10,
      [1, 2, 4, 5, 6, 7, 8, 9],
      0.2,
      6,
      "last refill t=1.2 s, +0.2 tokens",
    ),
    bucketStep(
      'Request at <code>t=1.5</code>. Refill of 0.3 brings the bucket to 0.5, which is <span class="hl-loop">less than one token</span>. Line 9 evaluates to false and nothing is spent. The bucket keeps its 0.5 and <code>last</code> is still updated so the partial refill is not lost.',
      9,
      [1, 2, 4, 5, 6, 7, 8],
      0.5,
      7,
      "last refill t=1.5 s, +0.3 tokens, request denied",
    ),
    bucketStep(
      'The middleware answers <span class="hl-loop">429 Too Many Requests</span> with <code>Retry-After: 1</code>. The header is in whole seconds, and the bucket needs 0.5 s to reach one token, so 1 is the smallest honest value. Well-behaved clients wait that long before retrying.',
      18,
      [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17],
      0.5,
      7,
      "response: 429, Retry-After: 1",
    ),
    bucketStep(
      'Request at <code>t=4.0</code>. Elapsed 2.5 s adds 2.5 tokens: 0.5 becomes 3.0, well under the cap of 5, so no clamping. The request is <span class="hl-task">accepted</span> and leaves 2.0. Idle time restores burst capacity, up to but never beyond <code>CAPACITY</code>.',
      10,
      [1, 2, 4, 5, 6, 7, 8, 9],
      2,
      8,
      "last refill t=4.0 s, +2.5 tokens",
    ),
    bucketStep(
      'Eight requests, seven accepted. The <code>Map</code> lives in one process, so with several API instances each would keep its own bucket and the real limit would be N times higher. Production limiters keep the bucket in <span class="hl-api">Redis</span> and run the refill and spend in a single Lua script so the read, compute, and write are atomic.',
      11,
      [1, 2, 4, 5, 6, 7, 8, 9, 10],
      2,
      8,
      "7 accepted, 1 rejected. Shared state belongs in Redis, not a process Map",
    ),
  ],
};

/* ── Example 2: fixed window ── */

const WINDOW_TIMES = [8, 9, 9.5, 9.8, 10.1, 10.2, 10.3];
const FIXED_VERDICTS: Verdict[] = ["ok", "ok", "ok", "rej", "ok", "ok", "ok"];
const FIXED_DETAILS = [
  "window 0-10, count 1 / 3",
  "window 0-10, count 2 / 3",
  "window 0-10, count 3 / 3",
  "window 0-10, count 4 > 3, Retry-After: 1",
  "window 10-20, count 1 / 3",
  "window 10-20, count 2 / 3",
  "window 10-20, count 3 / 3",
];

const fixedBars = (count: number, now: number, windowStart: number): MetricBar[] => [
  {
    id: "count",
    label: "count",
    value: count / 3,
    display: `${count} / 3`,
    tone: count > 3 ? "rose" : "amber",
    active: true,
  },
  {
    id: "elapsed",
    label: "elapsed",
    value: (now - windowStart) / 10,
    display: `${(now - windowStart).toFixed(1)} / 10 s`,
    tone: "slate",
  },
];

const fixedStep = (
  descriptionHtml: string,
  activeLine: number | null,
  doneLines: number[],
  count: number,
  now: number,
  windowStart: number,
  decided: number,
  stateNote: string,
): RateLimitStep => ({
  descriptionHtml,
  activeLine,
  doneLines,
  bars: fixedBars(count, now, windowStart),
  stateChips: [],
  stateNote,
  log: WINDOW_TIMES.slice(0, decided).map((t, i) =>
    entry(i, t, FIXED_VERDICTS[i], FIXED_DETAILS[i]),
  ),
  timeline: timeline(WINDOW_TIMES, FIXED_VERDICTS.slice(0, decided)),
});

const fixedWindow: RateLimitExample = {
  id: "fixed-window",
  title: "Fixed window",
  description:
    "Count requests per 10 second window aligned to the clock, allow 3, and reset at the boundary. Cheap, but a client can double its budget by straddling the reset.",
  kind: "fixed",
  stateTitle: "Window Counter",
  codeLines: [
    { num: 1, text: "const LIMIT = 3, WINDOW_MS = 10_000;" },
    { num: 2, text: "const counters = new Map(); // key -> { windowStart, count }" },
    { num: 3, text: "" },
    { num: 4, text: "function allow(key, now) {" },
    { num: 5, text: "  const windowStart = Math.floor(now / WINDOW_MS) * WINDOW_MS;" },
    { num: 6, text: "  let c = counters.get(key);" },
    { num: 7, text: "  if (!c || c.windowStart !== windowStart) {" },
    { num: 8, text: "    c = { windowStart, count: 0 };" },
    { num: 9, text: "  }" },
    { num: 10, text: "  c.count += 1;" },
    { num: 11, text: "  counters.set(key, c);" },
    { num: 12, text: "  const resetIn = (windowStart + WINDOW_MS - now) / 1000;" },
    { num: 13, text: "  return { ok: c.count <= LIMIT, resetIn };" },
    { num: 14, text: "}" },
    { num: 15, text: "" },
    { num: 16, text: "app.use((req, res, next) => {" },
    { num: 17, text: "  const { ok, resetIn } = allow(req.ip, Date.now());" },
    { num: 18, text: "  if (ok) return next();" },
    { num: 19, text: "  res.set(\"Retry-After\", String(Math.ceil(resetIn)));" },
    { num: 20, text: "  res.status(429).end();" },
    { num: 21, text: "});" },
  ],
  steps: [
    fixedStep(
      'The limit is <span class="hl-api">3 requests per 10 second window</span>. Windows are aligned to the clock: line 5 rounds <code>now</code> down to a multiple of 10 s, so every request between t=0 and t=10 shares the window that starts at 0.',
      5,
      [1, 2, 4],
      0,
      0,
      0,
      0,
      "limit 3 per 10 s, windows start at t=0, 10, 20, ...",
    ),
    fixedStep(
      'Request at <code>t=8.0</code>. No counter exists for this key, so line 8 creates one for the window starting at 0. The count goes to <span class="hl-task">1</span>, which is within the limit. The client had 8 idle seconds it will never get back: the window does not carry unused budget.',
      10,
      [1, 2, 4, 5, 6, 7, 8, 9],
      1,
      8,
      0,
      1,
      "window t=0 to t=10, resets in 2.0 s",
    ),
    fixedStep(
      'Request at <code>t=9.0</code>. Same window, the counter matches so no reset. Count <span class="hl-task">2 / 3</span>. One request left in this window.',
      13,
      [1, 2, 4, 5, 6, 7, 9, 10, 11, 12],
      2,
      9,
      0,
      2,
      "window t=0 to t=10, resets in 1.0 s",
    ),
    fixedStep(
      'Request at <code>t=9.5</code>. Count reaches <span class="hl-stack">3 / 3</span>, still <code>&lt;= LIMIT</code> so it is accepted. The window is now exhausted for the next 0.5 s.',
      13,
      [1, 2, 4, 5, 6, 7, 9, 10, 11, 12],
      3,
      9.5,
      0,
      3,
      "window t=0 to t=10, resets in 0.5 s",
    ),
    fixedStep(
      'Request at <code>t=9.8</code>. Line 10 increments first, then line 13 compares: <span class="hl-loop">4 &gt; 3</span>, rejected. The counter is left at 4. Incrementing before checking mirrors the Redis <code>INCR</code> pattern, where the returned value tells you whether you went over.',
      13,
      [1, 2, 4, 5, 6, 7, 9, 10, 11, 12],
      4,
      9.8,
      0,
      4,
      "window t=0 to t=10, resets in 0.2 s, request denied",
    ),
    fixedStep(
      'The middleware sends <span class="hl-loop">429</span>. <code>resetIn</code> is 0.2 s and <code>Retry-After</code> must be whole seconds, so <code>Math.ceil</code> gives 1. Rounding up is the safe direction: a client that retries at 0.2 s would be inside the same window if the clock is slightly off.',
      19,
      [1, 2, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 16, 17, 18],
      4,
      9.8,
      0,
      4,
      "response: 429, Retry-After: 1",
    ),
    fixedStep(
      'Request at <code>t=10.1</code>. <code>Math.floor(10.1 / 10) * 10</code> is 10, which differs from the stored <code>windowStart</code> of 0, so line 8 <span class="hl-api">replaces the counter</span> with a fresh one. Count 1 / 3, accepted. The old count of 4 is simply gone.',
      8,
      [1, 2, 4, 5, 6, 7],
      1,
      10.1,
      10,
      5,
      "window t=10 to t=20, resets in 9.9 s",
    ),
    fixedStep(
      'Request at <code>t=10.2</code>. Count <span class="hl-task">2 / 3</span> in the new window. This is the fifth accepted request in 2.2 s of wall clock time.',
      13,
      [1, 2, 4, 5, 6, 7, 9, 10, 11, 12],
      2,
      10.2,
      10,
      6,
      "window t=10 to t=20, resets in 9.8 s",
    ),
    fixedStep(
      'Request at <code>t=10.3</code>. Count <span class="hl-stack">3 / 3</span>, accepted. Between t=8.0 and t=10.3 the client got <strong>6 requests through in 2.3 seconds</strong> against a limit of 3 per 10 seconds, because the budget of two adjacent windows was spent at the shared boundary.',
      13,
      [1, 2, 4, 5, 6, 7, 9, 10, 11, 12],
      3,
      10.3,
      10,
      7,
      "window t=10 to t=20. 6 accepted in 2.3 s, twice the nominal limit",
    ),
    fixedStep(
      'This is the boundary burst problem. It is still popular because the state is one integer per key: in Redis, <code>INCR ratelimit:{ip}:{windowStart}</code> plus <code>EXPIRE</code> is <span class="hl-api">atomic and O(1)</span>, and works across every instance. The sliding window example shows how to close the gap.',
      11,
      [1, 2, 4, 5, 6, 7, 9, 10],
      3,
      10.3,
      10,
      7,
      "Redis: INCR key:{windowStart}, EXPIRE 10, reject when the result exceeds 3",
    ),
  ],
};

/* ── Example 3: sliding window log ── */

const SLIDING_TIMES = [8, 9, 9.5, 9.8, 10.1, 18.5];
const SLIDING_VERDICTS: Verdict[] = ["ok", "ok", "ok", "rej", "rej", "ok"];
const SLIDING_DETAILS = [
  "log [8.0], remaining 2",
  "log [8.0, 9.0], remaining 1",
  "log [8.0, 9.0, 9.5], remaining 0",
  "3 in window, Retry-After: 9",
  "3 in window, Retry-After: 8",
  "8.0 expired, log [9.0, 9.5, 18.5], remaining 0",
];

interface LogChip {
  t: number;
  tone: TokenChip["tone"];
}

const logChips = (chips: LogChip[]): TokenChip[] =>
  chips.map(({ t, tone }) => ({
    id: `ts-${t}`,
    label: fmt(t),
    value: tone === "muted" ? "expired" : tone === "active" ? "pushed" : "in window",
    tone,
  }));

const slidingStep = (
  descriptionHtml: string,
  activeLine: number | null,
  doneLines: number[],
  chips: LogChip[],
  decided: number,
  stateNote: string,
): RateLimitStep => ({
  descriptionHtml,
  activeLine,
  doneLines,
  bars: [],
  stateChips: logChips(chips),
  stateNote,
  log: SLIDING_TIMES.slice(0, decided).map((t, i) =>
    entry(i, t, SLIDING_VERDICTS[i], SLIDING_DETAILS[i]),
  ),
  timeline: timeline(SLIDING_TIMES, SLIDING_VERDICTS.slice(0, decided)),
});

const slidingWindow: RateLimitExample = {
  id: "sliding-log",
  title: "Sliding window log",
  description:
    "Keep the timestamp of every accepted request and count only those inside the last 10 seconds. Exact at any instant, at the cost of one entry per accepted request.",
  kind: "sliding",
  stateTitle: "Timestamp Log",
  codeLines: [
    { num: 1, text: "const LIMIT = 3, WINDOW_MS = 10_000;" },
    { num: 2, text: "const logs = new Map(); // key -> accepted timestamps" },
    { num: 3, text: "" },
    { num: 4, text: "function allow(key, now) {" },
    { num: 5, text: "  const log = (logs.get(key) ?? []).filter((t) => t > now - WINDOW_MS);" },
    { num: 6, text: "  if (log.length < LIMIT) {" },
    { num: 7, text: "    log.push(now);" },
    { num: 8, text: "    logs.set(key, log);" },
    { num: 9, text: "    return { ok: true, remaining: LIMIT - log.length };" },
    { num: 10, text: "  }" },
    { num: 11, text: "  logs.set(key, log);" },
    { num: 12, text: "  const retryAfter = Math.ceil((log[0] + WINDOW_MS - now) / 1000);" },
    { num: 13, text: "  return { ok: false, remaining: 0, retryAfter };" },
    { num: 14, text: "}" },
    { num: 15, text: "" },
    { num: 16, text: "app.use((req, res, next) => {" },
    { num: 17, text: "  const r = allow(req.apiKey, Date.now());" },
    { num: 18, text: "  res.set(\"X-RateLimit-Remaining\", String(r.remaining));" },
    { num: 19, text: "  if (r.ok) return next();" },
    { num: 20, text: "  res.set(\"Retry-After\", String(r.retryAfter));" },
    { num: 21, text: "  res.status(429).end();" },
    { num: 22, text: "});" },
  ],
  steps: [
    slidingStep(
      'Same limit, 3 per 10 s, but the state is a <span class="hl-api">sorted list of accepted timestamps</span> per key. Here the key is the API key rather than the IP, so a customer behind a shared NAT gets their own budget. The window is whatever the last 10 s happen to be.',
      2,
      [1],
      [],
      0,
      "limit 3 per 10 s, window = (now - 10 s, now], key = req.apiKey",
    ),
    slidingStep(
      'Request at <code>t=8.0</code>. The log is empty, so the filter on line 5 keeps nothing, the length 0 is under 3, and <code>8.0</code> is pushed. The response carries <span class="hl-task">X-RateLimit-Remaining: 2</span> so the client can pace itself.',
      7,
      [1, 2, 4, 5, 6],
      [{ t: 8, tone: "active" }],
      1,
      "window (-2.0, 8.0], 1 entry, remaining 2",
    ),
    slidingStep(
      'Request at <code>t=9.0</code>. The cutoff is <code>9.0 - 10 = -1.0</code>, so 8.0 survives the filter. One entry is under 3, <span class="hl-task">9.0 is pushed</span>. Remaining 1.',
      7,
      [1, 2, 4, 5, 6],
      [
        { t: 8, tone: "match" },
        { t: 9, tone: "active" },
      ],
      2,
      "window (-1.0, 9.0], 2 entries, remaining 1",
    ),
    slidingStep(
      'Request at <code>t=9.5</code>. Two entries in the window, still under 3, so <span class="hl-task">9.5 is pushed</span> and the log holds three timestamps. Remaining 0: the next request will be rejected unless something ages out.',
      9,
      [1, 2, 4, 5, 6, 7, 8],
      [
        { t: 8, tone: "match" },
        { t: 9, tone: "match" },
        { t: 9.5, tone: "active" },
      ],
      3,
      "window (-0.5, 9.5], 3 entries, remaining 0",
    ),
    slidingStep(
      'Request at <code>t=9.8</code>. Cutoff is -0.2, all three entries survive, and <code>log.length &lt; LIMIT</code> is false. <span class="hl-loop">Rejected</span>, and the timestamp is not recorded: only accepted requests count against the client, otherwise a flood of rejections would extend its own lockout.',
      12,
      [1, 2, 4, 5, 6, 10, 11],
      [
        { t: 8, tone: "match" },
        { t: 9, tone: "match" },
        { t: 9.5, tone: "match" },
      ],
      4,
      "window (-0.2, 9.8], 3 entries, oldest 8.0 expires at t=18.0",
    ),
    slidingStep(
      '<code>Retry-After</code> is computed from the oldest entry: <code>8.0 + 10 - 9.8 = 8.2</code>, rounded up to <span class="hl-loop">9</span>. That is exactly when a slot opens, so the header is accurate rather than a fixed guess.',
      20,
      [1, 2, 4, 5, 6, 10, 11, 12, 13, 14, 16, 17, 18, 19],
      [
        { t: 8, tone: "match" },
        { t: 9, tone: "match" },
        { t: 9.5, tone: "match" },
      ],
      4,
      "response: 429, X-RateLimit-Remaining: 0, Retry-After: 9",
    ),
    slidingStep(
      'Request at <code>t=10.1</code>. The fixed window accepted this one after its reset. Here the cutoff is 0.1 and <span class="hl-api">8.0, 9.0, 9.5 are all still inside the last 10 s</span>, so it is rejected with <code>Retry-After: 8</code> (8.0 + 10 - 10.1 = 7.9, rounded up). No boundary to exploit.',
      12,
      [1, 2, 4, 5, 6, 10, 11],
      [
        { t: 8, tone: "match" },
        { t: 9, tone: "match" },
        { t: 9.5, tone: "match" },
      ],
      5,
      "window (0.1, 10.1], 3 entries, Retry-After: 8",
    ),
    slidingStep(
      'Request at <code>t=18.5</code>. The cutoff is now 8.5, so the filter on line 5 <span class="hl-stack">drops 8.0</span>. It was accepted 10.5 s ago and no longer counts. Expired entries are pruned lazily, on the next request, rather than by a timer.',
      5,
      [1, 2, 4],
      [
        { t: 8, tone: "muted" },
        { t: 9, tone: "match" },
        { t: 9.5, tone: "match" },
      ],
      5,
      "window (8.5, 18.5], 8.0 expired, 2 entries remain",
    ),
    slidingStep(
      'Two entries remain, which is under 3, so <span class="hl-task">18.5 is pushed</span> and the request is accepted. The log is [9.0, 9.5, 18.5]. Each key stores up to <code>LIMIT</code> timestamps, so memory grows with the limit, not with traffic, but a limit of 1000 per hour means 1000 numbers per active key.',
      7,
      [1, 2, 4, 5, 6],
      [
        { t: 9, tone: "match" },
        { t: 9.5, tone: "match" },
        { t: 18.5, tone: "active" },
      ],
      6,
      "window (8.5, 18.5], 3 entries, remaining 0",
    ),
    slidingStep(
      'Redis limiters usually avoid the log and keep two counters instead, the previous and current fixed window. The estimate is <code>prev * (1 - position) + current</code>. At <code>t=10.1</code> that is <code>3 * 0.99 + 0 = 2.97</code>, under 3, so <span class="hl-micro">the approximation would have accepted</span> the request the exact log rejected. Two integers per key, slightly permissive at the edges.',
      null,
      [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      [
        { t: 9, tone: "match" },
        { t: 9.5, tone: "match" },
        { t: 18.5, tone: "match" },
      ],
      6,
      "sliding counter at t=10.1: prev 3 * (1 - 0.01) + current 0 = 2.97 < 3",
    ),
    slidingStep(
      'Server-side limiting protects the API from any client, cooperative or not. Client-side <span class="hl-micro">debounce and throttle</span> reduce how often one well-behaved client calls, but they run in code the attacker controls. Use both: throttle in the browser for UX, limit at the edge or in Redis for safety, and read <code>Retry-After</code> before retrying.',
      21,
      [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20],
      [
        { t: 9, tone: "match" },
        { t: 9.5, tone: "match" },
        { t: 18.5, tone: "match" },
      ],
      6,
      "4 accepted, 2 rejected. Exact at every instant, O(limit) memory per key",
    ),
  ],
};

export const EXAMPLES: RateLimitExample[] = [tokenBucket, fixedWindow, slidingWindow];
