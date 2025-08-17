'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Settings, 
  MessageSquare, 
  Calendar,
  Filter,
  MoreHorizontal,
  Crown,
  Shield,
  Eye,
  Lock,
  Globe,
  Hash,
  Clock,
  UserPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import type { Space, SpaceType, SpaceVisibility, SpaceMemberRole, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface SpacesProps {
  spaces: Space[];
  currentUser: User;
  onCreateSpace: (space: Omit<Space, 'id' | 'created_at' | 'updated_at' | 'members'>) => void;
  onJoinSpace: (spaceId: string) => void;
  onLeaveSpace: (spaceId: string) => void;
  onUpdateSpace: (spaceId: string, updates: Partial<Space>) => void;
  onInviteMembers: (spaceId: string, userIds: string[]) => void;
  onRemoveMember: (spaceId: string, userId: string) => void;
  onUpdateMemberRole: (spaceId: string, userId: string, role: SpaceMemberRole) => void;
  onSelectSpace: (space: Space) => void;
}

const spaceTypeIcons = {
  general: MessageSquare,
  experiment: Hash,
  decision: Shield,
  review: Eye
};

const spaceTypeLabels = {
  general: 'General Discussion',
  experiment: 'Experiment Planning',
  decision: 'Decision Making',
  review: 'Review & Analysis'
};

const visibilityIcons = {
  public: Globe,
  private: Lock,
  restricted: Shield
};

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: Users,
  observer: Eye
};

