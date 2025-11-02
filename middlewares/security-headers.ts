import type { Middleware } from "../core/server.ts";

export type SecurityHeadersOptions = {
    hsts?: string;
    csp?: string;
    xFrame?: string;
};

/**
 * Security Headers middleware that adds HSTS, CSP, and X-Frame-Options headers to responses.
 * 
 * @param options - Configuration options for security headers
 * @returns A middleware function that adds security headers
 */
export function securityHeaders(options: SecurityHeadersOptions = {}): Middleware {
    const {
        hsts = "max-age=31536000; includeSubDomains",
        csp = "default-src 'self'",
        xFrame = "DENY",
    } = options;

    return async (_req, _ctx, next) => {
        const response = await next();

        response.headers.set("Strict-Transport-Security", hsts);
        response.headers.set("Content-Security-Policy", csp);
        response.headers.set("X-Frame-Options", xFrame);

        return response;
    };
}

/**
 * Default security headers middleware with standard settings
 */
export const securityHeadersMiddleware: Middleware = securityHeaders();