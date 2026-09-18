import type { PipelineStage } from "@/components/visualization-ui/PipelineDiagram";
import type { FlowMessage } from "@/components/visualization-ui/MessageFlow";
import type { HttpRequestExample, TableRow } from "./types";

/* ------------------------------------------------------------------ */
/* Small builders so every step is still a full snapshot               */
/* ------------------------------------------------------------------ */

type StageSpec = [id: string, label: string, detail?: string];

const buildStages = (
  specs: StageSpec[],
  activeId: string | null,
  doneIds: string[],
  skippedIds: string[] = [],
): PipelineStage[] =>
  specs.map(([id, label, detail]) => ({
    id,
    label,
    detail,
    status: skippedIds.includes(id)
      ? "skipped"
      : id === activeId
        ? "active"
        : doneIds.includes(id)
          ? "done"
          : "pending",
  }));

const msg = (
  id: string,
  from: string,
  to: string,
  label: string,
  detail: string,
  status: FlowMessage["status"] = "done",
): FlowMessage => ({ id, from, to, label, detail, status });

const row = (
  key: string,
  value: string,
  tone: TableRow["tone"] = "neutral",
): TableRow => ({ key, value, tone });

/* ------------------------------------------------------------------ */
/* Example 1: full round trip                                          */
/* ------------------------------------------------------------------ */

const TRIP: StageSpec[] = [
  ["dns", "DNS", "resolve host"],
  ["tcp", "TCP", "3-way handshake"],
  ["tls", "TLS", "1.3, 1 RTT"],
  ["request", "Request", "GET /products/42"],
  ["server", "Server", "route + query"],
  ["response", "Response", "200 OK"],
];

const REQUEST_HEADERS: TableRow[] = [
  row("request", "GET /products/42 HTTP/1.1", "done"),
  row("Host", "api.shop.dev", "done"),
  row("Accept", "application/json", "done"),
  row("Authorization", "Bearer eyJhbGciOi...", "done"),
];

const RESPONSE_HEADERS: TableRow[] = [
  row("status", "HTTP/1.1 200 OK", "done"),
  row("Content-Type", "application/json; charset=utf-8", "done"),
  row("Content-Length", "87", "done"),
  row("Cache-Control", "private, max-age=60", "done"),
  row("Connection", "keep-alive", "done"),
];

const tripMessages = {
  dnsQuery: msg("dns-q", "browser", "dns", "A? api.shop.dev", "recursive query"),
  dnsAnswer: msg("dns-a", "dns", "browser", "A 203.0.113.10", "TTL 300 s"),
  syn: msg("syn", "browser", "server", "SYN", "seq=0, port 443"),
  synAck: msg("syn-ack", "server", "browser", "SYN-ACK", "seq=0, ack=1"),
  ack: msg("ack", "browser", "server", "ACK", "connection open"),
  clientHello: msg("ch", "browser", "server", "ClientHello", "SNI, key share, ALPN"),
  serverHello: msg("sh", "server", "browser", "ServerHello", "cert, Finished"),
  finished: msg("fin", "browser", "server", "Finished", "keys derived"),
  request: msg("req", "browser", "server", "GET /products/42", "encrypted, 412 B"),
  response: msg("res", "server", "browser", "200 OK", "87 B JSON"),
};

