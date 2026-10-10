import * as THREE from "three";

import { RoomEnvironment } from
  "three/addons/environments/RoomEnvironment.js";

import { GPUComputationRenderer } from
  "three/addons/misc/GPUComputationRenderer.js";

import { EffectComposer } from
  "three/addons/postprocessing/EffectComposer.js";

import { TexturePass } from
  "three/addons/postprocessing/TexturePass.js";

import { ShaderPass } from
  "three/addons/postprocessing/ShaderPass.js";

import { UnrealBloomPass } from
  "three/addons/postprocessing/UnrealBloomPass.js";

import { OutputPass } from
  "three/addons/postprocessing/OutputPass.js";

import { FullScreenQuad } from
  "three/addons/postprocessing/Pass.js";

import { FXAAShader } from
  "three/addons/shaders/FXAAShader.js";

import {
  ACTS,
  QUALITY,
  SPECIMENS,
  clamp,
  mix,
  smoothstep
} from "./config.js";

import * as S from "./shaders.js";

const TAU = Math.PI * 2;

const UP = new THREE.Vector3(0, 1, 0);
const RIGHT = new THREE.Vector3(1, 0, 0);

function nextPaint() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

function makePass(fragmentShader, uniforms, defines = {}) {
  // Passing a ShaderMaterial preserves the actual render-target textures.
  // ShaderPass's plain-object constructor otherwise clones uniforms.
  return new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms,
      defines,
      vertexShader: S.quadVertex,
      fragmentShader,
      depthTest: false,
      depthWrite: false
    })
  );
}

