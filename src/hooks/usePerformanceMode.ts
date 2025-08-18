'use client';

import { useState, useEffect } from 'react';

export type PerformanceMode = 'high' | 'medium' | 'low' | 'minimal';

interface PerformanceConfig {
  animations: boolean;
  particleEffects: boolean;
  backgroundEffects: boolean;
  complexTransitions: boolean;
  maxConcurrentAnimations: number;
}

const performanceConfigs: Record<PerformanceMode, PerformanceConfig> = {
  high: {
    animations: true,
    particleEffects: true,
    backgroundEffects: true,
    complexTransitions: true,
    maxConcurrentAnimations: 50
  },
  medium: {
    animations: true,
    particleEffects: false,
    backgroundEffects: true,
    complexTransitions: true,
    maxConcurrentAnimations: 25
  },
  low: {
    animations: true,
    particleEffects: false,
    backgroundEffects: false,
    complexTransitions: false,
    maxConcurrentAnimations: 10
  },
  minimal: {
    animations: false,
    particleEffects: false,
    backgroundEffects: false,
    complexTransitions: false,
    maxConcurrentAnimations: 0
  }
};

export function usePerformanceMode(): [PerformanceMode, PerformanceConfig] {
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>('high');

  useEffect(() => {
    const detectPerformanceMode = (): PerformanceMode => {
      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 'minimal';
      }

      // Device capability detection
      const hardwareConcurrency = navigator.hardwareConcurrency || 2;
      const memory = (navigator as any).deviceMemory || 4;
      const connection = (navigator as any).connection;

      // Network-based performance detection
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === '2g' || effectiveType === 'slow-2g') {
          return 'minimal';
        }
        if (effectiveType === '3g') {
          return 'low';
        }
      }

      // Hardware-based performance detection
      if (hardwareConcurrency < 4 || memory < 2) {
        return 'low';
      }
      if (hardwareConcurrency < 8 || memory < 4) {
        return 'medium';
      }

      // Mobile device detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile && (hardwareConcurrency < 6 || memory < 6)) {
        return 'medium';
      }

      return 'high';
    };

    const mode = detectPerformanceMode();
    setPerformanceMode(mode);

    // Listen for preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      setPerformanceMode(mediaQuery.matches ? 'minimal' : detectPerformanceMode());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return [performanceMode, performanceConfigs[performanceMode]];
}

// Performance-aware animation component
export function AnimatedComponent({ 
  children, 
  fallback = null,
  requiredLevel = 'medium' as PerformanceMode 
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredLevel?: PerformanceMode;
}) {
  const [mode, config] = usePerformanceMode();
  
  const levelHierarchy: Record<PerformanceMode, number> = {
    minimal: 0,
    low: 1,
    medium: 2,
    high: 3
  };

  const shouldRender = levelHierarchy[mode] >= levelHierarchy[requiredLevel];
  
  return shouldRender ? <>{children}</> : <>{fallback}</>;
}