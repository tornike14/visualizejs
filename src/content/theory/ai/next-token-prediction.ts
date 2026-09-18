import type { TopicTheoryContent } from "@/content/theory/types";

export const nextTokenPredictionTheory: TopicTheoryContent = {
  summary:
    "Next token prediction is the single operation a language model performs: given a sequence of token ids, produce a probability distribution over the vocabulary for what comes next. Text generation is that operation run in a loop, with a sampling rule deciding which token to append each time.",
  whatItIs: [
    "A language model does not write sentences. It scores every token in its vocabulary as a candidate for the next position, and a decoding loop picks one, appends it, and asks again. Every word of a chat reply came out of this loop, one token at a time.",
    "The forward pass ends with a linear layer (the lm head) that maps the last position's hidden vector to one real-valued score per vocabulary entry. These scores are logits: unbounded and only meaningful relative to each other. Softmax converts them into probabilities by exponentiating each score and dividing by the sum, so larger gaps between logits become larger ratios between probabilities.",
    "Decoding strategies decide what to do with that distribution. Greedy decoding takes the argmax and is deterministic. Sampling draws a token in proportion to its probability, which is why the same prompt gives different answers on different runs. Temperature rescales the logits before softmax, top-k and top-p truncate the tail before drawing, and these are usually combined.",
    "Only the last position's logits are used during generation, yet the model computes hidden states for every position. Inference engines avoid redoing that work with a key-value cache: attention keys and values from earlier positions are stored, so each new step processes only the newest token and attends over the cache. The cost per token is then roughly proportional to the current sequence length rather than to its square.",
  ],
  howItWorks: [
    "Step 1: the tokenizer converts the prompt into integer ids. The model receives ids, never raw text, and the id list is the state that the generation loop grows.",
    "Step 2: a forward pass embeds every id, runs the sequence through the transformer blocks, and reads the hidden vector at the last position.",
    "Step 3: the lm head multiplies that vector by the output embedding matrix, yielding one logit per vocabulary token, tens of thousands of scores for a single step.",
    "Step 4: the logits are divided by the temperature T and passed through softmax. T below 1 sharpens the distribution toward the top token, T above 1 flattens it, and T = 0 is treated as pure argmax.",
    "Step 5: an optional truncation removes the tail. Top-k keeps the k highest probabilities; top-p keeps the smallest set whose cumulative probability reaches p. The survivors are renormalized so they sum to 1 again.",
    "Step 6: a token is drawn from the final distribution and appended to the ids. The loop repeats until an end-of-sequence token is drawn or a token budget runs out, reusing cached keys and values so earlier positions are not recomputed.",
  ],
  commonMistakes: [
    {
      title: "Treating logits as probabilities",
      explanation:
        "Logits can be negative, exceed 1, and do not sum to anything in particular. Ranking them is fine, but reading a logit of 5.8 as 'very confident' ignores the values of every other candidate.",
      fix: "Apply softmax (with the temperature you actually decode at) before interpreting confidence, and compare probabilities or log probabilities, not raw scores.",
    },
    {
      title: "Expecting reproducible output with temperature above 0",
      explanation:
        "Any nonzero temperature means a random draw at every step. Even at T = 0.5, tail tokens keep a small probability, and over hundreds of tokens a rare draw becomes likely.",
      fix: "Use T = 0 (greedy) or a fixed random seed when outputs must be identical across runs, and remember that batching and floating point differences can still change results.",
    },
    {
      title: "Using top-k alone on peaked and flat distributions",
      explanation:
        "A fixed k keeps too few candidates when the model is unsure and too many junk candidates when it is certain. The right count changes from step to step.",
      fix: "Prefer top-p, which sizes the candidate set by cumulative probability, or combine a generous top-k with top-p so the count adapts to the model's confidence.",
    },
    {
      title: "Applying truncation before temperature",
      explanation:
        "Temperature changes the probabilities that top-p measures against, so applying top-p first and temperature second produces a different candidate set than intended.",
      fix: "Follow the conventional order: scale logits by temperature, softmax, then top-k and top-p, then draw. Check the order your inference library uses if results look off.",
    },
  ],
  interviewQuestions: [
    {
      question: "What does a language model actually output at each step?",
      answer:
        "A vector of logits with one entry per vocabulary token, computed from the last position's hidden state. Softmax turns it into a probability distribution, and a decoding rule picks one token from it. The model itself never chooses; the sampler does.",
      codeExample: {
        language: "python",
        code: `logits = model(ids)[-1]          # shape: (vocab_size,)
probs = softmax(logits / T)      # sums to 1
next_id = sample(probs)          # argmax when T == 0
ids.append(next_id)`,
      },
    },
    {
      question: "How does temperature change the distribution, and can it reorder tokens?",
      answer:
        "Temperature divides every logit by T before softmax. Because division preserves order, the ranking of tokens never changes; only the gaps do. T below 1 widens the gaps and concentrates mass on the top token, T above 1 narrows them and spreads mass into the tail. In the limit T approaches 0 the distribution becomes one-hot on the argmax.",
    },
    {
      question: "What is the difference between top-k and top-p sampling?",
      answer:
        "Top-k keeps the k most probable tokens regardless of their mass. Top-p sorts tokens by probability and keeps the smallest prefix whose cumulative probability is at least p, so the candidate count grows when the model is uncertain and shrinks when it is confident. Both zero out the rest and renormalize before drawing.",
      codeExample: {
        language: "python",
        code: `def top_p(probs, p):
    order = argsort(probs)[::-1]
    cum = cumsum(probs[order])
    cutoff = (cum >= p).argmax() + 1
    keep = order[:cutoff]
    mask = zeros_like(probs)
    mask[keep] = probs[keep]
    return mask / mask.sum()`,
      },
    },
    {
      question: "Why is generation with a KV cache faster than recomputing the whole sequence?",
      answer:
        "Attention at each layer needs keys and values for every earlier position, but those do not change once computed because the model is causal. Caching them means a new step runs the transformer only for the newest token and attends over stored tensors. Without the cache each step costs work proportional to the full sequence length squared; with it the per-step cost is closer to linear in the sequence length.",
    },
    {
      question: "Why does the same prompt give different completions on different runs?",
      answer:
        "Because sampling draws each token from a probability distribution using a random number. Any token with nonzero probability can be chosen, and over a long completion the sequence of draws diverges quickly. Greedy decoding or a fixed seed removes this source of variation, though hardware nondeterminism in floating point reductions can still cause small differences.",
    },
  ],
  relatedTopicIds: ["attention", "tokenization", "embeddings", "backpropagation"],
};
