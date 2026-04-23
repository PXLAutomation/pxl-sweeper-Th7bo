import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const rootDir = process.cwd();
const distDir = resolve(rootDir, "dist");

async function build() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  await cp(resolve(rootDir, "index.html"), resolve(distDir, "index.html"));
  await cp(resolve(rootDir, "src"), resolve(distDir, "src"), { recursive: true });

  // Prevent GitHub Pages from trying to interpret the output as a Jekyll site.
  await writeFile(resolve(distDir, ".nojekyll"), "");
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
