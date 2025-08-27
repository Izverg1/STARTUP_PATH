'use client';

import React from 'react';
import { User, LogOut, Settings, HelpCircle, Building2, Bell, Bot, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Mock agent notifications - in real implementation, this would come from useAgents hook
  const agentNotifications = [
    {
      agent: 'Channel Agent',
      icon: '🔍',
      message: 'Found 3 new high-performing channels',
      priority: 'high',
      timestamp: '5 min ago'
    },
    {
      agent: 'Finance Agent',
      icon: '💰',
      message: 'Budget reallocation recommended',
      priority: 'medium',
      timestamp: '15 min ago'
    },
    {
      agent: 'Analytics Agent',
      icon: '📊',
      message: 'CPQM threshold exceeded on LinkedIn',
      priority: 'critical',
      timestamp: '1 hour ago'
    }
  ];

  const unreadCount = agentNotifications.length;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0 bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 hover:border-blue-500/30 transition-all relative">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-sm bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 border-2 border-slate-900 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 bg-slate-900/95 border-slate-700/50 backdrop-blur-lg">
        {/* User Info Section */}
        <div className="flex items-center justify-start gap-3 p-4 border-b border-slate-700/50">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-red-600/10 text-red-400 border border-red-500/20 text-sm font-semibold">
              {user?.name ? getUserInitials(user.name) : 'DU'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="text-sm font-semibold text-white">{user?.name || 'Demo User'}</p>
            <p className="text-xs text-gray-400">
              {user?.email || 'user@startuppath.ai'}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Building2 className="h-3 w-3 text-cyan-400" />
              <p className="text-xs text-cyan-400 font-medium">{user?.orgName || 'STARTUP_PATH Demo'}</p>
            </div>
          </div>
        </div>

        {/* Agent Notifications */}
        {unreadCount > 0 && (
          <div className="p-1">
            <div className="flex items-center justify-between px-3 py-2 mb-2">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Agent Insights</span>
              </div>
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 text-xs">
                {unreadCount}
              </Badge>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {agentNotifications.map((notification, index) => (
                <div 
                  key={index}
                  className="px-3 py-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-colors"
                  onClick={() => router.push('/dashboard/projects')}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">{notification.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-white">{notification.agent}</span>
                        <Badge 
                          className={`text-xs ${
                            notification.priority === 'critical' 
                              ? 'bg-red-600/20 text-red-400 border-red-500/30'
                              : notification.priority === 'high'
                              ? 'bg-orange-600/20 text-orange-400 border-orange-500/30'
                              : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300 mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-700/50">
              <Button 
                variant="outline"
                size="sm"
                className="w-full text-xs bg-slate-800/50 border-slate-600 hover:bg-slate-800/70 text-gray-300"
                onClick={() => router.push('/dashboard/projects')}
              >
                View All Insights
              </Button>
            </div>
          </div>
        )}

        <DropdownMenuSeparator className="bg-slate-700/50" />

        {/* Menu Items */}
        <div className="p-1">
          <DropdownMenuItem 
            className="cursor-pointer p-3 rounded-lg hover:bg-slate-800/50 focus:bg-slate-800/50 transition-colors"
            onClick={() => router.push('/dashboard/account')}
          >
            <User className="mr-3 h-4 w-4 text-gray-400" />
            <span className="text-white">Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer p-3 rounded-lg hover:bg-slate-800/50 focus:bg-slate-800/50 transition-colors"
            onClick={() => router.push('/dashboard/projects')}
          >
            <Building2 className="mr-3 h-4 w-4 text-cyan-400" />
            <span className="text-white">Projects</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer p-3 rounded-lg hover:bg-slate-800/50 focus:bg-slate-800/50 transition-colors"
            onClick={() => router.push('/dashboard/support')}
          >
            <HelpCircle className="mr-3 h-4 w-4 text-gray-400" />
            <span className="text-white">Help & Support</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-slate-700/50" />
        
        {/* Logout */}
        <div className="p-1">
          <DropdownMenuItem 
            className="cursor-pointer p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 focus:text-red-300 focus:bg-red-900/20 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}