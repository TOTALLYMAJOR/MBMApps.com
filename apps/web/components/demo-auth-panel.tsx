'use client';

import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, signOut, type User } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/client';
import { trackEvent } from '@/lib/telemetry';

type DemoAuthPanelProps = {
  onRoleChange: (role: 'guest' | 'viewer' | 'demo' | 'admin') => void;
};

function resolveRole(user: User | null, claimRole: unknown): 'guest' | 'viewer' | 'demo' | 'admin' {
  if (user === null) {
    return 'guest';
  }

  if (claimRole === 'admin' || claimRole === 'demo') {
    return claimRole;
  }

  return 'viewer';
}

export function DemoAuthPanel({ onRoleChange }: DemoAuthPanelProps) {
  const auth = useMemo(() => getFirebaseAuth(), []);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'guest' | 'viewer' | 'demo' | 'admin'>('guest');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (auth === null) {
      onRoleChange('viewer');
      setRole('viewer');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser === null) {
        setRole('guest');
        onRoleChange('guest');
        return;
      }

      const token = await nextUser.getIdTokenResult();
      const nextRole = resolveRole(nextUser, token.claims.role);
      setRole(nextRole);
      onRoleChange(nextRole);
    });

    return () => unsubscribe();
  }, [auth, onRoleChange]);

  async function handleSignIn() {
    if (auth === null) {
      return;
    }

    setPending(true);
    try {
      const credential = await signInAnonymously(auth);
      await trackEvent('demo_login', '/demo', { provider: 'firebase-anonymous' }, credential.user.uid);
    } finally {
      setPending(false);
    }
  }

  async function handleSignOut() {
    if (auth === null) {
      return;
    }

    await signOut(auth);
  }

  if (auth === null) {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-300/10 p-4 text-sm text-amber-100">
        Firebase is not configured. Demo is in read-only fallback mode.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-white/85 shadow-soft">
      <p className="text-xs uppercase tracking-[0.2em] text-mist">Access Control</p>
      <p className="mt-2 font-mono text-xs text-white/80">Role: {role}</p>
      <p className="mt-1 font-mono text-xs text-white/60">
        {user?.uid ? `${user.uid.slice(0, 8)}...${user.uid.slice(-6)}` : 'No active session'}
      </p>
      <p className="mt-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs text-mist">
        Anonymous auth is used for demo access. Custom claims determine visibility depth.
      </p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSignIn}
          disabled={pending || user !== null}
          className="rounded-lg bg-electric px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Signing in...' : 'Sign in to demo'}
        </button>
        <button
          onClick={handleSignOut}
          disabled={user === null}
          className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:border-white/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
