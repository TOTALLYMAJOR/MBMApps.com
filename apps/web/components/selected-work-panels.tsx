import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { selectedWorkProjects } from '@/lib/selected-work';
import styles from './selected-work-panels.module.css';
import littleLegendImage from '../public/product-screens/little-legend-studios.png';
import wakeForWarriorsImage from '../public/product-screens/wake-for-warriors.png';
import jourEtNuitImage from '../public/product-screens/jour-et-nuit.png';
import arenaAdvisorImage from '../public/product-screens/arena-advisor.png';

const featuredPortfolioWork = selectedWorkProjects.slice(0, 4);
const featuredPortfolioImages = [
  littleLegendImage,
  wakeForWarriorsImage,
  jourEtNuitImage,
  arenaAdvisorImage,
] as const;

export function SelectedWorkPanels() {
  return (
    <ol className={styles.panels} aria-label="Featured portfolio">
      {featuredPortfolioWork.map((project, index) => (
        <li key={project.name}>
          <a
            href={project.href}
            data-portfolio-work={project.name}
            target="_blank"
            rel="noreferrer"
          >
            <header>
              <span>0{index + 1}</span>
              <small>{project.type}</small>
            </header>
            <div className={styles.image}>
              <Image
                src={featuredPortfolioImages[index] ?? littleLegendImage}
                alt={project.alt}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 28vw"
              />
            </div>
            <div className={styles.body}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
            <span className={styles.link}>
              {project.visitLabel}<ArrowUpRight aria-hidden="true" />
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
