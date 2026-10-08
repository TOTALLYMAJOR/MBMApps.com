export type WaleMasterLookInput = Readonly<{
  search: string;
  environment: string;
  narrow: boolean;
  adaptiveQuality: number;
  devicePixelRatio: number;
  maxInstances: number;
}>;

export type WaleMasterLook = Readonly<{
  enabled: boolean;
  instanceCount: number;
  pixelRatio: number;
  qualityTier: "master" | "mobile" | "high" | "balanced" | "low";
  shadowMapSize: 2048 | 1024 | 512;
}>;

export type WaleSurfaceProfile = "nickel" | "silver" | "elastomer" | "glass" | "energy";

export type WaleSurfaceMapData = Readonly<{
  size: number;
  color: Uint8Array;
  roughness: Uint8Array;
  normal: Uint8Array;
}>;

const TAU = Math.PI * 2;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function toByte(value: number) {
  return Math.round(clamp01(value) * 255);
}

function hash2d(x: number, y: number, seed: number) {
  let state = Math.imul(x + 0x9e3779b9, 0x85ebca6b)
    ^ Math.imul(y + 0x7f4a7c15, 0xc2b2ae35)
    ^ seed;
  state = Math.imul(state ^ (state >>> 16), 0x7feb352d);
  state = Math.imul(state ^ (state >>> 15), 0x846ca68b);
  return ((state ^ (state >>> 16)) >>> 0) / 4294967295;
}

/**
 * Produces repeatable manufacturing response maps. Roughness values
 * carry the physical range directly; the normal map is derived from a separate
 * height field so surface color never doubles as relief.
 */
