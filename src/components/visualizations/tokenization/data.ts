import type { TokenChip, TokenChipTone } from "@/components/visualization-ui/TokenChips";
import type { MetricBar } from "@/components/visualization-ui/MetricBars";
import type {
  SegmentGroup,
  StatItem,
  StatTone,
  TokenizationExample,
  TokenizationStep,
} from "./types";

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */

type ChipSpec = string | [label: string, value?: string, tone?: TokenChipTone];

const chips = (prefix: string, specs: ChipSpec[]): TokenChip[] =>
  specs.map((spec, index) => {
    const label = typeof spec === "string" ? spec : spec[0];
    const value = typeof spec === "string" ? undefined : spec[1];
    const tone = typeof spec === "string" ? undefined : spec[2];
    return {
      id: `${prefix}-${index}-${label}-${tone ?? "n"}`,
      label,
      value,
      tone,
    };
  });

const group = (
  id: string,
  label: string,
  specs: ChipSpec[],
  showIndex = false,
): SegmentGroup => ({ id, label, chips: chips(id, specs), showIndex });

const stat = (
  id: string,
  label: string,
  value: string,
  tone?: StatTone,
): StatItem => ({ id, label, value, tone });

/** Visible stand-in for the space byte inside a token. */
const SP = "␣";

/* ------------------------------------------------------------------ */
/* Example 1: BPE training                                             */
/* ------------------------------------------------------------------ */

const CORPUS: [word: string, freq: number][] = [
  ["low", 5],
  ["lower", 2],
  ["newest", 6],
  ["widest", 3],
];

const BASE_SYMBOLS = ["l", "o", "w", "e", "r", "n", "s", "t", "i", "d"];
const MERGED_SYMBOLS = ["es", "est", "lo", "low", "ne"];

interface WordMarks {
  pair?: [string, string];
  merged?: string;
}

const wordGroup = (
  word: string,
  syms: string[],
  marks: WordMarks = {},
): SegmentGroup => {
  const freq = CORPUS.find(([w]) => w === word)?.[1] ?? 1;
  const tones: (TokenChipTone | undefined)[] = syms.map((sym) =>
    marks.merged && sym === marks.merged ? "match" : undefined,
  );
  if (marks.pair) {
    for (let i = 0; i < syms.length - 1; i += 1) {
      if (syms[i] === marks.pair[0] && syms[i + 1] === marks.pair[1]) {
        tones[i] = "active";
        tones[i + 1] = "active";
      }
    }
  }
  return group(
    `word-${word}`,
    `${word} ×${freq}`,
    syms.map((sym, i) => [sym, undefined, tones[i]]),
  );
};

/** Full corpus segmentation as a list of [word, symbols]. */
type Splits = Record<string, string[]>;

const corpusGroups = (splits: Splits, marks: Record<string, WordMarks> = {}) =>
  CORPUS.map(([word]) => wordGroup(word, splits[word], marks[word]));

const SPLITS_0: Splits = {
  low: ["l", "o", "w"],
  lower: ["l", "o", "w", "e", "r"],
  newest: ["n", "e", "w", "e", "s", "t"],
  widest: ["w", "i", "d", "e", "s", "t"],
};
const SPLITS_1: Splits = {
  ...SPLITS_0,
  newest: ["n", "e", "w", "es", "t"],
  widest: ["w", "i", "d", "es", "t"],
};
const SPLITS_2: Splits = {
  ...SPLITS_1,
  newest: ["n", "e", "w", "est"],
  widest: ["w", "i", "d", "est"],
};
const SPLITS_3: Splits = {
  ...SPLITS_2,
  low: ["lo", "w"],
  lower: ["lo", "w", "e", "r"],
};
const SPLITS_4: Splits = {
  ...SPLITS_3,
  low: ["low"],
  lower: ["low", "e", "r"],
};
const SPLITS_5: Splits = {
  ...SPLITS_4,
  newest: ["ne", "w", "est"],
};

/** Bars are scaled against the largest count seen in this corpus (9). */
const pairBars = (
  counts: [pair: string, count: number][],
  best?: string,
): MetricBar[] =>
  counts.map(([pair, count]) => ({
    id: `pair-${pair}`,
    label: pair,
    value: count / 9,
    display: String(count),
    tone: pair === best ? "pink" : "violet",
    active: pair === best,
  }));

