# Custom HTTP Server for Merchanix

A lightweight, high-performance HTTP server built on top of Deno with React SSR support, middleware capabilities, static file serving, intelligent route caching, rate limiting, cookie handling, JWT authentication, CORS support, CSRF protection, security headers, input sanitization, and compression.

## Features

### ✅ Current Features
- 🚀 **High Performance**: ~90,870+ requests/sec (92.5% of native Deno performance)
- 🎯 **Route Caching**: Automatic URL pattern matching cache with configurable size limits
- 🔧 **Middleware Support**: Express-style middleware with async/await support
- 🛡️ **Rate Limiting**: IP-based rate limiting with Deno KV storage
- 🍪 **Cookie Handling**: Parse incoming cookies and set outgoing Set-Cookie headers
- 🔐 **JWT Authentication**: Secure token-based authentication with cookie and header support
- 🌐 **CORS Support**: Configurable cross-origin resource sharing middleware
- 🛡️ **CSRF Protection**: Double-submit cookie token validation middleware
- 🛡️ **Security Headers**: HSTS, CSP, X-Frame-Options middleware
- 🛡️ **Input Sanitization**: XSS and SQL injection protection middleware
- 📦 **Compression**: Gzip/Brotli response compression middleware
- ⚛️ **React SSR**: Built-in React server-side rendering with `renderToString` (injected via middleware)
- 📦 **Zero Dependencies**: Uses only Deno standard library, React, and jose for JWT
- 🎨 **Type Safe**: Full TypeScript support with strict typing
- 🛣️ **Dynamic Routes**: URL parameter extraction (e.g., `/users/:id`)
- 🔍 **Query Parameters**: Built-in query string parsing
- 🗂️ **Static File Serving**: Serve static files from a directory with automatic content-type detection

### ❌ TODO: E-commerce Features

#### Security (Priority High)
- [x] **Rate Limiting**: Per-IP/per-user request limits
- [x] **Session Management**: JWT authentication with cookie support
- [x] **CORS Support**: Cross-origin configuration
- [x] **CSRF Protection**: Token validation middleware
- [x] **Security Headers**: HSTS, CSP, X-Frame-Options middleware
- [x] **Input Sanitization**: XSS/SQL injection protection

#### Request Handling
- [x] **Cookie Parser**: Cookie read/write utilities
- [ ] **Request Body Parsing**: Built-in JSON/form/multipart parsing helper
- [ ] **File Upload**: Multipart form data handling with validation
- [x] **Compression**: Gzip/Brotli response compression
- [ ] **ETag Support**: Automatic ETag generation
- [ ] **Cache-Control**: Built-in cache header management

#### API Features
- [ ] **Pagination Helper**: Built-in pagination utilities
- [ ] **Error Handling**: Centralized error handler middleware
- [ ] **Validation**: Request/response validation middleware
- [ ] **API Versioning**: URL versioning support (`/v1/`, `/v2/`)

#### E-commerce Specific
- [ ] **Webhook Handler**: Payment gateway webhook support
- [ ] **Idempotency Keys**: Prevent duplicate orders/payments
- [ ] **WebSocket/SSE**: Real-time updates (order status, stock)

#### Monitoring & Logging
- [ ] **Health Check**: `/health`, `/readiness` endpoints
- [ ] **Metrics**: `/metrics` endpoint for Prometheus
- [ ] **Structured Logging**: JSON logs with correlation IDs
- [ ] **Request Tracing**: Distributed tracing support

#### Performance
- [ ] **HTTP/2 Support**: Server push, multiplexing
- [ ] **Connection Pooling**: Keep-alive optimization
- [ ] **Response Streaming**: Large file streaming

## Installation

```typescript
import core from "./core/server.ts";
import { cookieMiddleware } from "./middlewares/cookie.ts";
import { jwtMiddleware, createJWT } from "./middlewares/jwt.ts";
import { cors } from "./middlewares/cors.ts";
import { csrf } from "./middlewares/csrf.ts";
import { securityHeaders } from "./middlewares/securityHeaders.ts";
import { inputSanitization } from "./middlewares/inputSanitization.ts";
import { compression } from "./middlewares/compression.ts";
import { renderMiddleware } from "./middlewares/render.ts"; // For React SSR
```

## Quick Start

```typescript
import core from "./core/server.ts";
import { cookieMiddleware } from "./middlewares/cookie.ts";

// Register cookie middleware
core.use(cookieMiddleware);

// Simple route
core.get("/", () => {
  return new Response("Hello, world");
});

// Route with parameters
core.get("/users/:id", (_, ctx) => {
  return new Response(`User ID: ${ctx.params.id}`);
});

// Route with query parameters
core.get("/search", (_, ctx) => {
  const query = ctx.query.q || "";
  return new Response(`Search: ${query}`);
});

// Serve static files from "./public" at "/static"
core.static("/static", "./public");

// Start server
core.serve({ port: 8000 });
```

