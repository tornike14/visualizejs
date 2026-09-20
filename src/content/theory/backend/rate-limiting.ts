import type { TopicTheoryContent } from "@/content/theory/types";

export const rateLimitingTheory: TopicTheoryContent = {
  summary:
    "Rate limiting caps how many requests a client may make in a period of time. The server tracks usage per client key, accepts requests inside the budget, and answers the rest with 429 Too Many Requests and a Retry-After header.",
  whatItIs: [
    "An API without a rate limit is only as available as its most aggressive caller. A buggy retry loop, a scraper, or a credential stuffing attack can consume all of the database connections and CPU that every other client depends on. Rate limiting gives each client a budget and enforces it before the request reaches expensive code.",
    "Every limiter answers the same question, has this key made too many requests recently, but they differ in what they store. A fixed window keeps one counter per clock-aligned window. A token bucket keeps a fractional token count and a timestamp, refilling continuously and allowing bursts up to the capacity. A sliding window log keeps the timestamp of each accepted request and counts the ones inside the last N seconds, which is exact but costs one entry per request.",
    "The key decides what is being protected. Limiting by IP address is the default at the edge and stops anonymous floods, but shared NATs and mobile carriers put thousands of users behind one address. Limiting by API key or user id after authentication is fairer and lets you sell tiers. Many systems apply both, a loose IP limit at the load balancer and a per-account limit in the application.",
    "The state has to be shared. A Map inside one Node process only limits that process, so three instances behind a load balancer silently triple the budget. Production limiters keep counters in Redis and run the check and the update as one atomic operation, either INCR with EXPIRE or a short Lua script, so two instances cannot both read 2 and both accept when the limit is 3.",
  ],
  howItWorks: [
    "Step 1: the middleware derives a key from the request, typically the client IP, the API key, or the authenticated user id, sometimes combined with the route so a login endpoint has a tighter budget than a read endpoint.",
    "Step 2: it loads the state for that key. For a token bucket that is the token count and the last refill time, for a fixed window it is the count and the window start, for a sliding log it is the list of recent timestamps.",
    "Step 3: it brings the state up to the current time. The bucket adds elapsed seconds times the refill rate, capped at capacity. The fixed window resets the count if the clock has crossed into a new window. The sliding log drops timestamps older than now minus the window.",
    "Step 4: it decides. If a token is available, or the count is under the limit, or fewer than the limit timestamps remain, the request is accepted and the state is updated (a token spent, the count incremented, the timestamp pushed). Otherwise the request is rejected and the state is left as it is, so rejected requests do not extend the lockout.",
    "Step 5: the state is written back atomically. In Redis the load, update, and store happen inside one command or one Lua script so concurrent requests from other instances cannot interleave between the read and the write.",
    "Step 6: the response carries the verdict. Accepted requests continue to the handler with X-RateLimit-Limit and X-RateLimit-Remaining headers. Rejected requests get 429 and a Retry-After value in whole seconds, computed from when the next token or slot becomes available and rounded up.",
  ],
  commonMistakes: [
    {
      title: "Counting the window from a clock boundary",
      explanation:
        "A fixed window resets at t=10, t=20, and so on, so a client can send its full budget at t=9.9 and again at t=10.1. Two adjacent windows spent at the boundary give twice the nominal rate over a short interval.",
      fix: "Use a sliding window log when exactness matters, or the sliding window counter approximation, prev * (1 - position) + current, when you want two integers per key and can tolerate a small error at the edges.",
    },
    {
      title: "Keeping limiter state in process memory",
      explanation:
        "A Map in a Node process is invisible to the other instances behind the load balancer. Each instance enforces its own copy of the limit, so the effective limit is multiplied by the instance count and resets on every deploy.",
      fix: "Store the counter or bucket in Redis and perform the read, update, and write in one atomic step: INCR plus EXPIRE for fixed windows, or a Lua script for token buckets.",
    },
    {
      title: "Recording rejected requests in the log",
      explanation:
        "If a sliding log pushes the timestamp of every request, including rejected ones, a client that keeps retrying keeps pushing its own unlock time further away and can never recover, and the log grows without bound under attack.",
      fix: "Only accepted requests count toward the limit. Push the timestamp inside the accepted branch, and prune expired entries on every call so the log never exceeds the limit in length.",
    },
    {
      title: "Returning 429 without Retry-After",
      explanation:
        "A bare 429 tells the client to stop but not for how long, so SDKs fall back to guessing, usually exponential backoff starting from a fixed value. That wastes capacity when the lockout is short and hammers the server when it is long.",
      fix: "Compute the seconds until the next token or slot, round up, and send it as Retry-After. Add X-RateLimit-Remaining on every response so well-behaved clients can slow down before they hit the wall.",
    },
  ],
  interviewQuestions: [
    {
      question:
        "What is the difference between a token bucket and a fixed window limiter?",
      answer:
        "A fixed window counts requests per clock-aligned interval and resets the count at the boundary, which is cheap but lets a client double its budget by straddling the reset. A token bucket refills continuously at a fixed rate up to a capacity, so it allows a burst up to the capacity while capping the long-run average, and it has no boundary to exploit.",
      codeExample: {
        language: "javascript",
        code: `function allow(bucket, now, capacity = 5, ratePerSec = 1) {
  const elapsed = (now - bucket.last) / 1000;
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * ratePerSec);
  bucket.last = now;
  if (bucket.tokens < 1) return false;
  bucket.tokens -= 1;
  return true;
}`,
      },
    },
    {
      question: "How do you rate limit across multiple server instances?",
      answer:
        "Keep the state in a shared store, almost always Redis, and make the check and update atomic. For a fixed window, INCR the key for the current window and set EXPIRE on the first hit; the returned value tells you whether the request is over the limit. For a token bucket, run the refill and spend in a Lua script so no other instance can interleave between the read and the write.",
      codeExample: {
        language: "javascript",
        code: `const key = \`rl:\${ip}:\${Math.floor(Date.now() / 10_000)}\`;
const count = await redis.incr(key);
if (count === 1) await redis.expire(key, 10);
if (count > 3) {
  res.set("Retry-After", "10");
  return res.status(429).end();
}
next();`,
      },
    },
    {
      question:
        "What does a 429 response mean and which headers should accompany it?",
      answer:
        "429 Too Many Requests means the client has exceeded its budget and the request was not processed. Retry-After tells the client how many seconds to wait, rounded up. X-RateLimit-Limit and X-RateLimit-Remaining, sent on every response, let clients pace themselves before they are rejected. The newer RateLimit-Policy header from the IETF draft standardizes the same information.",
    },
    {
      question: "What should you use as the rate limit key?",
      answer:
        "It depends on what you are protecting. IP address works for anonymous traffic at the edge but punishes users behind a shared NAT. After authentication, the API key or user id is fairer and supports per-tier limits. Sensitive endpoints such as login often combine keys, for example a per-IP limit and a per-account limit, so neither a distributed attack nor a single abusive account gets through.",
    },
    {
      question:
        "How does server-side rate limiting differ from debounce and throttle on the client?",
      answer:
        "Debounce and throttle run in the browser and reduce how often a cooperative client fires a call, which improves UX and saves bandwidth. They cannot protect the server, because an attacker controls the client code. Rate limiting runs on the server or at the edge and enforces the budget regardless of the client. Use throttle for typing and scrolling, and a server limiter for the API.",
    },
  ],
  relatedTopicIds: [
    "http-request-lifecycle",
    "caching-strategies",
    "jwt-authentication",
    "debounce-throttle",
  ],
};
