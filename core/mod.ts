import server from "./server.ts";
import type { Middleware, Context, Handler } from "./server.ts";
import { createRouter } from "./router.ts";
import { autoRegisterModules } from "./loader.ts";

const modules = { ...server };
export default modules;
export { createRouter, autoRegisterModules };
export type { Middleware, Handler, Context };