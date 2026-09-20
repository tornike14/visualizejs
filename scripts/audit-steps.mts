/**
 * Checks that every step's activeLine and doneLines make sense against the
 * topic's code lines. Catches lines out of range, active lines that sit on a
 * brace or comment, done lines that shrink between steps, long runs with no
 * active line, and code lines that never light up.
 *
 * Run: npm run audit:steps            (all topics)
 *      npm run audit:steps -- attention closures
 *      npm run audit:steps -- --strict   (also flag identifiers named in the
 *                                         description that live on another line)
 *
 * Exit code is 1 when any topic has errors, so it can run in CI.
 * The rules live in scripts/lib/stepAudit.ts so they can be unit tested.
 */
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  auditExample,
  flattenExamples,
  type TopicDataModule,
} from "./lib/stepAudit";

const ROOT = resolve(process.cwd(), "src/components/visualizations");
const args = process.argv.slice(2);
const strict = args.includes("--strict");
const only = new Set(args.filter((arg) => !arg.startsWith("--")));

const loadExamples = async (dir: string) => {
  const file = resolve(ROOT, dir, "data.ts");
  if (!existsSync(file)) return [];
  const mod = (await import(file)) as TopicDataModule;
  return flattenExamples(mod);
};

let failed = false;
for (const dir of readdirSync(ROOT).sort()) {
  if (only.size && !only.has(dir)) continue;
  const examples = await loadExamples(dir);
  if (!examples.length) continue;
  const findings = examples.map((example) => auditExample(example, { strict }));
  const errors = findings.flatMap((f) => f.errors);
  const warnings = findings.flatMap((f) => f.warnings);
  const steps = examples.reduce((n, e) => n + e.steps.length, 0);
  const status = errors.length ? "!!" : warnings.length ? "~ " : "ok";
  console.log(`${status} ${dir} (${examples.length} examples, ${steps} steps)`);
  for (const error of errors) console.log(`    error: ${error}`);
  for (const warning of warnings) console.log(`    warn:  ${warning}`);
  if (errors.length) failed = true;
}
process.exitCode = failed ? 1 : 0;
