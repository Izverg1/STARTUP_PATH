'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare, 
  Send,
  AlertTriangle,
  GitBranch,
  Calendar,
  Eye,
  ThumbsUp,
  ThumbsDown,
  UserCheck,
  Users
} from 'lucide-react';
import { BusinessRule, ApprovalStatus, ApprovalWorkflow as ApprovalWorkflowType } from '@/types/rules';
import { formatDistance } from 'date-fns';

interface ApprovalWorkflowProps {
  rule: Partial<BusinessRule>;
  workflow?: ApprovalWorkflowType;
  onApprove?: (ruleId: string, comment?: string) => void;
  onReject?: (ruleId: string, reason: string) => void;
  onRequestChanges?: (ruleId: string, feedback: string) => void;
}

export function ApprovalWorkflow({ 
  rule, 
  workflow, 
  onApprove, 
  onReject, 
  onRequestChanges 
}: ApprovalWorkflowProps) {
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Mock approval history
  const approvalHistory = [
    {
      id: '1',
      action: 'submitted',
      user: { name: 'John Doe', avatar: '/avatars/john.jpg', initials: 'JD' },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      comment: 'Initial rule submission for review'
    },
    {
      id: '2',
      action: 'reviewed',
      user: { name: 'Sarah Wilson', avatar: '/avatars/sarah.jpg', initials: 'SW' },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      comment: 'Technical review completed. Logic looks sound but needs business stakeholder approval.'
    },
    {
      id: '3',
      action: 'pending',
      user: { name: 'Mike Chen', avatar: '/avatars/mike.jpg', initials: 'MC' },
      timestamp: new Date(),
      comment: 'Awaiting final approval from business team'
    }
  ];

  // Mock approvers
  const approvers = [
    {
      id: '1',
      name: 'Sarah Wilson',
      role: 'Technical Lead',
      avatar: '/avatars/sarah.jpg',
      initials: 'SW',
      status: 'approved',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      comment: 'Technical implementation is solid'
    },
    {
      id: '2',
      name: 'Mike Chen',
      role: 'Business Analyst',
      avatar: '/avatars/mike.jpg',
      initials: 'MC',
      status: 'pending',
      timestamp: null,
      comment: null
    },
    {
      id: '3',
      name: 'Lisa Park',
      role: 'Compliance Officer',
      avatar: '/avatars/lisa.jpg',
      initials: 'LP',
      status: 'pending',
      timestamp: null,
      comment: null
    }
  ];

  const handleApprove = async () => {
    if (!rule.id) return;
    setIsApproving(true);
    try {
      await onApprove?.(rule.id, approvalComment);
      setApprovalComment('');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rule.id || !rejectionReason.trim()) return;
    setIsRejecting(true);
    try {
      await onReject?.(rule.id, rejectionReason);
      setRejectionReason('');
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'submitted':
        return <Send className="h-4 w-4 text-blue-600" />;
      case 'reviewed':
        return <Eye className="h-4 w-4 text-purple-600" />;
      case 'approved':
        return <ThumbsUp className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <ThumbsDown className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-400" />;
    }
  };

  const canCurrentUserApprove = true; // In real app, check user permissions

  return (
    <div className="space-y-6">
      {/* Rule Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Approval Workflow
            </CardTitle>
            <Badge variant={rule.approval_status === 'approved' ? 'default' : 'secondary'}>
              {rule.approval_status?.replace('_', ' ') || 'Unknown'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">{rule.name}</h3>
            <p className="text-sm text-muted-foreground">{rule.description}</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                Version
              </div>
              <p className="text-sm font-medium">v{rule.version || 1}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Submitted
              </div>
              <p className="text-sm font-medium">
                {rule.created_at ? formatDistance(new Date(rule.created_at), new Date(), { addSuffix: true }) : 'Unknown'}
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                Approvers
              </div>
              <p className="text-sm font-medium">
                {approvers.filter(a => a.status === 'approved').length} of {approvers.length} approved
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approvers Status */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approvers.map((approver, index) => (
              <div key={approver.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={approver.avatar} />
                    <AvatarFallback>{approver.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{approver.name}</p>
                    <p className="text-sm text-muted-foreground">{approver.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(approver.status)}
                  <Badge variant={
                    approver.status === 'approved' ? 'default' :
                    approver.status === 'rejected' ? 'destructive' :
                    'secondary'
                  }>
                    {approver.status}
                  </Badge>
                  {approver.timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistance(approver.timestamp, new Date(), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval Actions */}
      {canCurrentUserApprove && rule.approval_status === 'pending_approval' && (
        <Card>
          <CardHeader>
            <CardTitle>Review Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Rule</DialogTitle>
                    <DialogDescription>
                      This will approve the rule and allow it to be activated.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add approval comment (optional)..."
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setApprovalComment('')}>
                      Cancel
                    </Button>
                    <Button onClick={handleApprove} disabled={isApproving}>
                      {isApproving ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Approve Rule
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <ThumbsDown className="h-4 w-4" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Rule</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for rejecting this rule.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setRejectionReason('')}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleReject} 
                      disabled={isRejecting || !rejectionReason.trim()}
                    >
                      {isRejecting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          Reject Rule
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Request Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval History */}
      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {approvalHistory.map((event, index) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-background border p-1">
                      {getActionIcon(event.action)}
                    </div>
                    {index < approvalHistory.length - 1 && (
                      <div className="w-px h-8 bg-border mt-2" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={event.user.avatar} />
                        <AvatarFallback className="text-xs">{event.user.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{event.user.name}</span>
                      <span className="text-sm text-muted-foreground capitalize">{event.action}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistance(event.timestamp, new Date(), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-8">
                      {event.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      {rule.metadata?.risk_assessment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Overall Risk:</span>
              <Badge variant={
                rule.metadata.risk_assessment.overall_risk === 'high' ? 'destructive' :
                rule.metadata.risk_assessment.overall_risk === 'medium' ? 'default' :
                'secondary'
              }>
                {rule.metadata.risk_assessment.overall_risk}
              </Badge>
            </div>
            
            <div>
              <span className="text-sm font-medium">Impact if Failure:</span>
              <p className="text-sm text-muted-foreground mt-1">
                {rule.metadata.risk_assessment.impact_if_failure}
              </p>
            </div>
            
            {rule.metadata.risk_assessment.mitigation_strategies.length > 0 && (
              <div>
                <span className="text-sm font-medium">Mitigation Strategies:</span>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  {rule.metadata.risk_assessment.mitigation_strategies.map((strategy, index) => (
                    <li key={index}>• {strategy}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}