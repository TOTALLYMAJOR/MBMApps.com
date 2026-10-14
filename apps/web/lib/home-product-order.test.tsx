import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TerminalPortfolioHome } from '@/components/terminal-portfolio-home';
import { SiteSessionProvider } from '@/components/site-session';

vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(), useRouter: () => ({}) }));

describe('homepage product order', () => {
  it('keeps the first viewport focused on Wale and one portfolio path', () => {
    const html = renderToStaticMarkup(
      <SiteSessionProvider role="guest"><TerminalPortfolioHome /></SiteSessionProvider>,
    );
    const nav = html.slice(html.indexOf('<nav'), html.indexOf('</nav>'));
    const actionStart = html.indexOf('terminal-hero__actions');
    const actions = html.slice(actionStart, html.indexOf('</div>', actionStart));

    expect(nav).toContain('href="/wale"');
    expect(nav).toContain('href="#portfolio"');
    expect(nav).toContain('href="/about"');
    expect(nav).not.toContain('href="#quotepilot"');
    expect(nav).not.toContain('href="#quietpilot"');
    expect(nav).not.toContain('href="#leaguepilot"');
    expect(actions).toContain('class="terminal-hero__primary" href="/wale"');
    expect(actions).toContain('href="#portfolio"');
    expect(actions).not.toContain('href="/about"');
    expect(actions).not.toContain('href="/control-plane"');
    expect(actions).not.toContain('Start a conversation');
  });

  it('uses three featured chapters and a progressive operating-world destination hierarchy', () => {
    const html = renderToStaticMarkup(
      <SiteSessionProvider role="guest"><TerminalPortfolioHome /></SiteSessionProvider>,
    );

    const wale = html.indexOf('data-wale-started="false"');
    const quoteFlow = html.indexOf('id="quoteflow"');
    const quietPilot = html.indexOf('id="quietpilot"');
    const portfolio = html.indexOf('id="portfolio"');

    expect(wale).toBeGreaterThan(-1);
    expect(quoteFlow).toBeGreaterThan(wale);
    expect(quietPilot).toBeGreaterThan(quoteFlow);
    expect(portfolio).toBeGreaterThan(quietPilot);
    expect(html).not.toContain('id="studio"');
    expect(html).toContain('data-method-step="observe"');
    expect(html).toContain('data-method-step="verify"');
    expect(html).toContain('data-method-step="ship"');
    expect(html).toContain('data-method-step="prove"');
    expect(html).toContain('data-destination-group="featured"');
    expect(html).toContain('data-destination-group="more"');
    expect(html).toContain('data-destination-group="studio"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('The method becomes focused products.');
    expect(html).toContain('Discuss your operation');
    expect(html).not.toContain('id="sportpilot"');
    expect(html).not.toContain('id="leaguepilot"');
    expect(html).not.toContain('id="master-sc"');
    expect(html).not.toContain('id="stack-title"');
    expect(html).toContain('data-portfolio-slug="sportpilot"');
    expect(html).toContain('data-portfolio-slug="leaguepilot"');
    expect(html).toContain('data-portfolio-slug="master-sc"');
    expect(html).toContain('href="https://sportpilot.mbmapps.com/"');
    expect(html).toContain('href="/MasterSC"');
    expect(html).toContain('href="/control-plane"');
    expect(html).toContain('href="/contact"');
    expect(html).toContain('href="/wale"');
    expect(html).toContain('External site');
    expect(html).toContain('Protected experience');
    expect(html).toContain('Public archive · local bridge required');
    expect(html).toContain('data-quietpilot-story="true"');
    expect(html).toContain('quietpilot-story.png');
    expect(html).not.toContain('title="QuietPilot live website"');
  });

  it('keeps member conversation authority inside Studio paths', () => {
    const html = renderToStaticMarkup(
      <SiteSessionProvider role="member"><TerminalPortfolioHome /></SiteSessionProvider>,
    );

    expect(html).toContain('Start a member conversation');
    expect(html).toContain('Authenticated members only');
  });
});
