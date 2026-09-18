import type { MetricBar } from "@/components/visualization-ui/MetricBars";
import { OUTPUT_BAR_SCALE } from "./helpers";
import type {
  AttentionExample,
  ScoreGrid,
  VectorRow,
  VectorTone,
  WeightGrid,
  WorkLine,
} from "./types";

/* ------------------------------------------------------------------ */
/* Shared numbers for the 3-token examples                             */
/*                                                                      */
/* x:   The [1,1]  cat [1,2]  sat [2,1]                                 */
/* Wq = [[0,1],[1,0]]  Wk = [[0,1],[1,1]]  Wv = [[1,0],[1,1]]           */
/* Q:   [1,1] [2,1] [1,2]                                               */
/* K:   [1,2] [2,3] [1,3]                                               */
/* V:   [2,1] [3,2] [3,1]                                               */
/* raw scores Q K^T:  [[3,5,4],[4,7,5],[5,8,7]]                         */
/* scaled by sqrt(2): [[2.12,3.54,2.83],[2.83,4.95,3.54],[3.54,5.66,4.95]] */
/* softmax rows:      [[0.14,0.58,0.28],[0.09,0.73,0.18],[0.07,0.62,0.31]] */
/* ------------------------------------------------------------------ */

const T3 = ["The", "cat", "sat"];
const X3 = ["[1, 1]", "[1, 2]", "[2, 1]"];
const Q3 = ["[1, 1]", "[2, 1]", "[1, 2]"];
const K3 = ["[1, 2]", "[2, 3]", "[1, 3]"];
const V3 = ["[2, 1]", "[3, 2]", "[3, 1]"];

const RAW3: number[][] = [
  [3, 5, 4],
  [4, 7, 5],
  [5, 8, 7],
];
const SCALED3: number[][] = [
  [2.12, 3.54, 2.83],
  [2.83, 4.95, 3.54],
  [3.54, 5.66, 4.95],
];
const WEIGHTS3: number[][] = [
  [0.14, 0.58, 0.28],
  [0.09, 0.73, 0.18],
  [0.07, 0.62, 0.31],
];
const CAUSAL3: number[][] = [
  [1.0, 0, 0],
  [0.11, 0.89, 0],
  [0.07, 0.62, 0.31],
];
const CAUSAL_MASK: boolean[][] = [
  [true, false, false],
  [true, true, false],
  [true, true, true],
];
const FUTURE3: boolean[][] = CAUSAL_MASK.map((row) => row.map((v) => !v));

const vectors3 = (
  columns: { label: string; values: string[] }[],
  activeIndex: number | null,
  tone: (index: number) => VectorTone = (i) =>
    activeIndex === null ? "neutral" : i === activeIndex ? "active" : "neutral",
): VectorRow[] =>
  T3.map((token, i) => ({
    id: token,
    token,
    cells: columns.map((col) => ({ label: col.label, value: col.values[i] })),
    tone: tone(i),
  }));

const COLS_X = { label: "x", values: X3 };
const COLS_Q = { label: "q", values: Q3 };
const COLS_K = { label: "k", values: K3 };
const COLS_V = { label: "v", values: V3 };

const scoreGrid = (
  id: string,
  label: string,
  values: (number | null)[][],
  extra: Partial<ScoreGrid> = {},
): ScoreGrid => ({
  id,
  label,
  rowLabels: T3,
  colLabels: T3,
  values,
  ...extra,
});

const weightGrid = (
  id: string,
  label: string,
  values: number[][],
  extra: Partial<WeightGrid> = {},
): WeightGrid => ({
  id,
  label,
  rowLabels: T3,
  colLabels: T3,
  values,
  ...extra,
});

const rowOnly = (source: number[][], row: number): (number | null)[][] =>
  source.map((values, i) => (i === row ? values : [null, null, null]));

const upTo = (source: number[][], row: number): number[][] =>
  source.map((values, i) => (i <= row ? values : [0, 0, 0]));

