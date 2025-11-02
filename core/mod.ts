import server from "./server.ts";
import type { Middleware, Context, Handler } from "./server.ts";
import { createRouter } from "./router.ts";

const modules = { ...server };
export default modules;
export { createRouter };
export type { Middleware, Handler, Context };