
export type TokenType =
  | "keyword"
  | "builtin"
  | "function"
  | "string"
  | "number"
  | "comment"
  | "punctuation"
  | "plain";

export interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "let", "const", "var", "function", "return", "if", "else", "new",
  "typeof", "instanceof", "class", "extends", "import", "export",
  "default", "from", "async", "await", "yield", "for", "while",
  "do", "switch", "case", "break", "continue", "try", "catch",
  "finally", "throw", "true", "false", "null", "undefined", "this",
  "void", "delete", "in", "of",
]);

const BUILTIN_OBJECTS = new Set([
  "console", "Promise", "Array", "Object", "String", "Number",
  "Boolean", "Math", "JSON", "Date", "RegExp", "Map", "Set",
  "WeakMap", "WeakSet", "WeakRef", "Symbol", "Error", "TypeError",
  "ReferenceError", "SyntaxError", "RangeError", "window",
  "document", "globalThis",
]);

const BUILTIN_METHODS = new Set([
  "log", "warn", "error", "info", "debug",
  "setTimeout", "setInterval", "clearTimeout", "clearInterval",
  "resolve", "reject", "then", "catch", "finally", "all", "race",
  "parse", "stringify",
  "push", "pop", "shift", "unshift", "map", "filter",
  "reduce", "forEach", "find", "includes", "indexOf", "slice",
  "keys", "values", "entries", "assign", "freeze",
  "require", "fetch",
  "structuredClone", "isArray",
  "deref", "fill",
]);

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < text.length) {
    if (/\s/.test(text[i])) {
      const start = i;
      while (i < text.length && /\s/.test(text[i])) i++;
      tokens.push({ type: "plain", value: text.slice(start, i) });
      continue;
    }

    if (text[i] === "/" && text[i + 1] === "/") {
      tokens.push({ type: "comment", value: text.slice(i) });
      i = text.length;
      continue;
    }

    if (text[i] === "'" || text[i] === '"' || text[i] === "`") {
      const quote = text[i];
      let j = i + 1;
      while (j < text.length && text[j] !== quote) {
        if (text[j] === "\\") j++; // skip escaped char
        j++;
      }
      j++; // include closing quote
      tokens.push({ type: "string", value: text.slice(i, j) });
      i = j;
      continue;
    }

    if (/\d/.test(text[i])) {
      const start = i;
      while (i < text.length && /[\d.]/.test(text[i])) i++;
      tokens.push({ type: "number", value: text.slice(start, i) });
      continue;
    }

    if (/[a-zA-Z_$]/.test(text[i])) {
      const start = i;
      while (i < text.length && /[a-zA-Z0-9_$]/.test(text[i])) i++;
      const word = text.slice(start, i);

      if (KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", value: word });
      } else if (BUILTIN_OBJECTS.has(word)) {
        tokens.push({ type: "builtin", value: word });
      } else if (BUILTIN_METHODS.has(word)) {
        tokens.push({ type: "function", value: word });
      } else {
        tokens.push({ type: "plain", value: word });
      }
      continue;
    }

    if (text[i] === "=" && text[i + 1] === ">") {
      tokens.push({ type: "keyword", value: "=>" });
      i += 2;
      continue;
    }

    tokens.push({ type: "punctuation", value: text[i] });
    i++;
  }

  return tokens;
}

export const TOKEN_CLASS_MAP: Record<TokenType, string> = {
  keyword: "tok-kw",
  builtin: "tok-builtin",
  function: "tok-fn",
  string: "tok-str",
  number: "tok-num",
  comment: "tok-comment",
  punctuation: "tok-punct",
  plain: "",
};
