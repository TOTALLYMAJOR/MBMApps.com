"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { advanceGoldSweep, type GoldSweep } from "../lib/wale-gold-sweep";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {
  WALE_MASTER_MANUFACTURING_RECIPE,
  sampleWaleAssemblyState,
  type WaleMasterAssemblyState,
} from "../lib/wale-master-assembly";
import {
  createSignalGeometry,
  getWaleScenePhase,
  getWaleSceneState,
  isWaleSceneStateName,
  type WaleSceneStateName,
} from "../lib/wale-signal-geometry";
import {
  createWaleSurfaceMapData,
  resolveWaleMasterLook,
  type WaleSurfaceProfile,
} from "../lib/wale-master-look";

export type WaleSignalStatus = "loading" | "ready" | "fallback";

export type WaleSignalFieldProps = {
  progress: number;
  paused?: boolean;
  reducedMotion?: boolean;
  onStatus?: (status: WaleSignalStatus) => void;
};

type WaleModuleStates = Readonly<{
  receiver: number;
  module1: number;
  module2: number;
  module3: number;
  invalidRetraction: number;
  protectedRedirect: number;
}>;

export type WaleSceneSnapshot = Readonly<{
  phase: WaleSceneStateName;
  progress: number;
  energyPosition: number;
  moduleStates: WaleModuleStates;
  qualityTier: string;
  fps: number;
  drawCalls: number;
  triangles: number;
  master: boolean;
  reducedMotion: boolean;
  paused: boolean;
}>;

declare global {
  interface Window {
    __WALE_SCENE__?: WaleSceneSnapshot;
  }
}

type WaleSurfaceTextureSet = Readonly<{
  color: THREE.DataTexture;
  roughness: THREE.DataTexture;
  normal: THREE.DataTexture;
}>;

