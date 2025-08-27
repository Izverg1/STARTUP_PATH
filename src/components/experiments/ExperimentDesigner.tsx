'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
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
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useThompsonSampling } from '@/hooks/useThompsonSampling';
import { ChannelType } from '@/types';

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
  const [channelFilter, setChannelFilter] = useState('');
  const [launching, setLaunching] = useState(false);

  // Thompson Sampling integration
  const { initializeExperiment, loading: samplingLoading, error: samplingError } = useThompsonSampling();

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

  const allChannels = [
    { name: 'LinkedIn Ads', category: 'Paid Social', cost: 'High', setup: 'Complex', reach: 'B2B Professional', performance: 85 },
    { name: 'Google Ads', category: 'Paid Search', cost: 'High', setup: 'Complex', reach: 'Universal', performance: 88 },
    { name: 'Facebook Ads', category: 'Paid Social', cost: 'Medium', setup: 'Moderate', reach: 'B2C General', performance: 82 },
    { name: 'Instagram Ads', category: 'Paid Social', cost: 'Medium', setup: 'Moderate', reach: 'Visual/Lifestyle', performance: 79 },
    { name: 'Twitter Ads', category: 'Paid Social', cost: 'Medium', setup: 'Simple', reach: 'News/Tech', performance: 71 },
    { name: 'TikTok Ads', category: 'Paid Social', cost: 'Medium', setup: 'Moderate', reach: 'Gen Z/Millennial', performance: 86 },
    { name: 'YouTube Ads', category: 'Video Advertising', cost: 'High', setup: 'Complex', reach: 'Video Consumers', performance: 83 },
    { name: 'Pinterest Ads', category: 'Paid Social', cost: 'Low', setup: 'Simple', reach: 'Visual/DIY', performance: 74 },
    { name: 'Reddit Ads', category: 'Community', cost: 'Low', setup: 'Moderate', reach: 'Tech/Niche', performance: 69 },
    { name: 'Snapchat Ads', category: 'Paid Social', cost: 'Medium', setup: 'Moderate', reach: 'Gen Z', performance: 72 },
    { name: 'Spotify Ads', category: 'Audio Advertising', cost: 'High', setup: 'Complex', reach: 'Music Listeners', performance: 77 },
    { name: 'Podcast Ads', category: 'Audio Advertising', cost: 'High', setup: 'Simple', reach: 'Engaged Audience', performance: 89 },
    
    { name: 'Content Marketing', category: 'Organic Content', cost: 'Low', setup: 'Complex', reach: 'SEO/Organic', performance: 78 },
    { name: 'SEO/Organic', category: 'Organic Content', cost: 'Low', setup: 'Complex', reach: 'Search Traffic', performance: 91 },
    { name: 'Blog Marketing', category: 'Organic Content', cost: 'Low', setup: 'Moderate', reach: 'Thought Leadership', performance: 76 },
    { name: 'Video Content', category: 'Organic Content', cost: 'Medium', setup: 'Complex', reach: 'Multimedia', performance: 84 },
    { name: 'Webinars', category: 'Events', cost: 'Medium', setup: 'Moderate', reach: 'B2B Education', performance: 87 },
    { name: 'Whitepapers', category: 'Organic Content', cost: 'Low', setup: 'Simple', reach: 'Technical B2B', performance: 73 },
    
    { name: 'Email Marketing', category: 'Direct Marketing', cost: 'Low', setup: 'Simple', reach: 'Owned Audience', performance: 92 },
    { name: 'Newsletter', category: 'Direct Marketing', cost: 'Low', setup: 'Simple', reach: 'Subscribers', performance: 85 },
    { name: 'Marketing Automation', category: 'Direct Marketing', cost: 'Medium', setup: 'Complex', reach: 'Nurture Leads', performance: 89 },
    { name: 'SMS Marketing', category: 'Direct Marketing', cost: 'Low', setup: 'Simple', reach: 'Mobile Users', performance: 81 },
    { name: 'Push Notifications', category: 'Direct Marketing', cost: 'Low', setup: 'Moderate', reach: 'App Users', performance: 74 },
    
    { name: 'Cold Outreach', category: 'Sales Outreach', cost: 'Low', setup: 'Simple', reach: 'Target Prospects', performance: 67 },
    { name: 'Cold Email', category: 'Sales Outreach', cost: 'Low', setup: 'Simple', reach: 'B2B Prospects', performance: 72 },
    { name: 'Cold Calling', category: 'Sales Outreach', cost: 'Medium', setup: 'Simple', reach: 'Direct Contact', performance: 68 },
    { name: 'Account-Based Marketing', category: 'Sales Outreach', cost: 'High', setup: 'Complex', reach: 'Enterprise', performance: 94 },
    { name: 'Sales Development', category: 'Sales Outreach', cost: 'High', setup: 'Complex', reach: 'Qualified Leads', performance: 88 },
    
    { name: 'Influencer Marketing', category: 'Partnership', cost: 'High', setup: 'Complex', reach: 'Follower Base', performance: 82 },
    { name: 'Affiliate Marketing', category: 'Partnership', cost: 'Medium', setup: 'Moderate', reach: 'Partner Network', performance: 86 },
    { name: 'Referral Programs', category: 'Partnership', cost: 'Low', setup: 'Moderate', reach: 'Existing Customers', performance: 91 },
    
    { name: 'Trade Shows', category: 'Events', cost: 'High', setup: 'Complex', reach: 'Industry', performance: 79 },
    { name: 'Conferences', category: 'Events', cost: 'High', setup: 'Complex', reach: 'Professional', performance: 83 },
    { name: 'Virtual Events', category: 'Events', cost: 'Medium', setup: 'Moderate', reach: 'Global Audience', performance: 75 },
    
    { name: 'PR & Media', category: 'Public Relations', cost: 'Medium', setup: 'Complex', reach: 'Media Coverage', performance: 71 },
    { name: 'Thought Leadership', category: 'Public Relations', cost: 'Low', setup: 'Complex', reach: 'Industry Authority', performance: 88 }
  ];

  const filteredChannels = allChannels.filter(channel =>
    channel.name.toLowerCase().includes(channelFilter.toLowerCase()) ||
    channel.category.toLowerCase().includes(channelFilter.toLowerCase()) ||
    channel.reach.toLowerCase().includes(channelFilter.toLowerCase())
  );

  const isChannelSelected = (channelName: string) => config.channels.includes(channelName);
  
  const toggleChannel = (channelName: string, checked: boolean) => {
    console.log('Channel toggled:', channelName, checked);
    if (checked) {
      updateConfig('channels', [...config.channels, channelName]);
    } else {
      updateConfig('channels', config.channels.filter(c => c !== channelName));
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'Low': return 'text-green-400 bg-green-900/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'High': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 85) return 'text-green-400';
    if (performance >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Map channel names to types for Thompson Sampling
  const getChannelType = (channelName: string): ChannelType => {
    const channelTypeMap: Record<string, ChannelType> = {
      'LinkedIn Ads': 'paid_social',
      'Google Ads': 'paid_search',
      'Facebook Ads': 'paid_social',
      'Instagram Ads': 'paid_social',
      'Twitter Ads': 'paid_social',
      'TikTok Ads': 'paid_social',
      'YouTube Ads': 'video',
      'Pinterest Ads': 'paid_social',
      'Reddit Ads': 'display',
      'Snapchat Ads': 'paid_social',
      'Spotify Ads': 'audio',
      'Podcast Ads': 'audio',
      'Content Marketing': 'content',
      'SEO/Organic': 'organic',
      'Blog Marketing': 'content',
      'Video Content': 'video',
      'Webinars': 'events',
      'Whitepapers': 'content',
      'Email Marketing': 'email',
      'Newsletter': 'email',
      'Marketing Automation': 'email',
      'SMS Marketing': 'sms',
      'Push Notifications': 'push',
      'Cold Outreach': 'outreach',
      'Cold Email': 'email',
      'Cold Calling': 'phone',
      'Account-Based Marketing': 'abm',
      'Sales Development': 'sales',
      'Influencer Marketing': 'influencer',
      'Affiliate Marketing': 'affiliate',
      'Referral Programs': 'referral',
      'Trade Shows': 'events',
      'Conferences': 'events',
      'Virtual Events': 'events',
      'PR & Media': 'pr',
      'Thought Leadership': 'content'
    };
    return channelTypeMap[channelName] || 'other';
  };

  const launchExperiment = async (config: ExperimentConfig) => {
    console.log('🚀 Launching experiment with config:', config);
    setLaunching(true);
    
    try {
      // Validate configuration
      if (!config.name.trim()) {
        throw new Error('Experiment name is required');
      }
      if (config.channels.length === 0) {
        throw new Error('At least one channel must be selected');
      }
      if (config.budget <= 0) {
        throw new Error('Budget must be greater than 0');
      }

      const experimentId = `exp_${Date.now()}`;

      // Prepare channels for Thompson Sampling allocator
      const channels = config.channels.map(channelName => ({
        id: channelName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: channelName,
        type: getChannelType(channelName),
        totalBudget: config.budget / config.channels.length, // Equal initial allocation
        totalConversions: Math.floor(Math.random() * 50) + 10, // Simulated initial data
        totalImpressions: Math.floor(Math.random() * 5000) + 1000, // Simulated initial data
      }));

      // Initialize Thompson Sampling allocator
      const allocation = await initializeExperiment(
        experimentId,
        channels,
        {
          totalBudget: config.budget,
          minAllocationPercentage: 0.05,
          maxAllocationPercentage: 0.60,
          riskTolerance: 'moderate'
        }
      );

      // Create experiment object for database storage
      const experiment = {
        id: experimentId,
        name: config.name,
        description: config.description,
        hypothesis: config.hypothesis,
        budget_allocated: config.budget,
        duration_days: config.duration_days,
        primary_metric: config.primary_metric,
        target_value: config.target_value,
        channels: config.channels,
        status: 'running' as const,
        start_date: new Date().toISOString().split('T')[0],
        estimated_end_date: new Date(Date.now() + config.duration_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        
        // Thompson Sampling results
        thompson_sampling: {
          enabled: true,
          allocations: allocation.allocations.map(alloc => ({
            channelId: alloc.channelId,
            budgetAllocated: alloc.allocatedBudget,
            expectedConversionRate: alloc.expectedConversionRate,
            confidence: alloc.confidenceInterval.confidence
          })),
          totalBudget: allocation.totalBudget,
          confidence: allocation.confidence,
          recommendations: allocation.recommendedActions,
          reallocation_frequency: 'daily', // Reallocate budget daily
          min_allocation_percentage: 5, // Minimum 5% allocation per channel
        },

        // LLM Analysis Configuration
        llm_insights: {
          enabled: true,
          analysis_frequency: 'daily',
          insight_types: ['performance', 'optimization', 'prediction'],
          confidence_threshold: 0.75,
          auto_recommendations: true
        },

        // Analytics Integration
        analytics: {
          dashboard_integration: true,
          real_time_updates: true,
          metric_tracking: [config.primary_metric, 'conversion_rate', 'cost_per_acquisition', 'roi'],
          alert_thresholds: {
            budget_utilization: 80, // Alert at 80% budget usage
            performance_deviation: 25, // Alert if 25% below target
            statistical_significance: 95 // Alert when reaching 95% confidence
          }
        },

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store in localStorage (in real app, this would be API call to database)
      const existingExperiments = JSON.parse(localStorage.getItem('active_experiments') || '[]');
      existingExperiments.push(experiment);
      localStorage.setItem('active_experiments', JSON.stringify(existingExperiments));

      // Generate initial LLM insights based on Thompson Sampling allocation
      await generateLLMInsights(experiment, allocation);

      // Update dashboard analytics
      await updateDashboardAnalytics(experiment);

      console.log('✅ Experiment launched successfully with Thompson Sampling allocation:', allocation);
      
      // Navigate to experiments page to show the running experiment
      router.push('/dashboard/experiments');

      return experiment;
    } catch (error) {
      console.error('❌ Error launching experiment:', error);
      // Show error to user (in real app, would use toast notification)
      alert(`Failed to launch experiment: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setLaunching(false);
    }
  };

  const generateLLMInsights = async (experiment: any, allocation: any) => {
    // Generate insights based on actual Thompson Sampling allocation results
    const topChannel = allocation.allocations.sort((a: any, b: any) => b.allocatedBudget - a.allocatedBudget)[0];
    const avgConfidence = allocation.allocations.reduce((sum: any, a: any) => sum + a.confidenceInterval.confidence, 0) / allocation.allocations.length;
    
    const insights = [
      {
        type: 'performance_prediction',
        confidence: 0.85,
        insight: `Thompson Sampling allocated $${topChannel.allocatedBudget.toLocaleString()} (${((topChannel.allocatedBudget / allocation.totalBudget) * 100).toFixed(1)}%) to ${topChannel.channelId.replace(/-/g, ' ')} as the top performer. Expected conversion rate: ${(topChannel.expectedConversionRate * 100).toFixed(2)}%.`,
        recommendation: `Monitor ${topChannel.channelId.replace(/-/g, ' ')} closely as it received the highest initial allocation.`,
        timestamp: new Date().toISOString()
      },
      {
        type: 'optimization',
        confidence: avgConfidence,
        insight: `Thompson Sampling will reallocate budget daily based on actual performance. Current average confidence: ${(avgConfidence * 100).toFixed(1)}%.`,
        recommendation: 'Allow 3-5 days for the algorithm to gather sufficient data for optimal allocation.',
        timestamp: new Date().toISOString()
      },
      {
        type: 'risk_analysis',
        confidence: 0.82,
        insight: `${experiment.channels.length} channels provide diversification. Budget spread: ${allocation.allocations.map((a: any) => `${((a.allocatedBudget / allocation.totalBudget) * 100).toFixed(1)}%`).join(', ')} across channels.`,
        recommendation: allocation.recommendedActions[0] || 'Continue monitoring allocation performance.',
        timestamp: new Date().toISOString()
      }
    ];

    // Store insights
    const existingInsights = JSON.parse(localStorage.getItem('experiment_insights') || '{}');
    existingInsights[experiment.id] = insights;
    localStorage.setItem('experiment_insights', JSON.stringify(existingInsights));

    return insights;
  };

  const updateDashboardAnalytics = async (experiment: any) => {
    // Update dashboard with new experiment data
    const dashboardData = {
      active_experiments: JSON.parse(localStorage.getItem('active_experiments') || '[]').length,
      total_budget_allocated: JSON.parse(localStorage.getItem('active_experiments') || '[]').reduce((sum: number, exp: any) => sum + exp.budget_allocated, 0),
      channels_under_test: Array.from(new Set(JSON.parse(localStorage.getItem('active_experiments') || '[]').flatMap((exp: any) => exp.channels))).length,
      last_experiment_launched: experiment.name,
      launched_at: new Date().toISOString()
    };

    localStorage.setItem('dashboard_analytics', JSON.stringify(dashboardData));
    
    // Trigger analytics update event
    window.dispatchEvent(new CustomEvent('experiment-launched', { detail: experiment }));
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">
      {/* Compact Header - YC Style */}
      <div className="shrink-0 bg-black border-b border-red-500/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-6 w-6 text-red-400" />
            <div>
              <h1 className="text-lg font-semibold text-white">Experiment Designer</h1>
              <p className="text-xs text-gray-400">Thompson Sampling GTM optimization</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-black border-red-500/30 text-gray-300 hover:bg-red-900/20 h-8 px-3">
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button 
              size="sm"
              className="bg-red-600 hover:bg-red-700 h-8 px-3"
              onClick={async () => {
                try {
                  const experiment = await launchExperiment(config);
                  alert(`✅ Experiment launched successfully!`);
                  setTimeout(() => router.push('/dashboard/experiments'), 1000);
                } catch (error) {
                  alert(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
              }}
            >
              <Play className="h-3 w-3 mr-1" />
              Launch
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-red-900/20 h-8 w-8 p-0"
              onClick={() => router.back()}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Compact Content Area with Better Spacing */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          
          {/* Compact Progress Steps */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/50 border border-red-500/20 rounded-lg mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <React.Fragment key={step.id}>
                  <div className={`flex items-center gap-2 ${isActive ? 'text-red-400' : isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      isActive ? 'border-red-400 bg-red-400/20' : 
                      isCompleted ? 'border-green-400 bg-green-400/20' : 
                      'border-gray-500 bg-gray-500/20'
                    }`}>
                      <StepIcon className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-px flex-1 mx-3 ${isCompleted ? 'bg-green-400' : 'bg-gray-500'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* YC-Style Compact Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            
            {/* Main Content - 3/4 width */}
            <div className="lg:col-span-3">
              
              {/* Step 1: YC-Style Compact Form */}
              {currentStep === 1 && (
                <Card className="bg-slate-950/80 border border-red-500/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-white text-base">
                      <Settings className="h-4 w-4 text-red-400" />
                      Experiment Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Compact Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name & Description Row */}
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <Label htmlFor="name" className="text-white text-sm font-medium">
                            Experiment Name <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="name"
                            value={config.name}
                            onChange={(e) => updateConfig('name', e.target.value)}
                            placeholder="Q1 2025 LinkedIn vs. Google Ads Test"
                            className="bg-slate-800/60 border-red-500/30 text-white placeholder:text-gray-500 h-9 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-white text-sm font-medium">Description</Label>
                          <Textarea
                            id="description"
                            value={config.description}
                            onChange={(e) => updateConfig('description', e.target.value)}
                            placeholder="Brief experiment description and goals..."
                            rows={2}
                            className="bg-slate-800/60 border-red-500/30 text-white placeholder:text-gray-500 resize-none text-sm mt-1"
                          />
                        </div>
                      </div>

                      {/* Budget & Duration */}
                      <div>
                        <Label htmlFor="budget" className="text-white text-sm font-medium">Budget ($)</Label>
                        <Input
                          id="budget"
                          type="number"
                          value={config.budget}
                          onChange={(e) => updateConfig('budget', parseInt(e.target.value))}
                          className="bg-slate-800/60 border-red-500/30 text-white h-9 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration" className="text-white text-sm font-medium">Duration (days)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={config.duration_days}
                          onChange={(e) => updateConfig('duration_days', parseInt(e.target.value))}
                          className="bg-slate-800/60 border-red-500/30 text-white h-9 text-sm mt-1"
                        />
                      </div>

                      {/* Metric & Target */}
                      <div>
                        <Label htmlFor="metric" className="text-white text-sm font-medium">Primary Metric</Label>
                        <Select value={config.primary_metric} onValueChange={(value) => updateConfig('primary_metric', value)}>
                          <SelectTrigger className="bg-slate-800/60 border-red-500/30 text-white h-9 text-sm mt-1">
                            <SelectValue placeholder="Select metric" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-red-500/50">
                            <SelectItem value="CPL">Cost Per Lead</SelectItem>
                            <SelectItem value="CAC">CAC</SelectItem>
                            <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                            <SelectItem value="roas">ROAS</SelectItem>
                            <SelectItem value="ctr">CTR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="target" className="text-white text-sm font-medium">Target Value</Label>
                        <Input
                          id="target"
                          type="number"
                          value={config.target_value}
                          onChange={(e) => updateConfig('target_value', parseFloat(e.target.value))}
                          className="bg-slate-800/60 border-red-500/30 text-white h-9 text-sm mt-1"
                        />
                      </div>

                      {/* Hypothesis */}
                      <div className="md:col-span-2">
                        <Label htmlFor="hypothesis" className="text-white text-sm font-medium">Hypothesis</Label>
                        <Textarea
                          id="hypothesis"
                          value={config.hypothesis}
                          onChange={(e) => updateConfig('hypothesis', e.target.value)}
                          placeholder="We believe that [change] will result in [outcome] because [reasoning]..."
                          rows={2}
                          className="bg-slate-800/60 border-red-500/30 text-white placeholder:text-gray-500 resize-none text-sm mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Compact Channel Selection */}
              {currentStep === 2 && (
                <div className="space-y-3">
                  {/* Compact Header */}
                  <Card className="bg-slate-950/80 border border-red-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-white text-base">
                        <Target className="h-4 w-4 text-red-400" />
                        Channel Selection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Compact Search & Stats */}
                      <div className="flex items-center gap-3">
                        <Input
                          value={channelFilter}
                          onChange={(e) => setChannelFilter(e.target.value)}
                          placeholder="Search channels..."
                          className="bg-slate-800/60 border-red-500/30 text-white placeholder:text-gray-500 h-9 text-sm flex-1"
                        />
                        <Badge variant="outline" className="border-red-500/30 text-red-300 text-xs">
                          {config.channels.length}/{filteredChannels.length}
                        </Badge>
                      </div>

                      {/* Quick Selection */}
                      <div className="flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateConfig('channels', [])}
                          className="bg-slate-800/60 border-red-500/30 text-gray-300 hover:bg-red-900/20 h-7 px-2 text-xs"
                        >
                          Clear
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateConfig('channels', filteredChannels.filter(c => c.category === 'Paid Social').map(c => c.name))}
                          className="bg-slate-800/60 border-red-500/30 text-gray-300 hover:bg-red-900/20 h-7 px-2 text-xs"
                        >
                          Paid Social
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateConfig('channels', filteredChannels.filter(c => c.performance >= 85).map(c => c.name))}
                          className="bg-slate-800/60 border-red-500/30 text-gray-300 hover:bg-red-900/20 h-7 px-2 text-xs"
                        >
                          High Perf
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Compact Channel Table */}
                  <Card className="bg-black border border-red-500/30">
                    <CardContent className="p-0">
                      <div className="max-h-[400px] overflow-y-auto">
                        <Table>
                          <TableHeader className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-red-500/30">
                            <TableRow className="hover:bg-transparent border-red-500/20">
                              <TableHead className="w-10 text-gray-300 py-2 text-xs">✓</TableHead>
                              <TableHead className="min-w-[140px] text-gray-300 font-medium py-2 text-xs">Channel</TableHead>
                              <TableHead className="text-gray-300 font-medium py-2 text-xs">Category</TableHead>
                              <TableHead className="text-gray-300 font-medium py-2 text-xs">Cost</TableHead>
                              <TableHead className="text-gray-300 font-medium py-2 text-xs">Setup</TableHead>
                              <TableHead className="text-gray-300 font-medium py-2 text-xs text-right">Perf</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredChannels.map((channel) => (
                              <TableRow 
                                key={channel.name}
                                className={`border-red-500/20 hover:bg-red-500/5 transition-colors cursor-pointer ${
                                  isChannelSelected(channel.name) ? 'bg-red-500/10' : ''
                                }`}
                                onClick={() => toggleChannel(channel.name, !isChannelSelected(channel.name))}
                              >
                                <TableCell className="text-center py-2">
                                  <Checkbox 
                                    checked={isChannelSelected(channel.name)}
                                    onCheckedChange={(checked) => toggleChannel(channel.name, checked as boolean)}
                                    className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 h-3 w-3"
                                  />
                                </TableCell>
                                <TableCell className="font-medium text-white py-2 text-sm">
                                  {channel.name}
                                </TableCell>
                                <TableCell className="py-2">
                                  <Badge variant="secondary" className="bg-slate-800/60 text-gray-300 border-slate-600 text-xs py-0 px-1">
                                    {channel.category.split(' ')[0]}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-2">
                                  <Badge className={`${getCostColor(channel.cost)} text-xs py-0 px-1`}>
                                    {channel.cost}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-gray-300 py-2 text-xs">{channel.setup}</TableCell>
                                <TableCell className="text-right py-2">
                                  <div className="flex items-center justify-end gap-1">
                                    <span className={`font-medium text-xs ${getPerformanceColor(channel.performance)}`}>
                                      {channel.performance}
                                    </span>
                                    <div className="w-8 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full transition-all duration-300 ${
                                          channel.performance >= 85 ? 'bg-green-500' :
                                          channel.performance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${channel.performance}%` }}
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Compact Selected Summary */}
                  {config.channels.length > 0 && (
                    <Card className="bg-red-950/20 border border-red-500/30">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium text-sm">
                            Selected ({config.channels.length})
                          </h4>
                          <div className="text-xs text-gray-400">
                            Avg: {config.channels.length > 0 
                              ? Math.round(config.channels.reduce((sum, channelName) => {
                                  const channel = allChannels.find(c => c.name === channelName);
                                  return sum + (channel?.performance || 0);
                                }, 0) / config.channels.length)
                              : 0
                            } • ${Math.round(config.budget / Math.max(config.channels.length, 1)).toLocaleString()}/ch
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {config.channels.map((channelName) => {
                            const channel = allChannels.find(c => c.name === channelName);
                            return (
                              <div key={channelName} className="flex items-center gap-1 bg-red-500/20 border border-red-500/40 rounded px-2 py-1">
                                <span className="text-white text-xs">{channelName}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-3 w-3 p-0 text-red-300 hover:text-red-100"
                                  onClick={() => toggleChannel(channelName, false)}
                                >
                                  <X className="h-2 w-2" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Step 3: Compact Review */}
              {currentStep === 3 && (
                <Card className="bg-slate-950/80 border border-red-500/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-white text-base">
                      <FlaskConical className="h-4 w-4 text-red-400" />
                      Review & Launch
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Name:</span>
                        <div className="text-white font-medium">{config.name}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Budget:</span>
                        <div className="text-white font-medium">${config.budget.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <div className="text-white font-medium">{config.duration_days} days</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Channels:</span>
                        <div className="text-white font-medium">{config.channels.length} selected</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Primary Metric:</span>
                        <div className="text-white font-medium">{config.primary_metric} (target: {config.target_value})</div>
                      </div>
                    </div>
                    {config.channels.length > 0 && (
                      <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded">
                        <div className="text-green-400 text-sm font-medium mb-1">✅ Ready to Launch</div>
                        <div className="text-xs text-gray-400">Thompson Sampling enabled • LLM insights active • Dashboard integration ready</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Compact Sidebar */}
            <div className="space-y-3">
              <Card className="bg-slate-950/80 border border-red-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-white text-sm">
                    <DollarSign className="h-4 w-4 text-red-400" />
                    Budget
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-medium">${config.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Per Channel:</span>
                    <span className="text-white font-medium">
                      ${Math.round(config.budget / Math.max(config.channels.length || 1, 1)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white font-medium">{config.duration_days}d</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* YC-style benchmarks */}
              <Card className="bg-slate-950/80 border border-red-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">YC Benchmarks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">CAC Payback:</span>
                      <span className="text-green-400">≤12mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">LTV/CAC:</span>
                      <span className="text-green-400">≥3:1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Conv Rate:</span>
                      <span className="text-yellow-400">2-5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Test Duration:</span>
                      <span className="text-blue-400">14-30d</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Compact Navigation */}
          <div className="flex justify-between pt-3 mt-4 border-t border-red-500/30">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="bg-black border-red-500/30 text-gray-300 hover:bg-red-900/20 disabled:opacity-50 h-8"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button
                size="sm"
                onClick={nextStep}
                className="bg-red-600 hover:bg-red-700 h-8"
              >
                Next
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            ) : (
              <Button 
                size="sm"
                className="bg-green-600 hover:bg-green-700 h-8"
                disabled={launching || samplingLoading}
                onClick={async () => {
                  try {
                    await launchExperiment(config);
                  } catch (error) {
                    // Error is already handled in launchExperiment
                    console.error('Launch failed:', error);
                  }
                }}
              >
                {launching || samplingLoading ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Play className="h-3 w-3 mr-1" />
                )}
                {launching ? 'Launching...' : samplingLoading ? 'Initializing...' : 'Launch'}
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}