import type { TreeNodeData, TreeNodeHighlight } from "@/types/visualization";
import type { PipelineStage } from "@/components/visualization-ui/PipelineDiagram";
import type {
  AngularExample,
  CheckRecord,
  SignalNode,
  TriggerState,
} from "./types";

/* ── Tree builder ── */

interface NodeSpec {
  highlight?: TreeNodeHighlight;
  props?: { key: string; value: string }[];
}

interface TreeSpec {
  app?: NodeSpec;
  header?: NodeSpec;
  list?: NodeSpec;
  item1?: NodeSpec;
  item2?: NodeSpec;
}

const tree = (spec: TreeSpec = {}): TreeNodeData => ({
  id: "app",
  label: "AppComponent",
  highlight: spec.app?.highlight,
  props: spec.app?.props,
  children: [
    {
      id: "header",
      label: "HeaderComponent",
      highlight: spec.header?.highlight,
      props: spec.header?.props,
    },
    {
      id: "list",
      label: "ListComponent",
      highlight: spec.list?.highlight,
      props: spec.list?.props,
      children: [
        {
          id: "item1",
          label: "ItemComponent",
          highlight: spec.item1?.highlight,
          props: spec.item1?.props,
        },
        {
          id: "item2",
          label: "ItemComponent",
          highlight: spec.item2?.highlight,
          props: spec.item2?.props,
        },
      ],
    },
  ],
});

const stages = (
  labels: [string, string][],
  statuses: PipelineStage["status"][],
): PipelineStage[] =>
  labels.map(([id, label], index) => ({
    id,
    label,
    status: statuses[index] ?? "pending",
  }));

const ZONE_STAGES: [string, string][] = [
  ["event", "event"],
  ["zone", "zone.js"],
  ["tick", "tick()"],
  ["refresh", "refresh"],
];

const SIGNAL_STAGES: [string, string][] = [
  ["set", "set()"],
  ["notify", "notify"],
  ["schedule", "schedule"],
  ["refresh", "refresh"],
];

const idle = (note: string, labels: [string, string][]): TriggerState => ({
  source: "idle",
  note,
  stages: stages(labels, ["pending", "pending", "pending", "pending"]),
});

const zoneTrigger = (
  source: string,
  note: string,
  statuses: PipelineStage["status"][],
): TriggerState => ({ source, note, stages: stages(ZONE_STAGES, statuses) });

const signalTrigger = (
  source: string,
  note: string,
  statuses: PipelineStage["status"][],
): TriggerState => ({ source, note, stages: stages(SIGNAL_STAGES, statuses) });

const check = (
  id: string,
  component: string,
  binding: string,
  oldValue: string,
  newValue: string,
  result: CheckRecord["result"],
): CheckRecord => ({ id, component, binding, oldValue, newValue, result });

const ONPUSH = { key: "cd", value: "OnPush" };
const DEFAULT = { key: "cd", value: "Default" };

/* ── Example 1: Default with zone.js ── */

const Z_APP = check("app", "App", '[title]="\'Cart\'"', '"Cart"', '"Cart"', "same");
const Z_HEADER = check("header", "Header", "{{ title }}", '"Cart"', '"Cart"', "same");
const Z_LIST = check("list", "List", '[items]="items"', "items#1", "items#1", "same");
const Z_ITEM1 = check("item1", "Item 1", "{{ qty }}", "0", "1", "changed");
const Z_ITEM2 = check("item2", "Item 2", "{{ qty }}", "0", "0", "same");
const Z_NOCHANGES = check("nochanges", "all views", "checkNoChanges()", "", "", "pass");

