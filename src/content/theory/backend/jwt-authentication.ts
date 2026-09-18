import type { TopicTheoryContent } from "@/content/theory/types";

export const jwtAuthenticationTheory: TopicTheoryContent = {
  summary:
    "A JSON Web Token is a signed, base64url-encoded set of claims that a server issues at login and verifies on every later request without a database lookup, so authentication state lives in the token instead of in a session store.",
  whatItIs: [
    "After a user proves who they are with a password, the server needs a way to recognise them on the next request. A JWT solves this by handing the client a small string that says who the user is and until when, plus a signature that lets the server confirm it wrote that string. The client sends the string back with each request and the server checks the signature instead of asking a database.",
    "A JWT (RFC 7519) has three parts separated by dots: a header that names the signing algorithm, a payload of claims such as sub (subject), iat (issued at) and exp (expires at), and a signature. The first two parts are JSON encoded with base64url, which is ordinary base64 with a URL-safe alphabet and no padding. For HS256 the signature is HMAC-SHA256 over the string header.payload, keyed with a secret only the server holds.",
    "Signing proves integrity and origin: if any byte of the header or payload changes, the recomputed HMAC no longer matches, and nobody without the secret can produce a matching one. It does not provide secrecy. The payload is readable by anyone holding the token, so it must never contain passwords, secrets or personal data you would not print in a log. Asymmetric algorithms such as RS256 sign with a private key and verify with a public one, which lets other services verify tokens without being able to mint them.",
    "The trade-off of stateless verification is that the server cannot forget a token it already signed. An access token stays valid until exp, whatever happens in between. Production systems therefore keep access tokens short, on the order of minutes, and pair them with a long-lived refresh token that is stored server side and can be rotated and revoked.",
  ],
  howItWorks: [
    "Step 1: the client sends credentials to a login endpoint. The server looks the user up, compares the password with the stored hash, and builds the claims: sub, any application data such as a role, iat set to the current Unix time in seconds, and exp a fixed interval later.",
    "Step 2: the server base64url-encodes the JSON header and the JSON payload, computes HMAC-SHA256 over header.payload with its secret, base64url-encodes the digest, and joins the three parts with dots. It returns the token and stores nothing about it.",
    "Step 3: on a protected request the client presents the token, usually as Authorization: Bearer <token>. Middleware splits the token on the dots and recomputes the HMAC over the first two parts with the same secret, always using the algorithm the server expects rather than the one named in the header.",
    "Step 4: the recomputed digest is compared with the presented one using a constant-time comparison so response timing does not leak which byte differed. A mismatch means the token was forged or edited and the request is rejected with 401 before any claim is read.",
    "Step 5: once the signature passes, the payload is decoded and the time claims are checked: exp must be in the future and nbf, if present, must be in the past. A token whose signature is valid but whose exp has passed is rejected as expired.",
    "Step 6: the verified claims are attached to the request, for example as req.user, and the route handler uses them for authorization. When the access token expires, the client presents its refresh token, the server checks that token against its allow-list, rotates it, and issues a new access token; logout revokes the refresh token.",
  ],
  commonMistakes: [
    {
      title: "Treating the payload as private",
      explanation:
        "Base64url looks opaque, so developers put email addresses, internal ids, or even password hashes in the payload. Anyone who intercepts or is handed the token can decode it with a single function call.",
      fix: "Put only what the server needs to authorize the request in the claims, treat every claim as public, and use encryption (JWE) or a server-side lookup if data must stay secret.",
    },
    {
      title: "Letting the header choose the algorithm",
      explanation:
        "A verifier that reads alg from the token and dispatches on it can be tricked with alg none, which skips signing, or with an RS256 public key reused as an HS256 secret. Both let an attacker forge tokens the server accepts.",
      fix: "Hard-code the expected algorithm and key in the verifier and reject any token whose header does not match it.",
    },
    {
      title: "Expecting logout to invalidate access tokens",
      explanation:
        "Because verification is stateless, a signed access token keeps working until exp even after the user logs out or has their permissions removed. Long-lived access tokens turn this into a real security gap.",
      fix: "Keep access tokens short, revoke the refresh token on logout, and for sensitive actions re-check the database or a denylist keyed by the jti claim.",
    },
    {
      title: "Storing tokens in localStorage without weighing XSS",
      explanation:
        "localStorage is readable by any script running on the page, so a single XSS vulnerability hands the attacker a valid token. httpOnly cookies avoid that but are sent automatically, which reopens CSRF.",
      fix: "Keep the access token in memory and the refresh token in an httpOnly, secure, sameSite cookie scoped to the refresh path, and add CSRF protection wherever cookies carry auth.",
    },
  ],
  interviewQuestions: [
    {
      question: "What are the three parts of a JWT and what does each contain?",
      answer:
        "The header is JSON naming the algorithm and token type, such as alg HS256 and typ JWT. The payload is JSON holding claims like sub, iat, exp and application data. The signature is a MAC or digital signature over the base64url-encoded header and payload joined by a dot. All three are base64url-encoded and joined with dots.",
      codeExample: {
        language: "javascript",
        code: `const { createHmac } = require("crypto");
const b64url = (s) => Buffer.from(s).toString("base64url");

function sign(payload, secret) {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", secret)
    .update(\`\${header}.\${body}\`)
    .digest("base64url");
  return \`\${header}.\${body}.\${sig}\`;
}`,
      },
    },
    {
      question: "Does a JWT encrypt its contents?",
      answer:
        "No. A signed JWT (JWS) is encoded, not encrypted, and anyone holding it can decode the claims. The signature only guarantees the claims were not altered and were produced by a holder of the key. Confidential data needs JWE or must stay on the server.",
    },
    {
      question: "How does the server verify a token, and why does it compare signatures in constant time?",
      answer:
        "It splits the token, recomputes the HMAC over header.payload with its own secret and algorithm, and compares the result with the presented signature. A naive string comparison returns as soon as one byte differs, so an attacker can measure response times to discover the correct signature byte by byte. Comparing all bytes regardless of where they differ removes that side channel.",
      codeExample: {
        language: "javascript",
        code: `function verify(token, secret) {
  const [header, body, sig] = token.split(".");
  const expected = createHmac("sha256", secret)
    .update(\`\${header}.\${body}\`)
    .digest("base64url");
  if (expected.length !== sig.length ||
      !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) {
    throw new Error("invalid signature");
  }
  const payload = JSON.parse(Buffer.from(body, "base64url").toString());
  if (payload.exp <= Math.floor(Date.now() / 1000)) throw new Error("token expired");
  return payload;
}`,
      },
    },
    {
      question: "What is the difference between HS256 and RS256, and when would you pick each?",
      answer:
        "HS256 uses one shared secret for both signing and verification, so every service that verifies tokens could also forge them. RS256 signs with a private key and verifies with the matching public key, so verification can be spread across services or third parties without sharing signing power. HS256 is simpler and faster for a single backend; RS256 fits multi-service or federated setups.",
    },
    {
      question: "Why use refresh tokens if access tokens already carry an expiry?",
      answer:
        "An access token cannot be revoked before exp because the server holds no state for it, so it must be short-lived, which would force frequent logins on its own. A refresh token is long-lived but stored server side, so it can be checked, rotated on every use, and revoked at logout or on suspected theft. The pair gives fast stateless checks on most requests and a revocable anchor for the session.",
    },
  ],
  relatedTopicIds: ["http-request-lifecycle", "rate-limiting", "caching-strategies"],
};
