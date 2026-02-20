"use client";

import { useEffect, useRef, useCallback } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { visualizeJsTheme } from "@/lib/sandbox/editor-theme";

/* ------------------------------------------------------------------ */
/*  Prettier formatting (lazy-loaded on first Cmd+Shift+F)             */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prettierCache: { format: (...args: any[]) => Promise<string>; plugins: unknown[] } | null = null;

async function loadPrettier() {
  if (prettierCache) return prettierCache;
  const [prettierMod, babelMod, estreeMod] = await Promise.all([
    import("prettier/standalone"),
    import("prettier/plugins/babel"),
    import("prettier/plugins/estree"),
  ]);
  // Handle both ESM default and direct exports
  const format = prettierMod.format ?? prettierMod.default?.format;
  const babel = babelMod.default ?? babelMod;
  const estree = estreeMod.default ?? estreeMod;
  prettierCache = { format, plugins: [babel, estree] };
  return prettierCache;
}

async function formatWithPrettier(view: EditorView) {
  const raw = view.state.doc.toString();
  try {
    const { format, plugins } = await loadPrettier();
    const formatted = await format(raw, {
      parser: "babel",
      plugins,
      printWidth: 50,
      tabWidth: 2,
      singleQuote: true,
      semi: true,
      trailingComma: "all" as const,
    });
    const trimmed = formatted.replace(/\n+$/, "");
    if (trimmed !== raw) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: trimmed },
      });
    }
  } catch {
    // Syntax errors or import failures - silently ignore
  }
}

interface SandboxEditorProps {
  /** Current code string - when this changes externally (e.g. reset) the editor syncs. */
  code: string;
  onChange: (code: string) => void;
  onGenerate: () => void;
  maxLines?: number;
  /**
   * Bumped by the parent when code is replaced externally (e.g. "Reset to default").
   * The editor replaces its content when this value changes.
   */
  codeVersion?: number;
}

export function SandboxEditor({
  code,
  onChange,
  onGenerate,
  maxLines = 20,
  codeVersion = 0,
}: SandboxEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onGenerateRef = useRef(onGenerate);
  /** Track whether a dispatch originated internally (from external sync) to avoid feedback loops. */
  const internalUpdate = useRef(false);

  onChangeRef.current = onChange;
  onGenerateRef.current = onGenerate;

  const createState = useCallback(
    (doc: string) =>
      EditorState.create({
        doc,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          history(),
          bracketMatching(),
          closeBrackets(),
          indentOnInput(),
          javascript(),
          ...visualizeJsTheme,
          EditorState.tabSize.of(2),
          keymap.of([
            // Mod-Enter must come BEFORE defaultKeymap so it takes priority over Enter → newline
            {
              key: "Mod-Enter",
              run: () => {
                onGenerateRef.current();
                return true;
              },
              preventDefault: true,
            },
            // Cmd+Shift+F (Mac) / Ctrl+Shift+F (Win/Linux) - format with Prettier
            {
              key: "Mod-Shift-f",
              run: (view) => {
                formatWithPrettier(view);
                return true;
              },
              preventDefault: true,
            },
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            indentWithTab,
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              // Skip if this was an external sync dispatch
              if (internalUpdate.current) {
                internalUpdate.current = false;
                return;
              }
              const doc = update.state.doc;
              // Enforce max lines
              if (doc.lines > maxLines) {
                const trimmed = doc.sliceString(
                  0,
                  doc.line(maxLines).to,
                );
                onChangeRef.current(trimmed);
              } else {
                onChangeRef.current(doc.toString());
              }
            }
          }),
          EditorView.lineWrapping,
        ],
      }),
    [maxLines],
  );

  // Create editor once on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const view = new EditorView({
      state: createState(code),
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only create editor once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync editor content when code changes externally (e.g. reset)
  // We track `codeVersion` - it only bumps on external resets, not on every keystroke.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentContent = view.state.doc.toString();
    if (currentContent !== code) {
      internalUpdate.current = true;
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: code,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeVersion]);

  return (
    <div
      ref={containerRef}
      className="min-h-[120px] overflow-auto rounded-lg"
    />
  );
}