const zoneExample: AngularExample = {
  id: "zone",
  title: "Default with zone.js",
  description:
    "zone.js patches async APIs so every finished task triggers a full top-down check of every binding in the tree.",
  kind: "zone",
  codeLines: [
    { num: 1, text: "@Component({" },
    { num: 2, text: "  selector: 'app-item'," },
    { num: 3, text: "  template: `<button (click)=\"add()\">{{ qty }}</button>`," },
    { num: 4, text: "})" },
    { num: 5, text: "export class ItemComponent {" },
    { num: 6, text: "  @Input() qty = 0;" },
    { num: 7, text: "  add() { this.qty++; }" },
    { num: 8, text: "}" },
    { num: 9, text: "" },
    { num: 10, text: "bootstrapApplication(AppComponent, {" },
    { num: 11, text: "  providers: [provideZoneChangeDetection()]," },
    { num: 12, text: "});" },
    { num: 13, text: "" },
    { num: 14, text: "// zone.js wraps addEventListener, setTimeout, Promise.then, XHR" },
    { num: 15, text: "// NgZone.onMicrotaskEmpty -> ApplicationRef.tick()" },
  ],
  steps: [
    {
      descriptionHtml:
        "The app bootstraps with the default strategy. Every component uses <code>ChangeDetectionStrategy.Default</code>, so Angular has no idea which component owns which piece of state. It will treat every async task as a possible change anywhere.",
      activeLine: 10,
      doneLines: [],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [DEFAULT] },
        item1: { props: [DEFAULT, { key: "qty", value: "0" }] },
        item2: { props: [DEFAULT, { key: "qty", value: "0" }] },
      }),
      trigger: idle("no task has run yet", ZONE_STAGES),
      checks: [],
      signals: [],
    },
    {
      descriptionHtml:
        "<code>provideZoneChangeDetection()</code> loads <span class=\"hl-api\">zone.js</span>, which monkey-patches <code>addEventListener</code>, <code>setTimeout</code>, <code>Promise.then</code> and <code>XMLHttpRequest</code>. Each patched API wraps its callback so Angular is told when the callback has finished, not what it changed.",
      activeLine: 14,
      doneLines: [10, 11, 12],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [DEFAULT] },
        item1: { props: [DEFAULT, { key: "qty", value: "0" }] },
        item2: { props: [DEFAULT, { key: "qty", value: "0" }] },
      }),
      trigger: idle("async APIs patched, waiting for a task", ZONE_STAGES),
      checks: [],
      signals: [],
    },
    {
      descriptionHtml:
        "The user clicks the button in the first <code>ItemComponent</code>. The listener was registered through the patched <code>addEventListener</code>, so it runs inside the <span class=\"hl-api\">Angular zone</span> and zone.js knows a task has started.",
      activeLine: 3,
      doneLines: [10, 11, 12, 14],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [DEFAULT] },
        item1: { highlight: "active", props: [DEFAULT, { key: "qty", value: "0" }] },
        item2: { props: [DEFAULT, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "item1",
      trigger: zoneTrigger("click", "listener wrapped by zone.js", ["active", "pending", "pending", "pending"]),
      checks: [],
      signals: [],
    },
    {
      descriptionHtml:
        "<code>add()</code> runs and <code>this.qty</code> goes from <code>0</code> to <code>1</code>. This is a plain property assignment. Nothing observes it, the DOM still shows 0, and Angular only learns that <em>some</em> task ran inside the zone.",
      activeLine: 7,
      doneLines: [3, 10, 11, 12, 14],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [DEFAULT] },
        item1: { highlight: "updated", props: [DEFAULT, { key: "qty", value: "1" }] },
        item2: { props: [DEFAULT, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "item1",
      trigger: zoneTrigger("click", "handler mutated qty", ["done", "active", "pending", "pending"]),
      checks: [],
      signals: [],
    },
    {
      descriptionHtml:
        "The handler returns and the microtask queue drains. zone.js reports this to <code>NgZone</code>, which emits <code>onMicrotaskEmpty</code>, and <code>ApplicationRef.tick()</code> starts a <span class=\"hl-stack\">full change detection pass</span> from the root view.",
      activeLine: 15,
      doneLines: [3, 7, 10, 11, 12, 14],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [DEFAULT] },
        item1: { highlight: "updated", props: [DEFAULT, { key: "qty", value: "1" }] },
        item2: { props: [DEFAULT, { key: "qty", value: "0" }] },
      }),
      trigger: zoneTrigger("click", "onMicrotaskEmpty -> tick()", ["done", "done", "active", "pending"]),
      checks: [],
      signals: [],
    },
    {
      descriptionHtml:
        "<code>tick()</code> checks <code>AppComponent</code> first. Dirty checking means re-evaluating every template expression and comparing it with the value stored from the last pass. <code>[title]=\"'Cart'\"</code> still produces <code>\"Cart\"</code>, so no DOM write happens.",
      activeLine: 15,
      doneLines: [3, 7, 10, 11, 12, 14],
      tree: tree({
        app: { highlight: "active", props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [DEFAULT] },
        item1: { highlight: "updated", props: [DEFAULT, { key: "qty", value: "1" }] },
        item2: { props: [DEFAULT, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "app",
      trigger: zoneTrigger("click", "walking views top-down", ["done", "done", "active", "pending"]),
      checks: [Z_APP],
      signals: [],
    },
    {
      descriptionHtml:
        "<code>HeaderComponent</code> is checked next even though nothing that feeds it changed. Angular cannot know that, because it never tracked which state the click touched. The comparison is cheap, but it runs on every task in the app.",
      activeLine: 15,
      doneLines: [3, 7, 10, 11, 12, 14],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { highlight: "active", props: [DEFAULT] },
        list: { props: [DEFAULT] },
        item1: { highlight: "updated", props: [DEFAULT, { key: "qty", value: "1" }] },
        item2: { props: [DEFAULT, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "header",
      trigger: zoneTrigger("click", "walking views top-down", ["done", "done", "active", "pending"]),
      checks: [Z_APP, Z_HEADER],
      signals: [],
    },
    {
      descriptionHtml:
        "<code>ListComponent</code> compares <code>[items]=\"items\"</code> by reference with <code>Object.is</code>. Same array as before, so the input is not written, but with the Default strategy the traversal continues into the children regardless.",
      activeLine: 15,
      doneLines: [3, 7, 10, 11, 12, 14],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { highlight: "active", props: [DEFAULT] },
        item1: { highlight: "updated", props: [DEFAULT, { key: "qty", value: "1" }] },
        item2: { props: [DEFAULT, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "list",
      trigger: zoneTrigger("click", "walking views top-down", ["done", "done", "active", "pending"]),
      checks: [Z_APP, Z_HEADER, Z_LIST],
      signals: [],
    },
    {
      descriptionHtml:
        "The first <code>ItemComponent</code> evaluates <code>{{ qty }}</code>: stored value <code>0</code>, current value <code>1</code>. The values differ, so Angular writes the new text node and stores <code>1</code> for the next comparison. This is the only real DOM update in the whole pass.",
      activeLine: 3,
      doneLines: [7, 10, 11, 12, 14, 15],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [DEFAULT] },
        item1: { highlight: "updated", props: [DEFAULT, { key: "qty", value: "1" }] },
        item2: { props: [DEFAULT, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "item1",
      trigger: zoneTrigger("click", "DOM text 0 -> 1", ["done", "done", "active", "pending"]),
      checks: [Z_APP, Z_HEADER, Z_LIST, Z_ITEM1],
      signals: [],
    },
    {
      descriptionHtml:
        "The second <code>ItemComponent</code> is checked too. Its <code>qty</code> is still <code>0</code>, so nothing is written, but its template expressions were still executed. With the Default strategy the cost of a pass scales with the size of the tree, not with the size of the change.",
      activeLine: 3,
      doneLines: [7, 10, 11, 12, 14, 15],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [DEFAULT] },
        item1: { highlight: "updated", props: [DEFAULT, { key: "qty", value: "1" }] },
        item2: { highlight: "active", props: [DEFAULT, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "item2",
      trigger: zoneTrigger("click", "walking views top-down", ["done", "done", "active", "pending"]),
      checks: [Z_APP, Z_HEADER, Z_LIST, Z_ITEM1, Z_ITEM2],
      signals: [],
    },
    {
      descriptionHtml:
        "In dev mode <code>tick()</code> runs a second pass, <code>checkNoChanges()</code>, which re-evaluates every binding without writing anything. If any expression returns a different value than it did a moment ago, Angular throws <code>ExpressionChangedAfterItHasBeenCheckedError</code>. Here all five bindings are stable, so the pass is clean.",
      activeLine: 15,
      doneLines: [3, 7, 10, 11, 12, 14],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [DEFAULT] },
        item1: { highlight: "updated", props: [DEFAULT, { key: "qty", value: "1" }] },
        item2: { props: [DEFAULT, { key: "qty", value: "0" }] },
      }),
      trigger: zoneTrigger("click", "dev mode: second verification pass", ["done", "done", "done", "active"]),
      checks: [Z_APP, Z_HEADER, Z_LIST, Z_ITEM1, Z_ITEM2, Z_NOCHANGES],
      signals: [],
    },
    {
      descriptionHtml:
        "One click, five components checked, one binding changed. A <code>setTimeout</code> callback or an XHR response would trigger exactly the same full pass, even if the callback changed nothing at all. This is the cost that <strong>OnPush</strong> and <strong>signals</strong> remove.",
      activeLine: null,
      doneLines: [3, 7, 10, 11, 12, 14, 15],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [DEFAULT] },
        item1: { highlight: "updated", props: [DEFAULT, { key: "qty", value: "1" }] },
        item2: { props: [DEFAULT, { key: "qty", value: "0" }] },
      }),
      trigger: zoneTrigger("click", "pass complete, zone idle", ["done", "done", "done", "done"]),
      checks: [Z_APP, Z_HEADER, Z_LIST, Z_ITEM1, Z_ITEM2, Z_NOCHANGES],
      signals: [],
    },
  ],
};

/* ── Example 2: OnPush ── */

const O_APP_SAME = check("app", "App", '[items]="items"', "items#1", "items#1", "same");
const O_HEADER = check("header", "Header", "{{ title }}", '"Cart"', '"Cart"', "same");
const O_LIST_SKIP = check("list", "List", "OnPush, input ref unchanged", "", "", "skipped");
const O_ITEM1_SKIP = check("item1", "Item 1", "parent view skipped", "", "", "skipped");
const O_ITEM2_SKIP = check("item2", "Item 2", "parent view skipped", "", "", "skipped");
const O_STALE = check("stale", "Item 1", "DOM shows qty", "0", "0", "stale");

const O_APP_NEW = check("app2", "App", '[items]="items"', "items#1", "items#2", "changed");
const O_HEADER2 = check("header2", "Header", "{{ title }}", '"Cart"', '"Cart"', "same");
const O_LIST_NEW = check("list2", "List", "@for track it.id", "item#1", "item#3", "changed");
const O_ITEM1_NEW = check("item1b", "Item 1", "{{ item.qty }}", "0", "1", "changed");
const O_ITEM2_SKIP2 = check("item2b", "Item 2", "OnPush, [item] ref unchanged", "", "", "skipped");

const onPushExample: AngularExample = {
  id: "onpush",
  title: "OnPush",
  description:
    "OnPush views are only checked when an input reference changes, an event fires inside them, or markForCheck() runs. Mutating an object in place is invisible.",
  kind: "onpush",
  codeLines: [
    { num: 1, text: "@Component({" },
    { num: 2, text: "  selector: 'app-list'," },
    { num: 3, text: "  changeDetection: ChangeDetectionStrategy.OnPush," },
    { num: 4, text: "  template: `@for (it of items; track it.id) {" },
    { num: 5, text: "    <app-item [item]=\"it\" />" },
    { num: 6, text: "  }`," },
    { num: 7, text: "})" },
    { num: 8, text: "export class ListComponent {" },
    { num: 9, text: "  @Input() items: Item[] = [];" },
    { num: 10, text: "}" },
    { num: 11, text: "" },
    { num: 12, text: "// AppComponent (Default strategy)" },
    { num: 13, text: "bump() { this.items[0].qty++; }" },
    { num: 14, text: "bumpImmutable() {" },
    { num: 15, text: "  this.items = this.items.map((it, i) =>" },
    { num: 16, text: "    i === 0 ? { ...it, qty: it.qty + 1 } : it);" },
    { num: 17, text: "}" },
  ],
  steps: [
    {
      descriptionHtml:
        "<code>ListComponent</code> and <code>ItemComponent</code> opt into <code>ChangeDetectionStrategy.OnPush</code>. An OnPush view is skipped during a pass unless one of four things marks it dirty: an <code>@Input</code> reference changed, an event fired inside the view, an <code>async</code> pipe emitted, or <code>markForCheck()</code> was called.",
      activeLine: 3,
      doneLines: [1, 2],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [ONPUSH] },
        item1: { props: [ONPUSH, { key: "qty", value: "0" }] },
        item2: { props: [ONPUSH, { key: "qty", value: "0" }] },
      }),
      trigger: idle("no task has run yet", ZONE_STAGES),
      checks: [],
      signals: [],
    },
    {
      descriptionHtml:
        "The user clicks a button in <code>AppComponent</code> that calls <code>bump()</code>. zone.js catches the finished click task as before and schedules <code>tick()</code>. The trigger side is identical to the Default example. What changes is how far the traversal goes.",
      activeLine: 13,
      doneLines: [1, 2, 3],
      tree: tree({
        app: { highlight: "active", props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [ONPUSH] },
        item1: { props: [ONPUSH, { key: "qty", value: "0" }] },
        item2: { props: [ONPUSH, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "app",
      trigger: zoneTrigger("click", "bump() in AppComponent", ["active", "pending", "pending", "pending"]),
      checks: [],
      signals: [],
    },
    {
      descriptionHtml:
        "<code>bump()</code> mutates <code>items[0].qty</code> in place. The <code>items</code> array is the same reference as before, and so is the first item object. Angular compares inputs with <code>Object.is</code>, so from its point of view nothing that reaches <code>ListComponent</code> has changed.",
      activeLine: 13,
      doneLines: [1, 2, 3],
      tree: tree({
        app: { highlight: "updated", props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [ONPUSH] },
        item1: { props: [ONPUSH, { key: "qty", value: "0" }] },
        item2: { props: [ONPUSH, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "app",
      trigger: zoneTrigger("click", "items[0].qty = 1, same references", ["done", "active", "pending", "pending"]),
      checks: [],
      signals: [],
    },
    {
      descriptionHtml:
        "<code>tick()</code> checks <code>AppComponent</code> (Default). The binding <code>[items]=\"items\"</code> yields <code>items#1</code> again, the same reference stored last time, so the input setter is not called and <code>ListComponent</code> is <strong>not</strong> marked dirty.",
      activeLine: 13,
      doneLines: [1, 2, 3],
      tree: tree({
        app: { highlight: "active", props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [ONPUSH] },
        item1: { props: [ONPUSH, { key: "qty", value: "0" }] },
        item2: { props: [ONPUSH, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "app",
      trigger: zoneTrigger("click", "checking App bindings", ["done", "done", "active", "pending"]),
      checks: [O_APP_SAME],
      signals: [],
    },
    {
      descriptionHtml:
        "<code>HeaderComponent</code> is still Default, so it is checked as usual. Then the traversal reaches <code>ListComponent</code>: it is OnPush and not dirty, so Angular <span class=\"hl-task\">skips the whole subtree</span>. Neither the list template nor the two item templates execute.",
      activeLine: 3,
      doneLines: [1, 2, 13],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { highlight: "active", props: [DEFAULT] },
        list: { props: [ONPUSH] },
        item1: { props: [ONPUSH, { key: "qty", value: "0" }] },
        item2: { props: [ONPUSH, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "list",
      trigger: zoneTrigger("click", "List subtree pruned", ["done", "done", "active", "pending"]),
      checks: [O_APP_SAME, O_HEADER, O_LIST_SKIP, O_ITEM1_SKIP, O_ITEM2_SKIP],
      signals: [],
    },
    {
      descriptionHtml:
        "The pass ends with the model saying <code>qty = 1</code> and the DOM still showing <code>0</code>. This is the classic OnPush bug: mutation without a new reference. It is not a bug in Angular, the component asked to be skipped unless its inputs change, and by reference they did not.",
      activeLine: 13,
      doneLines: [1, 2, 3],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [ONPUSH] },
        item1: { highlight: "removed", props: [ONPUSH, { key: "qty", value: "0" }] },
        item2: { props: [ONPUSH, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "item1",
      trigger: zoneTrigger("click", "pass complete, DOM stale", ["done", "done", "done", "done"]),
      checks: [O_APP_SAME, O_HEADER, O_LIST_SKIP, O_ITEM1_SKIP, O_ITEM2_SKIP, O_STALE],
      signals: [],
    },
    {
      descriptionHtml:
        "Second attempt with <code>bumpImmutable()</code>. It builds a new array with <code>map</code> and a new object for the first item via spread. The second item keeps its old reference on purpose, so we can see how granular the marking is.",
      activeLine: 15,
      doneLines: [1, 2, 3, 13, 14],
      tree: tree({
        app: { highlight: "updated", props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [ONPUSH] },
        item1: { props: [ONPUSH, { key: "qty", value: "0" }] },
        item2: { props: [ONPUSH, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "app",
      trigger: zoneTrigger("click", "items = items#2, item#1 -> item#3", ["done", "active", "pending", "pending"]),
      checks: [],
      signals: [],
    },
    {
      descriptionHtml:
        "<code>tick()</code> checks <code>AppComponent</code>. <code>[items]</code> now yields <code>items#2</code>, a different reference from the stored <code>items#1</code>. Angular writes the input and, because the target is OnPush, calls <code>markViewDirty</code> on the <code>ListComponent</code> view.",
      activeLine: 16,
      doneLines: [1, 2, 3, 13, 14, 15],
      tree: tree({
        app: { highlight: "active", props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { highlight: "updated", props: [ONPUSH, { key: "dirty", value: "true" }] },
        item1: { props: [ONPUSH, { key: "qty", value: "0" }] },
        item2: { props: [ONPUSH, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "app",
      trigger: zoneTrigger("click", "input ref changed, List marked dirty", ["done", "done", "active", "pending"]),
      checks: [O_APP_NEW, O_HEADER2],
      signals: [],
    },
    {
      descriptionHtml:
        "<code>ListComponent</code> is dirty, so its template runs. <code>@for</code> tracks by <code>it.id</code>, so both rows are kept in place. Row one receives a new <code>[item]</code> reference and is marked dirty. Row two receives the same reference and stays clean.",
      activeLine: 4,
      doneLines: [1, 2, 3, 13, 14, 15, 16],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { highlight: "active", props: [ONPUSH] },
        item1: { highlight: "updated", props: [ONPUSH, { key: "dirty", value: "true" }] },
        item2: { props: [ONPUSH, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "list",
      trigger: zoneTrigger("click", "diffing @for rows", ["done", "done", "active", "pending"]),
      checks: [O_APP_NEW, O_HEADER2, O_LIST_NEW],
      signals: [],
    },
    {
      descriptionHtml:
        "Only the first <code>ItemComponent</code> is checked: <code>{{ item.qty }}</code> goes from <code>0</code> to <code>1</code> and the DOM is updated. The second item is skipped entirely. OnPush plus immutable inputs turns a whole-tree walk into a walk along the path that actually changed.",
      activeLine: 5,
      doneLines: [1, 2, 3, 4, 13, 14, 15, 16],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [ONPUSH] },
        item1: { highlight: "updated", props: [ONPUSH, { key: "qty", value: "1" }] },
        item2: { props: [ONPUSH, { key: "qty", value: "0" }] },
      }),
      activeNodeId: "item1",
      trigger: zoneTrigger("click", "DOM text 0 -> 1", ["done", "done", "active", "pending"]),
      checks: [O_APP_NEW, O_HEADER2, O_LIST_NEW, O_ITEM1_NEW, O_ITEM2_SKIP2],
      signals: [],
    },
    {
      descriptionHtml:
        "When a new reference is not available, for example data arriving through a subscription inside the component, call <code>ChangeDetectorRef.markForCheck()</code>. It flags the view and every ancestor up to the root, so the next tick can reach it. A template event such as <code>(click)</code> inside the view does the same automatically.",
      activeLine: null,
      doneLines: [1, 2, 3, 4, 5, 13, 14, 15, 16],
      tree: tree({
        app: { props: [DEFAULT] },
        header: { props: [DEFAULT] },
        list: { props: [ONPUSH] },
        item1: { props: [ONPUSH, { key: "qty", value: "1" }] },
        item2: { props: [ONPUSH, { key: "qty", value: "0" }] },
      }),
      trigger: zoneTrigger("click", "pass complete, 2 of 3 OnPush views skipped", ["done", "done", "done", "done"]),
      checks: [O_APP_NEW, O_HEADER2, O_LIST_NEW, O_ITEM1_NEW, O_ITEM2_SKIP2],
      signals: [],
    },
  ],
};

/* ── Example 3: Signals ── */

const graph = (
  count: [string, SignalNode["state"]],
  double: [string, SignalNode["state"]],
  view: [string, SignalNode["state"]],
): SignalNode[] => [
  { id: "count", label: "count", kind: "signal", value: count[0], state: count[1] },
  { id: "double", label: "double", kind: "computed", value: double[0], state: double[1] },
  { id: "view", label: "Item 1 view", kind: "view", value: view[0], state: view[1] },
];

const S_APP = check("app", "App", "HasChildViewsToRefresh", "", "", "traversed");
const S_HEADER = check("header", "Header", "no flags", "", "", "skipped");
const S_LIST = check("list", "List", "HasChildViewsToRefresh", "", "", "traversed");
const S_ITEM1 = check("item1", "Item 1", "{{ double() }}", "0", "2", "changed");
const S_ITEM2 = check("item2", "Item 2", "never read count", "", "", "skipped");

const NO_FLAG = { key: "flags", value: "none" };
const REFRESH = { key: "flags", value: "RefreshView" };
const CHILD = { key: "flags", value: "ChildToRefresh" };

const signalsExample: AngularExample = {
  id: "signals",
  title: "Signals",
  description:
    "A zoneless app: writing a signal marks only the templates that read it, and the scheduler refreshes just those views.",
  kind: "signals",
  codeLines: [
    { num: 1, text: "@Component({" },
    { num: 2, text: "  selector: 'app-item'," },
    { num: 3, text: "  template: `<button (click)=\"add()\">{{ double() }}</button>`," },
    { num: 4, text: "})" },
    { num: 5, text: "export class ItemComponent {" },
    { num: 6, text: "  count = signal(0);" },
    { num: 7, text: "  double = computed(() => this.count() * 2);" },
    { num: 8, text: "  add() { this.count.set(this.count() + 1); }" },
    { num: 9, text: "}" },
    { num: 10, text: "" },
    { num: 11, text: "bootstrapApplication(AppComponent, {" },
    { num: 12, text: "  providers: [provideZonelessChangeDetection()]," },
    { num: 13, text: "});" },
  ],
  steps: [
    {
      descriptionHtml:
        "The app bootstraps with <code>provideZonelessChangeDetection()</code>. zone.js is not loaded and nothing is monkey-patched. Angular will not run change detection because a task finished; it needs an explicit notification from a signal, a template listener, or <code>markForCheck()</code>.",
      activeLine: 12,
      doneLines: [11],
      tree: tree({
        app: { props: [NO_FLAG] },
        header: { props: [NO_FLAG] },
        list: { props: [NO_FLAG] },
        item1: { props: [NO_FLAG] },
        item2: { props: [NO_FLAG] },
      }),
      trigger: idle("zoneless, no patched APIs", SIGNAL_STAGES),
      checks: [],
      signals: [],
    },
    {
      descriptionHtml:
        "During the first render the template of the first item calls <code>double()</code>, and <code>double</code> calls <code>count()</code>. Each read registers a <span class=\"hl-micro\">producer to consumer edge</span> in the reactive graph: <code>count</code> feeds <code>double</code>, and <code>double</code> feeds this one view.",
      activeLine: 7,
      doneLines: [11, 12, 13],
      tree: tree({
        app: { props: [NO_FLAG] },
        header: { props: [NO_FLAG] },
        list: { props: [NO_FLAG] },
        item1: { highlight: "active", props: [NO_FLAG] },
        item2: { props: [NO_FLAG] },
      }),
      activeNodeId: "item1",
      trigger: idle("initial render tracked dependencies", SIGNAL_STAGES),
      checks: [],
      signals: graph(["0", "reading"], ["0", "reading"], ["shows 0", "reading"]),
    },
    {
      descriptionHtml:
        "The user clicks the button in the first item. There is no zone to intercept it. The listener was created by the template, so Angular itself marks this view for refresh, the same rule OnPush uses for events. Then <code>add()</code> runs.",
      activeLine: 3,
      doneLines: [7, 11, 12, 13],
      tree: tree({
        app: { props: [NO_FLAG] },
        header: { props: [NO_FLAG] },
        list: { props: [NO_FLAG] },
        item1: { highlight: "active", props: [NO_FLAG] },
        item2: { props: [NO_FLAG] },
      }),
      activeNodeId: "item1",
      trigger: signalTrigger("click", "template listener, no zone", ["pending", "pending", "pending", "pending"]),
      checks: [],
      signals: graph(["0", "clean"], ["0", "clean"], ["shows 0", "clean"]),
    },
    {
      descriptionHtml:
        "<code>count.set(1)</code> stores the new value and bumps the signal's version. It then walks its consumer list and marks <code>double</code> dirty. <code>double</code> is not recomputed here, it is lazy and only marks its own consumers in turn.",
      activeLine: 8,
      doneLines: [3, 7, 11, 12, 13],
      tree: tree({
        app: { props: [NO_FLAG] },
        header: { props: [NO_FLAG] },
        list: { props: [NO_FLAG] },
        item1: { highlight: "active", props: [NO_FLAG] },
        item2: { props: [NO_FLAG] },
      }),
      activeNodeId: "item1",
      trigger: signalTrigger("count.set(1)", "producer notifies consumers", ["active", "pending", "pending", "pending"]),
      checks: [],
      signals: graph(["1", "updated"], ["0", "dirty"], ["shows 0", "clean"]),
    },
    {
      descriptionHtml:
        "The dirty notification reaches the view's reactive consumer. Angular flags this view <code>RefreshView</code> and walks up the parents, setting <code>HasChildViewsToRefresh</code> on <code>ListComponent</code> and <code>AppComponent</code>. Those flags mean \"pass through\", not \"check my bindings\".",
      activeLine: 8,
      doneLines: [3, 7, 11, 12, 13],
      tree: tree({
        app: { props: [CHILD] },
        header: { props: [NO_FLAG] },
        list: { props: [CHILD] },
        item1: { highlight: "updated", props: [REFRESH] },
        item2: { props: [NO_FLAG] },
      }),
      activeNodeId: "item1",
      trigger: signalTrigger("count.set(1)", "view flagged, ancestors marked for traversal", ["done", "active", "pending", "pending"]),
      checks: [],
      signals: graph(["1", "updated"], ["0", "dirty"], ["shows 0", "dirty"]),
    },
    {
      descriptionHtml:
        "Marking a view calls into the <code>ChangeDetectionScheduler</code>, which coalesces every notification from this turn into one <code>tick()</code>. The zoneless scheduler races a <code>setTimeout</code> against <code>requestAnimationFrame</code> and runs on whichever fires first, so several signal writes still cost one pass.",
      activeLine: 12,
      doneLines: [3, 7, 8, 11, 13],
      tree: tree({
        app: { props: [CHILD] },
        header: { props: [NO_FLAG] },
        list: { props: [CHILD] },
        item1: { highlight: "updated", props: [REFRESH] },
        item2: { props: [NO_FLAG] },
      }),
      trigger: signalTrigger("count.set(1)", "one tick scheduled, notifications coalesced", ["done", "done", "active", "pending"]),
      checks: [],
      signals: graph(["1", "updated"], ["0", "dirty"], ["shows 0", "dirty"]),
    },
    {
      descriptionHtml:
        "<code>tick()</code> starts at <code>AppComponent</code>. It only has <code>HasChildViewsToRefresh</code>, so its own bindings are not evaluated. The traversal descends looking for the flagged view. <code>HeaderComponent</code> has no flags and is skipped without executing its template.",
      activeLine: null,
      doneLines: [3, 7, 8, 11, 12, 13],
      tree: tree({
        app: { highlight: "active", props: [CHILD] },
        header: { props: [NO_FLAG] },
        list: { props: [CHILD] },
        item1: { highlight: "updated", props: [REFRESH] },
        item2: { props: [NO_FLAG] },
      }),
      activeNodeId: "app",
      trigger: signalTrigger("count.set(1)", "targeted traversal", ["done", "done", "done", "active"]),
      checks: [S_APP, S_HEADER],
      signals: graph(["1", "updated"], ["0", "dirty"], ["shows 0", "dirty"]),
    },
    {
      descriptionHtml:
        "<code>ListComponent</code> is passed through the same way. The <code>@for</code> block is not re-diffed and no input is compared, because nothing told Angular that <code>List</code> itself changed. It is just on the path to the view that did.",
      activeLine: null,
      doneLines: [3, 7, 8, 11, 12, 13],
      tree: tree({
        app: { props: [CHILD] },
        header: { props: [NO_FLAG] },
        list: { highlight: "active", props: [CHILD] },
        item1: { highlight: "updated", props: [REFRESH] },
        item2: { props: [NO_FLAG] },
      }),
      activeNodeId: "list",
      trigger: signalTrigger("count.set(1)", "targeted traversal", ["done", "done", "done", "active"]),
      checks: [S_APP, S_HEADER, S_LIST],
      signals: graph(["1", "updated"], ["0", "dirty"], ["shows 0", "dirty"]),
    },
    {
      descriptionHtml:
        "The first item view is refreshed. Its template calls <code>double()</code>, which is dirty, so it recomputes <code>1 * 2 = 2</code>, notices the result differs from <code>0</code>, and returns it. The binding <code>{{ double() }}</code> changes from <code>0</code> to <code>2</code> and the text node is written.",
      activeLine: 3,
      doneLines: [7, 8, 11, 12, 13],
      tree: tree({
        app: { props: [NO_FLAG] },
        header: { props: [NO_FLAG] },
        list: { props: [NO_FLAG] },
        item1: { highlight: "updated", props: [NO_FLAG, { key: "double", value: "2" }] },
        item2: { props: [NO_FLAG] },
      }),
      activeNodeId: "item1",
      trigger: signalTrigger("count.set(1)", "DOM text 0 -> 2", ["done", "done", "done", "active"]),
      checks: [S_APP, S_HEADER, S_LIST, S_ITEM1],
      signals: graph(["1", "clean"], ["2", "updated"], ["shows 2", "updated"]),
    },
    {
      descriptionHtml:
        "The second item has its own <code>count</code> signal that nobody wrote, so it has no flags and is skipped. Change detection went from global to local: work is proportional to the number of views that read the changed signal, not to the size of the tree or the number of async tasks.",
      activeLine: null,
      doneLines: [3, 7, 8, 11, 12, 13],
      tree: tree({
        app: { props: [NO_FLAG] },
        header: { props: [NO_FLAG] },
        list: { props: [NO_FLAG] },
        item1: { highlight: "updated", props: [NO_FLAG, { key: "double", value: "2" }] },
        item2: { props: [NO_FLAG] },
      }),
      activeNodeId: "item2",
      trigger: signalTrigger("count.set(1)", "pass complete, 1 view refreshed", ["done", "done", "done", "done"]),
      checks: [S_APP, S_HEADER, S_LIST, S_ITEM1, S_ITEM2],
      signals: graph(["1", "clean"], ["2", "clean"], ["shows 2", "clean"]),
    },
  ],
};

export const EXAMPLES: AngularExample[] = [zoneExample, onPushExample, signalsExample];
