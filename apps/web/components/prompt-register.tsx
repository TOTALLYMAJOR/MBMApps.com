'use client';

import { useMemo, useState } from 'react';
import { promptRecipeCategories, promptRecipes } from '@/lib/prompt-register';
import styles from './prompt-register.module.css';

export function PromptRegister() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(promptRecipes[0]?.id ?? 1);
  const [copied, setCopied] = useState(false);

  const visibleRecipes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return promptRecipes.filter((recipe) => {
      const matchesCategory = category === 'All' || recipe.category === category;
      const searchable = `${recipe.title} ${recipe.category} ${recipe.input} ${recipe.chain} ${recipe.output}`.toLowerCase();
      return matchesCategory && (!needle || searchable.includes(needle));
    });
  }, [category, query]);

  const selected = promptRecipes.find((recipe) => recipe.id === selectedId) ?? promptRecipes[0];

  async function copyPrompt() {
    if (!selected) return;
    await navigator.clipboard.writeText(selected.prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function exportRegister() {
    const blob = new Blob([JSON.stringify(promptRecipes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'mbmapps-ai-production-prompt-register.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!selected) return null;

  return (
    <div className={styles.register}>
      <section className={styles.hero} aria-labelledby="prompt-register-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>MBMApps utility / prompt register v1</p>
          <h1 id="prompt-register-title">Turn references into working things.</h1>
          <p>A field guide for moving from websites, screenshots, documents, and data to original interfaces, code, and implementation-ready design records.</p>
          <div className={styles.heroActions}>
            <a href="#recipe-register">[browse recipes]</a>
            <button type="button" onClick={exportRegister}>[export JSON]</button>
          </div>
        </div>
        <div className={styles.heroSignal} aria-label="Register summary">
          <span>input</span><i aria-hidden="true" /><span>workflow</span><i aria-hidden="true" /><span>artifact</span>
          <strong>{promptRecipes.length}</strong><small>production recipes</small>
        </div>
      </section>

      <section className={styles.workspace} id="recipe-register" aria-label="AI production prompt register">
        <aside className={styles.filters}>
          <label htmlFor="prompt-register-search">Find a workflow</label>
          <input
            id="prompt-register-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Aura, screenshot, code…"
          />
          <p className={styles.filterLabel}>Filter by transformation</p>
          <div className={styles.categories}>
            {promptRecipeCategories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                <span>{item}</span>
                <small>{item === 'All' ? promptRecipes.length : promptRecipes.filter((recipe) => recipe.category === item).length}</small>
              </button>
            ))}
          </div>
          <div className={styles.scopeNote}>
            <span>human checkpoint</span>
            <p>Confirm reference rights, privacy boundaries, and public claims before publishing.</p>
          </div>
        </aside>

        <div className={styles.recipePanel}>
          <header className={styles.panelHeader}>
            <div><span>register</span><strong>{visibleRecipes.length} recipes shown</strong></div>
            <p>{query ? `matching “${query}”` : category === 'All' ? 'all transformations' : category}</p>
          </header>
          <div className={styles.recipeList}>
            {visibleRecipes.length ? visibleRecipes.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                className={recipe.id === selected.id ? styles.selectedRecipe : styles.recipe}
                onClick={() => setSelectedId(recipe.id)}
              >
                <span className={styles.recipeNumber}>{String(recipe.id).padStart(3, '0')}</span>
                <span className={styles.recipeText}><strong>{recipe.title}</strong><small>{recipe.input} → {recipe.chain} → {recipe.output}</small></span>
                <span className={styles.recipeMark} aria-hidden="true">↗</span>
              </button>
            )) : (
              <div className={styles.emptyState}><strong>No recipe found.</strong><p>Try a tool name, input type, or output such as “design.md”.</p></div>
            )}
          </div>
        </div>

        <article className={styles.detail} aria-live="polite">
          <p className={styles.eyebrow}>Recipe {String(selected.id).padStart(3, '0')} / {selected.category}</p>
          <h2>{selected.title}</h2>
          <div className={styles.path}>
            <div><span>input</span><strong>{selected.input}</strong></div>
            <b aria-hidden="true">→</b>
            <div><span>chain</span><strong>{selected.chain}</strong></div>
            <b aria-hidden="true">→</b>
            <div><span>output</span><strong>{selected.output}</strong></div>
          </div>
          <div className={styles.promptBlock}>
            <div className={styles.promptHeader}><span>prompt contract</span><small>edit placeholders before running</small></div>
            <pre>{selected.prompt}</pre>
          </div>
          <div className={styles.detailActions}>
            <button type="button" onClick={copyPrompt}>{copied ? '[copied]' : '[copy prompt]'}</button>
            <button type="button" onClick={exportRegister}>[export register]</button>
          </div>
        </article>
      </section>
    </div>
  );
}
