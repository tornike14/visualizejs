import type {
  BackpropExample,
  BackpropStep,
  GradientEntry,
  GraphNode,
  GraphNodeStatus,
  LossPoint,
  ParameterRow,
} from "./types";

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */

type NodeSpec = [id: string, label: string, value: string | null, grad: string | null];

/** Build a graph where nodes before `activeId` are done and after are pending. */
const graph = (specs: NodeSpec[], activeId: string | null, forward = true): GraphNode[] => {
  const activeIndex = specs.findIndex(([id]) => id === activeId);
  return specs.map(([id, label, value, grad], index) => {
    let status: GraphNodeStatus = "pending";
    if (activeId === null) {
      status = value !== null ? "done" : "pending";
    } else if (index === activeIndex) {
      status = "active";
    } else if (forward ? index < activeIndex : index > activeIndex) {
      status = "done";
    }
    return { id, label, value, grad, status };
  });
};

const grad = (
  id: string,
  label: string,
  formula: string,
  display: string,
  active = false,
): GradientEntry => ({ id, label, formula, display, active });

const param = (
  name: string,
  value: string,
  gradValue: string | null = null,
  next: string | null = null,
  active = false,
): ParameterRow => ({ id: name, name, value, grad: gradValue, next, active });

const loss = (
  id: string,
  label: string,
  ratio: number,
  display: string,
  active = false,
  overshoot = false,
): LossPoint => ({ id, label, ratio, display, active, overshoot });

/* ------------------------------------------------------------------ */
/* Example 1: single neuron                                            */
/* x = 2.0, w = 0.5, b = 0.1, y = 2.0, lr = 0.1                        */
/* yhat = 1.1, L = 0.81, dL/dyhat = -1.8, dL/dw = -3.6, dL/db = -1.8   */
/* w' = 0.86, b' = 0.28, yhat' = 2.0, L' = 0                           */
/* ------------------------------------------------------------------ */

const NEURON_CODE = [
  { num: 1, text: "const x = 2.0, y = 2.0;" },
  { num: 2, text: "let w = 0.5, b = 0.1;" },
  { num: 3, text: "const lr = 0.1;" },
  { num: 4, text: "const forward = () => w * x + b;" },
  { num: 5, text: "let yHat = forward();" },
  { num: 6, text: "let loss = (yHat - y) ** 2;" },
  { num: 7, text: "// backward pass: chain rule" },
  { num: 8, text: "const dYHat = 2 * (yHat - y);" },
  { num: 9, text: "const dW = dYHat * x;" },
  { num: 10, text: "const dB = dYHat * 1;" },
  { num: 11, text: "// gradient descent step" },
  { num: 12, text: "w = w - lr * dW;" },
  { num: 13, text: "b = b - lr * dB;" },
  { num: 14, text: "yHat = forward();" },
  { num: 15, text: "loss = (yHat - y) ** 2;" },
];

const n1 = (
  wx: string | null,
  yhat: string | null,
  l: string | null,
  grads: [wx: string | null, yhat: string | null, l: string | null] = [null, null, null],
): NodeSpec[] => [
  ["x", "x", "2.0", null],
  ["wx", "w * x", wx, grads[0]],
  ["yhat", "+ b", yhat, grads[1]],
  ["loss", "loss", l, grads[2]],
];

