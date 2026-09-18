import type { TopicTheoryContent } from "@/content/theory/types";

export const backpropagationTheory: TopicTheoryContent = {
  summary:
    "Backpropagation is the algorithm that computes how much each parameter of a neural network contributed to the loss, by applying the chain rule backward through the computation graph. Gradient descent then nudges every parameter against its gradient so the loss goes down.",
  whatItIs: [
    "A neural network is a long chain of simple operations: multiply by a weight, add a bias, apply an activation, repeat. The forward pass runs that chain on an input and ends with a loss, a single number that says how wrong the prediction was. Training means changing the weights so that number gets smaller.",
    "To change a weight sensibly you need to know which direction lowers the loss and by how much. That quantity is the gradient dL/dw, the rate at which the loss changes per unit change of the weight. Backpropagation computes every parameter's gradient in one sweep from the loss back to the inputs, reusing the values saved during the forward pass.",
    "The sweep works because of the chain rule. If the loss depends on w only through some intermediate value z, then dL/dw equals dL/dz multiplied by dz/dw. Each operation in the graph only has to know its own local derivative. Multiplying local derivatives along the path from the loss to a parameter gives the full gradient, and the partial products are shared between parameters that sit on the same path.",
    "Deep learning frameworks implement this as automatic differentiation: they record the operations of the forward pass into a graph, and each operation ships with a rule for its backward step. The same machinery that trains a two-parameter neuron trains the attention and embedding matrices of a transformer with billions of parameters. Only the size of the graph changes.",
  ],
  howItWorks: [
    "Step 1: the forward pass computes the prediction from the input and the current parameters, saving every intermediate value (pre-activations, activations, which ReLU units were active) because the backward pass will need them.",
    "Step 2: the loss function compares the prediction with the target and produces one scalar, for example the squared error (yHat - y)^2. The gradient of the loss with respect to itself is 1, which seeds the backward pass.",
    "Step 3: the backward pass visits the graph in reverse order. At each node it multiplies the gradient arriving from the node above by that node's local derivative. For yHat = w * h the local derivative with respect to w is h and with respect to h is w. For ReLU it is 1 where the input was positive and 0 elsewhere.",
    "Step 4: whenever the backward pass reaches a parameter, the accumulated product is that parameter's gradient. Gradients flowing into a non-parameter node keep travelling to the layer below, which is how the error signal reaches early layers.",
    "Step 5: once all gradients exist, gradient descent updates every parameter at once: w = w - lr * dL/dw. Subtracting moves against the gradient, which is the direction of steepest loss increase, so the loss decreases for a small enough learning rate.",
    "Step 6: the loop repeats with the new parameters. Gradients shrink as the prediction approaches the target, so steps naturally get smaller. Optimizers such as Adam and tricks such as learning rate schedules only change how the gradient is turned into a step, not how it is computed.",
  ],
  commonMistakes: [
    {
      title: "Adding the gradient instead of subtracting it",
      explanation:
        "The gradient points in the direction that increases the loss fastest. Adding it walks uphill, and the loss grows on every step even though the gradients were computed correctly.",
      fix: "Always update with w = w - lr * grad. If the loss increases on every iteration, check the sign of the update before anything else.",
    },
    {
      title: "Learning rate too large",
      explanation:
        "A gradient only describes the slope at the current point. A big step can jump past the minimum to a point where the loss is higher, and with a quadratic loss the error can even flip sign and grow every epoch.",
      fix: "Start small (0.001 to 0.1 depending on the model), watch the loss curve, and reduce the rate if the loss oscillates or explodes. Learning rate schedules and adaptive optimizers exist for this reason.",
    },
    {
      title: "Updating parameters before all gradients are computed",
      explanation:
        "Every gradient in one backward pass is a derivative at the same set of parameter values. Changing w2 before computing dL/dw1 mixes derivatives from two different points on the loss surface.",
      fix: "Compute the full backward pass first, then apply all updates. Frameworks enforce this by separating loss.backward() from optimizer.step().",
    },
    {
      title: "Forgetting that dead ReLU units block gradients",
      explanation:
        "ReLU's derivative is 0 for negative inputs. A unit whose pre-activation is negative for every training example passes zero gradient to everything upstream and never recovers.",
      fix: "Use sensible weight initialisation, moderate learning rates, and consider leaky ReLU or GELU if a large share of units stops activating.",
    },
  ],
  interviewQuestions: [
    {
      question: "What does a gradient like dL/dw actually mean?",
      answer:
        "It is the rate of change of the loss with respect to that parameter: if w increases by a tiny amount d, the loss changes by roughly dL/dw times d. A negative gradient means increasing w lowers the loss, which is why gradient descent moves in the opposite direction of the gradient.",
      codeExample: {
        language: "javascript",
        code: `const x = 2.0, y = 2.0;
let w = 0.5, b = 0.1;
const yHat = w * x + b;              // 1.1
const loss = (yHat - y) ** 2;        // 0.81
const dYHat = 2 * (yHat - y);        // -1.8
const dW = dYHat * x;                // -3.6: raising w lowers loss
const dB = dYHat;                    // -1.8`,
      },
    },
    {
      question: "How does the chain rule let backpropagation reach a weight in the first layer?",
      answer:
        "The loss depends on an early weight only through the intermediate values above it. The chain rule says the derivative along that path is the product of the local derivatives of each operation. Backpropagation computes the product incrementally from the loss backward, so by the time it reaches the first layer the incoming gradient already contains every factor from the layers above.",
      codeExample: {
        language: "javascript",
        code: `// yHat = w2 * relu(w1 * x), loss = (yHat - y) ** 2
const dYHat = 2 * (yHat - y);          // dL/dyHat
const dW2 = dYHat * h;                 // local derivative of w2 * h wrt w2 is h
const dH = dYHat * w2;                 // wrt h it is w2, passed down
const dZ = dH * (z > 0 ? 1 : 0);       // relu gate
const dW1 = dZ * x;                    // dL/dw1 = product of all factors`,
      },
    },
    {
      question: "Why do we subtract the gradient in the update, and what does the learning rate do?",
      answer:
        "The gradient is the direction of steepest increase of the loss, so subtracting a multiple of it moves toward lower loss. The learning rate scales that move. Too small and training takes many steps; too large and the step overshoots the minimum, which can make the loss oscillate or diverge.",
    },
    {
      question: "Why does the forward pass have to save intermediate values?",
      answer:
        "Local derivatives depend on the forward values. The derivative of w * h with respect to w is h, and ReLU's derivative depends on whether its input was positive. Without the saved activations the backward pass could not compute those factors. This is also why training uses far more memory than inference.",
    },
    {
      question: "How does this scale to a transformer with billions of parameters?",
      answer:
        "The mechanism is identical. Automatic differentiation records every tensor operation of the forward pass into a graph, and each operation has a known backward rule, including matrix multiplication, softmax, and layer norm. The backward pass sweeps the graph once and produces a gradient tensor for every weight matrix, and the optimizer applies the update to all of them in parallel on the GPU.",
    },
  ],
  relatedTopicIds: ["attention", "embeddings", "next-token-prediction"],
};
