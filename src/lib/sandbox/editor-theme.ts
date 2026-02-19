import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

/**
 * Custom CodeMirror theme matching the VisualizeJS dark palette.
 * Colors sourced from globals.css token classes.
 */

const editorTheme = EditorView.theme(
  {
    "&": {
      color: "#e2e8f0",
      backgroundColor: "transparent",
      fontSize: "13px",
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    ".cm-content": {
      caretColor: "#e2e8f0",
      lineHeight: "1.9",
      padding: "0",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#e2e8f0",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "rgba(244, 114, 182, 0.15)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(251, 191, 36, 0.06)",
    },
    ".cm-gutters": {
      backgroundColor: "transparent",
      color: "rgba(148, 163, 184, 0.4)",
      border: "none",
      paddingRight: "8px",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "transparent",
      color: "rgba(148, 163, 184, 0.7)",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      minWidth: "2.5ch",
      textAlign: "right",
    },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(244, 114, 182, 0.2)",
      outline: "1px solid rgba(244, 114, 182, 0.4)",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "rgba(100, 116, 139, 0.2)",
      border: "none",
      color: "#94a3b8",
    },
    "&.cm-focused": {
      outline: "none",
    },
    ".cm-scroller": {
      overflow: "auto",
    },
  },
  { dark: true },
);

const highlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#c084fc" },
  { tag: tags.controlKeyword, color: "#c084fc" },
  { tag: tags.operatorKeyword, color: "#c084fc" },
  { tag: tags.definitionKeyword, color: "#c084fc" },
  { tag: tags.moduleKeyword, color: "#c084fc" },
  { tag: tags.function(tags.variableName), color: "#60a5fa" },
  { tag: tags.function(tags.propertyName), color: "#60a5fa" },
  { tag: tags.string, color: "#34d399" },
  { tag: tags.number, color: "#fbbf24" },
  { tag: tags.bool, color: "#c084fc" },
  { tag: tags.null, color: "#c084fc" },
  { tag: tags.comment, color: "#64748b", fontStyle: "italic" },
  { tag: tags.variableName, color: "#e2e8f0" },
  { tag: tags.propertyName, color: "#e5c07b" },
  { tag: tags.operator, color: "#94a3b8" },
  { tag: tags.punctuation, color: "#94a3b8" },
  { tag: tags.bracket, color: "#94a3b8" },
  { tag: tags.className, color: "#e5c07b" },
  { tag: tags.typeName, color: "#e5c07b" },
  { tag: tags.regexp, color: "#f472b6" },
]);

export const visualizeJsTheme = [editorTheme, syntaxHighlighting(highlightStyle)];
