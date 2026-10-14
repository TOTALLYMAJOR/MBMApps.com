import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { TerminalPortfolioHome } from '@/components/terminal-portfolio-home';
import { WALE_ARCHIVE_PREVIEW_SRC, WaleHomeSection } from '@/components/wale-home-section';

vi.mock('next/navigation', () => ({ useRouter: () => ({}) }));

describe('homepage Wale surface', () => {
  it('binds the homepage preview to the white Living Archive', () => {
    expect(WALE_ARCHIVE_PREVIEW_SRC).toBe('/wale-archive/index.html?quality=cinema');

    const html = renderToStaticMarkup(<WaleHomeSection />);
    expect(html).toContain('data-wale-surface="living-archive"');
    expect(html).toContain('Wale: The Living Archive');
    expect(html).toContain('href="/wale"');
    expect(html).toContain('white Living Archive');
  });

  it('mounts the Living Archive section from the production homepage', () => {
    const html = renderToStaticMarkup(<TerminalPortfolioHome />);
    expect(html).toContain('data-wale-surface="living-archive"');
    expect(html).toContain('Wale: The Living Archive');
  });
});
