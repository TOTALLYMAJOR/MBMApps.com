import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getProjectBySlug, masterScProduct, sportPilotPreview } from '@/lib/projects';
import styles from './live-product-site.module.css';

/** Render the current product itself; its origin owns its UI and authentication. */
export function LiveProductSite({ slug, id, label, standalone = false }: {
  slug: 'quoteflow' | 'quietpilot' | 'leaguepilot' | 'sportpilot' | 'master-sc';
  id: string;
  label: string;
  standalone?: boolean;
}) {
  const isMasterSc = slug === 'master-sc';
  const product = isMasterSc ? masterScProduct : slug === sportPilotPreview.slug ? sportPilotPreview : getProjectBySlug(slug);
  if (!product) return null;
  const Heading = standalone ? 'h1' : 'h2';
  const destination = isMasterSc ? masterScProduct.experienceHref : product.websiteUrl;

  if (slug === 'quietpilot' && 'capabilities' in product) {
    return (
      <section
        id={id}
        className={`${styles.chapter} ${styles.quietChapter}`}
        aria-labelledby={`${id}-title`}
        data-cinematic-section
        data-product-chapter={slug}
      >
        <header className={styles.heading} data-cinematic-heading>
          <Heading id={`${id}-title`}>{label}</Heading>
          <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer">
            Open full site <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </header>
        <div className={styles.quietCapabilities}>
          <dl aria-label="QuietPilot capabilities">
            {product.capabilities.map((capability) => (
              <div key={capability.label}>
                <dt>{capability.label}</dt>
                <dd>{capability.description}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.previewNote}>{product.proofBoundary}</p>
        </div>
        <figure className={styles.quietStory} data-quietpilot-story data-cinematic-visual>
          <div className={styles.quietImage} data-quietpilot-image>
            <Image
              src="/product-screens/quietpilot-story.png"
              alt="A fragmented catering plan converging through a central control point into an organized, staffed event service."
              // The optimizer does not forward the session required by this protected asset.
              unoptimized
              fill
              priority={standalone}
              sizes="100vw"
            />
          </div>
          <div className={styles.quietVignette} aria-hidden="true" />
          <div className={styles.quietFlow} aria-hidden="true">
            <span className={styles.quietSweep} data-quietpilot-sweep />
            <span className={`${styles.quietSignal} ${styles.quietSignalOne}`} data-quietpilot-signal />
            <span className={`${styles.quietSignal} ${styles.quietSignalTwo}`} data-quietpilot-signal />
            <span className={`${styles.quietSignal} ${styles.quietSignalThree}`} data-quietpilot-signal />
          </div>
        </figure>
      </section>
    );
  }

  return (
    <section id={id} className={styles.chapter} aria-labelledby={`${id}-title`} data-cinematic-section data-product-chapter={slug}>
      <header className={styles.heading} data-cinematic-heading>
        <div>
          <Heading id={`${id}-title`}>{label}</Heading>
          {!standalone && <p className={styles.previewNote}>{isMasterSc && 'Sample interface state · '}Preview — open the full site to interact.</p>}
        </div>
        <a href={destination} target={isMasterSc ? undefined : '_blank'} rel={isMasterSc ? undefined : 'noopener noreferrer'}>
          {isMasterSc ? masterScProduct.websiteLabel : 'Open full site'} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </header>
      <iframe
        className={styles.site}
        data-cinematic-visual
        data-scroll-preview={!standalone || undefined}
        inert={!standalone}
        tabIndex={standalone ? undefined : -1}
        aria-hidden={!standalone || undefined}
        src={destination}
        title={`${label} ${isMasterSc ? 'sample showcase' : 'live website'}`}
        loading={standalone ? 'eager' : 'lazy'}
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
}
