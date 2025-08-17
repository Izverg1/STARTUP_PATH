'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  Calendar, 
  User, 
  Eye, 
  RotateCcw, 
  GitCommit,
  FileText,
  Diff,
  Download,
  Copy,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { BusinessRule, RuleVersion, ChangeType } from '@/types/rules';
import { formatDistance } from 'date-fns';

interface VersionHistoryProps {
  rule: Partial<BusinessRule>;
  onRestoreVersion?: (versionId: string) => void;
  onCompareVersions?: (version1: string, version2: string) => void;
}

export function VersionHistory({ rule, onRestoreVersion, onCompareVersions }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<RuleVersion | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  // Mock version history
  const versions: RuleVersion[] = [
    {
      id: 'v3',
      rule_id: rule.id || '',
      version_number: 3,
      changes: [
        {
          type: 'condition_modified',
          field: 'conditions[0].value',
          old_value: 24,
          new_value: 18,
          description: 'Reduced payback threshold from 24 to 18 months'
        },
        {
          type: 'action_modified',
          field: 'actions[0].parameters.notify_stakeholders',
          old_value: false,
          new_value: true,
          description: 'Enable stakeholder notifications'
        }
      ],
      change_summary: 'Reduced payback threshold and enabled notifications',
      author_id: 'john-doe',
      approval_status: 'approved',
      approved_by: 'sarah-wilson',
      approved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      activation_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      is_current: true,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'v2',
      rule_id: rule.id || '',
      version_number: 2,
      changes: [
        {
          type: 'condition_added',
          field: 'conditions[1]',
          old_value: null,
          new_value: {
            type: 'time_based',
            field: 'experiment_duration',
            operator: 'greater_than',
            value: 7
          },
          description: 'Added minimum experiment duration condition'
        },
        {
          type: 'priority_changed',
          field: 'priority',
          old_value: 2,
          new_value: 1,
          description: 'Increased rule priority'
        }
      ],
      change_summary: 'Added experiment duration check and increased priority',
      author_id: 'mike-chen',
      approval_status: 'approved',
      approved_by: 'sarah-wilson',
      approved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      activation_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      is_current: false,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'v1',
      rule_id: rule.id || '',
      version_number: 1,
      changes: [
        {
          type: 'created',
          field: 'rule',
          old_value: null,
          new_value: rule,
          description: 'Initial rule creation'
        }
      ],
      change_summary: 'Initial rule creation',
      author_id: 'john-doe',
      approval_status: 'approved',
      approved_by: 'sarah-wilson',
      approved_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      activation_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      is_current: false,
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const getChangeTypeIcon = (type: ChangeType) => {
    switch (type) {
      case 'created':
        return <GitCommit className="h-4 w-4 text-green-600" />;
      case 'modified':
      case 'condition_modified':
      case 'action_modified':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'condition_added':
      case 'action_added':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'condition_removed':
      case 'action_removed':
      case 'deleted':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Diff className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeTypeBadge = (type: ChangeType) => {
    const isDestructive = ['deleted', 'condition_removed', 'action_removed'].includes(type);
    const isAdditive = ['created', 'condition_added', 'action_added'].includes(type);
    
    return (
      <Badge variant={isDestructive ? 'destructive' : isAdditive ? 'default' : 'secondary'}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  const handleVersionSelect = (versionId: string) => {
    if (compareMode) {
      if (selectedVersions.includes(versionId)) {
        setSelectedVersions(selectedVersions.filter(id => id !== versionId));
      } else if (selectedVersions.length < 2) {
        setSelectedVersions([...selectedVersions, versionId]);
      }
    } else {
      const version = versions.find(v => v.id === versionId);
      setSelectedVersion(version || null);
    }
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2 && onCompareVersions) {
      onCompareVersions(selectedVersions[0], selectedVersions[1]);
    }
  };

  const getUserInfo = (userId: string) => {
    // Mock user data
    const users: Record<string, any> = {
      'john-doe': { name: 'John Doe', initials: 'JD', avatar: '/avatars/john.jpg' },
      'mike-chen': { name: 'Mike Chen', initials: 'MC', avatar: '/avatars/mike.jpg' },
      'sarah-wilson': { name: 'Sarah Wilson', initials: 'SW', avatar: '/avatars/sarah.jpg' }
    };
    return users[userId] || { name: 'Unknown User', initials: 'U', avatar: null };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Version History</h2>
          <Badge variant="outline">{versions.length} versions</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setCompareMode(!compareMode);
              setSelectedVersions([]);
            }}
          >
            <Diff className="h-4 w-4" />
            {compareMode ? 'Exit Compare' : 'Compare Versions'}
          </Button>
          {compareMode && selectedVersions.length === 2 && (
            <Button size="sm" onClick={handleCompare}>
              <Eye className="h-4 w-4" />
              Compare Selected
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Versions List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Versions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {versions.map((version) => {
                    const author = getUserInfo(version.author_id);
                    const approver = version.approved_by ? getUserInfo(version.approved_by) : null;
                    const isSelected = compareMode && selectedVersions.includes(version.id);
                    
                    return (
                      <div
                        key={version.id}
                        className={`rounded-lg border p-3 cursor-pointer transition-all ${
                          isSelected ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                        } ${version.is_current ? 'border-green-200 bg-green-50/50' : ''}`}
                        onClick={() => handleVersionSelect(version.id)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={version.is_current ? 'default' : 'secondary'}>
                                v{version.version_number}
                              </Badge>
                              {version.is_current && (
                                <Badge variant="outline" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <Badge variant={
                              version.approval_status === 'approved' ? 'default' :
                              version.approval_status === 'rejected' ? 'destructive' :
                              'secondary'
                            } className="text-xs">
                              {version.approval_status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm font-medium">{version.change_summary}</p>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={author.avatar} />
                              <AvatarFallback className="text-xs">{author.initials}</AvatarFallback>
                            </Avatar>
                            <span>{author.name}</span>
                            <span>•</span>
                            <span>{formatDistance(new Date(version.created_at), new Date(), { addSuffix: true })}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {version.changes.slice(0, 2).map((change, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {change.type.replace('_', ' ')}
                              </Badge>
                            ))}
                            {version.changes.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{version.changes.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Version Details */}
        <div className="lg:col-span-2">
          {selectedVersion ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Version {selectedVersion.version_number} Details</CardTitle>
                  <div className="flex items-center gap-2">
                    {!selectedVersion.is_current && (
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4" />
                        Restore Version
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="changes" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="changes">Changes</TabsTrigger>
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    <TabsTrigger value="approval">Approval</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="changes" className="space-y-4">
                    <div className="space-y-3">
                      {selectedVersion.changes.map((change, index) => (
                        <div key={index} className="rounded-lg border p-3">
                          <div className="flex items-start gap-3">
                            {getChangeTypeIcon(change.type)}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                {getChangeTypeBadge(change.type)}
                                <span className="text-sm font-medium">{change.field}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {change.description}
                              </p>
                              {change.old_value !== null && change.new_value !== null && (
                                <div className="grid gap-2 text-xs">
                                  <div className="bg-red-50 rounded p-2 border border-red-200">
                                    <span className="text-red-700 font-medium">- </span>
                                    <span className="text-red-600">
                                      {typeof change.old_value === 'object' 
                                        ? JSON.stringify(change.old_value, null, 2)
                                        : String(change.old_value)
                                      }
                                    </span>
                                  </div>
                                  <div className="bg-green-50 rounded p-2 border border-green-200">
                                    <span className="text-green-700 font-medium">+ </span>
                                    <span className="text-green-600">
                                      {typeof change.new_value === 'object' 
                                        ? JSON.stringify(change.new_value, null, 2)
                                        : String(change.new_value)
                                      }
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="metadata" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Author</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={getUserInfo(selectedVersion.author_id).avatar} />
                              <AvatarFallback className="text-xs">
                                {getUserInfo(selectedVersion.author_id).initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{getUserInfo(selectedVersion.author_id).name}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Created</label>
                          <p className="text-sm text-muted-foreground">
                            {new Date(selectedVersion.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Status</label>
                          <div className="mt-1">
                            <Badge variant={
                              selectedVersion.approval_status === 'approved' ? 'default' :
                              selectedVersion.approval_status === 'rejected' ? 'destructive' :
                              'secondary'
                            }>
                              {selectedVersion.approval_status}
                            </Badge>
                          </div>
                        </div>
                        
                        {selectedVersion.activation_date && (
                          <div>
                            <label className="text-sm font-medium">Activated</label>
                            <p className="text-sm text-muted-foreground">
                              {new Date(selectedVersion.activation_date).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="approval" className="space-y-4">
                    {selectedVersion.approved_by && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Approved By</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={getUserInfo(selectedVersion.approved_by).avatar} />
                              <AvatarFallback className="text-xs">
                                {getUserInfo(selectedVersion.approved_by).initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{getUserInfo(selectedVersion.approved_by).name}</span>
                          </div>
                        </div>
                        
                        {selectedVersion.approved_at && (
                          <div>
                            <label className="text-sm font-medium">Approval Date</label>
                            <p className="text-sm text-muted-foreground">
                              {new Date(selectedVersion.approved_at).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <GitBranch className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Select a version to view details</p>
                  <p className="text-sm text-muted-foreground">
                    {compareMode ? 'Select 2 versions to compare' : 'Click on any version from the list'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}