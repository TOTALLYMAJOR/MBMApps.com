/** Original, deterministic visual choreography. Coordinates are illustrative, not repository data. */
export const WALE_SCENE_STATE_NAMES = [
  "latent",
  "recognition",
  "ascent",
  "arrival",
  "propagation",
  "coherence",
] as const;

export type WaleSceneStateName = (typeof WALE_SCENE_STATE_NAMES)[number];

export type WaleSceneState = Readonly<{
  phase: WaleSceneStateName;
  progress: number;
  energyPosition: number;
  propagation: number;
  coherence: number;
}>;

export type WaleSceneValue = "energyPosition" | "propagation" | "coherence";

const WALE_SCENE_STATES: readonly WaleSceneState[] = Object.freeze([
  Object.freeze({ phase: "latent", progress: 0, energyPosition: 0, propagation: 0, coherence: 0 }),
  Object.freeze({ phase: "recognition", progress: 1, energyPosition: 0.14, propagation: 0, coherence: 0 }),
  Object.freeze({ phase: "ascent", progress: 2, energyPosition: 0.43, propagation: 0, coherence: 0 }),
  Object.freeze({ phase: "arrival", progress: 3, energyPosition: 0.57, propagation: 0, coherence: 0 }),
  Object.freeze({ phase: "propagation", progress: 4, energyPosition: 0.84, propagation: 0.72, coherence: 0.18 }),
  Object.freeze({ phase: "coherence", progress: 5, energyPosition: 1, propagation: 1, coherence: 1 }),
]);

function normalizeProgress(progress: number): number {
  return Number.isFinite(progress) ? Math.max(0, Math.min(5, progress)) : 0;
}

export function isWaleSceneStateName(value: unknown): value is WaleSceneStateName {
  return typeof value === "string" && WALE_SCENE_STATE_NAMES.some((name) => name === value);
}

export function getWaleSceneState(name: WaleSceneStateName): WaleSceneState {
  return WALE_SCENE_STATES[WALE_SCENE_STATE_NAMES.indexOf(name)]!;
}

export function getWaleScenePhase(progress: number): WaleSceneStateName {
  return WALE_SCENE_STATE_NAMES[Math.round(normalizeProgress(progress))]!;
}

/** Allocation-free scalar sampler for the render loop. */
export function sampleWaleSceneValue(progress: number, value: WaleSceneValue): number {
  const normalized = normalizeProgress(progress);
  const startIndex = Math.floor(normalized);
  if (startIndex >= WALE_SCENE_STATES.length - 1) return WALE_SCENE_STATES[5]![value];
  const start = WALE_SCENE_STATES[startIndex]!;
  const end = WALE_SCENE_STATES[startIndex + 1]!;
  const delta = normalized - startIndex;
  const blend = delta * delta * (3 - 2 * delta);
  return start[value] + (end[value] - start[value]) * blend;
}

/** Pure snapshot contract for tests, tooling, and deterministic canonical states. */
export function deriveWaleSceneState(progress: number): WaleSceneState {
  const normalized = normalizeProgress(progress);
  return {
    phase: getWaleScenePhase(normalized),
    progress: normalized,
    energyPosition: sampleWaleSceneValue(normalized, "energyPosition"),
    propagation: sampleWaleSceneValue(normalized, "propagation"),
    coherence: sampleWaleSceneValue(normalized, "coherence"),
  };
}

export type SignalGeometry = {
  targets: Float32Array[];
  seeds: Float32Array;
  sizes: Float32Array;
  count: number;
};

export function createSignalGeometry(count: number, seed = 74021): SignalGeometry {
  if (!Number.isInteger(count) || count < 1 || count > 24000) {
    throw new RangeError("Signal count must be an integer between 1 and 24000");
  }
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const targets = Array.from({ length: 6 }, () => new Float32Array(count * 3));
    const seeds = new Float32Array(count * 4);
    const sizes = new Float32Array(count);
  const tau = Math.PI * 2;

  for (let i = 0; i < count; i++) {
    // The irrational stride keeps every prefix spatially complete when quality drops.
    const t = ((i * 0.61803398875) % 1) * tau;
    const v = random() * tau;
      const width = (random() - 0.5) * 0.84;
      const depth = (random() - 0.5) * 0.6;
    const group = i % 6;
    const phase = (group / 6) * tau;
      const radius = 2.07 + width * 1.85;
    const put = (target: number, x: number, y: number, z: number) => {
      targets[target]!.set([x, y, z], i * 3);
    };

    // A folded, imperfect annulus: signal exists before its relationships become legible.
    const tear = Math.pow(random(), 8);
    put(0,
      radius * Math.cos(t) + Math.sin(t * 3) * 0.32 + (random() - 0.5) * tear * 2.5,
      radius * Math.sin(t) * 0.91 + Math.cos(t * 2) * 0.28 + (random() - 0.5) * tear * 2,
        Math.sin(t * 2) * 0.79 + depth * 2.5 + tear * (random() - 0.5) * 3,
    );

    // Six distinct folded collections, retaining the individual fragments.
    put(1,
      Math.cos(phase) * 2.03 + Math.cos(t) * (0.41 + width * 0.5),
      Math.sin(phase) * 1.85 + Math.sin(t) * (0.43 + width * 0.5),
      Math.sin(phase * 2) * 0.64 + Math.sin(v) * 0.29 + depth,
    );

    // Groups open into crossing ribbons, making shared structure visible.
    const ribbonRadius = 1.7 + Math.cos(t * 3 + phase) * 0.43 + width * 0.5;
    put(2,
      ribbonRadius * Math.cos(t) + Math.cos(phase) * 0.26,
      ribbonRadius * Math.sin(t) * 0.91 + Math.sin(phase) * 0.26,
      Math.sin(t * 3 + phase) * 0.67 + depth * 0.55,
    );

    // A constrained passage exposes the tension at the center of the field.
    const side = Math.cos(t) < 0 ? -1 : 1;
    put(3,
      Math.cos(t) * 2.05 + side * 0.28,
      Math.sin(t) * (0.4 + Math.abs(Math.cos(t)) * 1.17) + width * 0.56,
      Math.sin(t * 2) * 0.85 + depth,
    );

    // A single continuous trefoil ribbon: coherent, still visibly alive.
    const knotRadius = 1.62 + Math.cos(t * 3) * 0.48 + width * 0.42;
    put(4,
      knotRadius * Math.cos(t * 2),
      knotRadius * Math.sin(t * 2) * 0.91,
      Math.sin(t * 3) * 0.91 + depth * 0.62,
    );

      // A broad, deep belt keeps the open center for the repository handoff.
      put(5,
        (2.8 + width * 2.0) * Math.cos(t),
        (2.2 + width * 1.75) * Math.sin(t),
        Math.sin(t * 2) * 0.55 + depth * 2.5,
    );
      seeds.set([random(), random(), random(), group / 5], i * 4);
      // Size is independent of group identity. Reuse a random seed channel so
      // changing the size distribution never changes the seeded arrangements.
      const sizeSample = seeds[i * 4 + 1]!;
      sizes[i] = sizeSample < 0.65
        ? 0.008 + sizeSample / 0.65 * 0.006
        : sizeSample < 0.95
          ? 0.014 + (sizeSample - 0.65) / 0.3 * 0.01
          : 0.028 + (sizeSample - 0.95) / 0.05 * 0.024;
  }
    return { targets, seeds, sizes, count };
}
