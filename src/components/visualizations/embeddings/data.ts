import type { TokenChip } from "@/components/visualization-ui/TokenChips";
import type {
  EmbeddingsExample,
  EmbeddingsStep,
  SignedBar,
  VectorTable,
} from "./types";

/* ------------------------------------------------------------------ */
/* Small builders so each step stays a readable full snapshot          */
/* ------------------------------------------------------------------ */

const DIMS4 = ["d0", "d1", "d2", "d3"];
const DIMS3 = ["d0", "d1", "d2"];

const table = (
  rowLabels: string[],
  colLabels: string[],
  values: (number | null)[][],
  activeRow: number | null = null,
  doneRows: number[] = [],
): VectorTable => ({ rowLabels, colLabels, values, activeRow, doneRows });

const bars = (prefix: string, values: number[]): SignedBar[] =>
  values.map((value, i) => ({ id: `${prefix}-d${i}`, label: `d${i}`, value }));

const vec = (values: number[]) =>
  `[${values.map((v) => v.toFixed(2)).join(", ")}]`;

/* ------------------------------------------------------------------ */
/* Example 1: lookup table                                              */
/* ------------------------------------------------------------------ */

const VOCAB = ["the", "cat", "dog", "car", "sat", "on"];
const E: number[][] = [
  [0.1, -0.2, 0.05, 0.3],
  [0.8, 0.6, -0.3, 0.1],
  [0.75, 0.55, -0.25, 0.2],
  [-0.4, 0.1, 0.9, -0.5],
  [0.2, -0.7, 0.15, 0.6],
  [-0.1, 0.05, -0.6, 0.4],
];

const lookupChips = (
  states: ("pending" | "active" | "done")[],
): TokenChip[] =>
  [
    { id: "cat", label: "cat", value: "id 1" },
    { id: "dog", label: "dog", value: "id 2" },
    { id: "car", label: "car", value: "id 3" },
  ].map((chip, i) => ({
    ...chip,
    tone:
      states[i] === "active"
        ? "active"
        : states[i] === "done"
          ? "match"
          : "neutral",
  }));

const eTable = (activeRow: number | null, doneRows: number[] = []) =>
  table(VOCAB, DIMS4, E, activeRow, doneRows);

const X_CAT = `X[0] = E[1] = ${vec(E[1])}`;
const X_DOG = `X[1] = E[2] = ${vec(E[2])}`;
const X_CAR = `X[2] = E[3] = ${vec(E[3])}`;

