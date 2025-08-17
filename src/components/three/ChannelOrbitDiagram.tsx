'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Html } from '@react-three/drei';
import { Points as ThreePoints, Color } from 'three';

// Mock data structure for channels
interface ChannelData {
  id: string;
  name: string;
  meetingsPerDay: number;
  paybackBand: 'high' | 'medium' | 'low' | 'negative';
  position: [number, number, number];
}

// Color mapping for payback bands
const PAYBACK_COLORS = {
  high: '#10b981', // Green
  medium: '#f59e0b', // Amber
  low: '#8b5cf6', // Purple
  negative: '#ef4444' // Red
};

function ChannelPoints({ channels }: { channels: ChannelData[] }) {
  const ref = useRef<ThreePoints>(null!);
  const timeRef = useRef(0);
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);

  const [positions, colors] = useMemo(() => {
    const count = channels.length;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    channels.forEach((channel, i) => {
      // Position
      positions[i * 3] = channel.position[0];
      positions[i * 3 + 1] = channel.position[1];
      positions[i * 3 + 2] = channel.position[2];
      
      // Color based on payback band
      const color = new Color(PAYBACK_COLORS[channel.paybackBand]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Size based on meetings per day (normalized to 0.02-0.08 range)
      // const normalizedSize = Math.max(0.02, Math.min(0.08, channel.meetingsPerDay / 50));
      // sizes[i] = normalizedSize;
    });
    
    return [positions, colors];
  }, [channels]);

  useFrame(() => {
    if (!ref.current) return;
    
    timeRef.current += 0.01;
    
    // Gentle rotation
    ref.current.rotation.z = Math.sin(timeRef.current * 0.1) * 0.05;
  });

  return (
    <>
      <Points ref={ref} positions={positions} colors={colors}>
        <PointMaterial
          transparent
          vertexColors
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          blending={2}
        />
      </Points>
      
      {/* Interactive overlay for hover effects */}
      {channels.map((channel) => (
        <mesh
          key={channel.id}
          position={channel.position}
          onPointerEnter={() => setHoveredChannel(channel.id)}
          onPointerLeave={() => setHoveredChannel(null)}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} />
          
          {hoveredChannel === channel.id && (
            <Html
              position={[0, 0.2, 0]}
              center
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                border: `1px solid ${PAYBACK_COLORS[channel.paybackBand]}`
              }}
            >
              <div>
                <div className="font-medium">{channel.name}</div>
                <div className="text-xs opacity-80">
                  {channel.meetingsPerDay} meetings/day
                </div>
                <div 
                  className="text-xs capitalize"
                  style={{ color: PAYBACK_COLORS[channel.paybackBand] }}
                >
                  {channel.paybackBand} payback
                </div>
              </div>
            </Html>
          )}
        </mesh>
      ))}
    </>
  );
}

function OrbitRings() {
  const ringsRef = useRef<ThreePoints>(null!);
  
  const ringPositions = useMemo(() => {
    const rings = 5;
    const pointsPerRing = 100;
    const totalPoints = rings * pointsPerRing;
    const positions = new Float32Array(totalPoints * 3);
    
    for (let ring = 0; ring < rings; ring++) {
      const radius = 1 + ring * 0.8;
      
      for (let i = 0; i < pointsPerRing; i++) {
        const angle = (i / pointsPerRing) * Math.PI * 2;
        const index = ring * pointsPerRing + i;
        
        positions[index * 3] = Math.cos(angle) * radius;
        positions[index * 3 + 1] = 0;
        positions[index * 3 + 2] = Math.sin(angle) * radius;
      }
    }
    
    return positions;
  }, []);

  return (
    <Points ref={ringsRef} positions={ringPositions}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.003}
        sizeAttenuation={true}
        opacity={0.2}
        depthWrite={false}
      />
    </Points>
  );
}

interface ChannelOrbitDiagramProps {
  className?: string;
  data?: ChannelData[];
}

export default function ChannelOrbitDiagram({ 
  className, 
  data = [] 
}: ChannelOrbitDiagramProps) {
  
  // Generate mock data if none provided
  const channels = useMemo((): ChannelData[] => {
    if (data.length > 0) return data;
    
    const mockChannels: ChannelData[] = [
      // Center ring - high performers
      { id: '1', name: 'LinkedIn Outreach', meetingsPerDay: 12, paybackBand: 'high', position: [0.8, 0, 0] },
      { id: '2', name: 'Email Campaigns', meetingsPerDay: 8, paybackBand: 'high', position: [-0.8, 0, 0] },
      { id: '3', name: 'Referral Program', meetingsPerDay: 15, paybackBand: 'high', position: [0, 0, 0.8] },
      
      // Second ring - medium performers  
      { id: '4', name: 'Cold Calling', meetingsPerDay: 6, paybackBand: 'medium', position: [1.4, 0, 0.7] },
      { id: '5', name: 'Content Marketing', meetingsPerDay: 4, paybackBand: 'medium', position: [-1.2, 0, -1.0] },
      { id: '6', name: 'Webinars', meetingsPerDay: 3, paybackBand: 'medium', position: [0.5, 0, -1.6] },
      { id: '7', name: 'Social Media', meetingsPerDay: 5, paybackBand: 'medium', position: [-0.8, 0, 1.4] },
      
      // Third ring - low performers
      { id: '8', name: 'Trade Shows', meetingsPerDay: 2, paybackBand: 'low', position: [2.1, 0, 0.4] },
      { id: '9', name: 'Print Ads', meetingsPerDay: 1, paybackBand: 'low', position: [-1.8, 0, -1.2] },
      { id: '10', name: 'Radio Spots', meetingsPerDay: 1, paybackBand: 'negative', position: [0.2, 0, -2.3] },
      
      // Outer ring - experimental
      { id: '11', name: 'Podcast Ads', meetingsPerDay: 3, paybackBand: 'low', position: [-2.5, 0, 0.8] },
      { id: '12', name: 'Influencer Marketing', meetingsPerDay: 2, paybackBand: 'medium', position: [1.2, 0, -2.0] },
      { id: '13', name: 'Partnership Channel', meetingsPerDay: 7, paybackBand: 'high', position: [0.1, 0, 2.8] },
      
      // Scattered additional channels
      { id: '14', name: 'Direct Mail', meetingsPerDay: 1, paybackBand: 'negative', position: [2.8, 0, -0.5] },
      { id: '15', name: 'SEO/Organic', meetingsPerDay: 10, paybackBand: 'high', position: [-0.3, 0, 3.2] },
    ];
    
    return mockChannels;
  }, [data]);

  return (
    <div className={`relative w-full h-[400px] ${className || ''}`}>
      <Canvas
        camera={{ 
          position: [0, 6, 0], 
          fov: 50,
          near: 0.1,
          far: 100
        }}
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.4} />
        
        <OrbitRings />
        <ChannelPoints channels={channels} />
      </Canvas>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 text-sm">
        <div className="font-medium mb-2">Payback Bands</div>
        <div className="space-y-1">
          {Object.entries(PAYBACK_COLORS).map(([band, color]) => (
            <div key={band} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{band}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Dot size = meetings/day
        </div>
      </div>
    </div>
  );
}