const PAIRS_0: [string, number][] = [
  ["e + s", 9],
  ["s + t", 9],
  ["w + e", 8],
  ["l + o", 7],
  ["o + w", 7],
  ["n + e", 6],
  ["e + w", 6],
];
const PAIRS_1: [string, number][] = [
  ["es + t", 9],
  ["w + e", 8],
  ["l + o", 7],
  ["o + w", 7],
  ["n + e", 6],
  ["e + w", 6],
  ["w + i", 3],
];
const PAIRS_2: [string, number][] = [
  ["l + o", 7],
  ["o + w", 7],
  ["n + e", 6],
  ["e + w", 6],
  ["w + est", 6],
  ["w + i", 3],
  ["w + e", 2],
];
const PAIRS_3: [string, number][] = [
  ["lo + w", 7],
  ["n + e", 6],
  ["e + w", 6],
  ["w + est", 6],
  ["w + i", 3],
  ["i + d", 3],
  ["d + est", 3],
];
const PAIRS_4: [string, number][] = [
  ["n + e", 6],
  ["e + w", 6],
  ["w + est", 6],
  ["w + i", 3],
  ["i + d", 3],
  ["d + est", 3],
  ["low + e", 2],
];
const PAIRS_5: [string, number][] = [
  ["ne + w", 6],
  ["w + est", 6],
  ["w + i", 3],
  ["i + d", 3],
  ["d + est", 3],
  ["low + e", 2],
  ["e + r", 2],
];

const vocabChips = (mergeCount: number, latest?: string): TokenChip[] =>
  chips("vocab", [
    ...BASE_SYMBOLS.map((sym, i): ChipSpec => [sym, `#${i}`, "muted"]),
    ...MERGED_SYMBOLS.slice(0, mergeCount).map(
      (sym, i): ChipSpec => [
        sym,
        `#${BASE_SYMBOLS.length + i}`,
        sym === latest ? "match" : "violet",
      ],
    ),
  ]);

const bpeStats = (merges: number, corpusTokens: number): StatItem[] => [
  stat("merges", "merges", `${merges} / 5`, "amber"),
  stat("vocab", "vocab size", String(BASE_SYMBOLS.length + merges), "green"),
  stat("corpus", "corpus tokens", String(corpusTokens), "cyan"),
];

const bpeStep = (
  partial: Omit<TokenizationStep, "bytes"> & { bytes?: TokenChip[] },
): TokenizationStep => ({ bytes: [], ...partial });

