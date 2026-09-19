import type { PipelineStage } from "@/components/visualization-ui/PipelineDiagram";
import type { TokenChip } from "@/components/visualization-ui/TokenChips";
import { entropyBits, fmt2, softmax } from "./helpers";
import type {
  CandidateRow,
  CandidateStatus,
  DetailTable,
  NextTokenExample,
  NextTokenStep,
} from "./types";

/* ------------------------------------------------------------------ */
/* Vocabulary slices and logits                                        */
/* ------------------------------------------------------------------ */

/**
 * Six candidate tokens out of a full vocabulary (a real model scores every
 * token, roughly 50k for GPT-2). Every number below is computed from these
 * logits with a plain softmax; rounded values were checked so each displayed
 * distribution sums to 1.00 at two decimals.
 */
const PROMPT_1 = ["The", " capital", " of", " France", " is"];
const VOCAB_1 = [" Paris", " Lyon", " a", " the", " located", " Berlin"];
const LOGITS_1 = [5.8, 2.0, 2.7, 2.5, 1.9, 1.0];

const VOCAB_2 = [".", ",", " and", " which", "\\n", " the"];
const LOGITS_2 = [5.1, 3.3, 2.6, 2.1, 1.7, 1.3];

const PROMPT_3 = ["The", " weather", " today", " is"];
const VOCAB_3 = [" sunny", " cold", " nice", " going", " not", " a"];
const LOGITS_3 = [2.3, 2.1, 1.9, 1.4, 0.7, 0.0];

const PROBS_1 = softmax(LOGITS_1);
const PROBS_1_COLD = softmax(LOGITS_1, 0.5);
const PROBS_1_HOT = softmax(LOGITS_1, 2);
const PROBS_2 = softmax(LOGITS_2);
const PROBS_3 = softmax(LOGITS_3);

const EXPS_1 = LOGITS_1.map((l) => Math.exp(l));
const Z_1 = EXPS_1.reduce((acc, e) => acc + e, 0);
const EXPS_2 = LOGITS_2.map((l) => Math.exp(l));
const Z_2 = EXPS_2.reduce((acc, e) => acc + e, 0);

/* ------------------------------------------------------------------ */
/* Row builders                                                        */
/* ------------------------------------------------------------------ */

type StatusMap = Partial<Record<string, CandidateStatus>>;

const statusOf = (token: string, map?: StatusMap): CandidateStatus =>
  map?.[token] ?? "neutral";

const rowsFrom = (
  vocab: string[],
  values: number[],
  display: (value: number) => string,
  map: StatusMap = {},
): CandidateRow[] => {
  const max = Math.max(...values, 1e-9);
  return vocab.map((token, i) => ({
    id: `c${i}`,
    token,
    display: display(values[i]),
    bar: Math.max(0, values[i] / max),
    status: statusOf(token, map),
  }));
};

const logitRows = (vocab: string[], logits: number[], map?: StatusMap) =>
  rowsFrom(vocab, logits, (v) => v.toFixed(1), map);

const scaledRows = (
  vocab: string[],
  logits: number[],
  t: number,
  map?: StatusMap,
) =>
  rowsFrom(
    vocab,
    logits.map((l) => l / t),
    fmt2,
    map,
  );

const expRows = (vocab: string[], exps: number[], map?: StatusMap) =>
  rowsFrom(vocab, exps, fmt2, map);

const probRows = (
  vocab: string[],
  probs: number[],
  map?: StatusMap,
): CandidateRow[] =>
  vocab.map((token, i) => ({
    id: `c${i}`,
    token,
    display: fmt2(probs[i]),
    bar: probs[i],
    status: statusOf(token, map),
  }));

/** Rows where dropped tokens show a zero bar after truncation. */
const truncatedRows = (
  vocab: string[],
  probs: number[],
  kept: string[],
  chosen?: string,
): CandidateRow[] =>
  vocab.map((token, i) => {
    const isKept = kept.includes(token);
    return {
      id: `c${i}`,
      token,
      display: isKept ? fmt2(probs[i]) : "0.00",
      bar: isKept ? probs[i] : 0,
      status: token === chosen ? "chosen" : isKept ? "kept" : "dropped",
    };
  });

/* ------------------------------------------------------------------ */
/* Pipeline, sequence, and table builders                              */
/* ------------------------------------------------------------------ */

type StageDef = [id: string, label: string, detail?: string];

const stagesAt = (defs: StageDef[], activeIndex: number): PipelineStage[] =>
  defs.map(([id, label, detail], i) => ({
    id,
    label,
    detail,
    status: i < activeIndex ? "done" : i === activeIndex ? "active" : "pending",
  }));

const FORWARD_STAGES: StageDef[] = [
  ["tokenize", "tokenize", "text to ids"],
  ["embed", "embed", "ids to vectors"],
  ["blocks", "transformer", "N blocks"],
  ["head", "lm head", "vocab logits"],
  ["sample", "sample", "softmax + pick"],
  ["append", "append", "grow ids"],
];

const TEMP_STAGES: StageDef[] = [
  ["logits", "logits", "from lm head"],
  ["scale", "divide by T", "rescale gaps"],
  ["softmax", "softmax", "to probabilities"],
  ["draw", "draw", "one sample"],
  ["append", "append", "grow ids"],
];

const TRUNC_STAGES: StageDef[] = [
  ["softmax", "softmax", "full distribution"],
  ["topk", "top-k", "keep k largest"],
  ["topp", "top-p", "cumulative >= p"],
  ["renorm", "renormalize", "sum back to 1"],
  ["draw", "draw", "one sample"],
];