const NEURON_STEPS: BackpropStep[] = [
  {
    descriptionHtml:
      "One neuron with a single input <code>x = 2.0</code>, weight <code>w = 0.5</code>, bias <code>b = 0.1</code>, and a target <code>y = 2.0</code>. Training means adjusting <code>w</code> and <code>b</code> so the prediction moves toward the target.",
    activeLine: 2,
    doneLines: [1],
    phase: "idle",
    graph: graph(n1(null, null, null), null),
    gradients: [],
    parameters: [param("w", "0.5"), param("b", "0.1")],
    lossHistory: [],
  },
  {
    descriptionHtml:
      '<span class="hl-api">Forward pass</span> starts: the first node multiplies the input by the weight, <code>w * x = 0.5 * 2.0 = 1.0</code>. Every intermediate value is kept, because the backward pass will need it.',
    activeLine: 4,
    doneLines: [1, 2, 3],
    phase: "forward",
    graph: graph(n1("1.0", null, null), "wx"),
    gradients: [],
    parameters: [param("w", "0.5"), param("b", "0.1")],
    lossHistory: [],
  },
  {
    descriptionHtml:
      'Adding the bias gives the prediction <code>yHat = 1.0 + 0.1 = 1.1</code>. The target is <code>2.0</code>, so the neuron is <span class="hl-stack">under-predicting</span> by 0.9.',
    activeLine: 5,
    doneLines: [1, 2, 3, 4],
    phase: "forward",
    graph: graph(n1("1.0", "1.1", null), "yhat"),
    gradients: [],
    parameters: [param("w", "0.5"), param("b", "0.1")],
    lossHistory: [],
  },
  {
    descriptionHtml:
      "The squared error loss scores the prediction: <code>(1.1 - 2.0)^2 = 0.81</code>. The loss is a single number, and the whole point of backpropagation is to find out how each parameter contributed to it.",
    activeLine: 6,
    doneLines: [1, 2, 3, 4, 5],
    phase: "forward",
    graph: graph(n1("1.0", "1.1", "0.81"), "loss"),
    gradients: [],
    parameters: [param("w", "0.5"), param("b", "0.1")],
    lossHistory: [loss("before", "before", 1, "0.81", true)],
  },
  {
    descriptionHtml:
      '<span class="hl-micro">Backward pass</span> starts at the loss. The derivative of <code>(yHat - y)^2</code> with respect to <code>yHat</code> is <code>2 * (yHat - y) = -1.8</code>. A gradient is a rate: raising <code>yHat</code> by a tiny amount would lower the loss by 1.8 times that amount.',
    activeLine: 8,
    doneLines: [1, 2, 3, 4, 5, 6],
    phase: "backward",
    graph: graph(n1("1.0", "1.1", "0.81", [null, "-1.8", "1"]), "yhat", false),
    gradients: [grad("dyhat", "dL/dyHat", "2 * (1.1 - 2.0)", "-1.8", true)],
    parameters: [param("w", "0.5"), param("b", "0.1")],
    lossHistory: [loss("before", "before", 1, "0.81")],
  },
  {
    descriptionHtml:
      'The <span class="hl-micro">chain rule</span> moves the gradient one node back: <code>yHat</code> depends on <code>w</code> through <code>w * x</code>, and the local derivative of <code>w * x</code> with respect to <code>w</code> is <code>x</code>. So <code>dL/dw = dL/dyHat * x = -1.8 * 2.0 = -3.6</code>.',
    activeLine: 9,
    doneLines: [1, 2, 3, 4, 5, 6, 8],
    phase: "backward",
    graph: graph(n1("1.0", "1.1", "0.81", ["-1.8", "-1.8", "1"]), "wx", false),
    gradients: [
      grad("dyhat", "dL/dyHat", "2 * (1.1 - 2.0)", "-1.8"),
      grad("dw", "dL/dw", "dL/dyHat * x = -1.8 * 2.0", "-3.6", true),
    ],
    parameters: [param("w", "0.5", "-3.6", null, true), param("b", "0.1")],
    lossHistory: [loss("before", "before", 1, "0.81")],
  },
  {
    descriptionHtml:
      "The bias enters through <code>+ b</code>, whose local derivative is 1, so <code>dL/db = -1.8 * 1 = -1.8</code>. Both gradients are negative: increasing either parameter would reduce the loss, which matches the neuron under-predicting.",
    activeLine: 10,
    doneLines: [1, 2, 3, 4, 5, 6, 8, 9],
    phase: "backward",
    graph: graph(n1("1.0", "1.1", "0.81", ["-1.8", "-1.8", "1"]), "x", false),
    gradients: [
      grad("dyhat", "dL/dyHat", "2 * (1.1 - 2.0)", "-1.8"),
      grad("dw", "dL/dw", "dL/dyHat * x = -1.8 * 2.0", "-3.6"),
      grad("db", "dL/db", "dL/dyHat * 1 = -1.8 * 1", "-1.8", true),
    ],
    parameters: [param("w", "0.5", "-3.6"), param("b", "0.1", "-1.8", null, true)],
    lossHistory: [loss("before", "before", 1, "0.81")],
  },
  {
    descriptionHtml:
      '<span class="hl-task">Gradient descent</span> subtracts the gradient scaled by the learning rate. The gradient points uphill on the loss surface, so moving against it lowers the loss: <code>w = 0.5 - 0.1 * (-3.6) = 0.86</code>.',
    activeLine: 12,
    doneLines: [1, 2, 3, 4, 5, 6, 8, 9, 10],
    phase: "update",
    graph: graph(n1("1.0", "1.1", "0.81", ["-1.8", "-1.8", "1"]), null),
    gradients: [
      grad("dyhat", "dL/dyHat", "2 * (1.1 - 2.0)", "-1.8"),
      grad("dw", "dL/dw", "dL/dyHat * x = -1.8 * 2.0", "-3.6"),
      grad("db", "dL/db", "dL/dyHat * 1 = -1.8 * 1", "-1.8"),
    ],
    parameters: [param("w", "0.5", "-3.6", "0.86", true), param("b", "0.1", "-1.8")],
    lossHistory: [loss("before", "before", 1, "0.81")],
  },
  {
    descriptionHtml:
      "Same rule for the bias: <code>b = 0.1 - 0.1 * (-1.8) = 0.28</code>. The learning rate 0.1 controls how far each step goes. Too small and training crawls, too large and the step can overshoot the minimum.",
    activeLine: 13,
    doneLines: [1, 2, 3, 4, 5, 6, 8, 9, 10, 12],
    phase: "update",
    graph: graph(n1("1.0", "1.1", "0.81", ["-1.8", "-1.8", "1"]), null),
    gradients: [
      grad("dyhat", "dL/dyHat", "2 * (1.1 - 2.0)", "-1.8"),
      grad("dw", "dL/dw", "dL/dyHat * x = -1.8 * 2.0", "-3.6"),
      grad("db", "dL/db", "dL/dyHat * 1 = -1.8 * 1", "-1.8"),
    ],
    parameters: [param("w", "0.5", "-3.6", "0.86"), param("b", "0.1", "-1.8", "0.28", true)],
    lossHistory: [loss("before", "before", 1, "0.81")],
  },
  {
    descriptionHtml:
      'A second <span class="hl-api">forward pass</span> with the updated parameters: <code>0.86 * 2.0 + 0.28 = 2.0</code>. The prediction now equals the target. Old gradients are discarded, a new backward pass would recompute them from scratch.',
    activeLine: 14,
    doneLines: [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 13],
    phase: "forward",
    graph: graph(n1("1.72", "2.0", null), "yhat"),
    gradients: [],
    parameters: [param("w", "0.86"), param("b", "0.28")],
    lossHistory: [loss("before", "before", 1, "0.81")],
  },
  {
    descriptionHtml:
      "The loss drops from <code>0.81</code> to <code>0</code>. Landing exactly on the target in one step is a coincidence of this tiny quadratic problem and <code>lr = 0.1</code>. Real networks repeat this loop millions of times over billions of parameters, with automatic differentiation building the backward pass from the forward code.",
    activeLine: 15,
    doneLines: [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 13, 14],
    phase: "forward",
    graph: graph(n1("1.72", "2.0", "0"), "loss"),
    gradients: [],
    parameters: [param("w", "0.86"), param("b", "0.28")],
    lossHistory: [loss("before", "before", 1, "0.81"), loss("after", "after", 0, "0", true)],
  },
];

