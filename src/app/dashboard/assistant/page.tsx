"use client";

import React, { useState } from 'react';
import { MessageSquare, Sparkles, TrendingUp, Target, Zap, BarChart3, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AssistantChat } from '@/components/assistant/AssistantChat';

export default function AssistantPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [chatStarted, setChatStarted] = useState(false);

  const quickActions = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Analyze Channel Performance",
      description: "Get insights on CAC and conversion rates",
      prompt: "Analyze my current channel performance and identify optimization opportunities"
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Budget Optimization",
      description: "Optimize allocation across channels",
      prompt: "Help me optimize my budget allocation to reduce CAC and improve CPQM"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Growth Strategy",
      description: "Develop PMF acceleration plan",
      prompt: "Create a growth strategy to accelerate product-market fit validation"
    }
  ];

  const recentInsights = [
    "📈 Organic traffic converting 2.3x better than paid channels",
    "🎯 Product demos showing 67% qualification rate",
    "⚡ Email sequences need A/B testing for subject optimization"
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Assistant Content with Horizontal Tabs */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="bg-zinc-800 border-2 border-zinc-500 p-1 m-6 mb-0 shrink-0 shadow-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
            >
              🤖 Assistant
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
            >
              💬 Chat
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
            >
              📊 Insights
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
            >
              📜 History
            </TabsTrigger>
          </TabsList>

          {/* Assistant Overview Tab */}
          <TabsContent value="overview" className="flex-1 overflow-y-auto p-6">
            {/* Hero Section */}
            <div className="text-center py-8 px-4 mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-black border border-magenta-500/30 rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-magenta-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">GTM Strategy Assistant</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Get AI-powered recommendations to optimize your go-to-market strategy and accelerate growth
              </p>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                Quick Start
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Card 
                    key={index} 
                    className="bg-black border border-magenta-500/30 hover:border-magenta-500/40 transition-colors duration-100 cursor-pointer group"
                    onClick={() => setActiveTab('chat')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-zinc-900 border border-magenta-500/30 rounded-lg flex items-center justify-center text-magenta-400 group-hover:text-magenta-300">
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">{action.title}</h4>
                          <p className="text-sm text-gray-400">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Start Chat CTA */}
            <Card className="bg-black border border-magenta-500/30">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-magenta-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Optimize?</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Ask me anything about channel optimization, budget allocation, or growth strategy
                </p>
                <Button 
                  onClick={() => setActiveTab('chat')}
                  className="bg-magenta-600 hover:bg-magenta-700 text-white"
                >
                  Start Strategy Session
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 overflow-hidden">
            <div className="h-full">
              <AssistantChat />
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              Recent Insights
            </h3>
            <div className="space-y-3">
              {recentInsights.map((insight, index) => (
                <Card key={index} className="bg-black border border-red-500/30">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-300">{insight}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Conversation History
            </h3>
            <div className="space-y-4">
              <Card className="bg-black border border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    Previous Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">No previous conversations yet. Start your first strategy session to see your history here.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}