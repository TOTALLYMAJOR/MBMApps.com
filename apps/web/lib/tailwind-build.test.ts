import { readFile } from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import { expect, it } from 'vitest';

it('compiles global CSS with standard and configured theme utilities', async () => {
  const configPath = '../postcss.config.mjs';
  const { default: config } = await import(configPath);
  const plugins = await Promise.all(
    Object.entries(config.plugins).map(async ([name, options]) => {
      const { default: plugin } = await import(name);
      return plugin(options);
    })
  );
  const from = path.resolve(import.meta.dirname, '../app/globals.css');
  const source = await readFile(from, 'utf8');
  const result = await postcss(plugins).process(
    `${source}\n@source inline("flex bg-canvas font-display");`,
    { from }
  );

  expect(result.css).toContain('.flex');
  expect(result.css).toContain('display: flex');
  expect(result.css).toContain('.bg-canvas');
  expect(result.css).toContain('--mbm-canvas');
  expect(result.css).toContain('.font-display');
  expect(result.css).toContain('--font-bricolage-grotesk');
  expect(result.css).not.toMatch(/@tailwind\s/);
});
