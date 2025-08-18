'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Skull,
  Calendar,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Search,
  Filter,
  Clock,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FailedExperiment {
  id: string;
  name: string;
  channel_type: 'paid_search' | 'paid_social' | 'display' | 'email' | 'content' | 'events' | 'partnerships';
  start_date: string;
  end_date: string;
  duration_days: number;
  total_spend: number;
  target_metric: string;
  target_value: number;
  actual_value: number;
  failure_reason: FailureReason;
  failure_category: FailureCategory;
  confidence_level: number;
  impact_assessment: ImpactAssessment;
  lessons_learned: string[];
  related_experiments?: string[];
  kill_decision_maker: string;
  kill_date: string;
  assets_salvaged?: string[];
}

type FailureReason = 
  | 'poor_performance' 
  | 'high_cost' 
  | 'low_quality_traffic' 
  | 'technical_issues' 
  | 'market_conditions' 
  | 'creative_fatigue'
  | 'targeting_issues'
  | 'compliance_violation';

type FailureCategory = 'hypothesis_invalid' | 'execution_poor' | 'market_timing' | 'technical_limitation' | 'resource_constraint';

interface ImpactAssessment {
  financial_loss: number;
  opportunity_cost: number;
  team_hours_lost: number;
  reputation_impact: 'none' | 'low' | 'medium' | 'high';
  customer_impact: 'none' | 'low' | 'medium' | 'high';
}

