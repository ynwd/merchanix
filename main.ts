import server from "./core/mod.ts";

server.get("/", () => new Response("API Root"));

server.serve({ port: 8000 });