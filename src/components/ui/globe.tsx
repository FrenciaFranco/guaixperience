"use client";

import React, { Suspense, useRef, useEffect, useState } from "react";
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
  modelScale?: number;
}

function ScissorsModel({ angle, modelScale = 0.8 }: ScissorsModelProps) {
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
        scale={modelScale}
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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className={`${className ?? "w-screen h-screen"} pointer-events-none`}>
      <div className="w-full h-full pointer-events-none">
        <Canvas
          camera={{ position: [0, 3, 16], fov: 45, near: 0.01, far: 200 }}
          gl={{ antialias: !isDesktop, alpha: true, powerPreference: "high-performance" }}
          dpr={isDesktop ? [0.6, 0.8] : [1, 1.5]}
          style={{ background: "transparent", pointerEvents: "none" }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fff5e0" />
          <directionalLight position={[-3, -2, -4]} intensity={0.5} color="#ffd700" />
          <pointLight position={[0, 4, 2]} intensity={1} color="#ffeaaa" />
          <Suspense fallback={null}>
            <ScissorsModel angle={angle} modelScale={isDesktop ? 2.5 : 0.8} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Globe;
