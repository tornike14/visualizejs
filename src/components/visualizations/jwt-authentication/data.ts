import type { FlowMessage } from "@/components/visualization-ui/MessageFlow";
import type { MetricBar } from "@/components/visualization-ui/MetricBars";
import type {
  ClaimRow,
  ClaimState,
  JwtExample,
  JwtStep,
  StoreEntry,
  TokenPart,
  TokenPartState,
  VerificationCheck,
  CheckStatus,
} from "./types";

/* ------------------------------------------------------------------------ */
/* Real values, computed with Node's crypto module and secret               */
/* "dev-secret-change-me". Header and payload are base64url with no padding. */
/* ------------------------------------------------------------------------ */

const HEADER_JSON = '{"alg":"HS256","typ":"JWT"}';
const HEADER_ENC = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

const PAYLOAD_JSON =
  '{"sub":"42","role":"user",\n "iat":1700000000,"exp":1700003600}';
const PAYLOAD_ENC =
  "eyJzdWIiOiI0MiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9";
const SIG_ENC = "LIwEkPQKr4yu65AJFtEhpIQNhVvJ-sRp31Ksln_sC9U";

const TAMPERED_JSON =
  '{"sub":"42","role":"admin",\n "iat":1700000000,"exp":1700003600}';
const TAMPERED_ENC =
  "eyJzdWIiOiI0MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ";
const TAMPERED_RECOMPUTED = "I-1XaX3ABFaxFkQH42RpYfQ7BlpBGDFEuTc1MbFSCC0";

const EXPIRED_JSON =
  '{"sub":"42","role":"user",\n "iat":1699990000,"exp":1699993600}';
const EXPIRED_ENC =
  "eyJzdWIiOiI0MiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk5OTkwMDAwLCJleHAiOjE2OTk5OTM2MDB9";
const EXPIRED_SIG = "VSHIMnM4CHdn4_d7BohrwMdE9x05xTBmsAtIs5FMaWU";

const SIG_FORMULA = 'HMAC-SHA256(\n  header + "." + payload,\n  secret)';

/* ------------------------------------------------------------------------ */
/* Builders                                                                 */
/* ------------------------------------------------------------------------ */

const part = (
  id: TokenPart["id"],
  decoded: string,
  encoded: string,
  state: TokenPartState,
): TokenPart => ({ id, decoded, encoded, state });

const header = (state: TokenPartState = "encoded", encoded = HEADER_ENC) =>
  part("header", HEADER_JSON, encoded, state);

const payload = (
  state: TokenPartState = "encoded",
  json = PAYLOAD_JSON,
  encoded = PAYLOAD_ENC,
) => part("payload", json, encoded, state);

const signature = (
  state: TokenPartState = "encoded",
  encoded = SIG_ENC,
  decoded = SIG_FORMULA,
) => part("signature", decoded, encoded, state);

const msg = (
  id: string,
  from: string,
  to: string,
  label: string,
  status: FlowMessage["status"],
  detail?: string,
): FlowMessage => ({ id, from, to, label, status, detail });

const claim = (
  name: string,
  value: string,
  meaning: string,
  state: ClaimState = "neutral",
): ClaimRow => ({ claim: name, value, meaning, state });

const claims = (state: ClaimState): ClaimRow[] => [
  claim("sub", '"42"', "subject: the user id, a string per RFC 7519", state),
  claim(
    "role",
    '"user"',
    "custom claim the app reads for authorization",
    state,
  ),
  claim("iat", "1700000000", "issued at, seconds since the Unix epoch", state),
  claim("exp", "1700003600", "expires at, iat + 3600 (one hour)", state),
];

const check = (
  id: string,
  label: string,
  detail: string,
  status: CheckStatus,
): VerificationCheck => ({ id, label, detail, status });

const checks = (
  parse: CheckStatus,
  sig: CheckStatus,
  exp: CheckStatus,
  nbf: CheckStatus,
  detail: Partial<Record<"parse" | "sig" | "exp" | "nbf", string>> = {},
): VerificationCheck[] => [
  check("parse", "parse", detail.parse ?? 'split on "." into 3 parts', parse),
  check(
    "sig",
    "signature",
    detail.sig ?? "recompute HMAC, compare in constant time",
    sig,
  ),
  check("exp", "exp", detail.exp ?? "exp must be greater than now", exp),
  check("nbf", "nbf", detail.nbf ?? "not before, only if present", nbf),
];

const bar = (
  id: string,
  label: string,
  value: number,
  display: string,
  tone: MetricBar["tone"],
  active = false,
): MetricBar => ({ id, label, value, display, tone, active });

const entry = (
  id: string,
  tokenHash: string,
  status: StoreEntry["status"],
  active = false,
): StoreEntry => ({
  id,
  tokenHash,
  userId: "42",
  expires: "2023-12-14",
  status,
  active,
});

const RT1 = "191de380120b3f...";
const RT2 = "1c8a0f7101cfa9...";

