import createMDX from '@next/mdx';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');

const withMDX = createMDX({
  extension: /\.(md|mdx)$/
});

const nextConfig = {
  outputFileTracingRoot: workspaceRoot,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    qualities: [75, 90]
  },
  experimental: {
    mdxRs: true
  }
};

export default withMDX(nextConfig);
