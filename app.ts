import React from "react";
import server from "./core/mod.ts";
import { Handler, Middleware } from "./core/server.ts";
import { loggerMiddleware } from "./middlewares/logger.ts";
import { rateLimitMiddleware } from "./middlewares/ratelimit.ts";
import { cookieMiddleware } from "./middlewares/cookie.ts";
import { kvMiddleware } from "./middlewares/kv.ts";
import { jwtMiddleware, createJWT } from "./middlewares/jwt.ts";
import { renderMiddleware } from "./middlewares/render.ts";

const routeHandler: Handler = (_, ctx) => {
  return new Response(`Hello, ${ctx.params.id}`);
}

const routeLogMiddleware: Middleware = (req, ctx, next) => {
  console.log(`Route middleware 1: ${req.method} ${req.url}` + ` with params ${JSON.stringify(ctx.params)}`);
  return next();
};

const anotherRouteMiddleware: Middleware = (req, _, next) => {
  console.log(`Another route middleware: Processing ${req.method} ${req.url}`);
  return next();
};

const authorizationMiddleware: Middleware = (req, _, next) => {
  if (!req.headers.get("authorization")) {
    return new Response("Unauthorized", { status: 401 });
  }
  return next();
};

const authHandler: Handler = (_, ctx) => {
  return new Response(`Hello, authorized user ${ctx.params.id}`);
}


const renderHandler: Handler = (_, ctx) => {
  const element = React.createElement("div", null, "Hello from React!");
  const html = ctx.render!(element);
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}

const renderWithParamsHandler: Handler = (_, ctx) => {
  const name = ctx.params.name || "Guest";
  const element = React.createElement("div", null, `Hello, ${name}, from React with params!`);
  const html = ctx.render!(element);
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}

const sessionHandler: Handler = (_, ctx) => {
  const session = ctx.cookies?.session;
  if (!session) return new Response("Missing session cookie", { status: 401 });
  return new Response(`Session: ${session}`);
};

const setSessionHandler: Handler = (_, ctx) => {
  const token = crypto.randomUUID();
  ctx.setCookie?.("session", token, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    // secure: true, // enable when serving over HTTPS
  });
  return new Response("Session cookie set");
};

const clearSessionHandler: Handler = (_, ctx) => {
  ctx.setCookie?.("session", "", { path: "/", maxAge: 0 });
  return new Response("Session cleared");
};

const loginHandler: Handler = async (_, ctx) => {
  const token = await createJWT({ userId: 123, username: "john_doe" });
  ctx.setCookie?.("jwt", token, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    maxAge: 60 * 60, // 1 hour
  });
  return new Response(`Logged in, JWT set in cookie: ${token}`);
};

const protectedHandler: Handler = (_, ctx) => {
  const user = ctx.user as { userId: number; username: string };
  return new Response(`Protected content for user: ${JSON.stringify(user)}`);
};


server.use(loggerMiddleware);
server.use(kvMiddleware);
server.use(rateLimitMiddleware);
server.use(cookieMiddleware);
server.use(renderMiddleware);

server.static("/", "./public");
server.get("/api", () => new Response("API Root"));
server.get("/hello/:id", routeHandler, routeLogMiddleware, anotherRouteMiddleware);
server.get("/hello", authHandler, authorizationMiddleware);
server.get("/render", renderHandler)
server.get("/render/:name", renderWithParamsHandler);
server.get("/session", sessionHandler);
server.get("/session/set", setSessionHandler);
server.get("/session/clear", clearSessionHandler);
server.get("/login", loginHandler);
server.get("/protected", protectedHandler, jwtMiddleware);

server.serve({ port: 8000 });