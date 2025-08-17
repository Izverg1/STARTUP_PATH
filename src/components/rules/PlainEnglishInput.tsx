'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Zap,
  Target,
  AlertCircle
} from 'lucide-react';

interface PlainEnglishInputProps {
  onRuleGenerated: (plainText: string) => void;
}

export function PlainEnglishInput({ onRuleGenerated }: PlainEnglishInputProps) {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const exampleRules = [
    {
      category: 'Performance Management',
      icon: TrendingUp,
      color: 'bg-blue-500/10 text-blue-700 border-blue-200',
      examples: [
        'If CAC Payback > 18 months for 7 consecutive days → Auto-pause channel',
        'If MER drops below 2.5x for 3 days → Send alert to marketing team',
        'If conversion rate < 2% for 5 days → Trigger optimization review',
        'If CTR falls below 1% → Automatically refresh ad creative'
      ]
    },
    {
      category: 'Budget Optimization',
      icon: DollarSign,
      color: 'bg-green-500/10 text-green-700 border-green-200',
      examples: [
        'If daily spend exceeds budget by 20% → Pause highest CPO campaigns',
        'If MER > 4x for 3 days → Increase budget by 25%',
        'If channel performs in top 20% → Reallocate 15% more budget',
        'If budget utilization < 70% → Redistribute to top performers'
      ]
    },
    {
      category: 'Quality Control',
      icon: Target,
      color: 'bg-purple-500/10 text-purple-700 border-purple-200',
      examples: [
        'If meeting show rate < 40% for 2 days → Review lead qualification',
        'If opportunity rate drops below 25% → Alert sales team',
        'If close rate < 10% for 1 week → Trigger ICP analysis',
        'If lead quality score < 6/10 → Pause lead source'
      ]
    },
    {
      category: 'Risk Management',
      icon: AlertCircle,
      color: 'bg-red-500/10 text-red-700 border-red-200',
      examples: [
        'If anomaly detected in any metric → Immediately notify admin',
        'If CAC increases by 50% in 24 hours → Pause all campaigns',
        'If total spend exceeds monthly budget → Auto-pause everything',
        'If pipeline value drops 30% → Escalate to management'
      ]
    },
    {
      category: 'Automation',
      icon: Zap,
      color: 'bg-orange-500/10 text-orange-700 border-orange-200',
      examples: [
        'If experiment reaches statistical significance → Auto-scale winner',
        'If A/B test shows 20% lift → Implement winning variant',
        'If seasonal pattern detected → Adjust budget allocation',
        'If competitor analysis shows opportunity → Create new campaign'
      ]
    }
  ];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onRuleGenerated(input);
    setIsGenerating(false);
    setInput('');
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    setSelectedExample(example);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="rule-input" className="text-sm font-medium">
            Describe your business rule in plain English
          </label>
          <Textarea
            id="rule-input"
            placeholder="Example: If CAC Payback is greater than 18 months for 7 consecutive days, then automatically pause the channel and notify the marketing team..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Use ⌘+Enter (Mac) or Ctrl+Enter (Windows) to generate rule
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>AI will convert your description into executable rules</span>
          </div>
          <Button 
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Rule
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Examples Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Popular Rule Templates</h3>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Quick Start
          </Badge>
        </div>
        
        <ScrollArea className="h-96">
          <div className="space-y-4 pr-4">
            {exampleRules.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`rounded-md p-1.5 ${category.color}`}>
                    <category.icon className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-medium">{category.category}</h4>
                </div>
                
                <div className="grid gap-2">
                  {category.examples.map((example, exampleIndex) => (
                    <button
                      key={exampleIndex}
                      onClick={() => handleExampleClick(example)}
                      className={`rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent ${
                        selectedExample === example 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{example.split('→')[0].trim()}</p>
                        <p className="text-muted-foreground">
                          → {example.split('→')[1]?.trim()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Help Text */}
      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-500/10 p-1">
            <Sparkles className="h-4 w-4 text-blue-600" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Tips for Better Rule Generation
            </h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• Be specific about metrics (CAC, MER, CTR, etc.)</li>
              <li>• Include time windows (days, hours, weeks)</li>
              <li>• Specify exact thresholds and conditions</li>
              <li>• Describe the desired action clearly</li>
              <li>• Mention stakeholders who should be notified</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}