/* ------------------------------------------------------------------ */
/* Example 2: two-layer chain rule                                     */
/* x = 1.0, w1 = 0.8, w2 = 0.5, y = 1.0, lr = 0.1                      */
/* z = 0.8, h = relu(0.8) = 0.8, yhat = 0.4, L = 0.36                  */
/* dL/dyhat = -1.2, dL/dw2 = -0.96, dL/dh = -0.6, dL/dz = -0.6,        */
/* dL/dw1 = -0.6, w2' = 0.596, w1' = 0.86                              */
/* yhat' = 0.596 * 0.86 = 0.51256, L' = 0.48744^2 = 0.2376 -> 0.238    */
/* ------------------------------------------------------------------ */

const CHAIN_CODE = [
  { num: 1, text: "const x = 1.0, y = 1.0;" },
  { num: 2, text: "let w1 = 0.8, w2 = 0.5;" },
  { num: 3, text: "const lr = 0.1;" },
  { num: 4, text: "const relu = (v) => Math.max(0, v);" },
  { num: 5, text: "const z = w1 * x;" },
  { num: 6, text: "const h = relu(z);" },
  { num: 7, text: "const yHat = w2 * h;" },
  { num: 8, text: "let loss = (yHat - y) ** 2;" },
  { num: 9, text: "// backward: multiply local derivatives" },
  { num: 10, text: "const dYHat = 2 * (yHat - y);" },
  { num: 11, text: "const dW2 = dYHat * h;" },
  { num: 12, text: "const dH = dYHat * w2;" },
  { num: 13, text: "const dZ = dH * (z > 0 ? 1 : 0);" },
  { num: 14, text: "const dW1 = dZ * x;" },
  { num: 15, text: "w2 = w2 - lr * dW2;" },
  { num: 16, text: "w1 = w1 - lr * dW1;" },
  { num: 17, text: "loss = (w2 * relu(w1 * x) - y) ** 2;" },
];

const n2 = (
  values: [z: string | null, h: string | null, yhat: string | null, l: string | null],
  grads: [z: string | null, h: string | null, yhat: string | null, l: string | null] = [null, null, null, null],
): NodeSpec[] => [
  ["x", "x", "1.0", null],
  ["z", "w1 * x", values[0], grads[0]],
  ["h", "relu", values[1], grads[1]],
  ["yhat", "w2 * h", values[2], grads[2]],
  ["loss", "loss", values[3], grads[3]],
];

