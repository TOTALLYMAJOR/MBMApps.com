'use client';

import { useEffect, useRef, type MouseEventHandler } from 'react';

type OperatingWorldSphereProps = {
  onOpenStudio: MouseEventHandler<HTMLButtonElement>;
  onOpenComponents: MouseEventHandler<HTMLButtonElement>;
};

export function OperatingWorldSphere({ onOpenStudio, onOpenComponents }: OperatingWorldSphereProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let animationFrame = 0;
    let disposeScene = () => {};

    import('three')
      .then((THREE) => {
        if (disposed) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
        camera.position.set(0, 0, 11.5);

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        host.appendChild(renderer.domElement);

        const world = new THREE.Group();
        world.position.x = -0.2;
        scene.add(world);

        const coreGeometry = new THREE.SphereGeometry(3.7, 48, 48);
        const coreMaterial = new THREE.MeshBasicMaterial({
          color: 0x030711,
          transparent: true,
          opacity: 0.88
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        world.add(core);

        const rear = new THREE.Group();
        const media = new THREE.Group();
        const front = new THREE.Group();
        const debris = new THREE.Group();
        world.add(rear, media, front, debris);

        const cubeGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.18, 0.18, 0.18));
        const cubes: Array<{
          line: InstanceType<typeof THREE.LineSegments>;
          base: InstanceType<typeof THREE.Vector3>;
          direction: InstanceType<typeof THREE.Vector3>;
          seed: number;
          front: boolean;
          azimuth: number;
        }> = [];

        const cubeCount = reducedMotion ? 560 : 1380;
        for (let index = 0; index < cubeCount; index += 1) {
          const yUnit = 1 - (2 * (index + 0.5)) / cubeCount;
          const angle = Math.PI * (3 - Math.sqrt(5)) * index;
          const radius = 3.82 + (Math.random() - 0.5) * 0.4;
          const radial = Math.sqrt(1 - yUnit * yUnit);
          const base = new THREE.Vector3(
            Math.cos(angle) * radial * radius,
            yUnit * radius,
            Math.sin(angle) * radial * radius
          );
          const isFront = base.z > 0;
          const material = new THREE.LineBasicMaterial({
            color: index % 19 === 0 ? 0xe8efff : isFront ? 0x7186e8 : 0x36456f,
            transparent: true,
            opacity: isFront ? 0.25 : 0.06,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });
          const line = new THREE.LineSegments(cubeGeometry, material);
          line.position.copy(base);
          line.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
          line.scale.setScalar(0.55 + Math.random() * 1.15);
          (isFront ? front : rear).add(line);
          cubes.push({
            line,
            base,
            direction: base.clone().normalize(),
            seed: Math.random() * 20,
            front: isFront,
            azimuth: Math.atan2(base.y, base.x)
          });
        }

        function createPanelTexture(title: string, rows: string[], accent: string) {
          const canvas = document.createElement('canvas');
          canvas.width = 768;
          canvas.height = 440;
          const context = canvas.getContext('2d');
          if (!context) return null;

          const gradient = context.createRadialGradient(390, 210, 10, 390, 210, 390);
          gradient.addColorStop(0, '#aebbd0');
          gradient.addColorStop(0.25, '#4b5d77');
          gradient.addColorStop(1, '#020407');
          context.fillStyle = gradient;
          context.fillRect(0, 0, canvas.width, canvas.height);

          context.fillStyle = accent;
          context.font = '700 27px monospace';
          context.fillText(title, 34, 54);
          context.font = '16px monospace';
          context.fillStyle = '#e6ebf7';
          rows.forEach((row, index) => context.fillText(row, 36, 112 + index * 39));

          context.globalAlpha = 0.3;
          for (let index = 0; index < 34; index += 1) {
            context.fillRect(
              Math.random() * 700,
              80 + Math.random() * 320,
              40 + Math.random() * 180,
              1
            );
          }
          context.globalAlpha = 1;

          const texture = new THREE.CanvasTexture(canvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          return texture;
        }

        const productPanels = [
          {
            title: 'QUIETPILOT',
            rows: ['lead → quote → proposal', 'payment_verified', 'staffing  8/10', 'inventory  blocked'],
            accent: '#f0f3ff'
          },
          {
            title: 'LEAGUEPILOT',
            rows: ['practice  18:30', 'rsvp  14/17', 'coach  verified', 'field  ready'],
            accent: '#d5ddff'
          },
          {
            title: 'QUOTEFLOW',
            rows: ['proposal  #1048', 'customer  approved', 'payment  pending', 'production  queued'],
            accent: '#f4d28b'
          }
        ];

        const panelMeshes: Array<InstanceType<typeof THREE.Mesh>> = [];
        productPanels.forEach((panel, panelIndex) => {
          const radius = 4.2 - panelIndex * 0.3;
          const geometry = new THREE.PlaneGeometry(
            4.5 - panelIndex * 0.25,
            2.6 - panelIndex * 0.12,
            36,
            12
          );
          const positions = geometry.attributes.position;
          if (!positions) return;

          for (let index = 0; index < positions.count; index += 1) {
            const x = positions.getX(index);
            const y = positions.getY(index);
            const theta = x / radius;
            positions.setXYZ(index, Math.sin(theta) * radius, y, radius - Math.cos(theta) * radius);
          }
          positions.needsUpdate = true;
          geometry.computeVertexNormals();

          const texture = createPanelTexture(panel.title, panel.rows, panel.accent);
          const material = new THREE.MeshBasicMaterial({
            map: texture ?? undefined,
            color: texture ? 0xffffff : 0x6173a8,
            transparent: true,
            opacity: 0.28 - panelIndex * 0.04,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(-0.1 + panelIndex * 0.08, (panelIndex - 1) * 0.12, -0.6 + panelIndex * 0.68);
          mesh.rotation.y = -0.08 + panelIndex * 0.06;
          media.add(mesh);
          panelMeshes.push(mesh);
        });

        const shards: Array<{
          mesh: InstanceType<typeof THREE.Mesh>;
          base: InstanceType<typeof THREE.Vector3>;
          direction: InstanceType<typeof THREE.Vector3>;
          seed: number;
        }> = [];
        const shardCount = reducedMotion ? 0 : 58;
        for (let index = 0; index < shardCount; index += 1) {
          const geometry = new THREE.PlaneGeometry(
            0.13 + Math.random() * 0.28,
            0.08 + Math.random() * 0.2
          );
          const material = new THREE.MeshBasicMaterial({
            color: index % 7 === 0 ? 0xe7efff : 0x6688dd,
            transparent: true,
            opacity: 0,
            wireframe: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });
          const mesh = new THREE.Mesh(geometry, material);
          const yUnit = Math.random() * 1.7 - 0.85;
          const angle = Math.random() * Math.PI * 2;
          const radius = 3.5 + Math.random() * 0.55;
          const radial = Math.sqrt(1 - yUnit * yUnit);
          const base = new THREE.Vector3(
            Math.cos(angle) * radial * radius,
            yUnit * radius,
            Math.sin(angle) * radial * radius
          );
          mesh.position.copy(base);
          mesh.lookAt(0, 0, 0);
          mesh.rotateY(Math.PI);
          debris.add(mesh);
          shards.push({
            mesh,
            base,
            direction: base.clone().normalize(),
            seed: Math.random() * 20
          });
        }

        const starGeometry = new THREE.BufferGeometry();
        const starCount = reducedMotion ? 380 : 950;
        const starPositions = new Float32Array(starCount * 3);
        for (let index = 0; index < starCount; index += 1) {
          starPositions[index * 3] = (Math.random() - 0.5) * 20;
          starPositions[index * 3 + 1] = (Math.random() - 0.5) * 13;
          starPositions[index * 3 + 2] = -2 - Math.random() * 12;
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
          color: 0x7588d9,
          size: 0.022,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        let pointerX = 0;
        let pointerY = 0;
        let isVisible = true;
        let pageVisible = !document.hidden;

        const handlePointer = (event: PointerEvent) => {
          pointerX = event.clientX / window.innerWidth - 0.5;
          pointerY = event.clientY / window.innerHeight - 0.5;
        };
        window.addEventListener('pointermove', handlePointer, { passive: true });

        const handleVisibility = () => {
          pageVisible = !document.hidden;
        };
        document.addEventListener('visibilitychange', handleVisibility);

        const intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            isVisible = entry?.isIntersecting ?? true;
          },
          { rootMargin: '120px' }
        );
        intersectionObserver.observe(host);

        const resize = () => {
          const width = Math.max(1, host.clientWidth);
          const height = Math.max(1, host.clientHeight);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        resize();

        const clock = new THREE.Clock();
        const animate = () => {
          if (disposed) return;
          animationFrame = requestAnimationFrame(animate);
          if (!isVisible || !pageVisible) return;

          const time = clock.getElapsedTime();
          const pulse = 0.5 + 0.5 * Math.sin(time * 1.45);

          if (!reducedMotion) {
            world.rotation.y += 0.0017;
            world.rotation.x += (-pointerY * 0.04 - world.rotation.x) * 0.025;
            world.position.x += (pointerX * 0.07 - 0.2 - world.position.x) * 0.025;
            stars.rotation.y = time * 0.0016;
          }

          cubes.forEach((cube, index) => {
            let displacement = 0.007 * Math.sin(time * 0.85 + cube.seed);
            displacement += index % 9 === 0 ? 0.021 * pulse : 0;

            cube.line.position
              .copy(cube.base)
              .add(cube.direction.clone().multiplyScalar(displacement));

            const material = cube.line.material as InstanceType<typeof THREE.LineBasicMaterial>;
            material.opacity =
              (cube.front ? 0.17 : 0.045) +
              (cube.front ? 0.12 : 0.03) * pulse +
              (cube.front ? 0.02 : 0.006);
          });

          panelMeshes.forEach((mesh, index) => {
            const material = mesh.material as InstanceType<typeof THREE.MeshBasicMaterial>;
            const target = Math.max(0.07, 0.19 - index * 0.025);
            material.opacity += (target - material.opacity) * 0.045;
            mesh.position.y += (
              (index - 1) * 0.12 +
              Math.sin(time * 0.3 + index) * 0.02 -
              mesh.position.y
            ) * 0.03;
          });

          shards.forEach((shard) => {
            const burst = 0.02 * Math.sin(time * 1.2 + shard.seed);
            shard.mesh.position
              .copy(shard.base)
              .add(shard.direction.clone().multiplyScalar(burst));
            shard.mesh.rotation.z += 0.001 * Math.sin(shard.seed);
            (shard.mesh.material as InstanceType<typeof THREE.MeshBasicMaterial>).opacity =
              0.08;
          });

          const scale = 1 + 0.0035 * pulse;
          world.scale.setScalar(scale);
          renderer.render(scene, camera);
        };
        animate();

        const handleContextLost = (event: Event) => {
          event.preventDefault();
          host.dataset.failed = 'true';
        };
        renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

        disposeScene = () => {
          cancelAnimationFrame(animationFrame);
          intersectionObserver.disconnect();
          resizeObserver.disconnect();
          window.removeEventListener('pointermove', handlePointer);
          document.removeEventListener('visibilitychange', handleVisibility);
          renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

          cubes.forEach(({ line }) => {
            (line.material as InstanceType<typeof THREE.Material>).dispose();
          });
          panelMeshes.forEach((mesh) => {
            mesh.geometry.dispose();
            const material = mesh.material as InstanceType<typeof THREE.MeshBasicMaterial>;
            material.map?.dispose();
            material.dispose();
          });
          shards.forEach(({ mesh }) => {
            mesh.geometry.dispose();
            (mesh.material as InstanceType<typeof THREE.Material>).dispose();
          });
          cubeGeometry.dispose();
          coreGeometry.dispose();
          coreMaterial.dispose();
          starGeometry.dispose();
          starMaterial.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch((error) => {
        console.error('Operating world failed to initialize', error);
        host.dataset.failed = 'true';
      });

    return () => {
      disposed = true;
      disposeScene();
    };
  }, []);

  return (
    <div className="operating-world" aria-label="Interactive MBMApps operating-world visualization">
      <div ref={hostRef} className="operating-world__canvas" aria-hidden="true" />
      <div className="operating-world__hud">
        <p className="terminal-command">
          <span>~/mbmapps</span> $ open --navigation
        </p>
        <div className="operating-world__modes">
          <button type="button" onClick={onOpenStudio} aria-keyshortcuts="u">
            <span>[u]</span>
            <strong>studio</strong>
            <small>open component studio</small>
          </button>
          <button type="button" onClick={onOpenComponents} aria-keyshortcuts="k">
            <span>[k]</span>
            <strong>components</strong>
            <small>open component index</small>
          </button>
        </div>
      </div>
    </div>
  );
}
