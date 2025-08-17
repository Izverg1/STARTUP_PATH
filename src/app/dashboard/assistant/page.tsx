"use client";

import React, { useState } from 'react';
import { Bot, Sparkles, TrendingUp, FileText, Lightbulb, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssistantChat } from '@/components/assistant/AssistantChat';
import { assistantTools, getToolsByCategory, getToolCapabilities } from '@/lib/assistant/tools';

export default function AssistantPage() {
  const [activeTab, setActiveTab] = useState('chat');
  const toolCapabilities = getToolCapabilities();

  const features = [
    {
      icon: <TrendingUp className="size-5" />,
      title: 'Performance Analysis',
      description: 'Get instant insights into your marketing performance across all channels',
      count: toolCapabilities.analysis,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      icon: <FileText className="size-5" />,
      title: 'Copy Generation',
      description: 'Create high-converting copy for emails, ads, and social media',
      count: toolCapabilities.copy_generation,
      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    },
    {
      icon: <Lightbulb className="size-5" />,
      title: 'Strategic Insights',
      description: 'Discover growth opportunities and optimization strategies',
      count: toolCapabilities.strategy,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
    }
  ];

  const recentInteractions = [
    {
      id: '1',
      type: 'analysis',
      title: 'Google Ads Performance Review',
      description: 'Analyzed spend efficiency and identified $2.3k monthly savings',
      timestamp: '2 hours ago',
      confidence: 92
    },
    {
      id: '2',
      type: 'copy',
      title: 'LinkedIn InMail Campaign',
      description: 'Generated 3 high-performing InMail variants',
      timestamp: '1 day ago',
      confidence: 87
    },
    {
      id: '3',
      type: 'strategy',
      title: 'Budget Optimization',
      description: 'Recommended budget reallocation across 5 channels',
      timestamp: '2 days ago',
      confidence: 89
    }
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center gap-2">
            <Bot className="size-6" />
            <h1 className="text-xl font-semibold">AI Assistant</h1>
            <Badge variant="secondary" className="ml-2">
              Beta
            </Badge>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="size-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 py-6">
        <div className="min-w-[1400px]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
              {/* Sidebar with features */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="size-4" />
                        Capabilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`p-2 rounded-md ${feature.color}`}>
                            {feature.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{feature.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {feature.description}
                            </div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {feature.count} tools
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Conversations</span>
                        <span className="font-medium">47</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fact Sheets</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Copy Variants</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg Confidence</span>
                        <span className="font-medium">89%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Main chat interface */}
              <div className="lg:col-span-3">
                <AssistantChat className="h-full" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="flex-1 mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Available Tools</h2>
                <p className="text-muted-foreground">
                  Explore the AI Assistant's capabilities and tools for marketing analysis and optimization.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assistantTools.map((tool) => (
                  <Card key={tool.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{tool.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {tool.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                      
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          Example usage:
                        </div>
                        <div className="text-xs text-muted-foreground italic">
                          "{tool.examples[0]}"
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="secondary" className="text-xs">
                          {tool.outputFormat.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {tool.parameters.length} parameters
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Recent Interactions</h2>
                <p className="text-muted-foreground">
                  Review your previous conversations and generated insights.
                </p>
              </div>

              <div className="space-y-4">
                {recentInteractions.map((interaction) => (
                  <Card key={interaction.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="font-medium">{interaction.title}</div>
                          <p className="text-sm text-muted-foreground">
                            {interaction.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{interaction.timestamp}</span>
                            <span>•</span>
                            <span>Confidence: {interaction.confidence}%</span>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            interaction.type === 'analysis' ? 'bg-blue-50 text-blue-700' :
                            interaction.type === 'copy' ? 'bg-green-50 text-green-700' :
                            'bg-purple-50 text-purple-700'
                          }
                        >
                          {interaction.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {recentInteractions.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bot className="size-12 text-muted-foreground mb-4" />
                    <div className="text-lg font-medium mb-2">No interactions yet</div>
                    <p className="text-muted-foreground text-center">
                      Start a conversation with the AI Assistant to see your history here.
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setActiveTab('chat')}
                    >
                      Start Chatting
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}