const empty = {
  tokenParts: [] as TokenPart[],
  messages: [] as FlowMessage[],
  claims: [] as ClaimRow[],
  checks: [] as VerificationCheck[],
  lifetimes: [] as MetricBar[],
  store: [] as StoreEntry[],
};

const step = (
  fields: Partial<JwtStep> &
    Pick<JwtStep, "descriptionHtml" | "activeLine" | "doneLines">,
): JwtStep => ({ ...empty, ...fields });

/* ------------------------------------------------------------------------ */
/* Example 1: login and token creation                                      */
/* ------------------------------------------------------------------------ */

const LOGIN_MSG = (status: FlowMessage["status"]) =>
  msg(
    "login",
    "client",
    "server",
    "POST /login",
    status,
    "{ email, password }",
  );

const ISSUE_CODE = [
  { num: 1, text: 'const { createHmac } = require("crypto");' },
  {
    num: 2,
    text: 'const b64url = (s) => Buffer.from(s).toString("base64url");',
  },
  { num: 3, text: "function sign(payload, secret) {" },
  {
    num: 4,
    text: '  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));',
  },
  { num: 5, text: "  const body = b64url(JSON.stringify(payload));" },
  {
    num: 6,
    text: '  const sig = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");',
  },
  { num: 7, text: "  return `${header}.${body}.${sig}`;" },
  { num: 8, text: "}" },
  { num: 9, text: 'app.post("/login", async (req, res) => {' },
  {
    num: 10,
    text: "  const user = await db.users.findByEmail(req.body.email);",
  },
  {
    num: 11,
    text: "  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {",
  },
  {
    num: 12,
    text: '    return res.status(401).json({ error: "invalid credentials" });',
  },
  { num: 13, text: "  }" },
  { num: 14, text: "  const now = Math.floor(Date.now() / 1000);" },
  {
    num: 15,
    text: "  const token = sign({ sub: String(user.id), role: user.role, iat: now, exp: now + 3600 }, SECRET);",
  },
  { num: 16, text: "  res.json({ token });" },
  { num: 17, text: "});" },
];

const ISSUE_STEPS: JwtStep[] = [
  step({
    descriptionHtml:
      'The client sends <code>POST /login</code> with the email and password in the JSON body over HTTPS. This is the only request that carries the password, and the goal is to trade it for a <span class="hl-stack">token</span> the client can present on later requests.',
    activeLine: 9,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
    messages: [LOGIN_MSG("active")],
    activeActorId: "client",
  }),
  step({
    descriptionHtml:
      "The server looks the user up by email. Nothing about the token exists yet, so a wrong email and a wrong password both end at line 12 with the same <code>401</code> body, which avoids leaking which accounts exist.",
    activeLine: 10,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    messages: [LOGIN_MSG("done")],
    activeActorId: "server",
  }),
  step({
    descriptionHtml:
      "<code>bcrypt.compare</code> hashes the submitted password with the stored salt and compares it to <code>user.passwordHash</code>. The plain password is never stored and never goes into the token, because the payload of a JWT is readable by anyone who holds it.",
    activeLine: 11,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    messages: [LOGIN_MSG("done")],
    activeActorId: "server",
  }),
  step({
    descriptionHtml:
      'The password matched. The server reads its own clock in whole seconds and decides the claims: <code>sub</code> identifies the user, <code>role</code> is app data, <code>iat</code> is now and <code>exp</code> is one hour later. Numeric dates in a JWT are <span class="hl-api">seconds</span>, not milliseconds.',
    activeLine: 14,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13],
    messages: [LOGIN_MSG("done")],
    activeActorId: "server",
    claims: claims("active"),
  }),
  step({
    descriptionHtml:
      '<code>sign</code> starts with the header, which names the algorithm and token type. It is JSON encoded with <span class="hl-stack">base64url</span>: the same alphabet as base64 except <code>+</code> becomes <code>-</code>, <code>/</code> becomes <code>_</code>, and the <code>=</code> padding is dropped so the result is safe in URLs and headers.',
    activeLine: 4,
    doneLines: [1, 2, 3, 8, 9, 10, 11, 13, 14],
    messages: [LOGIN_MSG("done")],
    activeActorId: "server",
    claims: claims("neutral"),
    tokenParts: [header("active")],
  }),
  step({
    descriptionHtml:
      'The payload is encoded the same way. This is <span class="hl-api">encoding, not encryption</span>: anyone can run <code>atob</code> on this string and read every claim, so a JWT must never carry passwords, card numbers, or anything else you would not print in a log.',
    activeLine: 5,
    doneLines: [1, 2, 3, 4, 8, 9, 10, 11, 13, 14],
    messages: [LOGIN_MSG("done")],
    activeActorId: "server",
    claims: claims("active"),
    tokenParts: [header("encoded"), payload("active")],
  }),
  step({
    descriptionHtml:
      'The signature is <span class="hl-micro">HMAC-SHA256</span> over the exact bytes <code>header + "." + payload</code>, keyed with a secret that only the server knows. Changing one character of either part changes the whole digest, and nobody without the secret can produce a digest that matches.',
    activeLine: 6,
    doneLines: [1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 14],
    messages: [LOGIN_MSG("done")],
    activeActorId: "server",
    claims: claims("neutral"),
    tokenParts: [header("encoded"), payload("encoded"), signature("active")],
  }),
  step({
    descriptionHtml:
      "The three parts are joined with dots into the compact serialization. Signing proves <strong>integrity</strong> (nothing changed) and <strong>origin</strong> (someone with the secret made it), not secrecy. With HS256 one shared secret both signs and verifies; RS256 signs with a private key and lets any service verify with the public key.",
    activeLine: 7,
    doneLines: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14],
    messages: [LOGIN_MSG("done")],
    activeActorId: "server",
    claims: claims("neutral"),
    tokenParts: [header("encoded"), payload("encoded"), signature("encoded")],
  }),
  step({
    descriptionHtml:
      "Line 15 receives the token string. The server keeps no record of it: everything a later request needs to be authorized is inside the token and checkable with the secret, which is what makes the access token stateless.",
    activeLine: 15,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14],
    messages: [LOGIN_MSG("done")],
    activeActorId: "server",
    claims: claims("neutral"),
    tokenParts: [header("encoded"), payload("encoded"), signature("encoded")],
  }),
  step({
    descriptionHtml:
      'The server responds <code>200</code> with the token. The client either keeps it in memory and sends it as <code>Authorization: Bearer</code> (safe from CSRF, lost on reload, exposed if XSS runs), or receives it in an <span class="hl-task">httpOnly cookie</span> (unreadable by scripts, but sent automatically so CSRF defenses are needed).',
    activeLine: 16,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15],
    messages: [
      LOGIN_MSG("done"),
      msg(
        "login-ok",
        "server",
        "client",
        "200 OK",
        "done",
        '{ token: "eyJhbGciOi..." }',
      ),
    ],
    activeActorId: "client",
    claims: claims("neutral"),
    tokenParts: [header("encoded"), payload("encoded"), signature("encoded")],
  }),
];

