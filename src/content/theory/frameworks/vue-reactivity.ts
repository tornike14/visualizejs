import type { TopicTheoryContent } from "@/content/theory/types";

export const vueReactivityTheory: TopicTheoryContent = {
  summary:
    "Vue's reactivity system intercepts property reads and writes with Proxy traps and ref accessors, records which effect read which property, and re-runs exactly those effects when the property changes.",
  whatItIs: [
    "In Vue you mutate state directly: state.count++ or count.value++. There is no setter function to call and no dependency array to declare. The framework still knows what to update because every reactive object is a Proxy and every ref is an object with an accessor, so each read and write passes through code Vue controls.",
    "That interception feeds two operations. During an effect's run, the get trap calls track(target, key), which adds the currently running effect to a Dep set stored under that target and key in a global WeakMap called targetMap. When a write reaches the set trap, trigger(target, key) looks up the same Dep and schedules every effect in it. The set of dependencies is rebuilt on every run, so a branch that stops reading a property also stops subscribing to it.",
    "Effects come in a few forms with the same core. watchEffect and watch wrap a user callback. computed wraps a getter, caches the result, and flips a dirty flag on trigger instead of recomputing eagerly. A component's render function is also an effect, which is why a Vue component re-renders only when a property it actually read changes, rather than on every state update it owns as in React.",
    "Triggered effects do not run inline by default. A scheduler pushes them into a job queue, deduplicates by identity, and flushes the queue in a single microtask. Several synchronous writes therefore produce one re-run. nextTick returns the promise that resolves after that flush. Vue 3.4 rewrote the internals around version counters so a computed can check whether any dependency changed without re-walking its subscriptions, and 3.5 lowered memory use further, but the track and trigger model is unchanged.",
  ],
  howItWorks: [
    "Step 1: reactive(obj) creates a Proxy with get, set, has, deleteProperty, and ownKeys handlers and caches it in a WeakMap so the same raw object always maps to the same proxy. ref(value) creates a RefImpl whose value accessor pair does the same job for a single slot, which is how primitives become observable.",
    "Step 2: creating an effect (watchEffect, computed, a component render) wraps the function in a ReactiveEffect. Running it sets the global activeEffect to that instance for the duration of the call, so any interceptor that fires during the run can identify the reader.",
    "Step 3: a get trap or ref getter calls track(target, key). If activeEffect is set, track finds or creates targetMap.get(raw).get(key), a Dep, and links the effect to it. If activeEffect is undefined, for example during a read at module scope or inside an event handler, nothing is recorded.",
    "Step 4: a set trap or ref setter writes the new value, compares it with the old one using Object.is, and calls trigger(target, key) only when they differ. trigger collects the effects in that Dep. Adding or deleting a key also triggers effects that iterated the object, which is why ownKeys and has are trapped too.",
    "Step 5: each collected effect is handed to its scheduler. A plain effect runs immediately, a computed is marked dirty and notifies its own subscribers, and a watchEffect or render effect is pushed into the job queue. queueJob ignores an effect that is already queued and schedules one flushJobs microtask if none is pending.",
    "Step 6: flushJobs runs pre-flush jobs, then component updates sorted by component id so parents render before children, then post-flush jobs such as watchers with flush: 'post'. Each run resets activeEffect, re-executes the function, and rebuilds its dependency set, after which the nextTick promise resolves.",
  ],
  commonMistakes: [
    {
      title: "Destructuring a reactive object",
      explanation:
        "const { total } = state reads state.total once through the get trap and stores the plain value in a local variable. The variable has no interceptor, so an effect that reads it records no dependency and never re-runs.",
      fix: "Keep property access on the proxy inside the effect, or convert with toRefs(state) so each destructured binding is an ObjectRefImpl whose .value forwards to the proxy.",
    },
    {
      title: "Forgetting .value on a ref in script",
      explanation:
        "Templates and reactive() objects unwrap refs automatically, so it is easy to write count++ in a script block. That reassigns the local variable to NaN or a new number and discards the RefImpl entirely.",
      fix: "Always read and write count.value in JavaScript. Use ref for primitives and reactive for objects you never reassign, and let the template compiler handle unwrapping.",
    },
    {
      title: "Expecting the DOM to update synchronously",
      explanation:
        "After state.count++ the DOM still shows the old value because the render effect is queued and runs in a microtask. Code that measures the DOM right after a write reads stale layout.",
      fix: "await nextTick() before reading the DOM, or put the measurement in a watcher with flush: 'post'. Do not switch effects to flush: 'sync' just to make a test pass, that removes batching.",
    },
    {
      title: "Relying on a computed for side effects",
      explanation:
        "A computed getter runs lazily, only when something reads .value and a dependency changed. A side effect placed inside it may run late, several times, or never, depending on who reads the computed.",
      fix: "Keep computed getters pure and use watch or watchEffect for side effects. If a value must be recalculated eagerly on change, a watcher with an explicit source expresses that intent.",
    },
  ],
  interviewQuestions: [
    {
      question: "How does Vue know which effects to re-run when a property changes?",
      answer:
        "Every reactive object is a Proxy. While an effect runs, Vue sets a global activeEffect, and the get trap calls track(target, key) to add that effect to a Dep stored in targetMap under the object and key. The set trap calls trigger(target, key), which schedules every effect in that Dep. Dependencies are collected from actual reads, so there is no declaration step.",
      codeExample: {
        language: "javascript",
        code: `const state = reactive({ count: 0, name: 'Ada' })

watchEffect(() => console.log(state.count))
// get trap: track(state, 'count') -> Dep { effect }

state.name = 'Bob'  // set trap: no Dep for 'name', nothing runs
state.count = 1     // set trap: trigger(state, 'count') -> effect queued`,
      },
    },
    {
      question: "What is the difference between ref and reactive, and why do both exist?",
      answer:
        "reactive wraps an object in a Proxy, so it cannot hold a primitive and stops tracking if you reassign or destructure it. ref wraps any value in a RefImpl object with a value accessor, so primitives become observable and the wrapper can be passed around or returned from a composable without losing reactivity. Inside reactive objects and templates, refs are unwrapped automatically.",
      codeExample: {
        language: "javascript",
        code: `const count = ref(0)           // RefImpl { value: 0 }
count.value++                  // setter -> triggerRefValue

const state = reactive({ n: 1 })
const { n } = state            // n is a plain 1, not reactive
const { n: nRef } = toRefs(state)
nRef.value                     // forwards to state.n through the Proxy`,
      },
    },
    {
      question: "How does computed caching work, and when does the getter actually run?",
      answer:
        "computed creates a ComputedRefImpl with a dirty flag and a cached value. Reading .value runs the getter only when dirty is true, then caches the result and clears the flag. When a dependency triggers, the computed is marked dirty and its own subscribers are notified, but the getter is not re-run until someone reads .value again. Vue 3.4 backs this with version counters so an unchanged computed can return its cache without walking its dependencies.",
    },
    {
      question: "Why does the DOM not update immediately after a state mutation, and what does nextTick do?",
      answer:
        "Triggered render effects are pushed into a job queue rather than run inline. queueJob deduplicates by effect identity and schedules a single flushJobs microtask, so multiple synchronous writes produce one render. nextTick returns the promise chained after that flush, so awaiting it guarantees the DOM reflects the latest state.",
    },
    {
      question: "How does Vue's reactivity differ from React's re-render model?",
      answer:
        "React re-runs the whole component function when any of its state changes and then diffs the output, relying on memoization to skip children. Vue tracks reads at the property level, so a component's render effect re-runs only when a property it read changes, and unrelated state updates cost nothing. The trade-off is that Vue state must stay inside proxies or refs, and copying a value out of them silently breaks tracking.",
    },
  ],
  relatedTopicIds: ["svelte-runes", "angular-change-detection", "render-cycle", "hooks", "closures"],
};
