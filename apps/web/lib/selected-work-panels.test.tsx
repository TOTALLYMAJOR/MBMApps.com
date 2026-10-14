import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SelectedWorkPanels } from '@/components/selected-work-panels';

describe('selected portfolio work panels', () => {
  it('shows the four selected works in the owner-defined order', () => {
    const html = renderToStaticMarkup(<SelectedWorkPanels />);
    const works = [
      'Little Legend Studios',
      'Wake for Warriors',
      'Jour et Nuit Concierge',
      'Arena Advisor',
    ];

    let previousIndex = -1;
    for (const work of works) {
      const currentIndex = html.indexOf(`data-portfolio-work="${work}"`);
      expect(currentIndex).toBeGreaterThan(previousIndex);
      previousIndex = currentIndex;
    }

    expect(html).toContain('little-legend-studios.png');
    expect(html).toContain('wake-for-warriors.png');
    expect(html).toContain('jour-et-nuit.png');
    expect(html).toContain('arena-advisor.png');
    expect(html.match(/data-portfolio-work=/g)).toHaveLength(4);
  });
});
