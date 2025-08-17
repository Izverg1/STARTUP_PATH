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
    name: 'Captain Sarah Chen',
    role: 'Mission Commander',
    status: 'online',
    avatar: 'SC',
    expertise: ['Strategy', 'Leadership'],
    contribution: 92,
    missions: 47
  },
  {
    id: 2,
    name: 'Lt. Marcus Rodriguez',
    role: 'Channel Specialist',
    status: 'online',
    avatar: 'MR',
    expertise: ['Google Ads', 'Meta'],
    contribution: 87,
    missions: 35
  },
  {
    id: 3,
    name: 'Eng. Aisha Patel',
    role: 'Data Officer',
    status: 'busy',
    avatar: 'AP',
    expertise: ['Analytics', 'ML'],
    contribution: 94,
    missions: 52
  },
  {
    id: 4,
    name: 'Pilot Tom Wilson',
    role: 'Content Navigator',
    status: 'offline',
    avatar: 'TW',
    expertise: ['SEO', 'Content'],
    contribution: 78,
    missions: 28
  },
  {
    id: 5,
    name: 'Dr. Emma Liu',
    role: 'Budget Optimizer',
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
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 py-6">
        <div className="min-w-[1400px] space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Crew Quarters
          </h1>
          <p className="text-blue-200/70 mt-2">
            Collaborate with your Startup_Path mission crew
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Crew
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            <Video className="h-4 w-4 mr-2" />
            Start Briefing
          </Button>
        </div>
      </div>

      {/* Team Overview */}
      <div className="flex gap-6 pb-4">
        <Card className="bg-green-900/20 border-green-500/30 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-300 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Crew
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">3/5</div>
            <p className="text-xs text-green-200/60 mt-1">Currently online</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/20 border-blue-500/30 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-300 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Team Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">88%</div>
            <p className="text-xs text-blue-200/60 mt-1">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/20 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Missions Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">203</div>
            <p className="text-xs text-purple-200/60 mt-1">Total missions</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Mission Crew
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search crew..." 
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-400 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="min-w-[320px] p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
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
                    <Button size="sm" variant="ghost" className="h-7 text-blue-400 hover:text-blue-300">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity and Communication */}
      <div className="flex gap-6 pb-4">
        <div className="min-w-[600px]">
        {/* Recent Activity */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
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
        </div>

        {/* Mission Chat */}
        <div className="min-w-[600px]">
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              Mission Comms
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
                    <p className="text-sm text-white">I'll handle the optimization. Should be done by EOD.</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Marcus Rodriguez • 30 min ago</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Type your message..." 
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-yellow-400" />
            Upcoming Mission Briefings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              { title: 'Weekly Sync', time: 'Today, 3:00 PM', attendees: 5, type: 'sync' },
              { title: 'Channel Review', time: 'Tomorrow, 10:00 AM', attendees: 3, type: 'review' },
              { title: 'Budget Planning', time: 'Friday, 2:00 PM', attendees: 4, type: 'planning' }
            ].map((meeting, i) => (
              <div key={i} className="min-w-[280px] p-4 rounded-lg bg-white/5 border border-white/10">
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
                      <div key={j} className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border-2 border-black" />
                    ))}
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-blue-400 hover:text-blue-300">
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}