const BPE_STEPS: TokenizationStep[] = [
  bpeStep({
    descriptionHtml:
      "Training starts from characters. Every distinct character in the corpus becomes a <span class=\"hl-task\">base symbol</span>, so the initial vocabulary has 10 entries and any text made of these letters can already be encoded.",
    activeLine: 1,
    doneLines: [],
    segments: corpusGroups(SPLITS_0),
    rules: vocabChips(0),
    bars: [],
    stats: bpeStats(0, 79),
  }),
  bpeStep({
    descriptionHtml:
      "Each word is split into a list of single-character symbols. The corpus carries word frequencies (<code>low</code> 5, <code>lower</code> 2, <code>newest</code> 6, <code>widest</code> 3), so it currently costs <span class=\"hl-stack\">79 symbols</span> to write out.",
    activeLine: 2,
    doneLines: [1],
    segments: corpusGroups(SPLITS_0),
    rules: vocabChips(0),
    bars: [],
    stats: bpeStats(0, 79),
  }),
  bpeStep({
    descriptionHtml:
      "<code>countPairs</code> tallies every adjacent symbol pair, weighted by word frequency. <span class=\"hl-micro\">e + s</span> appears in <code>newest</code> (6) and <code>widest</code> (3), so it scores 9. Only the top pairs are shown.",
    activeLine: 5,
    doneLines: [1, 2, 3, 4],
    segments: corpusGroups(SPLITS_0),
    rules: vocabChips(0),
    bars: pairBars(PAIRS_0),
    stats: bpeStats(0, 79),
  }),
  bpeStep({
    descriptionHtml:
      "<code>argmax</code> picks the most frequent pair. <span class=\"hl-micro\">e + s</span> and <span class=\"hl-micro\">s + t</span> tie at 9, and the tie goes to the pair encountered first, so <code>e + s</code> wins.",
    activeLine: 6,
    doneLines: [1, 2, 3, 4, 5],
    segments: corpusGroups(SPLITS_0, {
      newest: { pair: ["e", "s"] },
      widest: { pair: ["e", "s"] },
    }),
    rules: vocabChips(0),
    bars: pairBars(PAIRS_0, "e + s"),
    stats: bpeStats(0, 79),
  }),
  bpeStep({
    descriptionHtml:
      "The merge is recorded and the new symbol <span class=\"hl-task\">es</span> joins the vocabulary as id 10. Merges are stored in order because encoding later replays them in exactly this sequence.",
    activeLine: 9,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
    segments: corpusGroups(SPLITS_0, {
      newest: { pair: ["e", "s"] },
      widest: { pair: ["e", "s"] },
    }),
    rules: vocabChips(1, "es"),
    bars: pairBars(PAIRS_0, "e + s"),
    stats: bpeStats(1, 79),
  }),
  bpeStep({
    descriptionHtml:
      "<code>applyMerge</code> rewrites every word: each adjacent <code>e</code>, <code>s</code> becomes one <span class=\"hl-task\">es</span> symbol. The corpus shrinks from 79 to <span class=\"hl-stack\">70 symbols</span> (9 occurrences removed).",
    activeLine: 11,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    segments: corpusGroups(SPLITS_1, {
      newest: { merged: "es" },
      widest: { merged: "es" },
    }),
    rules: vocabChips(1, "es"),
    bars: pairBars(PAIRS_0, "e + s"),
    stats: bpeStats(1, 70),
  }),
  bpeStep({
    descriptionHtml:
      "Second pass. Pairs are recounted over the new segmentation: <code>s + t</code> no longer exists because <code>s</code> was absorbed, and <span class=\"hl-micro\">es + t</span> takes its place with the same count of 9.",
    activeLine: 5,
    doneLines: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12],
    segments: corpusGroups(SPLITS_1),
    rules: vocabChips(1),
    bars: pairBars(PAIRS_1),
    stats: bpeStats(1, 70),
  }),
  bpeStep({
    descriptionHtml:
      "<code>es + t</code> is merged into <span class=\"hl-task\">est</span> (id 11). Subwords grow by stacking earlier merges, which is why frequent suffixes like <code>est</code> end up as single tokens.",
    activeLine: 11,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    segments: corpusGroups(SPLITS_2, {
      newest: { merged: "est" },
      widest: { merged: "est" },
    }),
    rules: vocabChips(2, "est"),
    bars: pairBars(PAIRS_1, "es + t"),
    stats: bpeStats(2, 61),
  }),
  bpeStep({
    descriptionHtml:
      "Third recount. Note that <span class=\"hl-micro\">w + e</span> dropped from 8 to 2: inside <code>newest</code> the <code>e</code> now lives in <code>est</code>, so the pair only survives in <code>lower</code>. Earlier merges change what later merges can see.",
    activeLine: 5,
    doneLines: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12],
    segments: corpusGroups(SPLITS_2),
    rules: vocabChips(2),
    bars: pairBars(PAIRS_2),
    stats: bpeStats(2, 61),
  }),
  bpeStep({
    descriptionHtml:
      "<code>l + o</code> and <code>o + w</code> tie at 7. <code>l + o</code> was seen first, so it becomes <span class=\"hl-task\">lo</span> (id 12) and both <code>low</code> and <code>lower</code> are rewritten.",
    activeLine: 11,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    segments: corpusGroups(SPLITS_3, {
      low: { merged: "lo" },
      lower: { merged: "lo" },
    }),
    rules: vocabChips(3, "lo"),
    bars: pairBars(PAIRS_2, "l + o"),
    stats: bpeStats(3, 54),
  }),
  bpeStep({
    descriptionHtml:
      "Fourth merge: <code>lo + w</code> becomes <span class=\"hl-task\">low</span> (id 13). The word <code>low</code> is now a single token, and <code>lower</code> is <code>low</code>, <code>e</code>, <code>r</code>.",
    activeLine: 11,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    segments: corpusGroups(SPLITS_4, {
      low: { merged: "low" },
      lower: { merged: "low" },
    }),
    rules: vocabChips(4, "low"),
    bars: pairBars(PAIRS_3, "lo + w"),
    stats: bpeStats(4, 47),
  }),
  bpeStep({
    descriptionHtml:
      "Fifth merge: three pairs tie at 6 and <code>n + e</code> wins on first occurrence, producing <span class=\"hl-task\">ne</span> (id 14). The corpus now costs <span class=\"hl-stack\">41 symbols</span> instead of 79.",
    activeLine: 11,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    segments: corpusGroups(SPLITS_5, { newest: { merged: "ne" } }),
    rules: vocabChips(5, "ne"),
    bars: pairBars(PAIRS_4, "n + e"),
    stats: bpeStats(5, 41),
  }),
  bpeStep({
    descriptionHtml:
      "<code>NUM_MERGES</code> is reached and the loop exits with 15 vocabulary entries and 5 ordered merge rules. An unseen word like <code>lowest</code> would encode as <span class=\"hl-api\">low + est</span>, two known tokens, without any special casing.",
    activeLine: 13,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    segments: corpusGroups(SPLITS_5),
    rules: vocabChips(5),
    bars: pairBars(PAIRS_5),
    stats: bpeStats(5, 41),
  }),
];

/* ------------------------------------------------------------------ */
/* Example 2: encoding a sentence                                      */
/* ------------------------------------------------------------------ */

// Token ids and merge ranks below are illustrative. They follow the shape of
// a GPT-2 style byte-level BPE vocabulary but are not copied from one.

const SENTENCE = "The tokenizer splits unusual words";

const PRE_TOKENS = ["The", `${SP}tokenizer`, `${SP}splits`, `${SP}unusual`, `${SP}words`];

const OUTPUT_IDS: [string, string][] = [
  ["The", "464"],
  [`${SP}token`, "11241"],
  ["izer", "7509"],
  [`${SP}splits`, "30778"],
  [`${SP}unusual`, "8468"],
  [`${SP}words`, "2456"],
];

