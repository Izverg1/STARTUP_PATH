'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  Download, 
  Eye, 
  Edit, 
  Check, 
  AlertTriangle,
  Code,
  FileText,
  Braces,
  Play,
  Settings
} from 'lucide-react';
import { BusinessRule } from '@/types/rules';

interface JSONOutputProps {
  rule: Partial<BusinessRule> | null;
  onRuleChange?: (rule: Partial<BusinessRule>) => void;
  readonly?: boolean;
}

export function JSONOutput({ rule, onRuleChange, readonly = false }: JSONOutputProps) {
  const [jsonText, setJsonText] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'formatted' | 'raw' | 'visual'>('formatted');

  useEffect(() => {
    if (rule) {
      setJsonText(JSON.stringify(rule, null, 2));
      setIsValidJson(true);
      setParseError(null);
    }
  }, [rule]);

  const handleJsonChange = (value: string) => {
    setJsonText(value);
    
    try {
      const parsed = JSON.parse(value);
      setIsValidJson(true);
      setParseError(null);
      if (onRuleChange) {
        onRuleChange(parsed);
      }
    } catch (error) {
      setIsValidJson(false);
      setParseError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy JSON:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rule-${rule?.name?.replace(/\s+/g, '-').toLowerCase() || 'untitled'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const renderVisualRule = () => {
    if (!rule) return null;

    return (
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{rule.name || 'Untitled Rule'}</h3>
            <p className="text-muted-foreground">{rule.description || 'No description'}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={rule.is_active ? 'default' : 'secondary'}>
              {rule.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">
              Priority: {rule.priority || 1}
            </Badge>
            <Badge variant="outline">
              Version: {rule.version || 1}
            </Badge>
          </div>
        </div>

        {/* Conditions */}
        {rule.conditions && rule.conditions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Conditions</h4>
            <div className="space-y-2">
              {rule.conditions.map((condition, index) => (
                <div key={condition.id || index} className="rounded-lg border bg-blue-50/50 p-3 dark:bg-blue-900/20">
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {condition.type}
                      </Badge>
                      <span className="font-medium">{condition.field}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {condition.operator} {formatValue(condition.value)}
                      {condition.time_window && (
                        <span className="ml-2">
                          for {condition.time_window.duration} {condition.time_window.unit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {rule.actions && rule.actions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Actions</h4>
            <div className="space-y-2">
              {rule.actions.map((action, index) => (
                <div key={action.id || index} className="rounded-lg border bg-green-50/50 p-3 dark:bg-green-900/20">
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {action.type}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      {Object.entries(action.parameters || {}).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-medium">{key}:</span>
                          <span>{formatValue(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {rule.metadata && (
          <div className="space-y-3">
            <h4 className="font-medium">Metadata</h4>
            <div className="space-y-2 text-sm">
              {rule.metadata.tags && rule.metadata.tags.length > 0 && (
                <div>
                  <span className="font-medium">Tags: </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {rule.metadata.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {rule.metadata.business_justification && (
                <div>
                  <span className="font-medium">Business Justification: </span>
                  <p className="text-muted-foreground">{rule.metadata.business_justification}</p>
                </div>
              )}
              
              {rule.metadata.risk_assessment && (
                <div>
                  <span className="font-medium">Risk Level: </span>
                  <Badge 
                    variant={
                      rule.metadata.risk_assessment.overall_risk === 'high' ? 'destructive' :
                      rule.metadata.risk_assessment.overall_risk === 'medium' ? 'default' :
                      'secondary'
                    }
                  >
                    {rule.metadata.risk_assessment.overall_risk}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!rule) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Code className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No rule selected</p>
            <p className="text-sm text-muted-foreground">
              Create or select a rule to view its JSON structure
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Rule Configuration</h2>
          {!isValidJson && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Invalid JSON
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          {!readonly && (
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4" />
              Test Rule
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="visual" className="gap-2">
                <Eye className="h-4 w-4" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="formatted" className="gap-2">
                <Braces className="h-4 w-4" />
                Formatted
              </TabsTrigger>
              <TabsTrigger value="raw" className="gap-2">
                <Edit className="h-4 w-4" />
                Raw JSON
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Tabs value={activeView}>
            <TabsContent value="visual" className="mt-0">
              <ScrollArea className="h-96">
                {renderVisualRule()}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="formatted" className="mt-0">
              <ScrollArea className="h-96">
                <pre className="text-sm bg-muted/50 rounded-lg p-4 overflow-x-auto">
                  <code>{jsonText}</code>
                </pre>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="raw" className="mt-0">
              <div className="space-y-2">
                <Textarea
                  value={jsonText}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  placeholder="Enter rule JSON here..."
                  className={`font-mono text-sm min-h-96 ${!isValidJson ? 'border-destructive' : ''}`}
                  readOnly={readonly}
                />
                {parseError && (
                  <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                    {parseError}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* JSON Schema Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rule Schema</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Conditions:</span>
              <span>{rule.conditions?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actions:</span>
              <span>{rule.actions?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Priority:</span>
              <span>{rule.priority || 1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span>{rule.version || 1}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}