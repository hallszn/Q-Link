import React, { useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

// Conditionally import Three.js deps (web only)
let Canvas, useFrame;
try {
  if (Platform.OS === 'web') {
    const fiber = require('@react-three/fiber');
    Canvas = fiber.Canvas;
    useFrame = fiber.useFrame;
  }
} catch (e) {
  console.warn('Three.js not available:', e.message);
}

// Rotating wireframe icosahedron
function WireframeOrb() {
  const meshRef = useRef();
  const innerMeshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.25;
    }
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x -= delta * 0.1;
      innerMeshRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Outer wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial 
          color="#00f5ff" 
          wireframe={true} 
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      {/* Inner wireframe for depth */}
      <mesh ref={innerMeshRef}>
        <icosahedronGeometry args={[1.0, 0]} />
        <meshBasicMaterial 
          color="#00f5ff" 
          wireframe={true} 
          transparent={true}
          opacity={0.4}
        />
      </mesh>
      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial 
          color="#00f5ff" 
          transparent={true}
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

// Floating particles
function Particles({ count = 80 }) {
  const particlesRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 1.5;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05;
      particlesRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00f5ff"
        transparent={true}
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Orbital rings
function OrbitalRings() {
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.01, 8, 64]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.2, 0.01, 8, 64]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Main 3D scene
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} color="#00f5ff" intensity={2} />
      <WireframeOrb />
      <Particles count={80} />
      <OrbitalRings />
    </>
  );
}

// Native fallback component
function NativeFallback({ size }) {
  return (
    <View style={[styles.fallback, { width: size, height: size }]}>
      <Text style={styles.glyph}>◈</Text>
      <Text style={styles.label}>Q-Link</Text>
    </View>
  );
}

// Exported component with platform detection
export default function HolographicOrb({ size = 300 }) {
  const isWeb = Platform.OS === 'web';
  const hasThree = Canvas && useFrame;

  // Use native fallback if not web or Three.js unavailable
  if (!isWeb || !hasThree) {
    return <NativeFallback size={size} />;
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  fallback: {
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 150,
    borderWidth: 2,
    borderColor: '#00f5ff',
  },
  glyph: {
    fontSize: 80,
    color: '#00f5ff',
    textShadowColor: '#00f5ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  label: {
    fontSize: 14,
    color: '#00f5ff',
    marginTop: 10,
    letterSpacing: 2,
  },
});