const CHAIN_PARAMS_INITIAL = [param("w1", "0.8"), param("w2", "0.5")];
const CHAIN_LOSS_BEFORE = loss("before", "before", 1, "0.36");
const CHAIN_G_YHAT = grad("dyhat", "dL/dyHat", "2 * (0.4 - 1.0)", "-1.2");
const CHAIN_G_W2 = grad("dw2", "dL/dw2", "dL/dyHat * h = -1.2 * 0.8", "-0.96");
const CHAIN_G_H = grad("dh", "dL/dh", "dL/dyHat * w2 = -1.2 * 0.5", "-0.6");
const CHAIN_G_Z = grad("dz", "dL/dz", "dL/dh * relu'(z) = -0.6 * 1", "-0.6");
const CHAIN_G_W1 = grad("dw1", "dL/dw1", "dL/dz * x = -0.6 * 1.0", "-0.6");
const CHAIN_FULL_GRADS = ["-0.6", "-0.6", "-1.2", "1"] as [string, string, string, string];

const CHAIN_STEPS: BackpropStep[] = [
  {
    descriptionHtml:
      "Two layers: the input passes through weight <code>w1</code>, a ReLU activation, then weight <code>w2</code>. The loss now sits two multiplications away from <code>w1</code>, which is exactly the case the chain rule handles.",
    activeLine: 2,
    doneLines: [1],
    phase: "idle",
    graph: graph(n2([null, null, null, null]), null),
    gradients: [],
    parameters: CHAIN_PARAMS_INITIAL,
    lossHistory: [],
  },
  {
    descriptionHtml:
      '<span class="hl-api">Forward pass</span>, layer one: the pre-activation is <code>z = w1 * x = 0.8 * 1.0 = 0.8</code>.',
    activeLine: 5,
    doneLines: [1, 2, 3, 4],
    phase: "forward",
    graph: graph(n2(["0.8", null, null, null]), "z"),
    gradients: [],
    parameters: CHAIN_PARAMS_INITIAL,
    lossHistory: [],
  },
  {
    descriptionHtml:
      "ReLU keeps positive values and zeroes negative ones. Since <code>z = 0.8 &gt; 0</code>, the hidden activation is <code>h = 0.8</code>. The forward pass records that this unit was active, because the backward pass needs to know whether the gate was open.",
    activeLine: 6,
    doneLines: [1, 2, 3, 4, 5],
    phase: "forward",
    graph: graph(n2(["0.8", "0.8", null, null]), "h"),
    gradients: [],
    parameters: CHAIN_PARAMS_INITIAL,
    lossHistory: [],
  },
  {
    descriptionHtml:
      "Layer two produces the prediction <code>yHat = w2 * h = 0.5 * 0.8 = 0.4</code> against a target of <code>1.0</code>.",
    activeLine: 7,
    doneLines: [1, 2, 3, 4, 5, 6],
    phase: "forward",
    graph: graph(n2(["0.8", "0.8", "0.4", null]), "yhat"),
    gradients: [],
    parameters: CHAIN_PARAMS_INITIAL,
    lossHistory: [],
  },
  {
    descriptionHtml:
      "Squared error: <code>(0.4 - 1.0)^2 = 0.36</code>. Now the question is how much of that 0.36 traces back to <code>w2</code> and how much to <code>w1</code>, which is upstream of two other operations.",
    activeLine: 8,
    doneLines: [1, 2, 3, 4, 5, 6, 7],
    phase: "forward",
    graph: graph(n2(["0.8", "0.8", "0.4", "0.36"]), "loss"),
    gradients: [],
    parameters: CHAIN_PARAMS_INITIAL,
    lossHistory: [loss("before", "before", 1, "0.36", true)],
  },
  {
    descriptionHtml:
      '<span class="hl-micro">Backward pass</span> begins at the output: <code>dL/dyHat = 2 * (0.4 - 1.0) = -1.2</code>. Negative means the loss falls when the prediction rises.',
    activeLine: 10,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
    phase: "backward",
    graph: graph(n2(["0.8", "0.8", "0.4", "0.36"], [null, null, "-1.2", "1"]), "yhat", false),
    gradients: [{ ...CHAIN_G_YHAT, active: true }],
    parameters: CHAIN_PARAMS_INITIAL,
    lossHistory: [CHAIN_LOSS_BEFORE],
  },
  {
    descriptionHtml:
      "<code>yHat = w2 * h</code> has two inputs. With respect to <code>w2</code> the local derivative is <code>h</code>, so <code>dL/dw2 = -1.2 * 0.8 = -0.96</code>. That is the first parameter gradient.",
    activeLine: 11,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10],
    phase: "backward",
    graph: graph(n2(["0.8", "0.8", "0.4", "0.36"], [null, null, "-1.2", "1"]), "yhat", false),
    gradients: [CHAIN_G_YHAT, { ...CHAIN_G_W2, active: true }],
    parameters: [param("w1", "0.8"), param("w2", "0.5", "-0.96", null, true)],
    lossHistory: [CHAIN_LOSS_BEFORE],
  },
  {
    descriptionHtml:
      'With respect to the other input <code>h</code> the local derivative is <code>w2</code>, so <code>dL/dh = -1.2 * 0.5 = -0.6</code>. This gradient does not update anything itself, it is the <span class="hl-micro">signal passed back</span> to the layer below.',
    activeLine: 12,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
    phase: "backward",
    graph: graph(n2(["0.8", "0.8", "0.4", "0.36"], [null, "-0.6", "-1.2", "1"]), "h", false),
    gradients: [CHAIN_G_YHAT, CHAIN_G_W2, { ...CHAIN_G_H, active: true }],
    parameters: [param("w1", "0.8"), param("w2", "0.5", "-0.96")],
    lossHistory: [CHAIN_LOSS_BEFORE],
  },
  {
    descriptionHtml:
      "ReLU's derivative is 1 where the input was positive and 0 elsewhere. The forward pass saw <code>z = 0.8 &gt; 0</code>, so the gate is open and the gradient passes through unchanged: <code>dL/dz = -0.6 * 1 = -0.6</code>. Had <code>z</code> been negative, everything upstream would receive zero.",
    activeLine: 13,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12],
    phase: "backward",
    graph: graph(n2(["0.8", "0.8", "0.4", "0.36"], ["-0.6", "-0.6", "-1.2", "1"]), "z", false),
    gradients: [CHAIN_G_YHAT, CHAIN_G_W2, CHAIN_G_H, { ...CHAIN_G_Z, active: true }],
    parameters: [param("w1", "0.8"), param("w2", "0.5", "-0.96")],
    lossHistory: [CHAIN_LOSS_BEFORE],
  },
  {
    descriptionHtml:
      'Finally <code>z = w1 * x</code>, whose local derivative with respect to <code>w1</code> is <code>x</code>: <code>dL/dw1 = -0.6 * 1.0 = -0.6</code>. Written out, the whole chain is <code>dL/dw1 = dL/dyHat * dyHat/dh * dh/dz * dz/dw1 = (-1.2)(0.5)(1)(1.0)</code>. <span class="hl-micro">Backpropagation</span> is this product, computed one factor at a time from the loss backward.',
    activeLine: 14,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
    phase: "backward",
    graph: graph(n2(["0.8", "0.8", "0.4", "0.36"], CHAIN_FULL_GRADS), "x", false),
    gradients: [CHAIN_G_YHAT, CHAIN_G_W2, CHAIN_G_H, CHAIN_G_Z, { ...CHAIN_G_W1, active: true }],
    parameters: [param("w1", "0.8", "-0.6", null, true), param("w2", "0.5", "-0.96")],
    lossHistory: [CHAIN_LOSS_BEFORE],
  },
  {
    descriptionHtml:
      '<span class="hl-task">Update</span> the output weight first: <code>w2 = 0.5 - 0.1 * (-0.96) = 0.596</code>. Each parameter moves by its own gradient, so the layer that contributed more to the error moves more.',
    activeLine: 15,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14],
    phase: "update",
    graph: graph(n2(["0.8", "0.8", "0.4", "0.36"], CHAIN_FULL_GRADS), null),
    gradients: [CHAIN_G_YHAT, CHAIN_G_W2, CHAIN_G_H, CHAIN_G_Z, CHAIN_G_W1],
    parameters: [param("w1", "0.8", "-0.6"), param("w2", "0.5", "-0.96", "0.596", true)],
    lossHistory: [CHAIN_LOSS_BEFORE],
  },
  {
    descriptionHtml:
      "Then the hidden weight: <code>w1 = 0.8 - 0.1 * (-0.6) = 0.86</code>. Both updates use gradients computed against the same old parameters, which is why all gradients are collected before any parameter changes.",
    activeLine: 16,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15],
    phase: "update",
    graph: graph(n2(["0.8", "0.8", "0.4", "0.36"], CHAIN_FULL_GRADS), null),
    gradients: [CHAIN_G_YHAT, CHAIN_G_W2, CHAIN_G_H, CHAIN_G_Z, CHAIN_G_W1],
    parameters: [param("w1", "0.8", "-0.6", "0.86", true), param("w2", "0.5", "-0.96", "0.596")],
    lossHistory: [CHAIN_LOSS_BEFORE],
  },
  {
    descriptionHtml:
      'Next <span class="hl-api">forward pass</span>: <code>z = 0.86</code>, <code>h = 0.86</code>, <code>yHat = 0.596 * 0.86 = 0.51256</code>, loss <code>(0.51256 - 1.0)^2 = 0.238</code>, down from 0.36. Not zero this time, so training would repeat the loop. The transformer weights in the attention and embedding topics are trained by exactly this procedure.',
    activeLine: 17,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16],
    phase: "forward",
    graph: graph(n2(["0.86", "0.86", "0.513", "0.238"]), "loss"),
    gradients: [],
    parameters: [param("w1", "0.86"), param("w2", "0.596")],
    lossHistory: [CHAIN_LOSS_BEFORE, loss("after", "after", 0.238 / 0.36, "0.238", true)],
  },
];

