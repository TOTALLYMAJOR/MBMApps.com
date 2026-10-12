import { ArrowUpRight } from 'lucide-react';
import { getProjectBySlug } from '@/lib/projects';
import styles from './live-product-site.module.css';

/** Render the current product itself; its origin owns its UI and authentication. */
export function LiveProductSite({ slug, id, label, standalone = false }: {
  slug: 'quoteflow' | 'leaguepilot';
  id: string;
  label: string;
  standalone?: boolean;
}) {
  const product = getProjectBySlug(slug);
  if (!product) return null;
  const Heading = standalone ? 'h1' : 'h2';

  return (
    <section id={id} className={styles.chapter} aria-labelledby={`${id}-title`}>
      <header className={styles.heading}>
        <Heading id={`${id}-title`}>{label}</Heading>
        <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer">
          Open full site <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </header>
      <iframe
        className={styles.site}
        src={product.websiteUrl}
        title={`${label} live website`}
        loading={standalone ? 'eager' : 'lazy'}
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
}
