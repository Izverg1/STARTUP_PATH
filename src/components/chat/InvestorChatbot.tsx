'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot,
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface InvestorChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const INVESTOR_RESPONSES = {
  greeting: {
    keywords: ['hello', 'hi', 'hey', 'start', 'begin'],
    response: "Welcome to STARTUP_PATH! I'm here to help investors understand how our GTM simulation platform delivers measurable ROI. What would you like to know about our solution?"
  },
  roi: {
    keywords: ['roi', 'return', 'investment', 'revenue', 'profit', 'money'],
    response: "STARTUP_PATH delivers 3-5x ROI by reducing failed GTM experiments from 70% to 15%. Our Thompson Sampling algorithm optimizes budget allocation in real-time, typically improving CAC by 40% and reducing payback periods by 60 days."
  },
  market: {
    keywords: ['market', 'size', 'opportunity', 'tam', 'addressable'],
    response: "The GTM optimization market is $12B+ and growing 25% annually. With 4M+ startups globally spending $180B on marketing, even 1% market penetration represents $1.8B revenue opportunity."
  },
  competitive: {
    keywords: ['competitive', 'advantage', 'different', 'unique', 'competition'],
    response: "Unlike static analytics tools, STARTUP_PATH provides predictive GTM simulation with real-time optimization. Our 4-engine architecture (Channel Discovery, Campaign Optimization, Performance Analytics, Budget Allocation) creates defensible IP moats."
  },
  traction: {
    keywords: ['traction', 'customers', 'growth', 'users', 'revenue'],
    response: "Early traction shows 150% month-over-month growth with enterprise customers achieving 40% CAC reduction in first 90 days. Our YC-backed cohort shows 90% retention and $50K+ ARR per customer."
  },
  technology: {
    keywords: ['technology', 'tech', 'ai', 'algorithm', 'how', 'works'],
    response: "Our proprietary Thompson Sampling engine processes 500K+ data points daily, using ML to predict optimal channel allocation. The platform simulates thousands of GTM scenarios to identify highest-probability success paths."
  },
  team: {
    keywords: ['team', 'founders', 'experience', 'background'],
    response: "Founded by ex-Google GTM leaders with 20+ years scaling startups. Combined experience includes $500M+ in managed ad spend, 3 successful exits, and deep ML/optimization expertise."
  },
  funding: {
    keywords: ['funding', 'raise', 'series', 'investment', 'capital'],
    response: "Currently raising Series A to scale our GTM intelligence platform. Looking for strategic investors who understand SaaS unit economics and can provide customer introductions in the mid-market segment."
  },
  default: "That's a great question! STARTUP_PATH helps startups optimize their go-to-market strategy through AI-powered simulation and real-time budget allocation. Would you like to know about our ROI metrics, competitive advantages, or market opportunity?"
};

export function InvestorChatbot({ isOpen, onToggle }: InvestorChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm the STARTUP_PATH AI assistant. I can help you understand how our GTM optimization platform creates value for startups and generates returns for investors. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    for (const [key, data] of Object.entries(INVESTOR_RESPONSES)) {
      if (key === 'default') continue;
      if (typeof data === 'object' && data.keywords && data.keywords.some((keyword: string) => input.includes(keyword))) {
        return data.response;
      }
    }
    
    return INVESTOR_RESPONSES.default;
  };

  const handleSendMessage = () => {
    console.log('Send button clicked!', { inputMessage }); // Debug log
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: findBestResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className={cn(
      "fixed bottom-4 right-4 w-96 bg-slate-950/95 border-red-500/30 shadow-2xl backdrop-blur-lg z-50 transition-all duration-300 pointer-events-auto",
      isMinimized ? "h-14" : "h-[500px]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-red-500/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">STARTUP_PATH AI</h3>
            <p className="text-xs text-gray-400">Investor Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-6 h-6 p-0 text-gray-400 hover:text-white"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-6 h-6 p-0 text-gray-400 hover:text-white"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.type === 'bot' && (
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-red-400" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-xs p-3 rounded-lg text-sm",
                    message.type === 'user'
                      ? 'bg-red-600/20 text-white ml-auto'
                      : 'bg-slate-800/60 text-gray-200'
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t border-red-500/20">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => {
                  console.log('Input changed:', e.target.value); // Debug log
                  setInputMessage(e.target.value);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Ask about ROI, market size, technology..."
                className="bg-slate-800/60 border-red-500/30 text-white placeholder:text-gray-400 focus:border-red-400"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-red-600 hover:bg-red-700 shrink-0"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}