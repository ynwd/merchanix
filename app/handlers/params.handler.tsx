import { Handler } from "../../core/mod.ts";

export const renderWithParamsHandler: Handler = (_, ctx) => {
    const name = ctx.params.name || "Guest";
    const element = <div>Hello, {name}, from React with params!</div>;
    const html = ctx.renderToString!(element, { includeDoctype: true });
    return new Response(html, {
        headers: { "Content-Type": "text/html" },
    });
};