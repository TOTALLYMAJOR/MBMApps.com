import { sampleWaleSceneValue } from "./wale-signal-geometry";

export const WALE_MANUFACTURING_DETAIL_KINDS = [
  "beveled-collar",
  "recessed-fastener",
  "split-line-band",
  "spacer",
  "strain-relief",
  "knurl-rib",
  "vent",
  "connector-housing",
] as const;

export type WaleManufacturingDetailKind = typeof WALE_MANUFACTURING_DETAIL_KINDS[number];

export type WaleManufacturingAnchor =
  | "housing"
  | "receiver"
  | "source-pod"
  | "module-pod-0"
  | "module-pod-1"
  | "module-pod-2"
  | "inbound-socket-0"
  | "inbound-socket-1"
  | "inbound-socket-2"
  | "outbound-socket-0"
  | "outbound-socket-1"
  | "outbound-socket-2"
  | "outbound-socket-3";

export type WaleManufacturingMaterialRole =
  | "black-nickel"
  | "machined-silver"
  | "ceramic"
  | "elastomer";

export type WaleManufacturingDetailSpec = Readonly<{
  id: string;
  kind: WaleManufacturingDetailKind;
  anchor: WaleManufacturingAnchor;
  /** Local position relative to the named existing mechanism anchor. */
  position: readonly [number, number, number];
  /** Local Euler rotation in radians. */
  rotation: readonly [number, number, number];
  /** Shared primitive dimensions: radius/width, depth/height, secondary radius. */
  scale: readonly [number, number, number];
  material: WaleManufacturingMaterialRole;
}>;

const freezeVector = (
  x: number,
  y: number,
  z: number,
): readonly [number, number, number] => Object.freeze([x, y, z]) as readonly [number, number, number];

function freezeDetail(
  id: string,
  kind: WaleManufacturingDetailKind,
  anchor: WaleManufacturingAnchor,
  position: readonly [number, number, number],
  rotation: readonly [number, number, number],
  scale: readonly [number, number, number],
  material: WaleManufacturingMaterialRole,
): WaleManufacturingDetailSpec {
  return Object.freeze({
    id,
    kind,
    anchor,
    position: Object.freeze([...position]) as readonly [number, number, number],
    rotation: Object.freeze([...rotation]) as readonly [number, number, number],
    scale: Object.freeze([...scale]) as readonly [number, number, number],
    material,
  });
}

function radialDetails({
  prefix,
  kind,
  anchor,
  count,
  radius,
  z,
  phase = 0,
  scale,
  material,
}: {
  prefix: string;
  kind: WaleManufacturingDetailKind;
  anchor: WaleManufacturingAnchor;
  count: number;
  radius: number;
  z: number;
  phase?: number;
  scale: readonly [number, number, number];
  material: WaleManufacturingMaterialRole;
}): WaleManufacturingDetailSpec[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = phase + index / count * Math.PI * 2;
    return freezeDetail(
      `${prefix}-${String(index).padStart(2, "0")}`,
      kind,
      anchor,
      freezeVector(Math.cos(angle) * radius, Math.sin(angle) * radius, z),
      freezeVector(Math.PI / 2, 0, angle),
      scale,
      material,
    );
  });
}

function anchoredDetails(
  prefix: string,
  kind: WaleManufacturingDetailKind,
  anchors: readonly WaleManufacturingAnchor[],
  position: readonly [number, number, number],
  rotation: readonly [number, number, number],
  scale: readonly [number, number, number],
  material: WaleManufacturingMaterialRole,
): WaleManufacturingDetailSpec[] {
  return anchors.map((anchor, index) => freezeDetail(
    `${prefix}-${String(index).padStart(2, "0")}`,
    kind,
    anchor,
    position,
    rotation,
    scale,
    material,
  ));
}

const modulePodAnchors = [
  "module-pod-0",
  "module-pod-1",
  "module-pod-2",
] as const satisfies readonly WaleManufacturingAnchor[];
const inboundSocketAnchors = [
  "inbound-socket-0",
  "inbound-socket-1",
  "inbound-socket-2",
] as const satisfies readonly WaleManufacturingAnchor[];
const outboundSocketAnchors = [
  "outbound-socket-0",
  "outbound-socket-1",
  "outbound-socket-2",
  "outbound-socket-3",
] as const satisfies readonly WaleManufacturingAnchor[];
const allSocketAnchors = [...inboundSocketAnchors, ...outboundSocketAnchors] as const;

