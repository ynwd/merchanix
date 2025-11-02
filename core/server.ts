import { RenderFunction } from "../middlewares/render.ts";

export type CookieOptions = {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "Lax" | "Strict" | "None";
};

export type Context = {
    params: Record<string, string>;
    query: Record<string, string>;
    remoteAddr: { transport: string; hostname?: string; port?: number; };
    render?: RenderFunction;
    cookies?: Record<string, string>;
    setCookie?: (name: string, value: string, opts?: CookieOptions) => void;
    [key: string]: unknown;
};

export type Handler = (req: Request, context: Context) => Response | Promise<Response>;
export type Middleware = (req: Request, context: Context, next: () => Response | Promise<Response>) => Response | Promise<Response>;

interface Route {
    method: string;
    pattern: URLPattern;
    handler: Handler;
    paramNames: string[];
    middlewares: Middleware[];
}

const routes: Route[] = [];
const staticRoutes: Route[] = [];
const middlewares: Middleware[] = [];

function use(middleware: Middleware) {
    middlewares.push(middleware);
}

function staticFiles(urlPrefix: string, dirPath: string): void {
    const contentTypes: Record<string, string> = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
        ".txt": "text/plain",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".eot": "application/vnd.ms-fontobject",
    };

    const normalizedPrefix = urlPrefix.endsWith("/") ? urlPrefix.slice(0, -1) : urlPrefix;
    const baseDir = dirPath.startsWith("./") ? dirPath.slice(2) : dirPath;

    // Cache for static file contents with TTL
    const fileCache = new Map<string, { content: Uint8Array; contentType: string; expiry: number; }>();
    const FILE_CACHE_TTL = 3600000; // 1 hour
    const MAX_FILE_CACHE_SIZE = 100; // Cache up to 100 files

    // Register static route; these should be evaluated after dynamic routes
    staticRoutes.push({
        method: "GET",
        pattern: new URLPattern({ pathname: `${normalizedPrefix}/*` }),
        handler: async (req) => {
            const url = new URL(req.url);
            let pathname = url.pathname.slice(normalizedPrefix.length);

            // Normalize directory requests to index.html
            if (pathname === "" || pathname === "/" || pathname.endsWith("/")) {
                pathname = pathname === "" ? "/index.html" : `${pathname}index.html`;
            }

            const cacheKey = pathname;
            const now = Date.now();

            // Check cache first
            const cached = fileCache.get(cacheKey);
            if (cached && cached.expiry > now) {
                return new Response(new Uint8Array(cached.content), {
                    headers: {
                        "Content-Type": cached.contentType,
                        "Cache-Control": "public, max-age=3600",
                    },
                });
            }

            // Build file path once
            const relative = pathname.replace(/^\/+/, "");
            const filePath = `${baseDir}/${relative}`;

            try {
                const file = await Deno.readFile(filePath);

                // Get content type once
                const dot = relative.lastIndexOf(".");
                const ext = dot >= 0 ? relative.substring(dot).toLowerCase() : "";
                const contentType = contentTypes[ext] || "application/octet-stream";

                // Cache management: LRU eviction if needed
                if (fileCache.size >= MAX_FILE_CACHE_SIZE) {
                    const oldestKey = fileCache.keys().next().value;
                    if (oldestKey) {
                        fileCache.delete(oldestKey);
                    }
                }

                // Cache the file content
                fileCache.set(cacheKey, {
                    content: file,
                    contentType,
                    expiry: now + FILE_CACHE_TTL
                });

                return new Response(new Uint8Array(file), {
                    headers: {
                        "Content-Type": contentType,
                        "Cache-Control": "public, max-age=3600",
                    },
                });
            } catch {
                return new Response("Not found", { status: 404 });
            }
        },
        paramNames: [],
        middlewares: [],
    });
}


function get(path: string, handler: Handler, ...routeMiddlewares: Middleware[]) {
    routes.push({
        method: "GET",
        pattern: new URLPattern({ pathname: path }),
        handler,
        paramNames: extractParamNames(path),
        middlewares: [...routeMiddlewares, ...middlewares],
    });
}

function post(path: string, handler: Handler, ...routeMiddlewares: Middleware[]) {
    routes.push({
        method: "POST",
        pattern: new URLPattern({ pathname: path }),
        handler,
        paramNames: extractParamNames(path),
        middlewares: [...routeMiddlewares, ...middlewares],
    });
}

function put(path: string, handler: Handler, ...routeMiddlewares: Middleware[]) {
    routes.push({
        method: "PUT",
        pattern: new URLPattern({ pathname: path }),
        handler,
        paramNames: extractParamNames(path),
        middlewares: [...routeMiddlewares, ...middlewares],
    });
}

function delete_(path: string, handler: Handler, ...routeMiddlewares: Middleware[]) {
    routes.push({
        method: "DELETE",
        pattern: new URLPattern({ pathname: path }),
        handler,
        paramNames: extractParamNames(path),
        middlewares: [...routeMiddlewares, ...middlewares],
    });
}

function extractParamNames(path: string): string[] {
    return Array.from(path.matchAll(/:([a-zA-Z0-9_]+)/g), m => m[1]);
}

