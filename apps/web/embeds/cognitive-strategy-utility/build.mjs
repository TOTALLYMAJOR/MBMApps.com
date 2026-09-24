import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(root, '../../public/cognitive-strategy-utility');

await mkdir(output, { recursive: true });
await copyFile(path.join(root, 'index.html'), path.join(output, 'index.html'));
