import { describe, expect, it } from "vitest";
import { createWaleSurfaceMapData, resolveWaleMasterLook } from "./wale-master-look";

function averageRed(data: Uint8Array) {
  let total = 0;
  for (let index = 0; index < data.length; index += 4) total += data[index]!;
  return total / (data.length / 4);
}

describe("Wale master look profile", () => {
  it("pins maximum review quality despite a narrow viewport and degraded adaptive tier", () => {
    expect(resolveWaleMasterLook({
      search: "?master=1&progress=2.5",
      environment: "development",
      narrow: true,
      adaptiveQuality: 2,
      devicePixelRatio: 3,
      maxInstances: 24000,
    })).toEqual({
      enabled: true,
      instanceCount: 24000,
      pixelRatio: 2,
      qualityTier: "master",
      shadowMapSize: 2048,
    });
  });

  it("preserves the existing adaptive budget when the master profile is absent", () => {
    expect(resolveWaleMasterLook({
      search: "?progress=3.5",
      environment: "development",
      narrow: false,
      adaptiveQuality: 2,
      devicePixelRatio: 3,
      maxInstances: 24000,
    })).toEqual({
      enabled: false,
      instanceCount: 9600,
      pixelRatio: 1,
      qualityTier: "low",
      shadowMapSize: 512,
    });
  });

  it("ignores the development-only profile in production", () => {
    expect(resolveWaleMasterLook({
      search: "?master=1",
      environment: "production",
      narrow: true,
      adaptiveQuality: 1,
      devicePixelRatio: 2,
      maxInstances: 10000,
    })).toEqual({
      enabled: false,
      instanceCount: 6700,
      pixelRatio: 1.25,
      qualityTier: "balanced",
      shadowMapSize: 1024,
    });
  });

  it("builds deterministic, independently varied surface maps", () => {
    const first = createWaleSurfaceMapData(16, 74021, "nickel");
    const repeated = createWaleSurfaceMapData(16, 74021, "nickel");
    const alternate = createWaleSurfaceMapData(16, 74022, "nickel");

    expect(first.size).toBe(16);
    expect(first.color).toEqual(repeated.color);
    expect(first.roughness).toEqual(repeated.roughness);
    expect(first.normal).toEqual(repeated.normal);
    expect(first.color).not.toEqual(alternate.color);
    expect(first.roughness).not.toEqual(first.color);
    expect(new Set(Array.from(first.normal))).not.toEqual(new Set([128, 255]));
  });

  it("keeps dielectric glass smooth and elastomer visibly rough", () => {
    const glass = createWaleSurfaceMapData(24, 42737, "glass");
    const silver = createWaleSurfaceMapData(24, 11939, "silver");
    const nickel = createWaleSurfaceMapData(24, 74021, "nickel");
    const elastomer = createWaleSurfaceMapData(24, 83003, "elastomer");

    expect(averageRed(glass.roughness)).toBeLessThan(averageRed(silver.roughness));
    expect(averageRed(silver.roughness)).toBeLessThan(averageRed(nickel.roughness));
    expect(averageRed(nickel.roughness)).toBeLessThan(averageRed(elastomer.roughness));
    for (let index = 3; index < elastomer.normal.length; index += 4) {
      expect(elastomer.normal[index]).toBe(255);
    }
  });
});