/* ------------------------------------------------------------------ */
/* Example 3: training loop                                            */
/* Same neuron as example 1, lr = 0.05. With x = 2 the update is       */
/* yhat' = yhat - lr * (2e * x^2 + 2e) = yhat - 10 * lr * e, so the    */
/* error e = yhat - y is multiplied by (1 - 10 * lr) each epoch:       */
/* 0.5 at lr 0.05, 0 at lr 0.1, -9 at lr 1.0.                          */
/* epoch: w, b, yhat, e, loss, dw = 4e, db = 2e                        */
/* 1: 0.5, 0.1, 1.1, -0.9, 0.81, -3.6, -1.8                            */
/* 2: 0.68, 0.19, 1.55, -0.45, 0.2025, -1.8, -0.9                      */
/* 3: 0.77, 0.235, 1.775, -0.225, 0.050625, -0.9, -0.45                */
/* 4: 0.815, 0.2575, 1.8875, -0.1125, 0.01265625, -0.45, -0.225        */
/* after 4: 0.8375, 0.26875, 1.94375, -0.05625, 0.0031640625           */
/* lr = 1.0 from epoch 1: w = 4.1, b = 1.9, yhat = 10.1, loss = 65.61  */
/* ------------------------------------------------------------------ */

const LOOP_CODE = [
  { num: 1, text: "const x = 2.0, y = 2.0;" },
  { num: 2, text: "let w = 0.5, b = 0.1;" },
  { num: 3, text: "const lr = 0.05;" },
  { num: 4, text: "for (let epoch = 1; epoch <= 4; epoch++) {" },
  { num: 5, text: "  const yHat = w * x + b;" },
  { num: 6, text: "  const loss = (yHat - y) ** 2;" },
  { num: 7, text: "  const dYHat = 2 * (yHat - y);" },
  { num: 8, text: "  const dW = dYHat * x;" },
  { num: 9, text: "  const dB = dYHat;" },
  { num: 10, text: "  w = w - lr * dW;" },
  { num: 11, text: "  b = b - lr * dB;" },
  { num: 12, text: "}" },
  { num: 13, text: "// same first step with lr = 1.0" },
  { num: 14, text: "const wBig = 0.5 - 1.0 * -3.6;" },
  { num: 15, text: "const bBig = 0.1 - 1.0 * -1.8;" },
  { num: 16, text: "const lossBig = (wBig * x + bBig - y) ** 2;" },
];