export function Spaces({
  spaces,
  currentUser,
  onCreateSpace,
  onJoinSpace,
  onLeaveSpace,
  onUpdateSpace,
  onInviteMembers,
  onRemoveMember,
  onUpdateMemberRole,
  onSelectSpace
}: SpacesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<SpaceType | 'all'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedSpaceForInvite, setSelectedSpaceForInvite] = useState<Space | null>(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    type: 'general' as SpaceType,
    visibility: 'private' as SpaceVisibility,
    settings: {
      notifications_enabled: true,
      auto_archive_days: 30,
      require_approval_for_decisions: true,
      allow_external_attachments: true,
      thread_auto_resolve_days: 7
    }
  });

  const filteredSpaces = useMemo(() => {
    return spaces.filter(space => {
      const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          space.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || space.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [spaces, searchQuery, filterType]);

  const mySpaces = filteredSpaces.filter(space => 
    space.members.some(member => member.user_id === currentUser.id)
  );

  const publicSpaces = filteredSpaces.filter(space => 
    space.visibility === 'public' && 
    !space.members.some(member => member.user_id === currentUser.id)
  );

  const handleCreateSpace = () => {
    onCreateSpace({
      name: createForm.name,
      description: createForm.description,
      project_id: '', // This would come from context
      owner_id: currentUser.id,
      type: createForm.type,
      visibility: createForm.visibility,
      settings: createForm.settings
    });
    setShowCreateDialog(false);
    setCreateForm({
      name: '',
      description: '',
      type: 'general',
      visibility: 'private',
      settings: {
        notifications_enabled: true,
        auto_archive_days: 30,
        require_approval_for_decisions: true,
        allow_external_attachments: true,
        thread_auto_resolve_days: 7
      }
    });
  };

  const getUserRole = (space: Space): SpaceMemberRole | null => {
    const member = space.members.find(m => m.user_id === currentUser.id);
    return member?.role || null;
  };

  const canManageSpace = (space: Space): boolean => {
    const role = getUserRole(space);
    return role === 'owner' || role === 'admin';
  };

  const getActiveThreadsCount = (space: Space): number => {
    // This would come from the threads data
    return Math.floor(Math.random() * 10) + 1;
  };

  const getLastActivityTime = (space: Space): string => {
    // This would come from the latest message/activity
    const randomHours = Math.floor(Math.random() * 24);
    return formatDistanceToNow(new Date(Date.now() - randomHours * 60 * 60 * 1000), { addSuffix: true });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Collaboration Spaces</h1>
          <p className="text-muted-foreground">
            Organize discussions, decisions, and experiments with your team
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" />
              Create Space
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Space</DialogTitle>
              <DialogDescription>
                Create a collaborative space for your team to discuss and make decisions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Space Name</Label>
                <Input
                  id="name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter space name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose of this space"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Space Type</Label>
                  <Select
                    value={createForm.type}
                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, type: value as SpaceType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(spaceTypeLabels).map(([type, label]) => (
                        <SelectItem key={type} value={type}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Visibility</Label>
                  <RadioGroup
                    value={createForm.visibility}
                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, visibility: value as SpaceVisibility }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Private
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Public
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="grid gap-3">
                <Label>Settings</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifications"
                      checked={createForm.settings.notifications_enabled}
                      onCheckedChange={(checked) => setCreateForm(prev => ({
                        ...prev,
                        settings: { ...prev.settings, notifications_enabled: checked as boolean }
                      }))}
                    />
                    <Label htmlFor="notifications">Enable notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="approval"
                      checked={createForm.settings.require_approval_for_decisions}
                      onCheckedChange={(checked) => setCreateForm(prev => ({
                        ...prev,
                        settings: { ...prev.settings, require_approval_for_decisions: checked as boolean }
                      }))}
                    />
                    <Label htmlFor="approval">Require approval for decisions</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSpace} disabled={!createForm.name.trim()}>
                Create Space
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search spaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterType}
          onValueChange={(value) => setFilterType(value as SpaceType | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(spaceTypeLabels).map(([type, label]) => (
              <SelectItem key={type} value={type}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Spaces Tabs */}
      <Tabs defaultValue="my-spaces" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-spaces">My Spaces ({mySpaces.length})</TabsTrigger>
          <TabsTrigger value="discover">Discover ({publicSpaces.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="my-spaces" className="space-y-4">
          {mySpaces.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No spaces yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create or join a space to start collaborating with your team.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4" />
                  Create Your First Space
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {mySpaces.map((space) => {
                const TypeIcon = spaceTypeIcons[space.type];
                const VisibilityIcon = visibilityIcons[space.visibility];
                const userRole = getUserRole(space);
                const RoleIcon = userRole ? roleIcons[userRole] : Users;
                
                return (
                  <Card 
                    key={space.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSelectSpace(space)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="w-5 h-5 text-primary" />
                          <div>
                            <CardTitle className="text-lg">{space.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {spaceTypeLabels[space.type]}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              setSelectedSpaceForInvite(space);
                              setShowInviteDialog(true);
                            }}>
                              <UserPlus className="w-4 h-4" />
                              Invite Members
                            </DropdownMenuItem>
                            {canManageSpace(space) && (
                              <DropdownMenuItem>
                                <Settings className="w-4 h-4" />
                                Settings
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => onLeaveSpace(space.id)}
                            >
                              Leave Space
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {space.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {space.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {space.members.length}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {getActiveThreadsCount(space)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <RoleIcon className="w-3 h-3" />
                            {userRole}
                          </Badge>
                          <VisibilityIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getLastActivityTime(space)}
                        </div>
                        <div className="flex -space-x-2">
                          {space.members.slice(0, 3).map((member) => (
                            <Avatar key={member.user_id} className="w-6 h-6 border-2 border-background">
                              <img
                                src={member.user.avatar_url || `https://avatar.vercel.sh/${member.user.email}`}
                                alt={member.user.name}
                              />
                            </Avatar>
                          ))}
                          {space.members.length > 3 && (
                            <div className="w-6 h-6 bg-muted rounded-full border-2 border-background flex items-center justify-center text-xs">
                              +{space.members.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          {publicSpaces.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Globe className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No public spaces available</h3>
                <p className="text-muted-foreground text-center">
                  Check back later or ask your team members to make their spaces public.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {publicSpaces.map((space) => {
                const TypeIcon = spaceTypeIcons[space.type];
                
                return (
                  <Card key={space.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{space.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {spaceTypeLabels[space.type]}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {space.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {space.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {space.members.length} members
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {getActiveThreadsCount(space)} threads
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => onJoinSpace(space.id)}
                      >
                        Join Space
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Invite Members Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Members</DialogTitle>
            <DialogDescription>
              Invite team members to join {selectedSpaceForInvite?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Email Addresses</Label>
              <Textarea
                placeholder="Enter email addresses separated by commas or new lines"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label>Default Role</Label>
              <Select defaultValue="member">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="observer">Observer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button>Send Invitations</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}