const preTokenGroup = (activeIndex: number, doneCount: number): SegmentGroup =>
  group(
    "pre",
    "pre-tokens",
    PRE_TOKENS.map((piece, i): ChipSpec => [
      piece,
      undefined,
      i === activeIndex ? "active" : i < doneCount ? "match" : undefined,
    ]),
  );

const pieceGroup = (syms: ChipSpec[]): SegmentGroup =>
  group("piece", "current piece", syms);

const outputGroup = (count: number): SegmentGroup =>
  group(
    "out",
    "output ids",
    OUTPUT_IDS.slice(0, count).map(([label, id]): ChipSpec => [label, id, "amber"]),
    true,
  );

const byteChips = (text: string): TokenChip[] =>
  chips(
    "byte",
    [...new TextEncoder().encode(text)].map((byte, i): ChipSpec => [
      byte.toString(16).toUpperCase().padStart(2, "0"),
      text[i] === " " ? SP : text[i],
      byte === 0x20 ? "amber" : undefined,
    ]),
  );

const rule = (a: string, b: string, rank: number): ChipSpec => [
  `${a} + ${b}`,
  `${a}${b} · rank ${rank}`,
  "violet",
];

const TOKENIZER_RULES: ChipSpec[] = [
  rule(SP, "t", 0),
  rule("e", "r", 13),
  rule("e", "n", 26),
  rule("o", "k", 456),
  rule(`${SP}t`, "ok", 1204),
  rule("i", "z", 4033),
  rule("iz", "er", 7100),
  rule(`${SP}tok`, "en", 9870),
];

const SPLITS_RULES: ChipSpec[] = [
  rule(SP, "s", 1),
  rule("i", "t", 30),
  rule("p", "l", 301),
  rule("it", "s", 890),
  rule(`${SP}s`, "pl", 2210),
  rule(`${SP}spl`, "its", 20114),
];

const WORDS_RULES: ChipSpec[] = [
  rule(SP, "w", 8),
  rule("o", "r", 42),
  rule("d", "s", 611),
  rule(`${SP}w`, "or", 1503),
  rule(`${SP}wor`, "ds", 4890),
];

const encodeStats = (tokens: number, pieces?: number): StatItem[] => [
  stat("chars", "characters", "34", "slate"),
  stat("words", "words", "5", "slate"),
  stat("pieces", "pre-tokens", pieces == null ? "0" : String(pieces), "cyan"),
  stat("tokens", "tokens", String(tokens), "amber"),
];

