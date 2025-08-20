'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Users,
  UserPlus,
  Mail,
  MessageSquare,
  Video,
  Calendar,
  Star,
  Shield,
  Clock,
  Activity,
  Send,
  Search
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Strategy Director',
    status: 'online',
    avatar: 'SC',
    expertise: ['Strategy', 'Leadership'],
    contribution: 92,
    missions: 47
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Channel Specialist',
    status: 'online',
    avatar: 'MR',
    expertise: ['Google Ads', 'Meta'],
    contribution: 87,
    missions: 35
  },
  {
    id: 3,
    name: 'Aisha Patel',
    role: 'Data Analyst',
    status: 'busy',
    avatar: 'AP',
    expertise: ['Analytics', 'ML'],
    contribution: 94,
    missions: 52
  },
  {
    id: 4,
    name: 'Tom Wilson',
    role: 'Content Manager',
    status: 'offline',
    avatar: 'TW',
    expertise: ['SEO', 'Content'],
    contribution: 78,
    missions: 28
  },
  {
    id: 5,
    name: 'Emma Liu',
    role: 'Budget Manager',
    status: 'online',
    avatar: 'EL',
    expertise: ['Finance', 'Allocation'],
    contribution: 91,
    missions: 41
  }
];

const recentActivity = [
  { user: 'Sarah Chen', action: 'completed experiment', target: 'LinkedIn Campaign A/B Test', time: '5 min ago' },
  { user: 'Marcus Rodriguez', action: 'updated channel settings for', target: 'Google Ads', time: '1 hour ago' },
  { user: 'Aisha Patel', action: 'shared insights on', target: 'Q4 Performance Report', time: '2 hours ago' },
  { user: 'Emma Liu', action: 'optimized budget for', target: 'Display Network', time: '3 hours ago' },
  { user: 'Tom Wilson', action: 'created content for', target: 'Email Campaign #7', time: '5 hours ago' }
];

export default function CollaborationPage() {
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm text-blue-400 font-medium">Team Collaboration</span>
            </div>
            <p className="text-gray-400 text-sm">
              Collaborate with your STARTUP_PATH team members
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-black/40 border-gray-500/30 text-gray-300 hover:bg-gray-700/50">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Video className="h-4 w-4 mr-2" />
              Start Meeting
            </Button>
          </div>
        </div>
      </div>

      {/* Team Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          Team Overview
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-black/40 border border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">3/5</div>
              <p className="text-xs text-gray-400 mt-1">Currently online</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-300 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Team Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">88%</div>
              <p className="text-xs text-gray-400 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-300 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Missions Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">203</div>
              <p className="text-xs text-gray-400 mt-1">Total missions</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Members */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Team Members
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search team..." 
              className="pl-9 bg-black/40 border-gray-500/30 text-white placeholder:text-gray-400 w-64"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-4 rounded-lg bg-black/40 border border-gray-500/30 hover:border-gray-400/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-blue-500/30">
                        <AvatarImage src={`/avatars/${member.id}.png`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                        member.status === 'online' ? 'bg-green-400' :
                        member.status === 'busy' ? 'bg-yellow-400' :
                        'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                      <p className="text-xs text-blue-300">{member.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-blue-500/30 text-blue-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Contribution</span>
                      <span className="text-white">{member.contribution}%</span>
                    </div>
                    <Progress value={member.contribution} className="h-1" />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-400">{member.missions} missions</span>
                    <Button size="sm" variant="ghost" className="h-7 text-gray-400 hover:text-white">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Activity and Communication */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          Activity & Communication
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-black/40 border border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xs text-white font-semibold">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      <span className="font-semibold text-blue-300">{activity.user}</span>
                      {' '}{activity.action}{' '}
                      <span className="text-cyan-300">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

          {/* Team Chat */}
          <Card className="bg-black/40 border border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              Team Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4 h-[200px] overflow-y-hidden">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-blue-600">SC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-blue-900/30 rounded-lg p-3">
                    <p className="text-sm text-white">Great work on the LinkedIn campaign! ROI is up 45%.</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Sarah Chen • 10 min ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-purple-600">AP</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-purple-900/30 rounded-lg p-3">
                    <p className="text-sm text-white">The data shows we should increase budget on Google Ads by 20%.</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Aisha Patel • 25 min ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-green-600">MR</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-green-900/30 rounded-lg p-3">
                    <p className="text-sm text-white">I&apos;ll handle the optimization. Should be done by EOD.</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Marcus Rodriguez • 30 min ago</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Type your message..." 
                className="flex-1 bg-black/40 border-gray-500/30 text-white placeholder:text-gray-400"
              />
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          Upcoming Meetings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Weekly Sync', time: 'Today, 3:00 PM', attendees: 5, type: 'sync' },
            { title: 'Channel Review', time: 'Tomorrow, 10:00 AM', attendees: 3, type: 'review' },
            { title: 'Budget Planning', time: 'Friday, 2:00 PM', attendees: 4, type: 'planning' }
          ].map((meeting, i) => (
            <div key={i} className="p-4 rounded-lg bg-black/40 border border-gray-500/30">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">{meeting.title}</h3>
                <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-300">
                  {meeting.type}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 mb-3">{meeting.time}</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[...Array(meeting.attendees)].map((_, j) => (
                    <div key={j} className="w-6 h-6 rounded-full bg-blue-600/80 border-2 border-black" />
                  ))}
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-gray-400 hover:text-white">
                  Join
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="pb-8"></div>
    </div>
  );
}