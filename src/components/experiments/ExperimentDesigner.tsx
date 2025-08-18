'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ChannelSelector } from './ChannelSelector';
import { PaybackPreview } from './PaybackPreview';
import {
  FlaskConical,
  Target,
  Calendar,
  DollarSign,
  Save,
  Play,
  Settings,
  Info
} from 'lucide-react';
import { ChannelType, ICP } from '@/types';

interface ExperimentConfig {
  name: string;
  description: string;
  hypothesis: string;
  budget: number;
  duration_days: number;
  primary_metric: string;
  target_value: number;
  confidence_level: number;
  max_cac_payback_months: number;
  icp: Partial<ICP>;
}

interface SelectedChannel {
  type: ChannelType;
  name: string;
  allocated_budget: number;
  gates: Gate[];
}

interface Gate {
  id: string;
  name: string;
  metric: string;
  operator: 'gte' | 'lte';
  threshold_value: number;
  benchmark_value?: number;
  is_critical: boolean;
}

const defaultExperimentConfig: ExperimentConfig = {
  name: '',
  description: '',
  hypothesis: '',
  budget: 50000,
  duration_days: 30,
  primary_metric: 'Cost Per Lead',
  target_value: 100,
  confidence_level: 0.95,
  max_cac_payback_months: 12,
  icp: {
    persona: 'Marketing Directors',
    company_size: 'smb',
    acv_range: { min: 10000, max: 50000, currency: 'USD' },
    sales_motion: 'sales_led'
  }
};

export function ExperimentDesigner() {
  const [config, setConfig] = useState<ExperimentConfig>(defaultExperimentConfig);
  const [selectedChannels, setSelectedChannels] = useState<SelectedChannel[]>([]);
  const [activeStep, setActiveStep] = useState<'setup' | 'channels' | 'review'>('setup');

  const updateConfig = (field: keyof ExperimentConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const totalAllocatedBudget = selectedChannels.reduce(
    (sum, channel) => sum + channel.allocated_budget, 
    0
  );

  const budgetRemaining = config.budget - totalAllocatedBudget;

  const steps = [
    { id: 'setup', name: 'Experiment Setup', icon: Settings },
    { id: 'channels', name: 'Channel Selection', icon: Target },
    { id: 'review', name: 'Review & Launch', icon: FlaskConical }
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 py-6">
        <div className="min-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FlaskConical className="h-8 w-8 text-blue-600" />
            Experiment Designer
          </h1>
          <p className="text-muted-foreground mt-2">
            Design and configure your marketing experiment with channels and success gates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button disabled={selectedChannels.length === 0 || !config.name}>
            <Play className="h-4 w-4 mr-2" />
            Launch Experiment
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = step.id === activeStep;
          const isCompleted = steps.findIndex(s => s.id === activeStep) > index;
          
          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setActiveStep(step.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : isCompleted 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <StepIcon className="h-4 w-4" />
                <span className="font-medium">{step.name}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`h-px w-8 ${isCompleted ? 'bg-green-300' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeStep === 'setup' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Experiment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Experiment Name</Label>
                    <Input
                      id="name"
                      value={config.name}
                      onChange={(e) => updateConfig('name', e.target.value)}
                      placeholder="e.g., LinkedIn vs. Google Ads Q4 Test"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) => updateConfig('description', e.target.value)}
                      placeholder="Brief description of the experiment goals..."
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="hypothesis">Hypothesis</Label>
                    <Textarea
                      id="hypothesis"
                      value={config.hypothesis}
                      onChange={(e) => updateConfig('hypothesis', e.target.value)}
                      placeholder="We believe that... because... and we'll measure this by..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="budget">Total Budget</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="budget"
                        type="number"
                        value={config.budget}
                        onChange={(e) => updateConfig('budget', parseInt(e.target.value))}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (Days)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="duration"
                        type="number"
                        value={config.duration_days}
                        onChange={(e) => updateConfig('duration_days', parseInt(e.target.value))}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="primary_metric">Primary Metric</Label>
                    <Input
                      id="primary_metric"
                      value={config.primary_metric}
                      onChange={(e) => updateConfig('primary_metric', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="target_value">Target Value</Label>
                    <Input
                      id="target_value"
                      type="number"
                      value={config.target_value}
                      onChange={(e) => updateConfig('target_value', parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="confidence">Confidence Level</Label>
                    <select
                      id="confidence"
                      value={config.confidence_level}
                      onChange={(e) => updateConfig('confidence_level', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value={0.90}>90%</option>
                      <option value={0.95}>95%</option>
                      <option value={0.99}>99%</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="payback">Max CAC Payback (Months)</Label>
                    <Input
                      id="payback"
                      type="number"
                      value={config.max_cac_payback_months}
                      onChange={(e) => updateConfig('max_cac_payback_months', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setActiveStep('channels')}>
                    Continue to Channels
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeStep === 'channels' && (
            <ChannelSelector
              selectedChannels={selectedChannels}
              onChannelsChange={setSelectedChannels}
              totalBudget={config.budget}
              remainingBudget={budgetRemaining}
            />
          )}

          {activeStep === 'review' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  Review & Launch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Experiment Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{config.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{config.duration_days} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Budget:</span>
                        <span className="font-medium">${config.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Primary Metric:</span>
                        <span className="font-medium">{config.primary_metric}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Selected Channels ({selectedChannels.length})</h3>
                    <div className="space-y-2">
                      {selectedChannels.map((channel, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">{channel.name}</span>
                            <div className="text-sm text-muted-foreground">
                              {channel.gates.length} gates configured
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${channel.allocated_budget.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">
                              {((channel.allocated_budget / config.budget) * 100).toFixed(0)}% of budget
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {budgetRemaining !== 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Info className="h-4 w-4" />
                        <span className="font-medium">
                          Budget Warning: ${Math.abs(budgetRemaining).toLocaleString()} {budgetRemaining > 0 ? 'unallocated' : 'over budget'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => setActiveStep('channels')}>
                    Back to Channels
                  </Button>
                  <Button 
                    disabled={selectedChannels.length === 0 || budgetRemaining < 0}
                    className="ml-auto"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Launch Experiment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4" />
                Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Budget:</span>
                  <span className="font-medium">${config.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Allocated:</span>
                  <span className="font-medium">${totalAllocatedBudget.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Remaining:</span>
                  <span className={`font-medium ${budgetRemaining < 0 ? 'text-gray-400' : 'text-gray-400'}`}>
                    ${Math.abs(budgetRemaining).toLocaleString()}
                  </span>
                </div>
                
                {totalAllocatedBudget > 0 && (
                  <div className="space-y-2 mt-4">
                    <div className="text-xs text-muted-foreground">Budget Allocation</div>
                    <div className="space-y-1">
                      {selectedChannels.map((channel, index) => {
                        const percentage = (channel.allocated_budget / config.budget) * 100;
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div className="text-xs flex-1 truncate">{channel.name}</div>
                            <div className="text-xs font-medium">{percentage.toFixed(0)}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CAC Payback Preview */}
          {selectedChannels.length > 0 && (
            <PaybackPreview 
              channels={selectedChannels}
              maxPaybackMonths={config.max_cac_payback_months}
              icp={config.icp}
            />
          )}

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>• Set conservative gates initially - you can adjust them during the experiment</div>
                <div>• Allocate 60-70% budget to your best-performing channel, 30-40% to test new ones</div>
                <div>• Plan for at least 30 days to reach statistical significance</div>
                <div>• Review daily for the first week, then weekly thereafter</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}