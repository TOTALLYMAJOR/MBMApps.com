import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Network } from 'lucide-react';
import styles from './control-plane.module.css';

export const metadata: Metadata = {
  title: 'Development Control Plane',
  description: 'Interactive MBMApps simulation of how multi-repository changes can be scoped, routed, and validated without overriding repository-specific authority.',
  alternates: { canonical: '/control-plane' }
};

export default function ControlPlanePage() {
  return (
    <div className={styles.shell}>
      <div className={styles.contextBar}>
        <p><Network aria-hidden="true" /> Interactive development workflow simulation</p>
        <Link href="/apps">Browse MBMApps applications <ArrowRight aria-hidden="true" /></Link>
      </div>
      <iframe
        className={styles.frame}
        src="/development-control-plane/index.html"
        title="MBMApps Development Control Plane interactive simulator"
        loading="eager"
        sandbox="allow-scripts allow-top-navigation-by-user-activation"
      />
    </div>
  );
}
