import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { resolveDiscordCommunityConfig } from '@/lib/discord-community';
import { DiscordCommunityWidget } from './discord-community-widget';
import styles from './discuss.module.css';

export const metadata: Metadata = {
  title: 'Discuss AI Systems',
  description: 'Join the MBMApps Discord for focused discussion about building, evaluating, and shipping AI systems.',
  alternates: { canonical: '/discuss' }
};

const discussionTopics = [
  ['01', 'Reliable agents', 'Patterns for tools, context, authority, and graceful failure.'],
  ['02', 'Evaluation and evidence', 'What counts as proof before a system earns trust.'],
  ['03', 'Local-first workflows', 'Practical setups for building with AI without surrendering control.'],
  ['04', 'Shipping reality', 'The gaps between a convincing demo and a dependable product.']
];

export default function DiscussPage() {
  const discord = resolveDiscordCommunityConfig();

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="discuss-title">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroInner}>
          <p className={styles.command}><span>~/mbmapps</span> $ join --discussion</p>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Community / Discord</p>
            <h1 id="discuss-title">Discuss the work.<br /><span>Not just the hype.</span></h1>
            <p className={styles.lede}>
              A focused room for people building AI systems—agents, evaluation, tools, and what breaks between demo and deployment.
            </p>
            <div className={styles.heroActions}>
              {discord.configured ? (
                <a className={styles.primaryButton} href={discord.inviteUrl} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" /> Join on Discord <ArrowUpRight aria-hidden="true" />
                </a>
              ) : (
                <span className={styles.pendingBadge}><i aria-hidden="true" /> Connection pending</span>
              )}
              <Link className={styles.textLink} href="/"><ArrowLeft aria-hidden="true" /> Back to MBMApps</Link>
            </div>
          </div>
          <div className={styles.truthStrip} aria-label="Community operating model">
            <p><strong>Identity</strong><span>Discord account</span></p>
            <p><strong>Conversation</strong><span>Hosted by Discord</span></p>
            <p><strong>MBMApps role</strong><span>Doorway + context</span></p>
          </div>
        </div>
      </section>

      <section className={styles.communitySection} aria-label="Discord community access">
        <div className={styles.communityGrid}>
          <div className={styles.widgetPanel}>
            {discord.configured ? (
              <DiscordCommunityWidget inviteUrl={discord.inviteUrl} widgetUrl={discord.widgetUrl} />
            ) : (
              <div className={styles.unavailableState} role="status">
                <div className={styles.widgetGlyph} aria-hidden="true">#</div>
                <p className={styles.eyebrow}>Community connection</p>
                <h2>The room is being prepared.</h2>
                <p>
                  The discussion route is ready, but no Discord server is connected yet. No member presence or server data is being shown.
                </p>
                <Link className={styles.textLink} href="/contact">Ask about the community <ArrowUpRight aria-hidden="true" /></Link>
              </div>
            )}
          </div>

          <aside className={styles.briefing} aria-labelledby="briefing-title">
            <div className={styles.briefingHead}>
              <p className={styles.eyebrow}>Room brief</p>
              <h2 id="briefing-title">What belongs here</h2>
              <ShieldCheck aria-hidden="true" />
            </div>
            <div className={styles.topicList}>
              {discussionTopics.map(([index, title, description]) => (
                <article key={index}>
                  <span>{index}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className={styles.boundaryNote}>
              <strong>The boundary</strong>
              <p>MBMApps introduces the room. Discord owns membership, identity, conversation history, and moderation controls.</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