/* ------------------------------------------------------------------------ */
/* Example 2: verifying a protected request                                 */
/* ------------------------------------------------------------------------ */

const VERIFY_CODE = [
  { num: 1, text: "function verify(token, secret) {" },
  { num: 2, text: '  const [header, body, sig] = token.split(".");' },
  {
    num: 3,
    text: '  const expected = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");',
  },
  {
    num: 4,
    text: "  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) {",
  },
  { num: 5, text: '    throw new Error("invalid signature");' },
  { num: 6, text: "  }" },
  {
    num: 7,
    text: '  const payload = JSON.parse(Buffer.from(body, "base64url").toString());',
  },
  {
    num: 8,
    text: '  if (payload.exp <= Math.floor(Date.now() / 1000)) throw new Error("token expired");',
  },
  { num: 9, text: "  return payload;" },
  { num: 10, text: "}" },
  { num: 11, text: "function requireAuth(req, res, next) {" },
  { num: 12, text: '  const auth = req.headers.authorization ?? "";' },
  {
    num: 13,
    text: '  if (!auth.startsWith("Bearer ")) return res.status(401).json({ error: "missing token" });',
  },
  { num: 14, text: "  try {" },
  { num: 15, text: "    req.user = verify(auth.slice(7), SECRET);" },
  { num: 16, text: "    next();" },
  { num: 17, text: "  } catch (err) {" },
  { num: 18, text: "    res.status(401).json({ error: err.message });" },
  { num: 19, text: "  }" },
  { num: 20, text: "}" },
  {
    num: 21,
    text: 'app.get("/me", requireAuth, (req, res) => res.json({ id: req.user.sub, role: req.user.role }));',
  },
];

const VERIFY_DONE_BASE = [1, 10, 11, 20, 21];

const ME_MSG = (
  id: string,
  status: FlowMessage["status"],
  detail = "Authorization: Bearer eyJhbGciOi...",
) => msg(id, "client", "server", "GET /me", status, detail);

const VALID_MESSAGES = [
  ME_MSG("me-1", "done"),
  msg(
    "me-1-ok",
    "server",
    "client",
    "200 OK",
    "done",
    '{ id: "42", role: "user" }',
  ),
];

const TAMPERED_MESSAGES = [
  ...VALID_MESSAGES,
  ME_MSG("me-2", "done", "Bearer with role changed to admin"),
  msg(
    "me-2-401",
    "server",
    "client",
    "401 Unauthorized",
    "failed",
    '{ error: "invalid signature" }',
  ),
];

