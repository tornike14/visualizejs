import type { TopicTheoryContent } from "@/content/theory/types";

export const cachingStrategiesTheory: TopicTheoryContent = {
  summary:
    "A cache keeps a copy of expensive data somewhere cheaper to read, so repeated requests skip the database or origin. The strategy decides who fills the cache, when it is updated, and what happens when the copy and the source disagree.",
  whatItIs: [
    "Every request that reaches a database pays for disk reads, query planning, and a network hop to a machine that all other requests are also hitting. A cache, whether an in-process Map, a Redis instance, or a CDN edge, stores the result of that work so the next request for the same key returns in a millisecond or two instead of a hundred. Caches buy two things at once: lower latency for the caller and lower load on the source.",
    "The strategy is the set of rules that connects the cache to the source of truth. Cache-aside puts the application in charge: check the cache, fall back to the database on a miss, write the result back with a TTL. Write-through updates the database and the cache in the same operation, so reads always see the latest write. Write-behind updates the cache immediately and queues the database write, which makes writes fast but leaves a window where the queue is the only copy.",
    "Every copy can drift from its source, and the two hard problems follow from that. Invalidation is deciding which keys a write affects and removing them, which requires the writing code to know every cached shape of the data. Stale reads are what happens when invalidation is missed: the cache answers quickly with data the database no longer holds. A TTL bounds how long that can last, which is why even a well-invalidated cache still sets one.",
    "Caches are bounded, so a full cache must evict. LRU removes the key that has gone longest without a read, on the bet that recent use predicts future use. Redis approximates it by sampling a few keys rather than tracking a full list, and offers LFU for workloads where one-off reads would otherwise flush the hot set. HTTP caching applies the same ideas one layer out: Cache-Control max-age is the TTL, and an ETag revalidation is the check that a cached copy still matches the origin.",
  ],
  howItWorks: [
    "Step 1: the application builds a cache key from the request, for example user:42, and asks the cache for it. The key is the only thing the cache and the database share, so it must be derived identically on every read and write path.",
    "Step 2: on a hit the cached bytes are deserialized and returned, typically in 1 to 2 ms. The database never sees the request.",
    "Step 3: on a miss the application queries the source, serializes the row, and stores it with a TTL such as EX 60. A cold miss costs the cache round trip plus the full query, so it is slightly slower than having no cache.",
    "Step 4: when the TTL elapses the cache drops the key. If many requests arrive at that instant they all miss and run the same query, the thundering herd. A per-key lock, jittered TTLs, or serving the stale value while one request revalidates keeps the herd off the database.",
    "Step 5: a write updates the source of truth, then either deletes the cached key (cache-aside), overwrites it in the same operation (write-through), or updates it first and queues the source write for a background flush (write-behind).",
    "Step 6: when the cache reaches capacity it evicts. An LRU built on a Map deletes and re-inserts a key on every read so the first key in iteration order is always the least recently used, and set removes that key before inserting a new one.",
  ],
  commonMistakes: [
    {
      title: "Writing to the database without invalidating",
      explanation:
        "The update path was written separately from the read path, so it commits the row and forgets that a cached copy exists. Every read until the TTL expires returns the old value, fast and wrong.",
      fix: "Delete the cached key right after the write commits, and prefer delete over overwrite so the next reader rebuilds the entry from the row the database actually has.",
    },
    {
      title: "Caching without a TTL",
      explanation:
        "An entry with no expiry survives every missed invalidation forever, and a cache full of keys that are never read again still consumes memory until eviction pressure removes them.",
      fix: "Always set a TTL that bounds how stale an entry can be, even when invalidation is in place. Treat the TTL as the safety net, not the primary consistency mechanism.",
    },
    {
      title: "Using write-behind for data that cannot be lost",
      explanation:
        "Write-behind confirms the write to the caller before any durable store has seen it. A crash before the queue drains loses every pending write, and once the cache restarts there is no trace of them.",
      fix: "Reserve write-behind for counters, view tallies, and session touches. For anything a user would notice losing, use write-through or a durable queue such as Redis Streams or Kafka in front of the flush.",
    },
    {
      title: "Treating an LRU read as free",
      explanation:
        "Every hit moves the key to the most recent position. A one-off scan that reads every key once pushes the genuinely hot entries to the least recent end and evicts them on the next insert.",
      fix: "Keep bulk scans and exports away from the application cache, size the cache for the working set rather than the dataset, or switch to an LFU policy when frequency predicts reuse better than recency.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is cache-aside and what does a miss cost?",
      answer:
        "Cache-aside means the application owns the lookup: it checks the cache, queries the database on a miss, and writes the result back with a TTL. A miss costs the cache round trip plus the full query, so a cold cache is marginally slower than no cache. The saving is deferred to every later read that hits.",
      codeExample: {
        code: `async function getUser(id) {
  const key = \`user:\${id}\`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  const row = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  await redis.set(key, JSON.stringify(row), 'EX', 60);
  return row;
}`,
      },
    },
    {
      question:
        "What is the difference between write-through and write-behind?",
      answer:
        "Write-through updates the database and the cache in the same request, so writes pay database latency but reads always see the latest value. Write-behind updates the cache and queues the database write for a background flush. Writes return in a couple of milliseconds and bursts can batch, but a crash before the flush loses the queued writes.",
    },
    {
      question: "Why is cache invalidation considered hard?",
      answer:
        "The code that writes has to know every cached key the write affects, and those keys may be shaped differently from the row: a user profile, a list page that includes the user, an aggregate count. Missing one leaves a stale copy that is served quickly and confidently until its TTL expires. Deleting the key rather than overwriting it, and keeping the set of cached shapes small, limits the damage.",
    },
    {
      question: "How would you implement an LRU cache in JavaScript?",
      answer:
        "Use a Map, which iterates in insertion order. On get, delete and re-insert the key so it becomes the newest entry. On set of a new key when the map is full, delete the first key from map.keys(), which is the least recently used, then insert. Both operations are O(1).",
      codeExample: {
        code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }
  set(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      this.map.delete(this.map.keys().next().value);
    }
    this.map.set(key, value);
  }
}`,
      },
    },
    {
      question: "What is a thundering herd and how do you prevent it?",
      answer:
        "When a popular key expires, every concurrent request misses at the same moment and all of them run the same query against the database. Mitigations include a per-key lock so only one caller refills while the rest wait, adding jitter to TTLs so keys do not expire together, and serving the stale value while a single request revalidates in the background.",
    },
  ],
  relatedTopicIds: [
    "database-indexing",
    "http-request-lifecycle",
    "rate-limiting",
    "garbage-collection",
  ],
};
