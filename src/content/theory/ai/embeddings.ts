import type { TopicTheoryContent } from "@/content/theory/types";

export const embeddingsTheory: TopicTheoryContent = {
  summary:
    "An embedding is a learned vector of numbers that stands in for a token, so that tokens used in similar contexts end up close together and the model can do arithmetic on meaning instead of on ids.",
  whatItIs: [
    "A tokenizer turns text into integer ids, but an id is only an index: id 1 is not closer to id 2 than to id 500. The embedding layer replaces each id with a row from a matrix E of shape vocabulary size by embedding dimension. That row is the vector the rest of the network works with.",
    "The values in E are parameters, learned by gradient descent alongside every other weight. Training starts them at small random numbers and adjusts the rows that appear in each batch so the model predicts text better. Tokens that show up in similar contexts receive similar gradients over time, which pushes their rows toward the same region of the space.",
    "Because the vectors live in a geometric space, similarity becomes a measurement. Cosine similarity divides the dot product of two vectors by the product of their lengths and returns a value in [-1, 1]: 1 for the same direction, 0 for perpendicular, -1 for opposite. Retrieval, semantic search, and deduplication all rank candidates by this number.",
    "In a transformer, the token embedding is not the whole input. Attention treats its inputs as a set, so the model adds a position signal to each token vector before the first layer. In GPT-2 that is a second learned table indexed by position, the original transformer used fixed sinusoids, and many recent models apply a rotation inside attention instead. Typical embedding widths run from 768 in GPT-2 small to 12288 in the largest GPT-3.",
  ],
  howItWorks: [
    "Step 1: the tokenizer maps the input text to a list of integer ids, one per token.",
    "Step 2: for each id, the model reads row E[id] from the embedding matrix. This is an array index, not a matrix multiply, so the cost is tiny regardless of vocabulary size.",
    "Step 3: the model reads a position vector for each slot i, from a learned table P[i] or a fixed formula, and adds it to the token vector: x_i = E[id_i] + P[i].",
    "Step 4: the resulting rows form a matrix X of shape sequence length by embedding dimension, which is the input to the first attention block.",
    "Step 5: during training, the loss gradient flows back through X into E. Only the rows that were looked up in the batch receive updates, so rare tokens are trained less often than common ones.",
    "Step 6: at inference or in a retrieval system, two vectors are compared with cosine similarity: dot(a, b) / (|a| * |b|). The angle between them, not their lengths, is what carries the comparison.",
  ],
  commonMistakes: [
    {
      title: "Treating token ids as if they carried meaning",
      explanation:
        "Ids are assigned by the tokenizer, often by merge order or frequency, so numeric closeness between ids says nothing about the tokens. Feeding raw ids into a dense layer forces the model to learn around an arbitrary ordering.",
      fix: "Always pass ids through an embedding lookup first. The learned rows, not the ids, are the representation.",
    },
    {
      title: "Comparing vectors with the dot product alone",
      explanation:
        "The raw dot product grows with vector length, so a long vector scores high against everything. Frequent tokens often have larger norms, which biases nearest neighbour results toward them.",
      fix: "Normalise both vectors or use cosine similarity, which divides by the norms and compares direction only. If you store normalised vectors, the dot product and cosine similarity become the same number.",
    },
    {
      title: "Forgetting position information",
      explanation:
        "Attention is permutation equivariant: shuffling the input rows shuffles the outputs the same way. With token embeddings only, the model cannot tell the cat sat from sat the cat.",
      fix: "Add a position embedding to each token vector, or use a positional scheme such as RoPE inside attention, before the first transformer layer.",
    },
    {
      title: "Mixing embeddings from different models",
      explanation:
        "Each model learns its own space. The dimension may match, but the axes mean different things, so a vector from one model compared with a vector from another produces a number that is not a similarity at all.",
      fix: "Embed queries and documents with the same model and version, and re-embed the whole corpus when the model changes.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is an embedding layer, and what does it compute?",
      answer:
        "It is a matrix with one row per vocabulary token and one column per dimension. Given a token id, it returns the row at that index. There is no multiplication involved, it is a lookup, and the rows are trained parameters that the rest of the network updates through backpropagation.",
      codeExample: {
        language: "javascript",
        code: `// E has shape [vocabSize, d]
const ids = tokenize("cat dog car"); // [1, 2, 3]
const X = ids.map((id) => E[id]);    // shape [3, d]`,
      },
    },
    {
      question: "How does cosine similarity differ from the dot product, and when does it matter?",
      answer:
        "Cosine similarity is the dot product divided by the product of the two norms, so it measures the angle between vectors and ignores their length. It matters when vectors have different magnitudes, which is common in learned embeddings, because the raw dot product would favour long vectors regardless of direction.",
      codeExample: {
        language: "javascript",
        code: `const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const norm = (a) => Math.sqrt(dot(a, a));
const cosine = (a, b) => dot(a, b) / (norm(a) * norm(b));

cosine([0.8, 0.5, 0.1], [0.6, 0.7, 0.1]); // 0.95`,
      },
    },
    {
      question: "Why do transformers need positional embeddings?",
      answer:
        "Self attention computes a weighted sum over the set of input vectors, and the weights depend only on the vectors themselves. Permuting the input permutes the output identically, so word order would be invisible. Adding a position dependent vector to each token gives the model a way to tell slots apart.",
      codeExample: {
        language: "javascript",
        code: `const X = ids.map((id, i) =>
  tokEmb[id].map((v, k) => v + posEmb[i][k])
);`,
      },
    },
    {
      question: "How are embedding values learned?",
      answer:
        "They are initialised randomly and updated by gradient descent like any other weight. The gradient of the loss with respect to the input vectors flows back into the rows that were looked up, so each training example nudges only the rows for the tokens it contains. Over many examples, tokens with similar contexts converge toward similar rows.",
    },
    {
      question: "Why can you not compare embeddings produced by two different models?",
      answer:
        "Each model learns its own coordinate system. Even with equal dimension, a direction that encodes one property in model A encodes something unrelated in model B, so cosine similarity across models is meaningless. A retrieval index has to be rebuilt whenever the embedding model changes.",
    },
  ],
  relatedTopicIds: ["tokenization", "attention", "next-token-prediction"],
};
