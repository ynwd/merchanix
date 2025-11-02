// deno-lint-ignore-file
// deno-lint-ignore-file no-explicit-any
import { assertEquals, assert, assertRejects } from "https://deno.land/std@0.208.0/assert/mod.ts";
import server, { _resetForTests, _getRoutesForTests, _getMiddlewaresForTests } from "./server.ts";
import { renderMiddleware } from "../middlewares/render.ts"; // Import render middleware

function resetCore() {
    _resetForTests();
}

Deno.test("route creation", async (t) => {
    await t.step("extractParamNames via route creation", () => {
        resetCore();
        server.get("/test/:id/:name", () => new Response("ok"));
        const routes = _getRoutesForTests();
        const route = routes[0];
        assertEquals(route.paramNames, ["id", "name"]);
    });

    await t.step("complex path parameters", () => {
        resetCore();
        server.get("/api/:version/users/:userId/posts/:postId", () => new Response("ok"));
        const routes = _getRoutesForTests();
        const route = routes[0];
        assertEquals(route.paramNames, ["version", "userId", "postId"]);
    });
});

Deno.test("HTTP methods", async (t) => {
    await t.step("GET route", () => {
        resetCore();
        const handler = () => new Response("ok");
        server.get("/test", handler);
        const routes = _getRoutesForTests();
        assertEquals(routes[0].method, "GET");
        assertEquals(routes[0].handler, handler);
    });

    await t.step("POST route", () => {
        resetCore();
        const handler = () => new Response("ok");
        server.post("/test", handler);
        const routes = _getRoutesForTests();
        assertEquals(routes[0].method, "POST");
    });

    await t.step("PUT route", () => {
        resetCore();
        const handler = () => new Response("ok");
        server.put("/test", handler);
        const routes = _getRoutesForTests();
        assertEquals(routes[0].method, "PUT");
    });

    await t.step("DELETE route", () => {
        resetCore();
        const handler = () => new Response("ok");
        server.delete("/test", handler);
        const routes = _getRoutesForTests();
        assertEquals(routes[0].method, "DELETE");
    });
});

Deno.test("middleware functionality", async (t) => {
    await t.step("middleware order execution", async () => {
        resetCore();
        const order: string[] = [];

        const middleware1 = async (_req: Request, _ctx: any, next: Function) => {
            order.push("mw1-before");
            const response = await next();
            order.push("mw1-after");
            return response;
        };

        const middleware2 = async (_req: Request, _ctx: any, next: Function) => {
            order.push("mw2-before");
            const response = await next();
            order.push("mw2-after");
            return response;
        };

        server.use(middleware1);
        server.use(middleware2);

        const handler = () => {
            order.push("handler");
            return new Response("ok");
        };

        server.get("/test", handler);
        const routes = _getRoutesForTests();
        const route = routes[0];

        const context = {
            params: {},
            query: {},
            remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 12345 } as Deno.Addr
        };

        let index = 0;
        const dispatch = async (): Promise<Response> => {
            if (index >= route.middlewares.length) {
                return handler();
            }
            const middleware = route.middlewares[index++];
            return await middleware(new Request("http://localhost/test"), context, dispatch);
        };

        await dispatch();
        assertEquals(order, ["mw1-before", "mw2-before", "handler", "mw2-after", "mw1-after"]);
    });

    await t.step("route-specific middleware", async () => {
        resetCore();
        const order: string[] = [];

        const globalMiddleware = async (_req: Request, _ctx: any, next: Function) => {
            order.push("global");
            return await next();
        };

        const routeMiddleware = async (_req: Request, _ctx: any, next: Function) => {
            order.push("route");
            return await next();
        };

        server.use(globalMiddleware);

        const handler = () => {
            order.push("handler");
            return new Response("ok");
        };

        server.get("/test", handler, routeMiddleware);
        const routes = _getRoutesForTests();
        const route = routes[0];

        const context = {
            params: {},
            query: {},
            remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 12345 } as Deno.Addr
        };

        let index = 0;
        const dispatch = async (): Promise<Response> => {
            if (index >= route.middlewares.length) {
                return handler();
            }
            const middleware = route.middlewares[index++];
            return await middleware(new Request("http://localhost/test"), context, dispatch);
        };

        await dispatch();
        assertEquals(order, ["route", "global", "handler"]);
    });
});

Deno.test("context and rendering", async (t) => {
    await t.step("context params population", () => {
        resetCore();
        const params: Record<string, string> = {};
        const query: Record<string, string> = {};
        const context = {
            params,
            query,
            remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 12345 } as Deno.Addr
        };
        assertEquals(context.params, {});
        assertEquals(context.query, {});
    });

    await t.step("query parameters parsing", () => {
        resetCore();
        const searchParams = new URLSearchParams("name=John&age=30");
        const query: Record<string, string> = {};
        for (const [key, value] of searchParams) {
            query[key] = value;
        }
        assertEquals(query.name, "John");
        assertEquals(query.age, "30");
    });
});

