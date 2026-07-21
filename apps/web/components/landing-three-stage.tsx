'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type SceneTarget = {
  rotX: number;
  rotY: number;
  rotZ: number;
  camX: number;
  camY: number;
  camZ: number;
};

const FIRST_VISIT_KEY = 'landing_stage_intro_seen';

function parseNumber(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim().length === 0) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function LandingThreeStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = mediaQuery.matches;
    let pageVisible = !document.hidden;
    let loaded = false;
    let rafId = 0;
    let observer: IntersectionObserver | null = null;
    let model: THREE.Object3D | null = null;
    let introPlayed = false;

    const current: SceneTarget = {
      rotX: 0.18,
      rotY: 0,
      rotZ: 0,
      camX: 0,
      camY: 0,
      camZ: 4.8
    };

    const target: SceneTarget = {
      rotX: 0.18,
      rotY: 0,
      rotZ: 0,
      camX: 0,
      camY: 0,
      camZ: 4.8
    };

    const pointer = { x: 0, y: 0 };
    const pointerLive = { x: 0, y: 0 };
    const triggers: ScrollTrigger[] = [];
    const clock = new THREE.Clock();

    const firstVisit = window.sessionStorage.getItem(FIRST_VISIT_KEY) !== '1';

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050814, 5, 11);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const ambient = new THREE.AmbientLight(0xffffff, 0.72);
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(2, 2, 3);
    const rim = new THREE.DirectionalLight(0x8ba7ff, 1.35);
    rim.position.set(-3, -1, -2);

    scene.add(ambient);
    scene.add(key);
    scene.add(rim);

    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const createFallbackModel = () => {
      if (model !== null) {
        return;
      }

      const geometry = new THREE.IcosahedronGeometry(1.05, 1);
      const material = new THREE.MeshStandardMaterial({
        color: '#6669b8',
        metalness: 0.12,
        roughness: 0.52,
        flatShading: true
      });
      const fallback = new THREE.Mesh(geometry, material);
      fallback.rotation.x = 0.2;
      model = fallback;
      stageGroup.add(fallback);
    };

    const applyPanelState = (panel: HTMLElement) => {
      gsap.to(target, {
        rotY: parseNumber(panel.dataset.rotY, target.rotY),
        rotX: parseNumber(panel.dataset.rotX, target.rotX),
        rotZ: parseNumber(panel.dataset.rotZ, target.rotZ),
        camX: parseNumber(panel.dataset.camX, target.camX),
        camY: parseNumber(panel.dataset.camY, target.camY),
        camZ: parseNumber(panel.dataset.camZ, target.camZ),
        duration: prefersReducedMotion ? 0.22 : 1.1,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    };

    const initScroll = () => {
      const panels = Array.from(document.querySelectorAll<HTMLElement>('.scene-panel'));

      if (prefersReducedMotion) {
        panels.forEach((panel) => {
          const trigger = ScrollTrigger.create({
            trigger: panel,
            start: 'top center',
            onEnter: () => applyPanelState(panel),
            onEnterBack: () => applyPanelState(panel)
          });
          triggers.push(trigger);
        });
        return;
      }

      const heroScrub = ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          target.rotX = 0.18 + self.progress * 0.08;
        }
      });
      triggers.push(heroScrub);

      panels.forEach((panel) => {
        const trigger = ScrollTrigger.create({
          trigger: panel,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => applyPanelState(panel),
          onEnterBack: () => applyPanelState(panel)
        });
        triggers.push(trigger);
      });
    };

    const initReveals = () => {
      const revealNodes = document.querySelectorAll<HTMLElement>('.reveal');

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }
            entry.target.classList.add('is-visible');
            observer?.unobserve(entry.target);
          });
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -10% 0px'
        }
      );

      revealNodes.forEach((node) => observer?.observe(node));
    };

    const playIntro = async () => {
      if (introPlayed) {
        return;
      }
      introPlayed = true;

      if (prefersReducedMotion || !firstVisit) {
        document.querySelectorAll<HTMLElement>('.hero .intro-reveal').forEach((node) => node.classList.add('is-visible'));
        if (firstVisit) {
          window.sessionStorage.setItem(FIRST_VISIT_KEY, '1');
        }
        return;
      }

      gsap.set(stageGroup.scale, { x: 0.86, y: 0.86, z: 0.86 });
      gsap.set('.hero .intro-reveal', { y: 30, autoAlpha: 0 });

      await new Promise<void>((resolve) => {
        const timeline = gsap.timeline({
          onComplete: resolve
        });

        timeline
          .to(stageGroup.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1.2,
            ease: 'power3.out'
          })
          .to(
            target,
            {
              rotY: 0.28,
              duration: 1.4,
              ease: 'power2.out'
            },
            0
          )
          .to(
            '.hero .intro-reveal',
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.11,
              ease: 'power3.out'
            },
            0.46
          );
      });

      window.sessionStorage.setItem(FIRST_VISIT_KEY, '1');
    };

    const tick = () => {
      const dt = Math.min(0.1, Math.max(0.001, clock.getDelta()));

      current.rotX = THREE.MathUtils.damp(current.rotX, target.rotX, 5, dt);
      current.rotY = THREE.MathUtils.damp(current.rotY, target.rotY, 5, dt);
      current.rotZ = THREE.MathUtils.damp(current.rotZ, target.rotZ, 5, dt);
      current.camX = THREE.MathUtils.damp(current.camX, target.camX, 4, dt);
      current.camY = THREE.MathUtils.damp(current.camY, target.camY, 4, dt);
      current.camZ = THREE.MathUtils.damp(current.camZ, target.camZ, 4, dt);
      pointerLive.x = THREE.MathUtils.damp(pointerLive.x, pointer.x, 6, dt);
      pointerLive.y = THREE.MathUtils.damp(pointerLive.y, pointer.y, 6, dt);

      camera.position.set(current.camX, current.camY, current.camZ);

      if (model !== null) {
        model.rotation.y = current.rotY + pointerLive.x * 0.08;
        model.rotation.x = current.rotX - pointerLive.y * 0.05;
        model.rotation.z = current.rotZ;
      }

      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!loaded || !pageVisible) {
        return;
      }
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      window.cancelAnimationFrame(rafId);
    };

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (pageVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      ScrollTrigger.refresh();
    };

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    mediaQuery.addEventListener('change', onMotionPreferenceChange);

    let bootComplete = false;

    const completeBoot = async () => {
      if (bootComplete) {
        return;
      }

      bootComplete = true;
      loaded = true;
      startLoop();
      await playIntro();
      initReveals();
      initScroll();
    };

    const loadModel = async () => {
      createFallbackModel();
      await completeBoot();
    };

    void loadModel();

    return () => {
      stopLoop();
      observer?.disconnect();
      triggers.forEach((trigger) => trigger.kill());
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      mediaQuery.removeEventListener('change', onMotionPreferenceChange);
      gsap.killTweensOf(target);
      gsap.killTweensOf(stageGroup.scale);
      gsap.killTweensOf('.hero .intro-reveal');

      scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) {
          return;
        }

        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose());
        } else {
          mesh.material?.dispose();
        }
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div className="landing-stage" aria-hidden="true">
      <canvas ref={canvasRef} className="landing-stage__canvas" />
    </div>
  );
}
