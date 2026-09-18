import type { TopicTheoryContent } from "@/content/theory/types";

export const angularChangeDetectionTheory: TopicTheoryContent = {
  summary:
    "Change detection is the process Angular runs to find template bindings whose values changed and write the new values to the DOM. How it is triggered and how much of the tree it visits depends on whether the app uses zone.js, OnPush, or signals.",
  whatItIs: [
    "Angular templates contain bindings such as {{ qty }} or [items]=\"items\". Angular does not know when the underlying values change, so it periodically re-evaluates the bindings, compares each result with the value it stored last time, and updates the DOM only where the result differs. This comparison is called dirty checking, and a full run of it is a change detection pass.",
    "In a classic application the pass is triggered by zone.js. zone.js monkey-patches browser APIs such as addEventListener, setTimeout, Promise.then and XMLHttpRequest so that every callback runs inside an Angular zone. When the callback finishes and the microtask queue drains, NgZone emits onMicrotaskEmpty and ApplicationRef.tick() walks the whole component tree from the root, checking every binding in every Default-strategy component whether or not anything relevant changed.",
    "ChangeDetectionStrategy.OnPush lets a component opt out of that blanket check. An OnPush view is skipped unless something marks it dirty: an @Input received a new reference (compared with Object.is), a template event fired inside the view, an async pipe emitted, or ChangeDetectorRef.markForCheck() was called. Marking a view also marks its ancestors, so the next tick can reach it without checking the siblings along the way.",
    "Signals make the trigger precise instead of coarse. A template that reads a signal registers itself as a consumer in a reactive graph. Writing the signal marks its consumers dirty, which flags exactly those views for refresh and asks the scheduler for a tick. In a zoneless app (provideZonelessChangeDetection) that notification is the only trigger, so the traversal visits the flagged views and passes through their ancestors without evaluating anything else.",
  ],
  howItWorks: [
    "Step 1: something notifies Angular. With zone.js it is a patched async callback finishing; with OnPush it is an input reference change, a template event, an async pipe, or markForCheck(); with signals it is a signal write that marks a consuming view dirty.",
    "Step 2: the scheduler coalesces notifications from the same turn into one ApplicationRef.tick(). The zoneless scheduler races setTimeout against requestAnimationFrame and runs on whichever fires first.",
    "Step 3: tick() starts at the root view and walks children in template order. A Default view is always checked. An OnPush view is checked only when its dirty flag is set. A view that only has HasChildViewsToRefresh is passed through without evaluating its own bindings.",
    "Step 4: checking a view runs its template update function. Each binding expression is re-evaluated and compared with the stored value using Object.is; on a difference the DOM property or text node is written and the stored value is replaced.",
    "Step 5: input bindings on child components are compared the same way. A changed reference calls the input setter, fires ngOnChanges, and marks an OnPush child dirty so the traversal descends into it.",
    "Step 6: in development mode tick() runs a second pass, checkNoChanges(), that re-evaluates every binding without writing. Any value that differs from the first pass throws ExpressionChangedAfterItHasBeenCheckedError, which reveals bindings that mutate state during rendering.",
  ],
  commonMistakes: [
    {
      title: "Mutating an OnPush input in place",
      explanation:
        "Pushing into an array or changing a field on an object keeps the same reference, so the parent's input binding compares equal and the OnPush child is never marked dirty. The model changes, the DOM does not.",
      fix: "Treat inputs as immutable and produce a new reference for every change (spread, map, filter). If the change originates inside the component, call ChangeDetectorRef.markForCheck() or store the value in a signal.",
    },
    {
      title: "Expecting third-party callbacks to trigger a check",
      explanation:
        "Code that runs outside the Angular zone, such as a callback from a library that captured the native setTimeout before zone.js patched it, or anything scheduled with NgZone.runOutsideAngular, finishes without notifying NgZone, so no tick follows.",
      fix: "Wrap the callback in NgZone.run(), or in a zoneless or signals-based design write the result into a signal so the consuming view is marked dirty explicitly.",
    },
    {
      title: "Changing state during change detection",
      explanation:
        "Setting a parent's value from a child's ngAfterViewInit, or calling a method with side effects from a template, changes a binding that has already been checked in the same pass. Dev mode reports it as ExpressionChangedAfterItHasBeenCheckedError; production silently renders stale output.",
      fix: "Move the update to a point before the check (ngOnInit, a signal computed, or an effect) rather than working around the error with setTimeout or detectChanges().",
    },
    {
      title: "Reading a signal outside a reactive context and expecting updates",
      explanation:
        "Calling count() once inside a constructor or a plain method copies the value; it does not subscribe anything. Only reads inside a template, computed, or effect create graph edges.",
      fix: "Read signals where the value is consumed: in the template, in a computed() that the template reads, or in an effect() when you need a side effect.",
    },
  ],
  interviewQuestions: [
    {
      question: "What does zone.js do for Angular, and what does it not do?",
      answer:
        "zone.js patches async browser APIs so that callbacks run inside an Angular zone and Angular is notified when they finish. That notification triggers ApplicationRef.tick(). zone.js does not know what the callback changed, which is why the default pass checks every binding in every Default component.",
    },
    {
      question: "When is an OnPush component checked?",
      answer:
        "When one of its @Input references changes (Object.is comparison), when a template event listener inside it fires, when an async pipe in its template emits, when markForCheck() is called, or when a signal read in its template is written. Otherwise the whole subtree is skipped during the pass.",
      codeExample: {
        language: "typescript",
        code: `@Component({
  selector: 'app-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`@for (it of items; track it.id) {
    <app-item [item]="it" />
  }\`,
})
export class ListComponent {
  @Input() items: Item[] = [];
}

// parent: same reference, List is skipped
this.items[0].qty++;
// parent: new reference, List is marked dirty
this.items = this.items.map((it, i) =>
  i === 0 ? { ...it, qty: it.qty + 1 } : it);`,
      },
    },
    {
      question: "What is ExpressionChangedAfterItHasBeenCheckedError and why does it only appear in development?",
      answer:
        "After the real pass, dev mode runs checkNoChanges(), which re-evaluates every binding without writing to the DOM. If any expression now returns a different value, some code changed state during the pass, and Angular throws to surface it. Production skips the verification pass for performance, so the same bug renders stale output instead of throwing.",
    },
    {
      question: "How do signals make change detection local rather than global?",
      answer:
        "Reading a signal in a template records a producer to consumer edge. Writing the signal marks its consumers dirty, which flags the exact views that read it for refresh and marks their ancestors for traversal only. The next tick descends through those ancestors without evaluating their bindings and refreshes only the flagged views, so the work is proportional to the readers of the changed value.",
      codeExample: {
        language: "typescript",
        code: `export class ItemComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);
  add() { this.count.set(this.count() + 1); }
}
// template: {{ double() }}
// count.set(1) -> double dirty -> this view flagged
// double recomputes lazily during the refresh: 1 * 2 = 2`,
      },
    },
    {
      question: "What changes when an app switches to provideZonelessChangeDetection()?",
      answer:
        "zone.js is no longer loaded, so finishing an async task does not trigger anything. Change detection runs only when Angular is told explicitly: a signal read in a template changes, a template event fires, markForCheck() is called, an async pipe emits, or ComponentRef.setInput() is used. Code that relied on a plain setTimeout or a manual property assignment to refresh the view stops working until it goes through one of those paths.",
    },
  ],
  relatedTopicIds: [
    "vue-reactivity",
    "svelte-runes",
    "render-cycle",
    "memoization",
    "fiber-tree",
  ],
};
