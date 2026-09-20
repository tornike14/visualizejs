import type {
  BindingEntry,
  DepEntry,
  SchedulerState,
  TrapEntry,
  VueReactivityExample,
} from "./types";

const IDLE: SchedulerState = {
  activeEffect: null,
  queue: [],
  flushPending: false,
  ranNow: [],
};

const sched = (patch: Partial<SchedulerState>): SchedulerState => ({
  ...IDLE,
  ...patch,
});

const dep = (
  target: string,
  key: string,
  effects: string[],
  status: DepEntry["status"] = "idle",
): DepEntry => ({ target, key, effects, status });

/* ------------------------------------------------------------------ */
/* Example 1: track and trigger                                        */
/* ------------------------------------------------------------------ */

const t1GetCount: TrapEntry = {
  id: "t1-get-count",
  op: "get",
  target: "state",
  key: "count",
  value: "0",
  result: "track",
  note: "activeEffect is effect#1, so track() adds it to the Dep for count.",
};
const t1SetName: TrapEntry = {
  id: "t1-set-name",
  op: "set",
  target: "state",
  key: "name",
  value: "'Bob'",
  result: "miss",
  note: "trigger() finds no Dep for name. The raw object is updated, nothing is scheduled.",
};
const t1GetCount2: TrapEntry = {
  id: "t1-get-count-2",
  op: "get",
  target: "state",
  key: "count",
  value: "0",
  result: "noop",
  note: "count++ reads first. activeEffect is undefined, so track() returns early.",
};
const t1SetCount1: TrapEntry = {
  id: "t1-set-count-1",
  op: "set",
  target: "state",
  key: "count",
  value: "1",
  result: "trigger",
  note: "hasChanged(0, 1) is true. trigger() schedules every effect in the Dep for count.",
};
const t1GetCount3: TrapEntry = {
  id: "t1-get-count-3",
  op: "get",
  target: "state",
  key: "count",
  value: "1",
  result: "noop",
  note: "Second count++ reads outside any effect. Nothing tracked.",
};
const t1SetCount2: TrapEntry = {
  id: "t1-set-count-2",
  op: "set",
  target: "state",
  key: "count",
  value: "2",
  result: "trigger",
  note: "trigger() runs again, but queueJob() skips effect#1 because it is already queued.",
};
const t1GetCountFlush: TrapEntry = {
  id: "t1-get-count-flush",
  op: "get",
  target: "state",
  key: "count",
  value: "2",
  result: "track",
  note: "Re-run inside flushJobs. activeEffect is effect#1 again, so the Dep is refreshed.",
};