/**
 * Starts the HTTP server with optimized route matching, caching, middleware support, and static file serving.
 * 
 * This function initializes a Deno server with the following optimizations:
 * - Route caching: Uses an LRU cache (configurable size, default 10,000) to store matched routes and pre-computed contexts, avoiding repeated pattern matching for the same URLs.
 * - Fast path for root route: Directly handles GET requests to "/" without query params for maximum performance.
 * - Static file serving: Checks static routes first for file-like URLs (e.g., those with extensions), with in-memory caching (TTL 1 hour, max 100 files) and automatic content-type detection.
 * - Middleware application: Applies global and route-specific middlewares using an optimized dispatch mechanism.
 * - Query parsing: Conditionally parses query parameters only when present, with zero-copy reuse.
 * - 404 caching: Caches not-found responses to reduce repeated processing.
 * 
 * Routes are evaluated in order: fast path root, cached routes, static routes, dynamic routes, then static routes again if no match.
 * 
 * @param options Configuration options for the server.
 * - Inherits from Deno.ServeTcpOptions (e.g., port, hostname).
 * - handler: Must be undefined (handled internally).
 * - cacheSize: Optional number to set the maximum route cache size (default: 10,000).
 * @returns A Promise that resolves to a Deno.Server instance when the server starts successfully.
 */
function serve(options: Deno.ServeTcpOptions & { handler?: undefined; cacheSize?: number }) {
    const rootRoute = routes.find(r => r.pattern.pathname === "/" && r.method === "GET");
    const matchCache = new Map<string, { routeIndex: number; context: Context; handler: () => Response | Promise<Response> } | null>();
    const MAX_CACHE_SIZE = options.cacheSize ?? 10000;

    const parseQuery = (searchParams: URLSearchParams): Record<string, string> => {
        const query: Record<string, string> = {};
        for (const [key, value] of searchParams) {
            query[key] = value;
        }
        return query;
    };

    const handler = (req: Request, info: Deno.ServeHandlerInfo): Response | Promise<Response> => {
        const method = req.method;
        const urlStr = req.url;

        // Fast path for root route
        if (rootRoute && method === "GET" && urlStr.endsWith("/") && !urlStr.includes("?")) {
            const context: Context = {
                params: {},
                query: {},
                remoteAddr: info.remoteAddr
            };
            return applyMiddlewares(req, context, () => rootRoute.handler(req, context), rootRoute.middlewares);
        }

        // Check cache first
        const cached = matchCache.get(urlStr);
        if (cached !== undefined) {
            if (cached === null) {
                return new Response("Not found", { status: 404 });
            }
            return applyMiddlewares(req, cached.context, cached.handler, routes[cached.routeIndex].middlewares);
        }

        // Check static routes first if URL looks like a static file request
        if (method === "GET" && /\.[a-zA-Z0-9]+$/.test(urlStr)) {
            for (const route of staticRoutes) {
                if (route.pattern.test(urlStr)) {
                    const url = new URL(urlStr);
                    const context: Context = {
                        params: {},
                        query: url.search.length > 1 ? parseQuery(url.searchParams) : {},
                        remoteAddr: info.remoteAddr
                    };
                    return route.handler(req, context);
                }
            }
        }

        // Only parse URL when needed for uncached routes
        const url = new URL(urlStr);
        const hasQuery = url.search.length > 1;
        const query = hasQuery ? parseQuery(url.searchParams) : {};

        // Pattern matching for uncached routes
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            if (method === route.method) {
                const match = route.pattern.exec(urlStr);
                if (match) {
                    const params: Record<string, string> = {};
                    if (route.paramNames.length) {
                        for (const name of route.paramNames) {
                            params[name] = match.pathname.groups?.[name] ?? "";
                        }
                    }
                    const context: Context = {
                        params,
                        query,
                        remoteAddr: info.remoteAddr
                    };

                    // Create cached handler to avoid function recreation
                    const cachedHandler = () => route.handler(req, context);

                    // LRU cache eviction: remove oldest entry when cache is full
                    if (matchCache.size >= MAX_CACHE_SIZE) {
                        const firstKey = matchCache.keys().next().value!;
                        matchCache.delete(firstKey);
                    }

                    // Cache the matched route with pre-bound handler
                    matchCache.set(urlStr, { routeIndex: i, context, handler: cachedHandler });
                    return applyMiddlewares(req, context, cachedHandler, route.middlewares);
                }
            }
        }

        // Check static routes only if no dynamic route matched
        for (let i = 0; i < staticRoutes.length; i++) {
            const route = staticRoutes[i];
            if (method === route.method) {
                const match = route.pattern.exec(urlStr);
                if (match) {
                    const context: Context = {
                        params: {},
                        query,
                        remoteAddr: info.remoteAddr
                    };
                    return route.handler(req, context);
                }
            }
        }

        // Cache 404 responses to avoid repeated pattern matching
        if (matchCache.size < MAX_CACHE_SIZE) {
            matchCache.set(urlStr, null);
        }
        return new Response("Not found", { status: 404 });
    };

    function applyMiddlewares(req: Request, context: Context, finalHandler: () => Response | Promise<Response>, middlewareList: Middleware[]): Response | Promise<Response> {
        if (middlewareList.length === 0) {
            return finalHandler();
        }

        let index = 0;
        const dispatch = (): Response | Promise<Response> => {
            if (index >= middlewareList.length) {
                return finalHandler();
            }
            const middleware = middlewareList[index++];
            return middleware(req, context, dispatch);
        };
        return dispatch();
    }
    return Deno.serve({ ...options, handler });
}

export function _resetForTests() {
    routes.length = 0;
    staticRoutes.length = 0;
    middlewares.length = 0;
}

export function _getRoutesForTests() {
    return routes;
}

export function _getMiddlewaresForTests() {
    return middlewares;
}

export function _getStaticRoutesForTests() {
    return staticRoutes;
}

const server = { get, post, put, delete: delete_, use, serve, static: staticFiles };
export default server;

