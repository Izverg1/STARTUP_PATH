'use client';

import React from 'react';
import { usePerformanceMode, type PerformanceMode } from '@/hooks/usePerformanceMode';

interface AnimatedComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredLevel?: PerformanceMode;
}

export function AnimatedComponent({ 
  children, 
  fallback = null,
  requiredLevel = 'medium'
}: AnimatedComponentProps) {
  const [mode] = usePerformanceMode();
  
  const levelHierarchy: Record<PerformanceMode, number> = {
    minimal: 0,
    low: 1,
    medium: 2,
    high: 3
  };

  const shouldRender = levelHierarchy[mode] >= levelHierarchy[requiredLevel];
  
  return shouldRender ? <>{children}</> : <>{fallback}</>;
}