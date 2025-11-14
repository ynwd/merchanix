import type { Middleware } from "./server.ts";

/**
 * Automatically imports and registers middleware modules
 * from the ../modules/ directory.
 * @param app 
 */
export async function autoRegisterModules(app: { use: (middleware: Middleware) => void }) {
    const modulesDir = new URL("../modules/", import.meta.url);

    for await (const entry of Deno.readDir(modulesDir)) {
        if (!entry.isDirectory) continue;

        const modPath = new URL(`${entry.name}/mod.ts`, modulesDir).href;

        try {
            const mod = await import(modPath);

            if (mod.default) {
                app.use(mod.default);
                console.log(`Registered default export from ${entry.name}/mod.ts`);
            } else if (mod[entry.name]) {
                app.use(mod[entry.name]);
                console.log(`Registered ${entry.name} export from ${entry.name}/mod.ts`);
            } else {
                console.warn(`No valid export found in ${entry.name}/mod.ts`);
            }
        } catch (_err) {
            // Handle module import errors silently
        }
    }
}