const VERIFY_STEPS: JwtStep[] = [
  step({
    descriptionHtml:
      "The client calls <code>GET /me</code> with the token from login in the <code>Authorization</code> header. Express runs the <code>requireAuth</code> middleware before the route handler, and it starts by reading that header. Now is <code>1700001200</code>, twenty minutes after the token was issued.",
    activeLine: 12,
    doneLines: VERIFY_DONE_BASE,
    tokenParts: [header(), payload(), signature()],
    messages: [ME_MSG("me-1", "active")],
    activeActorId: "server",
    checks: checks("pending", "pending", "pending", "pending"),
  }),
  step({
    descriptionHtml:
      'The header must start with <code>Bearer </code>, the scheme from RFC 6750 that means "whoever bears this token is authorized". A missing or malformed header is rejected before any cryptography runs, which keeps the verifier cheap to call for unauthenticated traffic.',
    activeLine: 13,
    doneLines: [...VERIFY_DONE_BASE, 12],
    tokenParts: [header(), payload(), signature()],
    messages: [ME_MSG("me-1", "done")],
    activeActorId: "server",
    checks: checks("active", "pending", "pending", "pending"),
  }),
  step({
    descriptionHtml:
      '<code>verify</code> splits the token on <code>.</code> into the three base64url parts. The verifier never trusts the header to choose the algorithm: it always uses HS256 with its own secret, which is what closes the classic <code>"alg":"none"</code> and key confusion attacks.',
    activeLine: 2,
    doneLines: [...VERIFY_DONE_BASE, 12, 13, 14, 15],
    tokenParts: [header("active"), payload("active"), signature()],
    messages: [ME_MSG("me-1", "done")],
    activeActorId: "server",
    checks: checks("pass", "pending", "pending", "pending"),
  }),
  step({
    descriptionHtml:
      'The server recomputes <span class="hl-micro">HMAC-SHA256</span> over <code>header.body</code> exactly as the signer did. If the two encoded parts are byte for byte what the server signed, the digest will be identical; the signature is not decrypted, it is reproduced.',
    activeLine: 3,
    doneLines: [...VERIFY_DONE_BASE, 2, 12, 13, 14, 15],
    tokenParts: [
      header(),
      payload(),
      signature("active", SIG_ENC, `recomputed:\n${SIG_ENC}`),
    ],
    messages: [ME_MSG("me-1", "done")],
    activeActorId: "server",
    checks: checks("pass", "active", "pending", "pending"),
  }),
  step({
    descriptionHtml:
      "The recomputed digest equals the presented one. <code>timingSafeEqual</code> compares every byte regardless of where the first difference is, so an attacker cannot measure response times to guess the signature one byte at a time. The length check comes first because <code>timingSafeEqual</code> throws on unequal lengths.",
    activeLine: 4,
    doneLines: [...VERIFY_DONE_BASE, 2, 3, 12, 13, 14, 15],
    tokenParts: [
      header(),
      payload(),
      signature("match", SIG_ENC, `recomputed:\n${SIG_ENC}`),
    ],
    messages: [ME_MSG("me-1", "done")],
    activeActorId: "server",
    checks: checks("pass", "pass", "pending", "pending", {
      sig: "digest matches, constant-time compare",
    }),
  }),
  step({
    descriptionHtml:
      'Only after the signature passes does the server decode and <code>JSON.parse</code> the payload. Decoding needs no secret, but trusting the decoded claims does: the signature check is what turns "a JSON blob someone sent" into "claims this server issued".',
    activeLine: 7,
    doneLines: [...VERIFY_DONE_BASE, 2, 3, 4, 6, 12, 13, 14, 15],
    tokenParts: [header(), payload("active"), signature("match")],
    messages: [ME_MSG("me-1", "done")],
    activeActorId: "server",
    checks: checks("pass", "pass", "pending", "pending"),
  }),
  step({
    descriptionHtml:
      "<code>exp</code> is <code>1700003600</code> and now is <code>1700001200</code>, so the token has forty minutes left. There is no <code>nbf</code> (not before) claim, so that check is skipped. Expiry is enforced by the verifier, not by the token: a token cannot delete itself.",
    activeLine: 8,
    doneLines: [...VERIFY_DONE_BASE, 2, 3, 4, 6, 7, 12, 13, 14, 15],
    tokenParts: [header(), payload("match"), signature("match")],
    messages: [ME_MSG("me-1", "done")],
    activeActorId: "server",
    checks: checks("pass", "pass", "pass", "skipped", {
      exp: "1700003600 > 1700001200, 40 min left",
      nbf: "claim not present",
    }),
  }),
  step({
    descriptionHtml:
      "<code>verify</code> returns the payload and the middleware attaches it as <code>req.user</code>, then calls <code>next()</code>. Downstream handlers read <code>req.user.sub</code> and <code>req.user.role</code> without touching the database, which is the whole performance argument for JWTs.",
    activeLine: 16,
    doneLines: [...VERIFY_DONE_BASE, 2, 3, 4, 6, 7, 8, 9, 12, 13, 14, 15],
    tokenParts: [header(), payload("match"), signature("match")],
    messages: [ME_MSG("me-1", "done")],
    activeActorId: "server",
    checks: checks("pass", "pass", "pass", "skipped", {
      exp: "1700003600 > 1700001200, 40 min left",
      nbf: "claim not present",
    }),
  }),
  step({
    descriptionHtml:
      "The route handler responds <code>200</code> with data taken from the verified claims. Note that <code>role</code> came from the token, so authorization decisions are only as trustworthy as the signature check that preceded them.",
    activeLine: 21,
    doneLines: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 20],
    tokenParts: [header(), payload("match"), signature("match")],
    messages: VALID_MESSAGES,
    activeActorId: "client",
    checks: checks("pass", "pass", "pass", "skipped", {
      exp: "1700003600 > 1700001200, 40 min left",
      nbf: "claim not present",
    }),
  }),
  step({
    descriptionHtml:
      'Second request. The client decoded the payload, changed <code>"role":"user"</code> to <code>"role":"admin"</code>, re-encoded it, and kept the original signature. The parse step still passes: structurally this is a valid token.',
    activeLine: 2,
    doneLines: [...VERIFY_DONE_BASE, 12, 13, 14, 15],
    tokenParts: [
      header(),
      payload("active", TAMPERED_JSON, TAMPERED_ENC),
      signature(),
    ],
    messages: [
      ...VALID_MESSAGES,
      ME_MSG("me-2", "active", "Bearer with role changed to admin"),
    ],
    activeActorId: "server",
    checks: checks("pass", "pending", "pending", "pending"),
  }),
  step({
    descriptionHtml:
      "The recomputed HMAC over the edited payload is <code>I-1XaX3A...</code>, while the token still carries <code>LIwEkPQK...</code>. The attacker could not update the signature because they do not have the secret. <code>timingSafeEqual</code> returns false and line 5 throws.",
    activeLine: 4,
    doneLines: [...VERIFY_DONE_BASE, 2, 3, 12, 13, 14, 15],
    tokenParts: [
      header(),
      payload("miss", TAMPERED_JSON, TAMPERED_ENC),
      signature("miss", SIG_ENC, `recomputed:\n${TAMPERED_RECOMPUTED}`),
    ],
    messages: [
      ...VALID_MESSAGES,
      ME_MSG("me-2", "active", "Bearer with role changed to admin"),
    ],
    activeActorId: "server",
    checks: checks("pass", "fail", "skipped", "skipped", {
      sig: "I-1XaX3A... != LIwEkPQK...",
      exp: "not reached",
      nbf: "not reached",
    }),
  }),
  step({
    descriptionHtml:
      "The <code>catch</code> block answers <code>401</code> with the error message. The payload was never trusted, so the forged <code>admin</code> role never reached a handler. This is the property signing buys: the client can read the token, but cannot change it.",
    activeLine: 18,
    doneLines: [...VERIFY_DONE_BASE, 2, 3, 4, 5, 12, 13, 14, 15, 17],
    tokenParts: [
      header(),
      payload("miss", TAMPERED_JSON, TAMPERED_ENC),
      signature("miss", SIG_ENC, `recomputed:\n${TAMPERED_RECOMPUTED}`),
    ],
    messages: TAMPERED_MESSAGES,
    activeActorId: "client",
    checks: checks("pass", "fail", "skipped", "skipped", {
      sig: "I-1XaX3A... != LIwEkPQK...",
      exp: "not reached",
      nbf: "not reached",
    }),
  }),
  step({
    descriptionHtml:
      "Third request, with a token issued about three hours ago (<code>iat 1699990000</code>, <code>exp 1699993600</code>). The signature was made with the real secret, so the HMAC matches and the signature check passes. A valid signature says who made the token, not whether it is still usable.",
    activeLine: 4,
    doneLines: [...VERIFY_DONE_BASE, 2, 3, 12, 13, 14, 15],
    tokenParts: [
      header(),
      payload("encoded", EXPIRED_JSON, EXPIRED_ENC),
      signature("match", EXPIRED_SIG, `recomputed:\n${EXPIRED_SIG}`),
    ],
    messages: [
      ...TAMPERED_MESSAGES,
      ME_MSG("me-3", "active", "Bearer with a 3 hour old token"),
    ],
    activeActorId: "server",
    checks: checks("pass", "pass", "pending", "pending", {
      sig: "digest matches, constant-time compare",
    }),
  }),
  step({
    descriptionHtml:
      '<code>exp 1699993600</code> is less than now <code>1700001200</code>, so line 8 throws and the client gets <code>401 token expired</code>. Because the server stores nothing per token, expiry is the only built-in way an access token stops working; that is why they are kept short and paired with a <span class="hl-task">refresh token</span>.',
    activeLine: 18,
    doneLines: [...VERIFY_DONE_BASE, 2, 3, 4, 6, 7, 8, 12, 13, 14, 15, 17],
    tokenParts: [
      header(),
      payload("miss", EXPIRED_JSON, EXPIRED_ENC),
      signature("match", EXPIRED_SIG, `recomputed:\n${EXPIRED_SIG}`),
    ],
    messages: [
      ...TAMPERED_MESSAGES,
      ME_MSG("me-3", "done", "Bearer with a 3 hour old token"),
      msg(
        "me-3-401",
        "server",
        "client",
        "401 Unauthorized",
        "failed",
        '{ error: "token expired" }',
      ),
    ],
    activeActorId: "client",
    checks: checks("pass", "pass", "fail", "skipped", {
      sig: "digest matches, constant-time compare",
      exp: "1699993600 <= 1700001200, expired 2h 6m ago",
      nbf: "not reached",
    }),
  }),
];

