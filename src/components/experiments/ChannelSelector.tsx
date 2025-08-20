'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { GateEditor } from './GateEditor';
import {
  Search,
  Plus,
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Settings,
  CheckCircle,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { ChannelType } from '@/types';

interface Gate {
  id: string;
  name: string;
  metric: string;
  operator: 'gte' | 'lte';
  threshold_value: number;
  benchmark_value?: number;
  is_critical: boolean;
}

interface ChannelTemplate {
  type: ChannelType;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  benchmarks: {
    [key: string]: {
      value: number;
      range: { min: number; max: number };
      unit: string;
    };
  };
  defaultGates: Omit<Gate, 'id'>[];
  estimatedSetupTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  recommendedBudget: { min: number; max: number };
}

interface SelectedChannel {
  type: ChannelType;
  name: string;
  allocated_budget: number;
  gates: Gate[];
}

interface ChannelSelectorProps {
  selectedChannels: SelectedChannel[];
  onChannelsChange: (channels: SelectedChannel[]) => void;
  totalBudget: number;
  remainingBudget: number;
}

const channelTemplates: ChannelTemplate[] = [
  {
    type: 'google_search',
    name: 'Google Search Ads',
    description: 'Paid search advertising targeting high-intent keywords',
    icon: Search,
    estimatedSetupTime: '2-3 days',
    difficulty: 'medium',
    recommendedBudget: { min: 10000, max: 100000 },
    benchmarks: {
      ctr: { value: 0.035, range: { min: 0.02, max: 0.08 }, unit: '%' },
      cpl: { value: 125, range: { min: 75, max: 250 }, unit: '$' },
      conversion_rate: { value: 0.024, range: { min: 0.015, max: 0.05 }, unit: '%' }
    },
    defaultGates: [
      {
        name: 'Click-Through Rate',
        metric: 'click_through_rate',
        operator: 'gte',
        threshold_value: 0.025,
        benchmark_value: 0.035,
        is_critical: true
      },
      {
        name: 'Cost Per Lead',
        metric: 'cost_per_lead',
        operator: 'lte',
        threshold_value: 150,
        benchmark_value: 125,
        is_critical: true
      },
      {
        name: 'Conversion Rate',
        metric: 'conversion_rate',
        operator: 'gte',
        threshold_value: 0.02,
        benchmark_value: 0.024,
        is_critical: false
      }
    ]
  },
  {
    type: 'linkedin_inmail',
    name: 'LinkedIn InMail',
    description: 'Direct messaging to targeted professionals on LinkedIn',
    icon: Users,
    estimatedSetupTime: '1-2 days',
    difficulty: 'easy',
    recommendedBudget: { min: 5000, max: 50000 },
    benchmarks: {
      open_rate: { value: 0.52, range: { min: 0.35, max: 0.70 }, unit: '%' },
      reply_rate: { value: 0.15, range: { min: 0.08, max: 0.25 }, unit: '%' },
      meeting_rate: { value: 0.08, range: { min: 0.04, max: 0.15 }, unit: '%' }
    },
    defaultGates: [
      {
        name: 'Open Rate',
        metric: 'open_rate',
        operator: 'gte',
        threshold_value: 0.40,
        benchmark_value: 0.52,
        is_critical: false
      },
      {
        name: 'Reply Rate',
        metric: 'reply_rate',
        operator: 'gte',
        threshold_value: 0.10,
        benchmark_value: 0.15,
        is_critical: true
      },
      {
        name: 'Meeting Book Rate',
        metric: 'meeting_book_rate',
        operator: 'gte',
        threshold_value: 0.05,
        benchmark_value: 0.08,
        is_critical: true
      }
    ]
  },
  {
    type: 'webinar',
    name: 'Webinars',
    description: 'Educational webinars to generate and nurture leads',
    icon: Target,
    estimatedSetupTime: '7-10 days',
    difficulty: 'hard',
    recommendedBudget: { min: 8000, max: 40000 },
    benchmarks: {
      registration_rate: { value: 0.25, range: { min: 0.15, max: 0.40 }, unit: '%' },
      attendance_rate: { value: 0.35, range: { min: 0.25, max: 0.50 }, unit: '%' },
      conversion_rate: { value: 0.12, range: { min: 0.06, max: 0.20 }, unit: '%' }
    },
    defaultGates: [
      {
        name: 'Registration Rate',
        metric: 'registration_rate',
        operator: 'gte',
        threshold_value: 0.18,
        benchmark_value: 0.25,
        is_critical: true
      },
      {
        name: 'Attendance Rate',
        metric: 'attendance_rate',
        operator: 'gte',
        threshold_value: 0.30,
        benchmark_value: 0.35,
        is_critical: false
      },
      {
        name: 'Lead Conversion Rate',
        metric: 'conversion_rate',
        operator: 'gte',
        threshold_value: 0.08,
        benchmark_value: 0.12,
        is_critical: true
      }
    ]
  },
  {
    type: 'content_marketing',
    name: 'Content Marketing',
    description: 'Blog posts, whitepapers, and educational content',
    icon: TrendingUp,
    estimatedSetupTime: '5-7 days',
    difficulty: 'medium',
    recommendedBudget: { min: 15000, max: 60000 },
    benchmarks: {
      organic_traffic: { value: 2500, range: { min: 1000, max: 5000 }, unit: 'visits' },
      engagement_rate: { value: 0.045, range: { min: 0.02, max: 0.08 }, unit: '%' },
      lead_rate: { value: 0.028, range: { min: 0.015, max: 0.05 }, unit: '%' }
    },
    defaultGates: [
      {
        name: 'Monthly Organic Traffic',
        metric: 'organic_traffic',
        operator: 'gte',
        threshold_value: 1500,
        benchmark_value: 2500,
        is_critical: false
      },
      {
        name: 'Content Engagement Rate',
        metric: 'engagement_rate',
        operator: 'gte',
        threshold_value: 0.025,
        benchmark_value: 0.045,
        is_critical: true
      },
      {
        name: 'Content to Lead Rate',
        metric: 'lead_conversion_rate',
        operator: 'gte',
        threshold_value: 0.02,
        benchmark_value: 0.028,
        is_critical: true
      }
    ]
  },
  {
    type: 'paid_social',
    name: 'Paid Social (LinkedIn)',
    description: 'Sponsored content and ads on LinkedIn',
    icon: TrendingUp,
    estimatedSetupTime: '3-4 days',
    difficulty: 'medium',
    recommendedBudget: { min: 8000, max: 75000 },
    benchmarks: {
      ctr: { value: 0.045, range: { min: 0.025, max: 0.08 }, unit: '%' },
      cpl: { value: 95, range: { min: 60, max: 180 }, unit: '$' },
      engagement_rate: { value: 0.055, range: { min: 0.03, max: 0.10 }, unit: '%' }
    },
    defaultGates: [
      {
        name: 'Click-Through Rate',
        metric: 'click_through_rate',
        operator: 'gte',
        threshold_value: 0.030,
        benchmark_value: 0.045,
        is_critical: true
      },
      {
        name: 'Cost Per Lead',
        metric: 'cost_per_lead',
        operator: 'lte',
        threshold_value: 120,
        benchmark_value: 95,
        is_critical: true
      },
      {
        name: 'Engagement Rate',
        metric: 'engagement_rate',
        operator: 'gte',
        threshold_value: 0.035,
        benchmark_value: 0.055,
        is_critical: false
      }
    ]
  }
];

export function ChannelSelector({
  selectedChannels,
  onChannelsChange,
  totalBudget,
  remainingBudget
}: ChannelSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [editingChannel, setEditingChannel] = useState<string | null>(null);
  const [editingBudget, setEditingBudget] = useState<{ [key: string]: number }>({});

  const filteredTemplates = channelTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || template.difficulty === filterDifficulty;
    const notSelected = !selectedChannels.some(selected => selected.type === template.type);
    
    return matchesSearch && matchesDifficulty && notSelected;
  });

  const addChannel = (template: ChannelTemplate) => {
    const suggestedBudget = Math.min(
      template.recommendedBudget.min,
      Math.max(5000, remainingBudget * 0.3)
    );

    const newChannel: SelectedChannel = {
      type: template.type,
      name: template.name,
      allocated_budget: suggestedBudget,
      gates: template.defaultGates.map(gate => ({
        ...gate,
        id: `${template.type}_${gate.metric}_${Date.now()}`
      }))
    };

    onChannelsChange([...selectedChannels, newChannel]);
  };

  const removeChannel = (index: number) => {
    const updated = selectedChannels.filter((_, i) => i !== index);
    onChannelsChange(updated);
  };

  const updateChannelBudget = (index: number, budget: number) => {
    const updated = [...selectedChannels];
    updated[index].allocated_budget = budget;
    onChannelsChange(updated);
    setEditingChannel(null);
    setEditingBudget({});
  };

  const updateChannelGates = (channelIndex: number, gates: Gate[]) => {
    const updated = [...selectedChannels];
    updated[channelIndex].gates = gates;
    onChannelsChange(updated);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGateStatus = (gate: Gate) => {
    // Simulated gate status for demonstration
    const status = Math.random() > 0.3 ? 'pass' : 'warning';
    return status;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-red-900/20 to-black/60 border-red-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="h-5 w-5 text-red-400" />
            Channel Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search channels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/5 border-red-500/30 text-white placeholder:text-gray-400"
              />
            </div>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2 border border-red-500/30 rounded-md bg-white/5 text-white"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Available Channels */}
          <div>
            <h3 className="font-medium mb-4 text-white">Available Channels ({filteredTemplates.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template, index) => {
                const TemplateIcon = template.icon;
                return (
                  <Card key={template.type} className="bg-white/5 border-red-500/30 hover:bg-white/10 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-900/30 rounded-lg">
                              <TemplateIcon className="h-5 w-5 text-red-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{template.name}</h4>
                              <p className="text-sm text-gray-300">{template.description}</p>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-red-500/30 text-red-300">
                          {template.difficulty}
                        </Badge>
                      </div>

                      {/* Benchmarks */}
                      <div className="mb-4">
                        <h5 className="text-xs font-medium text-gray-300 mb-2">INDUSTRY BENCHMARKS</h5>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(template.benchmarks).slice(0, 3).map(([key, benchmark]) => (
                            <div key={key} className="text-center">
                              <div className="text-xs text-gray-400 capitalize">
                                {key.replace('_', ' ')}
                              </div>
                              <div className="font-medium text-sm text-white">
                                {benchmark.unit === '%' ? 
                                  `${(benchmark.value * 100).toFixed(1)}%` : 
                                  benchmark.unit === '$' ? 
                                  `$${benchmark.value}` : 
                                  benchmark.value.toLocaleString()
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Setup Info */}
                      <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{template.estimatedSetupTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${template.recommendedBudget.min.toLocaleString()}+</span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => addChannel(template)}
                        disabled={remainingBudget < template.recommendedBudget.min}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                        size="sm"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Channel
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Channels */}
      {selectedChannels.length > 0 && (
        <Card className="bg-gradient-to-br from-red-900/20 to-black/60 border-red-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Selected Channels ({selectedChannels.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedChannels.map((channel, index) => {
              const template = channelTemplates.find(t => t.type === channel.type);
              const ChannelIcon = template?.icon || Target;
              const isEditing = editingChannel === `${index}`;
              
              return (
                <Card key={`${channel.type}_${index}`} className="border-l-4 border-l-red-500 bg-white/5 border-red-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-900/30 rounded-lg">
                          <ChannelIcon className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{channel.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-300">
                            <span>{channel.gates.length} gates configured</span>
                            <span>•</span>
                            <span>${channel.allocated_budget.toLocaleString()} allocated</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                          onClick={() => {
                            setEditingChannel(isEditing ? null : `${index}`);
                            if (!isEditing) {
                              setEditingBudget({ [`${index}`]: channel.allocated_budget });
                            }
                          }}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                          onClick={() => removeChannel(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    {/* Budget Editor */}
                    {isEditing && (
                      <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <Label htmlFor={`budget_${index}`} className="text-white">Allocated Budget</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id={`budget_${index}`}
                              type="number"
                              value={editingBudget[`${index}`] || channel.allocated_budget}
                              onChange={(e) => setEditingBudget({
                                ...editingBudget,
                                [`${index}`]: parseInt(e.target.value) || 0
                              })}
                              className="pl-9 bg-white/5 border-red-500/30 text-white placeholder:text-gray-400"
                            />
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                            onClick={() => updateChannelBudget(index, editingBudget[`${index}`] || channel.allocated_budget)}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Gates */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-white">Success Gates</h5>
                        <Badge variant="outline" className="text-xs border-red-500/30 text-red-300">
                          {channel.gates.filter(g => g.is_critical).length} critical gates
                        </Badge>
                      </div>
                      
                      <GateEditor
                        gates={channel.gates}
                        onGatesChange={(gates) => updateChannelGates(index, gates)}
                        benchmarks={template?.benchmarks || {}}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}