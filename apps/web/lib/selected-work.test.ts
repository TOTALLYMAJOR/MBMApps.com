import { describe, expect, it } from 'vitest';
import { selectedWorkProjects } from '@/lib/selected-work';

describe('selected work catalog', () => {
  it('keeps project identity and destinations unique', () => {
    expect(new Set(selectedWorkProjects.map((project) => project.name)).size).toBe(selectedWorkProjects.length);
    expect(new Set(selectedWorkProjects.map((project) => project.href)).size).toBe(selectedWorkProjects.length);
  });

  it('uses secure destinations and local screenshots', () => {
    for (const project of selectedWorkProjects) {
      expect(project.href).toMatch(/^https:\/\//);
      expect(project.image).toMatch(/^\/product-screens\//);
      expect(project.alt.length).toBeGreaterThan(20);
    }
  });
});
