"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function GlobeParticles() {
  const pointsRef = useRef<THREE.Points | null>(null);

  const geometry = useMemo(() => {
    const count = 11000;
    const radius = 3.15;

    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x =
        radius * Math.sin(phi) * Math.cos(theta);

      const y =
        radius * Math.cos(phi);

      const z =
        radius * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    return geometry;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += delta * 0.045;
    pointsRef.current.rotation.x += delta * 0.006;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.015}
        sizeAttenuation
        color="#dfe3e1"
        transparent
        opacity={0.72}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleGlobe() {
  return (
    <div className="particle-globe">
      <Canvas
        camera={{
          position: [0, 0, 7.8],
          fov: 43,
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} />

        <GlobeParticles />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate
          autoRotate={false}
          rotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}