const ENCODE_STEPS: TokenizationStep[] = [
  {
    descriptionHtml:
      "<code>encode</code> receives the raw string. The model never sees characters directly; it sees a list of integer ids, so everything below is about turning 34 characters into as few ids as the vocabulary allows.",
    activeLine: 1,
    doneLines: [],
    segments: [group("text", "input", [SENTENCE])],
    rules: [],
    bars: [],
    bytes: [],
    stats: encodeStats(0),
  },
  {
    descriptionHtml:
      "<code>preTokenize</code> splits on a regex that keeps each <span class=\"hl-api\">leading space attached to the word after it</span>. That is why most tokens in a vocabulary start with a space: the space is part of the token, not a separator between tokens.",
    activeLine: 3,
    doneLines: [1, 2],
    segments: [preTokenGroup(-1, 0)],
    rules: [],
    bars: [],
    bytes: [],
    stats: encodeStats(0, 5),
  },
  {
    descriptionHtml:
      "First piece, <code>The</code>, is split into single symbols. In a byte-level tokenizer each symbol is really a UTF-8 byte; for ASCII text one byte equals one character, so the byte view lines up with the letters.",
    activeLine: 4,
    doneLines: [1, 2, 3],
    segments: [preTokenGroup(0, 0), pieceGroup(["T", "h", "e"])],
    rules: [],
    bars: [],
    bytes: byteChips("The"),
    stats: encodeStats(0, 5),
  },
  {
    descriptionHtml:
      "The loop applies the <span class=\"hl-micro\">lowest-ranked merge</span> present in the piece, then repeats. <code>T + h</code> (rank 60) fires first, then <code>Th + e</code> (rank 145), and the piece collapses to one symbol.",
    activeLine: 8,
    doneLines: [1, 2, 3, 4, 5, 6, 7],
    segments: [preTokenGroup(0, 0), pieceGroup([["The", undefined, "match"]])],
    rules: chips("rules", [rule("T", "h", 60), rule("Th", "e", 145)]),
    bars: [],
    bytes: byteChips("The"),
    stats: encodeStats(0, 5),
  },
  {
    descriptionHtml:
      "<code>syms.length</code> is 1, so the loop ends and the vocabulary lookup maps <code>The</code> to <span class=\"hl-stack\">id 464</span>. One word, one token.",
    activeLine: 10,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    segments: [preTokenGroup(0, 0), pieceGroup([["The", undefined, "match"]]), outputGroup(1)],
    rules: chips("rules", [rule("T", "h", 60), rule("Th", "e", 145)]),
    bars: [],
    bytes: byteChips("The"),
    stats: encodeStats(1, 5),
  },
  {
    descriptionHtml:
      "Second piece, <code>␣tokenizer</code>, starts as 10 symbols. The first one is the <span class=\"hl-stack\">space byte 0x20</span>, an ordinary symbol with its own merge rules.",
    activeLine: 4,
    doneLines: [1, 2, 3],
    segments: [
      preTokenGroup(1, 1),
      pieceGroup([SP, "t", "o", "k", "e", "n", "i", "z", "e", "r"]),
      outputGroup(1),
    ],
    rules: [],
    bars: [],
    bytes: byteChips(" tokenizer"),
    stats: encodeStats(1, 5),
  },
  {
    descriptionHtml:
      "<code>lowestRankPair</code> scans every adjacent pair and returns the one with the smallest rank. <span class=\"hl-micro\">␣ + t</span> is rank 0 (the most frequent pair in the training data), then <code>e + r</code> and <code>e + n</code> follow.",
    activeLine: 6,
    doneLines: [1, 2, 3, 4, 5],
    segments: [
      preTokenGroup(1, 1),
      pieceGroup([[`${SP}t`, undefined, "match"], "o", "k", ["en", undefined, "match"], "i", "z", ["er", undefined, "match"]]),
      outputGroup(1),
    ],
    rules: chips("rules", TOKENIZER_RULES.slice(0, 3)),
    bars: [],
    bytes: byteChips(" tokenizer"),
    stats: encodeStats(1, 5),
  },
  {
    descriptionHtml:
      "Merges keep stacking: <code>o + k</code> (rank 456), then <code>␣t + ok</code> (rank 1204). Rank order, not left-to-right order, decides what merges next, so the piece is rewritten in the same way it was during training.",
    activeLine: 8,
    doneLines: [1, 2, 3, 4, 5, 6, 7],
    segments: [
      preTokenGroup(1, 1),
      pieceGroup([[`${SP}tok`, undefined, "match"], "en", "i", "z", "er"]),
      outputGroup(1),
    ],
    rules: chips("rules", TOKENIZER_RULES.slice(0, 5)),
    bars: [],
    bytes: byteChips(" tokenizer"),
    stats: encodeStats(1, 5),
  },
  {
    descriptionHtml:
      "<code>i + z</code> (rank 4033) and <code>iz + er</code> (rank 7100) build the suffix <span class=\"hl-task\">izer</span>. The same suffix token shows up in <code>optimizer</code> and <code>organizer</code>, which is what lets the model generalise across word families.",
    activeLine: 8,
    doneLines: [1, 2, 3, 4, 5, 6, 7],
    segments: [
      preTokenGroup(1, 1),
      pieceGroup([`${SP}tok`, "en", ["izer", undefined, "match"]]),
      outputGroup(1),
    ],
    rules: chips("rules", TOKENIZER_RULES.slice(0, 7)),
    bars: [],
    bytes: byteChips(" tokenizer"),
    stats: encodeStats(1, 5),
  },
  {
    descriptionHtml:
      "<code>␣tok + en</code> (rank 9870) yields <span class=\"hl-task\">␣token</span>. Two symbols remain: <code>␣token</code> and <code>izer</code>.",
    activeLine: 8,
    doneLines: [1, 2, 3, 4, 5, 6, 7],
    segments: [
      preTokenGroup(1, 1),
      pieceGroup([[`${SP}token`, undefined, "match"], "izer"]),
      outputGroup(1),
    ],
    rules: chips("rules", TOKENIZER_RULES),
    bars: [],
    bytes: byteChips(" tokenizer"),
    stats: encodeStats(1, 5),
  },
  {
    descriptionHtml:
      "No merge rule exists for <code>␣token + izer</code>, so <code>lowestRankPair</code> returns nothing and the loop breaks. The word was too rare in training to earn its own token, so it costs <span class=\"hl-api\">2 tokens</span>.",
    activeLine: 7,
    doneLines: [1, 2, 3, 4, 5, 6, 8],
    segments: [
      preTokenGroup(1, 1),
      pieceGroup([[`${SP}token`, undefined, "active"], ["izer", undefined, "active"]]),
      outputGroup(1),
    ],
    rules: chips("rules", TOKENIZER_RULES),
    bars: [],
    bytes: byteChips(" tokenizer"),
    stats: encodeStats(1, 5),
  },
  {
    descriptionHtml:
      "Both symbols are looked up and pushed: <span class=\"hl-stack\">11241</span> for <code>␣token</code> and <span class=\"hl-stack\">7509</span> for <code>izer</code>. The model will receive these as two separate positions in its input sequence.",
    activeLine: 10,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    segments: [
      preTokenGroup(1, 1),
      pieceGroup([[`${SP}token`, undefined, "match"], ["izer", undefined, "match"]]),
      outputGroup(3),
    ],
    rules: chips("rules", TOKENIZER_RULES),
    bars: [],
    bytes: byteChips(" tokenizer"),
    stats: encodeStats(3, 5),
  },
  {
    descriptionHtml:
      "<code>␣splits</code> goes through 6 merges and ends as a single symbol with <span class=\"hl-stack\">id 30778</span>. The merge count per word varies, but the output is always whatever symbols survive when no rule applies.",
    activeLine: 8,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 9, 10],
    segments: [
      preTokenGroup(2, 2),
      pieceGroup([[`${SP}splits`, undefined, "match"]]),
      outputGroup(4),
    ],
    rules: chips("rules", SPLITS_RULES),
    bars: [],
    bytes: byteChips(" splits"),
    stats: encodeStats(4, 5),
  },
  {
    descriptionHtml:
      "<code>␣unusual</code> (7 merges) and <code>␣words</code> (5 merges) each become one token. Common English words almost always fit in a single token because their pairs were frequent enough to be merged all the way up.",
    activeLine: 8,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 9, 10],
    segments: [
      preTokenGroup(4, 4),
      pieceGroup([[`${SP}words`, undefined, "match"]]),
      outputGroup(6),
    ],
    rules: chips("rules", WORDS_RULES),
    bars: [],
    bytes: byteChips(" words"),
    stats: encodeStats(6, 5),
  },
  {
    descriptionHtml:
      "<code>encode</code> returns 6 ids for 5 words and 34 characters, about 5.7 characters per token. Token count, not word count, is what fills the <span class=\"hl-api\">context window</span> and what API pricing meters, so unusual words and non-English text cost more.",
    activeLine: 12,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    segments: [preTokenGroup(-1, 5), outputGroup(6)],
    rules: [],
    bars: [],
    bytes: [],
    stats: [...encodeStats(6, 5), stat("ratio", "chars / token", "5.7", "green")],
  },
];

