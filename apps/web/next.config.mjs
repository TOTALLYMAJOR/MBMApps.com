import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.(md|mdx)$/
});

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  experimental: {
    mdxRs: true
  }
};

export default withMDX(nextConfig);