const sequence = (
  prompt: string[],
  generated: string[],
  highlightLast = false,
): TokenChip[] => [
  ...prompt.map((label, i) => ({
    id: `p${i}`,
    label,
    tone: "neutral" as const,
  })),
  ...generated.map((label, i) => ({
    id: `g${i}`,
    label,
    tone:
      highlightLast && i === generated.length - 1
        ? ("active" as const)
        : ("match" as const),
  })),
];

const softmaxTable = (
  vocab: string[],
  logits: number[],
  exps: number[] | null,
  probs: number[] | null,
  chosen?: string,
): DetailTable => ({
  columns: ["token", "logit", "exp", "prob"],
  rows: vocab.map((token, i) => ({
    cells: [
      JSON.stringify(token),
      logits[i].toFixed(1),
      exps ? fmt2(exps[i]) : "",
      probs ? fmt2(probs[i]) : "",
    ],
    tone: token === chosen ? "chosen" : "neutral",
  })),
});

interface SettingRow {
  t: string;
  top: string;
  entropy: string;
  pick: string;
  tone?: "chosen" | "neutral" | "muted";
}

const settingsTable = (rows: SettingRow[]): DetailTable => ({
  columns: ["T", "top prob", "entropy", "picked"],
  rows: rows.map((r) => ({
    cells: [r.t, r.top, r.entropy, r.pick],
    tone: r.tone ?? "neutral",
  })),
});

const cumulativeTable = (
  vocab: string[],
  probs: number[],
  opts: {
    showCum?: boolean;
    kept?: string[];
    after?: number[];
    chosen?: string;
  } = {},
): DetailTable => {
  let running = 0;
  return {
    columns: ["token", "prob", "cumulative", "after"],
    rows: vocab.map((token, i) => {
      running += probs[i];
      const isKept = opts.kept ? opts.kept.includes(token) : true;
      return {
        cells: [
          JSON.stringify(token),
          fmt2(probs[i]),
          opts.showCum ? fmt2(running) : "",
          opts.after ? (isKept ? fmt2(opts.after[i]) : "0.00") : "",
        ],
        tone:
          token === opts.chosen
            ? "chosen"
            : opts.kept
              ? isKept
                ? "kept"
                : "dropped"
              : "neutral",
      };
    }),
  };
};

const step = (partial: NextTokenStep): NextTokenStep => partial;

const H_1 = entropyBits(PROBS_1);
const H_1_COLD = entropyBits(PROBS_1_COLD);
const H_1_HOT = entropyBits(PROBS_1_HOT);

/* ------------------------------------------------------------------ */
/* Example 1: logits to probabilities                                  */
/* ------------------------------------------------------------------ */

