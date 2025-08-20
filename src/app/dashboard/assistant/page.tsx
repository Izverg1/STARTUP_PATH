"use client";

import React, { useState } from 'react';
import { MessageSquare, Sparkles, TrendingUp, Target, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AssistantChat } from '@/components/assistant/AssistantChat';

export default function AssistantPage() {
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

  if (chatStarted) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <AssistantChat />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span className="text-sm text-red-400 font-medium">GTM Strategy Assistant</span>
        </div>
        <p className="text-gray-400 text-sm">
          Get AI-powered recommendations to optimize your go-to-market strategy
        </p>
      </div>

      {/* Hero Section */}
      <div className="text-center py-8 px-4">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-black/40 border border-red-500/30 rounded-2xl flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-red-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">GTM Strategy Assistant</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Get AI-powered recommendations to optimize your go-to-market strategy and accelerate growth
        </p>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          Quick Start
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="bg-black/40 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer group"
              onClick={() => setChatStarted(true)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-black/60 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 group-hover:text-red-300">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-400">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Insights */}
      <div className="px-4 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          Recent Insights
        </h2>
        <div className="space-y-3">
          {recentInsights.map((insight, index) => (
            <div 
              key={index}
              className="p-3 bg-black/40 border border-gray-500/20 rounded-lg text-sm text-gray-300"
            >
              {insight}
            </div>
          ))}
        </div>
      </div>

      {/* Start Chat */}
      <div className="px-4 mt-auto pb-8">
        <Card className="bg-black/40 border border-red-500/30">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Ready to Optimize?</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Ask me anything about channel optimization, budget allocation, or growth strategy
            </p>
            <Button 
              onClick={() => setChatStarted(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Start Strategy Session
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom Spacing */}
      <div className="pb-8"></div>
    </div>
  );
}