/* ------------------------------------------------------------------------ */
/* Example 3: refresh tokens and logout                                     */
/* ------------------------------------------------------------------------ */

const REFRESH_CODE = [
  { num: 1, text: 'app.post("/refresh", async (req, res) => {' },
  { num: 2, text: "  const presented = req.cookies.refresh_token;" },
  {
    num: 3,
    text: "  const row = await db.refreshTokens.findOne({ hash: sha256(presented) });",
  },
  {
    num: 4,
    text: "  if (!row || row.revokedAt || row.expiresAt < Date.now()) {",
  },
  {
    num: 5,
    text: '    return res.status(401).json({ error: "refresh token invalid" });',
  },
  { num: 6, text: "  }" },
  { num: 7, text: '  const next = randomBytes(32).toString("base64url");' },
  { num: 8, text: "  await db.refreshTokens.rotate(row.id, sha256(next));" },
  {
    num: 9,
    text: '  res.cookie("refresh_token", next, { httpOnly: true, secure: true, sameSite: "strict", path: "/refresh" });',
  },
  { num: 10, text: "  const now = Math.floor(Date.now() / 1000);" },
  {
    num: 11,
    text: "  res.json({ token: sign({ sub: row.userId, role: row.role, iat: now, exp: now + 900 }, SECRET) });",
  },
  { num: 12, text: "});" },
  { num: 13, text: 'app.post("/logout", async (req, res) => {' },
  {
    num: 14,
    text: "  await db.refreshTokens.revoke(sha256(req.cookies.refresh_token));",
  },
  {
    num: 15,
    text: '  res.clearCookie("refresh_token", { path: "/refresh" });',
  },
  { num: 16, text: "  res.status(204).end();" },
  { num: 17, text: "});" },
];