interface KillLogProps {
  experiments: FailedExperiment[];
  title?: string;
  className?: string;
  showFilters?: boolean;
  showLessonsLearned?: boolean;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getFailureReasonColor = (reason: FailureReason): string => {
  const colors = {
    poor_performance: 'text-red-700 bg-red-100 border-red-200',
    high_cost: 'text-orange-700 bg-orange-100 border-orange-200',
    low_quality_traffic: 'text-yellow-700 bg-yellow-100 border-yellow-200',
    technical_issues: 'text-purple-700 bg-purple-100 border-purple-200',
    market_conditions: 'text-blue-700 bg-blue-100 border-blue-200',
    creative_fatigue: 'text-pink-700 bg-pink-100 border-pink-200',
    targeting_issues: 'text-indigo-700 bg-indigo-100 border-indigo-200',
    compliance_violation: 'text-red-800 bg-red-200 border-red-300',
  };
  return colors[reason] || 'text-gray-700 bg-gray-100 border-gray-200';
};

const getCategoryColor = (category: FailureCategory): string => {
  const colors = {
    hypothesis_invalid: 'text-red-700 bg-red-50',
    execution_poor: 'text-orange-700 bg-orange-50',
    market_timing: 'text-blue-700 bg-blue-50',
    technical_limitation: 'text-purple-700 bg-purple-50',
    resource_constraint: 'text-gray-700 bg-gray-50',
  };
  return colors[category] || 'text-gray-700 bg-gray-50';
};

const getChannelIcon = (channelType: FailedExperiment['channel_type']) => {
  switch (channelType) {
    case 'paid_search':
    case 'paid_social':
    case 'display':
      return <DollarSign className="h-4 w-4" />;
    case 'email':
    case 'content':
      return <Target className="h-4 w-4" />;
    case 'events':
    case 'partnerships':
      return <Target className="h-4 w-4" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

const getImpactSeverity = (experiment: FailedExperiment): 'low' | 'medium' | 'high' => {
  const totalLoss = experiment.impact_assessment.financial_loss + experiment.impact_assessment.opportunity_cost;
  const reputationWeight = experiment.impact_assessment.reputation_impact === 'high' ? 2 : 
                          experiment.impact_assessment.reputation_impact === 'medium' ? 1 : 0;
  const customerWeight = experiment.impact_assessment.customer_impact === 'high' ? 2 : 
                        experiment.impact_assessment.customer_impact === 'medium' ? 1 : 0;
  
  const score = (totalLoss / 10000) + reputationWeight + customerWeight;
  
  if (score >= 5) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
};

function ExperimentCard({ experiment, showLessonsLearned }: { 
  experiment: FailedExperiment; 
  showLessonsLearned: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const severity = getImpactSeverity(experiment);
  const performanceGap = ((experiment.target_value - experiment.actual_value) / experiment.target_value) * 100;
  
  return (
    <TooltipProvider>
      <Card className={cn(
        'border-l-4 transition-all duration-200 hover:shadow-md',
        severity === 'high' && 'border-l-red-500 bg-red-50/30',
        severity === 'medium' && 'border-l-orange-500 bg-orange-50/30',
        severity === 'low' && 'border-l-yellow-500 bg-yellow-50/30'
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2">
                <Skull className={cn(
                  'h-5 w-5',
                  severity === 'high' && 'text-red-600',
                  severity === 'medium' && 'text-orange-600',
                  severity === 'low' && 'text-yellow-600'
                )} />
                {getChannelIcon(experiment.channel_type)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight">{experiment.name}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(experiment.start_date)} - {formatDate(experiment.end_date)}</span>
                  <span>({experiment.duration_days} days)</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getFailureReasonColor(experiment.failure_reason)}>
                {experiment.failure_reason.replace('_', ' ')}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="p-1"
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-xs text-muted-foreground mb-1">Total Spend</div>
              <div className="font-semibold text-lg">{formatCurrency(experiment.total_spend)}</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-xs text-muted-foreground mb-1">Performance Gap</div>
              <div className="font-semibold text-lg text-red-600 flex items-center justify-center gap-1">
                <TrendingDown className="h-4 w-4" />
                {performanceGap.toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-xs text-muted-foreground mb-1">Financial Loss</div>
              <div className="font-semibold text-lg">{formatCurrency(experiment.impact_assessment.financial_loss)}</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-xs text-muted-foreground mb-1">Confidence</div>
              <div className="font-semibold text-lg">{(experiment.confidence_level * 100).toFixed(0)}%</div>
            </div>
          </div>
          
          {/* Target vs Actual */}
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Target vs Actual Performance
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Target {experiment.target_metric}</div>
                <div className="text-xl font-semibold text-green-600">{experiment.target_value.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Actual {experiment.target_metric}</div>
                <div className="text-xl font-semibold text-red-600">{experiment.actual_value.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          {expanded && (
            <div className="space-y-4 border-t pt-4">
              {/* Failure Category */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Failure Category:</span>
                <Badge variant="outline" className={getCategoryColor(experiment.failure_category)}>
                  {experiment.failure_category.replace('_', ' ')}
                </Badge>
              </div>
              
              {/* Impact Assessment */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Impact Assessment
                </h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Opportunity Cost:</span>
                      <span className="ml-2 font-medium">{formatCurrency(experiment.impact_assessment.opportunity_cost)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Team Hours Lost:</span>
                      <span className="ml-2 font-medium">{experiment.impact_assessment.team_hours_lost}h</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reputation Impact:</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {experiment.impact_assessment.reputation_impact}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Customer Impact:</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {experiment.impact_assessment.customer_impact}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Lessons Learned */}
              {showLessonsLearned && experiment.lessons_learned.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Lessons Learned
                  </h4>
                  <div className="space-y-2">
                    {experiment.lessons_learned.map((lesson, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                        {lesson}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Assets Salvaged */}
              {experiment.assets_salvaged && experiment.assets_salvaged.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Assets Salvaged</h4>
                  <div className="flex flex-wrap gap-2">
                    {experiment.assets_salvaged.map((asset, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Kill Decision */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Killed by: {experiment.kill_decision_maker}</span>
                  <span className="text-muted-foreground">{formatDate(experiment.kill_date)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

export function KillLog({
  experiments,
  title = 'Failed Experiments Log',
  className,
  showFilters = true,
  showLessonsLearned = true,
}: KillLogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'cost' | 'impact'>('date');
  
  // Calculate summary statistics
  const totalLoss = experiments.reduce((sum, exp) => 
    sum + exp.impact_assessment.financial_loss + exp.impact_assessment.opportunity_cost, 0
  );
  const avgDuration = experiments.reduce((sum, exp) => sum + exp.duration_days, 0) / experiments.length;
  const highImpactCount = experiments.filter(exp => getImpactSeverity(exp) === 'high').length;
  
  // Filter and sort experiments
  const filteredExperiments = experiments
    .filter(exp => {
      const matchesSearch = exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exp.failure_reason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesChannel = channelFilter === 'all' || exp.channel_type === channelFilter;
      const matchesReason = reasonFilter === 'all' || exp.failure_reason === reasonFilter;
      
      return matchesSearch && matchesChannel && matchesReason;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          return b.total_spend - a.total_spend;
        case 'impact':
          const aImpact = a.impact_assessment.financial_loss + a.impact_assessment.opportunity_cost;
          const bImpact = b.impact_assessment.financial_loss + b.impact_assessment.opportunity_cost;
          return bImpact - aImpact;
        default:
          return new Date(b.kill_date).getTime() - new Date(a.kill_date).getTime();
      }
    });
  
  const uniqueChannels = Array.from(new Set(experiments.map(exp => exp.channel_type)));
  const uniqueReasons = Array.from(new Set(experiments.map(exp => exp.failure_reason)));
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Skull className="h-5 w-5 text-red-600" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="font-semibold text-lg text-red-600">{experiments.length}</div>
              <div>Failed</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg text-white">{formatCurrency(totalLoss)}</div>
              <div>Total Loss</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{avgDuration.toFixed(0)}</div>
              <div>Avg Days</div>
            </div>
          </div>
        </div>
        
        {showFilters && (
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search experiments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                {uniqueChannels.map(channel => (
                  <SelectItem key={channel} value={channel}>
                    {channel.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                {uniqueReasons.map(reason => (
                  <SelectItem key={reason} value={reason}>
                    {reason.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: 'date' | 'cost' | 'impact') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Kill Date</SelectItem>
                <SelectItem value="cost">Total Cost</SelectItem>
                <SelectItem value="impact">Impact</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {filteredExperiments.length === 0 ? (
          <div className="text-center py-8">
            <Skull className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No failed experiments match your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExperiments.map(experiment => (
              <ExperimentCard
                key={experiment.id}
                experiment={experiment}
                showLessonsLearned={showLessonsLearned}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}