const LOOKUP_STEPS: EmbeddingsStep[] = [
  {
    descriptionHtml:
      'The model owns an embedding matrix <code>E</code> with one row per vocabulary entry and one column per dimension. Here <code>V = 6</code> and <code>d = 4</code>, so <code>E</code> holds <span class="hl-stack">24 learned parameters</span>.',
    activeLine: 3,
    doneLines: [1, 2],
    primaryTable: eTable(null),
    secondaryTable: null,
    chips: [],
    bars: [],
    computation: [],
  },
  {
    descriptionHtml:
      'These numbers are not hand written. Training starts them at small random values and <span class="hl-api">gradient descent</span> nudges each row until the model predicts text well, so the values encode how each token is used.',
    activeLine: 3,
    doneLines: [1, 2],
    primaryTable: eTable(null),
    secondaryTable: null,
    chips: [],
    bars: [],
    computation: [],
  },
  {
    descriptionHtml:
      'The tokenizer turns <code>"cat dog car"</code> into integer ids <code>[1, 2, 3]</code>. An id is only an index into <code>E</code>, it carries <span class="hl-task">no meaning by itself</span>.',
    activeLine: 5,
    doneLines: [1, 2, 3],
    primaryTable: eTable(null),
    secondaryTable: null,
    chips: lookupChips(["pending", "pending", "pending"]),
    bars: [],
    computation: [],
  },
  {
    descriptionHtml:
      'The loop reads <code>E[1]</code> for <code>cat</code>. This is a plain <span class="hl-api">row lookup</span>, there is no multiplication involved, which is why the input layer of a language model is cheap.',
    activeLine: 9,
    doneLines: [1, 2, 3, 5, 7, 8],
    primaryTable: eTable(1),
    secondaryTable: null,
    chips: lookupChips(["active", "pending", "pending"]),
    bars: bars("cat", E[1]),
    computation: [],
  },
  {
    descriptionHtml:
      'The copied row becomes <code>X[0]</code>. The same four numbers appear every time <code>cat</code> shows up in any sentence, because the lookup depends <span class="hl-stack">only on the id</span>.',
    activeLine: 10,
    doneLines: [1, 2, 3, 5, 7, 8, 9],
    primaryTable: eTable(null, [1]),
    secondaryTable: null,
    chips: lookupChips(["done", "pending", "pending"]),
    bars: bars("cat", E[1]),
    computation: [X_CAT],
  },
  {
    descriptionHtml:
      'Next id is 2, so the loop reads <code>E[2]</code> for <code>dog</code>. Note how close this row sits to the <code>cat</code> row: every dimension differs by <span class="hl-task">0.10 or less</span>.',
    activeLine: 9,
    doneLines: [1, 2, 3, 5, 7, 8, 10],
    primaryTable: eTable(2, [1]),
    secondaryTable: null,
    chips: lookupChips(["done", "active", "pending"]),
    bars: bars("dog", E[2]),
    computation: [X_CAT],
  },
  {
    descriptionHtml:
      'The <code>dog</code> row is appended as <code>X[1]</code>. Training pushed <code>cat</code> and <code>dog</code> together because they appear in <span class="hl-api">similar contexts</span>, and similar contexts call for similar predictions.',
    activeLine: 10,
    doneLines: [1, 2, 3, 5, 7, 8, 9],
    primaryTable: eTable(null, [1, 2]),
    secondaryTable: null,
    chips: lookupChips(["done", "done", "pending"]),
    bars: bars("dog", E[2]),
    computation: [X_CAT, X_DOG],
  },
  {
    descriptionHtml:
      'Id 3 selects <code>E[3]</code> for <code>car</code>. The sign flips on <code>d0</code> and <code>d3</code> and <code>d2</code> jumps to 0.90, so this row points in a <span class="hl-loop">different direction</span> from the two animals.',
    activeLine: 9,
    doneLines: [1, 2, 3, 5, 7, 8, 10],
    primaryTable: eTable(3, [1, 2]),
    secondaryTable: null,
    chips: lookupChips(["done", "done", "active"]),
    bars: bars("car", E[3]),
    computation: [X_CAT, X_DOG],
  },
  {
    descriptionHtml:
      'The <code>car</code> row completes <code>X</code>, a 3 by 4 matrix: one row per input token, one column per dimension. This matrix is what the <span class="hl-micro">first transformer layer</span> receives.',
    activeLine: 10,
    doneLines: [1, 2, 3, 5, 7, 8, 9],
    primaryTable: eTable(null, [1, 2, 3]),
    secondaryTable: null,
    chips: lookupChips(["done", "done", "done"]),
    bars: bars("car", E[3]),
    computation: [X_CAT, X_DOG, X_CAR],
  },
  {
    descriptionHtml:
      'Real models scale the same table up. GPT-2 uses <code>d = 768</code> with a 50257 token vocabulary, and the largest GPT-3 used <code>d = 12288</code>. The lookup is identical, only the rows get <span class="hl-stack">much longer</span>.',
    activeLine: 12,
    doneLines: [1, 2, 3, 5, 7, 8, 9, 10, 11],
    primaryTable: eTable(null, [1, 2, 3]),
    secondaryTable: null,
    chips: lookupChips(["done", "done", "done"]),
    bars: bars("car", E[3]),
    computation: [X_CAT, X_DOG, X_CAR],
  },
  {
    descriptionHtml:
      'During training, the loss gradient flows back through <code>X</code> into <code>E</code>, but only rows 1, 2 and 3 receive an update from this batch. Rows for tokens that never appear, like <code>on</code>, are <span class="hl-task">left untouched</span>.',
    activeLine: 12,
    doneLines: [1, 2, 3, 5, 7, 8, 9, 10, 11],
    primaryTable: eTable(null, [1, 2, 3]),
    secondaryTable: null,
    chips: lookupChips(["done", "done", "done"]),
    bars: bars("car", E[3]),
    computation: [X_CAT, X_DOG, X_CAR],
  },
];

