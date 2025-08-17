"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Mail, 
  BarChart3,
  Lightbulb,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PromptChip {
  id: string;
  text: string;
  icon: React.ReactNode;
  category: 'copy' | 'analysis' | 'strategy' | 'insights';
  description: string;
}

const promptChips: PromptChip[] = [
  {
    id: '1',
    text: 'Draft my LinkedIn InMail test',
    icon: <Mail className="size-4" />,
    category: 'copy',
    description: 'Generate A/B test variations for LinkedIn outreach'
  },
  {
    id: '2',
    text: 'Are we overpaying for Google clicks?',
    icon: <DollarSign className="size-4" />,
    category: 'analysis',
    description: 'Analyze Google Ads spend efficiency and optimization opportunities'
  },
  {
    id: '3',
    text: 'What\'s our best performing channel?',
    icon: <TrendingUp className="size-4" />,
    category: 'analysis',
    description: 'Compare channel performance and ROI metrics'
  },
  {
    id: '4',
    text: 'Generate email subject line variants',
    icon: <MessageSquare className="size-4" />,
    category: 'copy',
    description: 'Create multiple subject line options for email campaigns'
  },
  {
    id: '5',
    text: 'Analyze conversion funnel performance',
    icon: <BarChart3 className="size-4" />,
    category: 'analysis',
    description: 'Review funnel metrics and identify drop-off points'
  },
  {
    id: '6',
    text: 'Optimize budget allocation',
    icon: <Target className="size-4" />,
    category: 'strategy',
    description: 'Recommend budget distribution across channels'
  },
  {
    id: '7',
    text: 'Create competitor benchmarking report',
    icon: <FileText className="size-4" />,
    category: 'insights',
    description: 'Compare performance against industry benchmarks'
  },
  {
    id: '8',
    text: 'Suggest new growth opportunities',
    icon: <Lightbulb className="size-4" />,
    category: 'strategy',
    description: 'Identify untapped channels and strategies'
  }
];

const categoryColors = {
  copy: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  analysis: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  strategy: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  insights: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
};

interface PromptChipsProps {
  onPromptSelect: (prompt: string) => void;
}

export function PromptChips({ onPromptSelect }: PromptChipsProps) {
  const handleChipClick = (chip: PromptChip) => {
    onPromptSelect(chip.text);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Try these suggestions:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {promptChips.map((chip) => (
            <Button
              key={chip.id}
              variant="outline"
              onClick={() => handleChipClick(chip)}
              className="h-auto p-4 justify-start text-left hover:bg-accent/50 group"
            >
              <div className="flex items-start gap-3 w-full">
                <div className="shrink-0 mt-0.5 text-muted-foreground group-hover:text-foreground">
                  {chip.icon}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{chip.text}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-2 py-0.5 ${categoryColors[chip.category]}`}
                    >
                      {chip.category}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {chip.description}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Or type your own question about marketing performance, copy creation, or strategy
        </p>
      </div>
    </div>
  );
}