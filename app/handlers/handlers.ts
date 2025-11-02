import { Handler } from "../../core/mod.ts";
import { createJWT } from "../../middlewares/jwt.ts";

export const routeHandler: Handler = (_, ctx) => {
    return new Response(`Hello, ${ctx.params.id}`);
};

export const authHandler: Handler = (_, ctx) => {
    return new Response(`Hello, authorized user ${ctx.params.id}`);
};

export const sessionHandler: Handler = (_, ctx) => {
    const session = ctx.cookies?.session;
    if (!session) return new Response("Missing session cookie", { status: 401 });
    return new Response(`Session: ${session}`);
};

export const setSessionHandler: Handler = (_, ctx) => {
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

export const clearSessionHandler: Handler = (_, ctx) => {
    ctx.setCookie?.("session", "", { path: "/", maxAge: 0 });
    return new Response("Session cleared");
};

export const loginHandler: Handler = async (_, ctx) => {
    const token = await createJWT({ userId: 123, username: "john_doe" });
    ctx.setCookie?.("jwt", token, {
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 60 * 60, // 1 hour
    });
    return new Response(`Logged in, JWT set in cookie: ${token}`);
};

export const protectedHandler: Handler = (_, ctx) => {
    const user = ctx.user as { userId: number; username: string };
    return new Response(`Protected content for user: ${JSON.stringify(user)}`);
};

