import { JWTPayload, jwtVerify, SignJWT } from "jose";
import type { Middleware, Context } from "../core/server.ts";

const secret = new TextEncoder().encode(Deno.env.get("JWT_SECRET") || "secret-that-no-one-knows");

export async function createJWT(payload: JWTPayload): Promise<string> {
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);

    return jwt;
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}

export const jwtMiddleware: Middleware = async (req, context, next) => {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : context.cookies?.jwt;

    if (!token) {
        return new Response("Unauthorized", { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
        return new Response("Invalid token", { status: 401 });
    }

    (context as Context & { user: JWTPayload }).user = payload;
    return next();
};