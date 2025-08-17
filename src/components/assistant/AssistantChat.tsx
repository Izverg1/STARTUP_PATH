"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Paperclip, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PromptChips } from './PromptChips';
import { FactSheet } from './FactSheet';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  factSheet?: FactSheetData;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
}

interface FactSheetData {
  title: string;
  metrics: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
    description?: string;
  }[];
  insights: string[];
  recommendations: string[];
  confidence: number;
}

interface AssistantChatProps {
  className?: string;
}

export function AssistantChat({ className }: AssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Assistant. I can help you analyze your marketing performance, draft copy, generate insights, and create fact sheets. What would you like to work on today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response with fact sheet for specific prompts
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase();
    
    // Generate different responses based on input
    if (lowerInput.includes('linkedin') && lowerInput.includes('inmail')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I\'ve drafted a LinkedIn InMail test campaign for you. Here are three variations optimized for different engagement approaches:',
        timestamp: new Date(),
        factSheet: {
          title: 'LinkedIn InMail Test Campaign',
          metrics: [
            { label: 'Expected Open Rate', value: '68%', trend: 'up', description: 'Above industry average of 52%' },
            { label: 'Predicted Response Rate', value: '12%', trend: 'up', description: 'Target: 8-15%' },
            { label: 'Cost per Response', value: '$24', trend: 'neutral', description: 'Within budget range' },
          ],
          insights: [
            'Personalized subject lines show 23% higher open rates',
            'Mid-week sends (Tue-Thu) perform best for B2B InMail',
            'Including specific pain points increases response rates by 18%'
          ],
          recommendations: [
            'Test variation A (consultative) vs B (direct value prop)',
            'Segment by company size for better personalization',
            'Follow up after 5 business days if no response'
          ],
          confidence: 87
        }
      };
    }

    if (lowerInput.includes('google') && lowerInput.includes('clicks')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I\'ve analyzed your Google Ads performance and identified potential overspend areas. Here\'s what I found:',
        timestamp: new Date(),
        factSheet: {
          title: 'Google Ads Spend Analysis',
          metrics: [
            { label: 'Current CPC', value: '$8.45', trend: 'down', description: '34% above industry benchmark' },
            { label: 'Quality Score Avg', value: '6.2/10', trend: 'neutral', description: 'Room for improvement' },
            { label: 'Potential Savings', value: '$2,340/mo', trend: 'up', description: 'Through optimization' },
          ],
          insights: [
            'Keywords with QS below 5 are driving up costs significantly',
            '3 ad groups have CTR below 2% - likely irrelevant traffic',
            'Mobile bids are 40% higher than necessary based on conversion data'
          ],
          recommendations: [
            'Pause keywords with QS < 4 and high spend',
            'Implement negative keywords to reduce irrelevant clicks',
            'Adjust mobile bid modifiers to -20%',
            'Test responsive search ads in top performing ad groups'
          ],
          confidence: 92
        }
      };
    }

    // Default responses for other inputs
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I understand you're asking about "${userInput}". I can help you with marketing analysis, copy creation, performance insights, and strategic recommendations. Would you like me to generate a detailed fact sheet or analysis for this topic?`,
      timestamp: new Date(),
    };
  };

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file attachment logic here
      console.log('Files selected:', files);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="size-5" />
            AI Assistant
            <Badge variant="secondary" className="ml-auto">
              Beta
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 p-6 overflow-y-hidden">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="size-8 bg-primary text-primary-foreground shrink-0">
                      <Bot className="size-4" />
                    </Avatar>
                  )}
                  
                  <div className="flex flex-col gap-2 max-w-[80%]">
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    
                    {message.factSheet && (
                      <FactSheet data={message.factSheet} />
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="size-8 bg-secondary text-secondary-foreground shrink-0">
                      <User className="size-4" />
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="size-8 bg-primary text-primary-foreground shrink-0">
                    <Bot className="size-4" />
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {messages.length === 1 && (
            <div className="p-6 border-t bg-muted/50">
              <PromptChips onPromptSelect={handlePromptSelect} />
            </div>
          )}
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept=".csv,.xlsx,.pdf,.txt"
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleFileAttach}
                className="shrink-0"
              >
                <Paperclip className="size-4" />
              </Button>
              
              <Input
                placeholder="Ask me about your marketing performance, copy creation, or get insights..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isLoading}
              />
              
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                className="shrink-0"
              >
                <Send className="size-4" />
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2 text-center">
              AI Assistant can analyze data, generate copy, and provide strategic insights
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}