import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    rules: {
      // Allow `any` usage (disable or warn)
      '@typescript-eslint/no-explicit-any': 'off',
      // Or: "@typescript-eslint/no-explicit-any": "warn",

      // Allow require()
      '@typescript-eslint/no-require-imports': 'off',

      // Relax JSX escape for apostrophes
      'react/no-unescaped-entities': 'off',

      // Already disabled in your config
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];

export default eslintConfig;
