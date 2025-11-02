import type { Middleware, Context } from "../core/server.ts";

export type InputSanitizationOptions = {
    sanitizeParams?: boolean;
    sanitizeQuery?: boolean;
    sanitizeBody?: boolean;
};

/**
 * Input Sanitization middleware to prevent XSS and basic SQL injection.
 * 
 * Sanitizes URL parameters, query parameters, and request body (for JSON).
 * Uses HTML escaping for XSS prevention and basic quote escaping for SQL.
 * 
 * @param options - Configuration options for sanitization
 * @returns A middleware function that sanitizes inputs
 */
export function inputSanitization(options: InputSanitizationOptions = {}): Middleware {
    const {
        sanitizeParams = true,
        sanitizeQuery = true,
        sanitizeBody = true,
    } = options;

    // Simple HTML escape for XSS
    const escapeHtml = (str: string): string => {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;");
    };

    // Basic SQL escape (not foolproof, use prepared statements in DB layer)
    const escapeSql = (str: string): string => {
        return str
            .replace(/'/g, "''")
            .replace(/"/g, '""');
    };

    const sanitizeString = (str: string): string => {
        let sanitized = str;
        sanitized = escapeHtml(sanitized); // XSS
        sanitized = escapeSql(sanitized);  // Basic SQL
        return sanitized;
    };

    const sanitizeObject = (obj: Record<string, unknown>): void => {
        for (const key in obj) {
            const value = obj[key];
            if (typeof value === "string") {
                obj[key] = sanitizeString(value);
            } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                sanitizeObject(value as Record<string, unknown>);
            }
        }
    };

    return async (req, ctx, next) => {
        // Sanitize params
        if (sanitizeParams && ctx.params) {
            sanitizeObject(ctx.params);
        }

        // Sanitize query
        if (sanitizeQuery && ctx.query) {
            sanitizeObject(ctx.query);
        }

        // Sanitize body if JSON
        if (sanitizeBody && req.method !== "GET" && req.headers.get("content-type")?.includes("application/json")) {
            try {
                const body = await req.json();
                if (typeof body === "object" && body !== null && !Array.isArray(body)) {
                    const sanitizedBody = { ...body }; // Clone to avoid modifying original
                    sanitizeObject(sanitizedBody);
                    (ctx as Context & { sanitizedBody?: Record<string, unknown> }).sanitizedBody = sanitizedBody;
                }
            } catch (e) {
                console.warn("Input Sanitization: Failed to parse JSON body:", e);
            }
        }

        return next();
    };
}

/**
 * Default input sanitization middleware with all options enabled
 */
export const inputSanitizationMiddleware: Middleware = inputSanitization();