## API Reference

### Route Methods

#### `core.get(path, handler, ...middlewares)`
Register a GET route.

```typescript
core.get("/api/users/:id", (req, ctx) => {
  return new Response(`User: ${ctx.params.id}`);
});
```

#### `core.post(path, handler, ...middlewares)`
Register a POST route.

```typescript
core.post("/api/users", async (req, ctx) => {
  const body = await req.json();
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" }
  });
});
```

#### `core.put(path, handler, ...middlewares)`
Register a PUT route.

#### `core.delete(path, handler, ...middlewares)`
Register a DELETE route.

### Static File Serving

#### `core.static(urlPrefix, dirPath)`
Serve static files from a directory at a given URL prefix.

```typescript
core.static("/static", "./public");
```

- Requests to `/static/foo.js` will serve `./public/foo.js`
- Content-Type is set automatically based on file extension
- Directory requests (e.g., `/static/`) serve `index.html` if present

### Middleware

#### `core.use(middleware)`
Register global middleware that applies to all routes.

```typescript
// Logging middleware
core.use(async (req, ctx, next) => {
  const start = performance.now();
  const response = await next();
  
  queueMicrotask(() => {
    const duration = performance.now() - start;
    console.log(`${req.method} ${req.url} - ${duration.toFixed(2)}ms`);
  });
  
  return response;
});
```

#### Route-specific Middleware

```typescript
const authMiddleware = (req, ctx, next) => {
  if (!req.headers.get("authorization")) {
    return new Response("Unauthorized", { status: 401 });
  }
  return next();
};

core.get("/protected", handler, authMiddleware);
```

### Context API

The `Context` object is passed to handlers and middleware:

```typescript
type Context = {
  params: Record<string, string>;
  query: Record<string, string>;
  render: (component: React.ReactElement, options?: { includeDoctype?: boolean }) => string;
  cookies?: Record<string, string>;
  setCookie?: (name: string, value: string, opts?: CookieOptions) => void;
};
```

#### `ctx.params`
Route parameters extracted from the URL.

```typescript
core.get("/users/:id/posts/:postId", (_, ctx) => {
  console.log(ctx.params.id);      // "123"
  console.log(ctx.params.postId);  // "456"
});
// Matches: /users/123/posts/456
```

#### `ctx.query`
Query parameters parsed from the URL search string.

```typescript
core.get("/search", (_, ctx) => {
  const query = ctx.query.q;
  const page = ctx.query.page || "1";
  const limit = ctx.query.limit || "10";
  
  return new Response(`Search: ${query}, Page: ${page}, Limit: ${limit}`);
});
// Example: /search?q=hello&page=2&limit=20
```

#### `ctx.cookies`
Parsed incoming cookies from the request.

```typescript
core.get("/profile", (_, ctx) => {
  const sessionId = ctx.cookies?.session;
  if (!sessionId) {
    return new Response("Not logged in", { status: 401 });
  }
  return new Response(`Session: ${sessionId}`);
});
```

#### `ctx.setCookie(name, value, options)`
Set an outgoing cookie via Set-Cookie header.

```typescript
core.get("/login", (_, ctx) => {
  const token = "abc123"; // Generate token
  ctx.setCookie?.("session", token, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "Lax"
  });
  return new Response("Logged in");
});
```

#### `ctx.render(component, options)`
Render React components to HTML strings.

```typescript
import React from "react";

core.get("/", (_, ctx) => {
  const element = React.createElement("div", null, "Hello from React!");
  const html = ctx.render(element);
  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
});

// With DOCTYPE
core.get("/page", (_, ctx) => {
  const element = React.createElement("html", null,
    React.createElement("body", null, "Full page")
  );
  const html = ctx.render(element, { includeDoctype: true });
  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
});
```

### Server

#### `core.serve(options)`
Start the HTTP server.

```typescript
core.serve({ 
  port: 8000,
  hostname: "0.0.0.0"
});
```

## Examples

### Complete Application