const roundTrip: HttpRequestExample = {
  id: "roundtrip",
  title: "Full round trip",
  description:
    "One fetch call from the browser: DNS, TCP, TLS, the request, the server, and the response.",
  kind: "roundtrip",
  pipelineTitle: "Pipeline",
  pipelineOrientation: "horizontal",
  tableTitle: "Headers",
  actors: [
    { id: "browser", label: "Browser" },
    { id: "dns", label: "DNS" },
    { id: "server", label: "Server" },
  ],
  codeLines: [
    { num: 1, text: "const url = 'https://api.shop.dev/products/42';" },
    { num: 2, text: "" },
    { num: 3, text: "const res = await fetch(url, {" },
    { num: 4, text: "  headers: {" },
    { num: 5, text: "    Accept: 'application/json'," },
    { num: 6, text: "    Authorization: `Bearer ${token}`," },
    { num: 7, text: "  }," },
    { num: 8, text: "});" },
    { num: 9, text: "" },
    { num: 10, text: "console.log(res.status); // 200" },
    { num: 11, text: "console.log(res.headers.get('content-type'));" },
    { num: 12, text: "" },
    { num: 13, text: "const product = await res.json();" },
    { num: 14, text: "console.log(product.name);" },
  ],
  steps: [
    {
      descriptionHtml:
        '<code>fetch()</code> parses the URL into scheme <code>https</code>, host <code>api.shop.dev</code>, implicit port <code>443</code>, and path <code>/products/42</code>. It returns a <span class="hl-micro">pending promise</span> immediately; nothing has left the machine yet.',
      activeLine: 3,
      doneLines: [1],
      elapsed: "0 ms",
      stages: buildStages(TRIP, null, []),
      messages: [],
      activeActorId: "browser",
      tableRows: [
        row("scheme", "https", "active"),
        row("host", "api.shop.dev", "active"),
        row("port", "443 (default for https)", "active"),
        row("path", "/products/42", "active"),
      ],
    },
    {
      descriptionHtml:
        'The browser needs an IP address before it can open a socket. The in-memory DNS cache has no entry for <code>api.shop.dev</code>, so it sends a <span class="hl-api">recursive query</span> to the OS resolver.',
      activeLine: 3,
      doneLines: [1],
      elapsed: "1 ms",
      stages: buildStages(TRIP, "dns", []),
      messages: [{ ...tripMessages.dnsQuery, status: "active" }],
      activeActorId: "dns",
      tableRows: [
        row("cache", "miss for api.shop.dev", "failed"),
        row("resolver", "1.1.1.1 via OS stub resolver", "active"),
        row("record type", "A (IPv4)", "neutral"),
      ],
    },
    {
      descriptionHtml:
        'The resolver answers with an <strong>A record</strong>: <code>203.0.113.10</code>, TTL 300 seconds. The lookup cost about <span class="hl-stack">20 ms</span>, and the browser caches the answer so the next request to this host skips DNS entirely.',
      activeLine: 3,
      doneLines: [1],
      elapsed: "20 ms",
      stages: buildStages(TRIP, "dns", []),
      messages: [tripMessages.dnsQuery, { ...tripMessages.dnsAnswer, status: "active" }],
      activeActorId: "browser",
      tableRows: [
        row("A record", "203.0.113.10", "done"),
        row("TTL", "300 s", "done"),
        row("lookup time", "20 ms", "done"),
      ],
    },
    {
      descriptionHtml:
        'TCP gives HTTP a reliable, ordered byte stream. The browser sends a <span class="hl-api">SYN</span> to <code>203.0.113.10:443</code> with an initial sequence number; the server has not allocated a connection yet.',
      activeLine: 3,
      doneLines: [1],
      elapsed: "20 ms",
      stages: buildStages(TRIP, "tcp", ["dns"]),
      messages: [
        tripMessages.dnsQuery,
        tripMessages.dnsAnswer,
        { ...tripMessages.syn, status: "active" },
      ],
      activeActorId: "server",
      tableRows: [
        row("dst", "203.0.113.10:443", "active"),
        row("flags", "SYN", "active"),
        row("seq", "0 (relative)", "neutral"),
      ],
    },
    {
      descriptionHtml:
        'The server replies <span class="hl-api">SYN-ACK</span> and the browser sends the final <span class="hl-api">ACK</span>. The handshake costs one round trip, here <span class="hl-stack">30 ms</span>; the browser can attach data to that ACK, so the TLS handshake starts without waiting.',
      activeLine: 3,
      doneLines: [1],
      elapsed: "50 ms",
      stages: buildStages(TRIP, "tcp", ["dns"]),
      messages: [
        tripMessages.dnsQuery,
        tripMessages.dnsAnswer,
        tripMessages.syn,
        tripMessages.synAck,
        { ...tripMessages.ack, status: "active" },
      ],
      activeActorId: "browser",
      tableRows: [
        row("flags", "SYN-ACK then ACK", "done"),
        row("state", "ESTABLISHED", "done"),
        row("RTT", "30 ms", "done"),
      ],
    },
    {
      descriptionHtml:
        'TLS makes the bytes private and proves the server identity. The <span class="hl-api">ClientHello</span> carries the supported cipher suites, an ephemeral key share, the SNI <code>api.shop.dev</code>, and ALPN (<code>h2, http/1.1</code>) so both sides can pick HTTP/2 or HTTP/1.1.',
      activeLine: 3,
      doneLines: [1],
      elapsed: "50 ms",
      stages: buildStages(TRIP, "tls", ["dns", "tcp"]),
      messages: [
        tripMessages.dnsQuery,
        tripMessages.dnsAnswer,
        tripMessages.syn,
        tripMessages.synAck,
        tripMessages.ack,
        { ...tripMessages.clientHello, status: "active" },
      ],
      activeActorId: "server",
      tableRows: [
        row("version", "TLS 1.3", "active"),
        row("SNI", "api.shop.dev", "active"),
        row("key share", "x25519 public key", "active"),
        row("ALPN", "h2, http/1.1", "neutral"),
      ],
    },
    {
      descriptionHtml:
        'The <span class="hl-api">ServerHello</span> picks the cipher, returns its own key share and certificate chain, and is already encrypted after the first bytes. The browser verifies the chain against its root store, derives the session keys, and sends <code>Finished</code>. TLS 1.3 costs <span class="hl-stack">one RTT</span>; TLS 1.2 needed two.',
      activeLine: 3,
      doneLines: [1],
      elapsed: "80 ms",
      stages: buildStages(TRIP, "tls", ["dns", "tcp"]),
      messages: [
        tripMessages.dnsQuery,
        tripMessages.dnsAnswer,
        tripMessages.syn,
        tripMessages.synAck,
        tripMessages.ack,
        tripMessages.clientHello,
        tripMessages.serverHello,
        { ...tripMessages.finished, status: "active" },
      ],
      activeActorId: "browser",
      tableRows: [
        row("cipher", "TLS_AES_128_GCM_SHA256", "done"),
        row("certificate", "CN=api.shop.dev, valid", "done"),
        row("negotiated", "HTTP/1.1 (server offered no h2)", "done"),
        row("handshake", "1 RTT, 30 ms", "done"),
      ],
    },
    {
      descriptionHtml:
        'Now the actual HTTP request goes out, encrypted: the request line <code>GET /products/42 HTTP/1.1</code> plus headers. <code>Host</code> is mandatory in HTTP/1.1 because one IP can serve many sites; <code>Authorization</code> carries the bearer token from line 6.',
      activeLine: 6,
      doneLines: [1, 3, 4, 5],
      elapsed: "80 ms",
      stages: buildStages(TRIP, "request", ["dns", "tcp", "tls"]),
      messages: [
        tripMessages.dnsQuery,
        tripMessages.dnsAnswer,
        tripMessages.syn,
        tripMessages.synAck,
        tripMessages.ack,
        tripMessages.clientHello,
        tripMessages.serverHello,
        tripMessages.finished,
        { ...tripMessages.request, status: "active" },
      ],
      activeActorId: "server",
      tableRows: REQUEST_HEADERS.map((r) => ({ ...r, tone: "active" as const })),
    },
    {
      descriptionHtml:
        'The bytes arrive after half an RTT. The server parses the request, matches the route <code>GET /products/:id</code>, validates the token, and runs the database query. Processing takes about <span class="hl-stack">15 ms</span>; the browser is idle, and its <span class="hl-loop">event loop</span> keeps running other work.',
      activeLine: 8,
      doneLines: [1, 3, 4, 5, 6, 7],
      elapsed: "110 ms",
      stages: buildStages(TRIP, "server", ["dns", "tcp", "tls", "request"]),
      messages: [
        tripMessages.dnsQuery,
        tripMessages.dnsAnswer,
        tripMessages.syn,
        tripMessages.synAck,
        tripMessages.ack,
        tripMessages.clientHello,
        tripMessages.serverHello,
        tripMessages.finished,
        tripMessages.request,
      ],
      activeActorId: "server",
      tableRows: REQUEST_HEADERS,
    },
    {
      descriptionHtml:
        'The server writes the status line <code>200 OK</code> and response headers. <code>Content-Length: 87</code> tells the browser exactly where the body ends, and <code>Cache-Control: private, max-age=60</code> lets this browser reuse the response for a minute without asking again.',
      activeLine: 8,
      doneLines: [1, 3, 4, 5, 6, 7],
      elapsed: "125 ms",
      stages: buildStages(TRIP, "response", ["dns", "tcp", "tls", "request", "server"]),
      messages: [
        tripMessages.dnsQuery,
        tripMessages.dnsAnswer,
        tripMessages.syn,
        tripMessages.synAck,
        tripMessages.ack,
        tripMessages.clientHello,
        tripMessages.serverHello,
        tripMessages.finished,
        tripMessages.request,
        { ...tripMessages.response, status: "active" },
      ],
      activeActorId: "browser",
      tableRows: RESPONSE_HEADERS.map((r) => ({ ...r, tone: "active" as const })),
    },
    {
      descriptionHtml:
        'As soon as the headers are in, the <span class="hl-micro">fetch promise resolves</span> with a <code>Response</code> whose body is still a stream. The TCP and TLS session stay open (<code>Connection: keep-alive</code>), so the next request to this host skips DNS, TCP, and TLS and pays only one RTT.',
      activeLine: 10,
      doneLines: [1, 3, 4, 5, 6, 7, 8],
      elapsed: "125 ms",
      stages: buildStages(TRIP, null, ["dns", "tcp", "tls", "request", "server", "response"]),
      messages: [
        tripMessages.dnsQuery,
        tripMessages.dnsAnswer,
        tripMessages.syn,
        tripMessages.synAck,
        tripMessages.ack,
        tripMessages.clientHello,
        tripMessages.serverHello,
        tripMessages.finished,
        tripMessages.request,
        tripMessages.response,
      ],
      activeActorId: "browser",
      tableRows: [
        row("res.status", "200", "done"),
        row("res.ok", "true", "done"),
        row("content-type", "application/json; charset=utf-8", "done"),
        row("connection", "kept alive for reuse", "done"),
      ],
    },
    {
      descriptionHtml:
        '<code>res.json()</code> reads the remaining 87 bytes off the socket, decodes them as UTF-8, and runs <code>JSON.parse</code>. It returns a second promise because the body can still be in flight; with HTTP/2 several such requests would share this one connection as interleaved streams.',
      activeLine: 13,
      doneLines: [1, 3, 4, 5, 6, 7, 8, 10, 11],
      elapsed: "126 ms",
      stages: buildStages(TRIP, null, ["dns", "tcp", "tls", "request", "server", "response"]),
      messages: [
        tripMessages.dnsQuery,
        tripMessages.dnsAnswer,
        tripMessages.syn,
        tripMessages.synAck,
        tripMessages.ack,
        tripMessages.clientHello,
        tripMessages.serverHello,
        tripMessages.finished,
        tripMessages.request,
        tripMessages.response,
      ],
      activeActorId: "browser",
      tableRows: [
        row("body", '{"id":42,"name":"Desk Lamp","price":39.9,...}', "done"),
        row("bytes read", "87 of 87", "done"),
        row("product.name", '"Desk Lamp"', "done"),
        row("total time", "126 ms (DNS 20, TCP 30, TLS 30, request 45)", "done"),
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Example 2: inside the server                                        */
/* ------------------------------------------------------------------ */

const CHAIN: StageSpec[] = [
  ["listener", "Listener", "parse request"],
  ["logger", "logger", "app.use"],
  ["json", "express.json", "body parser"],
  ["auth", "auth", "bearer token"],
  ["router", "Router", "GET /products/:id"],
  ["handler", "Handler", "await db.query"],
  ["response", "Response", "res.json"],
];

const baseRequest = (extra: TableRow[] = []): TableRow[] => [
  row("method", "GET"),
  row("path", "/products/42"),
  row("headers.host", "api.shop.dev"),
  row("headers.authorization", "Bearer eyJhbGciOi..."),
  ...extra,
];

const serverMessages = {
  request: msg("req", "client", "server", "GET /products/42", "conn #1"),
  query: msg("q", "server", "db", "SELECT ... WHERE id = $1", "[42]"),
  health: msg("h", "client", "server", "GET /health", "conn #2, while waiting"),
  healthRes: msg("h-res", "server", "client", "200 OK", "conn #2, 0.3 ms"),
  result: msg("q-res", "db", "server", "1 row", "12 ms"),
  response: msg("res", "server", "client", "200 OK", "87 B JSON, conn #1"),
};

const insideServer: HttpRequestExample = {
  id: "server",
  title: "Inside the server",
  description:
    "An Express app takes the request through middleware, the router, an awaited database query, and back out.",
  kind: "server",
  pipelineTitle: "Middleware Chain",
  pipelineOrientation: "vertical",
  tableTitle: "Request Object",
  actors: [
    { id: "client", label: "Client" },
    { id: "server", label: "Server" },
    { id: "db", label: "Database" },
  ],
  codeLines: [
    { num: 1, text: "const app = express();" },
    { num: 2, text: "app.use(logger);" },
    { num: 3, text: "app.use(express.json());" },
    { num: 4, text: "app.use(auth); // reads the Bearer token" },
    { num: 5, text: "" },
    { num: 6, text: "app.get('/products/:id', async (req, res) => {" },
    { num: 7, text: "  const product = await db.query(" },
    { num: 8, text: "    'SELECT * FROM products WHERE id = $1'," },
    { num: 9, text: "    [req.params.id]," },
    { num: 10, text: "  );" },
    { num: 11, text: "  res.status(200).json(product);" },
    { num: 12, text: "});" },
    { num: 13, text: "" },
    { num: 14, text: "app.listen(3000);" },
  ],
  steps: [
    {
      descriptionHtml:
        'The listening socket accepts the connection and Node\'s HTTP parser turns the raw bytes into a <code>req</code> object: method, URL, and a lowercased headers map. Express wraps it and starts walking the <span class="hl-api">middleware stack</span> in registration order.',
      activeLine: 14,
      doneLines: [1, 2, 3, 4, 6],
      elapsed: "t+0.0 ms",
      stages: buildStages(CHAIN, "listener", []),
      messages: [{ ...serverMessages.request, status: "active" }],
      activeActorId: "server",
      tableRows: baseRequest([row("body", "undefined", "muted")]).map((r, i) =>
        i < 2 ? { ...r, tone: "active" as const } : r,
      ),
    },
    {
      descriptionHtml:
        'The <code>logger</code> middleware runs first because it was registered first. It records <code>GET /products/42</code> with a start timestamp and calls <span class="hl-task">next()</span>; without that call the request would hang forever.',
      activeLine: 2,
      doneLines: [1, 14],
      elapsed: "t+0.1 ms",
      stages: buildStages(CHAIN, "logger", ["listener"]),
      messages: [serverMessages.request],
      activeActorId: "server",
      tableRows: baseRequest([
        row("body", "undefined", "muted"),
        row("startedAt", "1726650000123", "active"),
      ]),
    },
    {
      descriptionHtml:
        '<code>express.json()</code> checks <code>Content-Type</code>. A GET has no body and no JSON content type, so the parser does nothing and calls <code>next()</code>; <code>req.body</code> stays an empty object.',
      activeLine: 3,
      doneLines: [1, 2, 14],
      elapsed: "t+0.1 ms",
      stages: buildStages(CHAIN, "json", ["listener", "logger"]),
      messages: [serverMessages.request],
      activeActorId: "server",
      tableRows: baseRequest([
        row("body", "{} (no Content-Type, nothing parsed)", "active"),
        row("startedAt", "1726650000123"),
      ]),
    },
    {
      descriptionHtml:
        'The <code>auth</code> middleware reads the <code>Authorization</code> header, strips the <code>Bearer</code> prefix, verifies the token signature and expiry, and attaches <span class="hl-task">req.user</span>. Downstream code can now trust that field.',
      activeLine: 4,
      doneLines: [1, 2, 3, 14],
      elapsed: "t+0.4 ms",
      stages: buildStages(CHAIN, "auth", ["listener", "logger", "json"]),
      messages: [serverMessages.request],
      activeActorId: "server",
      tableRows: baseRequest([
        row("body", "{}"),
        row("user", "{ id: 7, role: 'customer' }", "active"),
      ]),
    },
    {
      descriptionHtml:
        'The router compares method and path against each registered route. <code>/products/:id</code> is compiled to a regex; it matches <code>/products/42</code> and fills <span class="hl-api">req.params.id = "42"</span>. Params are always strings.',
      activeLine: 6,
      doneLines: [1, 2, 3, 4, 14],
      elapsed: "t+0.5 ms",
      stages: buildStages(CHAIN, "router", ["listener", "logger", "json", "auth"]),
      messages: [serverMessages.request],
      activeActorId: "server",
      tableRows: baseRequest([
        row("body", "{}"),
        row("user", "{ id: 7, role: 'customer' }"),
        row("params", '{ id: "42" }', "active"),
      ]),
    },
    {
      descriptionHtml:
        'The handler calls <code>db.query</code> with a parameterised statement. The driver writes the query to the database socket and returns a <span class="hl-micro">promise</span>; <code>await</code> suspends the handler and hands control back to the event loop.',
      activeLine: 7,
      doneLines: [1, 2, 3, 4, 6, 14],
      elapsed: "t+0.6 ms",
      stages: buildStages(CHAIN, "handler", ["listener", "logger", "json", "auth", "router"]),
      messages: [serverMessages.request, { ...serverMessages.query, status: "active" }],
      activeActorId: "db",
      tableRows: baseRequest([
        row("body", "{}"),
        row("user", "{ id: 7, role: 'customer' }"),
        row("params", '{ id: "42" }'),
        row("handler state", "suspended at await", "active"),
      ]),
    },
    {
      descriptionHtml:
        'While the query is in flight, the <span class="hl-loop">event loop</span> is free. A second connection sends <code>GET /health</code> and the server answers it in 0.3 ms. Nothing blocked: the first request is just a suspended function waiting for I/O.',
      activeLine: 7,
      doneLines: [1, 2, 3, 4, 6, 14],
      elapsed: "t+4.0 ms",
      stages: buildStages(CHAIN, "handler", ["listener", "logger", "json", "auth", "router"]),
      messages: [
        serverMessages.request,
        serverMessages.query,
        { ...serverMessages.health, status: "active" },
        { ...serverMessages.healthRes, status: "active" },
      ],
      activeActorId: "server",
      tableRows: baseRequest([
        row("body", "{}"),
        row("user", "{ id: 7, role: 'customer' }"),
        row("params", '{ id: "42" }'),
        row("handler state", "suspended, query pending 3.4 ms", "active"),
      ]),
    },
    {
      descriptionHtml:
        'The database returns one row after 12 ms. The driver resolves the promise, the continuation is queued as a <span class="hl-micro">microtask</span>, and the handler resumes on line 10 with <code>product</code> filled in.',
      activeLine: 10,
      doneLines: [1, 2, 3, 4, 6, 7, 8, 9, 14],
      elapsed: "t+12.6 ms",
      stages: buildStages(CHAIN, "handler", ["listener", "logger", "json", "auth", "router"]),
      messages: [
        serverMessages.request,
        serverMessages.query,
        serverMessages.health,
        serverMessages.healthRes,
        { ...serverMessages.result, status: "active" },
      ],
      activeActorId: "server",
      tableRows: baseRequest([
        row("body", "{}"),
        row("user", "{ id: 7, role: 'customer' }"),
        row("params", '{ id: "42" }'),
        row("product", '{ id: 42, name: "Desk Lamp", price: 39.9 }', "done"),
      ]),
    },
    {
      descriptionHtml:
        '<code>res.status(200).json(product)</code> runs <code>JSON.stringify</code>, sets <code>Content-Type: application/json; charset=utf-8</code> and <code>Content-Length: 87</code>, then calls <code>res.end</code>. Headers are flushed with the first body chunk, so no header can change after this point.',
      activeLine: 11,
      doneLines: [1, 2, 3, 4, 6, 7, 8, 9, 10, 14],
      elapsed: "t+12.8 ms",
      stages: buildStages(CHAIN, "response", ["listener", "logger", "json", "auth", "router", "handler"]),
      messages: [
        serverMessages.request,
        serverMessages.query,
        serverMessages.health,
        serverMessages.healthRes,
        serverMessages.result,
        { ...serverMessages.response, status: "active" },
      ],
      activeActorId: "client",
      tableRows: [
        row("res.statusCode", "200", "active"),
        row("Content-Type", "application/json; charset=utf-8", "active"),
        row("Content-Length", "87", "active"),
        row("headersSent", "true", "active"),
      ],
    },
    {
      descriptionHtml:
        'The response is on the wire and the logger\'s <code>finish</code> listener records 12.8 ms. The socket stays open under <span class="hl-task">keep-alive</span>, so the same client can send its next request without a new handshake, and the server can hold thousands of these idle sockets cheaply.',
      activeLine: null,
      doneLines: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14],
      elapsed: "t+12.8 ms",
      stages: buildStages(CHAIN, null, ["listener", "logger", "json", "auth", "router", "handler", "response"]),
      messages: [
        serverMessages.request,
        serverMessages.query,
        serverMessages.health,
        serverMessages.healthRes,
        serverMessages.result,
        serverMessages.response,
      ],
      activeActorId: "client",
      tableRows: [
        row("log", "GET /products/42 200 12.8 ms", "done"),
        row("socket", "idle, keep-alive timeout 5 s", "done"),
        row("event loop", "free", "done"),
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Example 3: errors and status codes                                  */
/* ------------------------------------------------------------------ */

const ERR: StageSpec[] = [
  ["listener", "Listener", "parse request"],
  ["auth", "auth", "bearer token"],
  ["router", "Router", "match route"],
  ["handler", "Handler", "try / await"],
  ["db", "Database", "findProduct"],
  ["error", "Error handler", "(err, req, res, next)"],
  ["response", "Response", "status + body"],
];

const errorsAndCodes: HttpRequestExample = {
  id: "errors",
  title: "Errors and status codes",
  description:
    "The same route returning 404, 401, 500, and a 301 redirect that fetch follows on its own.",
  kind: "errors",
  pipelineTitle: "Middleware Chain",
  pipelineOrientation: "vertical",
  tableTitle: "Response",
  actors: [
    { id: "client", label: "Client" },
    { id: "server", label: "Server" },
    { id: "db", label: "Database" },
  ],
  codeLines: [
    { num: 1, text: "app.get('/products/:id', async (req, res, next) => {" },
    { num: 2, text: "  try {" },
    { num: 3, text: "    const product = await db.findProduct(req.params.id);" },
    { num: 4, text: "    if (!product) {" },
    { num: 5, text: "      return res.status(404).json({ error: 'Not found' });" },
    { num: 6, text: "    }" },
    { num: 7, text: "    res.json(product);" },
    { num: 8, text: "  } catch (err) {" },
    { num: 9, text: "    next(err);" },
    { num: 10, text: "  }" },
    { num: 11, text: "});" },
    { num: 12, text: "" },
    { num: 13, text: "app.get('/items/:id', (req, res) => {" },
    { num: 14, text: "  res.redirect(301, `/products/${req.params.id}`);" },
    { num: 15, text: "});" },
    { num: 16, text: "" },
    { num: 17, text: "app.use((err, req, res, next) => {" },
    { num: 18, text: "  console.error(err);" },
    { num: 19, text: "  res.status(500).json({ error: 'Internal Server Error' });" },
    { num: 20, text: "});" },
  ],
  steps: [
    {
      descriptionHtml:
        '<strong>404.</strong> <code>GET /products/999</code> passes auth and matches the route. The handler awaits <code>db.findProduct("999")</code>; the query runs fine but no row has that id, so it resolves to <code>null</code>.',
      activeLine: 3,
      doneLines: [1, 2],
      stages: buildStages(ERR, "db", ["listener", "auth", "router", "handler"]),
      messages: [
        msg("r1", "client", "server", "GET /products/999", "valid token"),
        msg("q1", "server", "db", "findProduct(999)", "", "active"),
        msg("q1r", "db", "server", "null", "0 rows", "active"),
      ],
      activeActorId: "db",
      tableRows: [row("status", "not sent yet", "muted")],
    },
    {
      descriptionHtml:
        'A missing resource is a <span class="hl-api">client-side 4xx</span>, not a server fault. The handler sends <code>404 Not Found</code> with a JSON body and <code>return</code>s so line 7 cannot also write to the response, which would throw <code>ERR_HTTP_HEADERS_SENT</code>.',
      activeLine: 5,
      doneLines: [1, 2, 3, 4],
      stages: buildStages(ERR, "response", ["listener", "auth", "router", "handler", "db"], ["error"]),
      messages: [
        msg("r1", "client", "server", "GET /products/999", "valid token"),
        msg("q1", "server", "db", "findProduct(999)", ""),
        msg("q1r", "db", "server", "null", "0 rows"),
        msg("s1", "server", "client", "404 Not Found", "application/json", "failed"),
      ],
      activeActorId: "client",
      tableRows: [
        row("status", "404 Not Found", "failed"),
        row("Content-Type", "application/json; charset=utf-8", "active"),
        row("body", '{ "error": "Not found" }', "active"),
        row("res.ok", "false (fetch does not reject)", "neutral"),
      ],
    },
    {
      descriptionHtml:
        '<strong>401.</strong> A new request arrives for <code>/products/42</code>, but the bearer token expired ten minutes ago. The <code>auth</code> middleware fails verification before the router ever sees the request.',
      activeLine: null,
      doneLines: [],
      stages: buildStages(ERR, "auth", ["listener"]),
      messages: [
        msg("r2", "client", "server", "GET /products/42", "expired token", "active"),
      ],
      activeActorId: "server",
      tableRows: [
        row("token exp", "1726649400 (10 min ago)", "failed"),
        row("verify", "TokenExpiredError", "failed"),
      ],
    },
    {
      descriptionHtml:
        'The middleware responds <code>401 Unauthorized</code> itself and never calls <code>next()</code>, so the router, handler, and database are <span class="hl-stack">skipped</span>. The <code>WWW-Authenticate</code> header is what makes a 401 well-formed: it tells the client which scheme to retry with.',
      activeLine: null,
      doneLines: [],
      stages: buildStages(ERR, "response", ["listener", "auth"], ["router", "handler", "db", "error"]),
      messages: [
        msg("r2", "client", "server", "GET /products/42", "expired token"),
        msg("s2", "server", "client", "401 Unauthorized", "WWW-Authenticate", "failed"),
      ],
      activeActorId: "client",
      tableRows: [
        row("status", "401 Unauthorized", "failed"),
        row("WWW-Authenticate", 'Bearer realm="api", error="invalid_token"', "active"),
        row("body", '{ "error": "Token expired" }', "active"),
        row("next()", "not called", "muted"),
      ],
    },
    {
      descriptionHtml:
        '<strong>500.</strong> A third request with a fresh token reaches the handler, but the database connection pool is exhausted and <code>db.findProduct</code> <span class="hl-stack">rejects</span>. Because the call is awaited inside <code>try</code>, the rejection surfaces as a thrown error.',
      activeLine: 3,
      doneLines: [1, 2],
      stages: buildStages(ERR, "db", ["listener", "auth", "router", "handler"]),
      messages: [
        msg("r3", "client", "server", "GET /products/42", "fresh token"),
        msg("q3", "server", "db", "findProduct(42)", ""),
        msg("q3r", "db", "server", "ECONNREFUSED", "pool exhausted", "failed"),
      ],
      activeActorId: "db",
      tableRows: [
        row("error", "Error: connect ECONNREFUSED 10.0.0.5:5432", "failed"),
        row("status", "not sent yet", "muted"),
      ],
    },
    {
      descriptionHtml:
        'The <code>catch</code> block calls <span class="hl-api">next(err)</span>. Passing an argument to <code>next</code> tells Express to skip every remaining normal middleware and jump to the first handler declared with four parameters. In Express 5 an async rejection reaches this path even without the try/catch.',
      activeLine: 9,
      doneLines: [1, 2, 3, 8],
      stages: buildStages(ERR, "error", ["listener", "auth", "router", "handler", "db"]),
      messages: [
        msg("r3", "client", "server", "GET /products/42", "fresh token"),
        msg("q3", "server", "db", "findProduct(42)", ""),
        msg("q3r", "db", "server", "ECONNREFUSED", "pool exhausted", "failed"),
      ],
      activeActorId: "server",
      tableRows: [
        row("next(err)", "routing to error middleware", "active"),
        row("skipped", "lines 4 to 7", "muted"),
      ],
    },
    {
      descriptionHtml:
        'The error middleware logs the full stack to stderr where an operator can see it. That detail must stay on the server: sending stack traces or SQL to the client leaks internals.',
      activeLine: 18,
      doneLines: [1, 2, 3, 8, 9, 17],
      stages: buildStages(ERR, "error", ["listener", "auth", "router", "handler", "db"]),
      messages: [
        msg("r3", "client", "server", "GET /products/42", "fresh token"),
        msg("q3", "server", "db", "findProduct(42)", ""),
        msg("q3r", "db", "server", "ECONNREFUSED", "pool exhausted", "failed"),
      ],
      activeActorId: "server",
      tableRows: [
        row("stderr", "Error: connect ECONNREFUSED ... at Pool.connect", "failed"),
        row("status", "not sent yet", "muted"),
      ],
    },
    {
      descriptionHtml:
        'It responds <code>500 Internal Server Error</code> with a generic JSON body. A 5xx says the server, not the request, was at fault, so a client may safely retry a GET; monitoring counts 5xx separately from 4xx for exactly that reason.',
      activeLine: 19,
      doneLines: [1, 2, 3, 8, 9, 17, 18],
      stages: buildStages(ERR, "response", ["listener", "auth", "router", "handler", "db", "error"]),
      messages: [
        msg("r3", "client", "server", "GET /products/42", "fresh token"),
        msg("q3", "server", "db", "findProduct(42)", ""),
        msg("q3r", "db", "server", "ECONNREFUSED", "pool exhausted", "failed"),
        msg("s3", "server", "client", "500 Internal Server Error", "generic body", "failed"),
      ],
      activeActorId: "client",
      tableRows: [
        row("status", "500 Internal Server Error", "failed"),
        row("Content-Type", "application/json; charset=utf-8", "active"),
        row("body", '{ "error": "Internal Server Error" }', "active"),
        row("retry", "safe for GET (idempotent)", "neutral"),
      ],
    },
    {
      descriptionHtml:
        '<strong>301.</strong> An old link requests <code>GET /items/42</code>. The legacy route still exists, but only to tell clients where the resource moved.',
      activeLine: 13,
      doneLines: [],
      stages: buildStages(ERR, "router", ["listener", "auth"]),
      messages: [
        msg("r4", "client", "server", "GET /items/42", "legacy path", "active"),
      ],
      activeActorId: "server",
      tableRows: [
        row("matched", "GET /items/:id", "active"),
        row("params", '{ id: "42" }', "neutral"),
      ],
    },
    {
      descriptionHtml:
        '<code>res.redirect(301, ...)</code> sets <code>Location: /products/42</code> and a <span class="hl-api">301 Moved Permanently</span> status with a tiny body. Permanent means the browser may cache the redirect and skip asking next time; a 302 or 307 would not be cached.',
      activeLine: 14,
      doneLines: [13],
      stages: buildStages(ERR, "response", ["listener", "auth", "router"], ["handler", "db", "error"]),
      messages: [
        msg("r4", "client", "server", "GET /items/42", "legacy path"),
        msg("s4", "server", "client", "301 Moved Permanently", "Location: /products/42", "active"),
      ],
      activeActorId: "client",
      tableRows: [
        row("status", "301 Moved Permanently", "active"),
        row("Location", "/products/42", "active"),
        row("Content-Length", "48", "neutral"),
        row("cacheable", "yes, permanent", "neutral"),
      ],
    },
    {
      descriptionHtml:
        '<code>fetch</code> defaults to <code>redirect: "follow"</code>, so the browser resolves the relative <code>Location</code> against the current origin and sends <code>GET /products/42</code> on the same <span class="hl-task">keep-alive</span> connection. The JavaScript caller never sees the 301.',
      activeLine: 1,
      doneLines: [13, 14, 15],
      stages: buildStages(ERR, "handler", ["listener", "auth", "router"]),
      messages: [
        msg("r4", "client", "server", "GET /items/42", "legacy path"),
        msg("s4", "server", "client", "301 Moved Permanently", "Location: /products/42"),
        msg("r5", "client", "server", "GET /products/42", "auto-follow, same socket", "active"),
        msg("q5", "server", "db", "findProduct(42)", "", "active"),
      ],
      activeActorId: "server",
      tableRows: [
        row("followed", "1 of max 20 redirects", "active"),
        row("new URL", "https://api.shop.dev/products/42", "active"),
      ],
    },
    {
      descriptionHtml:
        'The product exists this time, so line 7 sends <code>200 OK</code>. The resolved <code>Response</code> reports <code>redirected: true</code> and <code>url</code> pointing at the final address, which is how the caller can detect that a hop happened.',
      activeLine: 7,
      doneLines: [1, 2, 3, 4, 6, 13, 14, 15],
      stages: buildStages(ERR, "response", ["listener", "auth", "router", "handler", "db"], ["error"]),
      messages: [
        msg("r4", "client", "server", "GET /items/42", "legacy path"),
        msg("s4", "server", "client", "301 Moved Permanently", "Location: /products/42"),
        msg("r5", "client", "server", "GET /products/42", "auto-follow, same socket"),
        msg("q5", "server", "db", "findProduct(42)", ""),
        msg("q5r", "db", "server", "1 row", "Desk Lamp"),
        msg("s5", "server", "client", "200 OK", "87 B JSON", "active"),
      ],
      activeActorId: "client",
      tableRows: [
        row("status", "200 OK", "done"),
        row("res.redirected", "true", "done"),
        row("res.url", "https://api.shop.dev/products/42", "done"),
        row("body", '{ "id": 42, "name": "Desk Lamp", ... }', "done"),
      ],
    },
  ],
};

export const EXAMPLES: HttpRequestExample[] = [
  roundTrip,
  insideServer,
  errorsAndCodes,
];
