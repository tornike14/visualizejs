import type { TopicTheoryContent } from "@/content/theory/types";

export const svelteRunesTheory: TopicTheoryContent = {
  summary:
    "Runes are the Svelte 5 reactivity primitives. $state creates a signal, $derived creates a lazy memoized computation, and $effect subscribes to whatever it reads, while the compiler turns each template expression into a direct DOM write with no virtual DOM in between.",
  whatItIs: [
    "In Svelte 4, reactivity was tied to assignment inside a component: the compiler instrumented every `x = ...` statement it could see. That worked inside a .svelte file and broke as soon as state moved into a plain module or a function. Runes replace that with explicit primitives that behave the same everywhere: $state, $derived and $effect are compiler keywords that expand into calls to a small signal runtime.",
    "A $state value is a source signal: an object holding the current value, a version number, and a list of reactions that read it. $derived creates a derived signal that stays unevaluated until something reads it, then caches the result and records which sources it touched. $effect creates an effect that runs after the DOM has been updated and re-runs whenever one of its dependencies changes. Dependencies are never declared; they are collected by tracking reads while the function runs.",
    "The graph is push-pull. A write to a source pushes a dirty flag along its recorded edges: deriveds that read it become dirty, and reactions of those deriveds become maybe-dirty, since a derived may recompute to an equal value. Nothing recomputes at write time. A microtask flush then runs the queued effects, and each effect pulls fresh values as it reads them, which is what finally recomputes a dirty derived. Equal results stop propagation early.",
    "The other half is the compiler. Because markup is static, Svelte knows at build time that a given text node depends on a given expression. It emits a template string that is cloned into real DOM once, then a template effect per dynamic expression that calls set_text or set_attribute on the exact node it owns. There is no tree of virtual nodes to build on every update and no diff to find what changed, because the dependency between signal and node was resolved before the code ran.",
  ],
  howItWorks: [
    "Step 1: the compiler rewrites `let count = $state(0)` to `let count = $.state(0)`, and every read of count to `$.get(count)` and every write to `$.set(count, ...)`. For objects and arrays, $state wraps the value in a Proxy that lazily creates one source per property on first read.",
    "Step 2: markup becomes `$.template('<button> </button>')`. On mount the template is cloned with cloneNode, and the compiler emits `$.child` and `$.sibling` calls that grab references to the nodes that hold dynamic expressions.",
    "Step 3: each dynamic expression becomes a `$.template_effect`. It runs immediately: reading a signal inside it registers the effect as a reaction of that signal, and reading an unread $derived computes it now and links it to the sources it touched. The effect writes the result into its node.",
    "Step 4: user effects created with $effect are scheduled to run after mount, in a microtask, once the DOM is in place. They subscribe to whatever they read.",
    "Step 5: a write such as `count++` compiles to `$.update(count)`. It bumps the source version, marks direct reactions dirty and reactions-of-deriveds maybe-dirty, and queues one flush. Multiple writes in the same tick share that flush.",
    "Step 6: the flush runs template effects first, then user effects. A maybe-dirty effect first checks whether its derived dependencies actually changed version; if not, it is skipped. Each running effect re-collects its dependencies from scratch, so the graph always reflects the last run.",
  ],
  commonMistakes: [
    {
      title: "Destructuring $state and expecting it to stay reactive",
      explanation:
        "`const { done } = todos[0]` copies the value out of the proxy. The compiler can only rewrite reads of the variable itself, so the copy is a plain boolean that never updates.",
      fix: "Read through the proxy where the value is used, or wrap the read in $derived if you want a named reactive alias: `const done = $derived(todos[0].done)`.",
    },
    {
      title: "Mutating $state.raw and waiting for an update",
      explanation:
        "$state.raw stores the object without a Proxy, so `raw.n = 1` is an ordinary property write that no trap observes. The source is only written on reassignment.",
      fix: "Reassign the whole value (`raw = { ...raw, n: 1 }`) or use plain $state when nested mutation needs to be tracked. Reserve $state.raw for large or immutable data.",
    },
    {
      title: "Using $effect to derive state",
      explanation:
        "Writing `$effect(() => { double = count * 2 })` works but runs after the DOM update, so the first render sees the stale value, and it turns a pure computation into a side effect that can chain into further flushes.",
      fix: "Use $derived for values computed from other state. It is lazy, memoized, and consistent within the same flush. Keep $effect for real side effects such as logging, timers or imperative DOM APIs.",
    },
    {
      title: "Reading state after a write and expecting the DOM to match",
      explanation:
        "Signals update synchronously but effects, including template effects, run in a later microtask. Reading `element.textContent` right after `count++` returns the old text.",
      fix: "Await `tick()` from svelte before reading the DOM, or move the DOM read into an $effect that depends on the same state.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is the difference between $state and $derived?",
      answer:
        "$state creates a source signal that you write to directly. $derived creates a derived signal computed from other signals; it is lazy, so the expression does not run until something reads it, and memoized, so repeated reads return the cached value until a dependency changes. You never assign to a $derived.",
      codeExample: {
        code: `let count = $state(0);
let double = $derived(count * 2);

// double is not computed yet
count = 5;
console.log(double); // computes now, 10
console.log(double); // cached, no recompute`,
      },
    },
    {
      question: "Why does Svelte 5 not need a virtual DOM?",
      answer:
        "The compiler sees the markup at build time, so it knows which text node or attribute depends on which expression. It emits one template effect per expression that writes directly to that node with set_text or set_attribute. A signal write marks only those effects dirty, so there is no need to rebuild a tree and diff it to discover what changed.",
    },
    {
      question: "What does push-pull mean in the signal graph?",
      answer:
        "A write pushes dirty flags along the recorded dependency edges without recomputing anything. When the flush runs an effect, the effect pulls values by reading them, and a dirty derived recomputes at that moment. This keeps writes cheap and avoids computing values nobody reads.",
    },
    {
      question: "When does an $effect run relative to the DOM update, and how does it know its dependencies?",
      answer:
        "Effects run in a microtask after template effects have updated the DOM, so DOM reads inside them see the new state. Dependencies are collected by tracking every signal read while the callback runs, and they are re-collected on each run, so conditional reads change the subscription set.",
      codeExample: {
        code: `let open = $state(false);
let name = $state('a');

$effect(() => {
  // subscribes to name only while open is true
  if (open) console.log(name);
});`,
      },
    },
    {
      question: "How does $state track nested writes like todos[0].done = true?",
      answer:
        "$state wraps objects and arrays in a Proxy. The get trap lazily creates a source signal per property the first time it is read and nests another proxy for object values. The set trap writes that per-property source, so only reactions that read todos[0].done are marked dirty; the array length and other items are unaffected.",
    },
  ],
  relatedTopicIds: [
    "vue-reactivity",
    "angular-change-detection",
    "virtual-dom",
    "memoization",
  ],
};
