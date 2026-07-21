'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { projectScreens } from '@/lib/projects';

type RouterSelection = 'quietpilot' | 'leaguepilot' | 'quoteflow' | 'studio';

const choices: { id: RouterSelection; label: string }[] = [
  { id: 'quietpilot', label: 'Catering sales, events, and operational readiness' },
  { id: 'leaguepilot', label: 'Youth league, team, coach, and parent coordination' },
  { id: 'quoteflow', label: 'Guided quoting, proposals, and event handoff' },
  { id: 'studio', label: 'A specialized workflow that needs custom software' }
];

export function ProductRouter() {
  const [selection, setSelection] = useState<RouterSelection>('quietpilot');

  useEffect(() => {
    const candidate = new URLSearchParams(window.location.search).get('path') as RouterSelection | null;
    if (candidate && choices.some((choice) => choice.id === candidate)) setSelection(candidate);
  }, []);

  const selectedProduct = useMemo(
    () => projectScreens.find((product) => product.slug === selection),
    [selection]
  );

  function choose(id: RouterSelection) {
    setSelection(id);
    const url = new URL(window.location.href);
    url.searchParams.set('path', id);
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <section className="portfolio-section portfolio-router" aria-labelledby="product-router-title">
      <div className="northstar-container portfolio-router__layout">
        <div>
          <p className="portfolio-eyebrow">Find your path</p>
          <h2 id="product-router-title">What are you trying to run more clearly?</h2>
          <div className="portfolio-router__choices" role="group" aria-label="Choose an operating environment">
            {choices.map((choice, index) => (
              <button
                key={choice.id}
                type="button"
                className={selection === choice.id ? 'is-selected' : ''}
                aria-pressed={selection === choice.id}
                onClick={() => choose(choice.id)}
              >
                <span>0{index + 1}</span>
                {choice.label}
                <ArrowRight aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className={`portfolio-router__result portfolio-accent--${selectedProduct?.accentToken ?? 'violet'}`} aria-live="polite">
          {selectedProduct ? (
            <>
              <p className="portfolio-eyebrow">Recommended application</p>
              <span className="portfolio-router__monogram">{selectedProduct.shortName}</span>
              <h3>{selectedProduct.name}</h3>
              <p>{selectedProduct.description}</p>
              <ul>
                {selectedProduct.capabilities.slice(0, 3).map((capability) => <li key={capability.label}>{capability.label}</li>)}
              </ul>
              <a href={selectedProduct.websiteUrl} data-product={selectedProduct.analyticsId}>
                {selectedProduct.websiteLabel} <ArrowUpRight aria-hidden="true" />
              </a>
            </>
          ) : (
            <>
              <p className="portfolio-eyebrow">Recommended path</p>
              <span className="portfolio-router__monogram">MBM</span>
              <h3>MBMApps Studio</h3>
              <p>Bring the workflow, constraint, and current operating context. We’ll determine whether a focused custom system is the responsible next step.</p>
              <ul>
                <li>Workflow modeling</li>
                <li>Product architecture</li>
                <li>Production-readiness planning</li>
              </ul>
              <Link href="/contact">Start a conversation <ArrowRight aria-hidden="true" /></Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
