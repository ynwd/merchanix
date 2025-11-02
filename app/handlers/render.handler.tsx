import React from "react";
import { Handler } from "../../core/mod.ts";


export const renderHandler: Handler = (_, ctx) => {
    const element = React.createElement("div", null, "Hello from React!");
    const html = ctx.renderToString!(element);
    return new Response(html, {
        headers: { "Content-Type": "text/html" },
    });
};