const work = (id: string, text: string, tone: WorkLine["tone"] = "neutral"): WorkLine => ({
  id,
  text,
  tone,
});

const bar = (
  id: string,
  label: string,
  value: number,
  tone: MetricBar["tone"] = "green",
  active = false,
): MetricBar => ({
  id,
  label,
  value: value / OUTPUT_BAR_SCALE,
  display: value.toFixed(2),
  tone,
  active,
});

const SAT_OUTPUT: MetricBar[] = [
  bar("out0", "sat[0]", 2.93, "green", true),
  bar("out1", "sat[1]", 1.62, "green", true),
];

/* ------------------------------------------------------------------ */
/* Multi-head numbers                                                   */
/*                                                                      */
/* Tokens: she gave him it. Two heads, d_k = 2 each, d_model = 4.       */
/* Head 1 scaled scores: self 1.00, neighbour 1.50, other -1.00         */
/* Head 2 scaled scores: column she 0.50, self -0.50, previous -1.50,   */
/*                       other -1.75                                    */
/* Head 1 weights rows sum to 1.00, head 2 rows sum to 1.00 (checked).  */
/* Query "him" (row 2):                                                 */
/*   head 1 weights [0.03,0.37,0.23,0.37], V1 = [1,0] [0,1] [1,1] [0,0] */
/*   head 1 out = [0.26, 0.60]                                          */
/*   head 2 weights [0.62,0.08,0.23,0.07], V2 = [2,1] [0,1] [1,0] [0,1] */
/*   head 2 out = [1.47, 0.77]                                          */
/*   concat = [0.26, 0.60, 1.47, 0.77]                                  */
/*   Wo = [[1,0,0,1],[0,1,1,0],[1,0,1,0],[0,1,0,1]]                      */
/*   out = [1.73, 1.37, 2.07, 1.03]                                     */
/* ------------------------------------------------------------------ */

const T4 = ["she", "gave", "him", "it"];
const V1_4 = ["[1, 0]", "[0, 1]", "[1, 1]", "[0, 0]"];
const V2_4 = ["[2, 1]", "[0, 1]", "[1, 0]", "[0, 1]"];

const H1_SCORES: number[][] = [
  [1.0, 1.5, -1.0, -1.0],
  [1.5, 1.0, 1.5, -1.0],
  [-1.0, 1.5, 1.0, 1.5],
  [-1.0, -1.0, 1.5, 1.0],
];
const H2_SCORES: number[][] = [
  [0.5, -1.75, -1.75, -1.75],
  [0.5, -0.5, -1.75, -1.75],
  [0.5, -1.5, -0.5, -1.75],
  [0.5, -1.75, -1.5, -0.5],
];
const H1_WEIGHTS: number[][] = [
  [0.34, 0.56, 0.05, 0.05],
  [0.37, 0.23, 0.37, 0.03],
  [0.03, 0.37, 0.23, 0.37],
  [0.05, 0.05, 0.56, 0.34],
];
const H2_WEIGHTS: number[][] = [
  [0.76, 0.08, 0.08, 0.08],
  [0.63, 0.23, 0.07, 0.07],
  [0.62, 0.08, 0.23, 0.07],
  [0.62, 0.07, 0.08, 0.23],
];

const vectors4 = (activeIndex: number | null): VectorRow[] =>
  T4.map((token, i) => ({
    id: token,
    token,
    cells: [
      { label: "v (head 1)", value: V1_4[i] },
      { label: "v (head 2)", value: V2_4[i] },
    ],
    tone: activeIndex === i ? "active" : "neutral",
  }));

const headScores = (head: 1 | 2, activeRow?: number): ScoreGrid => ({
  id: `h${head}-scores`,
  label: `head ${head} scaled scores`,
  rowLabels: T4,
  colLabels: T4,
  values: head === 1 ? H1_SCORES : H2_SCORES,
  activeRow,
});

