import { Context, Handler } from "../../core/mod.ts";

type BodyState = {
    json?: unknown;
    formData?: FormData;
    text?: string;
    bytes?: Uint8Array;
    bodyError?: Error;
    _parsed?: boolean;
};

type ExtendedContext = Context & { state?: BodyState };

export const notifyHandler: Handler = async (_req, ctx) => {
    const state = (ctx as ExtendedContext).state || {};
    if (state.bodyError) return new Response("Unable to read form data", { status: 400 });

    const formData: FormData | undefined = state.formData;
    if (!formData) return new Response("Unsupported Content-Type", { status: 415 });

    const emailRaw = formData.get("email");
    const email = typeof emailRaw === "string" ? emailRaw.trim() : "";
    if (!email) return new Response("Email is required", { status: 400 });

    const kv = (ctx as Context & { kv?: Deno.Kv }).kv;
    if (!kv) return new Response("KV not available", { status: 500 });

    await kv.set(["notifications", email], { email, timestamp: new Date().toISOString() });

    ctx.setCookie?.("notify_success", "true", { path: "/", maxAge: 300 });

    return new Response(null, { status: 303, headers: { Location: "/success" } });
};
