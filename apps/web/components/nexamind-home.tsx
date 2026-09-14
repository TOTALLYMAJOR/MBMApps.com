import Link from 'next/link';
import { ArrowRight, FlaskConical } from 'lucide-react';
import styles from './nexamind-home.module.css';

export function NexamindHome() {
  return (
    <div className={styles.shell}>
      <div className={styles.contextBar}>
        <p><FlaskConical aria-hidden="true" /> Interactive system demo</p>
        <Link href="/apps">Browse MBMApps applications <ArrowRight aria-hidden="true" /></Link>
      </div>
      <iframe
        className={styles.frame}
        src="/nexamind-agentic-demo/index.html"
        title="NexaMind Agentic Decision Lab interactive demo"
        loading="eager"
        sandbox="allow-scripts allow-top-navigation-by-user-activation"
      />
    </div>
  );
}
