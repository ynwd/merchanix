# Custom HTTP Server for Merchanix

A lightweight, high-performance HTTP server built on top of Deno with React SSR support, middleware capabilities, static file serving, intelligent route caching, rate limiting, cookie handling, JWT authentication, CORS support, CSRF protection, security headers, input sanitization, and compression.

## Features

### ✅ Current Features
- 🚀 **High Performance**: ~86,866 requests/sec (average from custom benchmarks: 85,581–87,629 requests/sec), ~93% of native Deno performance (93,411 requests/sec)
- 🎯 **Route Caching**: Automatic URL pattern matching cache with configurable size limits
- 🔧 **Middleware Support**: Express-style middleware with async/await support
- 🛡️ **Rate Limiting**: IP-based rate limiting with Deno KV storage
- 🍪 **Cookie Handling**: Parse incoming cookies and set outgoing Set-Cookie headers (via middleware)
- 🔐 **JWT Authentication**: Secure token-based authentication with cookie and header support
- 🌐 **CORS Support**: Configurable cross-origin resource sharing middleware
- 🛡️ **CSRF Protection**: Double-submit cookie token validation middleware
- 🛡️ **Security Headers**: HSTS, CSP, X-Frame-Options middleware
- 🛡️ **Input Sanitization**: XSS and SQL injection protection middleware
- 📦 **Compression**: Gzip/Brotli response compression middleware
- ⚛️ **React SSR**: Built-in React server-side rendering with `renderToString` (via middleware)
- 📦 **Zero Dependencies**: Uses only Deno standard library, React, and jose for JWT
- 🎨 **Type Safe**: Full TypeScript support with strict typing
- 🛣️ **Dynamic Routes**: URL parameter extraction (e.g., `/users/:id`)
- 🔍 **Query Parameters**: Built-in query string parsing
- 🗂️ **Static File Serving**: Serve static files from a directory with automatic content-type detection (via middleware)

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

