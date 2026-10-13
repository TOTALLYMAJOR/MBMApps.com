import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { HomeArrival } from '@/components/home-arrival';
import { SiteSessionProvider } from '@/components/site-session';
import { WaleHomeSection } from '@/components/wale-home-section';
import { destinationAfterSignIn } from './home-arrival';

vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(), useRouter: () => ({}) }));

describe('homepage arrival', () => {
  it('goes straight from successful identity establishment to the home welcome', () => {
    expect(destinationAfterSignIn('/')).toBe('/?welcome=1');
    expect(destinationAfterSignIn('/MasterSC')).toBe('/MasterSC');
    expect(destinationAfterSignIn('/wale')).toBe('/wale');
  });

  it('refuses external or entrance-loop destinations for an existing session', () => {
    for (const next of ['//example.com', '/\\example.com', 'https://example.com', '/gate', null]) {
      expect(destinationAfterSignIn(next)).toBe('/?welcome=1');
    }
  });

  it('renders the entrance first, even for returning guest and member sessions', () => {
    for (const role of ['guest', 'member', null] as const) {
      const html = renderToStaticMarkup(<SiteSessionProvider role={role}><HomeArrival>HOMEPAGE_SENTINEL</HomeArrival></SiteSessionProvider>);
      expect(html).toContain('Enter<br/>MBMApps.');
      expect(html).toContain('Google');
      expect(html).toContain('Apple');
      expect(html).not.toContain('HOMEPAGE_SENTINEL');
      expect(html.includes('Existing')).toBe(role !== null);
    }
  });

  it('renders the exact welcome as readable content before motion initializes', () => {
    const html = renderToStaticMarkup(<HomeArrival welcome>HOMEPAGE_SENTINEL</HomeArrival>);
    expect(html).toContain('Michael Brandon');
    expect(html).toContain('&amp; MBMapp Studios');
    expect(html).toContain('welcome you.');
    expect(html).not.toContain('HOMEPAGE_SENTINEL');
    expect(html).not.toContain('opacity:0');
  });

  it('leaves the archive unmounted until the homepage visitor reaches its section', () => {
    const html = renderToStaticMarkup(<WaleHomeSection />);
    expect(html).not.toContain('<iframe');
    expect(html).toContain('data-wale-started="false"');
    expect(html).toContain('href="/wale"');
    expect(html).toContain('Wale: Make the whole system work.');
    expect(html).toContain('Audit controls, diagnose the leading constraint');
    expect(html).toContain('Open Wale archive');
    expect(html).toContain('repository analysis requires the local Wale bridge');
  });
});
