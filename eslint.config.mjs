import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Standalone scraped workspace + helper scripts (not part of the app).
    "scrap/**",
    "references/**",
  ]),
  {
    // React Three Fiber relies on imperative, per-frame mutation of Three.js
    // objects (geometry attributes, materials, textures) — the intended R3F
    // pattern. These React Compiler rules misflag that as impurity.
    files: ["src/components/**/*.tsx"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