const SOFTMAX_STEPS: NextTokenStep[] = [
  step({
    simpleHtml:
      "The prompt <code>The capital of France is</code> is chopped into 5 pieces and turned into numbers. The model only ever sees this list of numbers, and the whole loop below is about adding to it.",
    descriptionHtml:
      'The prompt is split into 5 tokens and mapped to integer ids. The model never sees text, only this <span class="hl-api">id sequence</span>, which is the state the whole loop mutates.',
    activeLine: 1,
    doneLines: [],
    pipeline: stagesAt(FORWARD_STAGES, 0),
    candidateMode: "logit",
    candidates: [],
    candidateNote: null,
    table: null,
    sequence: sequence(PROMPT_1, []),
  }),
  step({
    simpleHtml:
      "The model reads all 5 pieces at once and works out a description for each one. Only the last description matters now, because it is the one that decides what comes next.",
    descriptionHtml:
      "The loop starts. A forward pass embeds all 5 positions and runs them through every transformer block. Each position ends up with a hidden vector, but only the <strong>last one</strong> matters for choosing what comes next.",
    activeLine: 3,
    doneLines: [1, 2],
    pipeline: stagesAt(FORWARD_STAGES, 2),
    candidateMode: "logit",
    candidates: [],
    candidateNote: null,
    table: null,
    sequence: sequence(PROMPT_1, []),
  }),
  step({
    simpleHtml:
      "That last description is compared with every word the model knows, giving each word a raw score. A real model scores tens of thousands of words; the panel shows the 6 that matter here.",
    descriptionHtml:
      'The <span class="hl-api">lm head</span> multiplies the last hidden vector by the output embedding matrix, producing one raw score (a logit) per vocabulary entry. A real vocabulary has tens of thousands of rows; the panel shows the 6 that matter here.',
    activeLine: 3,
    doneLines: [1, 2],
    pipeline: stagesAt(FORWARD_STAGES, 3),
    candidateMode: "logit",
    candidates: logitRows(VOCAB_1, LOGITS_1),
    candidateNote: "logits are unbounded and not comparable across steps",
    table: softmaxTable(VOCAB_1, LOGITS_1, null, null),
    sequence: sequence(PROMPT_1, []),
  }),
  step({
    simpleHtml:
      "Turning scores into odds, part one: make every score positive and stretch the gaps. A lead of 3.1 points for <code>Paris</code> over <code>a</code> becomes a 22 to 1 ratio.",
    descriptionHtml:
      'Softmax, first half: exponentiate each logit. <code>exp</code> turns additive gaps into multiplicative ratios, so the 3.1 point lead of <code>" Paris"</code> over <code>" a"</code> becomes a 22x ratio. Values are rounded to two decimals.',
    activeLine: 9,
    doneLines: [1, 2, 3, 8],
    pipeline: stagesAt(FORWARD_STAGES, 4),
    candidateMode: "exp",
    candidates: expRows(VOCAB_1, EXPS_1, { " Paris": "active" }),
    candidateNote: `sum of exp values Z = ${fmt2(Z_1)}`,
    table: softmaxTable(VOCAB_1, LOGITS_1, EXPS_1, null),
    sequence: sequence(PROMPT_1, []),
  }),
  step({
    simpleHtml:
      "Part two: divide each value by the total so they add up to 1. Now they are probabilities. <code>Paris</code> holds 88% of the chance, the other five share the rest.",
    descriptionHtml: `Softmax, second half: divide every exp value by their sum Z = ${fmt2(Z_1)}. The result is a <span class="hl-task">probability distribution</span>: all entries are positive and the exact values sum to 1 (1.00 after rounding).`,
    activeLine: 10,
    doneLines: [1, 2, 3, 8, 9],
    pipeline: stagesAt(FORWARD_STAGES, 4),
    candidateMode: "prob",
    candidates: probRows(VOCAB_1, PROBS_1),
    candidateNote: `sum = 1.00, entropy = ${fmt2(H_1)} bits`,
    table: softmaxTable(VOCAB_1, LOGITS_1, EXPS_1, PROBS_1),
    sequence: sequence(PROMPT_1, []),
  }),
  step({
    simpleHtml:
      "Greedy means always take the most likely word. <code>Paris</code> wins at 0.88. Nothing random happens, so the same prompt always gives the same answer, and the other 12% of the odds are thrown away.",
    descriptionHtml:
      'Greedy decoding takes the <span class="hl-task">argmax</span>: <code>" Paris"</code> at 0.88. Nothing random happens here, so the same prompt always yields the same token. The other 5 candidates are discarded, even though together they hold 12% of the mass.',
    activeLine: 5,
    doneLines: [1, 2, 3, 4, 8, 9, 10],
    pipeline: stagesAt(FORWARD_STAGES, 4),
    candidateMode: "prob",
    candidates: probRows(VOCAB_1, PROBS_1, { " Paris": "chosen" }),
    candidateNote: 'argmax = " Paris" (0.88)',
    table: softmaxTable(VOCAB_1, LOGITS_1, EXPS_1, PROBS_1, " Paris"),
    sequence: sequence(PROMPT_1, []),
  }),
  step({
    simpleHtml:
      "The chosen word is added to the end of the list. The model's own output becomes part of its next input, which is why this is called generating one word at a time.",
    descriptionHtml:
      'The chosen id is appended to the sequence. This is the <span class="hl-loop">autoregressive</span> part: the output of one step becomes input for the next, so the model conditions on its own predictions.',
    activeLine: 6,
    doneLines: [1, 2, 3, 4, 5, 8, 9, 10],
    pipeline: stagesAt(FORWARD_STAGES, 5),
    candidateMode: "prob",
    candidates: probRows(VOCAB_1, PROBS_1, { " Paris": "chosen" }),
    candidateNote: 'appended " Paris"',
    table: softmaxTable(VOCAB_1, LOGITS_1, EXPS_1, PROBS_1, " Paris"),
    sequence: sequence(PROMPT_1, [" Paris"], true),
  }),
  step({
    simpleHtml:
      "Round two. The model now reads 6 pieces. A shortcut lets it reuse its work on the first 5, so only the new word <code>Paris</code> needs to be processed properly.",
    descriptionHtml:
      'Second iteration. The model runs again on 6 tokens. With a <span class="hl-api">KV cache</span> the keys and values of the first 5 positions are reused, so only the new <code>" Paris"</code> position is computed through the blocks and attends over the cached ones.',
    activeLine: 3,
    doneLines: [1, 2, 4, 5, 6, 8, 9, 10],
    pipeline: stagesAt(FORWARD_STAGES, 2),
    candidateMode: "prob",
    candidates: [],
    candidateNote: null,
    table: null,
    sequence: sequence(PROMPT_1, [" Paris"]),
  }),
  step({
    simpleHtml:
      "A fresh set of scores for the new last position. The candidates changed because the sentence changed: after <code>Paris</code> the model expects a full stop or a comma, not another city.",
    descriptionHtml:
      'The lm head emits a fresh set of logits for the new last position. The candidates are different now because the context changed: after <code>" Paris"</code> the model expects punctuation or a conjunction, not another city.',
    activeLine: 3,
    doneLines: [1, 2, 4, 5, 6, 8, 9, 10],
    pipeline: stagesAt(FORWARD_STAGES, 3),
    candidateMode: "logit",
    candidates: logitRows(VOCAB_2, LOGITS_2),
    candidateNote: "a new distribution over the whole vocabulary, every step",
    table: softmaxTable(VOCAB_2, LOGITS_2, null, null),
    sequence: sequence(PROMPT_1, [" Paris"]),
  }),
  step({
    simpleHtml:
      "Same conversion to probabilities. <code>.</code> gets 74% and <code>,</code> gets 12%. The column adds up to 1 again.",
    descriptionHtml: `Softmax again: exponentiate, sum to Z = ${fmt2(Z_2)}, divide. <code>"."</code> takes 0.74 of the mass and <code>","</code> 0.12. Rounded to two decimals the column sums to 1.00.`,
    activeLine: 4,
    doneLines: [1, 2, 3, 5, 6, 8, 9, 10],
    pipeline: stagesAt(FORWARD_STAGES, 4),
    candidateMode: "prob",
    candidates: probRows(VOCAB_2, PROBS_2),
    candidateNote: `sum = 1.00, entropy = ${fmt2(entropyBits(PROBS_2))} bits`,
    table: softmaxTable(VOCAB_2, LOGITS_2, EXPS_2, PROBS_2),
    sequence: sequence(PROMPT_1, [" Paris"]),
  }),
  step({
    simpleHtml:
      "The most likely word is <code>.</code>, so it is added. The sentence now reads <code>The capital of France is Paris.</code> Greedy gave the same path it always would: same prompt, same two words, every time.",
    descriptionHtml:
      'Argmax picks <code>"."</code> and it is appended. The sequence now reads <code>The capital of France is Paris.</code> Greedy decoding gave a deterministic path: same prompt, same weights, same two tokens every run.',
    activeLine: 6,
    doneLines: [1, 2, 3, 4, 5, 8, 9, 10],
    pipeline: stagesAt(FORWARD_STAGES, 5),
    candidateMode: "prob",
    candidates: probRows(VOCAB_2, PROBS_2, { ".": "chosen" }),
    candidateNote: 'appended "."',
    table: softmaxTable(VOCAB_2, LOGITS_2, EXPS_2, PROBS_2, "."),
    sequence: sequence(PROMPT_1, [" Paris", "."], true),
  }),
  step({
    simpleHtml:
      "The loop stops after a set number of words, or sooner if the model picks its special end marker. That is all generation is: one full read of the text per new word, each time scoring the entire dictionary.",
    descriptionHtml:
      "The loop stops after <code>max_new_tokens</code> iterations, or earlier if the picked id is the end-of-sequence token. Generation is just this loop: one full forward pass per emitted token, each producing a distribution over the entire vocabulary.",
    activeLine: 2,
    doneLines: [1, 3, 4, 5, 6, 8, 9, 10],
    pipeline: stagesAt(FORWARD_STAGES, 6),
    candidateMode: "prob",
    candidates: probRows(VOCAB_2, PROBS_2, { ".": "chosen" }),
    candidateNote: "loop finished",
    table: softmaxTable(VOCAB_2, LOGITS_2, EXPS_2, PROBS_2, "."),
    sequence: sequence(PROMPT_1, [" Paris", "."]),
  }),
];