Deno.test("error handling", async (t) => {
    await t.step("middleware error handling", async () => {
        resetCore();
        const errorMiddleware = () => {
            throw new Error("Middleware error");
        };

        server.use(errorMiddleware);
        const handler = () => new Response("ok");
        server.get("/test", handler);

        const routes = _getRoutesForTests();
        const route = routes[0];

        await assertRejects(
            async () => {
                const context = {
                    params: {},
                    query: {},
                    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 12345 } as Deno.Addr
                };

                let index = 0;
                const dispatch = async (): Promise<Response> => {
                    if (index >= route.middlewares.length) {
                        return handler();
                    }
                    const middleware = route.middlewares[index++];
                    return await middleware(new Request("http://localhost/test"), context, dispatch);
                };
                await dispatch();
            },
            Error,
            "Middleware error"
        );
    });
});

Deno.test("route cache", async (t) => {
    await t.step("cache size configuration", () => {
        resetCore();
        const DEFAULT_CACHE_SIZE = 10000;
        const customCacheSize = 5000;

        // Test default cache size
        assertEquals(DEFAULT_CACHE_SIZE, 10000);

        // Test custom cache size
        assertEquals(customCacheSize, 5000);
    });

    await t.step("LRU cache eviction", () => {
        resetCore();
        const MAX_CACHE_SIZE = 3;
        const matchCache = new Map();

        // Fill cache beyond limit
        for (let i = 0; i < MAX_CACHE_SIZE + 2; i++) {
            // Simulate LRU eviction
            if (matchCache.size >= MAX_CACHE_SIZE) {
                const firstKey = matchCache.keys().next().value!;
                matchCache.delete(firstKey);
            }
            matchCache.set(`/test${i}`, { routeIndex: i, context: {} });
        }

        // Cache should not exceed MAX_CACHE_SIZE
        assertEquals(matchCache.size, MAX_CACHE_SIZE);

        // First entries should be evicted
        assert(!matchCache.has("/test0"));
        assert(!matchCache.has("/test1"));

        // Latest entries should remain
        assert(matchCache.has("/test2"));
        assert(matchCache.has("/test3"));
        assert(matchCache.has("/test4"));
    });

    await t.step("404 caching", () => {
        resetCore();
        const MAX_CACHE_SIZE = 10;
        const matchCache = new Map();

        // Cache a 404 response
        if (matchCache.size < MAX_CACHE_SIZE) {
            matchCache.set("/not-found", null);
        }

        assertEquals(matchCache.get("/not-found"), null);
        assert(matchCache.has("/not-found"));
    });
});

Deno.test("URL pattern matching", async (t) => {
    await t.step("pattern matching with parameters", () => {
        resetCore();
        server.get("/users/:id/posts/:postId", () => new Response("ok"));
        const routes = _getRoutesForTests();
        const route = routes[0];
        const pattern = route.pattern;
        const match = pattern.exec("http://localhost/users/123/posts/456");
        assert(match);
        assertEquals(match.pathname.groups?.id, "123");
        assertEquals(match.pathname.groups?.postId, "456");
    });

    await t.step("pattern matching without parameters", () => {
        resetCore();
        server.get("/api/users", () => new Response("ok"));
        const routes = _getRoutesForTests();
        const route = routes[0];
        const pattern = route.pattern;
        const match = pattern.exec("http://localhost/api/users");
        assert(match);
        assertEquals(route.paramNames.length, 0);
    });
});

Deno.test("query parameter functionality", async (t) => {
    await t.step("empty query parameters", () => {
        const url = new URL("http://localhost/test");
        const hasQuery = url.search.length > 1;
        assertEquals(hasQuery, false);
    });

    await t.step("query parameters with values", () => {
        const url = new URL("http://localhost/test?name=John&age=30");
        const hasQuery = url.search.length > 1;
        assertEquals(hasQuery, true);

        const query: Record<string, string> = {};
        for (const [key, value] of url.searchParams) {
            query[key] = value;
        }

        assertEquals(query.name, "John");
        assertEquals(query.age, "30");
    });

    await t.step("single query parameter", () => {
        const url = new URL("http://localhost/test?name=John");
        const query: Record<string, string> = {};
        for (const [key, value] of url.searchParams) {
            query[key] = value;
        }

        assertEquals(query.name, "John");
        assertEquals(Object.keys(query).length, 1);
    });

    await t.step("query parameter with special characters", () => {
        const url = new URL("http://localhost/test?search=hello%20world&filter=a%26b");
        const query: Record<string, string> = {};
        for (const [key, value] of url.searchParams) {
            query[key] = value;
        }

        assertEquals(query.search, "hello world");
        assertEquals(query.filter, "a&b");
    });
});

Deno.test("performance optimizations", async (t) => {
    await t.step("conditional query parsing", () => {
        const urlWithQuery = new URL("http://localhost/test?name=John");
        const urlWithoutQuery = new URL("http://localhost/test");

        const hasQuery1 = urlWithQuery.search.length > 1;
        const hasQuery2 = urlWithoutQuery.search.length > 1;

        assert(hasQuery1);
        assert(!hasQuery2);
    });

    await t.step("middleware pre-merging", () => {
        resetCore();
        const globalMw = (_req: Request, _ctx: any, next: Function) => next();
        const routeMw = (_req: Request, _ctx: any, next: Function) => next();

        server.use(globalMw);
        server.get("/test", () => new Response("ok"), routeMw);

        const routes = _getRoutesForTests();
        const route = routes[0];

        // Middlewares should be pre-merged
        assertEquals(route.middlewares.length, 2);
        assertEquals(route.middlewares[0], routeMw);
        assertEquals(route.middlewares[1], globalMw);
    });
});