import { build, createClient, deleteClient, getModulesWithApp } from "./mod.ts";

async function rebuild() {
    console.log("Rebuilding modules...");
    const modules = await getModulesWithApp();
    for (const mod of modules) {
        await createClient(mod);
        await build(mod);
        await deleteClient(mod);
        console.log(`Rebuild for module '${mod}' completed.`);
    }
}

// Initial build
await rebuild();

// Watch for changes in modules/
const watcher = Deno.watchFs("./modules");
let rebuildTimeout: number | undefined;
let isRebuilding = false;

for await (const event of watcher) {
    if (event.kind === "modify" || event.kind === "create" || event.kind === "remove") {
        // Skip if already rebuilding
        if (isRebuilding) {
            continue;
        }

        // Clear any existing timeout
        if (rebuildTimeout) {
            clearTimeout(rebuildTimeout);
        }

        // Set a new timeout to rebuild after 1000ms
        rebuildTimeout = setTimeout(async () => {
            isRebuilding = true;
            await rebuild();
            isRebuilding = false;
            rebuildTimeout = undefined;
        }, 1000);
    }
}