const trackExample: VueReactivityExample = {
  id: "track-trigger",
  title: "Track and Trigger",
  description:
    "A Proxy get trap records which effect read a property, and the set trap re-runs only those effects.",
  kind: "track",
  codeLines: [
    { num: 1, text: "import { reactive, watchEffect, nextTick } from 'vue'" },
    { num: 2, text: "" },
    { num: 3, text: "const state = reactive({ count: 0, name: 'Ada' })" },
    { num: 4, text: "" },
    { num: 5, text: "watchEffect(() => {" },
    { num: 6, text: "  console.log('double', state.count * 2)" },
    { num: 7, text: "})" },
    { num: 8, text: "" },
    { num: 9, text: "state.name = 'Bob'" },
    { num: 10, text: "state.count++" },
    { num: 11, text: "state.count++" },
    { num: 12, text: "await nextTick()" },
  ],
  steps: [
    {
      descriptionHtml:
        '<code>reactive()</code> wraps the plain object in a <span class="hl-api">Proxy</span> with <code>get</code>, <code>set</code>, <code>has</code>, and <code>deleteProperty</code> handlers, and caches the pair in a WeakMap so the same object always yields the same proxy. No trap has fired yet, so <code>targetMap</code> is empty.',
      activeLine: 3,
      doneLines: [1],
      traps: [],
      deps: [],
      scheduler: IDLE,
      computed: null,
      bindings: null,
      consoleOutput: [],
    },
    {
      descriptionHtml:
        '<code>watchEffect()</code> creates a <code>ReactiveEffect</code> around the callback and runs it immediately. Before the callback body executes, <code>effect.run()</code> sets the global <span class="hl-api">activeEffect</span> to <strong>effect#1</strong> so any trap that fires knows who is reading.',
      activeLine: 5,
      doneLines: [1, 3],
      traps: [],
      deps: [],
      scheduler: sched({ activeEffect: "effect#1" }),
      computed: null,
      bindings: null,
      consoleOutput: [],
    },
    {
      descriptionHtml:
        'Reading <code>state.count</code> hits the <code>get</code> trap. It calls <span class="hl-task">track(target, "count")</span>, which looks up <code>targetMap.get(raw)</code>, then <code>depsMap.get("count")</code>, creates the missing Dep, and adds <strong>effect#1</strong> to it. This is the only place a dependency is ever recorded.',
      activeLine: 6,
      doneLines: [1, 3, 5],
      traps: [t1GetCount],
      deps: [dep("state", "count", ["effect#1"], "tracking")],
      scheduler: sched({ activeEffect: "effect#1" }),
      computed: null,
      bindings: null,
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "The callback logs <code>double 0</code> and returns. <code>run()</code> restores <code>activeEffect</code> to <code>undefined</code>. Note what is missing: <code>state.name</code> was never read, so there is no Dep for <code>name</code> and no effect will ever react to it.",
      activeLine: 7,
      doneLines: [1, 3, 5, 6],
      traps: [t1GetCount],
      deps: [dep("state", "count", ["effect#1"])],
      scheduler: IDLE,
      computed: null,
      bindings: null,
      consoleOutput: ["double 0"],
    },
    {
      descriptionHtml:
        '<code>state.name = \'Bob\'</code> hits the <code>set</code> trap. The write lands on the raw object through <code>Reflect.set</code>, then <span class="hl-stack">trigger(target, "name")</span> looks for a Dep and finds none. Nothing is scheduled: an untracked write is free.',
      activeLine: 9,
      doneLines: [1, 3, 5, 6, 7],
      traps: [t1GetCount, t1SetName],
      deps: [dep("state", "count", ["effect#1"])],
      scheduler: IDLE,
      computed: null,
      bindings: null,
      consoleOutput: ["double 0"],
    },
    {
      descriptionHtml:
        "<code>state.count++</code> is a read followed by a write. The <code>get</code> trap fires first, but <code>activeEffect</code> is <code>undefined</code> because this runs in module scope, so <code>track()</code> returns without touching the map.",
      activeLine: 10,
      doneLines: [1, 3, 5, 6, 7, 9],
      traps: [t1GetCount, t1SetName, t1GetCount2],
      deps: [dep("state", "count", ["effect#1"])],
      scheduler: IDLE,
      computed: null,
      bindings: null,
      consoleOutput: ["double 0"],
    },
    {
      descriptionHtml:
        'The <code>set</code> trap writes <code>1</code>, sees the value changed, and calls <span class="hl-stack">trigger(target, "count")</span>. The Dep contains <strong>effect#1</strong>. Because <code>watchEffect</code> attaches a scheduler, the effect is not run inline: <code>queueJob(effect#1)</code> pushes it into the pre-flush queue and queues a single <span class="hl-micro">flushJobs</span> microtask.',
      activeLine: 10,
      doneLines: [1, 3, 5, 6, 7, 9],
      traps: [t1GetCount, t1SetName, t1GetCount2, t1SetCount1],
      deps: [dep("state", "count", ["effect#1"], "triggering")],
      scheduler: sched({ queue: ["effect#1 (pre)"], flushPending: true }),
      computed: null,
      bindings: null,
      consoleOutput: ["double 0"],
    },
    {
      descriptionHtml:
        "The second <code>state.count++</code> writes <code>2</code> and triggers again, but <code>queueJob</code> deduplicates: <strong>effect#1</strong> is already in the queue, so it is not added twice. Two writes, one pending run. This is how Vue batches synchronous mutations.",
      activeLine: 11,
      doneLines: [1, 3, 5, 6, 7, 9, 10],
      traps: [
        t1GetCount,
        t1SetName,
        t1GetCount2,
        t1SetCount1,
        t1GetCount3,
        t1SetCount2,
      ],
      deps: [dep("state", "count", ["effect#1"], "triggering")],
      scheduler: sched({ queue: ["effect#1 (pre)"], flushPending: true }),
      computed: null,
      bindings: null,
      consoleOutput: ["double 0"],
    },
    {
      descriptionHtml:
        '<code>await nextTick()</code> yields to the microtask queue. <code>nextTick</code> returns the same promise the scheduler chained <span class="hl-micro">flushJobs</span> onto, so the flush runs before this line resumes. The effect has still not re-run at this point.',
      activeLine: 12,
      doneLines: [1, 3, 5, 6, 7, 9, 10, 11],
      traps: [
        t1GetCount,
        t1SetName,
        t1GetCount2,
        t1SetCount1,
        t1GetCount3,
        t1SetCount2,
      ],
      deps: [dep("state", "count", ["effect#1"])],
      scheduler: sched({ queue: ["effect#1 (pre)"], flushPending: true }),
      computed: null,
      bindings: null,
      consoleOutput: ["double 0"],
    },
    {
      descriptionHtml:
        '<span class="hl-micro">flushJobs</span> drains the queue and calls <code>effect#1.run()</code>. <code>activeEffect</code> is set again, the callback reads <code>state.count</code>, the <code>get</code> trap tracks it (Vue 3.4 compares Dep versions instead of clearing and re-adding), and the log shows <code>double 4</code>. One run for two writes.',
      activeLine: 6,
      doneLines: [1, 3, 5, 7, 9, 10, 11],
      traps: [
        t1GetCount,
        t1SetName,
        t1GetCount2,
        t1SetCount1,
        t1GetCount3,
        t1SetCount2,
        t1GetCountFlush,
      ],
      deps: [dep("state", "count", ["effect#1"], "tracking")],
      scheduler: sched({ activeEffect: "effect#1", ranNow: ["effect#1"] }),
      computed: null,
      bindings: null,
      consoleOutput: ["double 0", "double 4"],
    },
    {
      descriptionHtml:
        'The flush finishes, the <code>nextTick</code> promise resolves, and line 12 continues. A component template is compiled into exactly this kind of effect, which is why a Vue component <span class="hl-task">re-renders only when a property it actually read changes</span>. React, by contrast, re-runs the whole component function on any state update it owns.',
      activeLine: 12,
      doneLines: [1, 3, 5, 6, 7, 9, 10, 11],
      traps: [
        t1GetCount,
        t1SetName,
        t1GetCount2,
        t1SetCount1,
        t1GetCount3,
        t1SetCount2,
        t1GetCountFlush,
      ],
      deps: [dep("state", "count", ["effect#1"])],
      scheduler: IDLE,
      computed: null,
      bindings: null,
      consoleOutput: ["double 0", "double 4"],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Example 2: computed caching                                         */
/* ------------------------------------------------------------------ */

const t2GetCount: TrapEntry = {
  id: "t2-get-count",
  op: "get",
  target: "state",
  key: "count",
  value: "1",
  result: "track",
  note: "activeEffect is the computed's own effect, so the Dep for count now holds computed(double).",
};
const t2SetCount: TrapEntry = {
  id: "t2-set-count",
  op: "set",
  target: "state",
  key: "count",
  value: "5",
  result: "trigger",
  note: "trigger() notifies computed(double). A computed is only marked dirty, its getter does not run here.",
};
const t2GetCount2: TrapEntry = {
  id: "t2-get-count-2",
  op: "get",
  target: "state",
  key: "count",
  value: "5",
  result: "track",
  note: "Recompute on demand. The Dep already holds computed(double); its version is refreshed.",
};

const computedExample: VueReactivityExample = {
  id: "computed-caching",
  title: "Computed Caching",
  description:
    "A computed runs its getter lazily, caches the result, and only recomputes after a dependency changed.",
  kind: "computed",
  codeLines: [
    { num: 1, text: "import { reactive, computed } from 'vue'" },
    { num: 2, text: "" },
    { num: 3, text: "const state = reactive({ count: 1 })" },
    { num: 4, text: "" },
    { num: 5, text: "const double = computed(() => {" },
    { num: 6, text: "  console.log('getter ran')" },
    { num: 7, text: "  return state.count * 2" },
    { num: 8, text: "})" },
    { num: 9, text: "" },
    { num: 10, text: "console.log(double.value)" },
    { num: 11, text: "console.log(double.value)" },
    { num: 12, text: "state.count = 5" },
    { num: 13, text: "console.log('after write')" },
    { num: 14, text: "console.log(double.value)" },
  ],
  steps: [
    {
      descriptionHtml:
        '<code>reactive()</code> returns a <span class="hl-api">Proxy</span> around <code>{ count: 1 }</code>. As before, nothing is tracked until an effect reads through it.',
      activeLine: 3,
      doneLines: [1],
      traps: [],
      deps: [],
      scheduler: IDLE,
      computed: null,
      bindings: null,
      consoleOutput: [],
    },
    {
      descriptionHtml:
        '<code>computed()</code> builds a <code>ComputedRefImpl</code> holding a <code>ReactiveEffect</code> around the getter. The getter is <span class="hl-task">not called yet</span>: a computed is lazy, so the instance starts <code>dirty</code> with no cached value and zero runs.',
      activeLine: 5,
      doneLines: [1, 3],
      traps: [],
      deps: [],
      scheduler: IDLE,
      computed: {
        name: "double",
        dirty: true,
        cached: "undefined",
        evaluations: 0,
        subscribers: [],
      },
      bindings: null,
      consoleOutput: [],
    },
    {
      descriptionHtml:
        'Reading <code>double.value</code> enters the class getter on <code>ComputedRefImpl</code>. This read happens at module scope, so there is no outer effect to subscribe to the computed. The instance is <code>dirty</code>, so it calls <code>effect.run()</code> and <span class="hl-api">activeEffect</span> becomes the computed itself.',
      activeLine: 10,
      doneLines: [1, 3, 5, 8],
      traps: [],
      deps: [],
      scheduler: sched({ activeEffect: "computed(double)" }),
      computed: {
        name: "double",
        dirty: true,
        cached: "undefined",
        evaluations: 0,
        subscribers: [],
      },
      bindings: null,
      consoleOutput: [],
    },
    {
      descriptionHtml:
        'The getter logs, then reads <code>state.count</code>. The <code>get</code> trap fires with <code>activeEffect</code> set to the computed, so <span class="hl-task">track()</span> records <strong>computed(double)</strong> in the Dep for <code>count</code>. A computed is a dependency consumer like any other effect.',
      activeLine: 7,
      doneLines: [1, 3, 5, 6, 8, 10],
      traps: [t2GetCount],
      deps: [dep("state", "count", ["computed(double)"], "tracking")],
      scheduler: sched({ activeEffect: "computed(double)" }),
      computed: {
        name: "double",
        dirty: true,
        cached: "undefined",
        evaluations: 0,
        subscribers: [],
      },
      bindings: null,
      consoleOutput: ["getter ran"],
    },
    {
      descriptionHtml:
        "The getter returns <code>2</code>. The computed stores it as <code>_value</code>, clears <code>dirty</code>, and the outer <code>console.log</code> prints it. In Vue 3.4+ the instance also records the global version counter so later reads can tell whether anything reactive changed since.",
      activeLine: 10,
      doneLines: [1, 3, 5, 6, 7, 8],
      traps: [t2GetCount],
      deps: [dep("state", "count", ["computed(double)"])],
      scheduler: IDLE,
      computed: {
        name: "double",
        dirty: false,
        cached: "2",
        evaluations: 1,
        subscribers: [],
      },
      bindings: null,
      consoleOutput: ["getter ran", "2"],
    },
    {
      descriptionHtml:
        'The second read sees <code>dirty === false</code>. Vue 3.4 goes further: it compares the stored global version with the current one, they match, so it does not even walk the Dep list. The cached <code>2</code> is returned and <span class="hl-task">the getter does not run</span>. No trap fires because <code>double</code> is a class instance, not a Proxy.',
      activeLine: 11,
      doneLines: [1, 3, 5, 6, 7, 8, 10],
      traps: [t2GetCount],
      deps: [dep("state", "count", ["computed(double)"])],
      scheduler: IDLE,
      computed: {
        name: "double",
        dirty: false,
        cached: "2",
        evaluations: 1,
        subscribers: [],
      },
      bindings: null,
      consoleOutput: ["getter ran", "2", "2"],
    },
    {
      descriptionHtml:
        '<code>state.count = 5</code> hits the <code>set</code> trap and <span class="hl-stack">trigger()</span> walks the Dep for <code>count</code>. For a computed subscriber, trigger does not re-run the getter. It bumps the Dep version, flags the computed <code>dirty</code>, and would notify the computed\'s own subscribers, of which there are none. The stale <code>2</code> stays in memory.',
      activeLine: 12,
      doneLines: [1, 3, 5, 6, 7, 8, 10, 11],
      traps: [t2GetCount, t2SetCount],
      deps: [dep("state", "count", ["computed(double)"], "triggering")],
      scheduler: IDLE,
      computed: {
        name: "double",
        dirty: true,
        cached: "2",
        evaluations: 1,
        subscribers: [],
      },
      bindings: null,
      consoleOutput: ["getter ran", "2", "2"],
    },
    {
      descriptionHtml:
        "<code>after write</code> is logged and the getter count is still <strong>1</strong>. Invalidation is eager, recomputation is deferred: a computed that nobody reads after a change costs nothing beyond flipping a flag.",
      activeLine: 13,
      doneLines: [1, 3, 5, 6, 7, 8, 10, 11, 12],
      traps: [t2GetCount, t2SetCount],
      deps: [dep("state", "count", ["computed(double)"])],
      scheduler: IDLE,
      computed: {
        name: "double",
        dirty: true,
        cached: "2",
        evaluations: 1,
        subscribers: [],
      },
      bindings: null,
      consoleOutput: ["getter ran", "2", "2", "after write"],
    },
    {
      descriptionHtml:
        "The third read finds <code>dirty === true</code> (in 3.4 terms, the Dep version moved), so it runs the getter again. <code>activeEffect</code> is the computed, <code>state.count</code> is tracked once more, and <code>getter ran</code> prints a second time.",
      activeLine: 7,
      doneLines: [1, 3, 5, 6, 8, 10, 11, 12, 13],
      traps: [t2GetCount, t2SetCount, t2GetCount2],
      deps: [dep("state", "count", ["computed(double)"], "tracking")],
      scheduler: sched({ activeEffect: "computed(double)" }),
      computed: {
        name: "double",
        dirty: true,
        cached: "2",
        evaluations: 1,
        subscribers: [],
      },
      bindings: null,
      consoleOutput: ["getter ran", "2", "2", "after write", "getter ran"],
    },
    {
      descriptionHtml:
        "The getter returns <code>10</code>, the cache is replaced, and <code>dirty</code> clears. Two evaluations for three reads and one write. If a template read <code>double.value</code>, the render effect would appear under <em>subscribers</em>, and the write on line 12 would schedule that render, still without running the getter until the template asked for the value.",
      activeLine: 14,
      doneLines: [1, 3, 5, 6, 7, 8, 10, 11, 12, 13],
      traps: [t2GetCount, t2SetCount, t2GetCount2],
      deps: [dep("state", "count", ["computed(double)"])],
      scheduler: IDLE,
      computed: {
        name: "double",
        dirty: false,
        cached: "10",
        evaluations: 2,
        subscribers: [],
      },
      bindings: null,
      consoleOutput: [
        "getter ran",
        "2",
        "2",
        "after write",
        "getter ran",
        "10",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Example 3: ref vs reactive and losing reactivity                    */
/* ------------------------------------------------------------------ */

const bCount = (value: string): BindingEntry => ({
  name: "count",
  kind: "ref",
  value: `RefImpl { value: ${value} }`,
  note: "Primitives cannot be proxied. The RefImpl object owns a Dep and exposes it through .value.",
});
const bState = (total: string): BindingEntry => ({
  name: "state",
  kind: "reactive",
  value: `Proxy { total: ${total} }`,
  note: "Reads and writes go through the Proxy traps, so they can be tracked and triggered.",
});
const bTotal: BindingEntry = {
  name: "total",
  kind: "plain",
  value: "1",
  note: "A copied number. No trap, no Dep, no way to notify anyone when state.total changes.",
};
const bTotalRef = (total: string): BindingEntry => ({
  name: "totalRef",
  kind: "toRef",
  value: `ObjectRefImpl -> state.total (${total})`,
  note: "Its .value getter forwards to state.total through the Proxy, so reads are tracked.",
});

const t3GetRef: TrapEntry = {
  id: "t3-get-ref",
  op: "get",
  target: "count",
  key: "value",
  value: "0",
  result: "track",
  isRef: true,
  note: "RefImpl getter calls trackRefValue(). effect#1 is added to the ref's own Dep.",
};
const t3SetRef: TrapEntry = {
  id: "t3-set-ref",
  op: "set",
  target: "count",
  key: "value",
  value: "1",
  result: "trigger",
  isRef: true,
  note: "RefImpl setter calls triggerRefValue(). flush: 'sync' runs effect#1 immediately.",
};
const t3GetTotalDestructure: TrapEntry = {
  id: "t3-get-total-destructure",
  op: "get",
  target: "state",
  key: "total",
  value: "1",
  result: "noop",
  note: "Destructuring reads once at module scope. activeEffect is undefined, nothing is tracked.",
};
const t3SetTotal2: TrapEntry = {
  id: "t3-set-total-2",
  op: "set",
  target: "state",
  key: "total",
  value: "2",
  result: "miss",
  note: "trigger() finds no Dep for total. effect#2 never read through the proxy.",
};
const t3GetTotalRef: TrapEntry = {
  id: "t3-get-total-ref",
  op: "get",
  target: "state",
  key: "total",
  value: "2",
  result: "track",
  note: "totalRef.value forwarded to state.total inside effect#3, so the Dep for total is created.",
};
const t3SetTotal3: TrapEntry = {
  id: "t3-set-total-3",
  op: "set",
  target: "state",
  key: "total",
  value: "3",
  result: "trigger",
  note: "Dep for total holds effect#3. flush: 'sync' runs it inline.",
};

const pitfallsExample: VueReactivityExample = {
  id: "ref-vs-reactive",
  title: "Ref vs Reactive",
  description:
    "Reactivity lives in the ref or proxy object, not the variable. Destructuring copies the value out and severs the link; toRefs keeps it.",
  kind: "pitfalls",
  codeLines: [
    {
      num: 1,
      text: "import { ref, reactive, toRefs, watchEffect } from 'vue'",
    },
    { num: 2, text: "const sync = { flush: 'sync' }" },
    { num: 3, text: "" },
    { num: 4, text: "const count = ref(0)" },
    {
      num: 5,
      text: "watchEffect(() => console.log('ref', count.value), sync)",
    },
    { num: 6, text: "count.value++" },
    { num: 7, text: "" },
    { num: 8, text: "const state = reactive({ total: 1 })" },
    { num: 9, text: "const { total } = state" },
    { num: 10, text: "watchEffect(() => console.log('plain', total), sync)" },
    { num: 11, text: "state.total = 2" },
    { num: 12, text: "" },
    { num: 13, text: "const { total: totalRef } = toRefs(state)" },
    {
      num: 14,
      text: "watchEffect(() => console.log('toRef', totalRef.value), sync)",
    },
    { num: 15, text: "state.total = 3" },
  ],
  steps: [
    {
      descriptionHtml:
        "<code>ref(0)</code> returns a <code>RefImpl</code>: an object with a <code>value</code> accessor pair and its own Dep. A Proxy cannot wrap a number, so the wrapper object is what makes a primitive observable. <code>flush: 'sync'</code> is used here so each effect re-runs inline instead of in the microtask flush.",
      activeLine: 4,
      doneLines: [1, 2],
      traps: [],
      deps: [],
      scheduler: IDLE,
      computed: null,
      bindings: [bCount("0")],
      consoleOutput: [],
    },
    {
      descriptionHtml:
        '<strong>effect#1</strong> runs at once. Reading <code>count.value</code> enters the <code>RefImpl</code> getter, which calls <span class="hl-task">trackRefValue()</span>. Same idea as the Proxy trap, different entry point: the ref\'s Dep now holds effect#1.',
      activeLine: 5,
      doneLines: [1, 2, 4],
      traps: [t3GetRef],
      deps: [dep("count", "value", ["effect#1"], "tracking")],
      scheduler: sched({ activeEffect: "effect#1" }),
      computed: null,
      bindings: [bCount("0")],
      consoleOutput: ["ref 0"],
    },
    {
      descriptionHtml:
        "<code>count.value++</code> goes through the setter. <code>hasChanged(0, 1)</code> is true, so <span class=\"hl-stack\">triggerRefValue()</span> notifies the Dep. With <code>flush: 'sync'</code> the scheduler runs effect#1 immediately and <code>ref 1</code> prints. Without the option it would be queued for the next microtask.",
      activeLine: 6,
      doneLines: [1, 2, 4, 5],
      traps: [t3GetRef, t3SetRef],
      deps: [dep("count", "value", ["effect#1"], "triggering")],
      scheduler: sched({ ranNow: ["effect#1"] }),
      computed: null,
      bindings: [bCount("1")],
      consoleOutput: ["ref 0", "ref 1"],
    },
    {
      descriptionHtml:
        "<code>reactive()</code> creates the Proxy for <code>{ total: 1 }</code>. The Dep for <code>count.value</code> is untouched; each reactive source keeps its own entry in <code>targetMap</code>.",
      activeLine: 8,
      doneLines: [1, 2, 4, 5, 6],
      traps: [t3GetRef, t3SetRef],
      deps: [dep("count", "value", ["effect#1"])],
      scheduler: IDLE,
      computed: null,
      bindings: [bCount("1"), bState("1")],
      consoleOutput: ["ref 0", "ref 1"],
    },
    {
      descriptionHtml:
        'Destructuring evaluates <code>state.total</code> exactly once, right now, at module scope. The <code>get</code> trap fires with no <code>activeEffect</code>, so nothing is tracked, and the local <code>total</code> receives the <span class="hl-loop">plain number 1</span>. The proxy is out of the picture for this variable.',
      activeLine: 9,
      doneLines: [1, 2, 4, 5, 6, 8],
      traps: [t3GetRef, t3SetRef, t3GetTotalDestructure],
      deps: [dep("count", "value", ["effect#1"])],
      scheduler: IDLE,
      computed: null,
      bindings: [bCount("1"), bState("1"), bTotal],
      consoleOutput: ["ref 0", "ref 1"],
    },
    {
      descriptionHtml:
        '<strong>effect#2</strong> runs and reads the local <code>total</code>. No trap fires because a plain variable has no interceptor, so <code>track()</code> is never called. The effect finishes with <span class="hl-loop">zero dependencies</span>, which means nothing can ever schedule it again.',
      activeLine: 10,
      doneLines: [1, 2, 4, 5, 6, 8, 9],
      traps: [t3GetRef, t3SetRef, t3GetTotalDestructure],
      deps: [dep("count", "value", ["effect#1"])],
      scheduler: sched({ activeEffect: "effect#2" }),
      computed: null,
      bindings: [bCount("1"), bState("1"), bTotal],
      consoleOutput: ["ref 0", "ref 1", "plain 1"],
    },
    {
      descriptionHtml:
        '<code>state.total = 2</code> hits the <code>set</code> trap and <span class="hl-stack">trigger()</span> looks up <code>depsMap.get("total")</code>. There is no Dep, so nothing runs. The proxy now says 2 while the local <code>total</code> still says 1, and the console does not change.',
      activeLine: 11,
      doneLines: [1, 2, 4, 5, 6, 8, 9, 10],
      traps: [t3GetRef, t3SetRef, t3GetTotalDestructure, t3SetTotal2],
      deps: [dep("count", "value", ["effect#1"])],
      scheduler: IDLE,
      computed: null,
      bindings: [bCount("1"), bState("2"), bTotal],
      consoleOutput: ["ref 0", "ref 1", "plain 1"],
    },
    {
      descriptionHtml:
        '<code>toRefs(state)</code> returns a plain object whose every property is an <code>ObjectRefImpl</code>. Destructuring that object copies the ref wrapper, not the number, and the wrapper\'s <code>.value</code> getter reads <code>state.total</code> <span class="hl-api">through the Proxy</span> on every access.',
      activeLine: 13,
      doneLines: [1, 2, 4, 5, 6, 8, 9, 10, 11],
      traps: [t3GetRef, t3SetRef, t3GetTotalDestructure, t3SetTotal2],
      deps: [dep("count", "value", ["effect#1"])],
      scheduler: IDLE,
      computed: null,
      bindings: [bCount("1"), bState("2"), bTotal, bTotalRef("2")],
      consoleOutput: ["ref 0", "ref 1", "plain 1"],
    },
    {
      descriptionHtml:
        '<strong>effect#3</strong> reads <code>totalRef.value</code>, which forwards to <code>state.total</code>. This time the <code>get</code> trap fires with <code>activeEffect</code> set, so <span class="hl-task">track()</span> creates the Dep for <code>total</code> and records effect#3. The log shows the current value, 2.',
      activeLine: 14,
      doneLines: [1, 2, 4, 5, 6, 8, 9, 10, 11, 13],
      traps: [
        t3GetRef,
        t3SetRef,
        t3GetTotalDestructure,
        t3SetTotal2,
        t3GetTotalRef,
      ],
      deps: [
        dep("count", "value", ["effect#1"]),
        dep("state", "total", ["effect#3"], "tracking"),
      ],
      scheduler: sched({ activeEffect: "effect#3" }),
      computed: null,
      bindings: [bCount("1"), bState("2"), bTotal, bTotalRef("2")],
      consoleOutput: ["ref 0", "ref 1", "plain 1", "toRef 2"],
    },
    {
      descriptionHtml:
        "<code>state.total = 3</code> triggers the Dep for <code>total</code>, which now holds effect#3, and <code>toRef 3</code> prints. effect#2 is still in no Dep and stays silent. The rule: reactivity is a property of the ref or proxy object, so copy the wrapper, never the value. In <code>&lt;script setup&gt;</code> the compiler unwraps refs in templates so you rarely write <code>.value</code> there.",
      activeLine: 15,
      doneLines: [1, 2, 4, 5, 6, 8, 9, 10, 11, 13, 14],
      traps: [
        t3GetRef,
        t3SetRef,
        t3GetTotalDestructure,
        t3SetTotal2,
        t3GetTotalRef,
        t3SetTotal3,
      ],
      deps: [
        dep("count", "value", ["effect#1"]),
        dep("state", "total", ["effect#3"], "triggering"),
      ],
      scheduler: sched({ ranNow: ["effect#3"] }),
      computed: null,
      bindings: [bCount("1"), bState("3"), bTotal, bTotalRef("3")],
      consoleOutput: ["ref 0", "ref 1", "plain 1", "toRef 2", "toRef 3"],
    },
  ],
};

export const EXAMPLES: VueReactivityExample[] = [
  trackExample,
  computedExample,
  pitfallsExample,
];
