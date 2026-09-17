import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const sourceRoot = dirname(fileURLToPath(import.meta.url));
const publicRoot = resolve(sourceRoot, '../../public/development-control-plane');
const assetRoot = resolve(publicRoot, 'assets');

await rm(assetRoot, { recursive: true, force: true });
await mkdir(assetRoot, { recursive: true });

await build({
  entryPoints: [resolve(sourceRoot, 'src/main.jsx')],
  outdir: assetRoot,
  entryNames: 'app',
  assetNames: '[name]-[hash]',
  bundle: true,
  minify: true,
  format: 'esm',
  jsx: 'automatic',
  target: ['es2020'],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});

const stylesheet = (await readFile(resolve(assetRoot, 'app.css'), 'utf8')).replaceAll('</style', '<\\/style');
const application = (await readFile(resolve(assetRoot, 'app.js'), 'utf8')).replaceAll('</script', '<\\/script');

await writeFile(resolve(publicRoot, 'index.html'), `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Interactive MBMApps development control plane demonstration." />
  <meta name="color-scheme" content="dark" />
  <title>MBMApps — Development Control Plane</title>
  <style>${stylesheet}</style>
</head>
<body>
  <div id="root"></div>
  <script type="module">${application}</script>
</body>
</html>
`);

await rm(assetRoot, { recursive: true, force: true });