/* ------------------------------------------------------------------ */
/* Example 2: cosine similarity                                         */
/* ------------------------------------------------------------------ */

const KING = [0.8, 0.5, 0.1];
const QUEEN = [0.6, 0.7, 0.1];
const BANANA = [-0.1, 0.2, 0.9];
const WORDS = ["king", "queen", "banana"];

const wordsTable = (activeRow: number | null = null) =>
  table(WORDS, DIMS3, [KING, QUEEN, BANANA], activeRow);

const simTable = (values: (number | null)[][], activeRow: number | null = null) =>
  table(WORDS, WORDS, values, activeRow);

const SIM_EMPTY: (number | null)[][] = [
  [1, null, null],
  [null, 1, null],
  [null, null, 1],
];
const SIM_KQ: (number | null)[][] = [
  [1, 0.95, null],
  [0.95, 1, null],
  [null, null, 1],
];
const SIM_KQ_KB: (number | null)[][] = [
  [1, 0.95, 0.13],
  [0.95, 1, null],
  [0.13, null, 1],
];
const SIM_FULL: (number | null)[][] = [
  [1, 0.95, 0.13],
  [0.95, 1, 0.2],
  [0.13, 0.2, 1],
];

const pair = (a: string, b: string, tone: TokenChip["tone"] = "active"): TokenChip[] => [
  { id: a, label: a, value: "a", tone },
  { id: b, label: b, value: "b", tone },
];

const DOT_KQ = "dot = 0.8*0.6 + 0.5*0.7 + 0.1*0.1 = 0.48 + 0.35 + 0.01 = 0.84";
const NORM_K = "|king| = sqrt(0.64 + 0.25 + 0.01) = sqrt(0.90) = 0.9487";
const NORM_Q = "|queen| = sqrt(0.36 + 0.49 + 0.01) = sqrt(0.86) = 0.9274";
const COS_KQ = "cos = 0.84 / (0.9487 * 0.9274) = 0.84 / 0.8798 = 0.95";
const DOT_KB = "dot = 0.8*(-0.1) + 0.5*0.2 + 0.1*0.9 = -0.08 + 0.10 + 0.09 = 0.11";
const NORM_B = "|banana| = sqrt(0.01 + 0.04 + 0.81) = sqrt(0.86) = 0.9274";
const COS_KB = "cos = 0.11 / (0.9487 * 0.9274) = 0.11 / 0.8798 = 0.125, rounds to 0.13";
const DOT_QB = "dot = 0.6*(-0.1) + 0.7*0.2 + 0.1*0.9 = -0.06 + 0.14 + 0.09 = 0.17";
const COS_QB = "cos = 0.17 / (0.9274 * 0.9274) = 0.17 / 0.86 = 0.20";