function createSurfaceTextureSet(
  size: number,
  seed: number,
  profile: WaleSurfaceProfile,
): WaleSurfaceTextureSet {
  const maps = createWaleSurfaceMapData(size, seed, profile);
  const create = (data: Uint8Array, colorSpace: THREE.ColorSpace) => {
    const texture = new THREE.DataTexture(data, maps.size, maps.size, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.colorSpace = colorSpace;
    texture.needsUpdate = true;
    return texture;
  };
  const repeat = profile === "nickel" ? new THREE.Vector2(7, 2)
    : profile === "silver" ? new THREE.Vector2(2, 9)
      : profile === "elastomer" ? new THREE.Vector2(6, 6)
        : profile === "energy" ? new THREE.Vector2(3, 10)
          : new THREE.Vector2(3, 6);
  const color = create(maps.color, THREE.SRGBColorSpace);
  const roughness = create(maps.roughness, THREE.NoColorSpace);
  const normal = create(maps.normal, THREE.NoColorSpace);
  color.repeat.copy(repeat);
  roughness.repeat.copy(repeat);
  normal.repeat.copy(repeat);
  return { color, roughness, normal };
}

const morphShader = /* glsl */ `
  attribute vec3 target0;
  attribute vec3 target1;
  attribute vec3 target2;
  attribute vec3 target3;
  attribute vec3 target4;
  attribute vec3 target5;
  attribute vec4 seed;
  uniform float progress;
  uniform float time;
  uniform float motion;
  uniform float pressureMotion;
  uniform vec2 pointer;
  vec3 fieldPosition() {
    float p = clamp(progress, 0.0, 5.0);
    vec3 a = target0;
    vec3 b = target1;
    if (p >= 1.0) { a = target1; b = target2; }
    if (p >= 2.0) { a = target2; b = target3; }
    if (p >= 3.0) { a = target3; b = target4; }
    if (p >= 4.0) { a = target4; b = target5; }
    float blend = smoothstep(0.0, 1.0, min(p - floor(p), 1.0));
    if (p >= 5.0) blend = 1.0;
    vec3 center = mix(a, b, blend);
    float dormant = 1.0 - smoothstep(0.25, 1.1, p);
    float coherence = smoothstep(4.0, 5.0, p);
    float independentMotion = 1.0 - coherence * 0.96;
    center += motion * independentMotion * vec3(
      sin(time * 0.31 + seed.x * 30.0) * 0.035,
      cos(time * 0.23 + seed.y * 24.0) * 0.035,
      sin(time * 0.19 + seed.z * 28.0) * 0.05
    );
    float radialLength = max(length(center.xy), 0.001);
    vec2 radial = center.xy / radialLength;
    vec2 tangent = vec2(-radial.y, radial.x);
    float dormantPhase = time * (0.38 + seed.w * 0.22) + seed.x * 6.283185;
    float dormantReach = 0.018 + seed.z * 0.034;
    center.xy += motion * dormant * tangent * sin(dormantPhase) * dormantReach;
    center.xy += motion * dormant * radial
      * cos(dormantPhase * 0.71 + seed.y * 6.283185) * dormantReach * 0.36;
    center.z += motion * dormant
      * sin(time * (0.27 + seed.x * 0.18) + seed.w * 6.283185)
      * (0.028 + seed.y * 0.032);
    // A pressure wave travels out beneath both the opening and final fields. Each fragment
    // lifts and fans outward only after arrival, then settles before the next pulse.
    float groundDistance = length(vec3(center.x, (center.y + 3.0) * 0.55, center.z));
    float pulseAge = mod(time, 8.0) - 0.65 * groundDistance;
    float pulse = smoothstep(0.0, 0.3, pulseAge)
      * (1.0 - smoothstep(0.85, 3.1, pulseAge));
    float groundReach = 1.0 - smoothstep(-2.5, -0.35, center.y);
    float pressureStage = max(dormant, smoothstep(4.1, 4.95, p));
    float pressure = pulse * groundReach * pressureStage * pressureMotion
      * (0.72 + seed.y * 0.28);
    vec2 away = normalize(center.xz + vec2(0.001, 0.001));
    center.xz += away * pressure * 0.72;
    center.y += pressure * 0.55;
    float coordinatedWave = sin(time * 0.52 - seed.w * 6.283185 + radialLength * 0.7);
    center.xy += motion * coherence * (center.xy / radialLength) * coordinatedWave * 0.008;
    float influence = exp(-length(center.xy - pointer * 2.4) * 1.2);
    center.xy += pointer * influence * 0.12 * motion;
    return center;
  }
`;

const vertexShader = /* glsl */ `
  ${morphShader}
  attribute float particleSize;
  uniform float glowScale;
  varying float vArcAngle;
  varying float vArcCrust;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec4 vSeed;
  varying float vMotionLight;
  void main() {
    float dormant = 1.0 - smoothstep(0.25, 1.1, progress);
    float spin = time * (0.09 + seed.w * 0.2) * motion * (0.35 + dormant * 0.65);
    float yaw = seed.x * 6.283185 + spin;
    float pitch = (seed.y - 0.5) * 2.2 + spin * 0.57;
    float roll = seed.z * 6.283185 - spin * 0.73;
    float cy = cos(yaw);
    float sy = sin(yaw);
    float cx = cos(pitch);
    float sx = sin(pitch);
    float cz = cos(roll);
    float sz = sin(roll);
    mat3 rotateY = mat3(cy, 0.0, sy, 0.0, 1.0, 0.0, -sy, 0.0, cy);
    mat3 rotateX = mat3(1.0, 0.0, 0.0, 0.0, cx, -sx, 0.0, sx, cx);
    mat3 rotateZ = mat3(cz, -sz, 0.0, sz, cz, 0.0, 0.0, 0.0, 1.0);
    mat3 rotation = rotateZ * rotateY * rotateX;
    vec3 granuleScale = vec3(
      0.78 + seed.x * 0.44,
      0.8 + seed.z * 0.38,
      0.82 + seed.y * 0.36
    );
    vec3 granule = rotation * (position * granuleScale) * particleSize * glowScale;
    vec4 view = modelViewMatrix * vec4(fieldPosition() + granule, 1.0);
    vNormal = normalize(normalMatrix * rotation * (normal / granuleScale));
    vView = normalize(-view.xyz);
    vSeed = seed;
    vArcAngle = mod(atan(target5.x / 2.8, target5.y / 2.2) + 6.283185, 6.283185);
    vArcCrust = smoothstep(1.25, 1.32, length(target5.xy / vec2(2.8, 2.2)));
    vMotionLight = motion * dormant
      * (0.45 + 0.55 * (0.5 + 0.5 * sin(time * (0.72 + seed.w * 0.4) + seed.x * 6.283185)));
    gl_Position = projectionMatrix * view;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float goldHead;
  uniform float goldStrength;
  uniform float goldWarm;
  varying float vArcAngle;
  varying float vArcCrust;
  uniform float time;
  uniform float motion;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec4 vSeed;
  varying float vMotionLight;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 keyLight = normalize(vec3(-0.72, 0.9, 1.25));
    vec3 sideLight = normalize(vec3(0.82, 0.18, 0.48));
    vec3 movingLight = normalize(vec3(cos(time * 0.34), 0.42, 0.72 + sin(time * 0.34)));
    float keyDiffuse = max(dot(n, keyLight), 0.0);
    float sideDiffuse = max(dot(n, sideLight), 0.0);
    float movingDiffuse = max(dot(n, movingLight), 0.0) * vMotionLight;
    float lowerBounce = max(dot(n, normalize(vec3(-0.18, -0.72, 0.42))), 0.0);
    float rim = pow(1.0 - abs(dot(n, vView)), 2.4);
    float gloss = mix(28.0, 88.0, vSeed.z);
    float specular = pow(max(dot(n, normalize(keyLight + vView)), 0.0), gloss);
    float softReflection = pow(max(dot(n, normalize(keyLight + vView)), 0.0), 8.0);
    float movingSpecular = pow(max(dot(n, normalize(movingLight + vView)), 0.0), gloss)
      * vMotionLight;
      // Near-white lit faces echo the headline; directional shade retains relief.
      vec3 silver = vec3(0.94, 0.96, 0.98);
      vec3 coolSteel = vec3(0.65, 0.72, 0.8);
      vec3 base = mix(silver, coolSteel, vSeed.z * 0.3);
      base *= 0.96 + (vSeed.x - 0.5) * 0.08;
      vec3 color = base * (0.42 + keyDiffuse * 1.8 + sideDiffuse * 0.55 + lowerBounce * 0.24);
    color += vec3(0.17, 0.3, 0.52) * sideDiffuse * 0.12;
    color += vec3(0.32, 0.48, 0.78) * movingDiffuse * 0.055;
    color += base * rim * sideDiffuse * 0.14;
      color += vec3(0.9, 0.94, 0.98) * softReflection * 0.28;
    color += vec3(0.9, 0.94, 0.98) * specular * 1.4;
    color += vec3(0.75, 0.88, 1.0) * movingSpecular * 0.82;
    gl_FragColor = vec4(color, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      // Display-space white is the HTML ink token (#f1f2f4), not clipped pure white.
      gl_FragColor.rgb = min(gl_FragColor.rgb * 1.18, vec3(241.0, 242.0, 244.0) / 255.0);
      float behind = goldHead - vArcAngle;
      float arrived = step(0.0, behind);
      float trail = exp(-max(behind, 0.0) * 1.4) * arrived * goldStrength * vArcCrust;
      float leading = exp(-pow(behind / 0.14, 2.0)) * arrived * goldStrength * vArcCrust;
      float glint = pow(max(dot(n, vView), 0.0), 10.0);
      vec3 cobalt = mix(vec3(0.02, 0.20, 1.0), vec3(0.38, 0.68, 1.0),
        clamp(keyDiffuse + glint * 0.5, 0.0, 1.0));
      gl_FragColor.rgb = mix(gl_FragColor.rgb, cobalt, max(trail, goldWarm * vArcCrust));
      gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.56, 0.8, 1.0),
        leading * (0.65 + glint * 0.35));
  }
`;

// Optical spill from the same outer-crust particles, not a second population.
const coronaShader = /* glsl */ `
  uniform float goldHead;
  uniform float goldStrength;
  uniform float goldWarm;
  varying float vArcAngle;
  varying float vArcCrust;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float behind = goldHead - vArcAngle;
    float trail = step(0.0, behind) * exp(-max(behind, 0.0) * 1.4) * goldStrength;
    float energy = max(trail, goldWarm) * vArcCrust;
    if (energy < 0.005) discard;
    float falloff = pow(max(dot(normalize(vNormal), normalize(vView)), 0.0), 3.0);
    // Tenfold radiance, not tenfold screen luminance (display highlights clip).
    gl_FragColor = vec4(vec3(0.008, 0.06, 1.0) * 10.0, falloff * energy * 0.65);
  }
`;

export function WaleSignalField({ progress, paused = false, reducedMotion = false, onStatus }: WaleSignalFieldProps) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef({ progress, paused, reducedMotion, onStatus });
  const wake = useRef<(() => void) | null>(null);
  controls.current = { progress, paused, reducedMotion, onStatus };

  useEffect(() => { wake.current?.(); }, [progress, paused, reducedMotion]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let lost = false;
    let frame = 0;
    let renderer: THREE.WebGLRenderer | undefined;
    let composer: EffectComposer | undefined;
    let renderPass: RenderPass | undefined;
    let bloomPass: UnrealBloomPass | undefined;
    let outputPass: OutputPass | undefined;
    let environmentTexture: THREE.Texture | undefined;
    let environmentTarget: THREE.WebGLRenderTarget | undefined;
    let geometry: THREE.InstancedBufferGeometry | undefined;
    let material: THREE.ShaderMaterial | undefined;
    let coronaMaterial: THREE.ShaderMaterial | undefined;
    let connectionGeometry: THREE.BufferGeometry | undefined;
    let connectionMaterial: THREE.ShaderMaterial | undefined;
    const mechanismGeometries: THREE.BufferGeometry[] = [];
    const mechanismMaterials: THREE.Material[] = [];
    const mechanismTextures: THREE.Texture[] = [];
    const mechanismInstances: THREE.InstancedMesh[] = [];
    let observer: ResizeObserver | undefined;
    let debugGetter: (() => WaleSceneSnapshot) | undefined;
    let status: WaleSignalStatus = "loading";
    const report = (next: WaleSignalStatus) => {
      element.dataset.sceneStatus = next;
      if (status !== next || next === "loading") {
        status = next;
        controls.current.onStatus?.(next);
      }
    };
    report("loading");

    const disposeScene = () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      geometry?.dispose();
      material?.dispose();
      coronaMaterial?.dispose();
      connectionGeometry?.dispose();
      connectionMaterial?.dispose();
      mechanismInstances.forEach((instance) => instance.dispose());
      mechanismGeometries.forEach((resource) => resource.dispose());
      mechanismMaterials.forEach((resource) => resource.dispose());
      mechanismTextures.forEach((resource) => resource.dispose());
      environmentTarget?.dispose();
      renderPass?.dispose();
      bloomPass?.dispose();
      outputPass?.dispose();
      composer?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
      if (debugGetter && Object.getOwnPropertyDescriptor(window, "__WALE_SCENE__")?.get === debugGetter) {
        delete window.__WALE_SCENE__;
      }
    };

    try {
      const mobile = element.clientWidth < 768;
      const developmentParams = process.env.NODE_ENV !== "production"
        ? new URLSearchParams(window.location.search)
        : undefined;
      const requestedState = developmentParams?.get("state") ?? null;
      const forcedState = isWaleSceneStateName(requestedState) ? getWaleSceneState(requestedState) : undefined;
      const requestedProgressValue = developmentParams?.get("progress");
      const requestedProgress = requestedProgressValue === null || requestedProgressValue === undefined
        ? undefined
        : Number(requestedProgressValue);
      const forcedProgress = forcedState?.progress ?? (Number.isFinite(requestedProgress)
        ? Math.max(0, Math.min(5, requestedProgress!))
        : undefined);
      const maxParticleCount = mobile ? 10000 : 24000;
      const initialLook = resolveWaleMasterLook({
        search: developmentParams ? window.location.search : "",
        environment: process.env.NODE_ENV,
        narrow: mobile,
        adaptiveQuality: 0,
        devicePixelRatio: window.devicePixelRatio || 1,
        maxInstances: maxParticleCount,
      });
      const count = maxParticleCount;
      const data = createSignalGeometry(count);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
      const engine = renderer;
      engine.setPixelRatio(initialLook.pixelRatio);
      engine.setClearColor(0x000000, 0);
      engine.outputColorSpace = THREE.SRGBColorSpace;
      engine.toneMapping = THREE.AgXToneMapping;
      engine.toneMappingExposure = 0.96;
      engine.shadowMap.enabled = true;
      engine.shadowMap.type = THREE.PCFSoftShadowMap;
      engine.info.autoReset = false;
      engine.debug.onShaderError = () => { throw new Error("Signal shader could not compile"); };
      const canvas = engine.domElement;
      canvas.style.cssText = "display:block;width:100%;height:100%;pointer-events:none";
      canvas.setAttribute("aria-hidden", "true");
      element.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 40);
      camera.position.set(0, 0, 9.2);
      scene.add(camera);
      const rebuildEnvironment = () => {
        environmentTarget?.dispose();
        const roomEnvironment = new RoomEnvironment();
        const pmremGenerator = new THREE.PMREMGenerator(engine);
        environmentTarget = pmremGenerator.fromScene(roomEnvironment, 0.04);
        environmentTexture = environmentTarget.texture;
        scene.environment = environmentTexture;
        scene.environmentIntensity = initialLook.enabled ? 1.18 : 1;
        scene.environmentRotation.set(0.08, -0.42, 0.16);
        roomEnvironment.dispose();
        pmremGenerator.dispose();
      };
      rebuildEnvironment();

      const composerTarget = new THREE.WebGLRenderTarget(1, 1, {
        type: THREE.HalfFloatType,
        depthBuffer: true,
        stencilBuffer: false,
      });
      composerTarget.texture.name = "Wale.master.halfFloat";
      composer = new EffectComposer(engine, composerTarget);
      renderPass = new RenderPass(scene, camera);
      bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.035, 0.06, 3.8);
      outputPass = new OutputPass();
      composer.addPass(renderPass);

      const fieldGroup = new THREE.Group();
      const atmosphereGroup = new THREE.Group();
      const apparatusRoot = new THREE.Group();
      fieldGroup.add(atmosphereGroup, apparatusRoot);
      apparatusRoot.visible = false;
      scene.add(fieldGroup);
      const base = new THREE.IcosahedronGeometry(1, 1);
      const fragmentVertices = base.getAttribute("position");
      for (let i = 0; i < fragmentVertices.count; i++) {
        const x = fragmentVertices.getX(i), y = fragmentVertices.getY(i), z = fragmentVertices.getZ(i);
        const relief = 1 + Math.sin(x * 4.2 + y * 2.3) * Math.cos(z * 3.7 - x) * 0.13;
        fragmentVertices.setXYZ(i, x * relief, y * relief, z * relief);
      }
      base.computeVertexNormals();
      geometry = new THREE.InstancedBufferGeometry();
      geometry.index = base.index;
      geometry.setAttribute("position", base.getAttribute("position"));
      geometry.setAttribute("normal", base.getAttribute("normal"));
      data.targets.forEach((target, index) => geometry!.setAttribute(`target${index}`, new THREE.InstancedBufferAttribute(target, 3)));
      geometry.setAttribute("seed", new THREE.InstancedBufferAttribute(data.seeds, 4));
      geometry.setAttribute("particleSize", new THREE.InstancedBufferAttribute(data.sizes, 1));
      geometry.instanceCount = count;
      base.dispose();

      const uniforms = {
        progress: { value: forcedProgress ?? Math.max(0, Math.min(5, controls.current.progress || 0)) },
        time: { value: 0 },
        motion: { value: controls.current.reducedMotion ? 0 : 1 },
        pressureMotion: { value: controls.current.reducedMotion ? 0 : 1 },
        goldHead: { value: 0 },
        goldStrength: { value: 0 },
        goldWarm: { value: 0 },
        glowScale: { value: 1 },
        pointer: { value: new THREE.Vector2() },
      };
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        side: THREE.FrontSide,
        transparent: false,
        depthTest: true,
        depthWrite: true,
        blending: THREE.NoBlending,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      atmosphereGroup.add(mesh);
      coronaMaterial = new THREE.ShaderMaterial({
        vertexShader, fragmentShader: coronaShader,
        uniforms: { ...uniforms, glowScale: { value: 2.4 } },
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        toneMapped: false,
      });
      const corona = new THREE.Mesh(geometry, coronaMaterial);
      corona.frustumCulled = false;
      corona.visible = false;
      atmosphereGroup.add(corona);

      // Fine filaments reveal relationships during the middle chapters only.
      // Their endpoints share the fragments' morph coordinates, so links never detach.
      const ordered = Array.from({ length: count }, (_, i) => i)
        .sort((a, b) => (a * 0.61803398875) % 1 - (b * 0.61803398875) % 1);
      const segments = 360;
      const endpoints: number[] = [];
      for (let i = 0; i < segments; i++) {
        endpoints.push(ordered[Math.floor(i / segments * count)]!);
        endpoints.push(ordered[Math.floor(((i + 7) % segments) / segments * count)]!);
      }
      connectionGeometry = new THREE.BufferGeometry();
      connectionGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(endpoints.length * 3), 3));
      data.targets.forEach((target, index) => {
        const positions = new Float32Array(endpoints.length * 3);
        endpoints.forEach((source, vertex) => positions.set(target.subarray(source * 3, source * 3 + 3), vertex * 3));
        connectionGeometry!.setAttribute(`target${index}`, new THREE.BufferAttribute(positions, 3));
      });
      const lineSeeds = new Float32Array(endpoints.length * 4);
      endpoints.forEach((source, vertex) => lineSeeds.set(data.seeds.subarray(source * 4, source * 4 + 4), vertex * 4));
      connectionGeometry.setAttribute("seed", new THREE.BufferAttribute(lineSeeds, 4));
      connectionMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `${morphShader}\nvoid main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(fieldPosition(), 1.0); }`,
        fragmentShader: `uniform float progress;\nvoid main() { float reveal = smoothstep(1.25, 2.0, progress) * (1.0 - smoothstep(4.0, 4.85, progress)); gl_FragColor = vec4(0.065, 0.09, 0.14, reveal * 0.09); }`,
        transparent: true,
        depthWrite: false,
      });
      const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
      connections.frustumCulled = false;
      connections.visible = false;
      atmosphereGroup.add(connections);

      const keyLight = new THREE.DirectionalLight(0xffe8ca, 3.15);
      keyLight.position.set(-4.3, 5.6, 7.4);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(initialLook.shadowMapSize, initialLook.shadowMapSize);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 20;
      keyLight.shadow.camera.left = -5;
      keyLight.shadow.camera.right = 5;
      keyLight.shadow.camera.top = 4;
      keyLight.shadow.camera.bottom = -4;
      keyLight.shadow.bias = -0.00035;
      keyLight.shadow.normalBias = 0.018;
      keyLight.shadow.radius = 3;
      scene.add(keyLight, keyLight.target);

      const rimLight = new THREE.DirectionalLight(0x3478ff, 1.32);
      rimLight.position.set(5.2, 2.4, -4.8);
      scene.add(rimLight);
      const topLight = new THREE.DirectionalLight(0xb8d2ff, 0.92);
      topLight.position.set(0.8, 6.2, 2.8);
      const fillLight = new THREE.PointLight(0x789ac9, 2.6, 11, 2);
      fillLight.position.set(-3.8, -2.5, 4.4);
      const warmKicker = new THREE.PointLight(0xffc48f, 3.4, 8.5, 2);
      warmKicker.position.set(3.8, -2.35, 3.6);
      scene.add(topLight, topLight.target, fillLight, warmKicker);

      function ownGeometry<T extends THREE.BufferGeometry>(resource: T): T {
        mechanismGeometries.push(resource);
        return resource;
      }
      function ownMaterial<T extends THREE.Material>(resource: T): T {
        mechanismMaterials.push(resource);
        return resource;
      }
      function ownTexture<T extends THREE.Texture>(resource: T): T {
        mechanismTextures.push(resource);
        return resource;
      }
      const makeMesh = (
        meshGeometry: THREE.BufferGeometry,
        meshMaterial: THREE.Material,
        parent: THREE.Object3D,
        casts = false,
      ) => {
        const child = new THREE.Mesh(meshGeometry, meshMaterial);
        child.castShadow = casts;
        child.receiveShadow = casts;
        child.frustumCulled = false;
        parent.add(child);
        return child;
      };

      const maxAnisotropy = Math.min(8, engine.capabilities.getMaxAnisotropy());
      const ownSurface = (surface: WaleSurfaceTextureSet) => {
        [surface.color, surface.roughness, surface.normal].forEach((texture) => {
          texture.anisotropy = maxAnisotropy;
          ownTexture(texture);
        });
        return surface;
      };
      const metalMapSize = initialLook.enabled ? 512 : 256;
      const dielectricMapSize = initialLook.enabled ? 384 : 192;
      const nickelSurface = ownSurface(createSurfaceTextureSet(metalMapSize, 74021, "nickel"));
      const silverSurface = ownSurface(createSurfaceTextureSet(metalMapSize, 11939, "silver"));
      const elastomerSurface = ownSurface(createSurfaceTextureSet(dielectricMapSize, 83003, "elastomer"));
      const glassSurface = ownSurface(createSurfaceTextureSet(dielectricMapSize, 42737, "glass"));
      const energySurface = ownSurface(createSurfaceTextureSet(dielectricMapSize, 51337, "energy"));

      const blackNickelMaterial = ownMaterial(new THREE.MeshPhysicalMaterial({
        color: 0x151c26,
        map: nickelSurface.color,
        metalness: 0.94,
        roughness: 1,
        roughnessMap: nickelSurface.roughness,
        normalMap: nickelSurface.normal,
        normalScale: new THREE.Vector2(0.38, 0.38),
        anisotropy: 0.52,
        anisotropyRotation: Math.PI / 2,
        clearcoat: 0.1,
        clearcoatRoughness: 0.32,
        envMapIntensity: 1.38,
      }));
      const machinedSilverMaterial = ownMaterial(new THREE.MeshPhysicalMaterial({
        color: 0xaab5c4,
        map: silverSurface.color,
        metalness: 1,
        roughness: 1,
        roughnessMap: silverSurface.roughness,
        normalMap: silverSurface.normal,
        normalScale: new THREE.Vector2(0.3, 0.3),
        anisotropy: 0.68,
        anisotropyRotation: Math.PI / 2,
        clearcoat: 0.04,
        clearcoatRoughness: 0.35,
        envMapIntensity: 1.22,
      }));
      const elastomerMaterial = ownMaterial(new THREE.MeshPhysicalMaterial({
        color: 0x141922,
        map: elastomerSurface.color,
        metalness: 0.02,
        roughness: 1,
        roughnessMap: elastomerSurface.roughness,
        normalMap: elastomerSurface.normal,
        normalScale: new THREE.Vector2(0.62, 0.62),
        sheen: 0.28,
        sheenColor: new THREE.Color(0x223044),
        sheenRoughness: 0.9,
        envMapIntensity: 0.45,
      }));
      const ceramicMaterial = ownMaterial(new THREE.MeshPhysicalMaterial({
        color: 0x9da8b7,
        metalness: 0.05,
        roughness: 0.42,
        clearcoat: 0.22,
        clearcoatRoughness: 0.2,
        envMapIntensity: 0.9,
      }));
      const smokedGlassMaterial = ownMaterial(new THREE.MeshPhysicalMaterial({
        color: 0x7897c3,
        map: glassSurface.color,
        metalness: 0,
        roughness: 1,
        roughnessMap: glassSurface.roughness,
        normalMap: glassSurface.normal,
        normalScale: new THREE.Vector2(0.12, 0.12),
        transmission: 0.82,
        thickness: 0.22,
        ior: 1.5,
        attenuationColor: new THREE.Color(0x07172f),
        attenuationDistance: 0.72,
        specularIntensity: 1,
        specularColor: new THREE.Color(0xa8caff),
        dispersion: 0.018,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        envMapIntensity: 1.55,
      }));
      const upstreamSignalMaterial = ownMaterial(new THREE.MeshPhysicalMaterial({
        color: 0x173d9b,
        map: energySurface.color,
        emissive: 0x0b42d8,
        emissiveIntensity: 0.2,
        metalness: 0.12,
        roughness: 1,
        roughnessMap: energySurface.roughness,
        normalMap: energySurface.normal,
        normalScale: new THREE.Vector2(0.18, 0.18),
        clearcoat: 0.38,
        clearcoatRoughness: 0.12,
        envMapIntensity: 1.18,
      }));
      const downstreamSignalMaterial = ownMaterial(upstreamSignalMaterial.clone());
      const redirectSignalMaterial = ownMaterial(upstreamSignalMaterial.clone());
      const darkSignalMaterial = ownMaterial(new THREE.MeshStandardMaterial({
        color: 0x05080c,
        emissive: 0x010207,
        emissiveIntensity: 0.02,
        metalness: 0.15,
        roughness: 0.62,
      }));
      const energyCoreMaterial = ownMaterial(new THREE.MeshPhysicalMaterial({
        color: 0x4e77ff,
        map: energySurface.color,
        emissive: 0x063cff,
        emissiveIntensity: 1.08,
        metalness: 0.08,
        roughness: 1,
        roughnessMap: energySurface.roughness,
        normalMap: energySurface.normal,
        normalScale: new THREE.Vector2(0.34, 0.34),
        clearcoat: 0.7,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.3,
      }));
      const energyShellMaterial = ownMaterial(new THREE.MeshPhysicalMaterial({
        color: 0x8eb7ff,
        map: energySurface.color,
        emissive: 0x041a57,
        emissiveIntensity: 0.14,
        metalness: 0,
        roughness: 1,
        roughnessMap: energySurface.roughness,
        normalMap: energySurface.normal,
        normalScale: new THREE.Vector2(0.2, 0.2),
        transmission: 0.9,
        thickness: 0.16,
        ior: 1.36,
        attenuationColor: new THREE.Color(0x174cff),
        attenuationDistance: 0.38,
        dispersion: 0.04,
        iridescence: 0.22,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [90, 230],
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        envMapIntensity: 1.45,
      }));

      const groundingMaterial = ownMaterial(new THREE.MeshStandardMaterial({
        color: 0x02050a,
        metalness: 0.04,
        roughness: 0.96,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
        envMapIntensity: 0.04,
      }));
      const groundingGeometry = ownGeometry(new THREE.PlaneGeometry(9.4, 5.8, 1, 1));
      const groundingPlane = makeMesh(groundingGeometry, groundingMaterial, fieldGroup);
      groundingPlane.position.set(0.2, -1.92, 0);
      groundingPlane.rotation.x = -Math.PI / 2;
      groundingPlane.visible = false;
      groundingPlane.receiveShadow = true;
      groundingPlane.renderOrder = -2;

      const housingSegments = initialLook.enabled ? 128 : 80;
      const conduitTubularSegments = initialLook.enabled ? 224 : 144;
      const conduitRadialSegments = initialLook.enabled ? 20 : 14;
      const socketSegments = initialLook.enabled ? 64 : 40;
      const housingGroup = new THREE.Group();
      apparatusRoot.add(housingGroup);
      const housingProfile = [
        new THREE.Vector2(0.54, -0.36), new THREE.Vector2(0.74, -0.3),
        new THREE.Vector2(0.82, -0.2), new THREE.Vector2(0.78, -0.1),
        new THREE.Vector2(0.9, -0.04), new THREE.Vector2(0.9, 0.08),
        new THREE.Vector2(0.74, 0.15), new THREE.Vector2(0.7, 0.29),
        new THREE.Vector2(0.5, 0.36),
      ];
      const housingGeometry = ownGeometry(new THREE.LatheGeometry(housingProfile, housingSegments));
      const housing = makeMesh(housingGeometry, blackNickelMaterial, housingGroup, true);
      housing.rotation.x = Math.PI / 2;
      housing.position.z = -0.08;
      const backPlateGeometry = ownGeometry(new THREE.CylinderGeometry(0.98, 0.88, 0.16, housingSegments, 3));
      const backPlate = makeMesh(backPlateGeometry, blackNickelMaterial, housingGroup, true);
      backPlate.rotation.x = Math.PI / 2;
      backPlate.position.z = -0.38;

      const braceGeometry = ownGeometry(new THREE.BoxGeometry(1, 1, 1, 10, 2, 2));
      const braceSpecs = [
        [-2.45, 0.64, -0.2], [-0.7, 0.72, -0.12], [0.66, 0.6, -0.25], [2.22, 0.68, -0.16],
      ] as const;
      const bracePivots: THREE.Group[] = [];
      braceSpecs.forEach(([angle, length, z]) => {
        const pivot = new THREE.Group();
        pivot.rotation.z = angle;
        pivot.position.z = z;
        const brace = makeMesh(braceGeometry, blackNickelMaterial, pivot, true);
        brace.position.x = 0.72 + length * 0.5;
        brace.scale.set(length, 0.13, 0.18);
        housingGroup.add(pivot);
        bracePivots.push(pivot);
      });

      const receiverCarriage = new THREE.Group();
      housingGroup.add(receiverCarriage);
      const bearingGeometry = ownGeometry(new THREE.CylinderGeometry(0.61, 0.64, 0.2, housingSegments, 4));
      const bearing = makeMesh(bearingGeometry, machinedSilverMaterial, receiverCarriage, true);
      bearing.rotation.x = Math.PI / 2;
      bearing.position.z = 0.2;
      const apertureWellGeometry = ownGeometry(new THREE.CylinderGeometry(0.38, 0.31, 0.22, housingSegments, 4));
      const apertureWell = makeMesh(apertureWellGeometry, blackNickelMaterial, receiverCarriage, true);
      apertureWell.rotation.x = Math.PI / 2;
      apertureWell.position.z = 0.29;
      const apertureBackGeometry = ownGeometry(new THREE.CylinderGeometry(0.285, 0.285, 0.035, housingSegments, 2));
      const apertureBack = makeMesh(apertureBackGeometry, elastomerMaterial, receiverCarriage);
      apertureBack.rotation.x = Math.PI / 2;
      apertureBack.position.z = 0.37;
      const windowGeometry = ownGeometry(new THREE.CylinderGeometry(0.36, 0.36, 0.09, housingSegments, 2));
      const pressureWindow = makeMesh(windowGeometry, smokedGlassMaterial, receiverCarriage);
      pressureWindow.rotation.x = Math.PI / 2;
      pressureWindow.position.z = 0.42;
      pressureWindow.renderOrder = 3;
      const sealGeometry = ownGeometry(new THREE.TorusGeometry(0.39, 0.055, 24, 112));
      const seal = makeMesh(sealGeometry, elastomerMaterial, receiverCarriage);
      seal.position.z = 0.47;
      const ceramicRaceGeometry = ownGeometry(new THREE.TorusGeometry(0.27, 0.036, 20, 96));
      const ceramicRace = makeMesh(ceramicRaceGeometry, elastomerMaterial, receiverCarriage);
      ceramicRace.position.z = 0.485;

      const capGeometry = ownGeometry(new THREE.SphereGeometry(1, 24, 16));
      const ringSpecs = [
        { radius: 0.55, tube: 0.055, arc: Math.PI * 0.92, z: 0.48, rest: -0.72, locked: -0.08 },
        { radius: 0.72, tube: 0.06, arc: Math.PI * 1.16, z: 0.36, rest: 0.34, locked: 0.12 },
        { radius: 0.91, tube: 0.065, arc: Math.PI * 1.38, z: 0.22, rest: -0.46, locked: -0.14 },
      ] as const;
      const segmentRings: THREE.Group[] = [];
      ringSpecs.forEach((spec) => {
        const ringGroup = new THREE.Group();
        const ringGeometry = ownGeometry(new THREE.TorusGeometry(
          spec.radius,
          spec.tube,
          initialLook.enabled ? 28 : 20,
          initialLook.enabled ? 144 : 96,
          spec.arc,
        ));
        makeMesh(ringGeometry, machinedSilverMaterial, ringGroup, true);
        const startCap = makeMesh(capGeometry, machinedSilverMaterial, ringGroup);
        startCap.position.set(spec.radius, 0, 0);
        startCap.scale.setScalar(spec.tube);
        const endCap = makeMesh(capGeometry, machinedSilverMaterial, ringGroup);
        endCap.position.set(Math.cos(spec.arc) * spec.radius, Math.sin(spec.arc) * spec.radius, 0);
        endCap.scale.setScalar(spec.tube);
        ringGroup.position.z = spec.z;
        ringGroup.rotation.z = spec.rest;
        receiverCarriage.add(ringGroup);
        segmentRings.push(ringGroup);
      });

      const fastenerGeometry = ownGeometry(new THREE.CylinderGeometry(0.046, 0.046, 0.055, 32, 2));
      if (!initialLook.enabled) {
        const fasteners = new THREE.InstancedMesh(fastenerGeometry, ceramicMaterial, 12);
        const fastenerDummy = new THREE.Object3D();
        for (let index = 0; index < 12; index++) {
          const angle = index / 12 * Math.PI * 2 + 0.12;
          fastenerDummy.position.set(Math.cos(angle) * 0.79, Math.sin(angle) * 0.79, 0.34);
          fastenerDummy.rotation.set(Math.PI / 2, 0, angle);
          fastenerDummy.updateMatrix();
          fasteners.setMatrixAt(index, fastenerDummy.matrix);
        }
        fasteners.castShadow = false;
        fasteners.receiveShadow = true;
        fasteners.frustumCulled = false;
        mechanismInstances.push(fasteners);
        receiverCarriage.add(fasteners);
      }

      const vectorPoints = (points: readonly (readonly [number, number, number])[], zOffset = 0) => points.map(
        ([x, y, z]) => new THREE.Vector3(x, y, z + zOffset),
      );
      const inboundPoints = [
        [-3.08, -1.05, 0.34], [-2.72, -0.62, 0.48], [-2.2, -0.22, 0.68],
        [-1.55, 0.22, 0.8], [-0.86, 0.13, 0.64], [0, 0, 0.43],
      ] as const;
      const outboundPoints = [
        [0, 0, 0.43], [0.58, 0.27, 0.7], [1.13, 0.79, 0.38],
        [1.68, 0.47, 0.04], [1.98, -0.1, -0.2], [2.42, -0.4, 0.02], [2.9, -0.67, 0.32],
      ] as const;
      const inboundCurve = new THREE.CatmullRomCurve3(vectorPoints(inboundPoints), false, "centripetal");
      const outboundCurve = new THREE.CatmullRomCurve3(vectorPoints(outboundPoints), false, "centripetal");
      const inboundSpineCurve = new THREE.CatmullRomCurve3(vectorPoints(inboundPoints, -0.13), false, "centripetal");
      const outboundSpineCurve = new THREE.CatmullRomCurve3(vectorPoints(outboundPoints, -0.13), false, "centripetal");
      const conduitRoot = new THREE.Group();
      apparatusRoot.add(conduitRoot);
      const addTube = (
        curve: THREE.Curve<THREE.Vector3>,
        radius: number,
        tubeMaterial: THREE.Material,
        parent: THREE.Object3D,
        tubularSegments = conduitTubularSegments,
        radialSegments = conduitRadialSegments,
      ) => {
        const tubeGeometry = ownGeometry(new THREE.TubeGeometry(
          curve,
          tubularSegments,
          radius,
          radialSegments,
          false,
        ));
        const tube = makeMesh(tubeGeometry, tubeMaterial, parent);
        if (tubeMaterial === smokedGlassMaterial) tube.renderOrder = 2;
        return { tube, geometry: tubeGeometry };
      };
      addTube(inboundSpineCurve, 0.12, blackNickelMaterial, conduitRoot);
      addTube(outboundSpineCurve, 0.12, blackNickelMaterial, conduitRoot);
      addTube(inboundCurve, 0.102, smokedGlassMaterial, conduitRoot);
      addTube(outboundCurve, 0.102, smokedGlassMaterial, conduitRoot);
      addTube(inboundCurve, 0.027, upstreamSignalMaterial, conduitRoot, conduitTubularSegments, 12);
      addTube(outboundCurve, 0.027, downstreamSignalMaterial, conduitRoot, conduitTubularSegments, 12);

      const yAxis = new THREE.Vector3(0, 1, 0);
      const socketPoint = new THREE.Vector3();
      const socketAhead = new THREE.Vector3();
      const socketTangent = new THREE.Vector3();
      const socketGeometry = ownGeometry(new THREE.CylinderGeometry(0.145, 0.165, 0.19, socketSegments, 3));
      const socketSealGeometry = ownGeometry(new THREE.TorusGeometry(0.145, 0.028, 18, socketSegments));
      const addSocket = (curve: THREE.Curve<THREE.Vector3>, at: number, parent: THREE.Object3D) => {
        curve.getPointAt(at, socketPoint);
        curve.getPointAt(Math.min(1, at + 0.008), socketAhead);
        if (at > 0.992) curve.getPointAt(Math.max(0, at - 0.008), socketAhead);
        socketTangent.subVectors(socketAhead, socketPoint).normalize();
        if (at > 0.992) socketTangent.multiplyScalar(-1);
        const socketRoot = new THREE.Group();
        socketRoot.position.copy(socketPoint);
        socketRoot.quaternion.setFromUnitVectors(yAxis, socketTangent);
        const actuator = new THREE.Group();
        socketRoot.add(actuator);
        makeMesh(socketGeometry, machinedSilverMaterial, actuator);
        const insulator = makeMesh(socketSealGeometry, ceramicMaterial, actuator);
        insulator.rotation.x = Math.PI / 2;
        parent.add(socketRoot);
        return actuator;
      };
      const inboundSockets = [0, 0.44, 1].map((at) => addSocket(inboundCurve, at, conduitRoot));
      const moduleCollars = [0.29, 0.58, 1].map((at) => addSocket(outboundCurve, at, conduitRoot));
      const auxiliaryOutboundSocket = addSocket(outboundCurve, 0.78, conduitRoot);
      const outboundSockets = [
        moduleCollars[0]!,
        moduleCollars[1]!,
        auxiliaryOutboundSocket,
        moduleCollars[2]!,
      ];

      const podBodyGeometry = ownGeometry(new THREE.CapsuleGeometry(0.23, 0.34, 12, initialLook.enabled ? 48 : 32));
      const podFaceGeometry = ownGeometry(new THREE.CylinderGeometry(0.17, 0.2, 0.08, socketSegments, 2));
      const podWindowGeometry = ownGeometry(new THREE.CylinderGeometry(0.115, 0.115, 0.09, socketSegments, 2));
      const podSealGeometry = ownGeometry(new THREE.TorusGeometry(0.13, 0.026, 18, socketSegments));
      const latchGeometry = ownGeometry(new THREE.BoxGeometry(0.28, 0.065, 0.07, 6, 2, 2));
      const podSpecs = [
        { position: [1.14, 0.79, 0.28], scale: [0.82, 1.14, 0.76], rotation: -0.56 },
        { position: [1.98, -0.1, -0.2], scale: [1.08, 0.86, 0.74], rotation: 0.82 },
        { position: [2.9, -0.67, 0.3], scale: [0.76, 1.28, 0.92], rotation: -0.38 },
      ] as const;
      const podGroups: THREE.Group[] = [];
      const latchMeshes: THREE.Mesh[] = [];
      podSpecs.forEach((spec, index) => {
        const pod = new THREE.Group();
        pod.position.set(spec.position[0], spec.position[1], spec.position[2]);
        pod.rotation.z = spec.rotation;
        pod.scale.set(spec.scale[0], spec.scale[1], spec.scale[2]);
        const body = makeMesh(podBodyGeometry, blackNickelMaterial, pod, true);
        body.rotation.z = index === 1 ? Math.PI / 2 : 0;
        const face = makeMesh(podFaceGeometry, machinedSilverMaterial, pod, true);
        face.rotation.x = Math.PI / 2;
        face.position.z = 0.25;
        const podWindow = makeMesh(podWindowGeometry, smokedGlassMaterial, pod);
        podWindow.rotation.x = Math.PI / 2;
        podWindow.position.z = 0.31;
        podWindow.renderOrder = 3;
        const podSeal = makeMesh(podSealGeometry, elastomerMaterial, pod);
        podSeal.position.z = 0.365;
        const latch = makeMesh(latchGeometry, ceramicMaterial, pod);
        latch.position.set(0, -0.21, 0.36);
        latch.rotation.z = -0.52;
        podGroups.push(pod);
        latchMeshes.push(latch);
        apparatusRoot.add(pod);
      });
      const sourcePod = new THREE.Group();
      sourcePod.position.set(-3.08, -1.05, 0.17);
      sourcePod.rotation.z = -0.62;
      const sourceBody = makeMesh(podBodyGeometry, blackNickelMaterial, sourcePod, true);
      sourceBody.scale.set(0.68, 0.92, 0.74);
      const sourceFace = makeMesh(podFaceGeometry, machinedSilverMaterial, sourcePod, true);
      sourceFace.rotation.x = Math.PI / 2;
      sourceFace.position.z = 0.23;
      sourceFace.scale.setScalar(0.78);
      const sourceSeal = makeMesh(podSealGeometry, elastomerMaterial, sourcePod);
      sourceSeal.position.z = 0.285;
      sourceSeal.scale.setScalar(0.84);
      apparatusRoot.add(sourcePod);

      if (initialLook.enabled) {
        const manufacturingAnchors: Record<string, THREE.Object3D> = {
          housing: housingGroup,
          receiver: receiverCarriage,
          "source-pod": sourcePod,
          "module-pod-0": podGroups[0]!,
          "module-pod-1": podGroups[1]!,
          "module-pod-2": podGroups[2]!,
          "inbound-socket-0": inboundSockets[0]!,
          "inbound-socket-1": inboundSockets[1]!,
          "inbound-socket-2": inboundSockets[2]!,
          "outbound-socket-0": outboundSockets[0]!,
          "outbound-socket-1": outboundSockets[1]!,
          "outbound-socket-2": outboundSockets[2]!,
          "outbound-socket-3": outboundSockets[3]!,
        };
        const manufacturingMaterials: Record<string, THREE.Material> = {
          "black-nickel": blackNickelMaterial,
          "machined-silver": machinedSilverMaterial,
          ceramic: ceramicMaterial,
          elastomer: elastomerMaterial,
        };

        WALE_MASTER_MANUFACTURING_RECIPE.forEach((detail) => {
          const anchor = manufacturingAnchors[detail.anchor]!;
          const detailRoot = new THREE.Group();
          detailRoot.name = detail.id;
          detailRoot.position.set(...detail.position);
          detailRoot.rotation.set(...detail.rotation);
          const detailMaterial = manufacturingMaterials[detail.material]!;
          const [primary, depth, secondary] = detail.scale;
          let detailGeometry: THREE.BufferGeometry;

          if (detail.kind === "beveled-collar") {
            detailGeometry = ownGeometry(new THREE.CylinderGeometry(
              primary - secondary * 0.35,
              primary,
              depth,
              96,
              3,
            ));
          } else if (detail.kind === "recessed-fastener") {
            detailGeometry = ownGeometry(new THREE.CylinderGeometry(primary * 0.92, primary, depth, 32, 2));
          } else if (detail.kind === "split-line-band") {
            detailGeometry = ownGeometry(new THREE.TorusGeometry(primary, secondary, 16, 96));
          } else if (detail.kind === "spacer") {
            detailGeometry = ownGeometry(new THREE.CylinderGeometry(primary * 0.96, primary, depth, 48, 2));
          } else if (detail.kind === "strain-relief") {
            detailGeometry = ownGeometry(new THREE.CylinderGeometry(primary * 0.76, primary, depth, 48, 4));
          } else if (detail.kind === "connector-housing") {
            detailGeometry = ownGeometry(new THREE.CylinderGeometry(primary * 0.88, primary, depth, 64, 4));
          } else {
            detailGeometry = ownGeometry(new THREE.CapsuleGeometry(0.5, 0.72, 6, 12));
          }

          const detailMesh = makeMesh(detailGeometry, detailMaterial, detailRoot, true);
          if (detail.kind === "knurl-rib" || detail.kind === "vent") {
            detailMesh.scale.set(primary * 1.25, depth / 1.72, secondary * 2);
          }

          if (detail.kind === "recessed-fastener") {
            const recessGeometry = ownGeometry(new THREE.CylinderGeometry(secondary, secondary, 0.008, 20, 1));
            const recess = makeMesh(recessGeometry, darkSignalMaterial, detailRoot);
            recess.position.y = depth * 0.5 + 0.004;
          } else if (detail.kind === "strain-relief") {
            for (let rib = -1; rib <= 1; rib++) {
              const ribGeometry = ownGeometry(new THREE.TorusGeometry(
                primary * (0.87 - Math.abs(rib) * 0.045),
                secondary,
                12,
                48,
              ));
              const reliefRib = makeMesh(ribGeometry, detailMaterial, detailRoot, true);
              reliefRib.rotation.x = Math.PI / 2;
              reliefRib.position.y = rib * depth * 0.29;
            }
          }
          anchor.add(detailRoot);
        });
      }

      const invalidPoints = [
        [-0.42, -0.63, 0.08], [-0.72, -1.12, -0.18], [-1.18, -1.46, -0.42],
      ] as const;
      const invalidCurve = new THREE.CatmullRomCurve3(vectorPoints(invalidPoints), false, "centripetal");
      const invalidSpineCurve = new THREE.CatmullRomCurve3(vectorPoints(invalidPoints, -0.1), false, "centripetal");
      const invalidGroup = new THREE.Group();
      apparatusRoot.add(invalidGroup);
      const invalidLayers = [
        addTube(invalidSpineCurve, 0.105, blackNickelMaterial, invalidGroup, 96, 14),
        addTube(invalidCurve, 0.086, smokedGlassMaterial, invalidGroup, 96, 14),
        addTube(invalidCurve, 0.021, darkSignalMaterial, invalidGroup, 96, 10),
      ];
      addSocket(invalidCurve, 0, invalidGroup);
      const invalidPod = new THREE.Group();
      const invalidBody = makeMesh(podBodyGeometry, elastomerMaterial, invalidPod);
      invalidBody.scale.set(0.62, 0.68, 0.62);
      const invalidFace = makeMesh(podFaceGeometry, blackNickelMaterial, invalidPod);
      invalidFace.rotation.x = Math.PI / 2;
      invalidFace.position.z = 0.2;
      invalidFace.scale.setScalar(0.62);
      const invalidSeal = makeMesh(podSealGeometry, elastomerMaterial, invalidPod);
      invalidSeal.position.z = 0.245;
      invalidSeal.scale.setScalar(0.66);
      const invalidStart = new THREE.Vector3(...invalidPoints[0]);
      const invalidEndPoint = invalidPoints[invalidPoints.length - 1]!;
      const invalidEnd = new THREE.Vector3(invalidEndPoint[0], invalidEndPoint[1], invalidEndPoint[2]);
      invalidPod.position.copy(invalidEnd);
      apparatusRoot.add(invalidPod);

      const protectedPoints = [
        [-0.18, 0.68, 0.04], [0.18, 1.18, -0.22], [0.72, 1.52, -0.38],
      ] as const;
      const redirectPoints = [
        [-0.18, 0.68, 0.18], [0.34, 1.15, 0.56], [1.14, 0.79, 0.38],
      ] as const;
      const protectedCurve = new THREE.CatmullRomCurve3(vectorPoints(protectedPoints), false, "centripetal");
      const redirectCurve = new THREE.CatmullRomCurve3(vectorPoints(redirectPoints), false, "centripetal");
      const protectedGroup = new THREE.Group();
      apparatusRoot.add(protectedGroup);
      addTube(protectedCurve, 0.096, blackNickelMaterial, protectedGroup, 112, 14);
      addTube(protectedCurve, 0.018, darkSignalMaterial, protectedGroup, 112, 10);
      addTube(redirectCurve, 0.09, blackNickelMaterial, protectedGroup, 128, 14);
      addTube(redirectCurve, 0.024, redirectSignalMaterial, protectedGroup, 128, 10);
      addSocket(protectedCurve, 1, protectedGroup);
      addSocket(redirectCurve, 1, protectedGroup);
      const protectedCapGeometry = ownGeometry(new THREE.CylinderGeometry(0.19, 0.22, 0.17, socketSegments, 3));
      const protectedCap = makeMesh(protectedCapGeometry, ceramicMaterial, protectedGroup);
      protectedCap.rotation.x = Math.PI / 2;
      const protectedEndPoint = protectedPoints[protectedPoints.length - 1]!;
      protectedCap.position.set(protectedEndPoint[0], protectedEndPoint[1], protectedEndPoint[2]);

      const energyGeometry = ownGeometry(new THREE.CapsuleGeometry(0.062, 0.31, 12, initialLook.enabled ? 48 : 32));
      const energyAssembly = new THREE.Group();
      const energyCore = makeMesh(energyGeometry, energyCoreMaterial, energyAssembly);
      const energyShell = makeMesh(energyGeometry, energyShellMaterial, energyAssembly);
      energyCore.renderOrder = 4;
      energyShell.renderOrder = 5;
      energyShell.scale.set(1.42, 1.16, 1.42);
      const energyLight = new THREE.PointLight(0x1553ff, 12, 1.65, 2);
      const energyScatterLight = new THREE.PointLight(0x8ab7ff, 4.2, 2.8, 2);
      energyScatterLight.position.set(0, -0.14, -0.16);
      energyAssembly.add(energyLight, energyScatterLight);
      conduitRoot.add(energyAssembly);
      const receiverResponseLight = new THREE.PointLight(0x2f75ff, 0, 2.5, 2);
      receiverResponseLight.position.set(0, 0, 0.78);
      receiverCarriage.add(receiverResponseLight);
      const podResponseLights = podGroups.map((pod) => {
        const responseLight = new THREE.PointLight(0x4988ff, 0, 1.85, 2);
        responseLight.position.set(0, 0, 0.48);
        pod.add(responseLight);
        return responseLight;
      });

      composer.addPass(bloomPass);
      composer.addPass(outputPass);

      const energyPoint = new THREE.Vector3();
      const energyAhead = new THREE.Vector3();
      const energyTangent = new THREE.Vector3();
      const invalidPosition = new THREE.Vector3();
      const assemblyState: WaleMasterAssemblyState = {
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
        upstreamCharge: 1,
        downstreamCharge: 0,
        invalidRetraction: 0,
        protectedRedirect: 0,
      };

      const moduleValues = {
        receiver: 0,
        module1: 0,
        module2: 0,
        module3: 0,
        invalidRetraction: 0,
        protectedRedirect: 0,
      };
      let telemetryPhase: WaleSceneStateName = "latent";
      let telemetryProgress = uniforms.progress.value;
      let telemetryEnergyPosition = 0;
      let telemetryQuality = initialLook.qualityTier;
      let telemetryFps = 0;
      let telemetryDrawCalls = 0;
      let telemetryTriangles = 0;
      let telemetryReducedMotion = controls.current.reducedMotion;
      let telemetryPaused = controls.current.paused || forcedProgress !== undefined;

      if (process.env.NODE_ENV !== "production") {
        const moduleSnapshot: WaleModuleStates = Object.freeze({
          get receiver() { return moduleValues.receiver; },
          get module1() { return moduleValues.module1; },
          get module2() { return moduleValues.module2; },
          get module3() { return moduleValues.module3; },
          get invalidRetraction() { return moduleValues.invalidRetraction; },
          get protectedRedirect() { return moduleValues.protectedRedirect; },
        });
        const snapshot: WaleSceneSnapshot = Object.freeze({
          get phase() { return telemetryPhase; },
          get progress() { return telemetryProgress; },
          get energyPosition() { return telemetryEnergyPosition; },
          moduleStates: moduleSnapshot,
          get qualityTier() { return telemetryQuality; },
          get fps() { return telemetryFps; },
          get drawCalls() { return telemetryDrawCalls; },
          get triangles() { return telemetryTriangles; },
          master: initialLook.enabled,
          get reducedMotion() { return telemetryReducedMotion; },
          get paused() { return telemetryPaused; },
        });
        debugGetter = () => snapshot;
        Object.defineProperty(window, "__WALE_SCENE__", {
          configurable: true,
          enumerable: false,
          get: debugGetter,
        });
      }

      const updateMechanism = (sceneProgress: number, sceneTime: number) => {
        sampleWaleAssemblyState(sceneProgress, assemblyState);
        moduleValues.receiver = assemblyState.receiver;
        moduleValues.module1 = Math.min(1, assemblyState.latches[0]);
        moduleValues.module2 = Math.min(1, assemblyState.latches[1]);
        moduleValues.module3 = Math.min(1, assemblyState.latches[2]);
        moduleValues.invalidRetraction = assemblyState.invalidRetraction;
        moduleValues.protectedRedirect = assemblyState.protectedRedirect;

        const phase = getWaleScenePhase(sceneProgress);
        if (phase !== telemetryPhase) element.dataset.scenePhase = phase;
        telemetryPhase = phase;
        telemetryProgress = sceneProgress;
        telemetryEnergyPosition = assemblyState.energyPosition;

        const inbound = assemblyState.energyPosition <= 0.57;
        const energyPath = inbound ? inboundCurve : outboundCurve;
        const pathPosition = inbound
          ? assemblyState.energyPosition / 0.57
          : (assemblyState.energyPosition - 0.57) / 0.43;
        const samplePosition = Math.max(0, Math.min(1, pathPosition));
        energyPath.getPointAt(samplePosition, energyPoint);
        if (samplePosition > 0.992) {
          energyPath.getPointAt(Math.max(0, samplePosition - 0.008), energyAhead);
          energyTangent.subVectors(energyPoint, energyAhead).normalize();
        } else {
          energyPath.getPointAt(Math.min(1, samplePosition + 0.008), energyAhead);
          energyTangent.subVectors(energyAhead, energyPoint).normalize();
        }
        energyAssembly.position.copy(energyPoint);
        energyAssembly.quaternion.setFromUnitVectors(yAxis, energyTangent);
        const breath = 0.5 + Math.sin(sceneTime * 1.35) * 0.5;
        const livingSignal = 0.22 + assemblyState.turbulence * 0.78;
        const energyPulse = Math.sin(sceneTime * 1.7) * 0.018 * livingSignal;
        energyAssembly.scale.set(
          0.88 + energyPulse,
          1.28 + assemblyState.impact * 0.08 + energyPulse * 1.4,
          0.88 + energyPulse,
        );
        energyShell.rotation.y = sceneTime * 0.18;
        const energyActivation = THREE.MathUtils.smoothstep(sceneProgress, 0, 0.8);
        energyShellMaterial.opacity = 1;
        energyShellMaterial.transmission = 0.9
          - assemblyState.impact * 0.08
          + assemblyState.alignment * 0.035;
        energyShellMaterial.emissiveIntensity = 0.1
          + energyActivation * 0.12
          + assemblyState.impact * 0.08;
        energyCoreMaterial.emissiveIntensity = 0.96
          + energyActivation * 1.02
          + breath * livingSignal * 0.18
          - assemblyState.alignment * 0.26;
        energyLight.intensity = 5.4
          + energyActivation * 11.5
          + assemblyState.impact * 4.4
          + breath * livingSignal * 1.2
          - assemblyState.alignment * 3.2;
        energyScatterLight.intensity = 1.4
          + energyActivation * 4.2
          + assemblyState.impact * 1.8
          - assemblyState.alignment * 1.4;
        receiverResponseLight.intensity = assemblyState.anticipation * 1.4
          + assemblyState.impact * 8.5
          + assemblyState.receiver * 1.2;
        upstreamSignalMaterial.emissiveIntensity = 0.025
          + assemblyState.upstreamCharge * 0.78
          + breath * livingSignal * assemblyState.upstreamCharge * 0.045;
        downstreamSignalMaterial.emissiveIntensity = 0.035
          + assemblyState.downstreamCharge * (0.74 - assemblyState.alignment * 0.3)
          + breath * livingSignal * assemblyState.downstreamCharge * 0.035;
        redirectSignalMaterial.emissiveIntensity = 0.025
          + assemblyState.protectedRedirect * (0.44 - assemblyState.alignment * 0.12);
        blackNickelMaterial.envMapIntensity = 1.38
          + Math.sin(sceneTime * 0.34) * 0.045 * livingSignal;
        machinedSilverMaterial.envMapIntensity = 1.22
          + Math.sin(sceneTime * 0.31 + 1.2) * 0.055 * livingSignal;
        smokedGlassMaterial.envMapIntensity = 1.55
          + Math.sin(sceneTime * 0.27 + 2.1) * 0.025 * livingSignal;

        receiverCarriage.position.z = assemblyState.anticipation * 0.055 - assemblyState.recoil * 0.185;
        bearing.position.z = 0.2 - assemblyState.bearingCompression * 0.1;
        pressureWindow.position.z = 0.42 - assemblyState.bearingCompression * 0.065;
        seal.position.z = 0.47 - assemblyState.bearingCompression * 0.052;
        ceramicRace.position.z = 0.485 - assemblyState.bearingCompression * 0.044;
        housing.rotation.z = -0.025 + assemblyState.ringTwist * 0.105;
        for (let index = 0; index < segmentRings.length; index++) {
          const spec = ringSpecs[index]!;
          const compression = 1 - assemblyState.bearingCompression * (0.045 + index * 0.012);
          segmentRings[index]!.rotation.z = THREE.MathUtils.lerp(spec.rest, spec.locked, assemblyState.ringTwist);
          segmentRings[index]!.scale.set(compression, compression, 1);
        }
        for (let index = 0; index < bracePivots.length; index++) {
          const direction = index % 2 === 0 ? -1 : 1;
          bracePivots[index]!.rotation.z = braceSpecs[index]![0]
            + direction * assemblyState.conduitTension * 0.045;
        }

        const tensionX = 1 + assemblyState.conduitTension * 0.018;
        const tensionY = 1 - assemblyState.conduitTension * 0.01;
        conduitRoot.scale.set(tensionX, tensionY, 1);
        for (let index = 0; index < podGroups.length; index++) {
          const spec = podSpecs[index]!;
          const latch = assemblyState.latches[index]!;
          const collar = assemblyState.collars[index]!;
          podGroups[index]!.position.set(
            spec.position[0] * tensionX,
            spec.position[1] * tensionY,
            spec.position[2] - latch * 0.08,
          );
          podGroups[index]!.rotation.y = latch * (index - 1) * 0.11;
          moduleCollars[index]!.position.y = collar * 0.055;
          moduleCollars[index]!.rotation.y = collar * (index % 2 === 0 ? 0.24 : -0.24);
          latchMeshes[index]!.rotation.z = -0.64 + latch * 0.7;
          latchMeshes[index]!.position.y = -0.23 + latch * 0.16;
          podResponseLights[index]!.intensity = collar * 0.8 + latch * 3.6;
        }

        const remaining = Math.max(0.14, 1 - assemblyState.invalidRetraction * 0.84);
        for (let index = 0; index < invalidLayers.length; index++) {
          const invalidGeometry = invalidLayers[index]!.geometry;
          const total = invalidGeometry.index?.count ?? 0;
          invalidGeometry.setDrawRange(0, Math.max(6, Math.floor(total * remaining / 6) * 6));
        }
        invalidPosition.lerpVectors(invalidEnd, invalidStart, assemblyState.invalidRetraction * 0.82);
        invalidPod.position.copy(invalidPosition);
        invalidPod.scale.setScalar(1 - assemblyState.invalidRetraction * 0.42);
        protectedCap.rotation.z = -0.12 + assemblyState.protectedRedirect * 0.26;
      };

      let narrow = mobile;
      let quality = 0;
      const cameraBase = new THREE.Vector3();
      const cameraFocus = new THREE.Vector3();
      const cameraLookAt = new THREE.Vector3();
      const applyBudget = () => {
        const look = resolveWaleMasterLook({
          search: developmentParams ? window.location.search : "",
          environment: process.env.NODE_ENV,
          narrow,
          adaptiveQuality: quality,
          devicePixelRatio: window.devicePixelRatio || 1,
          maxInstances: count,
        });
        geometry!.instanceCount = look.instanceCount;
        engine.setPixelRatio(look.pixelRatio);
        composer!.setPixelRatio(look.pixelRatio);
        if (keyLight.shadow.mapSize.x !== look.shadowMapSize) {
          keyLight.shadow.mapSize.set(look.shadowMapSize, look.shadowMapSize);
          keyLight.shadow.map?.dispose();
          keyLight.shadow.map = null;
        }
        telemetryQuality = look.qualityTier;
        element.dataset.sceneQuality = telemetryQuality;
        element.dataset.sceneInstances = String(geometry!.instanceCount);
        element.dataset.sceneDpr = String(engine.getPixelRatio());
      };
      const resize = () => {
        if (disposed || lost) return;
        const width = Math.max(1, element.clientWidth);
        const height = Math.max(1, element.clientHeight);
        narrow = width <= 1000;
        applyBudget();
        engine.setSize(width, height, false);
        composer!.setSize(width, height);
        camera.aspect = width / height;
        camera.fov = narrow ? 41 : 37;
        if (narrow) {
          cameraBase.set(0.18, -0.34, 12.8);
          cameraFocus.set(0.38, -0.2, 0);
          fieldGroup.position.set(0.72, 2.28, 0);
          fieldGroup.scale.setScalar(0.62);
        } else {
          cameraBase.set(0.08, 0.03, 9.35);
          cameraFocus.set(0.34, 0, 0);
          fieldGroup.position.set(width < 1600 ? 2.72 : 2.58, 0, 0);
          fieldGroup.scale.setScalar(width < 1600 ? 0.76 : 0.9);
        }
        camera.position.copy(cameraBase);
        camera.lookAt(cameraFocus);
        camera.updateProjectionMatrix();
        wake.current?.();
      };
      observer = new ResizeObserver(resize);
      observer.observe(element);

      const pointer = new THREE.Vector2();
      const onPointer = (event: PointerEvent) => {
        if (controls.current.reducedMotion || controls.current.paused) return;
        pointer.set(event.clientX / Math.max(1, window.innerWidth) * 2 - 1, 1 - event.clientY / Math.max(1, window.innerHeight) * 2);
      };
      let previous = 0;
      let sampledTime = 0;
      let sampledFrames = 0;
      const goldSweep: GoldSweep = { startedAt: null, head: 0, strength: 0, warm: 0 };
      const draw = (now: number) => {
        frame = 0;
        if (disposed || lost || document.hidden) return;
        const elapsed = previous ? (now - previous) / 1000 : 0;
        const delta = elapsed ? Math.min(elapsed, 0.1) : 1 / 60;
        previous = now;
        const control = controls.current;
        const fixed = forcedProgress !== undefined;
          const still = control.paused || control.reducedMotion || fixed;
        element.dataset.sceneMotion = fixed ? "fixed" : control.reducedMotion ? "reduced" : control.paused ? "paused" : "running";
        const target = forcedProgress ?? Math.max(0, Math.min(5, Number.isFinite(control.progress) ? control.progress : 0));
        uniforms.progress.value = still ? target : THREE.MathUtils.lerp(uniforms.progress.value, target, 1 - Math.exp(-delta * 6));
        uniforms.motion.value = still ? 0 : 1;
        uniforms.pressureMotion.value = control.reducedMotion || fixed ? 0 : 1;
        if (!still) uniforms.time.value += delta;
        advanceGoldSweep(goldSweep, uniforms.progress.value, uniforms.time.value, control.reducedMotion || fixed);
        uniforms.goldHead.value = goldSweep.head;
        uniforms.goldStrength.value = goldSweep.strength;
        uniforms.goldWarm.value = goldSweep.warm;
        corona.visible = goldSweep.strength > 0 || goldSweep.warm > 0;
        element.dataset.goldSweep = goldSweep.strength > 0 ? "running" : goldSweep.warm > 0 ? "static" : "idle";
        element.dataset.goldHead = goldSweep.head.toFixed(3);
        if (still) uniforms.pointer.value.set(0, 0);
        else uniforms.pointer.value.lerp(pointer, 1 - Math.exp(-delta * 4.5));
        updateMechanism(uniforms.progress.value, uniforms.time.value);
        atmosphereGroup.rotation.set(
          -0.1,
          -0.16 + Math.sin(uniforms.time.value * 0.07)
            * 0.014 * (0.25 + assemblyState.turbulence),
          -0.12,
        );
        apparatusRoot.rotation.set(
          -0.065 - uniforms.pointer.value.y * 0.032,
          -0.11 + uniforms.pointer.value.x * 0.065,
          -0.055,
        );
        camera.position.set(
          cameraBase.x + uniforms.pointer.value.x * 0.16,
          cameraBase.y + uniforms.pointer.value.y * 0.1,
          cameraBase.z,
        );
        cameraLookAt.set(
          cameraFocus.x + uniforms.pointer.value.x * 0.028,
          cameraFocus.y + uniforms.pointer.value.y * 0.018,
          cameraFocus.z,
        );
        camera.lookAt(cameraLookAt);
        const specularSweep = Math.sin(uniforms.time.value * 0.28)
          * (0.06 + assemblyState.turbulence * 0.1);
        keyLight.position.set(
          -4.3 + uniforms.pointer.value.x * 0.5 + specularSweep,
          5.6 + uniforms.pointer.value.y * 0.22,
          7.4,
        );
        rimLight.position.set(
          5.2 - uniforms.pointer.value.x * 0.34 - specularSweep * 0.6,
          2.4 + uniforms.pointer.value.y * 0.16,
          -4.8,
        );
        fillLight.position.x = -3.8 + uniforms.pointer.value.x * 0.2;
        warmKicker.position.x = 3.8 - uniforms.pointer.value.x * 0.18;
        topLight.position.x = 0.8 + specularSweep * 0.3;
        try {
          engine.info.reset();
          camera.layers.set(0);
          engine.autoClear = true;
          engine.clear();
          if (narrow) {
            const width = element.clientWidth, height = element.clientHeight;
            engine.setScissor(0, height * 0.56, width, height * 0.44);
            engine.setScissorTest(true);
          }
          engine.render(scene, camera);
          engine.setScissorTest(false);
          camera.layers.set(0);
          engine.autoClear = true;
          telemetryDrawCalls = engine.info.render.calls;
          telemetryTriangles = engine.info.render.triangles;
          telemetryReducedMotion = control.reducedMotion;
          telemetryPaused = control.paused || fixed;
          if (elapsed > 0) {
            const instantFps = 1 / elapsed;
            telemetryFps = telemetryFps
              ? THREE.MathUtils.lerp(telemetryFps, instantFps, 0.08)
              : instantFps;
          }
          report("ready");
        } catch {
          lost = true;
          canvas.style.visibility = "hidden";
          report("fallback");
          return;
        }
        if (!still) {
          if (elapsed > 0) {
            sampledTime += elapsed;
            sampledFrames++;
          }
          if (sampledTime >= 2.5) {
            const fps = sampledFrames / sampledTime;
            telemetryFps = fps;
            element.dataset.sceneFps = String(Math.round(fps));
            if (!initialLook.enabled && fps < 38 && quality < 2) {
              quality++;
              applyBudget();
            }
            sampledTime = 0;
            sampledFrames = 0;
          }
          frame = requestAnimationFrame(draw);
        }
      };
      const requestDraw = () => {
        if (disposed || lost || document.hidden || frame) return;
        previous = 0;
        sampledTime = 0;
        sampledFrames = 0;
        frame = requestAnimationFrame(draw);
      };
      wake.current = requestDraw;
      const onVisibility = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
        if (!document.hidden) requestDraw();
      };
      const onContextLost = (event: Event) => {
        event.preventDefault();
        lost = true;
        canvas.style.visibility = "hidden";
        cancelAnimationFrame(frame);
        frame = 0;
        report("fallback");
      };
      const onContextRestored = () => {
        try {
          rebuildEnvironment();
          lost = false;
          canvas.style.visibility = "visible";
          report("loading");
          resize();
          requestDraw();
        } catch {
          lost = true;
          canvas.style.visibility = "hidden";
          report("fallback");
        }
      };
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      canvas.addEventListener("webglcontextlost", onContextLost);
      canvas.addEventListener("webglcontextrestored", onContextRestored);
      resize();
      requestDraw();

      return () => {
        disposed = true;
        wake.current = null;
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVisibility);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
        disposeScene();
      };
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        element.dataset.sceneError = error instanceof Error ? error.message : String(error);
      }
      report("fallback");
      disposeScene();
      return () => { disposed = true; wake.current = null; };
    }
  }, []);

  return <div ref={host} data-scene-status="loading" aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }} />;
}
