'use client';

import { useEffect, useState, type CSSProperties } from 'react';

type Firefly = {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  maxOpacity: number;
};

function generateFireflies(count: number): Firefly[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 2 + Math.random() * 2.5,
    duration: 5 + Math.random() * 7,
    delay: Math.random() * 9,
    maxOpacity: 0.35 + Math.random() * 0.45
  }));
}

export function FireflyField() {
  const [fireflies, setFireflies] = useState<Firefly[] | null>(null);

  useEffect(() => {
    setFireflies(generateFireflies(24));
  }, []);

  if (!fireflies) {
    return null;
  }

  return (
    <div className="firefly-field" aria-hidden="true">
      {fireflies.map((fly) => (
        <span
          key={fly.id}
          className="firefly-dot"
          style={
            {
              top: `${fly.top}%`,
              left: `${fly.left}%`,
              width: `${fly.size}px`,
              height: `${fly.size}px`,
              animationDuration: `${fly.duration}s`,
              animationDelay: `${fly.delay}s`,
              '--firefly-max-opacity': fly.maxOpacity
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
