// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.33.1/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./index.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    name: "@kojiro.ueda/promise-pool",
    version: Deno.args[0] ?? "",
    description: "PromisePool creates a pool that limits the number of concurrent JavaScript operations using Promise.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/naoki-tomita/promise-pool.git",
    },
    bugs: {
      url: "https://github.com/naoki-tomita/promise-pool/issues",
    },
    publishConfig: {
      access: "public"
    }
  },
});

Deno.copyFileSync("README.md", "npm/README.md");
