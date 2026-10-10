'use client';

import { useState } from 'react';
import { ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import styles from './discuss.module.css';

type DiscordCommunityWidgetProps = {
  inviteUrl: string;
  widgetUrl: string;
};

export function DiscordCommunityWidget({ inviteUrl, widgetUrl }: DiscordCommunityWidgetProps) {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <div className={styles.widgetConsent}>
        <div className={styles.widgetGlyph} aria-hidden="true">#</div>
        <p className={styles.eyebrow}>Third-party content</p>
        <h2>See who is in the room.</h2>
        <p>
          The live server preview is provided by Discord. Loading it connects your browser to Discord and may share network and device information with them.
        </p>
        <div className={styles.widgetActions}>
          <button type="button" className={styles.primaryButton} onClick={() => setLoaded(true)}>
            <Eye aria-hidden="true" /> Load Discord preview
          </button>
          <a className={styles.textLink} href={inviteUrl} target="_blank" rel="noreferrer">
            Open Discord directly <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widgetLoaded}>
      <div className={styles.widgetToolbar}>
        <span><i aria-hidden="true" /> Live Discord preview</span>
        <button type="button" onClick={() => setLoaded(false)}>
          <EyeOff aria-hidden="true" /> Unload
        </button>
      </div>
      <iframe
        className={styles.widgetFrame}
        src={widgetUrl}
        title="MBMApps Discord community preview"
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      />
    </div>
  );
}
