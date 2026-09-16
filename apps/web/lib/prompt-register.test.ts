import { describe, expect, it } from 'vitest';
import { promptRecipeCategories, promptRecipes } from './prompt-register';

describe('AI Production Prompt Register', () => {
  it('offers exactly 100 uniquely addressable recipes across ten workflow families', () => {
    expect(promptRecipes).toHaveLength(100);
    expect(new Set(promptRecipes.map((recipe) => recipe.id)).size).toBe(100);
    expect(promptRecipeCategories).toHaveLength(11);
  });

  it('keeps every recipe executable and explicit about output', () => {
    for (const recipe of promptRecipes) {
      expect(recipe.prompt).toContain('INPUT');
      expect(recipe.prompt).toContain('OUTPUT');
      expect(recipe.prompt).toContain('design.md');
      expect(recipe.output.length).toBeGreaterThan(2);
    }
  });
});
