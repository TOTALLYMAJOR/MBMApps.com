import { describe, expect, it } from "vitest";
import {
  deriveWaleAssemblyState,
  WALE_MANUFACTURING_DETAIL_KINDS,
  WALE_MASTER_MANUFACTURING_COUNTS,
  WALE_MASTER_MANUFACTURING_RECIPE,
} from "./wale-master-assembly";

describe("Wale master manufacturing recipe", () => {
  it("defines the complete deterministic heavy-master detail budget", () => {
    expect(WALE_MASTER_MANUFACTURING_COUNTS).toEqual({
      "beveled-collar": 3,
      "recessed-fastener": 24,
      "split-line-band": 8,
      spacer: 12,
      "strain-relief": 6,
      "knurl-rib": 36,
      vent: 18,
      "connector-housing": 7,
    });
    expect(WALE_MASTER_MANUFACTURING_RECIPE).toHaveLength(114);
    expect(Object.keys(WALE_MASTER_MANUFACTURING_COUNTS)).toEqual([
      ...WALE_MANUFACTURING_DETAIL_KINDS,
    ]);
  });

  it("keeps every recipe entry uniquely addressable and deeply immutable", () => {
    const ids = WALE_MASTER_MANUFACTURING_RECIPE.map((detail) => detail.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(Object.isFrozen(WALE_MASTER_MANUFACTURING_RECIPE)).toBe(true);
    expect(Object.isFrozen(WALE_MASTER_MANUFACTURING_COUNTS)).toBe(true);
    for (const detail of WALE_MASTER_MANUFACTURING_RECIPE) {
      expect(Object.isFrozen(detail)).toBe(true);
      expect(Object.isFrozen(detail.position)).toBe(true);
      expect(Object.isFrozen(detail.rotation)).toBe(true);
      expect(Object.isFrozen(detail.scale)).toBe(true);
      expect(detail.scale.every((dimension) => dimension > 0)).toBe(true);
    }
  });

  it("pairs each conduit socket with one explicit connector housing", () => {
    const connectors = WALE_MASTER_MANUFACTURING_RECIPE.filter(
      (detail) => detail.kind === "connector-housing",
    );

    expect(connectors.map((detail) => detail.anchor)).toEqual([
      "inbound-socket-0",
      "inbound-socket-1",
      "inbound-socket-2",
      "outbound-socket-0",
      "outbound-socket-1",
      "outbound-socket-2",
      "outbound-socket-3",
    ]);
  });

  it("builds repeatable twelve-rib knurl bands around all three module pods", () => {
    const knurls = WALE_MASTER_MANUFACTURING_RECIPE.filter(
      (detail) => detail.kind === "knurl-rib",
    );

    for (let moduleIndex = 0; moduleIndex < 3; moduleIndex++) {
      const moduleKnurls = knurls.filter((detail) => detail.anchor === `module-pod-${moduleIndex}`);
      expect(moduleKnurls).toHaveLength(12);
      expect(moduleKnurls.every((detail) => Math.abs(Math.hypot(
        detail.position[0],
        detail.position[1],
      ) - 0.228) < 1e-12)).toBe(true);
    }
  });

  it("uses metal-elastomer-metal spacer stacks for each outbound connector", () => {
    const spacers = WALE_MASTER_MANUFACTURING_RECIPE.filter(
      (detail) => detail.kind === "spacer",
    );

    for (let socketIndex = 0; socketIndex < 4; socketIndex++) {
      const stack = spacers.filter((detail) => detail.anchor === `outbound-socket-${socketIndex}`);
      expect(stack.map((detail) => detail.material)).toEqual([
        "machined-silver",
        "elastomer",
        "machined-silver",
      ]);
      expect(stack.map((detail) => detail.position[1])).toEqual([-0.078, 0, 0.078]);
    }
  });
});

describe("Wale master assembly state", () => {
  it("keeps latent hardware unloaded around a charged source", () => {
    expect(deriveWaleAssemblyState(0)).toEqual({
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
      turbulence: expect.any(Number),
      alignment: 0,
      upstreamCharge: 1,
      downstreamCharge: 0,
      invalidRetraction: 0,
      protectedRedirect: 0,
    });
    expect(deriveWaleAssemblyState(0).turbulence).toBeGreaterThan(0);
  });

  it("preloads the conduit before impact without prematurely closing hardware", () => {
    const ascent = deriveWaleAssemblyState(2);

    expect(ascent.anticipation).toBeGreaterThan(0.8);
    expect(ascent.recoil).toBe(0);
    expect(ascent.conduitTension).toBeGreaterThan(0.6);
    expect(ascent.collars).toEqual([0, 0, 0]);
    expect(ascent.latches).toEqual([0, 0, 0]);
  });

  it("turns arrival into mechanical impact before any downstream latch closes", () => {
    const arrival = deriveWaleAssemblyState(3);

    expect(arrival.energyPosition).toBe(0.57);
    expect(arrival.anticipation).toBeLessThan(0.1);
    expect(arrival.receiver).toBe(1);
    expect(arrival.recoil).toBeGreaterThan(0.8);
    expect(arrival.bearingCompression).toBeGreaterThan(0.8);
    expect(arrival.conduitTension).toBeGreaterThan(0.9);
    expect(arrival.collars).toEqual([0, 0, 0]);
    expect(arrival.latches).toEqual([0, 0, 0]);
    expect(arrival.upstreamCharge).toBeLessThan(0.1);
    expect(arrival.downstreamCharge).toBeGreaterThan(0);
  });

  it("drains upstream energy while latches close in sequence", () => {
    const earlyPropagation = deriveWaleAssemblyState(3.35);
    const latePropagation = deriveWaleAssemblyState(4);

    expect(earlyPropagation.latches[0]).toBeGreaterThan(0);
    expect(earlyPropagation.latches[1]).toBe(0);
    expect(earlyPropagation.latches[2]).toBe(0);
    expect(earlyPropagation.collars[0]).toBeGreaterThan(earlyPropagation.latches[0]);
    expect(earlyPropagation.collars[1]).toBe(0);
    expect(latePropagation.latches[0]).toBe(1);
    expect(latePropagation.latches[1]).toBe(1);
    expect(latePropagation.latches[2]).toBeGreaterThan(0);
    expect(latePropagation.collars[2]).toBeGreaterThan(latePropagation.latches[2]);
    expect(latePropagation.downstreamCharge).toBeGreaterThan(earlyPropagation.downstreamCharge);
    expect(latePropagation.upstreamCharge).toBeLessThan(earlyPropagation.upstreamCharge);
    expect(latePropagation.invalidRetraction).toBeGreaterThan(0.75);
    expect(latePropagation.protectedRedirect).toBeGreaterThan(0.15);
  });

  it("settles overshoot and turbulence into a quiet aligned coherent state", () => {
    const coherence = deriveWaleAssemblyState(5);

    expect(coherence.energyPosition).toBe(1);
    expect(coherence.recoil).toBe(0);
    expect(coherence.bearingCompression).toBeLessThan(0.35);
    expect(coherence.ringTwist).toBeGreaterThan(0.65);
    expect(coherence.conduitTension).toBeLessThan(0.5);
    expect(coherence.collars).toEqual([1, 1, 1]);
    expect(coherence.latches).toEqual([1, 1, 1]);
    expect(coherence.turbulence).toBe(0);
    expect(coherence.alignment).toBe(1);
    expect(coherence.upstreamCharge).toBe(0);
    expect(coherence.downstreamCharge).toBe(1);
    expect(coherence.invalidRetraction).toBe(1);
    expect(coherence.protectedRedirect).toBe(1);
  });

  it("adds a bounded inertial overshoot to each sequential mechanical latch", () => {
    const first = deriveWaleAssemblyState(3.35);
    const second = deriveWaleAssemblyState(3.8);
    const third = deriveWaleAssemblyState(4.35);

    expect(first.collars[0]).toBeGreaterThan(1);
    expect(first.collars[1]).toBe(0);
    expect(second.latches[0]).toBeGreaterThanOrEqual(1);
    expect(second.collars[1]).toBeGreaterThan(1);
    expect(third.collars[2]).toBeGreaterThan(1);
    expect(Math.max(...first.collars, ...second.collars, ...third.collars)).toBeLessThan(1.12);
  });
});
