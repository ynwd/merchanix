import { Middleware } from "../core/server.ts";

/**
 * Logging middleware that logs detailed information about incoming requests and outgoing responses.
 * It records the request start with timestamp, method, URL, IP address, and user agent,
 * then calls the next middleware, and finally logs the response with timestamp, method, URL, status code, and duration.
 * 
 * @param req - The incoming request object.
 * @param ctx - The context object containing request data.
 * @param next - The next middleware function to call.
 * @returns The response from the next middleware.
 */
export const loggerMiddleware: Middleware = async (req, ctx, next) => {
    if ("hostname" in ctx.remoteAddr && (ctx.remoteAddr.hostname === "127.0.0.1" || ctx.remoteAddr.hostname === "::1")) {
        return next();
    }

    const start = Date.now();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        ("hostname" in ctx.remoteAddr ? ctx.remoteAddr.hostname : "unknown");
    const userAgent = req.headers.get("user-agent") || "unknown";

    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${ip} - UA: ${userAgent}`);

    const response = await next();

    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${response.status} - ${duration}ms`);

    return response;
}