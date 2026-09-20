/**
 * Rules behind `npm run audit:steps`. Kept free of file system access so the
 * checks can run against authored examples in tests as well as on disk.
 */

export interface AuditLine {
  num: number;
  text: string;
}

export interface AuditStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
}

export interface AuditExample {
  id: string;
  codeLines: AuditLine[];
  steps: AuditStep[];
}

export interface AuditVariant {
  methodId: string;
  codeLines: AuditLine[];
  steps: AuditStep[];
}

export interface AuditFindings {
  errors: string[];
  warnings: string[];
}

export interface AuditOptions {
  /** Also flag identifiers named in the description that live on another line. */
  strict?: boolean;
}

/** The exports a topic's data module may expose. */
export interface TopicDataModule {
  STEPS?: AuditStep[];
  CODE_LINES?: AuditLine[];
  EXAMPLES?: (Partial<AuditExample> & {
    id: string;
    variants?: AuditVariant[];
  })[];
}

export const isBlank = (text: string) => text.trim() === "";
export const isBraceOnly = (text: string) => /^\s*[{}()[\];,]*\s*$/.test(text);
export const isComment = (text: string) => /^\s*(\/\/|--|#)/.test(text);
export const isTrivial = (text: string) => isBraceOnly(text) || isComment(text);

const identifiers = (text: string) =>
  new Set(
    (text.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) ?? []).filter((w) => w.length > 2),
  );

/**
 * Examples as authored, with per-method variants flattened into examples.
 * Single-example topics export STEPS and CODE_LINES; selector topics export
 * EXAMPLES, where an example may hold variants instead of its own steps.
 */
export const flattenExamples = (mod: TopicDataModule): AuditExample[] => {
  if (mod.STEPS && mod.CODE_LINES) {
    return [{ id: "default", codeLines: mod.CODE_LINES, steps: mod.STEPS }];
  }
  const examples = mod.EXAMPLES ?? [];
  return examples.flatMap((example) => {
    if (example.variants) {
      return example.variants.map((variant) => ({
        id: `${example.id}/${variant.methodId}`,
        codeLines: variant.codeLines,
        steps: variant.steps,
      }));
    }
    return example.codeLines && example.steps
      ? [{ id: example.id, codeLines: example.codeLines, steps: example.steps }]
      : [];
  });
};

export const auditExample = (
  example: AuditExample,
  { strict = false }: AuditOptions = {},
): AuditFindings => {
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
