// app/routes.ts
// Define application routes and associated handlers,
// including route-specific middlewares.
// Note: Do not modify this file unless necessary.
import { createRouter } from "../core/mod.ts";
import { Middleware } from "../core/server.ts";
import { jwtMiddleware } from "../middlewares/jwt.ts";
import {
    routeHandler,
    authHandler,
    sessionHandler,
    setSessionHandler,
    clearSessionHandler,
    loginHandler,
    protectedHandler,
} from "./handlers/handlers.ts";
import { renderWithParamsHandler } from "./handlers/params.handler.tsx";
import { renderHandler } from "./handlers/render.handler.tsx";

export const routeLogMiddleware: Middleware = (req, ctx, next) => {
    console.log(`Route middleware 1: ${req.method} ${req.url}` + ` with params ${JSON.stringify(ctx.params)}`);
    return next();
};

export const anotherRouteMiddleware: Middleware = (req, _, next) => {
    console.log(`Another route middleware: Processing ${req.method} ${req.url}`);
    return next();
};

export const authorizationMiddleware: Middleware = (req, _, next) => {
    if (!req.headers.get("authorization")) {
        return new Response("Unauthorized", { status: 401 });
    }
    return next();
};

const router = createRouter();

router.get("/api", () => new Response("API Root"))
    .get("/hello/:id", routeHandler, routeLogMiddleware, anotherRouteMiddleware)
    .get("/hello", authHandler, authorizationMiddleware)
    .get("/render", renderHandler)
    .get("/render/:name", renderWithParamsHandler)
    .get("/session", sessionHandler)
    .get("/session/set", setSessionHandler)
    .get("/session/clear", clearSessionHandler)
    .get("/login", loginHandler)
    .get("/protected", protectedHandler, jwtMiddleware)

const routes = router.build();

export { routes, router };