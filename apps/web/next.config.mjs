import createMDX from '@next/mdx';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');

const withMDX = createMDX({
  extension: /\.(md|mdx)$/
});

const nextConfig = {
  outputFileTracingRoot: workspaceRoot,
  poweredByHeader: false,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=()' }
      ]
    }];
  },
  images: {
    qualities: [75, 90]
  },
  experimental: {
    mdxRs: true
  }
};

export default withMDX(nextConfig);
