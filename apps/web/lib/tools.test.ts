import { describe, expect, it } from 'vitest';
import { toolCategories, tools } from '@/lib/tools';

describe('tool catalog', () => {
  it('keeps every browser tool and simulator under one local catalog', () => {
    expect(tools.map((tool) => tool.id)).toEqual([
      'component-studio',
      'prompt-register',
      'cognitive-strategy',
      'agentic-decision-lab',
      'cause-effect-lab'
    ]);
    expect(new Set(tools.map((tool) => tool.href)).size).toBe(tools.length);
    expect(toolCategories).toEqual(['Design', 'Production', 'Reasoning', 'Simulation']);
  });

  it('uses local destinations and descriptive preview assets', () => {
    for (const tool of tools) {
      expect(tool.href).toMatch(/^\//);
      expect(tool.preview).toMatch(/^\/tools\/.+\.png$/);
      expect(tool.previewAlt.length).toBeGreaterThan(25);
      expect(tool.description.length).toBeGreaterThan(45);
      expect(tool.accessDescription.length).toBeGreaterThan(8);
    }
  });
});