/* ------------------------------------------------------------------ */
/* Example 3: why counts differ                                        */
/* ------------------------------------------------------------------ */

const INPUTS = ["hello", "Hello", `${SP}hello`, "12345", `${SP}${SP}${SP}${SP}return`, "ხმა"];

const inputsGroup = (activeIndex: number, doneCount: number): SegmentGroup =>
  group(
    "inputs",
    "inputs",
    INPUTS.map((text, i): ChipSpec => [
      text,
      undefined,
      i === activeIndex ? "active" : i < doneCount ? "match" : undefined,
    ]),
  );

const EDGE_OUTPUTS: [string, string][] = [
  ["hello", "31373"],
  ["Hello", "15496"],
  [`${SP}hello`, "23748"],
  ["123", "10163"],
  ["45", "2231"],
  [`${SP}${SP}${SP}`, "27908"],
  [`${SP}return`, "1441"],
];

const GEORGIAN_BYTES = ["E1", "83", "AE", "E1", "83", "9B", "E1", "83", "90"];

const edgeOutputGroup = (count: number, withBytes = false): SegmentGroup =>
  group(
    "edge-out",
    "output ids",
    [
      ...EDGE_OUTPUTS.slice(0, count).map(([label, id]): ChipSpec => [label, id, "amber"]),
      ...(withBytes
        ? GEORGIAN_BYTES.map((hex): ChipSpec => [`0x${hex}`, String(parseInt(hex, 16)), "miss"])
        : []),
    ],
    true,
  );

/** Rules listed in the order they fire, which is ascending rank. */
const HELLO_RULES: ChipSpec[] = [
  rule("h", "e", 7),
  rule("l", "l", 48),
  rule("he", "ll", 2110),
  rule("hell", "o", 18300),
];

const CAP_HELLO_RULES: ChipSpec[] = [
  rule("l", "l", 48),
  rule("H", "e", 191),
  rule("He", "ll", 3540),
  rule("Hell", "o", 12520),
];

const INDENT_RULES: ChipSpec[] = [
  rule(SP, SP, 2),
  rule(`${SP}${SP}`, SP, 51),
];

const RETURN_RULES: ChipSpec[] = [
  rule(SP, "r", 6),
  rule("u", "r", 60),
  rule(`${SP}r`, "e", 930),
  rule("ur", "n", 1210),
  rule("t", "urn", 2640),
  rule(`${SP}re`, "turn", 4410),
];

const georgianBytes = (): TokenChip[] =>
  chips(
    "gbyte",
    GEORGIAN_BYTES.map((hex, i): ChipSpec => [hex, ["ხ", "მ", "ა"][Math.floor(i / 3)], "miss"]),
  );

const edgeStats = (processed: number, tokens: number): StatItem[] => [
  stat("inputs", "inputs", `${processed} / 6`, "slate"),
  stat("chars", "characters", "34", "slate"),
  stat("tokens", "tokens", String(tokens), "amber"),
];

