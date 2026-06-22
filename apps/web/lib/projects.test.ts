import { describe, expect, it } from 'vitest';
import { getProjectBySlug, projectScreens } from '@/lib/projects';

describe('project catalog', () => {
  it('lists the MBMApps project subpages with unique slugs and paths', () => {
    expect(projectScreens.length).toBeGreaterThanOrEqual(5);

    const slugs = new Set(projectScreens.map((project) => project.slug));
    const paths = new Set(projectScreens.map((project) => project.path));

    expect(slugs.size).toBe(projectScreens.length);
    expect(paths.size).toBe(projectScreens.length);

    for (const project of projectScreens) {
      expect(project.path).toBe(`/apps/${project.slug}`);
      expect(project.name.length).toBeGreaterThan(2);
      expect(project.summary.length).toBeGreaterThan(40);
      expect(project.capabilities.length).toBeGreaterThanOrEqual(3);
      expect(project.proofPoints.length).toBeGreaterThanOrEqual(2);
      expect(project.sourceRepository.label).toMatch(/^TOTALLYMAJOR\//);
      expect(project.sourceRepository.href).toMatch(/^https:\/\/github\.com\/TOTALLYMAJOR\//);
      expect(project.sourceRepository.href).not.toContain('/home/');
      expect(project.sourceRepository.href).not.toContain('/mnt/');
    }
  });

  it('resolves project subpages by slug', () => {
    expect(getProjectBySlug('quietpilot')?.name).toBe('QuietPilot');
    expect(getProjectBySlug('champion-coach-os')?.path).toBe('/apps/champion-coach-os');
    expect(getProjectBySlug('little-league-hq')?.category).toBe('Youth sports');
  });
});
