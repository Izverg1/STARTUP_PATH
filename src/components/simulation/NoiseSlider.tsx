'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface NoiseSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  description?: string;
  disabled?: boolean;
  showImpactIndicator?: boolean;
  className?: string;
}

export function NoiseSlider({
  value,
  onChange,
  min = 0,
  max = 0.1, // 10% maximum variance
  step = 0.005, // 0.5% steps
  label = 'Market Noise',
  description = 'Simulates real-world variance in channel performance',
  disabled = false,
  showImpactIndicator = true,
  className = ''
}: NoiseSliderProps) {
  const percentage = (value * 100).toFixed(1);

  const getNoiseLevel = (variance: number): {
    level: 'low' | 'medium' | 'high';
    color: string;
    description: string;
    icon: React.ReactNode;
  } => {
    if (variance <= 0.03) {
      return {
        level: 'low',
        color: 'bg-green-100 text-green-800 border-green-200',
        description: 'Stable market conditions with predictable performance',
        icon: <TrendingUp className="h-3 w-3" />
      };
    } else if (variance <= 0.07) {
      return {
        level: 'medium',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: 'Moderate volatility with some performance fluctuation',
        icon: <TrendingDown className="h-3 w-3" />
      };
    } else {
      return {
        level: 'high',
        color: 'bg-red-100 text-red-800 border-red-200',
        description: 'High volatility with significant performance swings',
        icon: <AlertTriangle className="h-3 w-3" />
      };
    }
  };

  const noiseInfo = getNoiseLevel(value);

  const getExpectedImpact = (variance: number): string[] => {
    const impacts: string[] = [];
    
    if (variance <= 0.02) {
      impacts.push('Minimal performance variation');
      impacts.push('Reliable budget allocation results');
    } else if (variance <= 0.05) {
      impacts.push('Some day-to-day variation');
      impacts.push('Clear trends still visible');
    } else if (variance <= 0.08) {
      impacts.push('Moderate performance swings');
      impacts.push('Requires longer observation periods');
    } else {
      impacts.push('High performance volatility');
      impacts.push('Difficult to identify stable patterns');
      impacts.push('Higher risk of false signals');
    }
    
    return impacts;
  };

  const handleSliderChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={noiseInfo.color}>
                {noiseInfo.icon}
                <span className="ml-1 capitalize">{noiseInfo.level}</span>
              </Badge>
              <Badge variant="secondary">
                ±{percentage}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <Label htmlFor="noise-slider" className="sr-only">
                Noise variance percentage
              </Label>
              <span>10%</span>
            </div>
            <Slider
              id="noise-slider"
              value={[value]}
              onValueChange={handleSliderChange}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              className="w-full"
            />
          </div>

          {/* Current Value Display */}
          <div className="flex items-center justify-center p-3 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">
                ±{percentage}%
              </div>
              <div className="text-sm text-muted-foreground">
                Variance Level
              </div>
            </div>
          </div>

          {/* Impact Indicator */}
          {showImpactIndicator && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                {noiseInfo.icon}
                <span>Expected Impact</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {noiseInfo.description}
              </div>
              <ul className="text-sm space-y-1">
                {getExpectedImpact(value).map((impact, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{impact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onChange(0.02)}
              disabled={disabled}
              className="flex-1 px-3 py-2 text-xs border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Low (2%)
            </button>
            <button
              onClick={() => onChange(0.05)}
              disabled={disabled}
              className="flex-1 px-3 py-2 text-xs border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Medium (5%)
            </button>
            <button
              onClick={() => onChange(0.08)}
              disabled={disabled}
              className="flex-1 px-3 py-2 text-xs border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              High (8%)
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Real-world Examples */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="text-sm space-y-2">
            <div className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Real-world Context
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>• Stable market:</span>
                <span>1-3% variance</span>
              </div>
              <div className="flex justify-between">
                <span>• Normal competition:</span>
                <span>3-6% variance</span>
              </div>
              <div className="flex justify-between">
                <span>• High competition:</span>
                <span>6-8% variance</span>
              </div>
              <div className="flex justify-between">
                <span>• Market disruption:</span>
                <span>8-10% variance</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}