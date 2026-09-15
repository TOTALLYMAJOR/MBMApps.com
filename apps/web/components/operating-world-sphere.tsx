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
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.45 : 1.8));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.22;
      mount.appendChild(renderer.domElement);

      const world = new THREE.Group();
      world.position.set(compact ? 0 : -0.18, 0, 0);
      scene.add(world);

      const ambient = new THREE.AmbientLight(0xffffff, 0.65);
      const pointA = new THREE.PointLight(0xffffff, 11, 18);
      const pointB = new THREE.PointLight(0xe0e7ff, 7, 15);
      pointA.position.set(-3.5, 2.4, 4.1);
      pointB.position.set(0.9, -2.2, 3.4);
      scene.add(ambient, pointA, pointB);

      const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x07101b,
        transparent: true,
        opacity: 0.72
      });
      const core = new THREE.Mesh(new THREE.SphereGeometry(3.72, 48, 48), coreMaterial);
      world.add(core);

      const rear = new THREE.Group();
      const media = new THREE.Group();
      const front = new THREE.Group();
      const evidence = new THREE.Group();
      world.add(rear, media, front, evidence);

      const edgeGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.18, 0.18, 0.18));
      const cubes: Array<InstanceType<typeof THREE.LineSegments>> = [];
      const cubeCount = reducedMotion ? 450 : compact ? 800 : 1500;

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
        const dir = base.clone().normalize();
        const frontFacing = base.z > 0;
        const material = new THREE.LineBasicMaterial({
          color: frontFacing ? 0xffffff : 0xdcecff,
          transparent: true,
          opacity: frontFacing ? 0.4 : 0.13,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const cube = new THREE.LineSegments(edgeGeometry, material);
        cube.position.copy(base);
        cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        cube.scale.setScalar(0.52 + Math.random() * 1.22);
        cube.userData = {
          base,
          dir,
          seed: Math.random() * 20,
          front: frontFacing
        };
        (frontFacing ? front : rear).add(cube);
        cubes.push(cube);
      }

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
      panels.forEach(([title, rows, accent], index) => {
        const radius = 4.22 - index * 0.3;
        const geometry = new THREE.PlaneGeometry(4.5 - index * 0.25, 2.58 - index * 0.12, 36, 12);
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
          new THREE.SphereGeometry(0.045 + Math.random() * 0.035, 12, 12),
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
          new THREE.TorusGeometry(radius, 0.008 + index * 0.004, 8, 160),
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
          new THREE.TorusGeometry(spec.radius, 0.006 + index * 0.003, 8, 180),
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
      const starCount = reducedMotion ? 420 : 1200;
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
        const fitRadius = compact ? 4.35 : 4.6;
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

      const animate = () => {
        if (stopped) return;
        frame = window.requestAnimationFrame(animate);
        if (!documentVisible || !inViewport) return;

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

        cubes.forEach((cube, index) => {
          const data = cube.userData;
          let radial = 0.012 * Math.sin(t * 0.9 + data.seed) + pointerVelocity * 0.11 * Math.sin(t * 3 + data.seed);

          radial *= 1 - 0.8 * proveWeight;
          radial += observeWeight * (0.05 * Math.sin(t * 1.75 + data.seed) + 0.03 * Math.cos(t * 1.2 + data.base.y));
          radial += verifyWeight * ((index % 7 === 0 ? 0.085 * pulse : 0) - (index % 6 === 0 ? 0.02 : 0));
          radial += shipWeight * (0.028 * Math.sin(t * 2.6 + data.base.y) - 0.055);

          cube.position.copy(data.base).add(data.dir.clone().multiplyScalar(radial));
          cube.rotation.x += 0.0005 + pointerVelocity * 0.0018;
          cube.rotation.y += 0.00035 + pointerVelocity * 0.0012;

          const material = cube.material as InstanceType<typeof THREE.LineBasicMaterial>;
          const baseOpacity = data.front ? 0.18 : 0.05;
          const verifyBoost = verifyWeight * (index % 9 === 0 ? 0.18 : 0);
          const shipBoost = shipWeight * 0.08;
          const proveBoost = proveWeight * 0.16;
          material.opacity =
            baseOpacity +
            (data.front ? 0.15 : 0.04) * pulse +
            verifyBoost +
            shipBoost +
            proveBoost +
            pointerVelocity * (data.front ? 0.28 : 0.08);

          const white = Math.min(1, 0.9 + reactive * 0.1 + proveWeight * 0.08);
          material.color.setRGB(white, white, 1);
        });

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
        const proofPulse = proveWeight * (0.5 + 0.5 * Math.sin(t * 3.2));
        pointA.intensity = 10 + reactive * 16 + proveWeight * 12 + 18 * proofPulse;
        pointB.intensity = 7 + reactive * 10 + verifyWeight * 5 + 10 * proofPulse;
        renderer.toneMappingExposure = 1.18 + reactive * 0.28 + proveWeight * 0.18 + 0.32 * proofPulse;

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
        cubes.forEach((cube) => (cube.material as InstanceType<typeof THREE.Material>).dispose());
        edgeGeometry.dispose();
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