const LOOP_MAX = 0.81;
const loopLoss = (epoch: number, value: number, display: string, active = false) =>
  loss(`e${epoch}`, `epoch ${epoch}`, value / LOOP_MAX, display, active);

const LOOP_L1 = loopLoss(1, 0.81, "0.810");
const LOOP_L2 = loopLoss(2, 0.2025, "0.203");
const LOOP_L3 = loopLoss(3, 0.050625, "0.051");
const LOOP_L4 = loopLoss(4, 0.01265625, "0.013");
const LOOP_L5 = loss("e5", "after 4", 0.0031640625 / LOOP_MAX, "0.003");
const LOOP_BIG = loss("big", "lr = 1.0", 1, "65.61", true, true);

const loopGraph = (wx: string, yhat: string, l: string | null, dyhat: string | null, active: string | null, forward = true) =>
  graph(n1(wx, yhat, l, dyhat ? [dyhat, dyhat, "1"] : [null, null, null]), active, forward);

const loopGrads = (e: string, dyhat: string, dw: string, db: string): GradientEntry[] => [
  grad("dyhat", "dL/dyHat", `2 * (${e})`, dyhat),
  grad("dw", "dL/dw", `${dyhat} * 2.0`, dw, true),
  grad("db", "dL/db", `${dyhat} * 1`, db, true),
];

