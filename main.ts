// app.ts for entry point
// Import the main application module and start the server
// with specified port configuration.
// Note: Do not modify this file unless necessary.
import { app } from "./app/app.ts"; app.serve({ port: parseInt(Deno.args[0]) || 8000 });