const beveledCollars = [
  freezeDetail(
    "receiver-beveled-collar-00",
    "beveled-collar",
    "receiver",
    freezeVector(0, 0, 0.315),
    freezeVector(Math.PI / 2, 0, 0),
    freezeVector(0.68, 0.052, 0.026),
    "machined-silver",
  ),
  freezeDetail(
    "receiver-beveled-collar-01",
    "beveled-collar",
    "receiver",
    freezeVector(0, 0, 0.382),
    freezeVector(Math.PI / 2, 0, 0),
    freezeVector(0.49, 0.038, 0.018),
    "black-nickel",
  ),
  freezeDetail(
    "receiver-beveled-collar-02",
    "beveled-collar",
    "receiver",
    freezeVector(0, 0, 0.458),
    freezeVector(Math.PI / 2, 0, 0),
    freezeVector(0.415, 0.027, 0.014),
    "machined-silver",
  ),
];

const recessedFasteners = [
  ...radialDetails({
    prefix: "receiver-recessed-fastener",
    kind: "recessed-fastener",
    anchor: "receiver",
    count: 12,
    radius: 0.79,
    z: 0.336,
    phase: 0.12,
    scale: freezeVector(0.047, 0.052, 0.024),
    material: "ceramic",
  }),
  ...radialDetails({
    prefix: "housing-recessed-fastener",
    kind: "recessed-fastener",
    anchor: "housing",
    count: 12,
    radius: 0.91,
    z: -0.276,
    phase: 0.12 + Math.PI / 12,
    scale: freezeVector(0.042, 0.046, 0.021),
    material: "black-nickel",
  }),
];

const splitLineBands = [
  ...anchoredDetails(
    "pod-split-line-band",
    "split-line-band",
    ["source-pod", ...modulePodAnchors],
    freezeVector(0, 0, 0.04),
    freezeVector(Math.PI / 2, 0, 0),
    freezeVector(0.235, 0.022, 0.014),
    "machined-silver",
  ),
  ...anchoredDetails(
    "module-service-band",
    "split-line-band",
    modulePodAnchors,
    freezeVector(0, 0, -0.16),
    freezeVector(Math.PI / 2, 0, 0),
    freezeVector(0.228, 0.018, 0.012),
    "black-nickel",
  ),
  freezeDetail(
    "housing-split-line-band-00",
    "split-line-band",
    "housing",
    freezeVector(0, 0, -0.305),
    freezeVector(Math.PI / 2, 0, 0),
    freezeVector(0.92, 0.024, 0.016),
    "machined-silver",
  ),
];

const spacerStacks = outboundSocketAnchors.flatMap((anchor, socketIndex) => (
  Array.from({ length: 3 }, (_, stackIndex) => freezeDetail(
    `outbound-spacer-${socketIndex}-${stackIndex}`,
    "spacer",
    anchor,
    freezeVector(0, -0.078 + stackIndex * 0.078, 0),
    freezeVector(Math.PI / 2, 0, 0),
    freezeVector(0.172 - stackIndex * 0.007, 0.018, 0.031),
    stackIndex === 1 ? "elastomer" : "machined-silver",
  ))
));

const strainReliefs = anchoredDetails(
  "socket-strain-relief",
  "strain-relief",
  ["source-pod", ...modulePodAnchors, "inbound-socket-1", "inbound-socket-2"],
  freezeVector(0, -0.17, 0),
  freezeVector(0, 0, 0),
  freezeVector(0.19, 0.23, 0.032),
  "elastomer",
);

const knurlRibs = modulePodAnchors.flatMap((anchor, moduleIndex) => radialDetails({
  prefix: `module-${moduleIndex}-knurl-rib`,
  kind: "knurl-rib",
  anchor,
  count: 12,
  radius: 0.228,
  z: -0.075,
  phase: moduleIndex % 2 === 0 ? 0 : Math.PI / 12,
  scale: freezeVector(0.012, 0.085, 0.018),
  material: "black-nickel",
}));

const vents = radialDetails({
  prefix: "housing-vent",
  kind: "vent",
  anchor: "housing",
  count: 18,
  radius: 0.745,
  z: -0.338,
  phase: Math.PI / 18,
  scale: freezeVector(0.026, 0.105, 0.016),
  material: "black-nickel",
});

const connectorHousings = anchoredDetails(
  "socket-connector-housing",
  "connector-housing",
  allSocketAnchors,
  freezeVector(0, 0, 0),
  freezeVector(0, 0, 0),
  freezeVector(0.178, 0.215, 0.155),
  "machined-silver",
);

/**
 * Master-only construction recipe. It is generated once, deeply immutable, and
 * stays separate from animation state so the single scene clock remains the
 * sole behavioral authority.
 */
export const WALE_MASTER_MANUFACTURING_RECIPE: readonly WaleManufacturingDetailSpec[] = Object.freeze([
  ...beveledCollars,
  ...recessedFasteners,
  ...splitLineBands,
  ...spacerStacks,
  ...strainReliefs,
  ...knurlRibs,
  ...vents,
  ...connectorHousings,
]);