const EDGE_STEPS: TokenizationStep[] = [
  {
    descriptionHtml:
      "Six short inputs, 34 characters in total, run through the same <code>encodePiece</code>. The question is how many tokens each one costs, and the answer depends on bytes and merge rules rather than on what a human would call a word.",
    activeLine: 2,
    doneLines: [1],
    segments: [inputsGroup(-1, 0)],
    rules: [],
    bars: [],
    bytes: [],
    stats: edgeStats(0, 0),
  },
  {
    descriptionHtml:
      "<code>TextEncoder</code> turns <code>hello</code> into 5 UTF-8 bytes. Each byte maps to a printable placeholder symbol, so the merge loop only ever deals with a fixed alphabet of <span class=\"hl-micro\">256 base symbols</span> and nothing is ever out of vocabulary.",
    activeLine: 4,
    doneLines: [1, 2, 3],
    segments: [inputsGroup(0, 0)],
    rules: [],
    bars: [],
    bytes: byteChips("hello"),
    stats: edgeStats(0, 0),
  },
  {
    descriptionHtml:
      "Four merges reduce <code>hello</code> to one symbol and the lookup returns <span class=\"hl-stack\">31373</span>. A five-letter word in one token is the normal case for common lowercase English.",
    activeLine: 10,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    segments: [inputsGroup(0, 0), edgeOutputGroup(1)],
    rules: chips("rules", HELLO_RULES),
    bars: [],
    bytes: byteChips("hello"),
    stats: edgeStats(1, 1),
  },
  {
    descriptionHtml:
      "<code>Hello</code> differs from <code>hello</code> in exactly one byte: <span class=\"hl-micro\">0x48</span> instead of <span class=\"hl-micro\">0x68</span>. BPE has no notion of case, so from here on this is simply a different byte sequence.",
    activeLine: 4,
    doneLines: [1, 2, 3],
    segments: [inputsGroup(1, 1), edgeOutputGroup(1)],
    rules: [],
    bars: [],
    bytes: byteChips("Hello"),
    stats: edgeStats(1, 1),
  },
  {
    descriptionHtml:
      "The capitalised form still merges to one symbol, but it is a different symbol with <span class=\"hl-stack\">id 15496</span>. The model has a separate embedding row for it, and it learns that the two are related only from context during training.",
    activeLine: 10,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    segments: [inputsGroup(1, 1), edgeOutputGroup(2)],
    rules: chips("rules", CAP_HELLO_RULES),
    bars: [],
    bytes: byteChips("Hello"),
    stats: edgeStats(2, 2),
  },
  {
    descriptionHtml:
      "<code>␣hello</code> carries the space byte and encodes to a third id, <span class=\"hl-stack\">23748</span>. In running text almost every word follows a space, so the space-prefixed token is the common one; the bare <code>hello</code> mostly appears at the start of a line.",
    activeLine: 10,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    segments: [inputsGroup(2, 2), edgeOutputGroup(3)],
    rules: chips("rules", [rule(SP, "h", 5), rule("e", "l", 78), rule(`${SP}h`, "el", 1490), rule(`${SP}hel`, "lo", 6080)]),
    bars: [],
    bytes: byteChips(" hello"),
    stats: edgeStats(3, 3),
  },
  {
    descriptionHtml:
      "<code>12345</code> is 5 digit bytes. Digits merge by frequency like everything else, and the merge table happens to contain <code>123</code> and <code>45</code> but not the full number.",
    activeLine: 6,
    doneLines: [1, 2, 3, 4, 5],
    segments: [inputsGroup(3, 3), edgeOutputGroup(3)],
    rules: chips("rules", [rule("1", "2", 340), rule("12", "3", 2870), rule("4", "5", 3115)]),
    bars: [],
    bytes: byteChips("12345"),
    stats: edgeStats(3, 3),
  },
  {
    descriptionHtml:
      "The number becomes <span class=\"hl-api\">2 tokens</span>, <code>123</code> and <code>45</code>, split by merge statistics rather than by place value. This is one reason arithmetic is awkward for language models; newer tokenizers cap digit runs at 3 to make the chunking predictable.",
    activeLine: 10,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    segments: [inputsGroup(3, 3), edgeOutputGroup(5)],
    rules: chips("rules", [rule("1", "2", 340), rule("12", "3", 2870), rule("4", "5", 3115)]),
    bars: [],
    bytes: byteChips("12345"),
    stats: edgeStats(4, 5),
  },
  {
    descriptionHtml:
      "Indented code: the pre-tokenizer splits four spaces plus <code>return</code> into <code>␣␣␣</code> and <code>␣return</code>, because the last space attaches to the word. Whitespace runs get their own tokens, so deeply indented code burns tokens on indentation alone.",
    activeLine: 10,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    segments: [inputsGroup(4, 4), edgeOutputGroup(7)],
    rules: chips("rules", [...INDENT_RULES, ...RETURN_RULES]),
    bars: [],
    bytes: byteChips("    return"),
    stats: edgeStats(5, 7),
  },
  {
    descriptionHtml:
      "<code>ხმა</code> (Georgian, 3 letters) is <span class=\"hl-micro\">9 bytes</span>: every letter in the U+10D0 block needs 3 bytes in UTF-8. The byte view is now three times longer than the text.",
    activeLine: 4,
    doneLines: [1, 2, 3],
    segments: [inputsGroup(5, 5), edgeOutputGroup(7)],
    rules: [],
    bars: [],
    bytes: georgianBytes(),
    stats: edgeStats(5, 7),
  },
  {
    descriptionHtml:
      "This vocabulary learned no merges for these byte pairs, so <code>lowestRankPair</code> finds nothing on the first pass and the loop breaks immediately. This is the <span class=\"hl-api\">byte fallback</span>: each byte is emitted as its own token from the reserved 0 to 255 range.",
    activeLine: 7,
    doneLines: [1, 2, 3, 4, 5, 6],
    segments: [inputsGroup(5, 5), edgeOutputGroup(7, true)],
    rules: chips("rules", [["no rule for E1 + 83", "fallback", "miss"], ["no rule for 83 + AE", "fallback", "miss"]]),
    bars: [],
    bytes: georgianBytes(),
    stats: edgeStats(5, 7),
  },
  {
    descriptionHtml:
      "Final tally: 34 characters became <span class=\"hl-stack\">16 tokens</span>. The Georgian word alone costs 9 of them, three per letter, while <code>hello</code> costs 1. Token cost tracks how well the training data covered a script, not how long the text looks.",
    activeLine: 10,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    segments: [inputsGroup(-1, 6), edgeOutputGroup(7, true)],
    rules: [],
    bars: [],
    bytes: [],
    stats: [
      ...edgeStats(6, 16),
      stat("cheap", "hello", "1 token", "green"),
      stat("expensive", "ხმა", "9 tokens", "rose"),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Examples                                                            */
/* ------------------------------------------------------------------ */

export const EXAMPLES: TokenizationExample[] = [
  {
    id: "bpe",
    title: "BPE merges",
    description:
      "Train byte pair encoding on a tiny corpus: count adjacent pairs, merge the most frequent one, repeat.",
    kind: "bpe",
    codeLines: [
      { num: 1, text: "const vocab = new Set(words.flatMap((w) => [...w]));" },
      { num: 2, text: "const splits = new Map(words.map((w) => [w, [...w]]));" },
      { num: 3, text: "const merges = [];" },
      { num: 4, text: "while (merges.length < NUM_MERGES) {" },
      { num: 5, text: "  const pairs = countPairs(splits, freq);" },
      { num: 6, text: "  const best = argmax(pairs);" },
      { num: 7, text: "  if (!best) break;" },
      { num: 8, text: "  merges.push(best);" },
      { num: 9, text: "  vocab.add(best[0] + best[1]);" },
      { num: 10, text: "  for (const [word, syms] of splits) {" },
      { num: 11, text: "    splits.set(word, applyMerge(syms, best));" },
      { num: 12, text: "  }" },
      { num: 13, text: "}" },
    ],
    steps: BPE_STEPS,
  },
  {
    id: "encode",
    title: "Encoding a sentence",
    description:
      "Apply learned merges to a sentence, piece by piece, and map the surviving symbols to token ids.",
    kind: "encode",
    codeLines: [
      { num: 1, text: "function encode(text) {" },
      { num: 2, text: "  const ids = [];" },
      { num: 3, text: "  for (const piece of preTokenize(text)) {" },
      { num: 4, text: "    let syms = [...piece];" },
      { num: 5, text: "    while (syms.length > 1) {" },
      { num: 6, text: "      const pair = lowestRankPair(syms, ranks);" },
      { num: 7, text: "      if (!pair) break;" },
      { num: 8, text: "      syms = applyMerge(syms, pair);" },
      { num: 9, text: "    }" },
      { num: 10, text: "    ids.push(...syms.map((s) => vocab.get(s)));" },
      { num: 11, text: "  }" },
      { num: 12, text: "  return ids;" },
      { num: 13, text: "}" },
    ],
    steps: ENCODE_STEPS,
  },
  {
    id: "edge-cases",
    title: "Why counts differ",
    description:
      "Case, leading spaces, digits, indentation, and non-Latin scripts all change how many tokens a string costs.",
    kind: "edge-cases",
    codeLines: [
      { num: 1, text: "const encoder = new TextEncoder();" },
      { num: 2, text: "function encodePiece(piece) {" },
      { num: 3, text: "  const bytes = [...encoder.encode(piece)];" },
      { num: 4, text: "  let syms = bytes.map((b) => byteToUnicode[b]);" },
      { num: 5, text: "  while (syms.length > 1) {" },
      { num: 6, text: "    const pair = lowestRankPair(syms, ranks);" },
      { num: 7, text: "    if (!pair) break;" },
      { num: 8, text: "    syms = applyMerge(syms, pair);" },
      { num: 9, text: "  }" },
      { num: 10, text: "  return syms.map((s) => vocab.get(s));" },
      { num: 11, text: "}" },
    ],
    steps: EDGE_STEPS,
  },
];
