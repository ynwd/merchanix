import type { Middleware, Context } from "../core/server.ts";
export type CsrfOptions = {
    cookieName?: string;
    headerName?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "Lax" | "Strict" | "None";
    maxAge?: number;
};

/**
 * CSRF Protection middleware using Double Submit Cookie pattern.
 *
 * For GET requests: Sets a CSRF token in cookie if not present.
 * For state-changing requests (POST, PUT, DELETE, PATCH): Validates that the token in the specified header matches the cookie.
 *
 * @param options - Configuration options for CSRF behavior
 * @returns A middleware function that handles CSRF protection
 */
export function csrf(options: CsrfOptions = {}): Middleware {
    const {
        cookieName = "csrf_token",
        headerName = "X-CSRF-Token",
        secure = false,
        httpOnly = false,
        sameSite = "Lax",
        maxAge = 60 * 60 * 24 * 7, // 7 days
    } = options;

    const generateToken = (): string => {
        return crypto.randomUUID();
    };

    return (req, ctx, next) => {
        const method = req.method.toUpperCase();
        const isStateChanging = ["POST", "PUT", "DELETE", "PATCH"].includes(method);

        if (isStateChanging) {
            // Validate CSRF token
            const cookieToken = ctx.cookies?.[cookieName];
            const headerToken = req.headers.get(headerName);

            if (!cookieToken || !headerToken || cookieToken !== headerToken) {
                return new Response("CSRF token mismatch", { status: 403 });
            }
        } else if (method === "GET") {
            // Set CSRF token in cookie if not present
            if (!ctx.cookies?.[cookieName]) {
                const token = generateToken();
                ctx.setCookie?.(cookieName, token, {
                    path: "/",
                    httpOnly,
                    secure,
                    sameSite,
                    maxAge,
                });
                // Make token available in context for handlers
                (ctx as Context & { csrfToken?: string }).csrfToken = token;
            } else {
                // If already present, expose it in context
                (ctx as Context & { csrfToken?: string }).csrfToken = ctx.cookies[cookieName];
            }
        }

        return next();
    };
}

/**
 * Default CSRF middleware with standard settings
 */
export const csrfMiddleware: Middleware = csrf();