/* ------------------------------------------------------------------ */
/* Example 2: temperature                                              */
/* ------------------------------------------------------------------ */

const ROW_COLD: SettingRow = {
  t: "0.5",
  top: fmt2(PROBS_1_COLD[0]),
  entropy: `${fmt2(H_1_COLD)} b`,
  pick: '" Paris"',
};
const ROW_ONE: SettingRow = {
  t: "1.0",
  top: fmt2(PROBS_1[0]),
  entropy: `${fmt2(H_1)} b`,
  pick: '" a"',
};
const ROW_HOT: SettingRow = {
  t: "2.0",
  top: fmt2(PROBS_1_HOT[0]),
  entropy: `${fmt2(H_1_HOT)} b`,
  pick: '" Lyon"',
};
const ROW_ZERO: SettingRow = {
  t: "0",
  top: "1.00",
  entropy: "0.00 b",
  pick: '" Paris"',
};

const TEMPERATURE_STEPS: NextTokenStep[] = [
  step({
    simpleHtml:
      "Same prompt, same model, same 6 raw scores as before. Temperature does not change the model at all; it is a knob turned on the scores just before they become probabilities.",
    descriptionHtml:
      "Same prompt, same forward pass, same 6 logits as before. Temperature does not touch the model at all; it is a knob applied to these scores <strong>after</strong> the lm head and before softmax.",
    activeLine: 1,
    doneLines: [],
    pipeline: stagesAt(TEMP_STAGES, 0),
    candidateMode: "logit",
    candidates: logitRows(VOCAB_1, LOGITS_1),
    candidateNote: "raw logits, T not applied yet",
    table: settingsTable([]),
    sequence: sequence(PROMPT_1, []),
  }),
  step({
    simpleHtml:
      "Temperature 0.5 doubles every score. The order stays the same, but the lead of <code>Paris</code> over <code>a</code> grows from 3.1 to 6.2, and the conversion will turn that into a much bigger gap in the odds.",
    descriptionHtml:
      '<code>T = 0.5</code>: every logit is divided by 0.5, which doubles it. The ordering is unchanged, but the gap between <code>" Paris"</code> and <code>" a"</code> grows from 3.1 to 6.2, and softmax will turn that into a much bigger ratio.',
    activeLine: 6,
    doneLines: [1, 3, 4, 9],
    pipeline: stagesAt(TEMP_STAGES, 1),
    candidateMode: "scaled",
    candidates: scaledRows(VOCAB_1, LOGITS_1, 0.5, { " Paris": "active" }),
    candidateNote: "logits / 0.5, gaps doubled",
    table: settingsTable([]),
    sequence: sequence(PROMPT_1, []),
  }),
  step({
    simpleHtml:
      "With the doubled scores, <code>Paris</code> takes essentially 100% and everything else rounds to 0. Low temperature makes the model very sure of itself.",
    descriptionHtml: `Softmax of the doubled logits: <code>" Paris"</code> gets ${fmt2(PROBS_1_COLD[0])} and everything else rounds to 0.00 at two decimals (<code>" a"</code> is really 0.002). Entropy drops to ${fmt2(H_1_COLD)} bits. Low temperature <span class="hl-task">sharpens</span> the distribution.`,
    activeLine: 6,
    doneLines: [1, 3, 4, 9],
    pipeline: stagesAt(TEMP_STAGES, 2),
    candidateMode: "prob",
    candidates: probRows(VOCAB_1, PROBS_1_COLD),
    candidateNote: `sum = 1.00 (rounded), entropy = ${fmt2(H_1_COLD)} bits`,
    table: settingsTable([{ ...ROW_COLD, pick: "" }]),
    sequence: sequence(PROMPT_1, []),
  }),
  step({
    simpleHtml:
      "Picking a word at random with these odds gives <code>Paris</code> about 996 times out of 1000. It is almost greedy, but not quite: a rare run can still pick something else.",
    descriptionHtml:
      'A multinomial draw at T = 0.5 picks <code>" Paris"</code> in about 996 of 1000 runs. This is close to greedy but not identical: the tail still has nonzero mass, so a rare run can still pick something else.',
    activeLine: 7,
    doneLines: [1, 3, 4, 6, 9],
    pipeline: stagesAt(TEMP_STAGES, 3),
    candidateMode: "prob",
    candidates: probRows(VOCAB_1, PROBS_1_COLD, { " Paris": "chosen" }),
    candidateNote: 'drew u = 0.41, landed on " Paris"',
    table: settingsTable([{ ...ROW_COLD, tone: "chosen" }]),
    sequence: sequence(PROMPT_1, [" Paris"], true),
  }),
  step({
    simpleHtml:
      "Temperature 1.0 leaves the scores untouched, so the odds are exactly what the model learned: <code>Paris</code> at 88%.",
    descriptionHtml: `<code>T = 1.0</code> divides by 1, so the logits and the resulting probabilities are exactly what the model learned: <code>" Paris"</code> at ${fmt2(PROBS_1[0])}, entropy ${fmt2(H_1)} bits. This is the untouched distribution.`,
    activeLine: 6,
    doneLines: [1, 3, 4, 7, 9],
    pipeline: stagesAt(TEMP_STAGES, 2),
    candidateMode: "prob",
    candidates: probRows(VOCAB_1, PROBS_1),
    candidateNote: `sum = 1.00, entropy = ${fmt2(H_1)} bits`,
    table: settingsTable([ROW_COLD, { ...ROW_ONE, pick: "" }]),
    sequence: sequence(PROMPT_1, []),
  }),
  step({
    simpleHtml:
      "Now the dice roll. Imagine a line from 0 to 1 with each word owning a slice as wide as its odds. A random number 0.91 lands just past <code>Paris</code> and <code>Lyon</code>, inside <code>a</code>. A 4% event happened, which is why answers vary from run to run.",
    descriptionHtml:
      'Sampling walks the cumulative sum with a uniform random <code>u</code>. Here <code>u = 0.91</code> falls past <code>" Paris"</code> (0.88) and <code>" Lyon"</code> (0.90) into <code>" a"</code>. A 4% event happened, which is why sampled outputs <span class="hl-loop">differ between runs</span>.',
    activeLine: 7,
    doneLines: [1, 3, 4, 6, 9, 10],
    pipeline: stagesAt(TEMP_STAGES, 3),
    candidateMode: "prob",
    candidates: probRows(VOCAB_1, PROBS_1, { " a": "chosen" }),
    candidateNote: 'drew u = 0.91, landed on " a"',
    table: settingsTable([ROW_COLD, { ...ROW_ONE, tone: "chosen" }]),
    sequence: sequence(PROMPT_1, [" a"], true),
  }),
  step({
    simpleHtml:
      "Temperature 2.0 halves every score. The lead of <code>Paris</code> shrinks from 3.1 to 1.55. The order never changes; temperature only squeezes or stretches the gaps.",
    descriptionHtml:
      '<code>T = 2.0</code> halves every logit. The lead of <code>" Paris"</code> shrinks from 3.1 to 1.55 points over <code>" a"</code>. Again the ranking is preserved; temperature can never reorder candidates, only compress or stretch the gaps.',
    activeLine: 6,
    doneLines: [1, 3, 4, 7, 9, 10],
    pipeline: stagesAt(TEMP_STAGES, 1),
    candidateMode: "scaled",
    candidates: scaledRows(VOCAB_1, LOGITS_1, 2, { " Paris": "active" }),
    candidateNote: "logits / 2.0, gaps halved",
    table: settingsTable([ROW_COLD, ROW_ONE]),
    sequence: sequence(PROMPT_1, []),
  }),
  step({
    simpleHtml:
      "With the halved scores the odds flatten out: <code>Paris</code> drops to 56% and <code>Berlin</code> rises to 5%. More variety, and more wrong answers.",
    descriptionHtml: `Softmax of the halved logits <span class="hl-task">flattens</span> the distribution: <code>" Paris"</code> falls to ${fmt2(PROBS_1_HOT[0])}, <code>" Berlin"</code> rises to ${fmt2(PROBS_1_HOT[5])}, and entropy climbs to ${fmt2(H_1_HOT)} bits. More variety, more wrong answers.`,
    activeLine: 6,
    doneLines: [1, 3, 4, 7, 9, 10],
    pipeline: stagesAt(TEMP_STAGES, 2),
    candidateMode: "prob",
    candidates: probRows(VOCAB_1, PROBS_1_HOT),
    candidateNote: `sum = 1.00, entropy = ${fmt2(H_1_HOT)} bits`,
    table: settingsTable([ROW_COLD, ROW_ONE, { ...ROW_HOT, pick: "" }]),
    sequence: sequence(PROMPT_1, []),
  }),
  step({
    simpleHtml:
      "The dice roll 0.62 lands past <code>Paris</code> (56%) and inside <code>Lyon</code>. At temperature 2 a factual slip like this happens about once in 12 runs. The model knew the answer; the random pick ignored it.",
    descriptionHtml:
      'A draw with <code>u = 0.62</code> passes <code>" Paris"</code> (cumulative 0.56) and lands on <code>" Lyon"</code> (cumulative 0.64). At T = 2 a factual error like this happens roughly 1 run in 12; the model still knew the answer, the sampler ignored it.',
    activeLine: 11,
    doneLines: [1, 3, 4, 6, 7, 9, 10],
    pipeline: stagesAt(TEMP_STAGES, 3),
    candidateMode: "prob",
    candidates: probRows(VOCAB_1, PROBS_1_HOT, { " Lyon": "chosen" }),
    candidateNote: 'drew u = 0.62, landed on " Lyon"',
    table: settingsTable([ROW_COLD, ROW_ONE, { ...ROW_HOT, tone: "chosen" }]),
    sequence: sequence(PROMPT_1, [" Lyon"], true),
  }),
  step({
    simpleHtml:
      "Temperature 0 is special: you cannot divide by zero, so the program skips the odds entirely and takes the top word. That is greedy decoding, always the same answer, the extreme that 0.5 was heading towards.",
    descriptionHtml:
      "<code>T = 0</code> is a special case: dividing by zero is undefined, so implementations skip softmax and take the argmax directly. That is greedy decoding, deterministic with zero entropy, the limit that T = 0.5 was approaching.",
    activeLine: 5,
    doneLines: [1, 3, 4, 6, 7, 9, 10, 11],
    pipeline: stagesAt(TEMP_STAGES, 3),
    candidateMode: "prob",
    candidates: probRows(VOCAB_1, PROBS_1, { " Paris": "chosen" }),
    candidateNote: "T = 0: argmax, no draw",
    table: settingsTable([
      ROW_COLD,
      ROW_ONE,
      ROW_HOT,
      { ...ROW_ZERO, tone: "chosen" },
    ]),
    sequence: sequence(PROMPT_1, [" Paris"], true),
  }),
  step({
    simpleHtml:
      "Four runs, one model, four settings. Temperature trades predictability for variety. Around 0.7 to 1.0 is typical for chat; 0 for anything that must come out the same every time.",
    descriptionHtml:
      "Four runs, one model, four settings. Temperature trades determinism for diversity by rescaling logits before softmax. Values near 0.7 to 1.0 are typical for chat; 0 for anything that must be reproducible.",
    activeLine: null,
    doneLines: [1, 3, 4, 5, 6, 7, 9, 10, 11],
    pipeline: stagesAt(TEMP_STAGES, 5),
    candidateMode: "prob",
    candidates: probRows(VOCAB_1, PROBS_1),
    candidateNote: "T = 1.0 shown for reference",
    table: settingsTable([ROW_COLD, ROW_ONE, ROW_HOT, ROW_ZERO]),
    sequence: sequence(PROMPT_1, []),
  }),
];

