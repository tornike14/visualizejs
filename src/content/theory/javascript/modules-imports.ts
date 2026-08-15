import type { TopicTheoryContent } from "@/content/theory/types";

export const modulesImportsTheory: TopicTheoryContent = {
  summary:
    "ES modules provide static import/export syntax that the engine analyzes at parse time. Imports are live, read-only bindings to the exporter's variables. Modules evaluate once, are cached, and handle circular dependencies through partially-initialized module records.",

  whatItIs: [
    "ES modules use import and export statements that the engine resolves statically before any code runs. Unlike CommonJS require(), which is a runtime function that copies values, ES imports create live bindings that reference the exporter's actual variable slot.",
    "The module loading process has distinct phases: parsing (build the module graph), linking (connect import bindings to export slots), and evaluation (run the module code top-to-bottom). Each module evaluates exactly once and is cached. Subsequent imports of the same module return the cached instance.",
    "Live bindings mean the import always reads the current value of the export. If the source module mutates an exported let variable, all importers see the change immediately. However, imports are read-only from the importer's perspective. Attempting to reassign an import throws a TypeError.",
  ],

  howItWorks: [
    "Step 1: the engine encounters an import statement. It fetches and parses the target module, building a module record with a list of exports. This repeats recursively for all transitive imports, constructing the full module graph.",
    "Step 2: linking connects each import binding to the corresponding export slot. Both the importer and exporter share the same memory location for each binding. This is done before any code runs.",
    "Step 3: evaluation runs module code top-to-bottom in depth-first order. Dependencies evaluate before dependents. If a circular dependency is detected, the engine uses the partially-initialized module record, which may contain uninitialized bindings.",
    "Step 4: after evaluation, the module instance is cached. All future imports of the same specifier return the same cached instance with its current binding values.",
  ],

  commonMistakes: [
    {
      title: "Assuming imports are copies like CommonJS",
      explanation:
        "In CommonJS, require() returns a snapshot of the exports object at the time of the call. In ES modules, imports are live references. Changes in the exporter propagate to all importers.",
      fix: "Understand that ES imports share memory with the exporter. If you need a snapshot, explicitly copy the value (e.g., const snapshot = importedValue).",
    },
    {
      title: "Reading circular imports at the top level",
      explanation:
        "When two modules import each other, one will evaluate first and see uninitialized values from the other. Top-level reads of circular imports can produce undefined.",
      fix: "Move circular reads inside functions that execute after both modules have finished evaluating. Alternatively, restructure the dependency graph to break the cycle.",
    },
    {
      title: "Confusing named and default exports",
      explanation:
        "A module can have many named exports but only one default export. Importing a named export requires curly braces; importing the default does not. Mixing them up causes binding errors.",
      fix: "Use named exports for most cases (they enable tree shaking and autocomplete). Reserve default exports for the primary value of a module. Always check what a module exports before importing.",
    },
  ],

  interviewQuestions: [
    {
      question: "What is the difference between named and default exports?",
      answer:
        "Named exports are imported by their exact name using curly braces: import { PI } from './math'. Default exports are imported without braces and can be given any local name: import mySquare from './math'. A module can have multiple named exports but only one default.",
    },
    {
      question: "Why are ES module imports live bindings?",
      answer:
        "ES imports are live because both the importer and exporter reference the same memory slot. This is established during the linking phase before code runs. Live bindings ensure consistency: if the source module updates a value, all consumers see the change. This is fundamental to how circular dependencies work without deadlocking.",
    },
    {
      question: "How does JavaScript handle circular dependencies?",
      answer:
        "The engine creates module records for all modules in the graph before evaluating any of them. When a circular import is encountered, the engine uses the already-created (but not yet evaluated) module record. Bindings exist but may be uninitialized if the exporting module has not yet run the assignment. This is why circular reads at the top level can see undefined.",
      codeExample: {
        code: `// a.js
import { b } from "./b.js";
export const a = "A";
console.log(b); // "B" (b.js evaluated first)

// b.js
import { a } from "./a.js";
export const b = "B";
console.log(a); // undefined (a.js not evaluated yet)`,
        language: "javascript",
      },
    },
  ],

  relatedTopicIds: ["scope-chain", "hoisting", "execution-context", "closures", "event-delegation"],
};