const headWeights = (head: 1 | 2, activeRow?: number): WeightGrid => ({
  id: `h${head}-weights`,
  label: `head ${head} weights`,
  rowLabels: T4,
  colLabels: T4,
  values: head === 1 ? H1_WEIGHTS : H2_WEIGHTS,
  activeRow,
  colorRgb: head === 1 ? "34 211 238" : "167 139 250",
});

const HEAD1_OUT: MetricBar[] = [
  bar("h1-0", "head1[0]", 0.26, "cyan"),
  bar("h1-1", "head1[1]", 0.6, "cyan"),
];
const HEAD2_OUT: MetricBar[] = [
  bar("h2-0", "head2[0]", 1.47, "violet"),
  bar("h2-1", "head2[1]", 0.77, "violet"),
];
const CONCAT_OUT: MetricBar[] = [
  bar("c0", "concat[0]", 0.26, "cyan"),
  bar("c1", "concat[1]", 0.6, "cyan"),
  bar("c2", "concat[2]", 1.47, "violet"),
  bar("c3", "concat[3]", 0.77, "violet"),
];
const FINAL_OUT: MetricBar[] = [
  bar("f0", "him[0]", 1.73, "green", true),
  bar("f1", "him[1]", 1.37, "green", true),
  bar("f2", "him[2]", 2.07, "green", true),
  bar("f3", "him[3]", 1.03, "green", true),
];

/* ------------------------------------------------------------------ */

