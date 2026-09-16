import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';

type CatalogEntry = {
  id: string;
  category: string;
  name: string;
  desc: string;
  label: string;
  states: string[];
  kind: string;
  tags: string[];
  behavior: string;
};

type ComponentStudioCatalog = {
  categories: Array<{ id: string; name: string; icon: string }>;
  catalog: CatalogEntry[];
};

async function loadCatalog(): Promise<ComponentStudioCatalog> {
  let source = '';
  try {
    source = await readFile(new URL('../public/component-studio-catalog.js', import.meta.url), 'utf8');
  } catch {
    // A missing catalog is represented as an empty user-visible library so the
    // assertion fails on the product contract rather than filesystem setup.
  }

  const context: Record<string, unknown> = {};
  vm.runInNewContext(source, context);
  return (context.MBM_COMPONENT_STUDIO_CATALOG as ComponentStudioCatalog | undefined) ?? {
    categories: [],
    catalog: []
  };
}

describe('Component Studio catalog', () => {
  it('offers exactly 150 uniquely addressable components', async () => {
    const { catalog } = await loadCatalog();
    const ids = catalog.map((entry) => entry.id);

    expect(catalog).toHaveLength(150);
    expect(new Set(ids).size).toBe(150);
  });
});