function createMembraneGeometry(segments, across, count = 7) {
  const vertices = count * (segments + 1) * (across + 1);

  const positions = new Float32Array(vertices * 3);
  const normals = new Float32Array(vertices * 3);
  const uv = new Float32Array(vertices * 2);
  const blades = new Float32Array(vertices);

  const indices = [];

  let vertex = 0;

  for (let blade = 0; blade < count; blade++) {
    const start = vertex;

    for (let u = 0; u <= segments; u++) {
      for (let v = 0; v <= across; v++) {
        uv[vertex * 2] = u / segments;
        uv[vertex * 2 + 1] = v / across;

        normals[vertex * 3 + 2] = 1;
        blades[vertex] = blade;

        vertex++;
      }
    }

    for (let u = 0; u < segments; u++) {
      for (let v = 0; v < across; v++) {
        const a = start + u * (across + 1) + v;
        const b = a + 1;
        const c = a + across + 1;
        const d = c + 1;

        indices.push(a, c, b, b, c, d);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  geometry.setAttribute(
    "normal",
    new THREE.BufferAttribute(normals, 3)
  );

  geometry.setAttribute(
    "uv",
    new THREE.BufferAttribute(uv, 2)
  );

  geometry.setAttribute(
    "aBlade",
    new THREE.BufferAttribute(blades, 1)
  );

  geometry.setIndex(indices);

  return geometry;
}

function createTraceGeometry(segments, lanes = 7, sides = 5) {
  const count = lanes * (segments + 1) * (sides + 1);

  const positions = new Float32Array(count * 3);
  const laneValues = new Float32Array(count);

  const indices = [];

  let vertex = 0;

  for (let lane = 0; lane < lanes; lane++) {
    const start = vertex;

    for (let segment = 0; segment <= segments; segment++) {
      for (let side = 0; side <= sides; side++) {
        positions[vertex * 3] = segment / segments;
        positions[vertex * 3 + 1] = side / sides * TAU;
        laneValues[vertex] = lane;

        vertex++;
      }
    }

    for (let segment = 0; segment < segments; segment++) {
      for (let side = 0; side < sides; side++) {
        const a = start + segment * (sides + 1) + side;
        const b = a + 1;
        const c = a + sides + 1;
        const d = c + 1;

        indices.push(a, b, c, b, d, c);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  geometry.setAttribute(
    "aLane",
    new THREE.BufferAttribute(laneValues, 1)
  );

  geometry.setIndex(indices);

  return geometry;
}

function patchPhysicalMaterial(material, shared, membrane) {
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, shared);

    const declarations = `
      ${S.sculptureUniforms}

      varying vec3 vArchivePosition;
      varying vec2 vArchiveUv;

      ${membrane ? "attribute float aBlade;" : ""}
      ${membrane ? S.membraneSurface : S.nucleusSurface}
    `;

    shader.vertexShader = declarations + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <beginnormal_vertex>",
      `
        vec3 objectNormal = ${
          membrane
            ? "membraneNormal(uv, aBlade)"
            : "nucleusNormal(position)"
        };

        #ifdef USE_TANGENT
          vec3 objectTangent = vec3(tangent.xyz);
        #endif
      `
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
        vec3 transformed = ${
          membrane
            ? "membraneSurface(uv, aBlade)"
            : "nucleusSurface(position)"
        };

        vArchivePosition = transformed;
        vArchiveUv = uv;
      `
    );

    shader.fragmentShader = `
      ${S.sculptureUniforms}

      varying vec3 vArchivePosition;
      varying vec2 vArchiveUv;
    ` + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `
        #include <color_fragment>

        float archivePattern = ${
          membrane
            ? `vArchiveUv.x * 120.0 +
               sin(vArchiveUv.y * 5.0) * 0.8`
            : `vArchivePosition.y * 22.0 +
               sin(vArchivePosition.x * 4.0 + uTime * 0.06) * 2.2 +
               sin(vArchivePosition.z * 4.0) * 1.5`
        };

        float archiveWave = abs(sin(archivePattern));

        float archiveContour = 1.0 - smoothstep(
          0.045,
          0.045 + max(fwidth(archiveWave), 0.012) * 1.4,
          archiveWave
        );

        diffuseColor.rgb *=
          0.95 + 0.05 * cos(archivePattern * 0.5);
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      `
        #include <roughnessmap_fragment>

        roughnessFactor = clamp(
          roughnessFactor + archiveContour * 0.075,
          0.08,
          0.8
        );
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <emissivemap_fragment>",
      `
        #include <emissivemap_fragment>

        float archiveCoherence = smoothstep(
          1.0,
          4.0,
          uPhase
        );

        float archiveScan = exp(
          -pow(
            (
              vArchivePosition.y -
              sin(uTime * 0.21) * 1.1
            ) * 12.0,
            2.0
          )
        );

        totalEmissiveRadiance += uAccent * (
          archiveContour * (
            0.06 + archiveCoherence * 0.28
          ) +
          archiveScan *
          sin(clamp(uPhase / 4.0, 0.0, 1.0) * 3.14159265) *
          0.12
        );
      `
    );
  };

  material.customProgramCacheKey = () =>
    membrane
      ? "archive-membrane-v1"
      : "archive-nucleus-v1";
}

export class Observatory {
  constructor({
    settings,
    quality,
    onStatus,
    onError,
    onFrame,
    onStats
  }) {
    this.settings = settings;
    this.qualityName = quality;
    this.quality = QUALITY[quality];

    this.onStatus = onStatus;
    this.onError = onError;
    this.onFrame = onFrame;
    this.onStats = onStats;

    this.phase = 0;
    this.targetPhase = 0;

    this.time = 0;
    this.accumulator = 0;

    this.motion = true;
    this.dirty = true;
    this.running = false;
    this.failed = false;
    this.disposed = false;
    this.contextLost = false;

    this.frameId = 0;
    this.previousTime = performance.now();

    this.selected = -1;
    this.pendingCapture = null;

    this.pointerNdc = new THREE.Vector2();
    this.pointerActive = false;
    this.pointerLocal = new THREE.Vector3(100, 100, 100);

    this.raycaster = new THREE.Raycaster();
    this.interactionPlane = new THREE.Plane();

    this.cameraRight = new THREE.Vector3();
    this.cameraUp = new THREE.Vector3();
    this.cameraForward = new THREE.Vector3();

    this.temporary = new THREE.Vector3();
    this.focusPoint = new THREE.Vector3();
    this.drawingSize = new THREE.Vector2();

    this.inverseRoot = new THREE.Matrix4();

    this.averageFrame = 1 / 60;
    this.statsTimer = 0;

    this.events = new AbortController();

    this.palettes = ACTS.map(act => new THREE.Color(act.accent));
    this.rawAccent = new THREE.Color();
    this.gray = new THREE.Color();

    this.shared = {
      uTime: { value: 0 },
      uPhase: { value: 0 },

      uDelta: { value: 1 / 60 },
      uSnap: { value: 0 },

      uAccent: { value: new THREE.Color(ACTS[0].accent) },
      uPearl: { value: new THREE.Color("#b8c0cb") },
      uAmber: { value: new THREE.Color("#c2a17a") },

      uTurbulence: { value: settings.turbulence },
      uPointerGain: { value: 0 },
      uPointer: { value: this.pointerLocal }
    };

    this.lightPositions = SPECIMENS.map(() =>
      new THREE.Vector3()
    );

    this.lightColors = SPECIMENS.map(() =>
      new THREE.Color()
    );

    this.render = this.render.bind(this);
  }

  async initialize() {
    this.onStatus("Preparing the rendering pipeline…");

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance"
    });

    if (
      !this.renderer.capabilities.isWebGL2 ||
      !this.renderer.extensions.has("EXT_color_buffer_float")
    ) {
      this.renderer.dispose();

      throw new Error(
        "This artwork requires WebGL 2 and floating-point render targets."
      );
    }

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = this.settings.exposure;

    this.renderer.info.autoReset = false;

    this.renderer.debug.onShaderError = (
      gl,
      program,
      vertexShader,
      fragmentShader
    ) => {
      const detail = [
        gl.getProgramInfoLog(program),
        gl.getShaderInfoLog(vertexShader),
        gl.getShaderInfoLog(fragmentShader)
      ].filter(Boolean).join("\n");

      throw new Error(`Shader compilation failed:\n${detail}`);
    };

    document.querySelector("#viewport").appendChild(
      this.renderer.domElement
    );

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#080b10");

    this.particleScene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      38,
      innerWidth / innerHeight,
      0.1,
      160
    );

    this.camera.filmGauge = 36;
    this.camera.setFocalLength(50);

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.particleRoot = new THREE.Group();
    this.particleScene.add(this.particleRoot);

    this.createEnvironment();
    this.createSculpture();
    this.createSpecimens();
    this.createForeground();

    await nextPaint();

    this.onStatus("Initializing persistent particle state…");

    this.createSimulation();
    this.createTargets();
    this.createParticles();
    this.createPostProcessing();

    await nextPaint();

    this.onStatus("Compiling the material and volume shaders…");

    this.resize();

    this.renderer.compile(this.scene, this.camera);
    this.renderer.compile(this.particleScene, this.camera);

    this.installLifecycle();

    this.running = true;
    this.previousTime = performance.now();

    this.invalidate();
  }

  createEnvironment() {
    const room = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(this.renderer);

    this.environment = generator.fromScene(room, 0.035);
    this.scene.environment = this.environment.texture;

    room.dispose();
    generator.dispose();

    this.scene.add(
      new THREE.HemisphereLight("#e4eaf2", "#10151e", 0.36)
    );

    const key = new THREE.DirectionalLight("#f2f0e8", 2.7);
    key.position.set(-3.5, 5, 5.5);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight("#bbc9da", 3.1);
    rim.position.set(4, 2.5, -4);
    this.scene.add(rim);

    const fill = new THREE.DirectionalLight("#a5b6ca", 0.55);
    fill.position.set(-5, -1, 3);
    this.scene.add(fill);

    this.coreLight = new THREE.PointLight("#b7d7cc", 1.2, 6, 2);
    this.coreLight.position.set(0, 0.2, 1.4);
    this.root.add(this.coreLight);
  }

  createSculpture() {
    const q = this.quality;

    const nucleusMaterial = new THREE.MeshPhysicalMaterial({
      color: "#dedfdc",
      metalness: 0.37,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.11,
      envMapIntensity: 0.9
    });

    patchPhysicalMaterial(
      nucleusMaterial,
      this.shared,
      false
    );

    this.nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.91,
        q.nucleusSegments,
        Math.round(q.nucleusSegments * 0.67)
      ),
      nucleusMaterial
    );

    this.root.add(this.nucleus);

    const membraneMaterial = new THREE.MeshPhysicalMaterial({
      color: "#bac6d0",
      metalness: 0.52,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.09,
      envMapIntensity: 0.85,
      side: THREE.DoubleSide
    });

    patchPhysicalMaterial(
      membraneMaterial,
      this.shared,
      true
    );

    this.membranes = new THREE.Mesh(
      createMembraneGeometry(
        q.membraneSegments,
        q.membraneAcross
      ),
      membraneMaterial
    );

    this.membranes.frustumCulled = false;
    this.root.add(this.membranes);

    const traceMaterial = new THREE.ShaderMaterial({
      uniforms: { ...this.shared },
      vertexShader: S.traceVertex,
      fragmentShader: S.traceFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.traces = new THREE.Mesh(
      createTraceGeometry(q.traceSegments),
      traceMaterial
    );

    this.traces.frustumCulled = false;
    this.root.add(this.traces);
  }

  createSpecimens() {
    const geometry = new THREE.SphereGeometry(1, 28, 20);

    this.nodes = SPECIMENS.map((specimen, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: "#d6dde3",
        emissive: "#c4d1dd",
        emissiveIntensity: 0.7,
        metalness: 0.22,
        roughness: 0.17
      });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.scale.setScalar(index === 0 ? 0.14 : 0.095);
      mesh.userData.specimen = index;

      this.root.add(mesh);

      let light = null;

      if (index % 2 === 0) {
        light = new THREE.PointLight("#b8cbd7", 1, 5, 2);
        this.root.add(light);
      }

      return {
        mesh,
        material,
        light,
        accepted: specimen.accepted
      };
    });
  }

  createForeground() {
    const count = this.qualityName === "light" ? 16 : 28;

    const geometry = new THREE.SphereGeometry(1, 16, 12);

    const material = new THREE.MeshStandardMaterial({
      color: "#596575",
      metalness: 0.4,
      roughness: 0.35,
      envMapIntensity: 0.4
    });

    this.foreground = new THREE.InstancedMesh(
      geometry,
      material,
      count
    );

    this.foreground.frustumCulled = false;

    const dummy = new THREE.Object3D();

    let seed = 17391;

    const random = () => {
      seed = (1664525 * seed + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1;

      dummy.position.set(
        side * (3.0 + random() * 3.0),
        (random() - 0.5) * 8.0,
        3.5 + random() * 3.0
      );

      dummy.scale.setScalar(
        0.035 + Math.pow(random(), 2.0) * 0.16
      );

      dummy.updateMatrix();

      this.foreground.setMatrixAt(i, dummy.matrix);
    }

    this.foreground.instanceMatrix.needsUpdate = true;
    this.root.add(this.foreground);
  }

  createSimulation() {
    const size = this.quality.simulationSize;

    this.gpu = new GPUComputationRenderer(
      size,
      size,
      this.renderer
    );

    this.gpu.setDataType(THREE.HalfFloatType);

    const positions = this.gpu.createTexture();
    const velocities = this.gpu.createTexture();

    let seed = 731993;

    const random = () => {
      seed = (1664525 * seed + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    for (let i = 0; i < size * size; i++) {
      const offset = i * 4;

      positions.image.data[offset] = (random() - 0.5) * 6;
      positions.image.data[offset + 1] = (random() - 0.5) * 6;
      positions.image.data[offset + 2] = (random() - 0.5) * 6;
      positions.image.data[offset + 3] = random();
    }

    this.positionVariable = this.gpu.addVariable(
      "texturePosition",
      S.simulationPosition,
      positions
    );

    this.velocityVariable = this.gpu.addVariable(
      "textureVelocity",
      S.simulationVelocity,
      velocities
    );

    const dependencies = [
      this.positionVariable,
      this.velocityVariable
    ];

    this.gpu.setVariableDependencies(
      this.positionVariable,
      dependencies
    );

    this.gpu.setVariableDependencies(
      this.velocityVariable,
      dependencies
    );

    Object.assign(
      this.positionVariable.material.uniforms,
      this.shared
    );

    Object.assign(
      this.velocityVariable.material.uniforms,
      this.shared
    );

    const error = this.gpu.init();

    if (error) {
      throw new Error(error);
    }

    this.shared.uSnap.value = 1;
    this.gpu.compute();
    this.shared.uSnap.value = 0;
  }

  createTargets() {
    this.beautyTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true
    });

    this.beautyTarget.texture.colorSpace =
      THREE.LinearSRGBColorSpace;

    this.beautyTarget.depthTexture = new THREE.DepthTexture(
      1,
      1,
      THREE.UnsignedIntType
    );

    this.particleTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      depthBuffer: false
    });

    this.volumeTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      depthBuffer: false
    });
  }

  createParticles() {
    const size = this.quality.simulationSize;
    const count = size * size;

    const lookup = new Float32Array(count * 2);
    const positions = new Float32Array(count * 3);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = y * size + x;

        lookup[index * 2] = (x + 0.5) / size;
        lookup[index * 2 + 1] = (y + 0.5) / size;
      }
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
      "aLookup",
      new THREE.BufferAttribute(lookup, 2)
    );

    const gl = this.renderer.getContext();
    const pointRange = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);

    this.particleUniforms = {
      ...this.shared,

      uPositions: {
        value: this.gpu.getCurrentRenderTarget(
          this.positionVariable
        ).texture
      },

      uDepth: {
        value: this.beautyTarget.depthTexture
      },

      uResolution: {
        value: new THREE.Vector2(1, 1)
      },

      uNear: { value: this.camera.near },
      uFar: { value: this.camera.far },

      uFocus: { value: 18 },
      uPixelScale: { value: 1000 },
      uMaxPoint: { value: Math.min(pointRange[1], 18) }
    };

    const material = new THREE.ShaderMaterial({
      uniforms: this.particleUniforms,
      vertexShader: S.particleVertex,
      fragmentShader: S.particleFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.particles.frustumCulled = false;

    this.particleRoot.add(this.particles);
  }

  createPostProcessing() {
    const q = this.quality;

    this.volumeMaterial = new THREE.ShaderMaterial({
      defines: {
        VOLUME_SAMPLES: q.volumeSamples
      },

      uniforms: {
        uDepth: {
          value: this.beautyTarget.depthTexture
        },

        uInverseProjection: {
          value: this.camera.projectionMatrixInverse
        },

        uCameraWorld: {
          value: this.camera.matrixWorld
        },

        uInverseRoot: {
          value: this.inverseRoot
        },

        uCameraPosition: {
          value: this.camera.position
        },

        uAccent: this.shared.uAccent,
        uTime: this.shared.uTime,

        uLightPositions: {
          value: this.lightPositions
        },

        uLightColors: {
          value: this.lightColors
        },

        uNear: { value: this.camera.near },
        uFar: { value: this.camera.far },
        uDensity: { value: this.settings.fog }
      },

      vertexShader: S.quadVertex,
      fragmentShader: S.volumeFragment,

      depthTest: false,
      depthWrite: false
    });

    this.quad = new FullScreenQuad(this.volumeMaterial);

    this.composer = new EffectComposer(
      this.renderer,
      new THREE.WebGLRenderTarget(1, 1, {
        type: THREE.HalfFloatType,
        depthBuffer: false
      })
    );

    this.composer.addPass(
      new TexturePass(this.beautyTarget.texture)
    );

    this.dof = makePass(
      S.dofFragment,
      {
        tDiffuse: { value: null },
        uDepth: { value: this.beautyTarget.depthTexture },

        uResolution: {
          value: new THREE.Vector2(1, 1)
        },

        uNear: { value: this.camera.near },
        uFar: { value: this.camera.far },

        uFocus: { value: 18 },
        uAperture: { value: this.settings.aperture }
      },
      {
        DOF_SAMPLES: q.dofSamples
      }
    );

    this.composer.addPass(this.dof);

    this.composite = makePass(
      S.compositeFragment,
      {
        tDiffuse: { value: null },
        uParticles: { value: this.particleTarget.texture },
        uVolume: { value: this.volumeTarget.texture }
      }
    );

    this.composer.addPass(this.composite);

    this.bloom = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      this.settings.bloom,
      0.66,
      1.18
    );

    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());

    this.fxaa = new ShaderPass(FXAAShader);
    this.composer.addPass(this.fxaa);

    this.grain = makePass(
      S.grainFragment,
      {
        tDiffuse: { value: null },
        uTime: this.shared.uTime,
        uGrain: { value: this.settings.grain }
      }
    );

    this.composer.addPass(this.grain);
  }

  resize() {
    if (this.disposed) return;

    this.width = innerWidth;
    this.height = innerHeight;
    this.compact = this.width <= 850;

    const q = this.quality;

    this.pixelRatio = Math.min(
      devicePixelRatio || 1,
      q.maxDPR,
      Math.sqrt(q.pixelBudget / (this.width * this.height))
    );

    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.getDrawingBufferSize(this.drawingSize);

    this.beautyTarget.setSize(
      this.drawingSize.x,
      this.drawingSize.y
    );

    this.particleTarget.setSize(
      this.drawingSize.x,
      this.drawingSize.y
    );

    this.volumeTarget.setSize(
      Math.max(1, Math.round(this.drawingSize.x * q.volumeScale)),
      Math.max(1, Math.round(this.drawingSize.y * q.volumeScale))
    );

    this.composer.setPixelRatio(this.pixelRatio);
    this.composer.setSize(this.width, this.height);

    this.camera.aspect = this.width / this.height;
    this.camera.setFocalLength(50);
    this.camera.updateProjectionMatrix();

    this.halfFovTangent = Math.tan(
      THREE.MathUtils.degToRad(this.camera.fov * 0.5)
    );

    this.baseDistance = Math.max(
      6.8 / (2 * this.halfFovTangent),
      (this.compact ? 6.8 : 13.4) /
        (2 * this.halfFovTangent * this.camera.aspect)
    );

    this.particleUniforms.uResolution.value.copy(
      this.drawingSize
    );

    this.particleUniforms.uPixelScale.value =
      this.drawingSize.y / (2 * this.halfFovTangent);

    this.dof.uniforms.uResolution.value.copy(this.drawingSize);

    this.fxaa.uniforms.resolution.value.set(
      1 / this.drawingSize.x,
      1 / this.drawingSize.y
    );

    this.dirty = true;
    this.invalidate();
  }

  setPhase(value) {
    this.targetPhase = clamp(value, 0, 4);
    this.dirty = true;
    this.invalidate();
  }

  setMotion(enabled) {
    this.motion = enabled;

    if (!enabled) {
      this.phase = this.targetPhase;
      this.pointerActive = false;
      this.accumulator = 0;
    }

    this.dirty = true;
    this.previousTime = performance.now();

    this.invalidate();
  }

  configure() {
    this.dirty = true;
    this.invalidate();
  }

  setPointer(clientX, clientY, active = true) {
    this.pointerNdc.set(
      clientX / this.width * 2 - 1,
      -(clientY / this.height) * 2 + 1
    );

    this.pointerActive = active;
    this.invalidate();
  }

  clearPointer() {
    this.pointerActive = false;
    this.invalidate();
  }

  select(index) {
    this.selected = index;
    this.dirty = true;
    this.invalidate();
  }

  pick(clientX, clientY) {
    this.pointerNdc.set(
      clientX / this.width * 2 - 1,
      -(clientY / this.height) * 2 + 1
    );

    this.raycaster.setFromCamera(
      this.pointerNdc,
      this.camera
    );

    const intersections = this.raycaster.intersectObjects(
      this.nodes.map(node => node.mesh),
      false
    );

    if (!intersections.length) return -1;

    // Avoid selecting a specimen through the nucleus.
    const coreCenter = this.nucleus.getWorldPosition(
      new THREE.Vector3()
    );

    const coreHit = this.raycaster.ray.intersectSphere(
      new THREE.Sphere(coreCenter, 0.91),
      new THREE.Vector3()
    );

    if (
      coreHit &&
      coreHit.distanceTo(this.raycaster.ray.origin) <
        intersections[0].distance
    ) {
      return -1;
    }

    return intersections[0].object.userData.specimen;
  }

  capture() {
    if (this.failed || this.disposed) {
      return Promise.reject(new Error("The renderer is unavailable."));
    }

    if (this.pendingCapture) {
      return Promise.reject(new Error("A capture is already in progress."));
    }

    return new Promise((resolve, reject) => {
      this.pendingCapture = { resolve, reject };
      this.invalidate();
    });
  }

  invalidate() {
    if (
      !this.frameId &&
      this.running &&
      !this.failed &&
      !this.disposed &&
      !this.contextLost &&
      !document.hidden
    ) {
      this.frameId = requestAnimationFrame(this.render);
    }
  }

  updateCamera() {
    const index = Math.min(3, Math.floor(this.phase));
    const blend = smoothstep(this.phase - index, 0, 1);

    const a = ACTS[index];
    const b = ACTS[index + 1];

    const distance = this.baseDistance * mix(
      a.distance,
      b.distance,
      blend
    );

    const yaw = mix(a.yaw, b.yaw, blend);

    this.camera.position.set(
      Math.sin(yaw) * distance,
      distance * 0.015,
      Math.cos(yaw) * distance
    );

    this.camera.lookAt(0, 0, 0);
    this.camera.updateMatrixWorld();

    const visibleHeight =
      2 * this.halfFovTangent * distance;

    const visibleWidth =
      visibleHeight * this.camera.aspect;

    this.cameraRight.copy(RIGHT)
      .applyQuaternion(this.camera.quaternion);

    this.cameraUp.copy(UP)
      .applyQuaternion(this.camera.quaternion);

    this.root.position.set(0, 0, 0)
      .addScaledVector(
        this.cameraRight,
        this.compact ? 0 : visibleWidth * 0.215
      )
      .addScaledVector(
        this.cameraUp,
        this.compact ? visibleHeight * 0.195 : 0.04
      );

    this.root.rotation.set(
      -0.08 + Math.sin(this.time * 0.07) * 0.025,
      this.time * 0.022 + this.phase * 0.065,
      -0.10 + Math.sin(this.time * 0.055) * 0.015
    );

    this.root.updateMatrixWorld(true);

    this.particleRoot.position.copy(this.root.position);
    this.particleRoot.quaternion.copy(this.root.quaternion);

    this.inverseRoot.copy(this.root.matrixWorld).invert();

    this.focusPoint.set(0, 0.2, 0)
      .applyMatrix4(this.root.matrixWorld)
      .applyMatrix4(this.camera.matrixWorldInverse);

    const focus = -this.focusPoint.z;

    this.dof.uniforms.uFocus.value = focus;
    this.particleUniforms.uFocus.value = focus;

    if (this.motion && this.pointerActive) {
      this.camera.getWorldDirection(this.cameraForward);

      this.interactionPlane.setFromNormalAndCoplanarPoint(
        this.cameraForward,
        this.root.position
      );

      this.raycaster.setFromCamera(
        this.pointerNdc,
        this.camera
      );

      const hit = this.raycaster.ray.intersectPlane(
        this.interactionPlane,
        this.temporary
      );

      if (hit) {
        this.pointerLocal.copy(hit)
          .applyMatrix4(this.inverseRoot);
      }
    } else {
      this.pointerLocal.set(100, 100, 100);
    }
  }

  updateSpecimens() {
    this.nodes.forEach((node, index) => {
      const angle =
        index / this.nodes.length * TAU +
        this.time * 0.085;

      const radius =
        2.70 +
        Math.sin(index * 1.7) * 0.25;

      const p = node.mesh.position;

      p.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.54,
        Math.sin(angle) * radius * 0.78
      );

      p.applyAxisAngle(
        new THREE.Vector3(0, 0, 1),
        -0.30
      );

      const integration = smoothstep(
        this.phase,
        2.5 + index * 0.025,
        3.5 + index * 0.025
      );

      const selected = this.selected === index;

      const tint = node.accepted
        ? this.shared.uAccent.value
        : this.shared.uAmber.value;

      node.material.color.copy(this.shared.uPearl.value)
        .lerp(tint, integration * 0.6);

      node.material.emissive.copy(this.shared.uPearl.value)
        .lerp(tint, integration);

      node.material.emissiveIntensity =
        0.65 +
        integration * (node.accepted ? 4.0 : 0.25) +
        (selected ? 2.0 : 0);

      const size = index === 0 ? 0.14 : 0.095;

      node.mesh.scale.setScalar(
        size * (selected ? 1.25 : 1)
      );

      this.lightPositions[index].copy(p);

      this.lightColors[index]
        .copy(node.material.emissive)
        .multiplyScalar(
          1.1 +
          integration * (node.accepted ? 5.0 : 0.3) +
          (selected ? 3.0 : 0)
        );

      if (node.light) {
        node.light.position.copy(p);
        node.light.color.copy(node.material.emissive);

        node.light.intensity =
          0.65 +
          integration * 4.5 +
          (selected ? 2.5 : 0);
      }
    });

    this.coreLight.color.copy(this.shared.uAccent.value);
    this.coreLight.intensity =
      1.0 + smoothstep(this.phase, 2, 4) * 1.2;
  }

  updateSettings() {
    const index = Math.min(3, Math.floor(this.phase));
    const blend = smoothstep(this.phase - index, 0, 1);

    this.rawAccent.lerpColors(
      this.palettes[index],
      this.palettes[index + 1],
      blend
    );

    const luminance =
      this.rawAccent.r * 0.2126 +
      this.rawAccent.g * 0.7152 +
      this.rawAccent.b * 0.0722;

    this.gray.setRGB(luminance, luminance, luminance);

    this.shared.uAccent.value
      .copy(this.gray)
      .lerp(this.rawAccent, this.settings.chroma);

    this.shared.uTime.value = this.time;
    this.shared.uPhase.value = this.phase;

    this.shared.uTurbulence.value =
      this.settings.turbulence;

    this.shared.uPointerGain.value =
      this.pointerActive && this.motion
        ? this.settings.pointer
        : 0;

    this.renderer.toneMappingExposure =
      this.settings.exposure;

    this.bloom.strength = this.settings.bloom;

    this.volumeMaterial.uniforms.uDensity.value =
      this.settings.fog;

    this.dof.uniforms.uAperture.value =
      this.settings.aperture;

    this.grain.uniforms.uGrain.value =
      this.settings.grain;
  }

  updateSimulation(delta) {
    if (!this.motion) {
      if (this.dirty) {
        this.shared.uSnap.value = 1;
        this.gpu.compute();
        this.shared.uSnap.value = 0;
      }
    } else {
      this.accumulator += delta * this.settings.speed;

      const step = 1 / 60;
      let iterations = 0;

      while (
        this.accumulator >= step &&
        iterations < 3
      ) {
        this.shared.uDelta.value = step;
        this.gpu.compute();

        this.accumulator -= step;
        iterations++;
      }

      if (iterations === 3) {
        this.accumulator %= step;
      }
    }

    this.particleUniforms.uPositions.value =
      this.gpu.getCurrentRenderTarget(
        this.positionVariable
      ).texture;
  }

  render(now) {
    this.frameId = 0;

    if (
      this.failed ||
      this.disposed ||
      this.contextLost ||
      document.hidden
    ) {
      return;
    }

    try {
      const rawDelta = Math.max(
        (now - this.previousTime) / 1000,
        0.0001
      );

      const delta = Math.min(rawDelta, 0.05);

      this.previousTime = now;

      this.onFrame(delta);

      if (this.motion) {
        this.time += delta * this.settings.speed;

        this.phase = mix(
          this.phase,
          this.targetPhase,
          1 - Math.exp(-5.5 * delta)
        );
      } else {
        this.phase = this.targetPhase;
      }

      this.renderer.info.reset();

      this.updateSettings();
      this.updateCamera();
      this.updateSpecimens();
      this.updateSimulation(delta);

      this.renderer.setRenderTarget(this.beautyTarget);
      this.renderer.render(this.scene, this.camera);

      // Particles have their own layer and test against the actual
      // opaque depth texture. Their blur does not inherit background depth.
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setRenderTarget(this.particleTarget);
      this.renderer.render(this.particleScene, this.camera);

      this.renderer.setRenderTarget(this.volumeTarget);
      this.quad.render(this.renderer);

      this.renderer.setRenderTarget(null);
      this.composer.render(delta);

      this.dirty = false;

      if (this.pendingCapture) {
        const request = this.pendingCapture;
        this.pendingCapture = null;

        // Read immediately after rendering; preserveDrawingBuffer is
        // intentionally not enabled for ordinary animation.
        this.renderer.domElement.toBlob(blob => {
          if (blob) {
            request.resolve(blob);
          } else {
            request.reject(new Error("The PNG could not be created."));
          }
        }, "image/png");
      }

      this.averageFrame = mix(
        this.averageFrame,
        Math.min(rawDelta, 0.25),
        0.035
      );

      this.statsTimer += delta;

      if (this.statsTimer > 0.6) {
        this.statsTimer = 0;

        this.onStats({
          fps: this.motion
            ? Math.round(1 / this.averageFrame)
            : null,

          particles:
            this.quality.simulationSize ** 2,

          calls: this.renderer.info.render.calls,

          width: this.drawingSize.x,
          height: this.drawingSize.y
        });
      }

      if (
        this.motion ||
        Math.abs(this.phase - this.targetPhase) > 0.0001
      ) {
        this.invalidate();
      }
    } catch (error) {
      this.failed = true;

      if (this.pendingCapture) {
        this.pendingCapture.reject(error);
        this.pendingCapture = null;
      }

      this.onError(error);
    }
  }

  installLifecycle() {
    const signal = this.events.signal;

    window.addEventListener("resize", () => {
      this.resize();
    }, { passive: true, signal });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(this.frameId);
        this.frameId = 0;
      } else {
        this.previousTime = performance.now();
        this.invalidate();
      }
    }, { signal });

    this.renderer.domElement.addEventListener(
      "webglcontextlost",
      event => {
        event.preventDefault();

        this.contextLost = true;

        cancelAnimationFrame(this.frameId);
        this.frameId = 0;

        this.onStatus(
          "The graphics context was interrupted. Waiting for restoration…"
        );
      },
      { signal }
    );

    this.renderer.domElement.addEventListener(
      "webglcontextrestored",
      () => {
        this.onStatus("Graphics restored. Rebuilding the archive…");
        location.reload();
      },
      { signal }
    );

    window.addEventListener("pagehide", event => {
      cancelAnimationFrame(this.frameId);
      this.frameId = 0;

      if (!event.persisted) {
        this.dispose();
      }
    }, { signal });

    window.addEventListener("pageshow", event => {
      if (event.persisted && !this.disposed) {
        this.previousTime = performance.now();
        this.resize();
      }
    }, { signal });
  }

  dispose() {
    if (this.disposed) return;

    this.disposed = true;
    this.running = false;

    cancelAnimationFrame(this.frameId);
    this.events.abort();

    if (this.pendingCapture) {
      this.pendingCapture.reject(
        new Error("The renderer was closed.")
      );

      this.pendingCapture = null;
    }

    const geometries = new Set();
    const materials = new Set();

    [this.scene, this.particleScene].forEach(scene => {
      scene?.traverse(object => {
        if (object.geometry) {
          geometries.add(object.geometry);
        }

        if (object.material) {
          const list = Array.isArray(object.material)
            ? object.material
            : [object.material];

          list.forEach(material => materials.add(material));
        }
      });
    });

    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());

    this.gpu?.dispose();

    this.composer?.passes.forEach(pass => {
      if (typeof pass.dispose === "function") {
        pass.dispose();
      }
    });

    this.composer?.dispose();

    this.quad?.dispose();
    this.volumeMaterial?.dispose();

    this.beautyTarget?.dispose();
    this.particleTarget?.dispose();
    this.volumeTarget?.dispose();

    this.environment?.dispose();
    this.renderer?.dispose();
  }
}