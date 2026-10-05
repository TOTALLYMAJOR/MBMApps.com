import { describe, expect, it } from 'vitest';
import {
  abyssBubbles,
  abyssContract,
  abyssCopy,
  abyssLogRows,
  entryTarget,
  sablefinIdentity,
  viewportPresenceMode
} from '../components/wale/abyss-model';
import {
  budgetFromSlider,
  budgetProjection,
  comparisonRows,
  evidenceEvents,
  heroCopy,
  runEvents,
  runForDecision,
  sliderFromBudget,
  specimenForDecision
} from '../components/wale/precision-model';

describe('Wale precision experience model', () => {
  it('maps the native control logarithmically across the full eligible LOC range', () => {
    expect(budgetFromSlider(0)).toBe(1);
    expect(budgetFromSlider(25)).toBe(10);
    expect(budgetFromSlider(50)).toBe(100);
    expect(budgetFromSlider(75)).toBe(1_000);
    expect(budgetFromSlider(100)).toBe(10_000);
    expect(sliderFromBudget(500)).toBeCloseTo(67.47, 1);
  });

  it('keeps deterministic projections bounded by the selected maximum', () => {
    expect(budgetProjection(500)).toMatchObject({ label: 'CORE IMPLEMENTATION', files: 4, estimatedLoc: 420 });
    expect(budgetProjection(2_000)).toMatchObject({ label: 'EXPANDED IMPLEMENTATION', files: 11, estimatedLoc: 1_760 });
    expect(budgetProjection(5_000)).toMatchObject({ label: 'BROAD IMPLEMENTATION', files: 18, estimatedLoc: 4_300 });
    for (const value of [1, 10, 100, 500, 2_000, 5_000, 10_000]) {
      expect(budgetProjection(value).estimatedLoc).toBeLessThanOrEqual(value);
    }
  });

  it('preserves singular SABLEFIN identity while exposing causal morphology', () => {
    const preserved = specimenForDecision(500, true);
    const open = specimenForDecision(5_000, false);
    expect(preserved).toMatchObject({ name: 'SABLEFIN', serial: 'SF-01', role: 'DECISION SPECIMEN' });
    expect(open).toMatchObject({ name: 'SABLEFIN', serial: 'SF-01', role: 'DECISION SPECIMEN' });
    expect(open.plates).toBeGreaterThan(preserved.plates);
    expect(open.branches).toBeGreaterThan(preserved.branches);
    expect(open.measurements).toBeGreaterThan(preserved.measurements);
  });

  it('carries the exact product statement and truthful sample boundary', () => {
    expect(heroCopy.primary).toBe('Your coding agent can show you one implementation.');
    expect(heroCopy.payoff).toBe('WALE explores the other thousand.');
    expect(heroCopy.boundary).toBe('ILLUSTRATIVE RUN · SAMPLE REPOSITORY');
    expect(evidenceEvents.map((event) => event.message)).toEqual([
      'leading constraint isolated',
      'minimum sufficient intervention prepared',
      'required proof gates attached',
      'execution remains inside approved scope',
      'candidate prepared for execution'
    ]);
  });

  it('orders the sample run and compares controlled variants without declaring a generic winner', () => {
    expect(runEvents.map((event) => event.stage)).toEqual([
      'INTENT', 'DISCOVER', 'DECISION', 'PLAN', 'BOUND', 'EXECUTE', 'VERIFY', 'RESULT'
    ]);
    expect(runEvents.at(-1)?.detail).toContain('exact sample run');
    expect(comparisonRows).toHaveLength(7);
    expect(comparisonRows.every((row) => Boolean(row.runA) && Boolean(row.runB))).toBe(true);
  });

  it('binds theater evidence to the chosen budget and architecture decision', () => {
    expect(runForDecision(300, true).result).toBe('BOUNDED · INCOMPLETE');
    expect(runForDecision(300, true).deliveredLoc).toBeLessThanOrEqual(300);
    expect(runForDecision(500, true)).toMatchObject({ result: 'VERIFIED', deliveredLoc: 437, variant: 'PRESERVED PATH' });
    expect(runForDecision(500, false)).toMatchObject({ result: 'VERIFIED WITH EVIDENCE GAP', variant: 'OPEN PATH' });
    expect(runForDecision(500, false).deliveredLoc).toBeLessThanOrEqual(500);
  });
});

describe('Wale abyss arrival model', () => {
  it('defines one fixed arrival viewport before the retained precision viewport', () => {
    expect(abyssContract.documentScroll).toBe(false);
    expect(abyssContract.viewports).toEqual(['abyss', 'precision']);
    expect(abyssContract.entryLabel).toBe('ENTER WALE');
    expect(abyssContract.handoffDurationMs + (abyssContract.viewportCrossfadeMs * 2)).toBeGreaterThanOrEqual(900);
    expect(abyssContract.handoffDurationMs + (abyssContract.viewportCrossfadeMs * 2)).toBeLessThanOrEqual(1_200);
  });

  it('keeps the animated field bounded and truthful', () => {
    expect(abyssBubbles).toHaveLength(12);
    expect(abyssLogRows).toHaveLength(7);
    expect(abyssLogRows.map((row) => row.stage)).toEqual(expect.arrayContaining(['OBSERVE', 'BOUND', 'COMPARE', 'VERIFY']));
    expect(abyssCopy.boundary).toBe('ILLUSTRATIVE SYSTEM SEQUENCE');
    expect(abyssLogRows.map((row) => `${row.stage} ${row.detail}`).join(' ')).not.toMatch(/repository connected|live repository/i);
  });

  it('guards duplicate entry and bypasses travel motion only when requested', () => {
    expect(entryTarget('abyss', false)).toBe('handoff');
    expect(entryTarget('abyss', true)).toBe('precision');
    expect(entryTarget('handoff', false)).toBe('handoff');
    expect(entryTarget('precision', false)).toBe('precision');
  });

  it('mounts the incoming viewport before the outgoing viewport finishes exiting', () => {
    expect(viewportPresenceMode).toBe('sync');
  });

  it('preserves a single named SABLEFIN specimen', () => {
    expect(sablefinIdentity).toEqual({ name: 'SABLEFIN', serial: 'SF-01', form: 'SMALL WHALE' });
  });
});