const FORWARD_DONE = [1, 2, 3, 4, 5];
const UPDATE_DONE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const LOOP_STEPS: BackpropStep[] = [
  {
    descriptionHtml:
      "The same neuron as the first example, but with a smaller learning rate of <code>0.05</code> and four passes over the data. Each pass is one forward, one backward, one update, and the loss should shrink every time.",
    activeLine: 3,
    doneLines: [1, 2],
    phase: "idle",
    graph: graph(n1(null, null, null), null),
    gradients: [],
    parameters: [param("w", "0.5"), param("b", "0.1")],
    lossHistory: [],
  },
  {
    descriptionHtml:
      '<strong>Epoch 1</strong> <span class="hl-api">forward</span>: <code>yHat = 0.5 * 2.0 + 0.1 = 1.1</code>, loss <code>(1.1 - 2.0)^2 = 0.81</code>. The error is <code>-0.9</code>.',
    activeLine: 6,
    doneLines: FORWARD_DONE,
    phase: "forward",
    graph: loopGraph("1.0", "1.1", "0.81", null, "loss"),
    gradients: [],
    parameters: [param("w", "0.5"), param("b", "0.1")],
    lossHistory: [{ ...LOOP_L1, active: true }],
  },
  {
    descriptionHtml:
      '<strong>Epoch 1</strong> <span class="hl-micro">backward</span>: <code>dL/dyHat = -1.8</code>, <code>dL/dw = -1.8 * 2.0 = -3.6</code>, <code>dL/db = -1.8</code>. Same numbers as the single neuron example, because nothing has changed yet.',
    activeLine: 9,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
    phase: "backward",
    graph: loopGraph("1.0", "1.1", "0.81", "-1.8", "x", false),
    gradients: loopGrads("1.1 - 2.0", "-1.8", "-3.6", "-1.8"),
    parameters: [param("w", "0.5", "-3.6"), param("b", "0.1", "-1.8")],
    lossHistory: [LOOP_L1],
  },
  {
    descriptionHtml:
      '<strong>Epoch 1</strong> <span class="hl-task">update</span> with <code>lr = 0.05</code>: <code>w = 0.5 + 0.18 = 0.68</code>, <code>b = 0.1 + 0.09 = 0.19</code>. Half the step size of the first example, so this lands half way to the target instead of on it.',
    activeLine: 11,
    doneLines: UPDATE_DONE,
    phase: "update",
    graph: loopGraph("1.0", "1.1", "0.81", "-1.8", null),
    gradients: loopGrads("1.1 - 2.0", "-1.8", "-3.6", "-1.8"),
    parameters: [param("w", "0.5", "-3.6", "0.68", true), param("b", "0.1", "-1.8", "0.19", true)],
    lossHistory: [LOOP_L1],
  },
  {
    descriptionHtml:
      '<strong>Epoch 2</strong> <span class="hl-api">forward</span> with the new parameters: <code>yHat = 0.68 * 2.0 + 0.19 = 1.55</code>, loss <code>(-0.45)^2 = 0.2025</code>. The error halved, so the squared loss dropped to a quarter.',
    activeLine: 6,
    doneLines: FORWARD_DONE,
    phase: "forward",
    graph: loopGraph("1.36", "1.55", "0.2025", null, "loss"),
    gradients: [],
    parameters: [param("w", "0.68"), param("b", "0.19")],
    lossHistory: [LOOP_L1, { ...LOOP_L2, active: true }],
  },
  {
    descriptionHtml:
      '<strong>Epoch 2</strong> <span class="hl-micro">backward</span>: <code>dL/dyHat = 2 * (-0.45) = -0.9</code>, <code>dL/dw = -1.8</code>, <code>dL/db = -0.9</code>. Gradients shrink with the error, so steps get smaller as the loss approaches its minimum without changing the learning rate.',
    activeLine: 9,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
    phase: "backward",
    graph: loopGraph("1.36", "1.55", "0.2025", "-0.9", "x", false),
    gradients: loopGrads("1.55 - 2.0", "-0.9", "-1.8", "-0.9"),
    parameters: [param("w", "0.68", "-1.8"), param("b", "0.19", "-0.9")],
    lossHistory: [LOOP_L1, LOOP_L2],
  },
  {
    descriptionHtml:
      '<strong>Epoch 2</strong> <span class="hl-task">update</span>: <code>w = 0.68 + 0.09 = 0.77</code>, <code>b = 0.19 + 0.045 = 0.235</code>.',
    activeLine: 11,
    doneLines: UPDATE_DONE,
    phase: "update",
    graph: loopGraph("1.36", "1.55", "0.2025", "-0.9", null),
    gradients: loopGrads("1.55 - 2.0", "-0.9", "-1.8", "-0.9"),
    parameters: [param("w", "0.68", "-1.8", "0.77", true), param("b", "0.19", "-0.9", "0.235", true)],
    lossHistory: [LOOP_L1, LOOP_L2],
  },
  {
    descriptionHtml:
      '<strong>Epoch 3</strong> <span class="hl-api">forward</span>: <code>yHat = 0.77 * 2.0 + 0.235 = 1.775</code>, loss <code>(-0.225)^2 = 0.050625</code>.',
    activeLine: 6,
    doneLines: FORWARD_DONE,
    phase: "forward",
    graph: loopGraph("1.54", "1.775", "0.051", null, "loss"),
    gradients: [],
    parameters: [param("w", "0.77"), param("b", "0.235")],
    lossHistory: [LOOP_L1, LOOP_L2, { ...LOOP_L3, active: true }],
  },
  {
    descriptionHtml:
      '<strong>Epoch 3</strong> backward and update: <code>dL/dyHat = -0.45</code>, <code>dL/dw = -0.9</code>, <code>dL/db = -0.45</code>, giving <code>w = 0.815</code> and <code>b = 0.2575</code>.',
    activeLine: 11,
    doneLines: UPDATE_DONE,
    phase: "update",
    graph: loopGraph("1.54", "1.775", "0.051", "-0.45", null),
    gradients: loopGrads("1.775 - 2.0", "-0.45", "-0.9", "-0.45"),
    parameters: [param("w", "0.77", "-0.9", "0.815", true), param("b", "0.235", "-0.45", "0.2575", true)],
    lossHistory: [LOOP_L1, LOOP_L2, LOOP_L3],
  },
  {
    descriptionHtml:
      '<strong>Epoch 4</strong> <span class="hl-api">forward</span>: <code>yHat = 0.815 * 2.0 + 0.2575 = 1.8875</code>, loss <code>(-0.1125)^2 = 0.0127</code>. Four epochs took the loss from 0.81 to about 0.013, a 64x reduction.',
    activeLine: 6,
    doneLines: FORWARD_DONE,
    phase: "forward",
    graph: loopGraph("1.63", "1.8875", "0.013", null, "loss"),
    gradients: [],
    parameters: [param("w", "0.815"), param("b", "0.2575")],
    lossHistory: [LOOP_L1, LOOP_L2, LOOP_L3, { ...LOOP_L4, active: true }],
  },
  {
    descriptionHtml:
      '<strong>Epoch 4</strong> backward and update: <code>dL/dw = -0.45</code>, <code>dL/db = -0.225</code>, so <code>w = 0.8375</code> and <code>b = 0.26875</code>. A fifth forward pass would give <code>yHat = 1.94375</code> and loss <code>0.0032</code>. For this neuron each epoch multiplies the error by <code>1 - 10 * lr</code>, which is 0.5 here.',
    activeLine: 11,
    doneLines: UPDATE_DONE,
    phase: "update",
    graph: loopGraph("1.63", "1.8875", "0.013", "-0.225", null),
    gradients: loopGrads("1.8875 - 2.0", "-0.225", "-0.45", "-0.225"),
    parameters: [param("w", "0.815", "-0.45", "0.8375", true), param("b", "0.2575", "-0.225", "0.26875", true)],
    lossHistory: [LOOP_L1, LOOP_L2, LOOP_L3, LOOP_L4, { ...LOOP_L5, active: true }],
  },
  {
    descriptionHtml:
      'What if the learning rate were <code>1.0</code>? Take the epoch 1 gradients again: <code>w = 0.5 - 1.0 * (-3.6) = 4.1</code>, <code>b = 0.1 - 1.0 * (-1.8) = 1.9</code>. The direction is still correct, but the step is <span class="hl-stack">far too long</span>.',
    activeLine: 15,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14],
    phase: "update",
    graph: loopGraph("1.0", "1.1", "0.81", "-1.8", null),
    gradients: loopGrads("1.1 - 2.0", "-1.8", "-3.6", "-1.8"),
    parameters: [param("w", "0.5", "-3.6", "4.1", true), param("b", "0.1", "-1.8", "1.9", true)],
    lossHistory: [LOOP_L1, LOOP_L2, LOOP_L3, LOOP_L4, LOOP_L5],
  },
  {
    descriptionHtml:
      'The overshoot: <code>yHat = 4.1 * 2.0 + 1.9 = 10.1</code>, loss <code>(8.1)^2 = 65.61</code>, up from 0.81. The error is now multiplied by <code>1 - 10 * 1.0 = -9</code> each epoch, so it flips sign and grows without bound. This is why the learning rate is the first hyperparameter anyone tunes.',
    activeLine: 16,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15],
    phase: "forward",
    graph: loopGraph("8.2", "10.1", "65.61", null, "loss"),
    gradients: [],
    parameters: [param("w", "4.1"), param("b", "1.9")],
    lossHistory: [LOOP_L1, LOOP_L2, LOOP_L3, LOOP_L4, LOOP_L5, LOOP_BIG],
  },
];

/* ------------------------------------------------------------------ */

export const EXAMPLES: BackpropExample[] = [
  {
    id: "neuron",
    title: "Single neuron",
    description:
      "Forward pass, loss, two gradients, and one gradient descent step on a neuron with one weight and one bias.",
    kind: "neuron",
    codeLines: NEURON_CODE,
    steps: NEURON_STEPS,
  },
  {
    id: "chain",
    title: "Two-layer chain rule",
    description:
      "A hidden ReLU unit between two weights shows how gradients multiply through each local derivative on the way back.",
    kind: "chain",
    codeLines: CHAIN_CODE,
    steps: CHAIN_STEPS,
  },
  {
    id: "loop",
    title: "Training loop",
    description:
      "Four epochs of gradient descent with a small learning rate, then one step with a learning rate that overshoots.",
    kind: "loop",
    codeLines: LOOP_CODE,
    steps: LOOP_STEPS,
  },
];
