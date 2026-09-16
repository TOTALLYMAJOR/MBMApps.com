'use client';

import { useEffect, useRef } from 'react';

const MODE_SEQUENCE = [
  {
    id: 'observe',
    index: '01',
    label: 'observe',
    detail: 'chaotic sphere · disconnected fragments · unstructured operational information',
    note: 'Map the real operation.'
  },
  {
    id: 'verify',
    index: '02',
    label: 'verify',
    detail: 'false relationships disappear · evidence nodes illuminate · unknown states become visible',
    note: 'Separate claims from proof.'
  },
  {
    id: 'ship',
    index: '03',
    label: 'ship',
    detail: 'fragments rapidly assemble · structured geometry emerges',
    note: 'Build the operating surface.'
  },
  {
    id: 'prove',
    index: '04',
    label: 'prove',
    detail: 'sphere locks together · connections illuminate · final proof pulse',
    note: 'Keep the proof register.'
  }
] as const;

export type OperatingWorldMode = (typeof MODE_SEQUENCE)[number]['id'];

type OperatingWorldSphereProps = {
  mode?: OperatingWorldMode;
  progress?: number;
  onModeChange?: (mode: OperatingWorldMode) => void;
  compact?: boolean;
  showControls?: boolean;
};

export function OperatingWorldSphere({
  mode = 'observe',
  progress,
  onModeChange,
  compact = false,
  showControls = true
}: OperatingWorldSphereProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress ?? MODE_SEQUENCE.findIndex((item) => item.id === mode));

  useEffect(() => {
    if (progress === undefined) {
      progressRef.current = MODE_SEQUENCE.findIndex((item) => item.id === mode);
    }
  }, [mode, progress]);

  useEffect(() => {
    if (progress !== undefined) progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let stopped = false;
    let frame = 0;
    let cleanup = () => {};

    async function boot() {
      const THREE = await import('three');
      if (stopped || !mount) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x03050d, 0.05);

      const camera = new THREE.PerspectiveCamera(compact ? 48 : 45, 1, 0.1, 100);
      camera.position.set(0, 0, compact ? 12.4 : 11.6);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 0.75 : 0.85));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;
      mount.appendChild(renderer.domElement);

      const world = new THREE.Group();
      world.position.set(compact ? 0 : -0.18, 0, 0);
      scene.add(world);

      const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x07101b,
        transparent: true,
        opacity: 0.72
      });
      const core = new THREE.Mesh(new THREE.SphereGeometry(3.72, 28, 24), coreMaterial);
      world.add(core);

      const rear = new THREE.Group();
      const media = new THREE.Group();
      const front = new THREE.Group();
      const evidence = new THREE.Group();
      world.add(rear, media, front, evidence);

      const cubeSourceGeometry = new THREE.BoxGeometry(0.18, 0.18, 0.18);
      const cubeEdgeGeometry = new THREE.EdgesGeometry(cubeSourceGeometry);
      const cubeCount = reducedMotion ? 220 : compact ? 380 : 560;
      const cubeData: Array<{
        base: InstanceType<typeof THREE.Vector3>;
        rotation: InstanceType<typeof THREE.Euler>;
        scale: number;
        front: boolean;
      }> = [];

      for (let i = 0; i < cubeCount; i += 1) {
        const u = 1 - (2 * (i + 0.5)) / cubeCount;
        const phi = Math.PI * (3 - Math.sqrt(5)) * i;
        const radius = 3.84 + (Math.random() - 0.5) * 0.42;
        const ring = Math.sqrt(1 - u * u);
        const base = new THREE.Vector3(
          Math.cos(phi) * ring * radius,
          u * radius,
          Math.sin(phi) * ring * radius
        );
        const frontFacing = base.z > 0;
        cubeData.push({
          base,
          rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
          scale: 0.52 + Math.random() * 1.22,
          front: frontFacing
        });
      }

      const frontCubeData = cubeData.filter((cube) => cube.front);
      const rearCubeData = cubeData.filter((cube) => !cube.front);
      const frontCubeMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const rearCubeMaterial = new THREE.LineBasicMaterial({
        color: 0xdcecff,
        transparent: true,
        opacity: 0.09,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const cubeMatrix = new THREE.Matrix4();
      const cubeQuaternion = new THREE.Quaternion();
      const cubeScale = new THREE.Vector3();
      const cubeVertex = new THREE.Vector3();
      const sourcePositions = cubeEdgeGeometry.attributes.position;
      if (!sourcePositions) throw new Error('Cube edge geometry is missing its position attribute.');
      const mergeCubeEdges = (data: typeof cubeData) => {
        const positions = new Float32Array(data.length * sourcePositions.count * 3);
        data.forEach((cube, index) => {
          cubeQuaternion.setFromEuler(cube.rotation);
          cubeScale.setScalar(cube.scale);
          cubeMatrix.compose(cube.base, cubeQuaternion, cubeScale);
          for (let vertexIndex = 0; vertexIndex < sourcePositions.count; vertexIndex += 1) {
            cubeVertex
              .fromBufferAttribute(sourcePositions, vertexIndex)
              .applyMatrix4(cubeMatrix);
            const targetIndex = (index * sourcePositions.count + vertexIndex) * 3;
            positions[targetIndex] = cubeVertex.x;
            positions[targetIndex + 1] = cubeVertex.y;
            positions[targetIndex + 2] = cubeVertex.z;
          }
        });
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.computeBoundingSphere();
        return geometry;
      };
      const frontCubeGeometry = mergeCubeEdges(frontCubeData);
      const rearCubeGeometry = mergeCubeEdges(rearCubeData);
      const frontCubes = new THREE.LineSegments(frontCubeGeometry, frontCubeMaterial);
      const rearCubes = new THREE.LineSegments(rearCubeGeometry, rearCubeMaterial);
      cubeEdgeGeometry.dispose();
      cubeSourceGeometry.dispose();
      front.add(frontCubes);
      rear.add(rearCubes);

      function makeTexture(title: string, rows: string[], accent: string) {
        const canvas = document.createElement('canvas');
        canvas.width = 768;
        canvas.height = 440;
        const ctx = canvas.getContext('2d')!;
        const gradient = ctx.createRadialGradient(390, 210, 8, 390, 210, 390);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.22, accent);
        gradient.addColorStop(0.5, '#75839a');
        gradient.addColorStop(1, '#020407');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 28px monospace';
        ctx.fillText(title, 34, 56);
        ctx.font = '16px monospace';
        rows.forEach((row, index) => ctx.fillText(row, 36, 118 + index * 40));
        ctx.globalAlpha = 0.28;
        for (let i = 0; i < 36; i += 1) {
          ctx.fillRect(Math.random() * 690, 82 + Math.random() * 300, 45 + Math.random() * 190, 1);
        }
        return new THREE.CanvasTexture(canvas);
      }

      const panels = [
        ['QUIETPILOT', ['lead → quote → proposal', 'payment_verified', 'staffing  8/10', 'inventory  blocked'], '#dce4ff'],
        ['LEAGUEPILOT', ['practice  18:30', 'rsvp  14/17', 'coach  verified', 'field  ready'], '#e6ecff'],
        ['QUOTEFLOW', ['proposal  #1048', 'customer  approved', 'payment  pending', 'production  queued'], '#fff4de']
      ] as const;

      const mediaPanels: Array<InstanceType<typeof THREE.Mesh>> = [];
      const activePanels = compact ? panels : [];
      activePanels.forEach(([title, rows, accent], index) => {
        const radius = 4.22 - index * 0.3;
        const geometry = new THREE.PlaneGeometry(4.5 - index * 0.25, 2.58 - index * 0.12, 20, 8);
        const position = geometry.attributes.position;
        if (!position) return;
        for (let i = 0; i < position.count; i += 1) {
          const x = position.getX(i);
          const y = position.getY(i);
          const theta = x / radius;
          position.setXYZ(i, Math.sin(theta) * radius, y, radius - Math.cos(theta) * radius);
        }
        position.needsUpdate = true;

        const mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({
            map: makeTexture(title, [...rows], accent),
            transparent: true,
            opacity: 0.28 - index * 0.04,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
          })
        );
        mesh.position.set(-0.08 + index * 0.08, (index - 1) * 0.12, -0.62 + index * 0.68);
        mesh.rotation.y = -0.08 + index * 0.06;
        media.add(mesh);
        mediaPanels.push(mesh);
      });

      const evidenceNodes: Array<InstanceType<typeof THREE.Mesh>> = [];
      for (let i = 0; i < 18; i += 1) {
        const a = Math.random() * Math.PI * 2;
        const u = Math.random() * 1.6 - 0.8;
        const radius = 3.0 + Math.random() * 0.6;
        const ring = Math.sqrt(1 - u * u);
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.045 + Math.random() * 0.035, 8, 8),
          new THREE.MeshBasicMaterial({
            color: 0xf8fbff,
            transparent: true,
            opacity: 0.08
          })
        );
        mesh.position.set(Math.cos(a) * ring * radius, u * radius, Math.sin(a) * ring * radius);
        evidence.add(mesh);
        evidenceNodes.push(mesh);
      }

      const evidenceLinks: Array<InstanceType<typeof THREE.Line>> = [];
      for (let i = 0; i < evidenceNodes.length; i += 1) {
        const current = evidenceNodes[i];
        const next = evidenceNodes[(i + 3) % evidenceNodes.length];
        if (!current || !next) continue;
        const geometry = new THREE.BufferGeometry().setFromPoints([
          current.position.clone(),
          next.position.clone()
        ]);
        const material = new THREE.LineBasicMaterial({
          color: 0xf8fbff,
          transparent: true,
          opacity: 0.015,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const line = new THREE.Line(geometry, material);
        evidence.add(line);
        evidenceLinks.push(line);
      }

      const proofRings: Array<InstanceType<typeof THREE.Mesh>> = [];
      [3.15, 3.42, 3.68].forEach((radius, index) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.008 + index * 0.004, 6, 72),
          new THREE.MeshBasicMaterial({
            color: 0xf8fbff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          })
        );
        ring.rotation.set(
          Math.PI * (0.28 + index * 0.16),
          Math.PI * (0.16 + index * 0.21),
          index * 0.42
        );
        evidence.add(ring);
        proofRings.push(ring);
      });


      const authorityBoundaries: Array<InstanceType<typeof THREE.Mesh>> = [];
      const boundarySpecs: Array<{ radius: number; rotation: readonly [number, number, number] }> = [
        { radius: 2.72, rotation: [Math.PI * 0.42, Math.PI * 0.08, 0.18] },
        { radius: 3.02, rotation: [Math.PI * 0.22, Math.PI * 0.54, 0.72] }
      ];
      boundarySpecs.forEach((spec, index) => {
        const boundary = new THREE.Mesh(
          new THREE.TorusGeometry(spec.radius, 0.006 + index * 0.003, 6, 80),
          new THREE.MeshBasicMaterial({
            color: 0xf8fbff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          })
        );
        boundary.rotation.set(spec.rotation[0], spec.rotation[1], spec.rotation[2]);
        evidence.add(boundary);
        authorityBoundaries.push(boundary);
      });

      const starGeometry = new THREE.BufferGeometry();
      const starCount = reducedMotion ? 220 : 600;
      const starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i += 1) {
        starPositions[i * 3] = (Math.random() - 0.5) * 20;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 13;
        starPositions[i * 3 + 2] = -2 - Math.random() * 12;
      }
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const stars = new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({
          color: 0xf4f9ff,
          size: 0.022,
          transparent: true,
          opacity: 0.34,
          blending: THREE.AdditiveBlending
        })
      );
      scene.add(stars);

      let pointerX = 0;
      let pointerY = 0;
      let pointerVelocity = 0;
      let energy = 0.34;

      const handlePointerMove = (event: PointerEvent) => {
        const rect = mount.getBoundingClientRect();
        const nextX = (event.clientX - rect.left) / rect.width - 0.5;
        const nextY = (event.clientY - rect.top) / rect.height - 0.5;
        pointerVelocity = Math.min(1, Math.hypot(nextX - pointerX, nextY - pointerY) * 8);
        pointerX = nextX;
        pointerY = nextY;
      };
      mount.addEventListener('pointermove', handlePointerMove);

      const resize = () => {
        const width = Math.max(1, mount.offsetWidth);
        const height = Math.max(1, mount.offsetHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;

        // Fit the complete operating world to the smaller screen dimension.
        // Perspective cameras use vertical FOV, so portrait containers need
        // additional distance to keep the sphere inside the horizontal frame.
        const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
        const fitRadius = compact ? 4.75 : 5.1;
        const verticalDistance = fitRadius / Math.tan(halfFov);
        const horizontalDistance = verticalDistance / camera.aspect;
        camera.position.z = Math.max(verticalDistance, horizontalDistance) + (compact ? 1.2 : 0.7);
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(mount);
      resize();

      let documentVisible = document.visibilityState !== 'hidden';
      let inViewport = true;
      const handleVisibility = () => {
        documentVisible = document.visibilityState !== 'hidden';
      };
      document.addEventListener('visibilitychange', handleVisibility);

      const viewportObserver = new IntersectionObserver(
        ([entry]) => {
          inViewport = entry?.isIntersecting ?? true;
        },
        { rootMargin: '120px 0px', threshold: 0.01 }
      );
      viewportObserver.observe(mount);

      const timer = new THREE.Timer();
      const frameInterval = reducedMotion ? 1000 / 10 : 1000 / 30;
      let lastRenderAt = 0;

      const animate = (now = 0) => {
        if (stopped) return;
        frame = window.requestAnimationFrame(animate);
        if (!documentVisible || !inViewport) return;
        if (now - lastRenderAt < frameInterval) return;
        lastRenderAt = now;

        timer.update();
        const t = timer.getElapsed();
        const visualProgress = Math.max(0, Math.min(3, progressRef.current));
        const weightFor = (index: number) => Math.max(0, 1 - Math.abs(visualProgress - index));
        const observeWeight = weightFor(0);
        const verifyWeight = weightFor(1);
        const shipWeight = weightFor(2);
        const proveWeight = weightFor(3);
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.55 + visualProgress);

        pointerVelocity *= 0.9;
        energy += (Math.max(0.28, pointerVelocity) - energy) * 0.08;
        const reactive = energy * 0.8 + pulse * 0.28;

        world.rotation.y += 0.002 + pointerVelocity * 0.009 + observeWeight * 0.0005 + shipWeight * 0.00025;
        world.rotation.x += ((-pointerY * 0.07) - world.rotation.x) * 0.032;
        world.position.x += ((((compact ? 0 : -0.18) + pointerX * 0.14)) - world.position.x) * 0.045;
        world.position.y += ((-pointerY * 0.08) - world.position.y) * 0.035;
        world.scale.setScalar(1 + pulse * 0.006 + pointerVelocity * 0.018);

        frontCubeMaterial.opacity =
          0.2 + 0.08 * pulse + verifyWeight * 0.07 + shipWeight * 0.05 + proveWeight * 0.11;
        rearCubeMaterial.opacity = 0.045 + 0.025 * pulse + proveWeight * 0.055;
        frontCubes.rotation.x += 0.00035 + pointerVelocity * 0.0008;
        frontCubes.rotation.y += 0.00024 + pointerVelocity * 0.0006;
        rearCubes.rotation.x -= 0.00012;
        rearCubes.rotation.y += 0.0001;

        mediaPanels.forEach((panel, index) => {
          const material = panel.material as InstanceType<typeof THREE.MeshBasicMaterial>;
          const emphasis =
            observeWeight * 0.25 +
            verifyWeight * 0.34 +
            shipWeight * 0.42 +
            proveWeight * 0.32;
          material.opacity += (emphasis - index * 0.035 - material.opacity) * 0.05;
          panel.scale.setScalar(1 + (0.012 + shipWeight * 0.008) * pulse + pointerVelocity * 0.012);
        });

        evidenceNodes.forEach((node, index) => {
          const material = node.material as InstanceType<typeof THREE.MeshBasicMaterial>;
          const targetOpacity =
            0.02 +
            verifyWeight * (0.08 + (index % 4 === 0 ? 0.28 * pulse : 0.08)) +
            proveWeight * (0.26 + 0.12 * pulse);
          material.opacity += (targetOpacity - material.opacity) * 0.09;

          const targetScale =
            0.6 +
            verifyWeight * (0.4 + 0.45 * pulse) +
            proveWeight * (0.55 + 0.2 * pulse);
          node.scale.setScalar(targetScale);
        });

        evidenceLinks.forEach((line, index) => {
          const material = line.material as InstanceType<typeof THREE.LineBasicMaterial>;
          const verifyOpacity =
            0.012 +
            verifyWeight * (index % 3 === 0 ? 0.33 + 0.22 * pulse : 0.07) +
            shipWeight * (0.05 + 0.04 * pulse) +
            proveWeight * (0.41 + 0.26 * pulse);
          material.opacity += (verifyOpacity - material.opacity) * 0.1;
        });

        proofRings.forEach((ring, index) => {
          const material = ring.material as InstanceType<typeof THREE.MeshBasicMaterial>;
          const targetOpacity =
            verifyWeight * 0.025 +
            proveWeight * (0.22 + (0.32 + index * 0.05) * pulse);
          material.opacity += (targetOpacity - material.opacity) * 0.11;
          ring.rotation.z += (0.0004 + proveWeight * 0.0014) * (index + 1);
          const ringScale =
            0.96 +
            proveWeight * (0.04 + 0.025 * Math.sin(t * 2.2 + index * 0.8) + 0.018 * pointerVelocity);
          ring.scale.setScalar(ringScale);
        });

        authorityBoundaries.forEach((boundary, index) => {
          const material = boundary.material as InstanceType<typeof THREE.MeshBasicMaterial>;
          const targetOpacity =
            verifyWeight * (0.08 + index * 0.025) +
            shipWeight * (0.16 + index * 0.035) +
            proveWeight * (0.26 + index * 0.05 + 0.08 * pulse);
          material.opacity += (targetOpacity - material.opacity) * 0.1;
          boundary.rotation.z += (0.0005 + shipWeight * 0.0007 + proveWeight * 0.0012) * (index + 1);
        });

        coreMaterial.opacity =
          0.82 -
          reactive * 0.08 -
          shipWeight * 0.06 -
          proveWeight * (0.12 + 0.06 * pulse);
        stars.rotation.y = t * 0.0016;
        renderer.render(scene, camera);
      };

      animate();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        mount.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('visibilitychange', handleVisibility);
        viewportObserver.disconnect();
        frontCubeGeometry.dispose();
        rearCubeGeometry.dispose();
        frontCubeMaterial.dispose();
        rearCubeMaterial.dispose();
        mediaPanels.forEach((panel) => {
          panel.geometry.dispose();
          const material = panel.material as InstanceType<typeof THREE.MeshBasicMaterial>;
          material.map?.dispose();
          material.dispose();
        });
        evidenceNodes.forEach((node) => {
          node.geometry.dispose();
          (node.material as InstanceType<typeof THREE.Material>).dispose();
        });
        evidenceLinks.forEach((line) => {
          line.geometry.dispose();
          (line.material as InstanceType<typeof THREE.Material>).dispose();
        });
        proofRings.forEach((ring) => {
          ring.geometry.dispose();
          (ring.material as InstanceType<typeof THREE.Material>).dispose();
        });
        authorityBoundaries.forEach((boundary) => {
          boundary.geometry.dispose();
          (boundary.material as InstanceType<typeof THREE.Material>).dispose();
        });
        starGeometry.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    boot().catch(() => {
      mount.dataset.failed = 'true';
    });

    return () => {
      stopped = true;
      cleanup();
    };
  }, [compact]);

  return (
    <div className={`operating-world ${compact ? 'operating-world--compact' : ''}`} aria-label="Interactive MBMApps operating-world visualization">
      <div ref={mountRef} className="operating-world__canvas" aria-hidden="true" />
      {showControls ? <div className="operating-world__hud">
        <p className="terminal-command"><span>~/mbmapps</span> $ inspect --operating-world</p>
        <div className="operating-world__story">
          <p>Observe → Verify → Ship → Prove</p>
          <strong>The object becomes the method.</strong>
        </div>
        <div className="operating-world__modes">
          {MODE_SEQUENCE.map((item) => (
            <button
              key={item.id}
              type="button"
              className={mode === item.id ? 'is-active' : ''}
              onPointerEnter={() => onModeChange?.(item.id)}
              onFocus={() => onModeChange?.(item.id)}
              onClick={() => onModeChange?.(item.id)}
            >
              <span>{item.index}</span>
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
              <em>{item.note}</em>
            </button>
          ))}
        </div>
        <a
          className="operating-world__simulator-link"
          href="/nexamind-agentic-demo/index.html"
          target="_blank"
          rel="noreferrer"
        >
          <span>Try Interactive Simulator</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div> : null}
    </div>
  );
}
