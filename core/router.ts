import { Middleware, Handler, Context } from "./server.ts";

export interface Route {
    method: string;
    path: string;
    handler: Handler;
    middlewares?: Middleware[];
}

/**
 * Creates a route middleware to handle defined routes.
 * @param routes An array of Route objects defining the routes to handle, including method, path, handler, and optional middlewares.
 * @returns A Middleware function that processes requests by matching routes, extracting parameters, and applying handlers and middlewares.
 */
// what is alternative name of this function?
export function build(routes: Route[]): Middleware {
    return (req: Request, ctx: Context, next: () => Response | Promise<Response>) => {
        const url = new URL(req.url);
        const method = req.method;

        for (const route of routes) {
            if (route.method !== method) continue;

            const match = matchPath(route.path, url.pathname);
            if (match) {
                ctx.params = match.params;

                const mws = route.middlewares ?? [];
                const dispatch = (i: number): Response | Promise<Response> => {
                    if (i < mws.length) {
                        return mws[i](req, ctx, () => dispatch(i + 1));
                    }
                    return route.handler(req, ctx);
                };

                return dispatch(0);
            }
        }

        return next();
    };
}

export function matchPath(routePath: string, requestPath: string): { params: Record<string, string> } | null {
    const routeParts = routePath.split('/');
    const requestParts = requestPath.split('/');

    if (routeParts.length !== requestParts.length) return null;

    const params: Record<string, string> = {};

    for (let i = 0; i < routeParts.length; i++) {
        const routePart = routeParts[i];
        const requestPart = requestParts[i];

        if (routePart.startsWith(':')) {
            params[routePart.slice(1)] = requestPart;
        } else if (routePart !== requestPart) {
            return null;
        }
    }

    return { params };
}

/**
 * A fluent builder for creating routes.
 */
export class RouteBuilder {
    private routes: Route[] = [];

    /**
     * Registers a GET route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    get(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'GET', path, handler, middlewares });
        return this;
    }

    /**
     * Registers a POST route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    post(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'POST', path, handler, middlewares });
        return this;
    }

    /**
     * Registers a PUT route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    put(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'PUT', path, handler, middlewares });
        return this;
    }

    /**
     * Registers a DELETE route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    delete(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'DELETE', path, handler, middlewares });
        return this;
    }

    /**
     * Registers a PATCH route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    patch(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'PATCH', path, handler, middlewares });
        return this;
    }

    /**
     * Registers a HEAD route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    head(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'HEAD', path, handler, middlewares });
        return this;
    }

    /**
     * Registers an OPTIONS route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    options(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'OPTIONS', path, handler, middlewares });
        return this;
    }

    /**
     * Builds the middleware from the registered routes.
     * @returns A Middleware function.
     */
    build(): Middleware {
        return build(this.routes);
    }
}

/**
 * Creates a new RouteBuilder instance.
 * @returns A RouteBuilder for registering routes.
 */
export function createRouter(): RouteBuilder {
    return new RouteBuilder();
}