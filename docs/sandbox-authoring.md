# Sandbox Authoring Guide

How to add interactive sandbox mode to a visualization topic. Users type code in a CodeMirror editor, press Generate, and the visualization updates based on their code.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Step 1 - Create the Generator](#step-1--create-the-generator)
4. [Step 2 - Register the Config](#step-2--register-the-config)
5. [Step 3 - Wire Into the Visualization](#step-3--wire-into-the-visualization)
6. [Shared Utilities](#shared-utilities)
7. [Editor Features](#editor-features)
8. [Error Handling](#error-handling)
9. [Security Model](#security-model)
10. [Checklist](#checklist)

---

## Architecture Overview

```
User types code in CodeMirror editor
         |
         v
  [Cmd+Enter] or [Generate button]
         |
         v
  parseUserCode(source)          <-- Acorn parser (shared, topic-agnostic)
         |
         v
  generator(ast, source)         <-- YOUR topic-specific function
         |
         v
  { steps[], codeLines[] }       <-- Same shape as your hardcoded STEPS
         |
         v
  useStepPlayback(steps)         <-- Existing playback engine
         |
         v
  Visualization renders          <-- Same panels, same animations
```

The sandbox never executes user code. It parses the AST with Acorn and walks the tree to simulate behavior and generate step objects. This means it is safe by design (no `eval`, no `Function()`, CSP blocks `unsafe-eval` in production).

---

## File Structure

```
src/
  types/
    sandbox.ts                        # Shared types (SandboxConfig, StepGenerator, etc.)
  lib/sandbox/
    parser.ts                         # Acorn parser wrapper (shared)
    configs.ts                        # Config registry (add your topic here)
    generatorUtils.ts                 # Shared helpers (getLineRange, extractCallbackBody, etc.)
    editor-theme.ts                   # CodeMirror theme (shared)
    generators/
      event-loop.ts                   # Event Loop generator (reference implementation)
      your-topic.ts                   # YOUR generator goes here
  hooks/
    useSandboxMode.ts                 # Core sandbox state management (shared)
    useSandboxUIState.ts              # UI boilerplate: editing state, Cmd+Enter, toggle (shared)
  components/sandbox/
    SandboxEditor.tsx                 # CodeMirror editor component (shared)
    SandboxToggle.tsx                 # Toggle button (shared)
    SandboxErrorDisplay.tsx           # Error banner (shared)
```

Files you create: **only the generator** (`src/lib/sandbox/generators/your-topic.ts`).

Files you edit: **config registry** (`src/lib/sandbox/configs.ts`) and **your visualization component**.

Everything else is shared and reusable.

---

## Step 1 - Create the Generator

A generator is a function with this signature:

```ts
import type { Program } from "acorn";
import type { StepGenerationResult } from "@/types/sandbox";

export const generateYourTopicSteps = (
  ast: Program,
  source: string,
): StepGenerationResult<YourStep, YourCodeLine> => {
  // Walk the AST, build steps, return them
};
```

### Define Your Types

Your step type must match the shape your visualization component already uses for its hardcoded `STEPS` array:

```ts
// Must match your existing step interface exactly
interface YourStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  // ... your topic-specific fields
}

interface YourCodeLine {
  num: number;
  text: string;
}
```

### Walk the AST

Use Acorn's AST node types. The `ast.body` array contains top-level statements. Common patterns:

```ts
for (const node of ast.body) {
  if (node.type === "VariableDeclaration") {
    /* ... */
  }
  if (node.type === "FunctionDeclaration") {
    /* ... */
  }
  if (node.type === "ExpressionStatement") {
    const expr = node.expression;
    if (expr.type === "CallExpression") {
      /* ... */
    }
  }
}
```

### Return the Result

```ts
// Success
return {
  success: true,
  codeLines: source.split("\n").map((text, i) => ({ num: i + 1, text })),
  steps: yourGeneratedSteps,
};

// Error
return {
  success: false,
  error: {
    type: "unsupported-pattern",
    message: "This pattern is not supported. Try: ...",
    line: node.loc?.start.line,
  },
};
```

### Reference Implementation

See `src/lib/sandbox/generators/event-loop.ts` for a complete example (~500 lines) that handles:

- `console.log()` calls
- `setTimeout()` with callbacks
- `Promise.resolve().then()` chains (including nested)
- `queueMicrotask()`
- Function declarations and calls
- Variable declarations

---

## Step 2 - Register the Config

Add an entry to `src/lib/sandbox/configs.ts`:

```ts
export const SANDBOX_CONFIGS: Record<string, SandboxConfig> = {
  "event-loop": {
    /* ... existing ... */
  },

  // Add your topic:
  "your-topic": {
    topicId: "your-topic", // Must match topic registry ID
    defaultCode: `// Starter code
function outer() {
  let x = 10;
  function inner() {
    console.log(x);
  }
  return inner;
}`,
    supportedPatterns: [
      // Shown in error display when unsupported code is used
      "Function declarations",
      "Variable declarations (let, const)",
      "Nested functions",
      "console.log()",
    ],
    maxCodeLines: 25, // Max lines allowed
    maxCodeLength: 1000, // Max characters allowed
  },
};
```

---

## Step 3 - Wire Into the Visualization

The sandbox UI is packaged as two components, so a sandbox topic differs from a normal one in only a few lines. `src/components/visualizations/event-loop/index.tsx` is the full reference.

### 1. Add Imports

```tsx
import {
  SandboxControls,
  SandboxEditingHint,
} from "@/components/sandbox/SandboxControls";
import { SandboxPanel } from "@/components/sandbox/SandboxPanel";
import { useSandboxUIState } from "@/hooks/useSandboxUIState";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { SANDBOX_CONFIGS } from "@/lib/sandbox/configs";
import { generateYourTopicSteps } from "@/lib/sandbox/generators/your-topic";
```

`SandboxPanel` lazy-loads the CodeMirror editor, so nothing from CodeMirror ships until the reader opens the sandbox.

### 2. Use the Hook

```tsx
const sandboxConfig = SANDBOX_CONFIGS["your-topic"];

export const YourTopic = () => {
  const {
    sandbox,
    isEditing,
    usingSandbox,
    showHighlightedCode,
    handleToggleSandbox,
    handleGenerate,
    handleEditCode,
  } = useSandboxUIState(sandboxConfig, generateYourTopicSteps);

  // Choose the active data source
  const activeSteps = usingSandbox && sandbox.generatedSteps ? sandbox.generatedSteps : STEPS;
  const activeCodeLines =
    usingSandbox && sandbox.generatedCodeLines ? sandbox.generatedCodeLines : CODE_LINES;
  const isEditingSandbox = sandbox.isSandboxActive && isEditing;

  const playback = useStepPlayback({
    totalSteps: activeSteps.length,
    resetKey: usingSandbox ? `sandbox-${sandbox.generationId}` : "default",
  });
  const currentStep =
    playback.currentStepIndex >= 0 ? activeSteps[playback.currentStepIndex] : null;
```

### 3. Toolbar

`VisualizationToolbar` takes the sandbox buttons as `leading`, hides the transport while the editor owns the stage, and swaps the step description for the editing hint:

```tsx
<VisualizationToolbar
  playback={playback}
  totalSteps={activeSteps.length}
  descriptionHtml={currentStep?.descriptionHtml}
  descriptionFlash={flashes.description}
  align="center"
  hideTransport={sandbox.isSandboxActive && !showHighlightedCode}
  descriptionOverride={isEditingSandbox ? <SandboxEditingHint /> : undefined}
  leading={
    <SandboxControls
      isActive={sandbox.isSandboxActive}
      isEditing={isEditing}
      onToggle={handleToggleSandbox}
      onGenerate={handleGenerate}
      onResetCode={sandbox.resetCode}
      onEdit={handleEditCode}
    />
  }
/>
```

### 4. Swap the Code Panel

```tsx
{
  isEditingSandbox ? (
    <SandboxPanel
      config={sandboxConfig}
      sandbox={sandbox}
      onGenerate={handleGenerate}
      className="xl:max-w-sm"
    />
  ) : (
    <SourceCodePanel
      lines={activeCodeLines}
      activeLine={currentStep?.activeLine}
      doneLines={currentStep?.doneLines}
    />
  );
}
```

`SandboxPanel` renders the editor, the error display, and the line and character limits.

---

## Shared Utilities

`src/lib/sandbox/generatorUtils.ts` provides helpers every generator can use:

| Function                                     | Description                                                    |
| -------------------------------------------- | -------------------------------------------------------------- |
| `getLineRange(node)`                         | Returns all line numbers a node spans (1-based)                |
| `expressionToLabel(node, source)`            | Short label from source (truncated to 45 chars)                |
| `callbackLabel(bodySource)`                  | Label like `() => console.log('x')`                            |
| `getCallbackBody(node)`                      | Extract body from arrow/function expressions                   |
| `extractCallbackFromArg(arg, source)`        | Full callback info: label, body, lines                         |
| `extractConsoleLogArg(node, source, scope?)` | Get `console.log()` arg text with optional scope resolution    |
| `resolveNodeToString(node, source, scope?)`  | Resolve literals/identifiers/template literals to display text |
| `escapeHtml(value)`                          | Escape untrusted text before interpolating into HTML           |
| `createError(type, message, line?)`          | Factory for `SandboxError` objects                             |

Usage:

```ts
import {
  getLineRange,
  expressionToLabel,
  extractCallbackFromArg,
  escapeHtml,
  createError,
} from "@/lib/sandbox/generatorUtils";
```

---

## Editor Features

The CodeMirror editor (`SandboxEditor`) provides out of the box:

- JavaScript syntax highlighting (matching the existing `tok-*` color palette)
- Auto-close brackets, quotes, and parentheses
- Bracket matching
- Tab key inserts 2 spaces, Shift+Tab dedents
- Auto-indent on input
- `Cmd+Enter` / `Ctrl+Enter` to generate visualization
- `Cmd+Shift+F` / `Ctrl+Shift+F` to format code with Prettier
- Line numbers, active line highlighting
- Line wrapping for long lines
- Max line enforcement (lines beyond the limit are trimmed)

---

## Error Handling

The generator can return four error types:

| Type                  | When                                          | Display                                   |
| --------------------- | --------------------------------------------- | ----------------------------------------- |
| `parse-error`         | Acorn can't parse the code                    | Red banner with line/column               |
| `unsupported-pattern` | Valid JS but your generator doesn't handle it | Amber banner with supported patterns list |
| `code-too-long`       | Exceeds `maxCodeLines`                        | Auto-handled by `useSandboxMode`          |
| `generation-error`    | Other generation failure (empty code, etc.)   | Red banner                                |

When returning `unsupported-pattern`, provide a helpful message:

```ts
return {
  success: false,
  error: {
    type: "unsupported-pattern",
    message:
      "for loops are not supported yet. Use simple statements and function calls.",
    line: node.loc?.start.line,
  },
};
```

---

## Security Model

- **No code execution** --- the sandbox parses AST only, never runs user code
- **Acorn parser** --- standard ES2023 parsing, no evaluation
- **CSP headers** --- production blocks `unsafe-eval` and `unsafe-inline`
- **HTML safety** --- never inject raw user-derived strings into `descriptionHtml`; escape first with `escapeHtml`
- **`dangerouslySetInnerHTML` discipline** --- only render trusted markup tags; treat all dynamic values as untrusted
- **Input limits** --- configurable max lines and max character count
- **localStorage** --- user code persisted locally, never sent to a server
- **No network** --- sandbox is fully client-side, no API calls

---

## Checklist

Before shipping a new sandbox topic:

- [ ] Generator file created at `src/lib/sandbox/generators/<topic>.ts`
- [ ] Generator exports a function matching `StepGenerator<YourStep, YourCodeLine>`
- [ ] Generated steps have the exact same shape as hardcoded `STEPS` array
- [ ] Config added to `SANDBOX_CONFIGS` in `configs.ts`
- [ ] `defaultCode` is valid and demonstrates the topic well
- [ ] `supportedPatterns` list is accurate and matches what the generator handles
- [ ] Visualization component uses `useSandboxUIState()` hook
- [ ] `SandboxPanel` replaces `SourceCodePanel` while editing
- [ ] `SandboxControls` passed as `leading` to `VisualizationToolbar` with `align="center"`
- [ ] `hideTransport` and `descriptionOverride` set on `VisualizationToolbar` for editing mode
- [ ] `resetKey` passed to `useStepPlayback` includes `sandbox.generationId`
- [ ] `activeSteps` switches between generated and hardcoded based on `usingSandbox`
- [ ] Any user-derived text interpolated into HTML is escaped via `escapeHtml`
- [ ] Tested with valid code, invalid code, empty code, and unsupported patterns
- [ ] Tested with malicious payload sample (e.g. `<img src=x onerror=alert(1)>`) to verify text rendering only
- [ ] Queue item pills handle long text (overflow-hidden, break-all)
- [ ] `npm run verify` passes
