import { describe, expect, it } from "vitest";
import {
  WALE_SCENE_STATE_NAMES,
  createSignalGeometry,
  deriveWaleSceneState,
  getWaleSceneState,
  isWaleSceneStateName,
} from "./wale-signal-geometry";

const canonicalStates = [
  ["latent", 0, 0, 0, 0],
  ["recognition", 1, 0.14, 0, 0],
  ["ascent", 2, 0.43, 0, 0],
  ["arrival", 3, 0.57, 0, 0],
  ["propagation", 4, 0.84, 0.72, 0.18],
  ["coherence", 5, 1, 1, 1],
] as const;

describe("Wale deterministic scene state", () => {
  it.each(canonicalStates)(
    "maps %s to its canonical progress and causal values",
    (name, progress, energyPosition, propagation, coherence) => {
      expect(getWaleSceneState(name)).toEqual({
        phase: name,
        progress,
        energyPosition,
        propagation,
        coherence,
      });
      expect(deriveWaleSceneState(progress)).toEqual({
        phase: name,
        progress,
        energyPosition,
        propagation,
        coherence,
      });
    },
  );

  it("interpolates continuous values while keeping a named phase", () => {
    expect(deriveWaleSceneState(3.5)).toEqual({
      phase: "propagation",
      progress: 3.5,
      energyPosition: 0.705,
      propagation: 0.36,
      coherence: 0.09,
    });
  });

  it("clamps invalid progress and recognizes only canonical state names", () => {
    expect(deriveWaleSceneState(-2)).toEqual(getWaleSceneState("latent"));
    expect(deriveWaleSceneState(Number.NaN)).toEqual(getWaleSceneState("latent"));
    expect(deriveWaleSceneState(8)).toEqual(getWaleSceneState("coherence"));
    expect(WALE_SCENE_STATE_NAMES).toEqual(canonicalStates.map(([name]) => name));
    expect(isWaleSceneStateName("arrival")).toBe(true);
    expect(isWaleSceneStateName("unknown")).toBe(false);
    expect(isWaleSceneStateName(null)).toBe(false);
  });
});

describe("Wale signal geometry", () => {
  it.each([10000, 24000])("mixes particle sizes within every group at count %i", (count) => {
    const field = createSignalGeometry(count);
    expect(field.sizes).toHaveLength(count);
    for (let group = 0; group < 6; group++) {
      const sizes = Array.from(field.sizes).filter((_, index) => index % 6 === group);
      const small = sizes.filter(size => size < 0.014).length / sizes.length;
      const large = sizes.filter(size => size >= 0.028).length / sizes.length;
      expect(small).toBeGreaterThan(0.59);
      expect(small).toBeLessThan(0.71);
      expect(large).toBeGreaterThan(0.025);
      expect(large).toBeLessThan(0.075);
      expect(sizes.every(size => size >= 0.008 && size <= 0.052)).toBe(true);
    }
  });

  it("gives the opening band substantial radial width and front-to-back depth", () => {
    const target = createSignalGeometry(24000).targets[0]!;
    const depths = Array.from(target).filter((_, index) => index % 3 === 2).sort((a, b) => a - b);
    expect(depths[Math.floor(depths.length * 0.9)]! - depths[Math.floor(depths.length * 0.1)]!).toBeGreaterThan(1.6);
    const radii: number[] = [];
    for (let i = 0; i < target.length; i += 3) radii.push(Math.hypot(target[i]!, target[i + 1]!));
    radii.sort((a, b) => a - b);
    expect(radii[Math.floor(radii.length * 0.9)]! - radii[Math.floor(radii.length * 0.1)]!).toBeGreaterThan(1.15);
  });

  it("keeps the final arc broad and deep without filling its open center", () => {
    const { targets, count } = createSignalGeometry(24000);
    const target = targets[5]!;
    const radii: number[] = [];
    const depths: number[] = [];
    for (let i = 0; i < target.length; i += 3) {
      radii.push(Math.hypot(target[i]! / 2.8, target[i + 1]! / 2.2));
      depths.push(target[i + 2]!);
    }
    radii.sort((a, b) => a - b);
    depths.sort((a, b) => a - b);
    expect(count).toBe(24000);
    expect(radii[21600]! - radii[2400]!).toBeGreaterThan(0.45);
    expect(radii[0]).toBeGreaterThan(0.6);
    expect(depths[21600]! - depths[2400]!).toBeGreaterThan(1.3);
  });

  it("reproduces the same field from the same seed", () => {
    expect(createSignalGeometry(128, 42)).toEqual(createSignalGeometry(128, 42));
    expect(createSignalGeometry(128, 42).targets[0]).not.toEqual(createSignalGeometry(128, 43).targets[0]);
  });

  it.each([1, 4000, 12000])("creates six finite bounded targets for %i fragments", (count) => {
    const field = createSignalGeometry(count);
    expect(field.count).toBe(count);
    expect(field.targets).toHaveLength(6);
    expect(field.seeds).toHaveLength(count * 4);
    for (const target of field.targets) {
      expect(target).toHaveLength(count * 3);
      expect(target.every((value) => Number.isFinite(value) && Math.abs(value) < 5)).toBe(true);
    }
    expect(field.seeds.every((value) => Number.isFinite(value) && value >= 0 && value <= 1)).toBe(true);
  });

  it.each([0, -1, 1.5, Infinity, NaN, 24001])("rejects invalid fragment count %s", (count) => {
    expect(() => createSignalGeometry(count)).toThrow(RangeError);
  });
});
