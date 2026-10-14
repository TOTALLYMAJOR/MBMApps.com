import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LiveProductSite } from '@/components/live-product-site';
import { WaleArchiveShell } from '@/components/wale-archive-shell';

function iframeMarkup(html: string) {
  const iframe = html.match(/<iframe\b[^>]*>/)?.[0];
  expect(iframe).toBeDefined();
  return iframe!;
}

describe('homepage scroll-through previews', () => {
  it('makes QuietPilot inventory, staffing, and protected partner collaboration explicit', () => {
    const html = renderToStaticMarkup(<LiveProductSite slug="quietpilot" id="quietpilot" label="QuietPilot" />);
    for (const label of ['Inventory', 'Staffing', 'Partner portals']) {
      expect(html).toContain(`<dt>${label}</dt>`);
    }
    expect(html).toContain('private operations remain protected');
    expect(html).toContain('planning alone does not prove readiness');
  });

  it('loads protected QuietPilot artwork directly with the browser session', () => {
    const html = renderToStaticMarkup(<LiveProductSite slug="quietpilot" id="quietpilot" label="QuietPilot" />);
    expect(html).toContain('src="/product-screens/quietpilot-story.png"');
    expect(html).not.toContain('/_next/image');
  });

  it('keeps the embedded Cinema animation outside keyboard and pointer interaction', () => {
    const html = renderToStaticMarkup(<WaleArchiveShell embedded />);
    const frame = iframeMarkup(html);
    expect(frame).toContain('quality=cinema');
    expect(frame).toContain('data-scroll-preview="true"');
    expect(frame).toContain('inert=""');
    expect(frame).toContain('tabindex="-1"');
    expect(frame).toContain('aria-hidden="true"');
    expect(html).toContain('Profile your system');
  });

  it.each(['quoteflow', 'leaguepilot', 'sportpilot'] as const)('keeps %s preview inert but its full-site link accessible', (slug) => {
    const html = renderToStaticMarkup(<LiveProductSite slug={slug} id={slug} label={slug} />);
    const frame = iframeMarkup(html);
    expect(frame).toContain('data-scroll-preview="true"');
    expect(frame).toContain('inert=""');
    expect(frame).toContain('tabindex="-1"');
    expect(frame).toContain('aria-hidden="true"');
    expect(html).toContain('Open full site');
    expect(html).toContain('Preview — open the full site to interact.');
  });

  it.each(['quoteflow', 'leaguepilot', 'sportpilot'] as const)('preserves standalone %s interaction', (slug) => {
    const frame = iframeMarkup(renderToStaticMarkup(<LiveProductSite slug={slug} id={slug} label={slug} standalone />));
    expect(frame).not.toContain('inert');
    expect(frame).not.toContain('tabindex="-1"');
    expect(frame).not.toContain('aria-hidden="true"');
    expect(frame).not.toContain('data-scroll-preview="true"');
  });

  it('previews MasterSC locally as sample state and links to its protected route', () => {
    const html = renderToStaticMarkup(<LiveProductSite slug="master-sc" id="master-sc" label="SC2 Master Coach" />);
    const frame = iframeMarkup(html);
    expect(frame).toContain('src="/MasterSC"');
    expect(frame).toContain('sample showcase');
    expect(frame).toContain('inert=""');
    expect(frame).toContain('tabindex="-1"');
    expect(frame).toContain('data-scroll-preview="true"');
    expect(html).toContain('href="/MasterSC"');
    expect(html).toContain('Sample interface state');
    expect(html).not.toContain('live website');
  });
});
