import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off'
    }
  },
  {
    files: ['embeds/**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@next/next/no-html-link-for-pages': 'off'
    }
  },
  globalIgnores([
    '.next/**',
    'next-env.d.ts',
    'node_modules/**',
    'public/component-studio.html',
    'public/nexamind-agentic-demo/**',
    'public/nexamind-cause-effect/**'
  ])
]);

export default config;
