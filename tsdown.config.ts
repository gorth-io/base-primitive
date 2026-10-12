/// <reference types="node" />

import { defineConfig } from "tsdown"

export default defineConfig({
  clean: true,
  dts: true,
  fixedExtension: false,
  // Keep shared modules (e.g. React contexts) in common chunks
  // so different entrypoints consume the same runtime instance.
  // splitting: true,
  entry: [
    "src/index.ts",
    "src/components/**/*.tsx",
    "src/layouts/*.tsx",
    "src/providers/*.tsx",
    "src/hooks/*.ts",
    "src/hooks/*.tsx",
    "src/lib/**/*.ts",
    "src/lib/**/*.tsx",
    "src/utils/**/*.ts",
    "src/utils/**/*.tsx",
    "src/cores/**/*.ts",
    "src/modules/*.ts",
    "src/pages/*.tsx",
    // "src/assets/**/*.ts",
    // "src/assets/**/*.tsx",
    "src/assets/*.svg",
    "src/assets/*.png",
    "src/assets/*.jpg",
    "src/assets/*.jpeg",
  ],
  loader: {
    '.png': 'copy',
    '.jpg': 'copy',
    '.jpeg': 'copy',
    '.svg': 'copy',
  },
  format: ["esm"],
  sourcemap: false,
  minify: false,
  target: "es2024",
  outDir: "dist",
  treeshake: true,

  deps: {
    neverBundle: ["react", "react-dom"],
  },
})
