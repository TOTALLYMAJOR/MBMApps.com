'use client';

import { useEffect, useState } from 'react';

const LOADER_MS = 900;

export function StartupLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, LOADER_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-canvas/92 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <span className="absolute inset-0 rounded-full border-2 border-white/10" />
          <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-electric border-r-signal animate-spin" />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-mist">Loading MBMApps</p>
      </div>
    </div>
  );
}
