'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users,
  MessageSquare,
  Calendar,
  Star,
  Clock,
  Activity,
  Send,
  Search,
  Video,
  Phone,
  Mail,
  MoreHorizontal,
  Plus,
  UserPlus,
  Shield,
  Eye,
  Edit,
  Crown,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, getOrganizationTeamMembers, inviteTeamMember } from '@/lib/db/client-queries';
import type { Tables } from '@/lib/supabase/client';

type User = Tables<'SPATH_users'>;

export default function CollaborationPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('team');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'contributor' | 'viewer'>('contributor');
  const [inviting, setInviting] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Load team members from database
  useEffect(() => {
    loadTeamMembers();
  }, [user]);

  const loadTeamMembers = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userProfile = await getUserProfile(user.id);
      if (userProfile?.SPATH_orgs?.id) {
        const members = await getOrganizationTeamMembers(userProfile.SPATH_organizations.id);
        setTeamMembers(members);
      }
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteTeamMember = async () => {
    if (!user || !inviteEmail.trim()) return;
    
    setInviting(true);
    try {
      const userProfile = await getUserProfile(user.id);
      if (userProfile?.SPATH_orgs?.id) {
        const newMember = await inviteTeamMember(userProfile.SPATH_organizations.id, inviteEmail.trim(), inviteRole);
        if (newMember) {
          setTeamMembers(prev => [...prev, newMember]);
          setInviteEmail('');
          setShowInviteDialog(false);
        }
      }
    } catch (error) {
      console.error('Error inviting team member:', error);
    } finally {
      setInviting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'admin': return <Shield className="h-4 w-4 text-red-400" />;
      case 'contributor': return <Edit className="h-4 w-4 text-blue-400" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-400" />;
      default: return <Users className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'admin': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'contributor': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'viewer': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chatMessages = [
    { id: 1, user: 'System', avatar: 'SY', message: 'Welcome to STARTUP_PATH collaboration! Invite team members to start collaborating.', time: 'System', color: 'blue' }
  ];

  const [messages, setMessages] = useState(chatMessages);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        user: 'You',
        avatar: 'YO',
        message: newMessage,
        time: 'now',
        color: 'magenta'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const meetings = [
    { id: 1, title: 'Weekly Team Sync', time: 'No meetings scheduled', attendees: teamMembers.length, type: 'sync', active: false },
  ];

  const recentActivity = teamMembers.length > 0 ? [
    { user: 'Team', action: 'collaboration started', target: 'STARTUP_PATH Platform', time: 'Recently' }
  ] : [];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-magenta-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Team Collaboration</h1>
              <p className="text-sm text-gray-400">Manage team members and collaborate on projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4 grid w-auto grid-cols-4 h-9 bg-gray-900/50">
            <TabsTrigger value="team" className="text-xs">Team</TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
            <TabsTrigger value="meetings" className="text-xs">Meetings</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>

          {/* Team Tab */}
          <TabsContent value="team" className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-gray-900/30 border-green-500/30">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-300">Total</span>
                  </div>
                  <div className="text-xl font-bold text-green-400">{teamMembers.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/30 border-blue-500/30">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-3 w-3 text-blue-400" />
                    <span className="text-xs text-blue-300">Active</span>
                  </div>
                  <div className="text-xl font-bold text-blue-400">{teamMembers.filter(m => m.is_active).length}</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/30 border-purple-500/30">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-3 w-3 text-purple-400" />
                    <span className="text-xs text-purple-300">Pending</span>
                  </div>
                  <div className="text-xl font-bold text-purple-400">{teamMembers.filter(m => !m.is_active).length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search team members..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 h-9"
              />
            </div>

            {/* Add Team Member Button */}
            <div className="flex justify-end">
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-magenta-600 hover:bg-magenta-700 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Invite Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-300">Email Address</label>
                      <Input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="bg-gray-800 border-gray-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300">Role</label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                          <SelectItem value="contributor">Contributor - Can create and edit</SelectItem>
                          <SelectItem value="admin">Admin - Full access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="ghost" onClick={() => setShowInviteDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleInviteTeamMember}
                        disabled={inviting || !inviteEmail.trim()}
                        className="bg-magenta-600 hover:bg-magenta-700 text-white"
                      >
                        {inviting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Send Invitation
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Team Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-400">Loading team members...</span>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No team members found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No members match your search criteria.' : 'Invite colleagues to start collaborating.'}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowInviteDialog(true)}
                    className="bg-magenta-600 hover:bg-magenta-700 text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite First Member
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="bg-gray-900/30 border-gray-700 hover:border-magenta-500/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar_url || ''} />
                            <AvatarFallback className="bg-magenta-600 text-white text-sm">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
                            member.is_active ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-white">{member.name}</h3>
                            {getRoleIcon(member.role)}
                          </div>
                          <p className="text-xs text-gray-400">{member.email}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Mail className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-1 ${getRoleBadgeColor(member.role)}`}
                        >
                          {member.role}
                        </Badge>
                        
                        <div className="text-xs text-gray-400">
                          Joined {new Date(member.created_at).toLocaleDateString()}
                        </div>
                        
                        {member.last_login && (
                          <div className="text-xs text-gray-500">
                            Last active {new Date(member.last_login).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col px-4 py-4">
            <div className="flex-1 overflow-y-auto bg-gray-900/30 border border-gray-700 rounded-lg mb-4">
              <div className="p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={`bg-${msg.color}-600 text-white text-xs`}>
                        {msg.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{msg.user}</span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-sm text-gray-300">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-gray-900 border-gray-700 text-white"
              />
              <Button onClick={handleSendMessage} className="bg-magenta-600 hover:bg-magenta-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <Card className="bg-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  Upcoming Meetings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${meeting.active ? 'bg-green-400' : 'bg-gray-400'}`} />
                      <div>
                        <h4 className="text-sm font-medium text-white">{meeting.title}</h4>
                        <p className="text-xs text-gray-400">{meeting.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{meeting.attendees} members</span>
                      <Button size="sm" variant="ghost">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <Card className="bg-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">
                        <span className="text-white font-medium">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        <span className="text-magenta-300">{activity.target}</span>
                      </p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}