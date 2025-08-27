'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Zap,
  BookOpen,
  Eye,
  Save,
  Play,
  Pause,
  Settings,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  ArrowRight,
  GitBranch
} from 'lucide-react';

export default function RulesPage() {
  const [activeTab, setActiveTab] = useState('builder');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [currentRule, setCurrentRule] = useState(null);

  const exampleRules = [
    {
      id: '1',
      name: 'Auto-pause High Payback Channels',
      description: 'If Payback > 18 mo for 7 days → Auto-pause channel',
      is_active: true,
      status: 'approved'
    },
    {
      id: '2', 
      name: 'Budget Reallocation on Low Performance',
      description: 'If MER < 2.5x for 3 days → Reallocate 25% budget to top performer',
      is_active: false,
      status: 'pending'
    }
  ];

  const tutorialSteps = [
    {
      title: "Welcome to Business Rules",
      content: "Create automated rules that control your GTM experiments. Rules help optimize budget allocation, pause underperforming channels, and scale winners automatically."
    },
    {
      title: "Natural Language Input", 
      content: "Describe your rule in plain English. Example: 'If CAC payback > 18 months for 7 days, pause the channel and notify team'"
    },
    {
      title: "Quick Examples",
      content: "Start with these proven rule templates. Click 'View Rule' to see the full JSON structure and customize as needed."
    },
    {
      title: "JSON Editor",
      content: "Advanced users can directly edit rule conditions, actions, and metadata in JSON format for precise control."
    },
    {
      title: "Active Rules", 
      content: "Monitor your live rules here. Toggle active/inactive status, view performance metrics, and manage rule priorities."
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
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-9">
            <TabsTrigger value="builder" className="text-xs">Rule Builder</TabsTrigger>
            <TabsTrigger value="rules" className="text-xs">Active Rules</TabsTrigger>
            <TabsTrigger value="json" className="text-xs">JSON Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Natural Language Input */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    Natural Language Input
                  </CardTitle>
                  <p className="text-xs text-gray-400">Describe your rule in plain English</p>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full h-24 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-white placeholder-gray-500 resize-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    placeholder="If CAC payback > 18 months for 7 days, pause the channel and notify team"
                  />
                  <Button size="sm" className="mt-3 h-8 bg-cyan-600 hover:bg-cyan-700">
                    <Zap className="h-3 w-3 mr-1" />
                    Generate Rule
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Examples */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    Quick Examples
                  </CardTitle>
                  <p className="text-xs text-gray-400">Start with proven templates</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {exampleRules.map((rule) => (
                    <div key={rule.id} className="p-3 bg-gray-900/30 rounded border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{rule.name}</span>
                        <Badge variant={rule.status === 'approved' ? 'default' : 'secondary'} className="text-xs">
                          {rule.status === 'approved' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {rule.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{rule.description}</p>
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
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Active Rules</CardTitle>
                <p className="text-xs text-gray-400">Manage your automated GTM rules</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exampleRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-900/30 rounded border border-gray-800">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">{rule.name}</span>
                          <Badge variant={rule.is_active ? 'default' : 'secondary'} className="text-xs">
                            {rule.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">{rule.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          {rule.is_active ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>JSON Editor</span>
                  <Button size="sm" className="h-7 bg-cyan-600 hover:bg-cyan-700">
                    <Save className="h-3 w-3 mr-1" />
                    Save Rule
                  </Button>
                </CardTitle>
                <p className="text-xs text-gray-400">Advanced rule configuration</p>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 border border-gray-700 rounded p-4 min-h-64">
                  <pre className="text-xs text-gray-300">
{currentRule ? JSON.stringify(currentRule, null, 2) : '// Select a rule to view JSON structure'}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}