/* ------------------------------------------------------------------ */
/* Example 3: top-k and top-p                                          */
/* ------------------------------------------------------------------ */

const TOPK_KEEP = VOCAB_3.slice(0, 3);
const TOPK_Z = PROBS_3.slice(0, 3).reduce((acc, p) => acc + p, 0);
const PROBS_3_TOPK = PROBS_3.map((p, i) => (i < 3 ? p / TOPK_Z : 0));

const TOPP_KEEP = VOCAB_3.slice(0, 4);
const TOPP_Z = PROBS_3.slice(0, 4).reduce((acc, p) => acc + p, 0);
const PROBS_3_TOPP = PROBS_3.map((p, i) => (i < 4 ? p / TOPP_Z : 0));

const TRUNCATION_STEPS: NextTokenStep[] = [
  step({
    simpleHtml:
      "A new prompt where no word is a clear winner. <code>sunny</code> leads with 31%, but the top three together only reach 78%. Rolling the dice on these odds would pick one of the two unlikely words 9% of the time.",
    descriptionHtml: `A new prompt with a flatter distribution: no single token dominates. <code>" sunny"</code> leads with ${fmt2(PROBS_3[0])} but the top three together hold only ${fmt2(PROBS_3[0] + PROBS_3[1] + PROBS_3[2])}. Sampling from this raw distribution would pick the two tail tokens 9% of the time.`,
    activeLine: 1,
    doneLines: [],
    pipeline: stagesAt(TRUNC_STAGES, 0),
    candidateMode: "prob",
    candidates: probRows(VOCAB_3, PROBS_3),
    candidateNote: "sum = 1.00, sorted from most to least likely",
    table: cumulativeTable(VOCAB_3, PROBS_3),
    sequence: sequence(PROMPT_3, []),
  }),
  step({
    simpleHtml:
      "Top-k with k = 3 keeps the 3 most likely words and no more. The count is fixed no matter how the odds are spread, which is its weakness.",
    descriptionHtml:
      '<span class="hl-api">Top-k</span> with <code>k = 3</code> sorts the probabilities and marks the 3 largest. The count is fixed no matter how the mass is spread, which is the weakness of this method.',
    activeLine: 4,
    doneLines: [1, 3],
    pipeline: stagesAt(TRUNC_STAGES, 1),
    candidateMode: "prob",
    candidates: probRows(VOCAB_3, PROBS_3, {
      " sunny": "kept",
      " cold": "kept",
      " nice": "kept",
    }),
    candidateNote: "k = 3 candidates selected",
    table: cumulativeTable(VOCAB_3, PROBS_3, { kept: TOPK_KEEP }),
    sequence: sequence(PROMPT_3, []),
  }),
  step({
    simpleHtml:
      "Everything outside the top 3 is set to zero. The survivors add up to only 78%, so the odds are no longer complete.",
    descriptionHtml: `Everything outside the top 3 is set to zero. The kept probabilities now sum to ${fmt2(TOPK_Z)}, so the result is no longer a valid distribution.`,
    activeLine: 5,
    doneLines: [1, 3, 4],
    pipeline: stagesAt(TRUNC_STAGES, 1),
    candidateMode: "prob",
    candidates: truncatedRows(VOCAB_3, PROBS_3, TOPK_KEEP),
    candidateNote: `kept mass = ${fmt2(TOPK_Z)}, not yet renormalized`,
    table: cumulativeTable(VOCAB_3, PROBS_3, { kept: TOPK_KEEP }),
    sequence: sequence(PROMPT_3, []),
  }),
  step({
    simpleHtml:
      "Divide the survivors by 0.78 so they add up to 1 again: <code>0.40, 0.33, 0.27</code>. The gaps between them are the same as before; the missing 22% was shared out in proportion.",
    descriptionHtml: `Dividing the survivors by ${fmt2(TOPK_Z)} <span class="hl-task">renormalizes</span> them: ${fmt2(PROBS_3_TOPK[0])}, ${fmt2(PROBS_3_TOPK[1])}, ${fmt2(PROBS_3_TOPK[2])}. Their relative odds are unchanged; the tail's mass was redistributed proportionally.`,
    activeLine: 6,
    doneLines: [1, 3, 4, 5],
    pipeline: stagesAt(TRUNC_STAGES, 3),
    candidateMode: "prob",
    candidates: truncatedRows(VOCAB_3, PROBS_3_TOPK, TOPK_KEEP),
    candidateNote: "sum = 1.00 after top-k renormalization",
    table: cumulativeTable(VOCAB_3, PROBS_3, {
      kept: TOPK_KEEP,
      after: PROBS_3_TOPK,
    }),
    sequence: sequence(PROMPT_3, []),
  }),
  step({
    simpleHtml:
      "Top-p, also called nucleus sampling, starts over from the full odds and sorts them from most to least likely. Instead of a fixed count, it keeps just enough words to cover a target share.",
    descriptionHtml:
      '<span class="hl-api">Top-p</span> (nucleus sampling) starts over from the full distribution and sorts it in descending order. Instead of a fixed count it will keep the smallest prefix whose mass reaches <code>p</code>.',
    activeLine: 9,
    doneLines: [1, 3, 4, 5, 6, 8],
    pipeline: stagesAt(TRUNC_STAGES, 2),
    candidateMode: "prob",
    candidates: probRows(VOCAB_3, PROBS_3),
    candidateNote: "back to the full distribution, sorted",
    table: cumulativeTable(VOCAB_3, PROBS_3),
    sequence: sequence(PROMPT_3, []),
  }),
  step({
    simpleHtml:
      "Add the odds up as you go down the sorted list: <code>0.31, 0.57, 0.78, 0.91, 0.97, 1.00</code>. Reading down shows how many words it takes to cover any target.",
    descriptionHtml:
      "The cumulative column is a running sum down the sorted list: 0.31, 0.57, 0.78, 0.91, 0.97, 1.00. Reading it top down shows how many tokens are needed to cover any target mass.",
    activeLine: 10,
    doneLines: [1, 3, 4, 5, 6, 8, 9],
    pipeline: stagesAt(TRUNC_STAGES, 2),
    candidateMode: "prob",
    candidates: probRows(VOCAB_3, PROBS_3),
    candidateNote: "cumulative sums shown in the table",
    table: cumulativeTable(VOCAB_3, PROBS_3, { showCum: true }),
    sequence: sequence(PROMPT_3, []),
  }),
  step({
    simpleHtml:
      "With a target of 0.9, the running total first reaches 0.9 at <code>going</code> (0.91), so 4 words are kept and <code>not</code> and <code>a</code> are cut. On the earlier Paris prompt, where one word dominated, the same target would have kept only 2.",
    descriptionHtml:
      'With <code>p = 0.9</code> the first row whose cumulative value reaches 0.9 is <code>" going"</code> at 0.91, so 4 tokens are kept and <code>" not"</code> and <code>" a"</code> are cut. Top-k kept 3 here; on the peaked Paris distribution top-p 0.9 would keep only 2.',
    activeLine: 11,
    doneLines: [1, 3, 4, 5, 6, 8, 9, 10],
    pipeline: stagesAt(TRUNC_STAGES, 2),
    candidateMode: "prob",
    candidates: probRows(VOCAB_3, PROBS_3, {
      " sunny": "kept",
      " cold": "kept",
      " nice": "kept",
      " going": "kept",
      " not": "dropped",
      " a": "dropped",
    }),
    candidateNote: "nucleus = 4 tokens with cumulative 0.91 >= 0.9",
    table: cumulativeTable(VOCAB_3, PROBS_3, {
      showCum: true,
      kept: TOPP_KEEP,
    }),
    sequence: sequence(PROMPT_3, []),
  }),
  step({
    simpleHtml:
      "The two cut words are zeroed and the rest are rescaled to add up to 1: <code>0.35, 0.28, 0.23, 0.14</code>. The 9% that lived in the unlikely tail is gone.",
    descriptionHtml: `The two dropped tokens are zeroed and the nucleus is divided by its mass ${fmt2(TOPP_Z)}. New values: ${fmt2(PROBS_3_TOPP[0])}, ${fmt2(PROBS_3_TOPP[1])}, ${fmt2(PROBS_3_TOPP[2])}, ${fmt2(PROBS_3_TOPP[3])}. The 9% that lived in the tail is gone.`,
    activeLine: 13,
    doneLines: [1, 3, 4, 5, 6, 8, 9, 10, 11, 12],
    pipeline: stagesAt(TRUNC_STAGES, 3),
    candidateMode: "prob",
    candidates: truncatedRows(VOCAB_3, PROBS_3_TOPP, TOPP_KEEP),
    candidateNote: "sum = 1.00 after top-p renormalization",
    table: cumulativeTable(VOCAB_3, PROBS_3, {
      showCum: true,
      kept: TOPP_KEEP,
      after: PROBS_3_TOPP,
    }),
    sequence: sequence(PROMPT_3, []),
  }),
  step({
    simpleHtml:
      "One dice roll on the trimmed odds. 0.62 passes <code>sunny</code> (0.35) and stops inside <code>cold</code> (0.63). Not the top word, but a reasonable one.",
    descriptionHtml: `One multinomial draw from the truncated distribution. <code>u = 0.62</code> passes <code>" sunny"</code> (cumulative ${fmt2(PROBS_3_TOPP[0])}) and stops inside <code>" cold"</code> (cumulative ${fmt2(PROBS_3_TOPP[0] + PROBS_3_TOPP[1])}). Not the top token, but a plausible one.`,
    activeLine: 15,
    doneLines: [1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13],
    pipeline: stagesAt(TRUNC_STAGES, 4),
    candidateMode: "prob",
    candidates: truncatedRows(VOCAB_3, PROBS_3_TOPP, TOPP_KEEP, " cold"),
    candidateNote: 'drew u = 0.62, landed on " cold"',
    table: cumulativeTable(VOCAB_3, PROBS_3, {
      showCum: true,
      kept: TOPP_KEEP,
      after: PROBS_3_TOPP,
      chosen: " cold",
    }),
    sequence: sequence(PROMPT_3, []),
  }),
  step({
    simpleHtml:
      "<code>cold</code> is added and the loop goes on. Another run would roll differently and might pick <code>sunny</code> or <code>nice</code>. Trimming limits which words are possible; it does not remove the randomness.",
    descriptionHtml:
      '<code>" cold"</code> is appended and the loop continues. Another run would draw a different <code>u</code> and could return <code>" sunny"</code> or <code>" nice"</code>; truncation only bounds the set of outcomes, it does not remove randomness.',
    activeLine: 15,
    doneLines: [1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13],
    pipeline: stagesAt(TRUNC_STAGES, 5),
    candidateMode: "prob",
    candidates: truncatedRows(VOCAB_3, PROBS_3_TOPP, TOPP_KEEP, " cold"),
    candidateNote: 'appended " cold"',
    table: cumulativeTable(VOCAB_3, PROBS_3, {
      showCum: true,
      kept: TOPP_KEEP,
      after: PROBS_3_TOPP,
      chosen: " cold",
    }),
    sequence: sequence(PROMPT_3, [" cold"], true),
  }),
  step({
    simpleHtml:
      "Top-k keeps a fixed number of options; top-p keeps as many as the model's confidence justifies, so it adapts between confident and uncertain moments. Real systems usually apply temperature first, then top-k and top-p, then roll.",
    descriptionHtml:
      "Top-k keeps a fixed number of candidates; top-p keeps a variable number sized by confidence, which adapts between peaked and flat steps. Production samplers usually apply temperature first, then top-k and top-p, then draw.",
    activeLine: null,
    doneLines: [1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15],
    pipeline: stagesAt(TRUNC_STAGES, 5),
    candidateMode: "prob",
    candidates: probRows(VOCAB_3, PROBS_3, {
      " not": "dropped",
      " a": "dropped",
    }),
    candidateNote: "original distribution, tail marked for reference",
    table: cumulativeTable(VOCAB_3, PROBS_3, {
      showCum: true,
      kept: TOPP_KEEP,
      after: PROBS_3_TOPP,
    }),
    sequence: sequence(PROMPT_3, [" cold"]),
  }),
];

