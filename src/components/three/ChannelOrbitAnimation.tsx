'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Ring, Float } from '@react-three/drei'
import * as THREE from 'three'

// Channel data with icons and colors
const channels = [
  { name: 'Google Ads', icon: '🔍', color: '#4285F4', radius: 3, speed: 0.5 },
  { name: 'LinkedIn', icon: '💼', color: '#0077B5', radius: 3.5, speed: 0.3 },
  { name: 'Email', icon: '📧', color: '#EA4335', radius: 2.8, speed: 0.7 },
  { name: 'Facebook', icon: '👥', color: '#1877F2', radius: 4, speed: 0.4 },
  { name: 'Content', icon: '📝', color: '#00C851', radius: 2.5, speed: 0.6 },
  { name: 'SEO', icon: '🎯', color: '#FF6F00', radius: 3.2, speed: 0.45 },
  { name: 'Webinars', icon: '🎥', color: '#9C27B0', radius: 3.8, speed: 0.35 },
  { name: 'Partners', icon: '🤝', color: '#00BCD4', radius: 2.9, speed: 0.55 },
]

function ChannelNode({ channel, index }: { channel: typeof channels[0], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const angle = useRef((Math.PI * 2 * index) / channels.length)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Orbit animation
      angle.current += channel.speed * 0.01
      meshRef.current.position.x = Math.cos(angle.current) * channel.radius
      meshRef.current.position.z = Math.sin(angle.current) * channel.radius
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.3
      
      // Gentle rotation
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Channel sphere */}
        <Sphere args={[0.3, 32, 32]}>
          <meshStandardMaterial
            color={channel.color}
            emissive={channel.color}
            emissiveIntensity={0.3}
            metalness={0.3}
            roughness={0.2}
          />
        </Sphere>
        
        {/* Channel label */}
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.woff"
        >
          {channel.name}
        </Text>
        
        {/* Channel icon */}
        <Text
          position={[0, 0, 0.31]}
          fontSize={0.25}
          anchorX="center"
          anchorY="middle"
        >
          {channel.icon}
        </Text>
      </Float>
    </group>
  )
}

function ConnectionLines() {
  const linesRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  const lines = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const points: THREE.Vector3[] = []
    
    // Create connections between channels
    channels.forEach((channel, i) => {
      const nextChannel = channels[(i + 1) % channels.length]
      const angle1 = (Math.PI * 2 * i) / channels.length
      const angle2 = (Math.PI * 2 * ((i + 1) % channels.length)) / channels.length
      
      points.push(
        new THREE.Vector3(
          Math.cos(angle1) * channel.radius,
          0,
          Math.sin(angle1) * channel.radius
        ),
        new THREE.Vector3(
          Math.cos(angle2) * nextChannel.radius,
          0,
          Math.sin(angle2) * nextChannel.radius
        )
      )
    })
    
    geometry.setFromPoints(points)
    return geometry
  }, [])
  
  return (
    <group ref={linesRef}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#6366f1" opacity={0.2} transparent />
      </lineSegments>
    </group>
  )
}

function CentralHub() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime) * 0.05)
    }
  })
  
  return (
    <group>
      {/* Central sphere */}
      <Sphere ref={meshRef} args={[0.8, 64, 64]}>
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.1}
        />
      </Sphere>
      
      {/* Orbital rings */}
      <Ring args={[2.3, 2.35, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#6366f1" opacity={0.2} transparent />
      </Ring>
      <Ring args={[3.3, 3.35, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#6366f1" opacity={0.15} transparent />
      </Ring>
      <Ring args={[4.3, 4.35, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#6366f1" opacity={0.1} transparent />
      </Ring>
      
      {/* Central text */}
      <Text
        position={[0, 0, 0.81]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        20k+
      </Text>
      <Text
        position={[0, -0.25, 0.81]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        Channels
      </Text>
    </group>
  )
}

export function ChannelOrbitAnimation() {
  return (
    <div className="w-full h-[600px] relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-indigo-600/20 rounded-2xl" />
      
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
        
        {/* Central hub */}
        <CentralHub />
        
        {/* Connection lines */}
        <ConnectionLines />
        
        {/* Channel nodes */}
        {channels.map((channel, index) => (
          <ChannelNode key={channel.name} channel={channel} index={index} />
        ))}
        
        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Overlay text */}
      <div className="absolute top-8 left-8 space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Active Distribution Channels</h2>
        <p className="text-gray-600">Watch your startup's channels work in real-time</p>
      </div>
    </div>
  )
}