import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import {
  getMasterScView,
  masterScCheckpoints,
  masterScCommands,
  masterScFactions
} from '@/lib/master-sc';
import { masterScProduct, products, projectScreens } from '@/lib/projects';

describe('MasterSC deterministic showcase model', () => {
  it('resolves faction, supply, and command selections together', () => {
    const view = getMasterScView('prism', 60, 'pressure');

    expect(view.faction).toMatchObject({ id: 'prism', operation: 'Signal Window' });
    expect(view.checkpoint).toMatchObject({ supply: 60, label: 'Midgame checkpoint' });
    expect(view.command).toMatchObject({ id: 'pressure', label: 'Pressure' });
  });

  it('keeps every selectable state complete and unique', () => {
    expect(new Set(masterScFactions.map((faction) => faction.id)).size).toBe(masterScFactions.length);
    expect(new Set(masterScCheckpoints.map((checkpoint) => checkpoint.supply))).toEqual(new Set([20, 60]));
    expect(new Set(masterScCommands.map((command) => command.id)).size).toBe(masterScCommands.length);

    for (const faction of masterScFactions) {
      expect(faction.doctrine.length).toBeGreaterThan(40);
      expect(faction.telemetry.focus.length).toBeGreaterThan(3);
    }
  });
});

describe('MasterSC product truth and publication', () => {
  it('keeps MasterSC canonical but out of the visible catalog', () => {
    expect(masterScProduct).toMatchObject({
      path: '/MasterSC',
      experienceHref: '/MasterSC',
      status: 'Interactive portfolio showcase',
      visible: false
    });
    expect(masterScProduct.sourceRepository.href).toBe('https://github.com/TOTALLYMAJOR/SC2-Master-Coach');
    expect(masterScProduct.secondaryAction?.href).toBe(
      'https://github.com/TOTALLYMAJOR/SC2-Master-Coach/releases/tag/v1.13.0'
    );
    expect(products).toContain(masterScProduct);
    expect(projectScreens).toHaveLength(4);
    expect(projectScreens).not.toContain(masterScProduct);
  });

  it('publishes the direct protected route in the sitemap', async () => {
    const entries = await sitemap();
    expect(entries.some((entry) => entry.url.endsWith('/MasterSC'))).toBe(true);
  });
});

describe('MasterSC motion boundary', () => {
  const componentSource = readFileSync(new URL('../components/master-sc-showcase.tsx', import.meta.url), 'utf8');
  const cssSource = readFileSync(new URL('../components/master-sc-showcase.module.css', import.meta.url), 'utf8');

  it('uses scoped GSAP cleanup and honors reduced motion without Lenis', () => {
    expect(componentSource).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
    expect(componentSource).toContain('gsap.context');
    expect(componentSource).toContain('context.revert()');
    expect(componentSource).not.toContain('Lenis');
  });

  it('leaves content visible before client motion initializes', () => {
    expect(cssSource).not.toContain('visibility: hidden');
    expect(cssSource).not.toContain('opacity: 0');
  });
});
