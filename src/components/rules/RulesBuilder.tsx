'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  Save, 
  Eye, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  GitBranch,
  BookOpen,
  HelpCircle,
  X,
  ArrowRight,
  Zap
} from 'lucide-react';
import { BusinessRule, ApprovalStatus } from '@/types/rules';
import { PlainEnglishInput } from './PlainEnglishInput';
import { JSONOutput } from './JSONOutput';
import { RulesList } from './RulesList';
import { ApprovalWorkflow } from './ApprovalWorkflow';
import { VersionHistory } from './VersionHistory';

interface RulesBuilderProps {
  projectId?: string;
  onRuleCreate?: (rule: Partial<BusinessRule>) => void;
  onRuleUpdate?: (ruleId: string, updates: Partial<BusinessRule>) => void;
  onRuleDelete?: (ruleId: string) => void;
}

export function RulesBuilder({ 
  projectId, 
  onRuleCreate, 
  onRuleUpdate, 
  onRuleDelete 
}: RulesBuilderProps) {
  const [activeTab, setActiveTab] = useState('builder');
  const [currentRule, setCurrentRule] = useState<Partial<BusinessRule> | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Example rules for demonstration
  const exampleRules = [
    {
      id: '1',
      name: 'Auto-pause High Payback Channels',
      description: 'If Payback > 18 mo for 7 days → Auto-pause channel',
      is_active: true,
      approval_status: 'approved' as ApprovalStatus,
      version: 1,
      priority: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project_id: projectId || '',
      ruleset_id: 'default',
      conditions: [
        {
          id: 'cond1',
          type: 'metric_threshold',
          field: 'cac_payback_months',
          operator: 'greater_than',
          value: 18,
          time_window: {
            duration: 7,
            unit: 'days'
          }
        }
      ],
      actions: [
        {
          id: 'action1',
          type: 'pause_channel',
          parameters: {
            reason: 'High payback period detected',
            notify_stakeholders: true,
            preserve_budget: true
          }
        }
      ],
      metadata: {
        tags: ['automation', 'performance'],
        business_justification: 'Prevent continued spend on underperforming channels',
        risk_assessment: {
          overall_risk: 'low',
          risk_factors: [],
          mitigation_strategies: [],
          impact_if_failure: 'Continued spend on poor channels'
        },
        testing_strategy: {
          test_approach: 'canary',
          test_duration_days: 7,
          success_criteria: [],
          rollback_plan: 'Manual reactivation if needed'
        },
        documentation: {
          purpose: 'Automated channel management based on payback period',
          business_logic: 'Pause channels when payback exceeds 18 months for 7 consecutive days',
          implementation_notes: 'Uses daily metric aggregation',
          known_limitations: ['Does not account for seasonal variations'],
          related_rules: [],
          change_log: []
        },
        dependencies: []
      }
    },
    {
      id: '2',
      name: 'Budget Reallocation on Low Performance',
      description: 'If MER < 2.5x for 3 days → Reallocate 25% budget to top performer',
      is_active: false,
      approval_status: 'pending_approval' as ApprovalStatus,
      version: 1,
      priority: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project_id: projectId || '',
      ruleset_id: 'default',
      conditions: [
        {
          id: 'cond2',
          type: 'metric_threshold',
          field: 'mer',
          operator: 'less_than',
          value: 2.5,
          time_window: {
            duration: 3,
            unit: 'days'
          }
        }
      ],
      actions: [
        {
          id: 'action2',
          type: 'reallocate_budget',
          parameters: {
            reallocation_strategy: 'performance_based',
            reallocation_amount: 0.25,
            rationale: 'Move budget from underperforming to top channels'
          }
        }
      ],
      metadata: {
        tags: ['budget', 'optimization'],
        business_justification: 'Optimize budget allocation for better performance',
        risk_assessment: {
          overall_risk: 'medium',
          risk_factors: [],
          mitigation_strategies: [],
          impact_if_failure: 'Suboptimal budget allocation'
        },
        testing_strategy: {
          test_approach: 'ab_test',
          test_duration_days: 14,
          success_criteria: [],
          rollback_plan: 'Restore original budget allocation'
        },
        documentation: {
          purpose: 'Dynamic budget optimization',
          business_logic: 'Reallocate budget from low MER channels to high performers',
          implementation_notes: 'Requires minimum 7-day performance history',
          known_limitations: ['May affect attribution windows'],
          related_rules: [],
          change_log: []
        },
        dependencies: []
      }
    }
  ];

  const handleRuleFromNaturalLanguage = (plainText: string) => {
    // This would typically call an AI service to parse natural language
    // For now, we'll create a mock rule structure
    const mockRule: Partial<BusinessRule> = {
      name: 'New Rule from Natural Language',
      description: plainText,
      conditions: [],
      actions: [],
      is_active: false,
      approval_status: 'draft',
      priority: 1,
      metadata: {
        tags: ['auto-generated'],
        business_justification: 'Generated from natural language input',
        risk_assessment: {
          overall_risk: 'low',
          risk_factors: [],
          mitigation_strategies: [],
          impact_if_failure: 'Unknown impact'
        },
        testing_strategy: {
          test_approach: 'canary',
          test_duration_days: 7,
          success_criteria: [],
          rollback_plan: 'Manual review and rollback'
        },
        documentation: {
          purpose: 'Auto-generated rule',
          business_logic: plainText,
          implementation_notes: 'Requires manual review and validation',
          known_limitations: ['Auto-generated, needs validation'],
          related_rules: [],
          change_log: []
        },
        dependencies: []
      }
    };
    
    setCurrentRule(mockRule);
    setActiveTab('json');
  };

  const handleSaveRule = () => {
    if (currentRule && onRuleCreate) {
      onRuleCreate(currentRule);
      setCurrentRule(null);
      setActiveTab('rules');
    }
  };

  const validateRule = (rule: Partial<BusinessRule>): string[] => {
    const errors: string[] = [];
    
    if (!rule.name) errors.push('Rule name is required');
    if (!rule.description) errors.push('Rule description is required');
    if (!rule.conditions || rule.conditions.length === 0) {
      errors.push('At least one condition is required');
    }
    if (!rule.actions || rule.actions.length === 0) {
      errors.push('At least one action is required');
    }
    
    return errors;
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, icon: Clock },
      pending_approval: { variant: 'default' as const, icon: Clock },
      approved: { variant: 'default' as const, icon: CheckCircle },
      rejected: { variant: 'destructive' as const, icon: AlertTriangle },
      auto_approved: { variant: 'default' as const, icon: CheckCircle },
      expired: { variant: 'secondary' as const, icon: AlertTriangle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const tutorialSteps = [
    {
      title: "Welcome to Business Rules",
      content: "Create automated rules that control your GTM experiments. Rules help optimize budget allocation, pause underperforming channels, and scale winners automatically.",
      highlight: ".space-y-6",
      position: "center"
    },
    {
      title: "Natural Language Input",
      content: "Describe your rule in plain English. Example: 'If CAC payback > 18 months for 7 days, pause the channel and notify team'",
      highlight: "[data-tutorial='natural-language']",
      position: "bottom"
    },
    {
      title: "Quick Examples",
      content: "Start with these proven rule templates. Click 'View Rule' to see the full JSON structure and customize as needed.",
      highlight: "[data-tutorial='examples']",
      position: "bottom"
    },
    {
      title: "JSON Editor",
      content: "Advanced users can directly edit rule conditions, actions, and metadata in JSON format for precise control.",
      highlight: "[data-tab='json']",
      position: "top"
    },
    {
      title: "Active Rules",
      content: "Monitor your live rules here. Toggle active/inactive status, view performance metrics, and manage rule priorities.",
      highlight: "[data-tab='rules']",
      position: "top"
    }
  ];

  const Tutorial = () => {
    if (!showTutorial) return null;
    
    const step = tutorialSteps[tutorialStep];
    
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6 max-w-md mx-4 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTutorial(false)}
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400">Step {tutorialStep + 1} of {tutorialSteps.length}</span>
                <div className="flex gap-1">
                  {tutorialSteps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i === tutorialStep ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-300">{step.content}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
              disabled={tutorialStep === 0}
              className="h-8"
            >
              Previous
            </Button>
            
            {tutorialStep < tutorialSteps.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setTutorialStep(tutorialStep + 1)}
                className="h-8 bg-cyan-600 hover:bg-cyan-700"
              >
                Next
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  setShowTutorial(false);
                  localStorage.setItem('rulesTutorialCompleted', 'true');
                }}
                className="h-8 bg-cyan-600 hover:bg-cyan-700"
              >
                Get Started
                <Zap className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tutorial Overlay */}
      <Tutorial />
      
      {/* Compact Header */}
      <div className="shrink-0 bg-black border-b border-cyan-500/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-cyan-400" />
            <div>
              <h1 className="text-lg font-semibold text-white">Business Rules Engine</h1>
              <p className="text-xs text-gray-400">Automated GTM optimization • Plain English to JSON</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTutorial(true)}
              className="bg-black border-cyan-500/30 text-cyan-200 hover:bg-cyan-900/20 h-8 px-3"
            >
              <HelpCircle className="h-3 w-3 mr-1" />
              Tutorial
            </Button>
            <Button variant="outline" size="sm" className="bg-black border-cyan-500/30 text-cyan-200 hover:bg-cyan-900/20 h-8 px-3">
              <GitBranch className="h-3 w-3 mr-1" />
              Versions
            </Button>
            <Button variant="outline" size="sm" className="bg-black border-cyan-500/30 text-cyan-200 hover:bg-cyan-900/20 h-8 px-3">
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 h-9">
            <TabsTrigger value="builder" data-tab="builder" className="text-xs">Rule Builder</TabsTrigger>
            <TabsTrigger value="json" data-tab="json" className="text-xs">JSON Editor</TabsTrigger>
            <TabsTrigger value="rules" data-tab="rules" className="text-xs">Active Rules</TabsTrigger>
            <TabsTrigger value="approval" data-tab="approval" className="text-xs">Approval</TabsTrigger>
            <TabsTrigger value="versions" data-tab="versions" className="text-xs">Versions</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Natural Language Input */}
              <Card data-tutorial="natural-language">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    Natural Language Input
                  </CardTitle>
                  <p className="text-xs text-gray-400">Describe your rule in plain English</p>
                </CardHeader>
                <CardContent>
                  <PlainEnglishInput onRuleGenerated={handleRuleFromNaturalLanguage} />
                </CardContent>
              </Card>

              {/* Quick Examples */}
              <Card data-tutorial="examples">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    Quick Examples
                  </CardTitle>
                  <p className="text-xs text-gray-400">Start with proven templates</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {exampleRules.slice(0, 2).map((rule, index) => (
                    <div key={index} className="space-y-2 p-3 bg-gray-900/30 rounded border border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{rule.name}</span>
                        {getStatusBadge(rule.approval_status)}
                      </div>
                      <p className="text-xs text-gray-400">
                        {rule.description}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setCurrentRule(rule);
                          setActiveTab('json');
                        }}
                        className="h-7 px-2 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Rule
                      </Button>
                      {index < 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Current Rule Preview */}
            {currentRule && (
              <Card className="bg-gray-900/20 border-cyan-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400" />
                      Rule Preview
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)} className="h-7 px-2 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        {isPreviewMode ? 'Edit' : 'Preview'}
                      </Button>
                      <Button size="sm" onClick={handleSaveRule} className="h-7 px-2 text-xs bg-cyan-600 hover:bg-cyan-700">
                        <Save className="h-3 w-3 mr-1" />
                        Save Rule
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Rule Name</label>
                      <p className="text-sm text-white">
                        {currentRule.name || 'Untitled Rule'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Description</label>
                      <p className="text-sm text-gray-300">
                        {currentRule.description || 'No description provided'}
                      </p>
                    </div>
                    
                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                      <div className="rounded border border-red-500/20 bg-red-500/5 p-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-red-400">
                          <AlertTriangle className="h-4 w-4" />
                          Validation Errors
                        </div>
                        <ul className="mt-2 space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index} className="text-xs text-red-400">
                              • {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <JSONOutput 
              rule={currentRule}
              onRuleChange={setCurrentRule}
              readonly={isPreviewMode}
            />
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <RulesList 
              rules={exampleRules}
              onRuleUpdate={onRuleUpdate}
              onRuleDelete={onRuleDelete}
              onRuleEdit={(rule) => {
                setCurrentRule(rule);
                setActiveTab('json');
              }}
            />
          </TabsContent>

          <TabsContent value="approval" className="space-y-4">
            {currentRule ? (
              <ApprovalWorkflow 
                rule={currentRule}
                onApprove={(ruleId, comment) => {
                  console.log('Approving rule:', ruleId, comment);
                  setCurrentRule(prev => prev ? { ...prev, approval_status: 'approved' } : null);
                }}
                onReject={(ruleId, reason) => {
                  console.log('Rejecting rule:', ruleId, reason);
                  setCurrentRule(prev => prev ? { ...prev, approval_status: 'rejected' } : null);
                }}
              />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center space-y-2">
                    <CheckCircle className="h-8 w-8 mx-auto text-gray-600" />
                    <p className="text-gray-400 text-sm">No rule selected for approval</p>
                    <p className="text-xs text-gray-500">
                      Select a rule from the Rules tab to view its approval workflow
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="versions" className="space-y-4">
            {currentRule ? (
              <VersionHistory 
                rule={currentRule}
                onRestoreVersion={(versionId) => {
                  console.log('Restoring version:', versionId);
                }}
                onCompareVersions={(version1, version2) => {
                  console.log('Comparing versions:', version1, version2);
                }}
              />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center space-y-2">
                    <GitBranch className="h-8 w-8 mx-auto text-gray-600" />
                    <p className="text-gray-400 text-sm">No rule selected for version history</p>
                    <p className="text-xs text-gray-500">
                      Select a rule from the Rules tab to view its version history
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}