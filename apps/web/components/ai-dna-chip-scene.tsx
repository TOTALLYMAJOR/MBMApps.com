'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Group, MathUtils } from 'three';

type HelixPoint = {
  id: number;
  angle: number;
  y: number;
  radius: number;
};

function DnaChipHelix() {
  const helixRef = useRef<Group>(null);
  const points = useMemo<HelixPoint[]>(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        angle: index * 0.52,
        y: (index - 13.5) * 0.24,
        radius: 1.1 + Math.sin(index * 0.4) * 0.05
      })),
    []
  );

  useFrame((state, delta) => {
    if (helixRef.current === null) {
      return;
    }

    helixRef.current.rotation.y += delta * 0.28;
    helixRef.current.rotation.x = MathUtils.lerp(
      helixRef.current.rotation.x,
      Math.sin(state.clock.elapsedTime * 0.45) * 0.14,
      0.035
    );
  });

  return (
    <group ref={helixRef} position={[0, -0.12, 0]}>
      {points.map((point) => {
        const leftX = Math.cos(point.angle) * point.radius;
        const leftZ = Math.sin(point.angle) * point.radius;
        const rightX = -leftX;
        const rightZ = -leftZ;
        const connectorLength = point.radius * 2;

        return (
          <group key={point.id}>
            <mesh position={[leftX, point.y, leftZ]} rotation={[0.35, point.angle, 0.12]}>
              <boxGeometry args={[0.34, 0.09, 0.34]} />
              <meshStandardMaterial
                color={point.id % 2 === 0 ? '#75ccff' : '#8ef3cd'}
                emissive={point.id % 2 === 0 ? '#1d8fff' : '#36d9a4'}
                emissiveIntensity={0.52}
                metalness={0.72}
                roughness={0.2}
              />
            </mesh>

            <mesh position={[rightX, point.y, rightZ]} rotation={[-0.34, point.angle + Math.PI, -0.12]}>
              <boxGeometry args={[0.34, 0.09, 0.34]} />
              <meshStandardMaterial
                color={point.id % 2 === 0 ? '#8ef3cd' : '#75ccff'}
                emissive={point.id % 2 === 0 ? '#36d9a4' : '#1d8fff'}
                emissiveIntensity={0.52}
                metalness={0.72}
                roughness={0.2}
              />
            </mesh>

            <mesh position={[0, point.y, 0]} rotation={[0, point.angle, 0]}>
              <boxGeometry args={[connectorLength, 0.03, 0.05]} />
              <meshStandardMaterial color="#b9d8ff" emissive="#7bb2ff" emissiveIntensity={0.25} roughness={0.35} metalness={0.5} />
            </mesh>
          </group>
        );
      })}

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.03, 12, 100]} />
        <meshStandardMaterial color="#66b6ff" emissive="#1d8fff" emissiveIntensity={0.32} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export function AIDnaChipScene() {
  return (
    <div className="pointer-events-none hidden lg:block motion-reduce:hidden">
      <div className="relative h-[360px] w-[320px] overflow-hidden rounded-[28px] border border-white/15 bg-slate-950/45 shadow-panel backdrop-blur-[2px]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-black/30" />
        <div className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-black/25 px-3 py-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">AI Genome Mesh</p>
        </div>
        <Canvas camera={{ position: [0, 0, 5.4], fov: 36 }} dpr={[1, 1.8]} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={0.46} />
          <pointLight position={[4, 6, 5]} intensity={2.2} color="#7ac5ff" />
          <pointLight position={[-4, -3, 3]} intensity={1.5} color="#4df3c4" />
          <DnaChipHelix />
        </Canvas>
      </div>
    </div>
  );
}
