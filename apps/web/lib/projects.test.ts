import { describe, expect, it } from 'vitest';
import { getProjectBySlug, projectScreens } from '@/lib/projects';

describe('project catalog', () => {
  it('lists exactly the three approved MBMApps applications', () => {
    expect(projectScreens).toHaveLength(3);
    expect(projectScreens.map((project) => project.slug)).toEqual(['quietpilot', 'leaguepilot', 'quoteflow']);

    const slugs = new Set(projectScreens.map((project) => project.slug));
    const paths = new Set(projectScreens.map((project) => project.path));

    expect(slugs.size).toBe(projectScreens.length);
    expect(paths.size).toBe(projectScreens.length);

    for (const project of projectScreens) {
      expect(project.path).toBe(`/apps/${project.slug}`);
      expect(project.name.length).toBeGreaterThan(2);
      expect(project.description.length).toBeGreaterThan(40);
      expect(project.capabilities.length).toBeGreaterThanOrEqual(3);
      expect(project.signals.length).toBeGreaterThanOrEqual(3);
      for (const signal of project.signals) {
        expect(signal.value.length).toBeGreaterThan(0);
        expect(signal.label.length).toBeGreaterThan(10);
      }
      expect(project.proofBoundary.length).toBeGreaterThan(30);
      expect(project.websiteUrl).toMatch(/^https:\/\//);
      expect(project.websiteLabel.length).toBeGreaterThan(4);
      expect(project.screenshot.src).toMatch(/^\/product-screens\/.+\.png$/);
      expect(project.screenshot.alt.length).toBeGreaterThan(25);
      expect(project.visible).toBe(true);
      expect(project.sourceRepository.label).toMatch(/^TOTALLYMAJOR\//);
      expect(project.sourceRepository.href).toMatch(/^https:\/\/github\.com\/TOTALLYMAJOR\//);
      expect(project.sourceRepository.href).not.toContain('/home/');
      expect(project.sourceRepository.href).not.toContain('/mnt/');
    }
  });

  it('resolves project subpages by slug', () => {
    expect(getProjectBySlug('quietpilot')?.name).toBe('QuietPilot');
    expect(getProjectBySlug('leaguepilot')?.websiteUrl).toBe('https://www.leaguepilot.us');
    expect(getProjectBySlug('quoteflow')?.category).toBe('Quote-to-event operations');
  });

  it('exposes evidence and access context for every app', () => {
    for (const project of projectScreens) {
      expect(project.status.length).toBeGreaterThan(8);
      expect(project.accessDescription.length).toBeGreaterThan(8);
      expect(project.screenshot.caption.length).toBeGreaterThan(30);
      expect(JSON.stringify(project).toLowerCase()).not.toContain('coming soon');
      expect(JSON.stringify(project).toLowerCase()).not.toContain('app three');
    }
  });
});
