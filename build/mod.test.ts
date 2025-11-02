import { build, createClient, deleteClient, getModulesWithApp } from "./mod.ts";
import { assertRejects, assert } from "@std/assert";

Deno.test(
  {
    permissions: { env: true, read: true, write: true, run: true },
    name: "build success",
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
  async (t) => {
    const testModule = `test_build_success_${Date.now()}`;
    const moduleDir = `./modules/${testModule}`;
    const publicDir = `./public/js/${testModule}`;

    await t.step("setup", async () => {
      await Deno.mkdir(moduleDir, { recursive: true });
      await Deno.writeTextFile(
        `${moduleDir}/App.tsx`,
        'export const App = () => <div>Hello</div>;',
      );
      await createClient(testModule);
    });

    await t.step("execute build", async () => {
      const result = await build(testModule);
      assert(result, "Build should return a result object");
      assert(result.errors.length === 0, "Build should have no errors");
    });

    await t.step("cleanup", async () => {
      await Deno.remove(moduleDir, { recursive: true });
      await Deno.remove(publicDir, { recursive: true }).catch(() => { });
    });
  },
);

Deno.test(
  {
    permissions: { env: true, read: true, write: true, run: true },
    name: "build error (non-existent module)",
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
  async () => {
    const result = await build("nonExistentModule");
    assert(result === undefined, "Build should return undefined on error");
  },
);

Deno.test(
  {
    permissions: { env: true, read: true, write: true, run: true },
    name: "createClient success",
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
  async (t) => {
    const testModule = `test_create_client_${Date.now()}`;
    const moduleDir = `./modules/${testModule}`;

    await t.step("setup", async () => {
      await Deno.mkdir(moduleDir, { recursive: true });
    });

    await t.step("execute createClient and verify", async () => {
      await createClient(testModule);
      const filePath = `${moduleDir}/Client.tsx`;
      const content = await Deno.readTextFile(filePath);
      assert(content.includes("hydrateRoot"), "Client.tsx should contain hydrateRoot");
    });

    await t.step("cleanup", async () => {
      await Deno.remove(moduleDir, { recursive: true });
    });
  },
);

Deno.test(
  {
    permissions: { env: true, read: true, write: true, run: true },
    name: "deleteClient success",
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
  async (t) => {
    const testModule = `test_delete_client_${Date.now()}`;
    const moduleDir = `./modules/${testModule}`;
    const filePath = `${moduleDir}/Client.tsx`;

    await t.step("setup", async () => {
      await Deno.mkdir(moduleDir, { recursive: true });
      await Deno.writeTextFile(filePath, "test content");
    });

    await t.step("execute deleteClient and verify", async () => {
      await deleteClient(testModule);
      await assertRejects(
        () => Deno.stat(filePath),
        Deno.errors.NotFound,
      );
    });

    await t.step("cleanup", async () => {
      // The directory might already be gone if the test failed, so catch errors.
      await Deno.remove(moduleDir, { recursive: true }).catch(() => { });
    });
  },
);

Deno.test(
  {
    permissions: { env: true, read: true, write: true, run: true },
    name: "deleteClient error (non-existent file)",
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
  async () => {
    // This test ensures that attempting to delete a non-existent client file
    // does not throw an unhandled exception. The function's internal catch
    // block should handle the error gracefully.
    await deleteClient("nonExistentModuleForDelete");
  },
);

Deno.test(
  {
    permissions: { env: true, read: true, write: true, run: true },
    name: "getModulesWithApp success",
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
  async (t) => {
    const baseDir = `./test_modules_${Date.now()}`;
    const module1 = "module1";
    const module2 = "module2";
    const module3 = "module3"; // This one won't have an App.tsx

    await t.step("setup", async () => {
      await Deno.mkdir(`${baseDir}/${module1}`, { recursive: true });
      await Deno.mkdir(`${baseDir}/${module2}`, { recursive: true });
      await Deno.mkdir(`${baseDir}/${module3}`, { recursive: true });
      await Deno.writeTextFile(`${baseDir}/${module1}/App.tsx`, "export const App = () => null;");
      await Deno.writeTextFile(`${baseDir}/${module2}/App.tsx`, "export const App = () => null;");
      await Deno.writeTextFile(`${baseDir}/${module1}/some_other_file.ts`, "");
    });

    await t.step("execute getModulesWithApp and verify", async () => {
      // Temporarily override Deno.readDir to point to our test directory
      const originalReadDir = Deno.readDir;
      // deno-lint-ignore no-explicit-any
      (Deno as any).readDir = (path: string | URL) => {
        if (path === "./modules") {
          return originalReadDir(baseDir);
        }
        return originalReadDir(path);
      };
      // Temporarily override Deno.stat
      const originalStat = Deno.stat;
      // deno-lint-ignore no-explicit-any
      (Deno as any).stat = (path: string | URL) => {
        const newPath = path.toString().replace("./modules", baseDir);
        return originalStat(newPath);
      };

      const modules = await getModulesWithApp();

      // Restore original functions
      // deno-lint-ignore no-explicit-any
      (Deno as any).readDir = originalReadDir;
      // deno-lint-ignore no-explicit-any
      (Deno as any).stat = originalStat;

      assert(modules.includes(module1), "Should include module1");
      assert(modules.includes(module2), "Should include module2");
      assert(!modules.includes(module3), "Should not include module3");
      assert(modules.length === 2, "Should find exactly 2 modules");
    });

    await t.step("cleanup", async () => {
      await Deno.remove(baseDir, { recursive: true });
    });
  },
);
