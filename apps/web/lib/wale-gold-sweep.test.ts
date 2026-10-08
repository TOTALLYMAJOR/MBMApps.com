import { describe, expect, it } from "vitest";
import { advanceGoldSweep, type GoldSweep } from "./wale-gold-sweep";
const fresh = (): GoldSweep => ({ startedAt: null, head: 0, strength: 0, warm: 0 });
describe("completed-ring golden reveal", () => {
  it("waits for formation, circles once and fades without repeating", () => {
    const state = fresh();
    advanceGoldSweep(state, 4.9, 10, false);
    expect(state.startedAt).toBeNull();
    advanceGoldSweep(state, 5, 11, false);
    expect(state.head).toBe(0);
    advanceGoldSweep(state, 5, 12.8, false);
    expect(state.head).toBeCloseTo(Math.PI);
    advanceGoldSweep(state, 5, 14.6, false);
    expect(state.head).toBeCloseTo(Math.PI * 2);
    advanceGoldSweep(state, 5, 17, false);
    expect(state.strength).toBe(0);
    advanceGoldSweep(state, 5, 100, false);
    expect(state.strength).toBe(0);
  });
  it("freezes with the scene clock and rearms only after leaving", () => {
    const state = fresh();
    advanceGoldSweep(state, 5, 0, false);
    advanceGoldSweep(state, 5, 1, false);
    const held = { ...state };
    advanceGoldSweep(state, 5, 1, false);
    expect(state).toEqual(held);
    advanceGoldSweep(state, 4.8, 2, false);
    expect(state.startedAt).toBe(0);
    advanceGoldSweep(state, 4.5, 3, false);
    expect(state.startedAt).toBeNull();
    advanceGoldSweep(state, 5, 4, false);
    expect(state.head).toBe(0);
  });
  it("uses a static warm accent with reduced motion", () => {
    const state = fresh();
    advanceGoldSweep(state, 5, 20, true);
    expect(state.strength).toBe(0);
    expect(state.warm).toBe(0.22);
  });
});
