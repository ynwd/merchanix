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
import { notifyHandler } from "./handlers/notify.handler.ts";
import { renderWithParamsHandler } from "./handlers/params.handler.tsx";
import { renderHandler } from "./handlers/render.handler.tsx";
import { rootHandler } from "./handlers/index.handler.tsx";
import { successHandler } from "./handlers/success.handler.tsx";
import { ssrHandler } from "./handlers/ssr.handler.tsx";

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

const r = createRouter();

r.get("/api", () => new Response("API Root"));
r.get("/hello/:id", routeHandler, routeLogMiddleware, anotherRouteMiddleware);
r.get("/hello", authHandler, authorizationMiddleware);
r.get("/render", renderHandler);
r.get("/render/:name", renderWithParamsHandler);
r.get("/session", sessionHandler);
r.get("/session/set", setSessionHandler);
r.get("/session/clear", clearSessionHandler);
r.get("/login", loginHandler);
r.get("/protected", protectedHandler, jwtMiddleware);
r.post("/notify", notifyHandler);
r.get("/success", successHandler);
r.get("/ssr", ssrHandler);
r.get("/", rootHandler)

const routes = r.build();

export { routes };