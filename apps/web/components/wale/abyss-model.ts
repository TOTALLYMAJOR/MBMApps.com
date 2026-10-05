export interface AbyssBubble {
  id: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

export interface AbyssLogRow {
  id: string;
  stage: 'OBSERVE' | 'BOUND' | 'COMPARE' | 'VERIFY' | 'AUTHORITY';
  detail: string;
  x: number;
  duration: number;
  delay: number;
}

export type LandingViewport = 'abyss' | 'handoff' | 'precision';

export const viewportPresenceMode = 'sync' as const;

export const abyssContract = {
  documentScroll: false,
  viewports: ['abyss', 'precision'],
  entryLabel: 'ENTER WALE',
  sequenceDurationMs: 18_000,
  entryAvailableMs: 7_200,
  handoffDurationMs: 820,
  viewportCrossfadeMs: 160
} as const;

export const abyssCopy = {
  eyebrow: 'DEVELOPMENT DECISION INTELLIGENCE',
  primary: 'Your coding agent can show you one implementation.',
  payoff: 'WALE explores the other thousand.',
  support: 'Change the constraints. Change the instructions. Change the strategy. See what those decisions actually do to the outcome.',
  boundary: 'ILLUSTRATIVE SYSTEM SEQUENCE'
} as const;

export const sablefinIdentity = { name: 'SABLEFIN', serial: 'SF-01', form: 'SMALL WHALE' } as const;

export function entryTarget(current: LandingViewport, bypassMotion: boolean): LandingViewport {
  if (current !== 'abyss') return current;
  return bypassMotion ? 'precision' : 'handoff';
}

export const abyssBubbles: readonly AbyssBubble[] = [
  { id: 'B01', x: 7, size: 5, duration: 10.8, delay: -1.2, drift: 14, opacity: .26 },
  { id: 'B02', x: 14, size: 10, duration: 13.4, delay: -6.8, drift: -18, opacity: .34 },
  { id: 'B03', x: 22, size: 4, duration: 9.7, delay: -3.3, drift: 10, opacity: .22 },
  { id: 'B04', x: 31, size: 7, duration: 12.2, delay: -8.1, drift: 22, opacity: .3 },
  { id: 'B05', x: 39, size: 3, duration: 8.9, delay: -5.7, drift: -9, opacity: .2 },
  { id: 'B06', x: 47, size: 12, duration: 14.1, delay: -10.3, drift: 16, opacity: .32 },
  { id: 'B07', x: 56, size: 5, duration: 10.4, delay: -7.4, drift: -12, opacity: .24 },
  { id: 'B08', x: 64, size: 8, duration: 11.8, delay: -2.6, drift: 19, opacity: .3 },
  { id: 'B09', x: 72, size: 4, duration: 9.4, delay: -6.1, drift: -8, opacity: .22 },
  { id: 'B10', x: 80, size: 11, duration: 13.1, delay: -4.5, drift: 13, opacity: .32 },
  { id: 'B11', x: 88, size: 6, duration: 10.2, delay: -8.9, drift: -17, opacity: .26 },
  { id: 'B12', x: 95, size: 3, duration: 9.1, delay: -1.8, drift: 8, opacity: .2 }
] as const;

export const abyssLogRows: readonly AbyssLogRow[] = [
  { id: 'S01', stage: 'OBSERVE', detail: 'requirement surfaces mapped', x: 8, duration: 13.8, delay: 1.6 },
  { id: 'S02', stage: 'BOUND', detail: 'candidate constrained to declared scope', x: 57, duration: 15.2, delay: 5.2 },
  { id: 'S03', stage: 'COMPARE', detail: 'plausible intervention paths retained', x: 18, duration: 14.6, delay: 3.8 },
  { id: 'S04', stage: 'VERIFY', detail: 'evidence gates attached to outcome', x: 64, duration: 16.1, delay: 2.6 },
  { id: 'S05', stage: 'OBSERVE', detail: 'architecture continuity registered', x: 35, duration: 15.7, delay: 6.1 },
  { id: 'S06', stage: 'AUTHORITY', detail: 'operator authority retained', x: 73, duration: 14.2, delay: 4.8 },
  { id: 'S07', stage: 'COMPARE', detail: 'decision consequences measured', x: 3, duration: 16.4, delay: 7 }
] as const;
