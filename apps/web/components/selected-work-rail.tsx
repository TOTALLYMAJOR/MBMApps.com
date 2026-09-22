'use client';

import Image from 'next/image';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { selectedWorkProjects } from '@/lib/selected-work';

export function SelectedWorkRail() {
  const [activeSlide, setActiveSlide] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animationFrame = 0;
    const updateParallax = () => {
      animationFrame = 0;
      railRef.current?.querySelectorAll<HTMLElement>('.terminal-commerce__media[data-parallax]').forEach((item) => {
        const rect = item.getBoundingClientRect();
        const offset = Math.max(-12, Math.min(12, (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.025));
        item.style.setProperty('--commerce-drift', `${offset}px`);
      });
    };
    const onWindowScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onWindowScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => () => {
    if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current);
  }, []);

  function scroll(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    const slides = Array.from(rail.querySelectorAll<HTMLElement>('.terminal-commerce__project'));
    const nextIndex = Math.max(0, Math.min(slides.length - 1, activeSlide + direction));
    slides[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    setActiveSlide(nextIndex);
  }

  function syncSlide() {
    if (scrollFrameRef.current) return;
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = 0;
      const rail = railRef.current;
      if (!rail) return;
      const railLeft = rail.getBoundingClientRect().left;
      const slides = Array.from(rail.querySelectorAll<HTMLElement>('.terminal-commerce__project'));
      if (slides.length === 0) return;
      const nextIndex = slides.reduce((closest, slide, index) => {
        const closestSlide = slides[closest];
        if (!closestSlide) return index;
        return Math.abs(slide.getBoundingClientRect().left - railLeft) < Math.abs(closestSlide.getBoundingClientRect().left - railLeft)
          ? index
          : closest;
      }, 0);
      setActiveSlide(nextIndex);
    });
  }

  return (
    <section id="commerce" className="terminal-section terminal-shell terminal-commerce" aria-labelledby="commerce-title" data-reveal>
      <div className="terminal-commerce__heading">
        <div>
          <p className="terminal-command"><span>04</span> / selected work</p>
          <h2 id="commerce-title"><span>*</span> selected work</h2>
          <p>Real products and client work, shown through their actual interfaces.</p>
        </div>
        <div className="terminal-commerce__toolbar">
          <p className="terminal-commerce__command">$ ls --commerce --client-sites</p>
          <div className="terminal-commerce__controls" aria-label="Client work slide controls">
            <span aria-live="polite">0{activeSlide + 1} / 0{selectedWorkProjects.length}</span>
            <button type="button" onClick={() => scroll(-1)} disabled={activeSlide === 0} aria-label="Show previous client project">
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scroll(1)} disabled={activeSlide === selectedWorkProjects.length - 1} aria-label="Show next client project">
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div ref={railRef} className="terminal-commerce__gallery" onScroll={syncSlide} role="region" aria-roledescription="carousel" aria-label="Selected ecommerce and client work" tabIndex={0}>
        {selectedWorkProjects.map((project, index) => (
            <article key={project.name} className="terminal-commerce__project" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${selectedWorkProjects.length}: ${project.name}`}>
              <div className="terminal-commerce__preview-shell">
                <a href={project.href} target="_blank" rel="noreferrer" className="terminal-commerce__media" data-parallax aria-label={`Visit ${project.name} website`}>
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(min-width: 900px) 720px, calc(100vw - 42px)"
                    quality={90}
                  />
                  <span className="terminal-commerce__media-label">Live project <ArrowUpRight aria-hidden="true" /></span>
                </a>
              </div>
              <div className="terminal-commerce__copy">
                <span className="terminal-commerce__index">0{index + 1}</span>
                <div>
                  <h3>{project.name}</h3>
                  <p className="terminal-commerce__type">{project.type}</p>
                  <p>{project.description}</p>
                  <a href={project.href} target="_blank" rel="noreferrer">[{project.visitLabel}] <ArrowUpRight aria-hidden="true" /></a>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