export function createWaleSurfaceMapData(
  size: number,
  seed: number,
  profile: WaleSurfaceProfile,
): WaleSurfaceMapData {
  const dimension = Math.max(4, Math.trunc(size));
  const color = new Uint8Array(dimension * dimension * 4);
  const roughness = new Uint8Array(dimension * dimension * 4);
  const normal = new Uint8Array(dimension * dimension * 4);
  const height = new Float32Array(dimension * dimension);
  const phase = hash2d(seed & 0xffff, seed >>> 16, seed) * TAU;

  for (let y = 0; y < dimension; y++) {
    const v = y / dimension;
    for (let x = 0; x < dimension; x++) {
      const u = x / dimension;
      const grain = hash2d(x, y, seed) - 0.5;
      const macro = Math.sin(TAU * (u * 3 + v * 2) + phase)
        * Math.sin(TAU * (u * 2 - v * 5) - phase * 0.37);
      const index = y * dimension + x;
      let relief = 0.5;
      let response = 0.5;
      let red = 0.8;
      let green = 0.84;
      let blue = 0.9;

      if (profile === "nickel") {
        const brush = Math.sin(TAU * v * 31 + macro * 1.8);
        const hairline = hash2d(Math.floor(x / 3), y, seed ^ 0x521a) > 0.994 ? 1 : 0;
        relief = 0.5 + brush * 0.055 + macro * 0.04 + grain * 0.025 + hairline * 0.12;
        response = 0.31 + Math.abs(brush) * 0.08 + (macro + 1) * 0.035 + hairline * 0.11;
        red = 0.72 + macro * 0.025 + grain * 0.018;
        green = 0.76 + macro * 0.03 + grain * 0.018;
        blue = 0.82 + macro * 0.035 + grain * 0.018;
      } else if (profile === "silver") {
        const toolPass = Math.sin(TAU * u * 37 + macro * 1.15);
        const scoring = hash2d(x, Math.floor(y / 4), seed ^ 0xa6d9) > 0.996 ? 1 : 0;
        relief = 0.5 + toolPass * 0.042 + macro * 0.025 + grain * 0.018 + scoring * 0.1;
        response = 0.2 + Math.abs(toolPass) * 0.075 + (macro + 1) * 0.025 + scoring * 0.12;
        red = 0.86 + macro * 0.02 + grain * 0.014;
        green = 0.9 + macro * 0.022 + grain * 0.014;
        blue = 0.96 + macro * 0.018 + grain * 0.012;
      } else if (profile === "elastomer") {
        const pebble = Math.sin(TAU * (u * 41 + v * 23) + phase)
          * Math.sin(TAU * (u * 17 - v * 47) - phase * 0.4);
        const pore = hash2d(x, y, seed ^ 0x37c1) > 0.985 ? -1 : 0;
        relief = 0.5 + pebble * 0.085 + macro * 0.025 + grain * 0.04 + pore * 0.15;
        response = 0.78 + Math.abs(pebble) * 0.12 + grain * 0.035 - pore * 0.035;
        red = 0.69 + macro * 0.015 + grain * 0.018;
        green = 0.72 + macro * 0.016 + grain * 0.018;
        blue = 0.77 + macro * 0.02 + grain * 0.018;
      } else if (profile === "glass") {
        const draw = Math.sin(TAU * (u * 3 + v * 7) + phase)
          + Math.sin(TAU * (u * 7 - v * 4) - phase * 0.61);
        const fleck = hash2d(x, y, seed ^ 0x9c31) > 0.998 ? 1 : 0;
        relief = 0.5 + draw * 0.018 + grain * 0.008 + fleck * 0.045;
        response = 0.075 + Math.abs(draw) * 0.018 + Math.abs(grain) * 0.014 + fleck * 0.06;
        red = 0.76 + macro * 0.018;
        green = 0.84 + macro * 0.02;
        blue = 0.96 + macro * 0.018;
      } else {
        const striation = Math.abs(Math.sin(TAU * (u * 5 + v * 19) + macro * 2.2 + phase));
        const inclusion = hash2d(x, y, seed ^ 0xe91f) > 0.993 ? 1 : 0;
        relief = 0.48 + striation * 0.075 + macro * 0.035 + grain * 0.02 + inclusion * 0.12;
        response = 0.055 + (1 - striation) * 0.08 + Math.abs(macro) * 0.035 + inclusion * 0.06;
        red = 0.52 + striation * 0.13;
        green = 0.68 + striation * 0.16;
        blue = 0.98;
      }

      height[index] = clamp01(relief);
      const offset = index * 4;
      color[offset] = toByte(red);
      color[offset + 1] = toByte(green);
      color[offset + 2] = toByte(blue);
      color[offset + 3] = 255;
      const roughnessByte = toByte(response);
      roughness[offset] = roughnessByte;
      roughness[offset + 1] = roughnessByte;
      roughness[offset + 2] = roughnessByte;
      roughness[offset + 3] = 255;
    }
  }

  const normalStrength = profile === "elastomer" ? 5.2
    : profile === "nickel" ? 3.6
      : profile === "silver" ? 2.9
        : profile === "energy" ? 3.4
          : 1.8;
  for (let y = 0; y < dimension; y++) {
    const up = ((y - 1 + dimension) % dimension) * dimension;
    const down = ((y + 1) % dimension) * dimension;
    for (let x = 0; x < dimension; x++) {
      const left = (x - 1 + dimension) % dimension;
      const right = (x + 1) % dimension;
      const dx = (height[y * dimension + right]! - height[y * dimension + left]!) * normalStrength;
      const dy = (height[down + x]! - height[up + x]!) * normalStrength;
      const inverseLength = 1 / Math.sqrt(dx * dx + dy * dy + 1);
      const offset = (y * dimension + x) * 4;
      normal[offset] = toByte(-dx * inverseLength * 0.5 + 0.5);
      normal[offset + 1] = toByte(-dy * inverseLength * 0.5 + 0.5);
      normal[offset + 2] = toByte(inverseLength * 0.5 + 0.5);
      normal[offset + 3] = 255;
    }
  }

  return { size: dimension, color, roughness, normal };
}

export function resolveWaleMasterLook(input: WaleMasterLookInput): WaleMasterLook {
  const quality = Math.max(0, Math.min(2, Math.trunc(input.adaptiveQuality)));
  const enabled = input.environment !== "production"
    && new URLSearchParams(input.search).get("master") === "1";

  if (enabled) {
    return {
      enabled: true,
      instanceCount: input.maxInstances,
      pixelRatio: Math.min(Math.max(1, input.devicePixelRatio || 1), 2),
      qualityTier: "master",
      shadowMapSize: 2048,
    };
  }

  const budget = Math.min(input.maxInstances, input.narrow ? 10000 : 24000);
  const multiplier = quality === 0 ? 1 : quality === 1 ? 0.67 : 0.4;
  const dprCap = quality === 0 ? (input.narrow ? 1.5 : 1.75) : quality === 1 ? 1.25 : 1;

  return {
    enabled: false,
    instanceCount: Math.round(budget * multiplier),
    pixelRatio: Math.min(Math.max(1, input.devicePixelRatio || 1), dprCap),
    qualityTier: quality === 0 ? (input.narrow ? "mobile" : "high") : quality === 1 ? "balanced" : "low",
    shadowMapSize: quality === 0 ? 2048 : quality === 1 ? 1024 : 512,
  };
}
