import { assertEquals } from "@std/assert";
import server, { _resetForTests, _getStaticRoutesForTests } from "./server.ts";

const makeCtx = () => ({
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 12345 } as Deno.Addr,
    params: {}, query: {}
});
const findStaticRoute = (url: string) =>
    _getStaticRoutesForTests().find(r => r.method === "GET" && r.pattern.test(url));

Deno.test("staticFiles - serves CSS files with correct content type", async () => {
    _resetForTests();

    // Create a temporary test directory with a CSS file
    const testDir = await Deno.makeTempDir();
    const cssContent = "body { color: red; }";
    await Deno.writeTextFile(`${testDir}/test.css`, cssContent);

    try {
        server.static("/assets", testDir);

        const url = "http://localhost/assets/test.css";
        const route = findStaticRoute(url);
        assertEquals(!!route, true);

        const res = await route!.handler(new Request(url), makeCtx());
        assertEquals(res.status, 200);
        assertEquals(res.headers.get("Content-Type"), "text/css");
        assertEquals(await res.text(), cssContent);
    } finally {
        await Deno.remove(testDir, { recursive: true });
    }
});

Deno.test("staticFiles - serves index.html for directory requests", async () => {
    _resetForTests();

    const testDir = await Deno.makeTempDir();
    const htmlContent = "<!DOCTYPE html><html><body>Test</body></html>";
    await Deno.writeTextFile(`${testDir}/index.html`, htmlContent);

    try {
        server.static("/", testDir);

        const url = "http://localhost/";
        const route = findStaticRoute(url);
        assertEquals(!!route, true);

        const res = await route!.handler(new Request(url), makeCtx());
        assertEquals(res.status, 200);
        assertEquals(res.headers.get("Content-Type"), "text/html");
        assertEquals(await res.text(), htmlContent);
    } finally {
        await Deno.remove(testDir, { recursive: true });
    }
});

Deno.test("staticFiles - returns 404 for non-existent files", async () => {
    _resetForTests();

    const testDir = await Deno.makeTempDir();

    try {
        server.static("/public", testDir);

        const url = "http://localhost/public/nonexistent.txt";
        const route = findStaticRoute(url);
        assertEquals(!!route, true);

        const res = await route!.handler(new Request(url), makeCtx());
        assertEquals(res.status, 404);
    } finally {
        await Deno.remove(testDir, { recursive: true });
    }
});

Deno.test("staticFiles - serves JavaScript files with correct content type", async () => {
    _resetForTests();

    const testDir = await Deno.makeTempDir();
    const jsContent = "console.log('test');";
    await Deno.writeTextFile(`${testDir}/app.js`, jsContent);

    try {
        server.static("/js", testDir);

        const url = "http://localhost/js/app.js";
        const route = findStaticRoute(url);
        assertEquals(!!route, true);

        const res = await route!.handler(new Request(url), makeCtx());
        assertEquals(res.status, 200);
        assertEquals(res.headers.get("Content-Type"), "application/javascript");
        assertEquals(await res.text(), jsContent);
    } finally {
        await Deno.remove(testDir, { recursive: true });
    }
});

Deno.test("staticFiles - normalizes URL prefix correctly", async () => {
    _resetForTests();

    const testDir = await Deno.makeTempDir();
    await Deno.writeTextFile(`${testDir}/test.txt`, "content");

    try {
        server.static("/assets/", testDir); // trailing slash

        const url = "http://localhost/assets/test.txt";
        const route = findStaticRoute(url);
        assertEquals(!!route, true);

        const res = await route!.handler(new Request(url), makeCtx());
        assertEquals(res.status, 200);
        assertEquals(res.headers.get("Content-Type"), "text/plain");
        assertEquals(await res.text(), "content");
    } finally {
        await Deno.remove(testDir, { recursive: true });
    }
});

Deno.test("staticFiles - serves files from nested directories", async () => {
    _resetForTests();

    const testDir = await Deno.makeTempDir();
    await Deno.mkdir(`${testDir}/css`, { recursive: true });
    const cssContent = "body { background: blue; }";
    await Deno.writeTextFile(`${testDir}/css/style.css`, cssContent);

    try {
        server.static("/", testDir);

        const url = "http://localhost/css/style.css";
        const route = findStaticRoute(url);
        assertEquals(!!route, true);

        const res = await route!.handler(new Request(url), makeCtx());
        assertEquals(res.status, 200);
        assertEquals(res.headers.get("Content-Type"), "text/css");
        assertEquals(await res.text(), cssContent);
    } finally {
        await Deno.remove(testDir, { recursive: true });
    }
});

Deno.test("staticFiles - serves index.html for subdirectory requests", async () => {
    _resetForTests();

    const testDir = await Deno.makeTempDir();
    await Deno.mkdir(`${testDir}/docs`, { recursive: true });
    const docsHtml = "<!DOCTYPE html><html><body>Docs</body></html>";
    await Deno.writeTextFile(`${testDir}/docs/index.html`, docsHtml);

    try {
        server.static("/", testDir);

        const url = "http://localhost/docs/";
        const route = findStaticRoute(url);
        assertEquals(!!route, true);

        const res = await route!.handler(new Request(url), makeCtx());
        assertEquals(res.status, 200);
        assertEquals(res.headers.get("Content-Type"), "text/html");
        assertEquals(await res.text(), docsHtml);
    } finally {
        await Deno.remove(testDir, { recursive: true });
    }
});