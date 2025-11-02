// app/main.ts
// Main application setup file
// Import necessary modules and middlewares,
// configure the application, and export the app instance.
// Note: Do not modify this file unless necessary.
import app from "../core/mod.ts";
import { loggerMiddleware } from "../middlewares/logger.ts";
// import { rateLimitMiddleware } from "../middlewares/ratelimit.ts";
import { cookieMiddleware } from "../middlewares/cookie.ts";
import { kvMiddleware } from "../middlewares/kv.ts";
import { renderMiddleware } from "../middlewares/render.ts";
import { staticFiles } from "../middlewares/static.ts";
import { bodyParser } from "../middlewares/bodyparser.ts";
import { routes } from "./routes.ts";

// Register global middlewares
app.use(loggerMiddleware);
app.use(bodyParser);
app.use(kvMiddleware);
// app.use(rateLimitMiddleware);
app.use(cookieMiddleware);
app.use(renderMiddleware);

// Route middleware
app.use(routes);

// Static files
app.use(staticFiles("/spa", "./public/spa", { spaFallback: true }));
app.use(staticFiles("/", "./public"));

export { app }