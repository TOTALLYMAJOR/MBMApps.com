const linkedinPostUrl = 'https://www.linkedin.com/embed/feed/update/urn:li:activity:7506067731268554754';

export function LinkedInPostEmbed() {
  return (
    <section className="terminal-shell terminal-section terminal-linkedin-proof" aria-labelledby="linkedin-proof-title">
      <div className="terminal-section__head">
        <div>
          <h2 id="linkedin-proof-title"><span>*</span> from the field</h2>
          <p><span>$</span> open --linkedin-post</p>
        </div>
        <p>public signal · MBMApps</p>
      </div>
      <div className="terminal-linkedin-proof__card">
        <p className="terminal-linkedin-proof__author">Michael M. · Owner &amp; Product Systems Architect @ MBMApps</p>
        <blockquote>
          Some tools are meant to be shared because it won&apos;t be long before your friends cease with “can I borrow some of your tokens?” Token withdraw is here folks.
        </blockquote>
        <p className="terminal-linkedin-proof__note">Read the full post, links, comments, and media on LinkedIn.</p>
        <a className="terminal-linkedin-proof__cta" href={linkedinPostUrl} target="_blank" rel="noopener noreferrer">
          Open post on LinkedIn ↗
        </a>
      </div>
      <details className="terminal-linkedin-proof__live">
        <summary>Try live LinkedIn embed</summary>
        <iframe
          src={linkedinPostUrl}
          height="880"
          width="504"
          frameBorder="0"
          allowFullScreen
          title="MBMApps LinkedIn post"
        />
      </details>
    </section>
  );
}
