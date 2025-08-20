import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add custom rules here
  {
    rules: {
      // Disable the no-unused-vars rule completely
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-expressions": "off",
      " @typescript-eslint/no-unused-expressions": "off",

      // Or to treat it as a warning instead of error, use:
      // "no-unused-vars": "warn",
      // "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;
