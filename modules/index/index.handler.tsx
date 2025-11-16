import { Handler } from "../../core/mod.ts";
import { App } from "./App.tsx";

export const rootHandler: Handler = (_req, ctx) => {
    const todoList = [
        { title: "Rate Limiting", checked: true, description: "Per-IP/per-user request limits" },
        { title: "Session Management", checked: true, description: "JWT authentication with cookie support" },
        { title: "CORS Support", checked: true, description: "Cross-origin configuration" },
        { title: "CSRF Protection", checked: true, description: "Token validation middleware" },
        { title: "Security Headers", checked: true, description: "HSTS, CSP, X-Frame-Options middleware" },
        { title: "Input Sanitization", checked: true, description: "XSS/SQL injection protection" },
        { title: "Cookie Parser", checked: true, description: "Cookie read/write utilities" },
        { title: "Request Body Parsing", checked: true, description: "Built-in JSON/form/multipart/text parsing helper" },
        { title: "File Upload", checked: true, description: "Multipart form data handling with validation" },
        { title: "Compression", checked: true, description: "Gzip/Brotli response compression" },
        { title: "ETag Support", checked: false, description: "Automatic ETag generation" },
        { title: "Cache-Control", checked: true, description: "Built-in cache header management for static files" },
        { title: "Pagination Helper", checked: false, description: "Built-in pagination utilities" },
        { title: "Error Handling", checked: false, description: "Centralized error handler middleware" },
        { title: "Validation", checked: false, description: "Request/response validation middleware" },
        { title: "API Versioning", checked: false, description: "URL versioning support (/v1/, /v2/)" },
        { title: "Webhook Handler", checked: false, description: "Payment gateway webhook support" },
        { title: "Idempotency Keys", checked: false, description: "Prevent duplicate orders/payments" },
        { title: "WebSocket/SSE", checked: false, description: "Real-time updates (order status, stock)" },
        { title: "Health Check", checked: false, description: "/health, /readiness endpoints" },
        { title: "Metrics", checked: false, description: "/metrics endpoint for Prometheus" },
        { title: "Structured Logging", checked: false, description: "JSON logs with correlation IDs" },
        { title: "Request Tracing", checked: false, description: "Distributed tracing support" },
        { title: "HTTP/2 Support", checked: false, description: "Server push, multiplexing" },
        { title: "Connection Pooling", checked: false, description: "Keep-alive optimization" },
        { title: "Response Streaming", checked: false, description: "Large file streaming" },
    ];

    const news = [
        { title: "Launch Announcement", content: "We're launching soon — sign up to get notified!" },
        { title: "Beta Signup Open", content: "Join our beta program for early access and feedback." },
    ];

    const reviews = [
        { title: "Jane Doe", rating: 5, content: "Amazing platform — easy to use." },
        { title: "John Smith", rating: 4, content: "Great features, looking forward to more." },
    ];

    const props = { todoList, news, reviews };
    const appModule = "index"
    const appTitle = "Fastro Merchant - Build Your Online Store";
    const html = ctx.renderToString!(<App {...props} />, {
        includeDoctype: true,
        title: appTitle,
        initialProps: props,
        module: appModule,
        head: `
             <head>
                 <meta charset="UTF-8">
                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
                 <meta name="description" content="Take control of your business. Create your free, custom online store and break free from marketplace restrictions on branding, data, and customer experience.">
                 <title>Fastro Merchant - Build Your Online Store</title>
                 <link rel="stylesheet" href="/css/app.css?v=${Date.now()}">
             </head>
            `
    });
    return new Response(html, {
        headers: { "Content-Type": "text/html" },
    });
};