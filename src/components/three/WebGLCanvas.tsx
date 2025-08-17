'use client';

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SVGFallback from './SVGFallback';

// Dynamically import Three.js components to avoid SSR issues
const HeroAnimation = dynamic(() => import('./HeroAnimation'), { 
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gradient-to-br from-background to-muted animate-pulse" />
});

const ChannelOrbitDiagram = dynamic(() => import('./ChannelOrbitDiagram'), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gradient-to-br from-background to-muted animate-pulse" />
});

// WebGL detection utility
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!(gl && gl instanceof WebGLRenderingContext);
  } catch (e) {
    return false;
  }
}

interface WebGLCanvasProps {
  type: 'hero' | 'channel-diagram';
  className?: string;
  data?: unknown;
}

export default function WebGLCanvas({ type, className, data }: WebGLCanvasProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check WebGL support on client side
    setWebglSupported(detectWebGL());
  }, []);

  // Error boundary for Three.js components
  useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Show loading state while checking WebGL support
  if (webglSupported === null) {
    return (
      <div className={`${className || ''} bg-gradient-to-br from-background to-muted animate-pulse`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  // Use SVG fallback if WebGL is not supported or there's an error
  if (!webglSupported || hasError) {
    return <SVGFallback type={type} className={className} />;
  }

  // Render appropriate Three.js component
  return (
    <Suspense fallback={<SVGFallback type={type} className={className} />}>
      <div className={className}>
        {type === 'hero' ? (
          <HeroAnimation />
        ) : (
          <ChannelOrbitDiagram data={data} />
        )}
      </div>
    </Suspense>
  );
}