'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FlaskConical,
  Target,
  Calendar,
  DollarSign,
  Save,
  Play,
  Settings,
  X,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ExperimentConfig {
  name: string;
  description: string;
  hypothesis: string;
  budget: number;
  duration_days: number;
  primary_metric: string;
  target_value: number;
  channels: string[];
}

const defaultConfig: ExperimentConfig = {
  name: 'LinkedIn vs. Google Ads Q4 Test',
  description: 'Brief description of the experiment goals...',
  hypothesis: 'We believe that LinkedIn will outperform Google Ads for B2B lead generation',
  budget: 50000,
  duration_days: 30,
  primary_metric: 'CPL',
  target_value: 85,
  channels: []
};

export function ExperimentDesigner() {
  const router = useRouter();
  const [config, setConfig] = useState<ExperimentConfig>(defaultConfig);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: 'Experiment Setup', icon: Settings },
    { id: 2, name: 'Channel Selection', icon: Target },
    { id: 3, name: 'Review & Launch', icon: FlaskConical }
  ];

  const updateConfig = (field: keyof ExperimentConfig, value: any) => {
    console.log('UpdateConfig called:', field, value);
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">
      {/* Full Screen Header */}
      <div className="shrink-0 bg-black border-b border-red-500/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <FlaskConical className="h-8 w-8 text-red-400" />
              Experiment Designer
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl mb-3">
              Design and configure your marketing experiment with channels and success gates
            </p>
            {/* Partnership Opportunity Notice */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border border-amber-400/30 rounded-lg shadow-sm">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-amber-300 text-sm font-medium">
                Looking for a full version? 
              </span>
              <span className="text-amber-200 text-sm">
                See the creator for partnership opportunities
              </span>
              <div className="w-1 h-1 bg-amber-400/60 rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-black border-red-500/30 text-gray-300 hover:bg-red-900/20">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Play className="h-4 w-4 mr-2" />
              Launch Experiment
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 text-gray-400 hover:text-white hover:bg-red-900/20"
              onClick={() => router.back()}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Full Screen Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between p-4 bg-black border border-red-500/30 rounded-lg">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <React.Fragment key={step.id}>
                  <div className={`flex items-center gap-3 ${isActive ? 'text-red-400' : isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isActive ? 'border-red-400 bg-red-400/20' : 
                      isCompleted ? 'border-green-400 bg-green-400/20' : 
                      'border-gray-500 bg-gray-500/20'
                    }`}>
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-px flex-1 mx-4 ${isCompleted ? 'bg-green-400' : 'bg-gray-500'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              
              {/* Step 1: Experiment Setup */}
              {currentStep === 1 && (
                <Card className="bg-black border border-red-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Settings className="h-5 w-5 text-red-400" />
                      Experiment Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Experiment Name</Label>
                        <Input
                          id="name"
                          value={config.name}
                          onChange={(e) => updateConfig('name', e.target.value)}
                          placeholder="e.g., LinkedIn vs. Google Ads Q4 Test"
                          className="bg-white/10 border-red-500/50 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-red-400 cursor-text"
                          disabled={false}
                          readOnly={false}
                          autoComplete="off"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description" className="text-white">Description</Label>
                        <Textarea
                          id="description"
                          value={config.description}
                          onChange={(e) => updateConfig('description', e.target.value)}
                          placeholder="Brief description of the experiment goals..."
                          rows={3}
                          className="bg-white/10 border-red-500/50 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-red-400 cursor-text resize-none"
                        />
                      </div>

                      <div>
                        <Label htmlFor="hypothesis" className="text-white">Hypothesis</Label>
                        <Textarea
                          id="hypothesis"
                          value={config.hypothesis}
                          onChange={(e) => updateConfig('hypothesis', e.target.value)}
                          placeholder="We believe that... because... and we will measure this by..."
                          rows={3}
                          className="bg-white/10 border-red-500/50 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-red-400 cursor-text resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="budget" className="text-white">Total Budget ($)</Label>
                          <Input
                            id="budget"
                            type="number"
                            value={config.budget}
                            onChange={(e) => updateConfig('budget', parseInt(e.target.value))}
                            className="bg-white/10 border-red-500/50 text-white focus:bg-white/20 focus:border-red-400 cursor-text"
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration" className="text-white">Duration (days)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={config.duration_days}
                            onChange={(e) => updateConfig('duration_days', parseInt(e.target.value))}
                            className="bg-white/10 border-red-500/50 text-white focus:bg-white/20 focus:border-red-400 cursor-text"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Channel Selection */}
              {currentStep === 2 && (
                <Card className="bg-black border border-red-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Target className="h-5 w-5 text-red-400" />
                      Channel Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-white">
                      <p className="text-gray-400 mb-4">Select the channels you want to test in this experiment.</p>
                      <div className="grid grid-cols-2 gap-4">
                        {['LinkedIn Ads', 'Google Ads', 'Facebook Ads', 'Content Marketing', 'Email Marketing', 'Cold Outreach'].map((channel) => (
                          <label key={channel} className="flex items-center space-x-3 p-3 border border-red-500/30 rounded-lg hover:bg-red-500/10 cursor-pointer">
                            <input
                              type="checkbox"
                              className="form-checkbox text-red-600"
                              checked={config.channels.includes(channel)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateConfig('channels', [...config.channels, channel]);
                                } else {
                                  updateConfig('channels', config.channels.filter(c => c !== channel));
                                }
                              }}
                            />
                            <span className="text-white">{channel}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Review & Launch */}
              {currentStep === 3 && (
                <Card className="bg-black border border-red-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <FlaskConical className="h-5 w-5 text-red-400" />
                      Review & Launch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4 text-white">
                      <div>
                        <h3 className="font-semibold text-white mb-2">Experiment Summary</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div><span className="text-gray-400">Name:</span> {config.name}</div>
                          <div><span className="text-gray-400">Budget:</span> ${config.budget.toLocaleString()}</div>
                          <div><span className="text-gray-400">Duration:</span> {config.duration_days} days</div>
                          <div><span className="text-gray-400">Channels:</span> {config.channels.join(', ') || 'None selected'}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Budget Overview Sidebar */}
            <div>
              <Card className="bg-black border border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white text-lg">
                    <DollarSign className="h-5 w-5 text-red-400" />
                    Budget Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-white">
                      <span className="text-gray-400">Total Budget:</span>
                      <span className="font-semibold">${config.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span className="text-gray-400">Allocated:</span>
                      <span className="font-semibold">$0</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span className="text-gray-400">Remaining:</span>
                      <span className="font-semibold">${config.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-red-500/30">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="bg-black border-red-500/30 text-gray-300 hover:bg-red-900/20 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                className="bg-red-600 hover:bg-red-700"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Launch Experiment
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}