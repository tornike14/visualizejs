import type { TopicTheoryContent } from "@/content/theory/types";

export const tokenizationTheory: TopicTheoryContent = {
  summary:
    "Tokenization is the step that turns raw text into the sequence of integer ids a language model actually reads. Modern models use subword schemes such as byte pair encoding, so a token is usually a word fragment rather than a whole word or a single character.",
  whatItIs: [
    "A language model cannot consume strings. Its first layer is an embedding table indexed by integers, so every input has to be converted into a list of ids drawn from a fixed vocabulary. The tokenizer is the deterministic function that performs that conversion, and its inverse, decoding, turns generated ids back into text.",
    "Splitting on whitespace would make the vocabulary unbounded and leave every misspelling or new name out of vocabulary. Splitting into characters keeps the vocabulary tiny but makes sequences very long, and each position then carries almost no meaning. Subword tokenization sits between the two: frequent strings such as common words become one token, rare strings are broken into pieces the model has seen before.",
    "Byte pair encoding learns those pieces from data. Training starts from base symbols, counts every adjacent pair across the corpus, merges the most frequent one into a new symbol, and repeats until the vocabulary reaches a target size. The ordered list of merges is the tokenizer. Encoding replays the same merges on new text, so training and inference always segment a string the same way.",
    "Byte-level variants, used by GPT-2 and most models after it, take UTF-8 bytes rather than characters as the base symbols. That guarantees every possible input can be encoded with 256 base tokens and no unknown-token placeholder, at the cost that scripts which were rare in the training corpus, or which need several bytes per character, split into many more tokens than English does.",
  ],
  howItWorks: [
    "Step 1: a pre-tokenizer splits the text into pieces with a regex. In GPT-style tokenizers a leading space stays attached to the word after it, contractions are separated, and runs of whitespace or digits are isolated so merges never cross those boundaries.",
    "Step 2: each piece is expanded into its base symbols, which are UTF-8 bytes mapped to printable placeholder characters in a byte-level tokenizer.",
    "Step 3: the encoder repeatedly finds the adjacent pair with the lowest merge rank among the current symbols and replaces it with the merged symbol. Rank order, not left-to-right order, decides what merges next.",
    "Step 4: the loop stops when no remaining adjacent pair has a merge rule. Whatever symbols survive are the tokens for that piece; a common word ends as one symbol while a rare one ends as several.",
    "Step 5: every surviving symbol is looked up in the vocabulary to get its integer id, and the ids from all pieces are concatenated into the model input.",
    "Step 6: the model treats each id as an opaque position. It has no view of the underlying letters, which is why spelling, counting characters, and arithmetic on long numbers are harder than they look.",
  ],
  commonMistakes: [
    {
      title: "Estimating cost or context by word count",
      explanation:
        "Context windows and API pricing are measured in tokens. English prose averages roughly four characters per token, but code, numbers, unusual names, and non-Latin scripts can run at one to three tokens per word.",
      fix: "Count tokens with the model's own tokenizer before truncating or budgeting. Never assume a fixed words-to-tokens ratio across languages or content types.",
    },
    {
      title: "Treating a word and its space-prefixed form as the same token",
      explanation:
        "In GPT-style vocabularies the space belongs to the following word, so 'hello' and ' hello' are different ids with different embeddings. Prompts that end with a trailing space or start a line without one can shift which token the model sees.",
      fix: "Keep the boundary consistent with training data: end prompts without a trailing space and let the model produce the space-prefixed token itself.",
    },
    {
      title: "Mixing tokenizers across models",
      explanation:
        "Ids only mean something relative to the vocabulary they came from. Feeding ids from one tokenizer into another model, or comparing token counts across model families, silently produces nonsense.",
      fix: "Load the tokenizer that ships with the exact model checkpoint and treat token counts as model-specific numbers.",
    },
    {
      title: "Expecting character-level reasoning",
      explanation:
        "A model sees 'strawberry' as one or two ids, not as a run of letters, so questions about letter counts or reversing strings work only when the model has memorised the spelling.",
      fix: "Break the string into visible characters in the prompt, or hand the task to code. Do not rely on the model to see inside tokens.",
    },
  ],
  interviewQuestions: [
    {
      question:
        "Why do language models use subword tokens instead of whole words?",
      answer:
        "Whole-word vocabularies are unbounded and any unseen word becomes an unknown token. Character vocabularies are tiny but produce very long sequences with little meaning per position. Subword tokenization keeps the vocabulary fixed while still encoding any string, and it lets common words be one token while rare words fall back to shared fragments such as prefixes and suffixes.",
    },
    {
      question: "Walk through how byte pair encoding is trained.",
      answer:
        "Start with each word split into base symbols and a frequency count per word. Count all adjacent symbol pairs weighted by frequency, merge the most frequent pair into a new symbol everywhere it occurs, add that symbol to the vocabulary, and record the merge. Repeat until the vocabulary reaches the target size. The ordered merge list is what encoding replays later.",
      codeExample: {
        language: "javascript",
        code: `const merges = [];
while (merges.length < NUM_MERGES) {
  const pairs = countPairs(splits, freq);   // { "e s": 9, "s t": 9, ... }
  const best = argmax(pairs);               // ["e", "s"]
  if (!best) break;
  merges.push(best);
  vocab.add(best[0] + best[1]);             // "es"
  for (const [word, syms] of splits) {
    splits.set(word, applyMerge(syms, best));
  }
}`,
      },
    },
    {
      question: "How does encoding a new string use the learned merges?",
      answer:
        "Each pre-tokenized piece is split into base symbols, then the encoder repeatedly merges the adjacent pair with the lowest rank in the merge list until no pair has a rule. Applying merges in rank order reproduces the segmentation seen during training. The surviving symbols are mapped to ids through the vocabulary.",
      codeExample: {
        language: "javascript",
        code: `function encodePiece(piece) {
  let syms = [...piece];
  while (syms.length > 1) {
    const pair = lowestRankPair(syms, ranks);
    if (!pair) break;
    syms = applyMerge(syms, pair);
  }
  return syms.map((s) => vocab.get(s));
}`,
      },
    },
    {
      question:
        "Why does 'hello' tokenize differently from ' hello' and 'Hello'?",
      answer:
        "The tokenizer works on bytes and has no notion of case or word boundaries beyond what the pre-tokenizer regex encodes. A leading space is part of the byte sequence, so ' hello' is a different string with its own merge path and id. The same holds for a different first byte in 'Hello'. Each variant gets its own embedding and the model learns their relationship only from co-occurrence.",
    },
    {
      question:
        "What is byte fallback and why does it matter for non-English text?",
      answer:
        "In a byte-level tokenizer the 256 possible byte values are always in the vocabulary, so any UTF-8 input can be encoded without an unknown token. When no merge rules were learned for a script, every byte becomes its own token. A character that needs three bytes in UTF-8 then costs three tokens, which is why the same sentence can be several times more expensive in Georgian or Thai than in English.",
    },
  ],
  relatedTopicIds: ["embeddings", "attention", "next-token-prediction"],
};