/* ------------------------------------------------------------------ */
/* Examples                                                            */
/* ------------------------------------------------------------------ */

export const EXAMPLES: NextTokenExample[] = [
  {
    id: "softmax",
    title: "Logits to probabilities",
    description:
      "A forward pass scores every vocabulary token, softmax turns the scores into probabilities, and greedy decoding appends the argmax.",
    kind: "softmax",
    tablePanelTitle: "Softmax",
    codeLines: [
      { num: 1, text: 'ids = tokenize("The capital of France is")' },
      { num: 2, text: "for step in range(max_new_tokens):" },
      { num: 3, text: "    logits = model(ids)[-1]      # last position" },
      { num: 4, text: "    probs = softmax(logits)" },
      { num: 5, text: "    next_id = argmax(probs)      # greedy" },
      { num: 6, text: "    ids.append(next_id)" },
      { num: 7, text: "" },
      { num: 8, text: "def softmax(z):" },
      {
        num: 9,
        text: "    e = exp(z - max(z))          # shift for stability",
      },
      { num: 10, text: "    return e / e.sum()" },
    ],
    steps: SOFTMAX_STEPS,
  },
  {
    id: "temperature",
    title: "Temperature",
    description:
      "Divide the logits by T before softmax. Low T sharpens toward the argmax, high T flattens toward uniform, T = 0 is greedy.",
    kind: "temperature",
    tablePanelTitle: "Settings",
    codeLines: [
      { num: 1, text: "logits = model(ids)[-1]" },
      { num: 2, text: "" },
      { num: 3, text: "def sample(logits, T):" },
      { num: 4, text: "    if T == 0:" },
      { num: 5, text: "        return argmax(logits)      # greedy" },
      { num: 6, text: "    probs = softmax(logits / T)" },
      { num: 7, text: "    return multinomial(probs)     # one draw" },
      { num: 8, text: "" },
      { num: 9, text: "sample(logits, T=0.5)   # sharper" },
      { num: 10, text: "sample(logits, T=1.0)   # as learned" },
      { num: 11, text: "sample(logits, T=2.0)   # flatter" },
    ],
    steps: TEMPERATURE_STEPS,
  },
  {
    id: "truncation",
    title: "Top-k and top-p",
    description:
      "Cut the tail of the distribution before sampling: top-k keeps a fixed count, top-p keeps the smallest set that covers p of the mass.",
    kind: "truncation",
    tablePanelTitle: "Cumulative",
    codeLines: [
      { num: 1, text: "probs = softmax(model(ids)[-1])" },
      { num: 2, text: "" },
      { num: 3, text: "def top_k(probs, k):" },
      { num: 4, text: "    keep = argsort(probs)[-k:]        # k largest" },
      { num: 5, text: "    probs[not keep] = 0" },
      { num: 6, text: "    return probs / probs.sum()        # renormalize" },
      { num: 7, text: "" },
      { num: 8, text: "def top_p(probs, p):" },
      { num: 9, text: "    order = argsort(probs)[::-1]      # descending" },
      { num: 10, text: "    cum = cumsum(probs[order])" },
      { num: 11, text: "    keep = order[: (cum >= p).argmax() + 1]" },
      { num: 12, text: "    probs[not keep] = 0" },
      { num: 13, text: "    return probs / probs.sum()" },
      { num: 14, text: "" },
      { num: 15, text: "next_id = multinomial(top_p(probs, 0.9))" },
    ],
    steps: TRUNCATION_STEPS,
  },
];
