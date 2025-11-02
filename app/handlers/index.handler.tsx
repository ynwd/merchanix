import { Handler } from "../../core/mod.ts";
import { App } from "../../modules/index/App.tsx";

export const rootHandler: Handler = (_req, ctx) => {
    const props = { name: "Fastro Merchant", serverTime: new Date().toISOString() };
    const appModule = "index"
    const appTitle = "Fastro Merchant - Build Your Online Store";
    const html = ctx.renderToString!(<App {...props} />, {
        includeDoctype: true,
        title: appTitle,
        initialProps: props,
        module: appModule,
        head: `
             <head>
                 <meta charset="UTF-8">
                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
                 <meta name="description" content="Take control of your business. Create your free, custom online store and break free from marketplace restrictions on branding, data, and customer experience.">
                 <title>Fastro Merchant - Build Your Online Store</title>
                 <link rel="stylesheet" href="/css/app.css?v=${Date.now()}">
             </head>
            `
    });
    return new Response(html, {
        headers: { "Content-Type": "text/html" },
    });
};