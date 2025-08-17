'use client';

import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Settings, 
  Shuffle, 
  Database, 
  TrendingUp, 
  Info, 
  RotateCcw,
  Zap,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { useDemoMode, DemoCustomizations } from '@/lib/demo/demo-mode';

interface DemoToggleProps {
  compact?: boolean;
  className?: string;
  showSettings?: boolean;
}

export function DemoToggle({ 
  compact = false, 
  className = '', 
  showSettings = true 
}: DemoToggleProps) {
  const {
    isEnabled,
    state,
    enable,
    disable,
    toggle,
    generateNewData,
    updateCustomizations,
    reset
  } = useDemoMode();

  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localCustomizations, setLocalCustomizations] = useState<DemoCustomizations>(
    state.customizations
  );

  // Sync local customizations with state
  useEffect(() => {
    setLocalCustomizations(state.customizations);
  }, [state.customizations]);

  const handleToggle = () => {
    toggle();
  };

  const handleGenerateNewData = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate generation time
      generateNewData();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomizationChange = (key: keyof DemoCustomizations, value: any) => {
    const newCustomizations = { ...localCustomizations, [key]: value };
    setLocalCustomizations(newCustomizations);
    updateCustomizations({ [key]: value });
  };

  const handleReset = () => {
    reset();
    setLocalCustomizations(state.customizations);
  };

  // Compact version for header/navigation
  if (compact) {
    return (
      <TooltipProvider>
        <div className={`flex items-center gap-2 ${className}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isEnabled}
                  onCheckedChange={handleToggle}
                  aria-label="Toggle demo mode"
                />
                <Badge 
                  variant={isEnabled ? "default" : "secondary"}
                  className={isEnabled ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {isEnabled ? "Demo" : "Live"}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isEnabled ? "Disable demo mode" : "Enable demo mode"}</p>
            </TooltipContent>
          </Tooltip>
          
          {showSettings && isEnabled && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <DemoSettingsContent
                  localCustomizations={localCustomizations}
                  onCustomizationChange={handleCustomizationChange}
                  onGenerateNewData={handleGenerateNewData}
                  onReset={handleReset}
                  isGenerating={isGenerating}
                  showAdvanced={showAdvanced}
                  onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </TooltipProvider>
    );
  }

  // Full version for dashboard/admin pages
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Demo Mode
            </CardTitle>
            <CardDescription>
              Switch between demo data and live data
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isEnabled ? "default" : "secondary"}
              className={isEnabled ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              {isEnabled ? "Demo Active" : "Live Data"}
            </Badge>
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggle}
              aria-label="Toggle demo mode"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mode Information */}
        <div className={`p-4 rounded-lg border-2 ${
          isEnabled 
            ? "bg-purple-50 border-purple-200 text-purple-800" 
            : "bg-blue-50 border-blue-200 text-blue-800"
        }`}>
          <div className="flex items-start gap-3">
            {isEnabled ? (
              <Zap className="h-5 w-5 mt-0.5 text-purple-600" />
            ) : (
              <Database className="h-5 w-5 mt-0.5 text-blue-600" />
            )}
            <div>
              <h4 className="font-medium mb-1">
                {isEnabled ? "Demo Mode Active" : "Live Data Mode"}
              </h4>
              <p className="text-sm opacity-90">
                {isEnabled 
                  ? "Using synthetic data for testing and exploration. All data is simulated and deterministic."
                  : "Connected to real data sources. All metrics reflect actual performance."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Demo Mode Controls */}
        {isEnabled && (
          <>
            <Separator />
            
            {/* Quick Actions */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Actions</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateNewData}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  {isGenerating ? "Generating..." : "New Dataset"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </div>

            <Separator />

            {/* Settings */}
            <DemoSettingsContent
              localCustomizations={localCustomizations}
              onCustomizationChange={handleCustomizationChange}
              onGenerateNewData={handleGenerateNewData}
              onReset={handleReset}
              isGenerating={isGenerating}
              showAdvanced={showAdvanced}
              onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
            />

            <Separator />

            {/* Data Info */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Dataset Information</Label>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Seed:</span>
                  <span className="ml-2 font-mono">{state.currentSeed}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Generated:</span>
                  <span className="ml-2">
                    {new Date(state.lastGenerated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Warning for live mode */}
        {!isEnabled && (
          <>
            <Separator />
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Live Data Active</p>
                <p className="opacity-90">
                  All data reflects real performance. Changes will affect actual campaigns and budgets.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Settings content component (reused in compact and full versions)
interface DemoSettingsContentProps {
  localCustomizations: DemoCustomizations;
  onCustomizationChange: (key: keyof DemoCustomizations, value: any) => void;
  onGenerateNewData: () => void;
  onReset: () => void;
  isGenerating: boolean;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

function DemoSettingsContent({
  localCustomizations,
  onCustomizationChange,
  onGenerateNewData,
  onReset,
  isGenerating,
  showAdvanced,
  onToggleAdvanced
}: DemoSettingsContentProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Demo Settings</Label>
        <p className="text-xs text-muted-foreground">
          Customize how demo data is generated
        </p>
      </div>

      {/* Budget Multiplier */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="budget-multiplier" className="text-sm">
            Budget Scale
          </Label>
          <span className="text-sm text-muted-foreground">
            {localCustomizations.budgetMultiplier}x
          </span>
        </div>
        <Slider
          id="budget-multiplier"
          min={0.5}
          max={3.0}
          step={0.1}
          value={[localCustomizations.budgetMultiplier]}
          onValueChange={([value]) => onCustomizationChange('budgetMultiplier', value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Multiply all budget amounts by this factor
        </p>
      </div>

      {/* Performance Variance */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="performance-variance" className="text-sm">
            Noise Level
          </Label>
          <span className="text-sm text-muted-foreground">
            ±{Math.round(localCustomizations.performanceVariance * 100)}%
          </span>
        </div>
        <Slider
          id="performance-variance"
          min={0.01}
          max={0.3}
          step={0.01}
          value={[localCustomizations.performanceVariance]}
          onValueChange={([value]) => onCustomizationChange('performanceVariance', value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Random variance applied to performance metrics
        </p>
      </div>

      {/* Advanced Settings Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleAdvanced}
        className="w-full justify-between p-2"
      >
        <span className="text-sm">Advanced Settings</span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
        />
      </Button>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="space-y-3 pl-2 border-l-2 border-muted">
          {/* Enable Trends */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enable-trends" className="text-sm">
                Performance Trends
              </Label>
              <p className="text-xs text-muted-foreground">
                Include gradual improvement over time
              </p>
            </div>
            <Switch
              id="enable-trends"
              checked={localCustomizations.enableTrends}
              onCheckedChange={(checked) => onCustomizationChange('enableTrends', checked)}
            />
          </div>

          {/* Seasonal Effects */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="seasonal-effects" className="text-sm">
                Seasonal Effects
              </Label>
              <p className="text-xs text-muted-foreground">
                Weekend and holiday performance changes
              </p>
            </div>
            <Switch
              id="seasonal-effects"
              checked={localCustomizations.seasonalEffects}
              onCheckedChange={(checked) => onCustomizationChange('seasonalEffects', checked)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Standalone demo indicator for headers
export function DemoIndicator({ className = '' }: { className?: string }) {
  const { isEnabled } = useDemoMode();

  if (!isEnabled) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="secondary" 
            className={`bg-purple-100 text-purple-800 border-purple-300 ${className}`}
          >
            <Zap className="h-3 w-3 mr-1" />
            Demo
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Demo mode active - using synthetic data</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default DemoToggle;