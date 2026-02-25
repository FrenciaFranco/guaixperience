"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment } from "@react-three/drei";
import * as THREE from "three";

const goldMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#b8860b"),
  metalness: 0.95,
  roughness: 0.15,
});

interface ScissorsModelProps {
  angle: number;
}

function ScissorsModel({ angle }: ScissorsModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/barbers_scissors.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = goldMaterial;
        child.frustumCulled = false;
      }
    });
  }, [scene]);

  // Play all baked animations
  useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (action) {
        action.reset().fadeIn(0.5).play();
        action.setLoop(THREE.LoopRepeat, Infinity);
      }
    });
  }, [actions]);

  useFrame((_, delta) => {
    if (group.current) {
      const target = THREE.MathUtils.degToRad(angle);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, target, Math.min(delta * 8, 1));
    }
  });

  return (
    <group ref={group}>
      <primitive
        object={scene}
        scale={0.8}
        position={[0, -1, 0]}
      />
    </group>
  );
}

useGLTF.preload("/barbers_scissors.glb");

interface GlobeProps {
  className?: string;
  angle?: number;
}

const Globe: React.FC<GlobeProps> = ({ className, angle = -24 }) => {
  return (
    <div className={className ?? "w-screen h-screen"}>
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 3, 16], fov: 45, near: 0.01, far: 200 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fff5e0" />
          <directionalLight position={[-3, -2, -4]} intensity={0.5} color="#ffd700" />
          <pointLight position={[0, 4, 2]} intensity={1} color="#ffeaaa" />
          <Suspense fallback={null}>
            <ScissorsModel angle={angle} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Globe;
