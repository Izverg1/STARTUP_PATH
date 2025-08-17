'use client';

import { useEffect, useState } from 'react';

interface SVGFallbackProps {
  className?: string;
  type?: 'hero' | 'channel-diagram';
}

function HeroSVGFallback() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <svg
      viewBox="0 0 800 400"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 0 20px rgba(0, 102, 255, 0.3))' }}
    >
      <defs>
        <radialGradient id="blueGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#0066FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0.1" />
        </radialGradient>
        
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>
      </defs>
      
      {/* Background orbital rings */}
      {[120, 160, 200, 240, 280].map((radius, i) => (
        <circle
          key={i}
          cx="400"
          cy="200"
          r={radius}
          fill="none"
          stroke="#0066FF"
          strokeWidth="1"
          strokeOpacity={0.2 - i * 0.03}
          style={{
            animation: animate ? `rotate ${20 + i * 5}s linear infinite` : 'none'
          }}
        />
      ))}
      
      {/* Animated particles */}
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * 360;
        const radius = 100 + (i % 5) * 30;
        const x = 400 + Math.cos((angle * Math.PI) / 180) * radius;
        const y = 200 + Math.sin((angle * Math.PI) / 180) * radius;
        
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2"
            fill="#0066FF"
            opacity={0.6}
            style={{
              animation: animate ? `pulse ${2 + (i % 3)}s ease-in-out infinite` : 'none',
              animationDelay: `${i * 0.1}s`
            }}
          />
        );
      })}
      
      {/* Central text */}
      <text
        x="400"
        y="180"
        textAnchor="middle"
        className="text-4xl font-bold"
        fill="url(#textGradient)"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          animation: animate ? 'glow 3s ease-in-out infinite alternate' : 'none'
        }}
      >
        SOL:GEN
      </text>
      
      <text
        x="400"
        y="220"
        textAnchor="middle"
        className="text-lg"
        fill="#ffffff"
        opacity="0.8"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        for startups™
      </text>
      
      {/* Connecting lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle1 = (i / 12) * 360;
        const angle2 = ((i + 3) / 12) * 360;
        const radius1 = 140;
        const radius2 = 200;
        
        const x1 = 400 + Math.cos((angle1 * Math.PI) / 180) * radius1;
        const y1 = 200 + Math.sin((angle1 * Math.PI) / 180) * radius1;
        const x2 = 400 + Math.cos((angle2 * Math.PI) / 180) * radius2;
        const y2 = 200 + Math.sin((angle2 * Math.PI) / 180) * radius2;
        
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#0066FF"
            strokeWidth="1"
            opacity="0.3"
            style={{
              animation: animate ? `fadeInOut ${3 + i * 0.5}s ease-in-out infinite` : 'none'
            }}
          />
        );
      })}

      <style jsx>{`
        @keyframes rotate {
          from { transform-origin: 400px 200px; transform: rotate(0deg); }
          to { transform-origin: 400px 200px; transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes glow {
          0% { filter: drop-shadow(0 0 5px #0066FF); }
          100% { filter: drop-shadow(0 0 20px #0066FF); }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </svg>
  );
}

function ChannelDiagramSVGFallback() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  // Mock channel data for SVG representation
  const channels = [
    { name: 'LinkedIn', x: 320, y: 200, size: 8, color: '#10b981' },
    { name: 'Email', x: 480, y: 200, size: 6, color: '#10b981' },
    { name: 'Referrals', x: 400, y: 140, size: 10, color: '#10b981' },
    { name: 'Cold Calls', x: 300, y: 150, size: 4, color: '#f59e0b' },
    { name: 'Content', x: 500, y: 250, size: 3, color: '#f59e0b' },
    { name: 'Webinars', x: 450, y: 120, size: 2, color: '#f59e0b' },
    { name: 'Social', x: 350, y: 280, size: 4, color: '#f59e0b' },
    { name: 'Trade Shows', x: 280, y: 280, size: 2, color: '#8b5cf6' },
    { name: 'Print', x: 520, y: 160, size: 1, color: '#ef4444' },
  ];

  return (
    <svg viewBox="0 0 800 400" className="w-full h-full">
      <defs>
        <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      
      {/* Concentric rings */}
      {[80, 120, 160, 200].map((radius, i) => (
        <circle
          key={i}
          cx="400"
          cy="200"
          r={radius}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeOpacity={0.2}
          strokeDasharray="5,5"
        />
      ))}
      
      {/* Center point */}
      <circle
        cx="400"
        cy="200"
        r="20"
        fill="url(#centerGradient)"
        stroke="#0066FF"
        strokeWidth="2"
      />
      
      {/* Channel dots */}
      {channels.map((channel, i) => (
        <g key={i}>
          <circle
            cx={channel.x}
            cy={channel.y}
            r={channel.size}
            fill={channel.color}
            opacity="0.8"
            style={{
              animation: animate ? `pulse ${2 + i * 0.3}s ease-in-out infinite` : 'none',
              animationDelay: `${i * 0.2}s`
            }}
          />
          <text
            x={channel.x}
            y={channel.y - channel.size - 8}
            textAnchor="middle"
            className="text-xs"
            fill="#ffffff"
            opacity="0.7"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {channel.name}
          </text>
        </g>
      ))}
      
      {/* Legend */}
      <g transform="translate(650, 50)">
        <text x="0" y="0" className="text-sm font-medium" fill="#ffffff">
          Payback Bands
        </text>
        <circle cx="0" cy="20" r="4" fill="#10b981" />
        <text x="12" y="25" className="text-xs" fill="#ffffff">High</text>
        <circle cx="0" cy="40" r="4" fill="#f59e0b" />
        <text x="12" y="45" className="text-xs" fill="#ffffff">Medium</text>
        <circle cx="0" cy="60" r="4" fill="#8b5cf6" />
        <text x="12" y="65" className="text-xs" fill="#ffffff">Low</text>
        <circle cx="0" cy="80" r="4" fill="#ef4444" />
        <text x="12" y="85" className="text-xs" fill="#ffffff">Negative</text>
      </g>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </svg>
  );
}

export default function SVGFallback({ className, type = 'hero' }: SVGFallbackProps) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className || ''}`}>
      {type === 'hero' ? <HeroSVGFallback /> : <ChannelDiagramSVGFallback />}
      
      {/* Fallback indicator */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        WebGL unavailable - SVG fallback
      </div>
    </div>
  );
}