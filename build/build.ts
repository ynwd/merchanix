import { build, createClient, deleteClient, getModulesWithApp } from "./mod.ts";

const modules = await getModulesWithApp();
for (const mod of modules) {
    await createClient(mod);
    await build(mod);
    await deleteClient(mod);
    console.log(`Build for module '${mod}' completed.`);
}