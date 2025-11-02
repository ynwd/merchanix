import * as esbuild from "esbuild";
import { denoPlugins } from "@luca/esbuild-deno-loader";

async function build(modulePath?: string, spa?: boolean) {
  let path = `./modules/${modulePath}/Client.tsx`
  if (spa) {
    path = `./modules/${modulePath}/spa.tsx`
  }

  try {

    const cwd = Deno.cwd();
    const configPath = `${cwd}/deno.json`;

    // Esbuild build
    const esbuildRes = await esbuild.build({
      plugins: denoPlugins({
        configPath,
      }),
      entryPoints: [path],
      outfile: `./public/js/${modulePath}/client.js`,

      // Bundling
      format: "esm",
      bundle: true,
      sourcemap: true,
      minify: true,

      // Target & Platform
      platform: 'browser',
      target: ['chrome100', 'firefox100', 'safari15', 'edge100'],

      // Loader & JSX
      loader: {
        '.js': 'jsx',
        '.png': 'file',
        '.jpg': 'file',
        '.svg': 'dataurl',
      },
      jsx: 'automatic',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
    });
    return esbuildRes;
  } catch (error) {
    console.error(error);
  }
}

async function createClient(modulePath: string) {
  const content = `import React from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./App.tsx";

declare global {
    interface Window {
        __INITIAL_PROPS__: Record<string, unknown>;
    }
}

const props = window.__INITIAL_PROPS__ || {};
hydrateRoot(document.getElementById("root")!, <App {...props} />);
`;

  const filePath = `./modules/${modulePath}/Client.tsx`;
  await Deno.writeTextFile(filePath, content);
}

async function deleteClient(modulePath: string) {
  const filePath = `./modules/${modulePath}/Client.tsx`;
  try {
    await Deno.remove(filePath);
  } catch (error) {
    console.error(`Failed to delete ${filePath}:`, error);
  }
}

async function getModulesWithApp(): Promise<string[]> {
  const modules: string[] = [];
  for await (const entry of Deno.readDir("./modules")) {
    if (entry.isDirectory) {
      const dirPath = `./modules/${entry.name}`;
      let hasSpa = false;
      let hasApp = false;
      for await (const file of Deno.readDir(dirPath)) {
        if (file.isFile) {
          if (file.name === 'spa.tsx') {
            hasSpa = true;
          } else if (file.name === 'App.tsx') {
            hasApp = true;
          }
        }
      }
      if (!hasSpa && hasApp) {
        modules.push(entry.name);
      }
    }
  }
  return modules;
}

export { build, createClient, deleteClient, getModulesWithApp }