export const EXAMPLES: AttentionExample[] = [
  {
    id: "scores",
    title: "Scaled dot-product",
    description:
      "Project three tokens to queries, keys, and values, score one query against every key, and mix the values by softmax weight.",
    kind: "scores",
    codeLines: [
      { num: 1, text: "def attention(x, Wq, Wk, Wv):" },
      { num: 2, text: "    Q = x @ Wq   # what each token is looking for" },
      { num: 3, text: "    K = x @ Wk   # what each token contains" },
      { num: 4, text: "    V = x @ Wv   # what each token passes along" },
      { num: 5, text: "    scores = Q @ K.T" },
      { num: 6, text: "    scores = scores / sqrt(d_k)" },
      { num: 7, text: "    weights = softmax(scores, axis=-1)" },
      { num: 8, text: "    out = weights @ V" },
      { num: 9, text: "    return out" },
    ],
    steps: [
      {
        descriptionHtml:
          'Three tokens enter as 2-dimensional embeddings <code>x</code>. Attention will rewrite each row so it also carries information from the other rows, and <span class="hl-api">sat</span> is the query we follow.',
        activeLine: 1,
        doneLines: [],
        vectors: vectors3([COLS_X], null),
        scores: [],
        weights: [],
        work: [],
        output: [],
      },
      {
        descriptionHtml:
          'Multiplying <code>x</code> by the learned matrix <code>Wq = [[0,1],[1,0]]</code> gives each token a <span class="hl-api">query</span>: what it is looking for in the other tokens. The projection is what training tunes.',
        activeLine: 2,
        doneLines: [1],
        vectors: vectors3([COLS_X, COLS_Q], 2),
        scores: [],
        weights: [],
        work: [
          work("q", "q_sat = [2, 1] @ Wq = [2*0 + 1*1, 2*1 + 1*0] = [1, 2]", "active"),
        ],
        output: [],
      },
      {
        descriptionHtml:
          'The same input times <code>Wk = [[0,1],[1,1]]</code> gives each token a <span class="hl-stack">key</span>: an advertisement of what it contains. A query is matched against every key, including its own.',
        activeLine: 3,
        doneLines: [1, 2],
        vectors: vectors3([COLS_X, COLS_Q, COLS_K], null),
        scores: [],
        weights: [],
        work: [
          work("kThe", "k_The = [1, 1] @ Wk = [1, 2]"),
          work("kcat", "k_cat = [1, 2] @ Wk = [2, 3]"),
          work("ksat", "k_sat = [2, 1] @ Wk = [1, 3]"),
        ],
        output: [],
      },
      {
        descriptionHtml:
          '<code>Wv = [[1,0],[1,1]]</code> produces the <span class="hl-task">value</span> vectors: the content each token passes along when it is attended to. Keys decide how much, values decide what.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        vectors: vectors3([COLS_X, COLS_Q, COLS_K, COLS_V], null),
        scores: [],
        weights: [],
        work: [
          work("vThe", "v_The = [1, 1] @ Wv = [2, 1]"),
          work("vcat", "v_cat = [1, 2] @ Wv = [3, 2]"),
          work("vsat", "v_sat = [2, 1] @ Wv = [3, 1]"),
        ],
        output: [],
      },
      {
        descriptionHtml:
          'Row <span class="hl-api">sat</span> of <code>Q @ K.T</code> is the dot product of <code>q_sat</code> with every key. A large dot product means the query and key point the same way, so <code>cat</code> scores highest.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        vectors: vectors3([COLS_X, COLS_Q, COLS_K, COLS_V], 2),
        scores: [scoreGrid("raw", "raw scores Q K^T", rowOnly(RAW3, 2), { activeRow: 2 })],
        weights: [],
        work: [
          work("sThe", "q_sat . k_The = 1*1 + 2*2 = 5.00", "active"),
          work("scat", "q_sat . k_cat = 1*2 + 2*3 = 8.00", "active"),
          work("ssat", "q_sat . k_sat = 1*1 + 2*3 = 7.00", "active"),
        ],
        output: [],
      },
      {
        descriptionHtml:
          'Every score is divided by <code>sqrt(d_k) = sqrt(2) = 1.41</code>. Dot products grow with the vector length, and unscaled scores would push softmax into a near one-hot regime where gradients vanish.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        vectors: vectors3([COLS_X, COLS_Q, COLS_K, COLS_V], 2),
        scores: [scoreGrid("scaled", "scaled scores", rowOnly(SCALED3, 2), { activeRow: 2 })],
        weights: [],
        work: [
          work("dThe", "5.00 / 1.41 = 3.54", "active"),
          work("dcat", "8.00 / 1.41 = 5.66", "active"),
          work("dsat", "7.00 / 1.41 = 4.95", "active"),
        ],
        output: [],
      },
      {
        descriptionHtml:
          'Softmax first exponentiates each scaled score. <code>exp</code> makes every entry positive and stretches the gaps, so the highest score dominates without the others dropping to exactly zero.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        vectors: vectors3([COLS_X, COLS_Q, COLS_K, COLS_V], 2),
        scores: [scoreGrid("scaled", "scaled scores", rowOnly(SCALED3, 2), { activeRow: 2 })],
        weights: [],
        work: [
          work("eThe", "exp(3.54) = 34.47", "active"),
          work("ecat", "exp(5.66) = 287.15", "active"),
          work("esat", "exp(4.95) = 141.17", "active"),
          work("esum", "sum = 462.79"),
        ],
        output: [],
      },
      {
        descriptionHtml:
          'Dividing by the sum gives the <span class="hl-micro">attention weights</span> for row <code>sat</code>: 0.07, 0.62, 0.31. They sum to 1.00, so the next step is a weighted average rather than an unbounded sum.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        vectors: vectors3([COLS_X, COLS_Q, COLS_K, COLS_V], 2),
        scores: [scoreGrid("scaled", "scaled scores", rowOnly(SCALED3, 2), { activeRow: 2 })],
        weights: [weightGrid("w", "softmax weights", rowOnly(WEIGHTS3, 2).map((r) => r.map((v) => v ?? 0)), { activeRow: 2 })],
        work: [
          work("wThe", "34.47 / 462.79 = 0.07", "result"),
          work("wcat", "287.15 / 462.79 = 0.62", "result"),
          work("wsat", "141.17 / 462.79 = 0.31", "result"),
          work("wsum", "0.07 + 0.62 + 0.31 = 1.00"),
        ],
        output: [],
      },
      {
        descriptionHtml:
          'The new vector for <code>sat</code> is the weights times the <span class="hl-task">values</span>. Most of it comes from <code>v_cat</code>, which is how the representation of <code>sat</code> now encodes who did the sitting.',
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        vectors: vectors3([COLS_X, COLS_Q, COLS_K, COLS_V], 2),
        scores: [],
        weights: [weightGrid("w", "softmax weights", rowOnly(WEIGHTS3, 2).map((r) => r.map((v) => v ?? 0)), { activeRow: 2 })],
        work: [
          work("o0", "sat[0] = 0.07*2 + 0.62*3 + 0.31*3 = 2.93", "result"),
          work("o1", "sat[1] = 0.07*1 + 0.62*2 + 0.31*1 = 1.62", "result"),
        ],
        output: SAT_OUTPUT,
      },
      {
        descriptionHtml:
          'The other rows go through the same pipeline in the same matrix multiply. Every query scores every key, so the weight matrix is <code>n x n</code>: <strong>O(n^2)</strong> in sequence length, which is why long context windows are expensive.',
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        vectors: vectors3([COLS_X, COLS_Q, COLS_K, COLS_V], null),
        scores: [],
        weights: [weightGrid("w", "softmax weights", WEIGHTS3)],
        work: [
          work("rThe", "row The: 0.14 + 0.58 + 0.28 = 1.00"),
          work("rcat", "row cat: 0.09 + 0.73 + 0.18 = 1.00"),
          work("rsat", "row sat: 0.07 + 0.62 + 0.31 = 1.00"),
        ],
        output: SAT_OUTPUT,
      },
    ],
  },
  {
    id: "mask",
    title: "Causal mask",
    description:
      "Hide every future position with -inf before softmax so a token can only attend to itself and what came before it.",
    kind: "mask",
    codeLines: [
      { num: 1, text: "def causal_attention(Q, K, V):" },
      { num: 2, text: "    n = Q.shape[0]" },
      { num: 3, text: "    scores = Q @ K.T / sqrt(d_k)" },
      { num: 4, text: "    future = triu(ones(n, n), k=1)  # 1 above the diagonal" },
      { num: 5, text: "    scores = scores.masked_fill(future, -inf)" },
      { num: 6, text: "    weights = softmax(scores, axis=-1)" },
      { num: 7, text: "    return weights @ V" },
    ],
    steps: [
      {
        descriptionHtml:
          'Same three tokens, same projections as before. The scaled score matrix has all nine entries, including <code>The</code> scored against <code>sat</code>, a token that comes later in the sentence.',
        activeLine: 3,
        doneLines: [1, 2],
        vectors: vectors3([COLS_Q, COLS_K, COLS_V], null),
        scores: [scoreGrid("scaled", "scaled scores", SCALED3)],
        weights: [],
        work: [],
        output: [],
      },
      {
        descriptionHtml:
          '<code>triu(..., k=1)</code> builds a matrix with 1 strictly above the diagonal. Those cells are pairs where the key position is <strong>after</strong> the query position, which is the future from that query\'s point of view.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        vectors: vectors3([COLS_Q, COLS_K, COLS_V], null),
        scores: [
          scoreGrid("scaled", "scaled scores", SCALED3),
          scoreGrid("future", "future mask", FUTURE3.map((row) => row.map((v) => (v ? 1 : 0)))),
        ],
        weights: [],
        work: [work("tri", "future[i][j] = 1 if j > i else 0")],
        output: [],
      },
      {
        descriptionHtml:
          '<code>masked_fill</code> overwrites every future cell with <span class="hl-loop">-inf</span>. The dot products were still computed, the mask just makes them unusable before softmax runs.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        vectors: vectors3([COLS_Q, COLS_K, COLS_V], null),
        scores: [scoreGrid("masked", "masked scores", SCALED3, { masked: FUTURE3 })],
        weights: [],
        work: [
          work("m1", "The -> cat, The -> sat: -inf"),
          work("m2", "cat -> sat: -inf"),
        ],
        output: [],
      },
      {
        descriptionHtml:
          'Row <code>The</code> keeps only its own score. <code>exp(-inf) = 0</code>, so the masked cells contribute nothing to the sum and the single surviving entry gets weight <strong>1.00</strong>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        vectors: vectors3([COLS_Q, COLS_K, COLS_V], 0),
        scores: [scoreGrid("masked", "masked scores", SCALED3, { masked: FUTURE3, activeRow: 0 })],
        weights: [weightGrid("cw", "causal weights", upTo(CAUSAL3, 0), { mask: CAUSAL_MASK, activeRow: 0 })],
        work: [
          work("e0", "exp(2.12) = 8.33, exp(-inf) = 0, exp(-inf) = 0", "active"),
          work("w0", "8.33 / 8.33 = 1.00", "result"),
        ],
        output: [],
      },
      {
        descriptionHtml:
          'Row <code>cat</code> can see <code>The</code> and itself. With <code>sat</code> removed, the two remaining exponentials are renormalised against each other, which is why the weights differ from the unmasked 0.09 and 0.73.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        vectors: vectors3([COLS_Q, COLS_K, COLS_V], 1),
        scores: [scoreGrid("masked", "masked scores", SCALED3, { masked: FUTURE3, activeRow: 1 })],
        weights: [weightGrid("cw", "causal weights", upTo(CAUSAL3, 1), { mask: CAUSAL_MASK, activeRow: 1 })],
        work: [
          work("e1", "exp(2.83) = 16.95, exp(4.95) = 141.17, sum = 158.12", "active"),
          work("w1a", "16.95 / 158.12 = 0.11", "result"),
          work("w1b", "141.17 / 158.12 = 0.89", "result"),
        ],
        output: [],
      },
      {
        descriptionHtml:
          'Row <code>sat</code> is the last token, so nothing is in its future and the mask changes nothing. Its weights are exactly the unmasked 0.07, 0.62, 0.31.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        vectors: vectors3([COLS_Q, COLS_K, COLS_V], 2),
        scores: [scoreGrid("masked", "masked scores", SCALED3, { masked: FUTURE3, activeRow: 2 })],
        weights: [weightGrid("cw", "causal weights", CAUSAL3, { mask: CAUSAL_MASK, activeRow: 2 })],
        work: [
          work("e2", "exp(3.54) + exp(5.66) + exp(4.95) = 462.79", "active"),
          work("w2", "34.47 / 462.79 = 0.07, 287.15 / 462.79 = 0.62, 141.17 / 462.79 = 0.31", "result"),
        ],
        output: [],
      },
      {
        descriptionHtml:
          'The value mix for <code>cat</code> now uses only <code>v_The</code> and <code>v_cat</code>. Compare with the unmasked result [2.91, 1.73]: the masked row leans harder on its own value because the future share was redistributed.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        vectors: vectors3([COLS_Q, COLS_K, COLS_V], 1),
        scores: [],
        weights: [weightGrid("cw", "causal weights", CAUSAL3, { mask: CAUSAL_MASK, activeRow: 1 })],
        work: [
          work("c0", "cat[0] = 0.11*2 + 0.89*3 = 2.89", "result"),
          work("c1", "cat[1] = 0.11*1 + 0.89*2 = 1.89", "result"),
        ],
        output: [
          bar("cat0", "cat[0]", 2.89, "green", true),
          bar("cat1", "cat[1]", 1.89, "green", true),
        ],
      },
      {
        descriptionHtml:
          'Why bother: during training all positions are predicted in one pass, and position <code>i</code> is trained to predict token <code>i+1</code>. Without the mask it could read that token through attention and learn nothing. At inference the future tokens do not exist yet, so the mask keeps training and generation consistent.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        vectors: vectors3([COLS_Q, COLS_K, COLS_V], null),
        scores: [],
        weights: [weightGrid("cw", "causal weights", CAUSAL3, { mask: CAUSAL_MASK })],
        work: [
          work("why1", "train: position i predicts token i+1"),
          work("why2", "mask: position i never reads j > i"),
          work("why3", "generate: tokens j > i are not produced yet"),
        ],
        output: [
          bar("cat0", "cat[0]", 2.89, "green", true),
          bar("cat1", "cat[1]", 1.89, "green", true),
        ],
      },
    ],
  },
  {
    id: "heads",
    title: "Multi-head",
    description:
      "Two heads with different projections attend to different things, then their outputs are concatenated and projected back.",
    kind: "heads",
    codeLines: [
      { num: 1, text: "def multi_head(x, heads, Wo):" },
      { num: 2, text: "    outputs = []" },
      { num: 3, text: "    for h in heads:" },
      { num: 4, text: "        Q, K, V = x @ h.Wq, x @ h.Wk, x @ h.Wv" },
      { num: 5, text: "        scores = Q @ K.T / sqrt(d_k)" },
      { num: 6, text: "        weights = softmax(scores, axis=-1)" },
      { num: 7, text: "        outputs.append(weights @ V)" },
      { num: 8, text: "    concat = cat(outputs, axis=-1)" },
      { num: 9, text: "    return concat @ Wo" },
    ],
    steps: [
      {
        descriptionHtml:
          'Four tokens, <code>d_model = 4</code>, split into two heads of <code>d_k = 2</code>. Each head owns its own <code>Wq</code>, <code>Wk</code>, <code>Wv</code>, so each head can learn a different notion of relevance. We follow the query <span class="hl-api">him</span>.',
        activeLine: 1,
        doneLines: [],
        vectors: vectors4(2),
        scores: [],
        weights: [],
        work: [work("dims", "2 heads x d_k 2 = d_model 4")],
        output: [],
      },
      {
        descriptionHtml:
          'Head 1 projects and scores. Its learned <code>Wq</code> and <code>Wk</code> happen to give high scores to <span class="hl-stack">adjacent tokens</span>, a local syntax head. Scores are already divided by <code>sqrt(2)</code>.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        vectors: vectors4(2),
        scores: [headScores(1, 2)],
        weights: [],
        work: [work("h1s", "row him: [-1.00, 1.50, 1.00, 1.50]", "active")],
        output: [],
      },
      {
        descriptionHtml:
          'Softmax on the <code>him</code> row of head 1 spreads the weight over <code>gave</code> and <code>it</code>, the neighbours, with a smaller share on itself and almost nothing on <code>she</code>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        vectors: vectors4(2),
        scores: [headScores(1, 2)],
        weights: [headWeights(1, 2)],
        work: [
          work("h1e", "exp: 0.37, 4.48, 2.72, 4.48, sum = 12.05", "active"),
          work("h1w", "weights: 0.03, 0.37, 0.23, 0.37", "result"),
        ],
        output: [],
      },
      {
        descriptionHtml:
          'Head 1 output for <code>him</code> is its weights times the head 1 <span class="hl-task">values</span>. This is a 2-dimensional vector, one per head, appended to <code>outputs</code>.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        vectors: vectors4(2),
        scores: [],
        weights: [headWeights(1, 2)],
        work: [
          work("h1o0", "head1[0] = 0.03*1 + 0.37*0 + 0.23*1 + 0.37*0 = 0.26", "result"),
          work("h1o1", "head1[1] = 0.03*0 + 0.37*1 + 0.23*1 + 0.37*0 = 0.60", "result"),
        ],
        output: HEAD1_OUT,
      },
      {
        descriptionHtml:
          'The loop moves to head 2 with a different set of projections. Here the query and key spaces line up so that every token scores the subject <span class="hl-micro">she</span> highest, regardless of distance.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4, 7],
        vectors: vectors4(2),
        scores: [headScores(2, 2)],
        weights: [headWeights(1)],
        work: [work("h2s", "row him: [0.50, -1.50, -0.50, -1.75]", "active")],
        output: HEAD1_OUT,
      },
      {
        descriptionHtml:
          'Head 2 weights for <code>him</code> put 0.62 on <code>she</code>. A head like this is what lets a pronoun pick up who it refers to, something head 1 could not express with its local pattern.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5, 7],
        vectors: vectors4(2),
        scores: [headScores(2, 2)],
        weights: [headWeights(1), headWeights(2, 2)],
        work: [
          work("h2e", "exp: 1.65, 0.22, 0.61, 0.17, sum = 2.65", "active"),
          work("h2w", "weights: 0.62, 0.08, 0.23, 0.07", "result"),
        ],
        output: HEAD1_OUT,
      },
      {
        descriptionHtml:
          'Head 2 output mixes the head 2 values, and most of it is <code>v_she = [2, 1]</code>. Both heads ran on the same input but produced different summaries of the context.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        vectors: vectors4(2),
        scores: [],
        weights: [headWeights(1), headWeights(2, 2)],
        work: [
          work("h2o0", "head2[0] = 0.62*2 + 0.08*0 + 0.23*1 + 0.07*0 = 1.47", "result"),
          work("h2o1", "head2[1] = 0.62*1 + 0.08*1 + 0.23*0 + 0.07*1 = 0.77", "result"),
        ],
        output: [...HEAD1_OUT, ...HEAD2_OUT],
      },
      {
        descriptionHtml:
          'Concatenation places the head outputs side by side, giving back a <code>d_model = 4</code> vector. Nothing is added or averaged here, the heads stay in separate slots.',
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        vectors: vectors4(2),
        scores: [],
        weights: [headWeights(1), headWeights(2)],
        work: [work("cat", "concat = [0.26, 0.60, 1.47, 0.77]", "result")],
        output: CONCAT_OUT,
      },
      {
        descriptionHtml:
          'The output projection <code>Wo</code> is a learned 4x4 matrix that mixes the heads together. This is where the model can combine "next to gave" from head 1 with "refers to she" from head 2 into one representation.',
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        vectors: vectors4(2),
        scores: [],
        weights: [headWeights(1), headWeights(2)],
        work: [
          work("wo", "Wo = [[1,0,0,1],[0,1,1,0],[1,0,1,0],[0,1,0,1]]"),
          work("f0", "him[0] = 0.26*1 + 0.60*0 + 1.47*1 + 0.77*0 = 1.73", "result"),
          work("f1", "him[1] = 0.26*0 + 0.60*1 + 1.47*0 + 0.77*1 = 1.37", "result"),
          work("f2", "him[2] = 0.26*0 + 0.60*1 + 1.47*1 + 0.77*0 = 2.07", "result"),
          work("f3", "him[3] = 0.26*1 + 0.60*0 + 1.47*0 + 0.77*1 = 1.03", "result"),
        ],
        output: FINAL_OUT,
      },
      {
        descriptionHtml:
          'Every row of both weight matrices sums to 1.00, and the heads run in parallel as one batched matmul. Multi-head costs the same as single-head at the same <code>d_model</code>, but each head sees a smaller <code>d_k</code>, which is the trade: more views, each lower resolution.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        vectors: vectors4(null),
        scores: [],
        weights: [headWeights(1), headWeights(2)],
        work: [
          work("sum1", "head 1 rows: 1.00, 1.00, 1.00, 1.00"),
          work("sum2", "head 2 rows: 1.00, 1.00, 1.00, 1.00"),
          work("cost", "cost per head: n^2 * d_k, total n^2 * d_model"),
        ],
        output: FINAL_OUT,
      },
    ],
  },
];
