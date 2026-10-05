import { ArrowRight, CheckCircle2, CircleHelp, Eye, LockKeyhole, ScanLine } from 'lucide-react';
import { auditScopes, defaultAuditScope, systemSummary } from './model';
import { AuthorityCallout, EvidenceStateBadge, UnknownCallout } from './shared';
import type { AuditScopeId } from './types';
import styles from './workbench.module.css';

interface ScopeStageProps {
  activeScopeId: AuditScopeId;
  activeScopeIndex: number;
  scopeRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>;
  onSelectScope: (index: number, focus?: boolean) => void;
  onScopeKey: (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
}

export function ScopeStage({ activeScopeId, activeScopeIndex, scopeRefs, onSelectScope, onScopeKey }: ScopeStageProps) {
  const activeScope = auditScopes[activeScopeIndex] ?? defaultAuditScope;
  const ScopeIcon = activeScope.icon;

  return (
    <div className={styles.stageLayout} data-stage="scope">
      <aside className={styles.scopeRail} aria-label="Audit scope checklist">
        <div className={styles.panelLabel}>
          <span>Audit scope</span>
          <small>{systemSummary.scopes} categories</small>
        </div>
        <div className={styles.scopeButtons} role="tablist" aria-label="Audit scope categories">
          {auditScopes.map((scope, index) => {
            const Icon = scope.icon;
            const active = scope.id === activeScopeId;
            return (
              <button
                key={scope.id}
                ref={(node) => { scopeRefs.current[index] = node; }}
                type="button"
                id={`wale-scope-tab-${scope.id}`}
                role="tab"
                aria-selected={active}
                aria-controls="wale-scope-panel"
                className={active ? styles.scopeActive : undefined}
                onClick={() => onSelectScope(index)}
                onKeyDown={(event) => onScopeKey(event, index)}
                aria-current={active ? 'step' : undefined}
                tabIndex={active ? 0 : -1}
              >
                <span className={styles.scopeNumber}>{scope.number}</span>
                <Icon aria-hidden="true" />
                <span className={styles.scopeButtonCopy}>
                  <strong>{scope.shortLabel}</strong>
                  <small>{scope.count}</small>
                </span>
                <ArrowRight className={styles.scopeArrow} aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <p className={styles.keyboardHint}>Use arrow keys to move through scope categories.</p>
      </aside>

      <section
        className={styles.stageContent}
        id="wale-scope-panel"
        role="tabpanel"
        aria-labelledby={`wale-scope-tab-${activeScope.id}`}
      >
        <p className={styles.srOnly} aria-live="polite">Selected audit scope: {activeScope.label}.</p>
        <div className={styles.contentTopline}>
          <span>wale://sample/scope/{activeScope.id}</span>
          <EvidenceStateBadge state={activeScope.state} />
        </div>

        <div className={styles.contentScroll}>
          <header className={styles.contentHeader}>
            <span className={styles.largeIcon} aria-hidden="true"><ScopeIcon /></span>
            <div>
              <p>Selected scope · {activeScope.number} of 06</p>
              <h3>{activeScope.label}</h3>
            </div>
          </header>

          <p className={styles.contentDescription}>{activeScope.purpose}</p>

          <div className={styles.scopeSummaryGrid}>
            <article>
              <span><Eye aria-hidden="true" /> Observed condition</span>
              <p>{activeScope.observed}</p>
            </article>
            <article>
              <span><ScanLine aria-hidden="true" /> Recommended focus</span>
              <p>{activeScope.recommendation}</p>
            </article>
          </div>

          <section className={styles.questionSection} aria-labelledby="scope-questions-title">
            <div className={styles.sectionHeading}>
              <div>
                <p>Control questions</p>
                <h4 id="scope-questions-title">What Wale checks before diagnosis</h4>
              </div>
              <span>{activeScope.questions.length} checks</span>
            </div>
            <div className={styles.questionList}>
              {activeScope.questions.map((question) => (
                <article key={question.id}>
                  <span className={styles.questionIcon} aria-hidden="true">
                    {question.state === 'UNKNOWN' ? <CircleHelp /> : <CheckCircle2 />}
                  </span>
                  <div>
                    <h5>{question.prompt}</h5>
                    <p>{question.answer}</p>
                    <small>{question.source}</small>
                  </div>
                  <EvidenceStateBadge state={question.state} />
                </article>
              ))}
            </div>
          </section>

          <div className={styles.scopeCallouts}>
            <AuthorityCallout>{activeScope.authority}</AuthorityCallout>
            <UnknownCallout>{activeScope.unknown}</UnknownCallout>
          </div>

          <div className={styles.scopeBoundary}>
            <LockKeyhole aria-hidden="true" />
            <div><span>Inspection boundary</span><p>{activeScope.boundary}</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
