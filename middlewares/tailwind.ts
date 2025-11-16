import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import { Context } from "../core/mod.ts";

function render(content: string) {
    return new Response(content, {
        status: 200,
        headers: {
            "Content-Type": "text/css",
            "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
    });
}


async function processCss(staticDir: string) {
    const plugins = [
        autoprefixer,
        tailwindcss,
        cssnano,
    ];

    try {
        const path = Deno.cwd() + staticDir + "/css/tailwind.css";
        const content = Deno.readTextFileSync(path);
        const result = await postcss(plugins).process(content, {
            from: "undefined",
            to: 'undefined',
        });
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export function tailwind(pathname = "/styles.css", staticDir = "/static") {
    const cache = new Map<string, string>();
    return async (req: Request, _context: Context, next: () => Response | Promise<Response>) => {
        const url = new URL(req.url);
        if (url.pathname !== pathname) return next();

        const cached = cache.get(pathname);
        if (cached) return render(cached);

        const result = await processCss(staticDir);
        if (result) {
            cache.set(pathname, result.content);
            return render(result.content);
        }
        return next();
    };
}