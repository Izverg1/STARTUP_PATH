'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Copy, 
  History, 
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  GitBranch,
  BarChart3,
  Settings
} from 'lucide-react';
import { BusinessRule, ApprovalStatus } from '@/types/rules';
import { formatDistance } from 'date-fns';

interface RulesListProps {
  rules: Partial<BusinessRule>[];
  onRuleUpdate?: (ruleId: string, updates: Partial<BusinessRule>) => void;
  onRuleDelete?: (ruleId: string) => void;
  onRuleEdit?: (rule: Partial<BusinessRule>) => void;
}

export function RulesList({ rules, onRuleUpdate, onRuleDelete, onRuleEdit }: RulesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updated_at');
  const [selectedRule, setSelectedRule] = useState<Partial<BusinessRule> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  const getStatusBadge = (status: ApprovalStatus) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, icon: Clock, label: 'Draft' },
      pending_approval: { variant: 'default' as const, icon: Clock, label: 'Pending' },
      approved: { variant: 'default' as const, icon: CheckCircle, label: 'Approved' },
      rejected: { variant: 'destructive' as const, icon: AlertTriangle, label: 'Rejected' },
      auto_approved: { variant: 'default' as const, icon: CheckCircle, label: 'Auto-Approved' },
      expired: { variant: 'secondary' as const, icon: AlertTriangle, label: 'Expired' }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const toggleRuleActive = (ruleId: string, currentActive: boolean) => {
    if (onRuleUpdate) {
      onRuleUpdate(ruleId, { is_active: !currentActive });
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    setRuleToDelete(ruleId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (ruleToDelete && onRuleDelete) {
      onRuleDelete(ruleToDelete);
    }
    setDeleteDialogOpen(false);
    setRuleToDelete(null);
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || rule.approval_status === statusFilter;
    
    const matchesActive = activeFilter === 'all' || 
                         (activeFilter === 'active' && rule.is_active) ||
                         (activeFilter === 'inactive' && !rule.is_active);

    return matchesSearch && matchesStatus && matchesActive;
  });

  const sortedRules = [...filteredRules].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'priority':
        return (a.priority || 0) - (b.priority || 0);
      case 'created_at':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case 'updated_at':
      default:
        return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
    }
  });

  const getRuleMetrics = (rule: Partial<BusinessRule>) => {
    // Mock metrics - in real app, these would come from analytics
    return {
      executions: Math.floor(Math.random() * 100) + 10,
      successRate: Math.floor(Math.random() * 30) + 70,
      lastTriggered: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      impact: Math.floor(Math.random() * 50) + 10
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Active Rules</h2>
          <p className="text-muted-foreground">
            {filteredRules.length} of {rules.length} rules
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4" />
          Bulk Actions
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending_approval">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rules</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated_at">Last Updated</SelectItem>
                  <SelectItem value="created_at">Created Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-4">
        {sortedRules.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <Filter className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">No rules found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search criteria or create a new rule
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedRules.map((rule) => {
            const metrics = getRuleMetrics(rule);
            
            return (
              <Card key={rule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{rule.name}</h3>
                          {rule.approval_status && getStatusBadge(rule.approval_status)}
                          <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                            {rule.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">
                            v{rule.version || 1}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rule.description}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onRuleEdit?.(rule)}>
                            <Edit className="h-4 w-4" />
                            Edit Rule
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => rule.id && toggleRuleActive(rule.id, rule.is_active || false)}>
                            {rule.is_active ? (
                              <>
                                <Pause className="h-4 w-4" />
                                Pause Rule
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                Activate Rule
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <History className="h-4 w-4" />
                            View History
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="h-4 w-4" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => rule.id && handleDeleteRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Rule Details */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <CheckCircle className="h-3 w-3" />
                          Conditions
                        </div>
                        <p className="text-sm font-medium">
                          {rule.conditions?.length || 0} condition{(rule.conditions?.length || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Play className="h-3 w-3" />
                          Actions
                        </div>
                        <p className="text-sm font-medium">
                          {rule.actions?.length || 0} action{(rule.actions?.length || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <BarChart3 className="h-3 w-3" />
                          Executions
                        </div>
                        <p className="text-sm font-medium">
                          {metrics.executions} ({metrics.successRate}% success)
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Last Triggered
                        </div>
                        <p className="text-sm font-medium">
                          {formatDistance(metrics.lastTriggered, new Date(), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    {rule.metadata?.tags && rule.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rule.metadata.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>Priority: {rule.priority || 1}</span>
                        {rule.updated_at && (
                          <span>
                            Updated {formatDistance(new Date(rule.updated_at), new Date(), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 ${metrics.impact > 30 ? 'text-green-600' : metrics.impact > 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {metrics.impact > 30 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          <span>{metrics.impact}% impact</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this rule? This action cannot be undone.
              The rule will be immediately deactivated and removed from all rulesets.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}