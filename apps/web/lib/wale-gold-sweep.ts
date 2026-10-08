export type GoldSweep = { startedAt: number | null; head: number; strength: number; warm: number };

/** One scene-clock-driven reveal per completed-ring arrival; no extra timer. */
export function advanceGoldSweep(state: GoldSweep, progress: number, time: number, reduced: boolean) {
  if (progress < 4.6) state.startedAt = null;
  state.strength = 0;
  state.warm = 0;
  if (progress < 4.985) return;
  if (reduced) { state.warm = 0.22; return; }
  if (state.startedAt === null) state.startedAt = time;
  const age = Math.max(0, time - state.startedAt);
  state.head = Math.min(age / 3.6, 1) * Math.PI * 2;
  const fade = Math.max(0, Math.min(1, (age - 3.6) / 1.2));
  state.strength = 1 - fade * fade * (3 - 2 * fade);
}
