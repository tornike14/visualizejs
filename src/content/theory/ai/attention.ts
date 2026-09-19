import type { TopicTheoryContent } from "@/content/theory/types";

export const attentionTheory: TopicTheoryContent = {
  summary:
    "Self-attention lets every token in a sequence build a new representation by taking a weighted average of the other tokens, where the weights come from how well each token's query matches the others' keys. It is the operation that gives transformers their ability to relate words at any distance.",
  whatItIs: [
    'Before attention, each token has a vector that only describes the token itself. Attention rewrites that vector so it also describes the token\'s context: after one attention layer, the vector for "sat" can carry information about "cat" because the layer let "sat" look at "cat" and copy part of it.',
    "Three learned linear projections turn each input vector into a query, a key, and a value. The query is what the token is looking for, the key is what the token advertises about itself, and the value is the content it hands over when another token attends to it. Scores are dot products between one query and every key, softmax turns those scores into weights that sum to one, and the output is the weighted sum of the values.",
    "The scores are divided by the square root of the key dimension before softmax. Dot products grow with the number of dimensions, so without scaling the softmax input would be large, the weights would collapse toward a single one-hot entry, and the gradient through softmax would be close to zero. Scaling keeps the distribution soft enough to train.",
    "Because every query is scored against every key, the attention matrix is n by n for a sequence of n tokens. That quadratic cost in both time and memory is why context length is the expensive axis in a transformer and why so much engineering effort goes into sparse, linear, or cached variants of the same idea.",
  ],
  howItWorks: [
    "Step 1: each input embedding x is multiplied by three learned matrices to produce q = x Wq, k = x Wk, and v = x Wv. All tokens share the same matrices, so the projections are computed as one batched matmul.",
    "Step 2: the raw score between query i and key j is the dot product q_i . k_j. Stacking all of them gives the matrix Q K^T with one row per query and one column per key.",
    "Step 3: the score matrix is divided by sqrt(d_k). In a decoder, a causal mask then sets every entry where j > i to negative infinity, so a token cannot see positions that come after it.",
    "Step 4: softmax is applied to each row. Exponentiating makes every entry positive and turns negative infinity into exactly zero, then dividing by the row sum makes each row a probability distribution over the keys.",
    "Step 5: the output for token i is the sum over j of weight_ij times v_j. High-weight tokens contribute most of their value vector, low-weight tokens contribute almost nothing.",
    "Step 6: multi-head attention runs several independent copies of steps 1 to 5 with smaller d_k each, concatenates their outputs, and multiplies by an output matrix Wo so the model can combine what the heads found.",
  ],
  commonMistakes: [
    {
      title: "Applying the mask after softmax",
      explanation:
        "Zeroing future weights after softmax leaves the remaining weights summing to less than one, and the future positions still influenced the normaliser. The masked scores must be removed before the exponentials are summed.",
      fix: "Fill masked positions with negative infinity (or a very large negative number) before calling softmax so exp of those entries is zero and the surviving weights renormalise correctly.",
    },
    {
      title: "Forgetting the sqrt(d_k) scaling",
      explanation:
        "With d_k of 64 or more the raw dot products are large, softmax saturates, and gradients through the attention weights vanish. Training stalls or the heads collapse onto single positions.",
      fix: "Always divide the score matrix by sqrt(d_k), where d_k is the per-head key dimension, not the full model dimension.",
    },
    {
      title: "Treating keys and values as the same thing",
      explanation:
        "Keys and values come from different projections on purpose. The key decides how much attention a token receives, while the value decides what is copied. Sharing one matrix for both forces the thing that matches to also be the thing that is passed on.",
      fix: "Keep Wk and Wv separate, and when reasoning about a head ask two questions: which tokens score highly, and what those tokens contribute once selected.",
    },
    {
      title: "Assuming attention is cheap for long inputs",
      explanation:
        "The weight matrix has n squared entries. Doubling the prompt length quadruples the attention work and the memory for the score matrix, which is why latency and cost scale so steeply with context.",
      fix: "Budget context length deliberately, reuse the key-value cache during generation instead of recomputing past keys and values, and use attention variants designed for long sequences when the workload needs them.",
    },
  ],
  interviewQuestions: [
    {
      question:
        "What do the query, key, and value represent in self-attention?",
      answer:
        "All three are linear projections of the same input token. The query encodes what the token is looking for, the key encodes what the token offers for matching, and the value encodes the content the token contributes to the output once it has been selected. Scores compare queries with keys, and the output mixes values.",
    },
    {
      question: "Why is the score matrix divided by sqrt(d_k)?",
      answer:
        "If the components of q and k have unit variance, their dot product has variance d_k, so scores grow with the key dimension. Large scores push softmax into a near one-hot regime with vanishing gradients. Dividing by sqrt(d_k) brings the variance back to one and keeps the weights trainable.",
      codeExample: {
        language: "python",
        code: `scores = Q @ K.T                 # variance grows with d_k
scores = scores / math.sqrt(d_k) # back to unit variance
weights = softmax(scores, axis=-1)
out = weights @ V`,
      },
    },
    {
      question: "How does the causal mask work and why is it needed?",
      answer:
        "The mask sets every score where the key position is later than the query position to negative infinity before softmax, so those weights become exactly zero. During training all positions are predicted in parallel and position i is trained to predict token i plus one. Without the mask the model could read the answer through attention. At inference the future tokens do not exist yet, so the mask keeps training and generation consistent.",
      codeExample: {
        language: "python",
        code: `n = scores.shape[-1]
future = torch.triu(torch.ones(n, n), diagonal=1).bool()
scores = scores.masked_fill(future, float("-inf"))
weights = softmax(scores, dim=-1)  # exp(-inf) == 0`,
      },
    },
    {
      question: "What does multi-head attention add over a single head?",
      answer:
        "Each head has its own projections, so different heads can learn different relevance patterns, for example one head tracking adjacent tokens and another tracking the subject of the sentence. The head outputs are concatenated and mixed by an output matrix Wo. At the same model dimension the total cost is the same as one big head, but each head works in a smaller subspace.",
    },
    {
      question:
        "What is the time and memory complexity of self-attention, and what follows from it?",
      answer:
        "Computing Q K^T for n tokens costs O(n squared d) time and the score matrix takes O(n squared) memory per head. Context length is therefore the expensive axis: doubling it quadruples the attention work. This is why generation uses a key-value cache to avoid recomputing past keys and values, and why long-context models rely on sparse, windowed, or otherwise approximate attention.",
    },
  ],
  relatedTopicIds: [
    "embeddings",
    "next-token-prediction",
    "tokenization",
    "backpropagation",
  ],
};
