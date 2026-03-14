import type { SandboxConfig } from "@/types/sandbox";

/**
 * Sandbox configurations indexed by topic ID.
 *
 * To add sandbox support to a new topic:
 *
 * 1. Create a generator function:
 *    `src/lib/sandbox/generators/<your-topic>.ts`
 *    Export: `(ast: Program, source: string) => StepGenerationResult<YourStep, YourCodeLine>`
 *
 * 2. Add a config entry below with the topic's default code, supported patterns, and limits.
 *
 * 3. In your visualization component, use the `useSandboxUIState` hook:
 *    ```ts
 *    import { useSandboxUIState } from "@/hooks/useSandboxUIState";
 *    const { sandbox, isEditing, handleGenerate, ... } = useSandboxUIState(config, generator);
 *    ```
 *
 * See `docs/sandbox-authoring.md` for the full guide.
 */
export const SANDBOX_CONFIGS: Record<string, SandboxConfig> = {
  "event-loop": {
    topicId: "event-loop",
    defaultCode: `console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
  })
  .then(() => {
    console.log('Promise 2');
  });

console.log('End');`,
    supportedPatterns: [
      "console.log('...')",
      "setTimeout(() => { ... }, ms)",
      "Promise.resolve().then(() => { ... })",
      ".then() chaining (including nested promises)",
      "queueMicrotask(() => { ... })",
      "Function declarations and calls",
      "Variable declarations (let, const, var)",
    ],
    maxCodeLines: 25,
    maxCodeLength: 1000,
  },
};

export function isSandboxEnabled(topicId: string): boolean {
  return topicId in SANDBOX_CONFIGS;
}

export function getSandboxConfig(topicId: string): SandboxConfig | null {
  return SANDBOX_CONFIGS[topicId] ?? null;
}
