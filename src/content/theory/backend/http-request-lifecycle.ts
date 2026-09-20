import type { TopicTheoryContent } from "@/content/theory/types";

export const httpRequestLifecycleTheory: TopicTheoryContent = {
  summary:
    "The HTTP request lifecycle is everything that happens between a client calling fetch and the response body landing in its hands: DNS resolution, the TCP and TLS handshakes, the request on the wire, the server's middleware and handler, and the response coming back over a connection that usually stays open for the next call.",
  whatItIs: [
    "HTTP is a text-based request and response protocol layered on top of a reliable byte stream. A request is a method, a path, a version, a set of headers, and an optional body. A response is a status line, headers, and an optional body. Nothing about HTTP itself says how those bytes reach the other machine, which is why a single fetch call involves several lower layers before any HTTP text is exchanged.",
    "Before the first byte of HTTP can be sent the client needs an IP address (DNS), a connection (the TCP three-way handshake), and for https an encrypted channel with a verified peer (the TLS handshake). Each of these costs at least one network round trip, so on a 30 ms link a cold request spends roughly 20 ms on DNS, 30 ms on TCP, and 30 ms on TLS 1.3 before the request line even leaves the machine. Warm connections skip all three, which is why keep-alive and connection pooling matter so much.",
    "On the server the request is parsed into an object and passed through an ordered chain of functions. In Express-style frameworks these are middleware: each one can read or modify the request, end the response, or call next() to pass control on. The router is one of those functions; it matches the method and path pattern, fills route params, and invokes the handler. Handlers are usually async because they wait on a database or another service, and that await suspends only that one request while the event loop keeps serving others.",
    "The response carries a status code that classifies the outcome (2xx success, 3xx redirect, 4xx client error, 5xx server error) and headers that tell the client how to treat the body: its type, its length, whether it may be cached, and whether the connection can be reused. The client's promise resolves as soon as the headers are in; reading the body is a second asynchronous step because the body may still be streaming.",
  ],
  howItWorks: [
    "Step 1: the client parses the URL into scheme, host, port, and path, then resolves the host to an IP address. Browser and OS caches are checked first; on a miss a recursive resolver answers with an A or AAAA record and a TTL that controls how long the answer may be reused.",
    "Step 2: the client opens a TCP connection with SYN, SYN-ACK, ACK. This costs one round trip and gives HTTP an ordered, reliable byte stream. HTTP/3 replaces TCP with QUIC over UDP to fold this handshake into the TLS one.",
    "Step 3: for https the client sends a TLS ClientHello with its supported ciphers, an ephemeral key share, the server name (SNI), and ALPN protocol preferences. The server replies with its choice, its certificate chain, and its own key share. The client verifies the chain, both sides derive session keys, and TLS 1.3 completes this in one round trip where TLS 1.2 needed two.",
    "Step 4: the client writes the request line and headers into the encrypted stream. Host is required in HTTP/1.1 because many sites share one IP. Over HTTP/2 the same connection carries many requests at once as interleaved streams; over HTTP/1.1 a connection handles one request at a time and browsers open up to six per host.",
    "Step 5: the server's listener accepts the bytes, parses them into a request object, and walks the middleware chain: logging, body parsing, authentication, then the router. The matched handler does its work, typically awaiting a database query while the event loop handles other connections, then serialises a result and writes status, headers, and body.",
    "Step 6: the client receives the status line and headers, resolves the fetch promise with a Response, and streams the body. If the response says keep-alive the socket stays open for the next request; if the status is a redirect the client may follow it automatically; if Cache-Control allows, a future identical request may not touch the network at all.",
  ],
  commonMistakes: [
    {
      title: "Treating a 4xx or 5xx response as a rejected promise",
      explanation:
        "fetch only rejects on network failures such as DNS errors, refused connections, or CORS blocks. A 404 or 500 is a successfully delivered HTTP response, so the promise resolves and code that relies on catch alone silently continues with an error body.",
      fix: "Check res.ok or res.status after every fetch and throw or branch explicitly. Keep catch for transport failures, which are a different class of problem and usually deserve a different retry strategy.",
    },
    {
      title: "Forgetting to call next() or ending the response twice",
      explanation:
        "A middleware that neither ends the response nor calls next() leaves the request hanging until the client times out. The opposite mistake, writing to the response and then also falling through to another res.send, throws ERR_HTTP_HEADERS_SENT because headers were already flushed with the first body chunk.",
      fix: "Every middleware path must do exactly one of two things: end the response, or call next(). Use return res.status(...).json(...) so the function exits after responding, and pass errors with next(err) instead of throwing into the void.",
    },
    {
      title: "Blocking the event loop inside a handler",
      explanation:
        "An awaited database call costs the server almost nothing because the handler is suspended while I/O happens elsewhere. Synchronous CPU work such as a large JSON.parse, a tight loop, or a sync file read blocks the single thread, so every other in-flight request stalls until it finishes.",
      fix: "Keep handlers I/O-bound and asynchronous. Move heavy CPU work to a worker thread, a queue, or a separate service, and measure event loop lag in production so a regression shows up as latency on unrelated endpoints.",
    },
    {
      title: "Opening a fresh connection for every request",
      explanation:
        "DNS, TCP, and TLS together cost two to three round trips before any HTTP bytes flow. Clients that disable keep-alive, or servers that send Connection: close, pay that price on every call and add load to the TLS termination layer.",
      fix: "Leave keep-alive on, reuse a single agent or client instance with a connection pool for server-to-server calls, and prefer HTTP/2 where the origin supports it so many requests share one handshake.",
    },
  ],
  interviewQuestions: [
    {
      question:
        "What happens between calling fetch and the promise resolving on a cold connection?",
      answer:
        "The browser parses the URL, resolves the hostname through DNS, opens a TCP connection with a three-way handshake, negotiates TLS (one round trip for 1.3), sends the request line and headers, waits for the server to process the request, and resolves the promise as soon as the response status and headers have arrived. The body is read afterwards through a separate promise such as res.json().",
    },
    {
      question:
        "Why does an await inside an Express handler not block other requests?",
      answer:
        "The await suspends only that handler's function. The database driver has written the query to a socket and registered a callback; control returns to the event loop, which keeps accepting and serving other connections. When the reply arrives, the promise resolves and the handler continuation runs as a microtask. Only synchronous CPU work blocks the loop.",
      codeExample: {
        language: "javascript",
        code: `app.get('/products/:id', async (req, res) => {
  // Suspends this handler only; the event loop stays free.
  const product = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [req.params.id],
  );
  res.status(200).json(product);
});`,
      },
    },
    {
      question:
        "What is the difference between a 401 and a 403, and between a 301 and a 302?",
      answer:
        "401 Unauthorized means the request lacks valid credentials and should include a WWW-Authenticate header telling the client how to retry. 403 Forbidden means the credentials were fine but the action is not allowed. 301 Moved Permanently tells clients the resource has a new address and may be cached, so future requests skip the old URL. 302 Found is temporary and must not be cached; 307 and 308 are the variants that guarantee the method and body are preserved on the follow-up request.",
    },
    {
      question:
        "How does Express route an error to the error-handling middleware?",
      answer:
        "Calling next(err) with an argument tells Express to skip every remaining normal middleware and route handler and jump to the first middleware declared with four parameters (err, req, res, next). That handler logs the error and sends a response, usually a generic 500 so internal details never reach the client. In Express 5 a rejected promise from an async handler is forwarded to next automatically.",
      codeExample: {
        language: "javascript",
        code: `app.get('/products/:id', async (req, res, next) => {
  try {
    const product = await db.findProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    next(err); // jumps to the 4-arity handler below
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});`,
      },
    },
    {
      question:
        "What does keep-alive change about the cost of a second request, and how does HTTP/2 go further?",
      answer:
        "With keep-alive the TCP and TLS session stay open after the first response, so a second request to the same host skips DNS, the TCP handshake, and the TLS handshake and pays only one round trip plus server time. HTTP/2 multiplexes many requests as interleaved streams over that single connection, removing head-of-line blocking at the HTTP layer and the need for six parallel connections per host.",
    },
  ],
  relatedTopicIds: [
    "caching-strategies",
    "jwt-authentication",
    "rate-limiting",
    "event-loop",
    "promises",
  ],
};
