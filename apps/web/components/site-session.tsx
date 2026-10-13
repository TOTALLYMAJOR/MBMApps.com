'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteAccessRole } from '@mbm/contracts';

const SiteSessionContext = createContext<{ role: SiteAccessRole | null }>({ role: null });

export function SiteSessionProvider({ role, children }: { role: SiteAccessRole | null; children: ReactNode }) {
  return <SiteSessionContext.Provider value={{ role }}>{children}</SiteSessionContext.Provider>;
}

export function useSiteSession() {
  return useContext(SiteSessionContext);
}

export function SiteSessionExit({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function exit() {
    if (busy) return;
    setBusy(true);

    try {
      const [{ getFirebaseAuth }, { signOut }] = await Promise.all([
        import('@/lib/firebase/client'),
        import('firebase/auth')
      ]);
      const auth = getFirebaseAuth();
      await Promise.allSettled([
        fetch('/api/site-gate', { method: 'DELETE' }),
        auth ? signOut(auth) : Promise.resolve()
      ]);
    } finally {
      router.replace('/gate');
      router.refresh();
    }
  }

  return (
    <button type="button" className={className} onClick={exit} disabled={busy}>
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
