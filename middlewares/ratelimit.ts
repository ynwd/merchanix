import { Context, Middleware } from "../core/server.ts";

/**
 * Creates a rate limiting middleware that limits requests based on IP address using Deno KV for storage.
 * 
 * @param options - Configuration options for rate limiting.
 * @param options.maxRequests - Maximum number of requests allowed per window (default: 10).
 * @param options.windowMs - Time window in milliseconds (default: 60000, i.e., 1 minute).
 * @returns The rate limiting middleware function.
 */
function createRateLimitMiddleware(options: { maxRequests?: number; windowMs?: number } = {}): Middleware {
    const maxRequests = options.maxRequests ?? 10;
    const windowMs = options.windowMs ?? 60 * 1000;

    return async (_req, ctx, next) => {
        const ip = ctx.remoteAddr.hostname;
        if (!ip) {
            return await next();
        }

        if (ip === "127.0.0.1" || ip === "::1") {
            return await next();
        }

        const kv = (ctx as Context & { kv?: Deno.Kv }).kv;
        if (!kv) {
            console.warn("KV not available in context for rate limiting");
            return await next();
        }

        if (await isRateLimited(ip, kv, maxRequests, windowMs)) {
            return new Response("Too Many Requests", { status: 429 });
        }
        return await next();
    };
}

async function isRateLimited(ip: string, kv: Deno.Kv, maxRequests: number, windowMs: number): Promise<boolean> {
    const key = ["rate_limit", ip];
    const now = Date.now();

    const result = await kv.get(key);
    let data = result.value as { count: number; windowStart: number } | null;

    if (!data || now - data.windowStart >= windowMs) {
        data = { count: 1, windowStart: now };
    } else {
        data.count += 1;
    }

    if (data.count > maxRequests) {
        return true;
    }

    await kv.set(key, data, { expireIn: windowMs });
    return false;
}

export default createRateLimitMiddleware;

export const rateLimitMiddleware = createRateLimitMiddleware();