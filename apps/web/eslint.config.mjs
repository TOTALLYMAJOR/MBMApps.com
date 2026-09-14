import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const baseDirectory = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory });

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['.next/**', 'next-env.d.ts', 'node_modules/**', 'public/component-studio.html', 'public/nexamind-agentic-demo/**', 'public/nexamind-cause-effect/**']
  }
];

export default config;