const ACCESS = (value: number, display: string, active = false) =>
  bar(
    "access",
    "access",
    value,
    display,
    value === 0 ? "rose" : "cyan",
    active,
  );
const REFRESH = (value: number, display: string, active = false) =>
  bar(
    "refresh",
    "refresh",
    value,
    display,
    value === 0 ? "rose" : "violet",
    active,
  );

const LOGIN_DONE = msg(
  "login-ok",
  "server",
  "client",
  "200 login",
  "done",
  "access in body, refresh in Set-Cookie",
);
const ME_OK = msg(
  "me-ok",
  "client",
  "server",
  "GET /me",
  "done",
  "200, no DB lookup",
);
const ME_EXPIRED = msg(
  "me-exp",
  "server",
  "client",
  "401 token expired",
  "failed",
  "access exp 1700000900 passed",
);
const REFRESH_REQ = (status: FlowMessage["status"]) =>
  msg(
    "refresh",
    "client",
    "server",
    "POST /refresh",
    status,
    "Cookie: refresh_token=...",
  );
const DB_FIND = (status: FlowMessage["status"]) =>
  msg("db-find", "server", "db", "findOne", status, "hash = sha256(presented)");
const DB_ROW = msg(
  "db-row",
  "db",
  "server",
  "row",
  "done",
  "user 42, not revoked",
);
const DB_ROTATE = msg(
  "db-rotate",
  "server",
  "db",
  "rotate",
  "done",
  "replace hash, keep row",
);
const REFRESH_OK = msg(
  "refresh-ok",
  "server",
  "client",
  "200 OK",
  "done",
  "new access + Set-Cookie",
);
const ME_OK_2 = msg(
  "me-ok-2",
  "client",
  "server",
  "GET /me",
  "done",
  "200 with the new token",
);
const LOGOUT_REQ = (status: FlowMessage["status"]) =>
  msg(
    "logout",
    "client",
    "server",
    "POST /logout",
    status,
    "Cookie: refresh_token=...",
  );
const DB_REVOKE = msg(
  "db-revoke",
  "server",
  "db",
  "revoke",
  "done",
  "set revokedAt",
);
const LOGOUT_OK = msg(
  "logout-ok",
  "server",
  "client",
  "204 No Content",
  "done",
  "cookie cleared",
);