const SIMILARITY_STEPS: EmbeddingsStep[] = [
  {
    descriptionHtml:
      'Three learned vectors in three dimensions. Real models use hundreds or thousands of dimensions, but the geometry works the same way, so a <span class="hl-stack">3D example</span> keeps every number checkable by hand.',
    activeLine: 3,
    doneLines: [1, 2],
    primaryTable: wordsTable(),
    secondaryTable: null,
    chips: [],
    bars: [],
    computation: [],
  },
  {
    descriptionHtml:
      'Cosine similarity compares <span class="hl-api">direction</span>, not length. It divides the dot product by both norms, so a vector twice as long but pointing the same way still scores 1.00. Every self comparison on the diagonal is exactly 1.',
    activeLine: 9,
    doneLines: [1, 2, 3, 5, 6, 8],
    primaryTable: wordsTable(),
    secondaryTable: simTable(SIM_EMPTY),
    chips: [],
    bars: [],
    computation: [],
  },
  {
    descriptionHtml:
      'First pair: <code>king</code> and <code>queen</code>. The dot product multiplies matching dimensions and sums them, and a large sum means the two vectors <span class="hl-task">agree in sign and size</span> on most dimensions.',
    activeLine: 5,
    doneLines: [1, 2, 3],
    primaryTable: wordsTable(0),
    secondaryTable: simTable(SIM_EMPTY),
    chips: pair("king", "queen"),
    bars: [],
    computation: [DOT_KQ],
  },
  {
    descriptionHtml:
      'The norm of <code>king</code> is the square root of its dot product with itself. It measures the <span class="hl-stack">length</span> of the vector, which is the part cosine similarity wants to cancel out.',
    activeLine: 6,
    doneLines: [1, 2, 3, 5],
    primaryTable: wordsTable(0),
    secondaryTable: simTable(SIM_EMPTY),
    chips: pair("king", "queen"),
    bars: [],
    computation: [DOT_KQ, NORM_K],
  },
  {
    descriptionHtml:
      'Same computation for <code>queen</code>. Both norms come out below 1, so dividing by their product will <span class="hl-api">scale the dot product up</span> slightly.',
    activeLine: 6,
    doneLines: [1, 2, 3, 5],
    primaryTable: wordsTable(1),
    secondaryTable: simTable(SIM_EMPTY),
    chips: pair("king", "queen"),
    bars: [],
    computation: [DOT_KQ, NORM_K, NORM_Q],
  },
  {
    descriptionHtml:
      '<code>cos(king, queen) = 0.95</code>. The angle between them is about 17 degrees, which is what <span class="hl-task">similar usage</span> looks like in vector space. The matrix is symmetric, so both cells get the value.',
    activeLine: 12,
    doneLines: [1, 2, 3, 5, 6, 8, 9, 10],
    primaryTable: wordsTable(),
    secondaryTable: simTable(SIM_KQ, 0),
    chips: pair("king", "queen", "match"),
    bars: [],
    computation: [DOT_KQ, NORM_K, NORM_Q, COS_KQ],
  },
  {
    descriptionHtml:
      'Second pair: <code>king</code> and <code>banana</code>. The sign mismatch on <code>d0</code> subtracts from the sum, and the big <code>d2</code> of <code>banana</code> meets a tiny <code>d2</code> in <code>king</code>, so the dot product stays <span class="hl-loop">small</span>.',
    activeLine: 5,
    doneLines: [1, 2, 3, 6, 8, 9, 10, 12],
    primaryTable: wordsTable(2),
    secondaryTable: simTable(SIM_KQ),
    chips: pair("king", "banana"),
    bars: [],
    computation: [DOT_KB],
  },
  {
    descriptionHtml:
      '<code>|banana|</code> happens to equal <code>|queen|</code>, both are <code>sqrt(0.86)</code>. Similar length, very different direction: length alone tells you <span class="hl-stack">nothing about meaning</span>.',
    activeLine: 6,
    doneLines: [1, 2, 3, 5, 8, 9, 10, 12],
    primaryTable: wordsTable(2),
    secondaryTable: simTable(SIM_KQ),
    chips: pair("king", "banana"),
    bars: [],
    computation: [DOT_KB, NORM_K, NORM_B],
  },
  {
    descriptionHtml:
      '<code>cos(king, banana) = 0.125</code>, shown as 0.13. That is an angle of about 83 degrees, close to perpendicular. In an embedding space, <span class="hl-api">near orthogonal</span> means the words share little context.',
    activeLine: 13,
    doneLines: [1, 2, 3, 5, 6, 8, 9, 10, 12],
    primaryTable: wordsTable(),
    secondaryTable: simTable(SIM_KQ_KB, 0),
    chips: pair("king", "banana", "miss"),
    bars: [],
    computation: [DOT_KB, NORM_K, NORM_B, COS_KB],
  },
  {
    descriptionHtml:
      'Last pair: <code>queen</code> and <code>banana</code>. Both norms are <code>sqrt(0.86)</code>, so their product is exactly 0.86 and the division is clean: <span class="hl-task">0.17 / 0.86 = 0.20</span>.',
    activeLine: 14,
    doneLines: [1, 2, 3, 5, 6, 8, 9, 10, 12, 13],
    primaryTable: wordsTable(1),
    secondaryTable: simTable(SIM_FULL, 1),
    chips: pair("queen", "banana", "miss"),
    bars: [],
    computation: [DOT_QB, NORM_Q, NORM_B, COS_QB],
  },
  {
    descriptionHtml:
      'The full matrix. Values live in <code>[-1, 1]</code>: 1 is the same direction, 0 is perpendicular, -1 is opposite. Semantic search and retrieval rank documents by exactly this number against a <span class="hl-micro">query embedding</span>.',
    activeLine: 14,
    doneLines: [1, 2, 3, 5, 6, 8, 9, 10, 12, 13],
    primaryTable: wordsTable(),
    secondaryTable: simTable(SIM_FULL),
    chips: [],
    bars: [],
    computation: [
      "cos(king, queen) = 0.95",
      "cos(king, banana) = 0.13",
      "cos(queen, banana) = 0.20",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Example 3: position matters                                          */
/* ------------------------------------------------------------------ */

const POS_VOCAB = ["the", "cat", "sat"];
const TOK: number[][] = [
  [0.1, -0.2, 0.3],
  [0.8, 0.6, -0.3],
  [0.2, -0.7, 0.1],
];
const POS: number[][] = [
  [0.5, 0, -0.1],
  [0, 0.4, 0.2],
  [-0.3, 0.1, 0.5],
];
const X0 = [0.6, -0.2, 0.2];
const X1 = [0.8, 1, -0.1];
const X2 = [-0.1, -0.6, 0.6];
const THE_AT_2 = [-0.2, -0.1, 0.8];

const tokTable = (activeRow: number | null = null, doneRows: number[] = []) =>
  table(POS_VOCAB, DIMS3, TOK, activeRow, doneRows);
const posTable = (activeRow: number | null = null, doneRows: number[] = []) =>
  table(["p0", "p1", "p2"], DIMS3, POS, activeRow, doneRows);

const posChips = (
  states: ("pending" | "active" | "done")[],
  labels = ["the", "cat", "sat"],
  ids = ["id 0", "id 1", "id 2"],
): TokenChip[] =>
  labels.map((label, i) => ({
    id: `${label}-${i}`,
    label,
    value: ids[i],
    tone:
      states[i] === "active"
        ? "active"
        : states[i] === "done"
          ? "match"
          : "neutral",
  }));

const SUM0 = `x0 = the + p0 = ${vec(TOK[0])} + ${vec(POS[0])} = ${vec(X0)}`;
const SUM1 = `x1 = cat + p1 = ${vec(TOK[1])} + ${vec(POS[1])} = ${vec(X1)}`;
const SUM2 = `x2 = sat + p2 = ${vec(TOK[2])} + ${vec(POS[2])} = ${vec(X2)}`;
const SUM_THE_2 = `the at 2 = ${vec(TOK[0])} + ${vec(POS[2])} = ${vec(THE_AT_2)}`;

const POSITION_STEPS: EmbeddingsStep[] = [
  {
    descriptionHtml:
      'Two learned tables. <code>tokEmb</code> has one row per vocabulary entry and answers <span class="hl-api">which token</span>. It has no idea where in the sentence the token sits.',
    activeLine: 1,
    doneLines: [],
    primaryTable: tokTable(),
    secondaryTable: null,
    chips: [],
    bars: [],
    computation: [],
  },
  {
    descriptionHtml:
      '<code>posEmb</code> has one row per position up to the context length and answers <span class="hl-api">where</span>. GPT-2 learns this table like any other weight. The original transformer used fixed sinusoids, and many recent models rotate the vectors inside attention instead (RoPE).',
    activeLine: 2,
    doneLines: [1],
    primaryTable: tokTable(),
    secondaryTable: posTable(),
    chips: [],
    bars: [],
    computation: [],
  },
  {
    descriptionHtml:
      'The tokenizer produces ids <code>[0, 1, 2]</code> for <code>"the cat sat"</code>. The index of each id in the list is its <span class="hl-stack">position</span>, and that index selects the row of <code>posEmb</code>.',
    activeLine: 4,
    doneLines: [1, 2],
    primaryTable: tokTable(),
    secondaryTable: posTable(),
    chips: posChips(["pending", "pending", "pending"]),
    bars: [],
    computation: [],
  },
  {
    descriptionHtml:
      'Position 0: look up <code>tokEmb[0]</code> for <code>the</code> and <code>posEmb[0]</code> for the first slot. Both are <span class="hl-task">plain row reads</span>, the same operation as in the lookup example.',
    activeLine: 8,
    doneLines: [1, 2, 4, 6, 7],
    primaryTable: tokTable(0),
    secondaryTable: posTable(0),
    chips: posChips(["active", "pending", "pending"]),
    bars: [],
    computation: [],
  },
  {
    descriptionHtml:
      'Add them dimension by dimension. The sum is the input vector for slot 0. Because it is a sum, the model can later <span class="hl-api">separate the two signals</span> by learning which directions carry token identity and which carry position.',
    activeLine: 9,
    doneLines: [1, 2, 4, 6, 7, 8],
    primaryTable: tokTable(null, [0]),
    secondaryTable: posTable(null, [0]),
    chips: posChips(["done", "pending", "pending"]),
    bars: bars("x0", X0),
    computation: [SUM0],
  },
  {
    descriptionHtml:
      'Position 1: <code>cat</code> plus <code>p1</code>. Note that <code>d1</code> lands at 1.00, the token contributes 0.60 and the position contributes 0.40. Nothing in the vector says <span class="hl-stack">which part came from where</span>.',
    activeLine: 8,
    doneLines: [1, 2, 4, 6, 7, 9],
    primaryTable: tokTable(1, [0]),
    secondaryTable: posTable(1, [0]),
    chips: posChips(["done", "active", "pending"]),
    bars: bars("x0", X0),
    computation: [SUM0],
  },
  {
    descriptionHtml:
      '<code>x1</code> is complete. The token row for <code>cat</code> is the same row used in any sentence, but the <span class="hl-task">input vector</span> is specific to <code>cat</code> being the second token.',
    activeLine: 9,
    doneLines: [1, 2, 4, 6, 7, 8],
    primaryTable: tokTable(null, [0, 1]),
    secondaryTable: posTable(null, [0, 1]),
    chips: posChips(["done", "done", "pending"]),
    bars: bars("x1", X1),
    computation: [SUM0, SUM1],
  },
  {
    descriptionHtml:
      'Position 2: <code>sat</code> plus <code>p2</code>. The <code>d0</code> of <code>p2</code> is negative and pulls the sum below zero, so the position table can <span class="hl-loop">flip signs</span> as well as shift magnitudes.',
    activeLine: 8,
    doneLines: [1, 2, 4, 6, 7, 9],
    primaryTable: tokTable(2, [0, 1]),
    secondaryTable: posTable(2, [0, 1]),
    chips: posChips(["done", "done", "active"]),
    bars: bars("x1", X1),
    computation: [SUM0, SUM1],
  },
  {
    descriptionHtml:
      'All three input vectors are ready, a 3 by 3 matrix <code>X</code>. This is what the first attention block sees. Without <code>posEmb</code>, the rows would be <span class="hl-stack">just the token rows</span>.',
    activeLine: 9,
    doneLines: [1, 2, 4, 6, 7, 8],
    primaryTable: tokTable(null, [0, 1, 2]),
    secondaryTable: posTable(null, [0, 1, 2]),
    chips: posChips(["done", "done", "done"]),
    bars: bars("x2", X2),
    computation: [SUM0, SUM1, SUM2],
  },
  {
    descriptionHtml:
      'Why this matters: attention computes a <span class="hl-api">weighted sum over a set</span> of vectors. Shuffle the input rows and the outputs shuffle identically, so with token rows alone <code>"the cat sat"</code> and <code>"sat cat the"</code> would produce the same set of outputs.',
    activeLine: 12,
    doneLines: [1, 2, 4, 6, 7, 8, 9, 10],
    primaryTable: tokTable(null, [0, 1, 2]),
    secondaryTable: posTable(null, [0, 1, 2]),
    chips: posChips(["done", "done", "done"]),
    bars: bars("x2", X2),
    computation: [SUM0, SUM1, SUM2],
  },
  {
    descriptionHtml:
      'Move <code>the</code> to position 2, as in <code>"sat cat the"</code>. The token row is unchanged, but adding <code>p2</code> instead of <code>p0</code> gives <code>[-0.20, -0.10, 0.80]</code> rather than <code>[0.60, -0.20, 0.20]</code>: <span class="hl-task">same token, different input</span>.',
    activeLine: 13,
    doneLines: [1, 2, 4, 6, 7, 8, 9, 10, 12],
    primaryTable: tokTable(0, [1, 2]),
    secondaryTable: posTable(2, [0, 1]),
    chips: posChips(
      ["pending", "pending", "active"],
      ["sat", "cat", "the"],
      ["id 2", "id 1", "id 0"],
    ),
    bars: bars("the2", THE_AT_2),
    computation: [SUM_THE_2, `the at 0 = ${vec(X0)}`],
  },
];

/* ------------------------------------------------------------------ */

export const EXAMPLES: EmbeddingsExample[] = [
  {
    id: "lookup",
    title: "Lookup table",
    description:
      "A token id indexes a row of the learned embedding matrix. Each input token is replaced by its row.",
    kind: "lookup",
    codeLines: [
      { num: 1, text: "const V = 6; // vocabulary size" },
      { num: 2, text: "const d = 4; // embedding dimension" },
      { num: 3, text: "const E = initMatrix(V, d); // learned, V x d" },
      { num: 4, text: "" },
      { num: 5, text: 'const ids = tokenize("cat dog car"); // [1, 2, 3]' },
      { num: 6, text: "" },
      { num: 7, text: "const X = [];" },
      { num: 8, text: "for (const id of ids) {" },
      { num: 9, text: "  const vec = E[id]; // row lookup, no math" },
      { num: 10, text: "  X.push(vec);" },
      { num: 11, text: "}" },
      { num: 12, text: "// X is 3 x 4, the input to the first layer" },
    ],
    steps: LOOKUP_STEPS,
  },
  {
    id: "similarity",
    title: "Cosine similarity",
    description:
      "Compare three vectors by the angle between them. Similar words score near 1, unrelated words near 0.",
    kind: "similarity",
    codeLines: [
      { num: 1, text: "const king   = [0.8, 0.5, 0.1];" },
      { num: 2, text: "const queen  = [0.6, 0.7, 0.1];" },
      { num: 3, text: "const banana = [-0.1, 0.2, 0.9];" },
      { num: 4, text: "" },
      { num: 5, text: "const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);" },
      { num: 6, text: "const norm = (a) => Math.sqrt(dot(a, a));" },
      { num: 7, text: "" },
      { num: 8, text: "function cosine(a, b) {" },
      { num: 9, text: "  return dot(a, b) / (norm(a) * norm(b));" },
      { num: 10, text: "}" },
      { num: 11, text: "" },
      { num: 12, text: "cosine(king, queen);   // 0.95" },
      { num: 13, text: "cosine(king, banana);  // 0.13" },
      { num: 14, text: "cosine(queen, banana); // 0.20" },
    ],
    steps: SIMILARITY_STEPS,
  },
  {
    id: "position",
    title: "Position matters",
    description:
      "Token embedding plus position embedding. The same token at a different position produces a different input vector.",
    kind: "position",
    codeLines: [
      { num: 1, text: "const tokEmb = E; // V x d, learned" },
      { num: 2, text: "const posEmb = P; // maxLen x d, learned" },
      { num: 3, text: "" },
      { num: 4, text: 'const ids = tokenize("the cat sat"); // [0, 1, 2]' },
      { num: 5, text: "" },
      { num: 6, text: "const X = ids.map((id, i) => {" },
      { num: 7, text: "  const t = tokEmb[id];" },
      { num: 8, text: "  const p = posEmb[i];" },
      { num: 9, text: "  return t.map((v, k) => v + p[k]); // x = t + p" },
      { num: 10, text: "});" },
      { num: 11, text: "" },
      { num: 12, text: "// attention is a set operation: without posEmb" },
      { num: 13, text: "// every permutation of ids looks the same" },
    ],
    steps: POSITION_STEPS,
  },
];