export const WALE_MASTER_MANUFACTURING_COUNTS: Readonly<Record<WaleManufacturingDetailKind, number>> =
  Object.freeze(WALE_MANUFACTURING_DETAIL_KINDS.reduce(
    (counts, kind) => {
      counts[kind] = WALE_MASTER_MANUFACTURING_RECIPE.filter((detail) => detail.kind === kind).length;
      return counts;
    },
    Object.fromEntries(WALE_MANUFACTURING_DETAIL_KINDS.map((kind) => [kind, 0])) as Record<
      WaleManufacturingDetailKind,
      number
    >,
  ));

export type WaleMasterAssemblyState = {
  energyPosition: number;
  anticipation: number;
  impact: number;
  receiver: number;
  recoil: number;
  bearingCompression: number;
  ringTwist: number;
  conduitTension: number;
  collars: [number, number, number];
  latches: [number, number, number];
  turbulence: number;
  alignment: number;
  upstreamCharge: number;
  downstreamCharge: number;
  invalidRetraction: number;
  protectedRedirect: number;
};

function smoothstep(value: number, edge0: number, edge1: number): number {
  const normalized = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return normalized * normalized * (3 - 2 * normalized);
}

function pulse(
  value: number,
  attack0: number,
  attack1: number,
  release0: number,
  release1: number,
): number {
  return smoothstep(value, attack0, attack1) * (1 - smoothstep(value, release0, release1));
}

/** Back-out easing gives each mechanical closure one bounded inertial kick. */
function overshootStep(value: number, edge0: number, edge1: number): number {
  const normalized = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  if (normalized === 0 || normalized === 1) return normalized;
  const shifted = normalized - 1;
  const overshoot = 1.70158;
  return 1 + (overshoot + 1) * shifted * shifted * shifted
    + overshoot * shifted * shifted;
}

/** Allocation-free render-loop sampler driven by the existing 0..5 scene clock. */
export function sampleWaleAssemblyState(
  progress: number,
  target: WaleMasterAssemblyState,
): WaleMasterAssemblyState {
  const energyPosition = sampleWaleSceneValue(progress, "energyPosition");
  const propagation = sampleWaleSceneValue(progress, "propagation");
  const coherence = sampleWaleSceneValue(progress, "coherence");
  const anticipation = pulse(energyPosition, 0.22, 0.42, 0.48, 0.57);
  const impact = pulse(energyPosition, 0.48, 0.54, 0.54, 0.66);
  const rebound = pulse(energyPosition, 0.565, 0.605, 0.605, 0.69);
  const receiver = smoothstep(energyPosition, 0.49, 0.57);
  const recoil = impact - rebound * 0.18;
  const alignment = smoothstep(coherence, 0.12, 1);
  const preload = smoothstep(energyPosition, 0.25, 0.54);
  const rawTension = anticipation * 0.32
    + preload * 0.58
    + Math.max(0, recoil) * 0.38
    + receiver * 0.08
    + propagation * 0.18;
  target.energyPosition = energyPosition;
  target.anticipation = anticipation;
  target.impact = impact;
  target.receiver = receiver;
  target.recoil = recoil;
  target.bearingCompression = receiver * 0.24 + Math.max(0, recoil) * 0.78;
  target.ringTwist = receiver * 0.72 + impact * 0.38 - rebound * 0.15;
  target.conduitTension = Math.max(0, Math.min(
    1.08,
    rawTension * (1 - alignment * 0.72) + alignment * 0.18,
  ));
  target.collars[0] = overshootStep(propagation, 0.02, 0.42);
  target.collars[1] = overshootStep(propagation, 0.28, 0.72);
  target.collars[2] = overshootStep(propagation, 0.58, 0.92);
  target.latches[0] = overshootStep(propagation, 0.12, 0.42);
  target.latches[1] = overshootStep(propagation, 0.4, 0.72);
  target.latches[2] = overshootStep(propagation, 0.7, 1);
  target.turbulence = Math.max(
    0,
    (0.18 + anticipation * 0.5 + Math.abs(recoil) * 0.32) * (1 - alignment),
  );
  target.alignment = alignment;
  target.upstreamCharge = 1 - smoothstep(energyPosition, 0.1, 0.66);
  target.downstreamCharge = smoothstep(energyPosition, 0.49, 1) * (0.25 + propagation * 0.75);
  target.invalidRetraction = smoothstep(propagation, 0.06, 0.48);
  target.protectedRedirect = smoothstep(propagation, 0.18, 0.82);
  return target;
}

/** Pure snapshot helper for tests and deterministic review tooling. */
export function deriveWaleAssemblyState(progress: number): WaleMasterAssemblyState {
  return sampleWaleAssemblyState(progress, {
    energyPosition: 0,
    anticipation: 0,
    impact: 0,
    receiver: 0,
    recoil: 0,
    bearingCompression: 0,
    ringTwist: 0,
    conduitTension: 0,
    collars: [0, 0, 0],
    latches: [0, 0, 0],
    turbulence: 0,
    alignment: 0,
    upstreamCharge: 0,
    downstreamCharge: 0,
    invalidRetraction: 0,
    protectedRedirect: 0,
  });
}