const REFRESH_STEPS: JwtStep[] = [
  step({
    descriptionHtml:
      'Login at <code>1700000000</code> issued two tokens. The <span class="hl-api">access token</span> is a JWT with <code>exp</code> 15 minutes out, returned in the JSON body. The <span class="hl-task">refresh token</span> is an opaque random string valid for 30 days, set as an httpOnly cookie, and only its SHA-256 hash is stored server side.',
    activeLine: null,
    doneLines: [],
    lifetimes: [ACCESS(1, "15m 0s", true), REFRESH(1, "30d 0h", true)],
    messages: [LOGIN_DONE],
    activeActorId: "client",
    store: [entry("rt1", RT1, "active")],
  }),
  step({
    descriptionHtml:
      "Ten minutes later the client calls <code>GET /me</code> with the access token. The server verifies the signature and <code>exp</code> and answers without a database lookup. The refresh token is not sent here: its cookie is scoped to <code>path=/refresh</code>.",
    activeLine: null,
    doneLines: [],
    lifetimes: [ACCESS(600 / 900, "5m 0s", true), REFRESH(0.9998, "29d 23h")],
    messages: [LOGIN_DONE, ME_OK],
    activeActorId: "server",
    store: [entry("rt1", RT1, "active")],
  }),
  step({
    descriptionHtml:
      "At <code>1700000960</code> the access token is one minute past <code>exp</code>. The next <code>GET /me</code> fails with <code>401 token expired</code>. The client does not ask the user to log in again; it uses the refresh token to get a new access token.",
    activeLine: null,
    doneLines: [],
    lifetimes: [ACCESS(0, "expired", true), REFRESH(0.9996, "29d 23h")],
    messages: [LOGIN_DONE, ME_OK, ME_EXPIRED],
    activeActorId: "client",
    store: [entry("rt1", RT1, "active")],
  }),
  step({
    descriptionHtml:
      "The client calls <code>POST /refresh</code>. Because the cookie is httpOnly the JavaScript never saw the refresh token; the browser attaches it on its own because the path matches. The handler reads it from <code>req.cookies</code>.",
    activeLine: 2,
    doneLines: [1],
    lifetimes: [ACCESS(0, "expired"), REFRESH(0.9996, "29d 23h", true)],
    messages: [LOGIN_DONE, ME_OK, ME_EXPIRED, REFRESH_REQ("active")],
    activeActorId: "server",
    store: [entry("rt1", RT1, "active")],
  }),
  step({
    descriptionHtml:
      'Unlike the access token, the refresh token is <span class="hl-micro">stateful</span>: the server hashes the presented value and looks it up in an allow-list table. Storing the hash means a database leak does not hand out usable refresh tokens.',
    activeLine: 3,
    doneLines: [1, 2],
    lifetimes: [ACCESS(0, "expired"), REFRESH(0.9996, "29d 23h", true)],
    messages: [
      LOGIN_DONE,
      ME_OK,
      ME_EXPIRED,
      REFRESH_REQ("done"),
      DB_FIND("active"),
    ],
    activeActorId: "db",
    store: [entry("rt1", RT1, "active", true)],
  }),
  step({
    descriptionHtml:
      "The row exists, has no <code>revokedAt</code>, and its 30 day expiry has not passed. Any of those failing would end the session with <code>401</code> and force a real login, which is exactly the control a stateless access token cannot offer.",
    activeLine: 4,
    doneLines: [1, 2, 3],
    lifetimes: [ACCESS(0, "expired"), REFRESH(0.9996, "29d 23h", true)],
    messages: [
      LOGIN_DONE,
      ME_OK,
      ME_EXPIRED,
      REFRESH_REQ("done"),
      DB_FIND("done"),
      DB_ROW,
    ],
    activeActorId: "server",
    store: [entry("rt1", RT1, "active", true)],
  }),
  step({
    descriptionHtml:
      'The server generates a fresh 32 byte random token and <span class="hl-task">rotates</span> the row so the old value stops working. Rotation limits how long a stolen refresh token stays useful, and if the old value is presented again later, the server can treat that reuse as theft and revoke the whole family.',
    activeLine: 8,
    doneLines: [1, 2, 3, 4, 6, 7],
    lifetimes: [ACCESS(0, "expired"), REFRESH(1, "30d 0h", true)],
    messages: [
      LOGIN_DONE,
      ME_OK,
      ME_EXPIRED,
      REFRESH_REQ("done"),
      DB_FIND("done"),
      DB_ROW,
      DB_ROTATE,
    ],
    activeActorId: "db",
    store: [entry("rt1", RT1, "rotated"), entry("rt2", RT2, "active", true)],
  }),
  step({
    descriptionHtml:
      "The new refresh token goes back in a cookie with <code>httpOnly</code> (scripts cannot read it, so XSS cannot exfiltrate it), <code>secure</code> (HTTPS only), <code>sameSite=strict</code> (cross-site pages cannot trigger it, which blocks CSRF), and <code>path=/refresh</code> so it rides along only where it is needed.",
    activeLine: 9,
    doneLines: [1, 2, 3, 4, 6, 7, 8],
    lifetimes: [ACCESS(0, "expired"), REFRESH(1, "30d 0h", true)],
    messages: [
      LOGIN_DONE,
      ME_OK,
      ME_EXPIRED,
      REFRESH_REQ("done"),
      DB_FIND("done"),
      DB_ROW,
      DB_ROTATE,
    ],
    activeActorId: "server",
    store: [entry("rt1", RT1, "rotated"), entry("rt2", RT2, "active")],
  }),
  step({
    descriptionHtml:
      "A new access token is signed with <code>iat 1700000960</code> and <code>exp 1700001860</code>, another 15 minutes. The user identity came from the refresh row, not from the expired JWT, so nothing from the old token was trusted. The response carries the JWT in the body and the cookie in <code>Set-Cookie</code>.",
    activeLine: 11,
    doneLines: [1, 2, 3, 4, 6, 7, 8, 9, 10],
    lifetimes: [ACCESS(1, "15m 0s", true), REFRESH(1, "30d 0h")],
    messages: [
      LOGIN_DONE,
      ME_OK,
      ME_EXPIRED,
      REFRESH_REQ("done"),
      DB_FIND("done"),
      DB_ROW,
      DB_ROTATE,
      REFRESH_OK,
    ],
    activeActorId: "client",
    store: [entry("rt1", RT1, "rotated"), entry("rt2", RT2, "active")],
  }),
  step({
    descriptionHtml:
      "The client retries <code>GET /me</code> with the new access token and gets <code>200</code>. From the user's point of view nothing happened. This loop, short access token plus long stateful refresh token, is the standard shape of JWT sessions.",
    activeLine: null,
    doneLines: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12],
    lifetimes: [ACCESS(890 / 900, "14m 50s", true), REFRESH(1, "30d 0h")],
    messages: [
      LOGIN_DONE,
      ME_OK,
      ME_EXPIRED,
      REFRESH_REQ("done"),
      DB_FIND("done"),
      DB_ROW,
      DB_ROTATE,
      REFRESH_OK,
      ME_OK_2,
    ],
    activeActorId: "server",
    store: [entry("rt1", RT1, "rotated"), entry("rt2", RT2, "active")],
  }),
  step({
    descriptionHtml:
      'The user logs out. <code>POST /logout</code> marks the refresh row as <span class="hl-loop">revoked</span>, so no further access tokens can be minted from it. Revocation is possible here precisely because the refresh token is looked up in the database on every use.',
    activeLine: 14,
    doneLines: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13],
    lifetimes: [ACCESS(860 / 900, "14m 20s"), REFRESH(0, "revoked", true)],
    messages: [
      LOGIN_DONE,
      ME_OK,
      ME_EXPIRED,
      REFRESH_REQ("done"),
      DB_FIND("done"),
      DB_ROW,
      DB_ROTATE,
      REFRESH_OK,
      ME_OK_2,
      LOGOUT_REQ("done"),
      DB_REVOKE,
    ],
    activeActorId: "db",
    store: [entry("rt1", RT1, "rotated"), entry("rt2", RT2, "revoked", true)],
  }),
  step({
    descriptionHtml:
      "The cookie is cleared and the server answers <code>204</code>. The access token, however, still verifies for another 14 minutes: the server has no record of it and no way to invalidate a signature it already made. That gap is the cost of stateless tokens, which is why <code>exp</code> is kept short and high-risk actions re-check the database or use a denylist keyed by <code>jti</code>.",
    activeLine: 16,
    doneLines: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    lifetimes: [ACCESS(850 / 900, "14m 10s", true), REFRESH(0, "revoked")],
    messages: [
      LOGIN_DONE,
      ME_OK,
      ME_EXPIRED,
      REFRESH_REQ("done"),
      DB_FIND("done"),
      DB_ROW,
      DB_ROTATE,
      REFRESH_OK,
      ME_OK_2,
      LOGOUT_REQ("done"),
      DB_REVOKE,
      LOGOUT_OK,
    ],
    activeActorId: "client",
    store: [entry("rt1", RT1, "rotated"), entry("rt2", RT2, "revoked")],
  }),
];

/* ------------------------------------------------------------------------ */

export const EXAMPLES: JwtExample[] = [
  {
    id: "issue",
    title: "Login and token creation",
    description:
      "POST /login checks the password hash, builds the header and payload, signs them with HMAC-SHA256, and returns the three dot-joined parts.",
    kind: "issue",
    codeLines: ISSUE_CODE,
    steps: ISSUE_STEPS,
  },
  {
    id: "verify",
    title: "Verifying a protected request",
    description:
      "Middleware recomputes the signature over header.payload, compares it in constant time, checks exp, then rejects a tampered token and an expired one.",
    kind: "verify",
    codeLines: VERIFY_CODE,
    steps: VERIFY_STEPS,
  },
  {
    id: "refresh",
    title: "Refresh tokens and logout",
    description:
      "A 15 minute access token expires, the httpOnly refresh cookie mints a new one after a database check and rotation, and logout revokes the refresh token.",
    kind: "refresh",
    codeLines: REFRESH_CODE,
    steps: REFRESH_STEPS,
  },
];
