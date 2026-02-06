import React, { useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';

// Rotating wireframe sphere
function WireframeSphere() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial 
        color="#00f5ff" 
        wireframe={true}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
}

// Inner rotating sphere (opposite direction)
function InnerSphere() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x -= delta * 0.15;
      meshRef.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.8, 0]} />
      <meshBasicMaterial 
        color="#00f5ff" 
        wireframe={true}
        transparent={true}
        opacity={0.5}
      />
    </mesh>
  );
}

// Floating particles around the orb
function Particles({ count = 100 }) {
  const meshRef = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 1.5;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f5ff"
        size={0.05}
        transparent={true}
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Pulsing glow ring
function GlowRing() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
      meshRef.current.rotation.z += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.8, 0.02, 16, 100]} />
      <meshBasicMaterial 
        color="#00f5ff" 
        transparent={true}
        opacity={0.4}
      />
    </mesh>
  );
}

export default function HolographicOrb({ size = 250 }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <WireframeSphere />
        <InnerSphere />
        <Particles count={80} />
        <GlowRing />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
});
