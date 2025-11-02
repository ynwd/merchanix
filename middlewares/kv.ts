import type { Middleware, Context } from "../core/server.ts";

export function createKvMiddleware(path?: string): Middleware {
    let kvPromise: Promise<Deno.Kv> | null = null;
    return async (_req, ctx, next) => {
        if (!kvPromise) kvPromise = Deno.openKv(path);
        (ctx as Context & { kv?: Deno.Kv }).kv = await kvPromise;
        return next();
    };
}
export const kvMiddleware: Middleware = createKvMiddleware();

