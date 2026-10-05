'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  auditScopes,
  defaultAuditScope,
  defaultFinding,
  defaultWorkbenchStage,
  findings,
  planItems,
  workbenchStages
} from './model';
import type {
  AuditScopeId,
  ExperiencePanel,
  PlanStatus,
  WorkbenchStageId
} from './types';

const entryKeys = new Set(['ArrowDown', 'PageDown']);
const forwardKeys = new Set(['ArrowDown', 'ArrowRight']);
const backwardKeys = new Set(['ArrowUp', 'ArrowLeft']);

export interface WaleExperienceController {
  panel: ExperiencePanel;
  breachActive: boolean;
  stage: WorkbenchStageId;
  stageIndex: number;
  activeScopeId: AuditScopeId;
  activeScopeIndex: number;
  activeFindingId: string;
  activeFindingIndex: number;
  planStatuses: Readonly<Record<string, PlanStatus>>;
  stageRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>;
  scopeRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>;
  findingRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>;
  workbenchTitleRef: React.RefObject<HTMLHeadingElement | null>;
  entryButtonRef: React.RefObject<HTMLButtonElement | null>;
  enterWorkbench: () => void;
  returnToIntro: () => void;
  selectStage: (index: number, focus?: boolean) => void;
  selectScope: (index: number, focus?: boolean) => void;
  selectFinding: (index: number, focus?: boolean) => void;
  handleStageKey: (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
  handleScopeKey: (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
  handleFindingKey: (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
  setPlanStatus: (id: string, status: PlanStatus) => void;
  advanceStage: () => void;
  previousStage: () => void;
}

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

function createPlanStatusMap() {
  return planItems.reduce<Record<string, PlanStatus>>((statuses, item) => {
    statuses[item.id] = item.status;
    return statuses;
  }, {});
}

export function useWaleExperience(reduceMotion: boolean): WaleExperienceController {
  const [panel, setPanel] = useState<ExperiencePanel>('intro');
  const [breachActive, setBreachActive] = useState(false);
  const [stage, setStage] = useState<WorkbenchStageId>('scope');
  const [activeScopeId, setActiveScopeId] = useState<AuditScopeId>('mcps');
  const [activeFindingId, setActiveFindingId] = useState(defaultFinding.id);
  const [planStatuses, setPlanStatuses] = useState<Readonly<Record<string, PlanStatus>>>(createPlanStatusMap);
  const stageRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const scopeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const findingRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const workbenchTitleRef = useRef<HTMLHeadingElement>(null);
  const entryButtonRef = useRef<HTMLButtonElement>(null);

  const stageIndex = useMemo(
    () => Math.max(0, workbenchStages.findIndex((candidate) => candidate.id === stage)),
    [stage]
  );

  const activeScopeIndex = useMemo(
    () => Math.max(0, auditScopes.findIndex((scope) => scope.id === activeScopeId)),
    [activeScopeId]
  );

  const activeFindingIndex = useMemo(
    () => Math.max(0, findings.findIndex((finding) => finding.id === activeFindingId)),
    [activeFindingId]
  );

  const enterWorkbench = useCallback(() => {
    if (panel !== 'intro' || breachActive) return;
    setBreachActive(true);
  }, [breachActive, panel]);

  useEffect(() => {
    if (!breachActive) return;
    const timer = window.setTimeout(
      () => setPanel('workbench'),
      reduceMotion ? 180 : 2820
    );
    return () => window.clearTimeout(timer);
  }, [breachActive, reduceMotion]);

  useEffect(() => {
    const handleEntryKey = (event: KeyboardEvent) => {
      if (panel !== 'intro' || !entryKeys.has(event.key)) return;
      event.preventDefault();
      enterWorkbench();
    };

    window.addEventListener('keydown', handleEntryKey);
    return () => window.removeEventListener('keydown', handleEntryKey);
  }, [enterWorkbench, panel]);

  const returnToIntro = useCallback(() => {
    setPanel('intro');
    setBreachActive(false);
  }, []);

  const selectStage = useCallback((index: number, focus = false) => {
    const bounded = wrapIndex(index, workbenchStages.length);
    const next = workbenchStages[bounded] ?? defaultWorkbenchStage;
    setStage(next.id);
    if (focus) stageRefs.current[bounded]?.focus();
  }, []);

  const selectScope = useCallback((index: number, focus = false) => {
    const bounded = wrapIndex(index, auditScopes.length);
    const next = auditScopes[bounded] ?? defaultAuditScope;
    setActiveScopeId(next.id);
    if (focus) scopeRefs.current[bounded]?.focus();
  }, []);

  const selectFinding = useCallback((index: number, focus = false) => {
    const bounded = wrapIndex(index, findings.length);
    const next = findings[bounded] ?? defaultFinding;
    setActiveFindingId(next.id);
    setActiveScopeId(next.scopeId);
    if (focus) findingRefs.current[bounded]?.focus();
  }, []);

  const handleStageKey = useCallback((event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (![...forwardKeys, ...backwardKeys, 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') selectStage(0, true);
    else if (event.key === 'End') selectStage(workbenchStages.length - 1, true);
    else if (forwardKeys.has(event.key)) selectStage(index + 1, true);
    else selectStage(index - 1, true);
  }, [selectStage]);

  const handleScopeKey = useCallback((event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (![...forwardKeys, ...backwardKeys, 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') selectScope(0, true);
    else if (event.key === 'End') selectScope(auditScopes.length - 1, true);
    else if (forwardKeys.has(event.key)) selectScope(index + 1, true);
    else selectScope(index - 1, true);
  }, [selectScope]);

  const handleFindingKey = useCallback((event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (![...forwardKeys, ...backwardKeys, 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') selectFinding(0, true);
    else if (event.key === 'End') selectFinding(findings.length - 1, true);
    else if (forwardKeys.has(event.key)) selectFinding(index + 1, true);
    else selectFinding(index - 1, true);
  }, [selectFinding]);

  const setPlanStatus = useCallback((id: string, status: PlanStatus) => {
    setPlanStatuses((current) => ({ ...current, [id]: status }));
  }, []);

  const advanceStage = useCallback(() => {
    selectStage(stageIndex + 1);
  }, [selectStage, stageIndex]);

  const previousStage = useCallback(() => {
    selectStage(stageIndex - 1);
  }, [selectStage, stageIndex]);

  return {
    panel,
    breachActive,
    stage,
    stageIndex,
    activeScopeId,
    activeScopeIndex,
    activeFindingId,
    activeFindingIndex,
    planStatuses,
    stageRefs,
    scopeRefs,
    findingRefs,
    workbenchTitleRef,
    entryButtonRef,
    enterWorkbench,
    returnToIntro,
    selectStage,
    selectScope,
    selectFinding,
    handleStageKey,
    handleScopeKey,
    handleFindingKey,
    setPlanStatus,
    advanceStage,
    previousStage
  };
}
