import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Command, ShieldCheck } from 'lucide-react';
import { ConstraintStage } from './constraint-stage';
import { EvidenceStage } from './evidence-stage';
import { InterventionStage } from './intervention-stage';
import { ScopeStage } from './scope-stage';
import { StageFooter } from './shared';
import { VerificationStage } from './verification-stage';
import { defaultWorkbenchStage, workbenchStages } from './model';
import type { WaleExperienceController } from './use-wale-experience';
import styles from './workbench.module.css';

interface WorkbenchProps {
  reduceMotion: boolean;
  controller: Omit<WaleExperienceController, 'stageRefs' | 'scopeRefs' | 'findingRefs' | 'workbenchTitleRef' | 'entryButtonRef'>;
  stageRefs: WaleExperienceController['stageRefs'];
  scopeRefs: WaleExperienceController['scopeRefs'];
  findingRefs: WaleExperienceController['findingRefs'];
  workbenchTitleRef: WaleExperienceController['workbenchTitleRef'];
}

export function Workbench({ reduceMotion, controller, stageRefs, scopeRefs, findingRefs, workbenchTitleRef }: WorkbenchProps) {
  const activeStage = workbenchStages[controller.stageIndex] ?? defaultWorkbenchStage;

  return (
    <motion.section
      key="workbench"
      className={styles.workbenchPage}
      aria-labelledby="workbench-title"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.992 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.05 : 0.42, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => workbenchTitleRef.current?.focus()}
    >
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <span className={styles.missionNumber}>{activeStage.number}</span>
          <div>
            <p>Sample audit workbench · illustrative data</p>
            <h2 id="workbench-title" ref={workbenchTitleRef} tabIndex={-1}>{activeStage.command}</h2>
          </div>
        </div>

        <div className={styles.missionActions}>
          <span><i aria-hidden="true" /> Ready for operator review</span>
          <button type="button" onClick={controller.returnToIntro}>
            <ArrowLeft aria-hidden="true" /> Back to introduction
          </button>
        </div>
      </header>

      <div className={styles.workbenchShell}>
        <nav className={styles.stageRail} aria-label="Workbench stages">
          <div className={styles.stageRailBrand} aria-hidden="true">
            <Command />
            <span>WALE / MISSION CONTROL</span>
          </div>
          <div className={styles.stageButtons} role="tablist" aria-label="Mission-control stages">
            {workbenchStages.map((stage, index) => {
              const Icon = stage.icon;
              const active = stage.id === controller.stage;
              const prior = index < controller.stageIndex;
              return (
                <button
                  key={stage.id}
                  ref={(node) => { stageRefs.current[index] = node; }}
                  type="button"
                  id={`wale-stage-tab-${stage.id}`}
                  role="tab"
                  aria-selected={active}
                  aria-controls="wale-stage-panel"
                  className={active ? styles.stageActive : undefined}
                  data-prior={prior ? 'true' : 'false'}
                  onClick={() => controller.selectStage(index)}
                  onKeyDown={(event) => controller.handleStageKey(event, index)}
                  aria-current={active ? 'step' : undefined}
                  tabIndex={active ? 0 : -1}
                >
                  <span className={styles.stageIndex}>{stage.number}</span>
                  <Icon aria-hidden="true" />
                  <span className={styles.stageLabel}>
                    <strong>{stage.label}</strong>
                    <small>{stage.description}</small>
                  </span>
                  <ChevronRight aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <div className={styles.stageRailBoundary}>
            <ShieldCheck aria-hidden="true" />
            <p><strong>Operator authority</strong><span>Review before any change.</span></p>
          </div>
        </nav>

        <div
          className={styles.stageViewport}
          id="wale-stage-panel"
          role="tabpanel"
          aria-labelledby={`wale-stage-tab-${controller.stage}`}
        >
          <div className={styles.stageStatusBar}>
            <span>wale://sample-assessment/{controller.stage}</span>
            <ol aria-label="Progress">
              {workbenchStages.map((stage, index) => (
                <li key={stage.id} data-active={index === controller.stageIndex ? 'true' : 'false'} data-prior={index < controller.stageIndex ? 'true' : 'false'}>
                  <span className={styles.srOnly}>{stage.label}</span>
                </li>
              ))}
            </ol>
            <span>{controller.stageIndex + 1} / {workbenchStages.length}</span>
          </div>

          <div className={styles.stageBody}>
            {controller.stage === 'scope' ? (
              <ScopeStage
                activeScopeId={controller.activeScopeId}
                activeScopeIndex={controller.activeScopeIndex}
                scopeRefs={scopeRefs}
                onSelectScope={controller.selectScope}
                onScopeKey={controller.handleScopeKey}
              />
            ) : null}

            {controller.stage === 'evidence' ? (
              <EvidenceStage activeScopeId={controller.activeScopeId} onSelectScope={controller.selectScope} />
            ) : null}

            {controller.stage === 'constraint' ? (
              <ConstraintStage
                activeFindingId={controller.activeFindingId}
                activeFindingIndex={controller.activeFindingIndex}
                findingRefs={findingRefs}
                onSelectFinding={controller.selectFinding}
                onFindingKey={controller.handleFindingKey}
                onJumpToIntervention={() => controller.selectStage(3)}
              />
            ) : null}

            {controller.stage === 'intervention' ? (
              <InterventionStage
                activeFindingId={controller.activeFindingId}
                planStatuses={controller.planStatuses}
                onSetPlanStatus={controller.setPlanStatus}
              />
            ) : null}

            {controller.stage === 'verification' ? <VerificationStage activeFindingId={controller.activeFindingId} /> : null}
          </div>

          <StageFooter
            stage={activeStage}
            canGoBack={controller.stageIndex > 0}
            canGoForward={controller.stageIndex < workbenchStages.length - 1}
            onBack={controller.previousStage}
            onForward={controller.advanceStage}
          />
        </div>
      </div>
    </motion.section>
  );
}
