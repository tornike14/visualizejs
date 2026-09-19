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
  "let",
  "const",
  "var",
  "function",
  "return",
  "if",
  "else",
  "new",
  "typeof",
  "instanceof",
  "class",
  "extends",
  "import",
  "export",
  "default",
  "from",
  "async",
  "await",
  "yield",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "try",
  "catch",
  "finally",
  "throw",
  "true",
  "false",
  "null",
  "undefined",
  "this",
  "void",
  "delete",
  "in",
  "of",
]);

const BUILTIN_OBJECTS = new Set([
  "console",
  "Promise",
  "Array",
  "Object",
  "String",
  "Number",
  "Boolean",
  "Math",
  "JSON",
  "Date",
  "RegExp",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "WeakRef",
  "Symbol",
  "Error",
  "TypeError",
  "ReferenceError",
  "SyntaxError",
  "RangeError",
  "window",
  "document",
  "globalThis",
]);

const BUILTIN_METHODS = new Set([
  "log",
  "warn",
  "error",
  "info",
  "debug",
  "setTimeout",
  "setInterval",
  "clearTimeout",
  "clearInterval",
  "resolve",
  "reject",
  "then",
  "catch",
  "finally",
  "all",
  "race",
  "parse",
  "stringify",
  "push",
  "pop",
  "shift",
  "unshift",
  "map",
  "filter",
  "reduce",
  "forEach",
  "find",
  "includes",
  "indexOf",
  "slice",
  "keys",
  "values",
  "entries",
  "assign",
  "freeze",
  "require",
  "fetch",
  "structuredClone",
  "isArray",
  "deref",
  "fill",
]);

const isWhitespace = (code: number) =>
  code === 32 || code === 9 || code === 10 || code === 13;
const isDigit = (code: number) => code >= 48 && code <= 57;
const isIdentifierStart = (code: number) =>
  (code >= 65 && code <= 90) ||
  (code >= 97 && code <= 122) ||
  code === 95 ||
  code === 36;
const isIdentifierPart = (code: number) =>
  isIdentifierStart(code) || isDigit(code);

const classifyWord = (word: string): TokenType => {
  if (KEYWORDS.has(word)) return "keyword";
  if (BUILTIN_OBJECTS.has(word)) return "builtin";
  if (BUILTIN_METHODS.has(word)) return "function";
  return "plain";
};

const tokenizeUncached = (text: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;

  while (i < text.length) {
    const code = text.charCodeAt(i);

    if (isWhitespace(code)) {
      const start = i;
      while (i < text.length && isWhitespace(text.charCodeAt(i))) i++;
      tokens.push({ type: "plain", value: text.slice(start, i) });
      continue;
    }

    if (text[i] === "/" && text[i + 1] === "/") {
      tokens.push({ type: "comment", value: text.slice(i) });
      break;
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

    if (isDigit(code)) {
      const start = i;
      while (
        i < text.length &&
        (isDigit(text.charCodeAt(i)) || text[i] === ".")
      ) {
        i++;
      }
      tokens.push({ type: "number", value: text.slice(start, i) });
      continue;
    }

    if (isIdentifierStart(code)) {
      const start = i;
      while (i < text.length && isIdentifierPart(text.charCodeAt(i))) i++;
      const word = text.slice(start, i);
      tokens.push({ type: classifyWord(word), value: word });
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
};

/**
 * Source lines are static strings repeated across many renders, so the token
 * arrays are cached by text. The cache is bounded so a sandbox session that
 * keeps generating new lines cannot grow it without limit.
 */
const TOKEN_CACHE_LIMIT = 2000;
const tokenCache = new Map<string, Token[]>();

export const tokenize = (text: string): Token[] => {
  const cached = tokenCache.get(text);
  if (cached) return cached;

  const tokens = tokenizeUncached(text);
  if (tokenCache.size >= TOKEN_CACHE_LIMIT) {
    const oldest = tokenCache.keys().next().value;
    if (oldest !== undefined) tokenCache.delete(oldest);
  }
  tokenCache.set(text, tokens);
  return tokens;
};

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