```typescript
import React from "react";
import core from "./core/mod.ts";
import { cookieMiddleware } from "./middlewares/cookie.ts";

// Global middleware
core.use(async (req, ctx, next) => {
  const start = performance.now();
  const response = await next();
  
  queueMicrotask(() => {
    const duration = performance.now() - start;
    console.log(`${req.method} ${req.url} - ${duration.toFixed(2)}ms`);
  });
  
  return response;
});

// Cookie middleware
core.use(cookieMiddleware);

// Serve static files
core.static("/static", "./public");

// Routes
core.get("/", () => {
  return new Response("Hello, world");
});

core.get("/users/:id", (_, ctx) => {
  return new Response(`User ID: ${ctx.params.id}`);
});

// React SSR with params
core.get("/render/:name", (_, ctx) => {
  const name = ctx.params.name || "Guest";
  const element = React.createElement("div", null, `Hello, ${name}!`);
  const html = ctx.render(element);
  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
});

// Query parameters
core.get("/search", (_, ctx) => {
  const query = ctx.query.q || "";
  const page = parseInt(ctx.query.page || "1");
  
  return new Response(`Searching for "${query}" on page ${page}`);
});

// Protected route with cookie check
core.get("/protected", (_, ctx) => {
  const session = ctx.cookies?.session;
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  return new Response("Protected content");
});

// Set cookie
core.get("/login", (_, ctx) => {
  const token = crypto.randomUUID();
  ctx.setCookie?.("session", token, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 7
  });
  return new Response("Logged in");
});

// Clear cookie
core.get("/logout", (_, ctx) => {
  ctx.setCookie?.("session", "", { path: "/", maxAge: 0 });
  return new Response("Logged out");
}, authMiddleware);

core.serve({ port: 8000 });
```

### Static Files Example

```typescript
core.static("/assets", "./public/assets");
// Now /assets/logo.png serves ./public/assets/logo.png
```

### Query Parameters with Defaults

```typescript
core.get("/api/posts", (_, ctx) => {
  const page = parseInt(ctx.query.page || "1");
  const limit = parseInt(ctx.query.limit || "10");
  const sort = ctx.query.sort || "date";
  
  // Fetch posts with pagination
  return new Response(JSON.stringify({
    page,
    limit,
    sort,
    posts: []
  }), {
    headers: { "Content-Type": "application/json" }
  });
});
// Example: /api/posts?page=2&limit=20&sort=title
```

### Combining Params and Query

```typescript
core.get("/users/:id/posts", (_, ctx) => {
  const userId = ctx.params.id;
  const filter = ctx.query.filter || "all";
  const sort = ctx.query.sort || "recent";
  
  return new Response(
    `Posts for user ${userId}, filter: ${filter}, sort: ${sort}`
  );
});
// Example: /users/123/posts?filter=published&sort=popular
```

### Multiple Middleware

```typescript
const logMiddleware = (req, ctx, next) => {
  console.log(`Route: ${req.url}`);
  return next();
};

const timingMiddleware = async (req, ctx, next) => {
  const start = Date.now();
  const response = await next();
  console.log(`Duration: ${Date.now() - start}ms`);
  return response;
};

core.get("/api/data", handler, logMiddleware, timingMiddleware);
```

### JSON API

```typescript
core.get("/api/users", (_, ctx) => {
  const page = parseInt(ctx.query.page || "1");
  const limit = parseInt(ctx.query.limit || "10");
  
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ];
  
  return new Response(JSON.stringify({
    page,
    limit,
    users
  }), {
    headers: { "Content-Type": "application/json" }
  });
});

core.post("/api/users", async (req) => {
  const user = await req.json();
  // Process user...
  return new Response(JSON.stringify({ success: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
});
```

## Performance

### Benchmark Results

- **Native Deno**: ~88,986 req/sec (100% baseline)
- **Fastro Server**: ~84,689 req/sec (95% of native)
- **Performance Overhead**: Only ~5% slower than raw Deno

### Optimization Features

- **Route Caching**: Up to 10,000 routes cached automatically
- **Middleware Pre-merging**: Zero overhead during request handling
- **Query Parsing**: Conditional parsing only when query strings exist
- **Context Reuse**: Minimal object allocation per request
- **Pattern Matching**: Cached URLPattern results for repeated requests

## Architecture

### Route Caching
Routes are cached after first match to avoid repeated pattern matching:
- Cache size: 10,000 entries (configurable)
- LRU eviction when cache is full
- Includes pre-computed context for cached routes
- Sub-millisecond lookup time for cached routes

### Middleware Execution
- Middlewares are pre-merged when routes are registered
- No array spreading on request handling
- Optimized dispatch function with index-based iteration
- Async middleware chain with minimal overhead

### Query Parameter Parsing
- Single URL parsing per request
- Conditional parsing (only when query string exists)
- Zero-copy query object reuse across middleware chain
- Minimal performance impact on routes without query parameters
- Empty object allocation avoided when no query params present

### Static File Serving
- Static files are served from a specified directory at a given URL prefix
- Content-Type is set automatically based on file extension
- Directory requests serve `index.html` if present
- Static routes are checked after dynamic routes

### React Rendering
- Shared render function for routes without parameters
- Per-route render function created only when needed
- Optional DOCTYPE injection
- Efficient `renderToString` integration

## Testing

```bash
deno test core/server.test.ts
```

## License

MIT