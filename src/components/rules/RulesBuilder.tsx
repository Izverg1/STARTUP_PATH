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
  GitBranch
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

  return (
    <div className="space-y-6 p-6">
      {/* Simplified Header */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <GitBranch className="h-4 w-4" />
            Version History
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="builder">Rule Builder</TabsTrigger>
          <TabsTrigger value="json">JSON Editor</TabsTrigger>
          <TabsTrigger value="rules">Active Rules</TabsTrigger>
          <TabsTrigger value="approval">Approval</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Natural Language Input */}
            <Card>
              <CardHeader>
                <CardTitle>Natural Language Input</CardTitle>
              </CardHeader>
              <CardContent>
                <PlainEnglishInput onRuleGenerated={handleRuleFromNaturalLanguage} />
              </CardContent>
            </Card>

            {/* Quick Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {exampleRules.slice(0, 2).map((rule, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{rule.name}</span>
                      {getStatusBadge(rule.approval_status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {rule.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setCurrentRule(rule);
                        setActiveTab('json');
                      }}
                    >
                      <Eye className="h-3 w-3" />
                      View Rule
                    </Button>
                    {index < 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Current Rule Preview */}
          {currentRule && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Rule Preview</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                      <Eye className="h-4 w-4" />
                      {isPreviewMode ? 'Edit' : 'Preview'}
                    </Button>
                    <Button size="sm" onClick={handleSaveRule}>
                      <Save className="h-4 w-4" />
                      Save Rule
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Rule Name</label>
                    <p className="text-sm text-muted-foreground">
                      {currentRule.name || 'Untitled Rule'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-sm text-muted-foreground">
                      {currentRule.description || 'No description provided'}
                    </p>
                  </div>
                  
                  {/* Validation Errors */}
                  {validationErrors.length > 0 && (
                    <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        Validation Errors
                      </div>
                      <ul className="mt-2 space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index} className="text-sm text-destructive">
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

        <TabsContent value="json" className="space-y-6">
          <JSONOutput 
            rule={currentRule}
            onRuleChange={setCurrentRule}
            readonly={isPreviewMode}
          />
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
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

        <TabsContent value="approval" className="space-y-6">
          {currentRule ? (
            <ApprovalWorkflow 
              rule={currentRule}
              onApprove={(ruleId, comment) => {
                console.log('Approving rule:', ruleId, comment);
                // Update rule approval status
                setCurrentRule(prev => prev ? { ...prev, approval_status: 'approved' } : null);
              }}
              onReject={(ruleId, reason) => {
                console.log('Rejecting rule:', ruleId, reason);
                // Update rule approval status
                setCurrentRule(prev => prev ? { ...prev, approval_status: 'rejected' } : null);
              }}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No rule selected for approval</p>
                  <p className="text-sm text-muted-foreground">
                    Select a rule from the Rules tab to view its approval workflow
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="versions" className="space-y-6">
          {currentRule ? (
            <VersionHistory 
              rule={currentRule}
              onRestoreVersion={(versionId) => {
                console.log('Restoring version:', versionId);
                // In real app, restore the rule to the specified version
              }}
              onCompareVersions={(version1, version2) => {
                console.log('Comparing versions:', version1, version2);
                // In real app, show version comparison
              }}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <GitBranch className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No rule selected for version history</p>
                  <p className="text-sm text-muted-foreground">
                    Select a rule from the Rules tab to view its version history
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}