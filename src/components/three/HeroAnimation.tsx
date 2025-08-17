'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Center, Html } from '@react-three/drei';
import { Points as ThreePoints, Color } from 'three';

function OrbitingPoints() {
  const ref = useRef<ThreePoints>(null!);
  const timeRef = useRef(0);
  
  // Generate performance-optimized point cloud (max 8000 points)
  const [positions, colors] = useMemo(() => {
    const count = Math.min(8000, Math.max(3000, (typeof window !== 'undefined' ? window.innerWidth * 2 : 6000)));
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Create multiple orbital rings around the center
    const rings = 5;
    const blueColor = new Color('#0066FF');
    const whiteColor = new Color('#ffffff');
    const darkColor = new Color('#333333');
    
    for (let i = 0; i < count; i++) {
      const ring = Math.floor(i / (count / rings));
      const angle = (i / (count / rings)) * Math.PI * 2;
      const radius = 3 + ring * 1.5;
      const height = (Math.random() - 0.5) * 2;
      
      // Position points in orbital rings
      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5;
      
      // Color gradient: blue for closer rings, fading to white/dark
      const color = ring < 2 ? blueColor : 
                   ring < 4 ? whiteColor : darkColor;
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    
    timeRef.current += 0.01;
    
    // Smooth orbital rotation
    ref.current.rotation.y = timeRef.current * 0.1;
    ref.current.rotation.x = Math.sin(timeRef.current * 0.05) * 0.1;
    
    // Gentle floating motion
    ref.current.position.y = Math.sin(timeRef.current * 0.2) * 0.2;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={2} // AdditiveBlending
      />
    </Points>
  );
}

function ConnectingLines() {
  const linesRef = useRef<ThreePoints>(null!);
  const timeRef = useRef(0);

  const [positions, colors] = useMemo(() => {
    const lineCount = 200;
    const positions = new Float32Array(lineCount * 6); // 2 points per line * 3 coords
    const colors = new Float32Array(lineCount * 6);
    const blueColor = new Color('#0066FF');
    const fadeColor = new Color('#0066FF').multiplyScalar(0.3);
    
    for (let i = 0; i < lineCount; i++) {
      // Random start and end points within orbital space
      const startRadius = 2 + Math.random() * 4;
      const endRadius = 3 + Math.random() * 5;
      const startAngle = Math.random() * Math.PI * 2;
      const endAngle = startAngle + (Math.random() - 0.5) * Math.PI * 0.5;
      
      // Start point
      positions[i * 6] = Math.cos(startAngle) * startRadius;
      positions[i * 6 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 6 + 2] = Math.sin(startAngle) * startRadius;
      
      // End point
      positions[i * 6 + 3] = Math.cos(endAngle) * endRadius;
      positions[i * 6 + 4] = (Math.random() - 0.5) * 2;
      positions[i * 6 + 5] = Math.sin(endAngle) * endRadius;
      
      // Gradient colors from blue to fade
      colors[i * 6] = blueColor.r;
      colors[i * 6 + 1] = blueColor.g;
      colors[i * 6 + 2] = blueColor.b;
      colors[i * 6 + 3] = fadeColor.r;
      colors[i * 6 + 4] = fadeColor.g;
      colors[i * 6 + 5] = fadeColor.b;
    }
    
    return [positions, colors];
  }, []);

  useFrame(() => {
    if (!linesRef.current) return;
    
    timeRef.current += 0.01;
    linesRef.current.rotation.y = timeRef.current * -0.05;
  });

  return (
    <Points ref={linesRef} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.005}
        sizeAttenuation={true}
        depthWrite={false}
        blending={2}
        opacity={0.6}
      />
    </Points>
  );
}

function CentralText() {
  return (
    <Center>
      <Float
        speed={0.5}
        rotationIntensity={0.1}
        floatIntensity={0.2}
      >
        <group>
          {/* Use Text component instead of Text3D for better performance and no font dependencies */}
          <mesh position={[0, 0.2, 0]}>
            <planeGeometry args={[4, 0.8]} />
            <meshBasicMaterial 
              transparent 
              opacity={0}
            />
            <Html
              center
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#0066FF',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textShadow: '0 0 20px rgba(255, 0, 170, 0.5)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              SOL:GEN
            </Html>
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <planeGeometry args={[3, 0.4]} />
            <meshBasicMaterial 
              transparent 
              opacity={0}
            />
            <Html
              center
              style={{
                fontSize: '24px',
                fontWeight: 'normal',
                color: '#ffffff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              for startups™
            </Html>
          </mesh>
        </group>
      </Float>
    </Center>
  );
}

interface HeroAnimationProps {
  className?: string;
}

export default function HeroAnimation({ className }: HeroAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisible = useRef(true);

  // Performance optimization: pause on tab blur
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div className={`relative w-full h-[500px] ${className || ''}`}>
      <Canvas
        ref={canvasRef}
        camera={{ 
          position: [0, 0, 10], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)} // Cap device pixel ratio for performance
        performance={{ min: 0.5 }}
        frameloop={isVisible.current ? 'always' : 'never'}
        gl={{ 
          antialias: false, // Disable antialiasing for performance
          alpha: true,
          preserveDrawingBuffer: false
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#0066FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        <OrbitingPoints />
        <ConnectingLines />
        <CentralText />
      </Canvas>
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
    </div>
  );
}