'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function NorthstarMotion() {
  const pathname = usePathname();

  useEffect(() => {
    let cleanups: Array<() => void> = [];

    const setupTimer = window.setTimeout(() => {
      const spotlightCards = Array.from(document.querySelectorAll<HTMLElement>('.northstar-card, .storefront-card'));

      cleanups = spotlightCards.map((card) => {
        const onPointerMove = (event: PointerEvent) => {
          const bounds = card.getBoundingClientRect();
          card.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
          card.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
        };
        card.addEventListener('pointermove', onPointerMove, { passive: true });
        return () => card.removeEventListener('pointermove', onPointerMove);
      });
    }, 120);

    return () => {
      window.clearTimeout(setupTimer);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  return null;
}
