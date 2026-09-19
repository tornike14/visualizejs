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
 */
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd(), "src/components/visualizations");
const args = process.argv.slice(2);
const strict = args.includes("--strict");
const only = new Set(args.filter((arg) => !arg.startsWith("--")));

interface Line {
  num: number;
  text: string;
}
interface Step {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
}
interface Example {
  id: string;
  codeLines: Line[];
  steps: Step[];
}

const isBlank = (text: string) => text.trim() === "";
const isBraceOnly = (text: string) => /^\s*[{}()[\];,]*\s*$/.test(text);
const isComment = (text: string) => /^\s*(\/\/|--|#)/.test(text);
const isTrivial = (text: string) => isBraceOnly(text) || isComment(text);

const identifiers = (text: string) =>
  new Set(
    (text.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) ?? []).filter((w) => w.length > 2),
  );

interface Variant {
  methodId: string;
  codeLines: Line[];
  steps: Step[];
}

/** Examples as authored, with per-method variants flattened into examples. */
const loadExamples = async (dir: string): Promise<Example[]> => {
  const file = resolve(ROOT, dir, "data.ts");
  if (!existsSync(file)) return [];
  const mod = await import(file);
  if (mod.STEPS && mod.CODE_LINES) {
    return [{ id: "default", codeLines: mod.CODE_LINES, steps: mod.STEPS }];
  }
  const examples: (Example & { variants?: Variant[] })[] = mod.EXAMPLES ?? [];
  return examples.flatMap((example) => {
    if (example.variants) {
      return example.variants.map((variant) => ({
        id: `${example.id}/${variant.methodId}`,
        codeLines: variant.codeLines,
        steps: variant.steps,
      }));
    }
    return example.codeLines ? [example] : [];
  });
};

interface Findings {
  errors: string[];
  warnings: string[];
}

const auditExample = (example: Example): Findings => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const max = Math.max(...example.codeLines.map((line) => line.num));
  const textByNum = new Map(example.codeLines.map((l) => [l.num, l.text]));
  let previousDone = new Set<number>();
  let nullRun = 0;

  example.steps.forEach((step, index) => {
    const tag = `${example.id} #${index + 1}`;
    const active = step.activeLine;

    if (active == null) {
      nullRun += 1;
      if (nullRun === 3) {
        warnings.push(`${tag}: three steps in a row with no active line`);
      }
    } else {
      nullRun = 0;
      const text = textByNum.get(active);
      if (active < 1 || active > max || text === undefined) {
        errors.push(`${tag}: activeLine ${active} is outside 1..${max}`);
      } else if (isBlank(text)) {
        errors.push(`${tag}: activeLine ${active} is a blank line`);
      } else if (isBraceOnly(text)) {
        warnings.push(
          `${tag}: activeLine ${active} is only a brace: "${text.trim()}" (fine for a return step)`,
        );
      } else if (isComment(text)) {
        warnings.push(
          `${tag}: activeLine ${active} is a comment: "${text.trim()}"`,
        );
      } else if (strict) {
        const nearby = new Set<string>();
        for (let n = active - 1; n <= active + 1; n += 1) {
          for (const word of identifiers(textByNum.get(n) ?? ""))
            nearby.add(word);
        }
        for (const [, bit] of step.descriptionHtml.matchAll(
          /<code>([^<]+)<\/code>/g,
        )) {
          const words = [...identifiers(bit)];
          if (!words.length || words.some((w) => nearby.has(w))) continue;
          const elsewhere = example.codeLines.find(
            (line) =>
              line.num !== active && identifiers(line.text).has(words[0]),
          );
          if (elsewhere) {
            warnings.push(
              `${tag}: mentions <code>${bit}</code> (line ${elsewhere.num}) but active line is ${active}`,
            );
          }
        }
      }
    }

    const done = new Set(step.doneLines);
    for (const d of done) {
      if (d < 1 || d > max)
        errors.push(`${tag}: doneLine ${d} is outside 1..${max}`);
    }
    if (active != null && done.has(active)) {
      errors.push(`${tag}: activeLine ${active} is also in doneLines`);
    }
    const dropped = [...previousDone].filter((d) => !done.has(d));
    if (dropped.length > 2) {
      warnings.push(`${tag}: doneLines dropped ${dropped.join(",")}`);
    }
    previousDone = done;
  });

  const litUp = new Set<number>();
  for (const step of example.steps) {
    if (step.activeLine != null) litUp.add(step.activeLine);
    for (const d of step.doneLines) litUp.add(d);
  }
  const never = example.codeLines.filter(
    (l) => !isTrivial(l.text) && !litUp.has(l.num),
  );
  if (never.length) {
    warnings.push(
      `${example.id}: lines never active or done: ${never.map((l) => l.num).join(",")}`,
    );
  }
  return { errors, warnings };
};

let failed = false;
for (const dir of readdirSync(ROOT).sort()) {
  if (only.size && !only.has(dir)) continue;
  const examples = await loadExamples(dir);
  if (!examples.length) continue;
  const findings = examples.map(auditExample);
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
