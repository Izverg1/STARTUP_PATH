"use client";

import { User, LogOut, Settings, HelpCircle, Building2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useHeader } from "@/contexts/HeaderContext";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { title, subtitle, description, value } = useHeader();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
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
    <div className="flex items-center justify-between w-full">
      {/* Dynamic Page Header */}
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-xl">{title}</span>
          </div>
          <span className="text-red-400 text-sm font-medium">{subtitle}</span>
          <div className="flex items-center gap-2 mt-1 max-w-2xl">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-gray-300 text-xs">{description}</span>
          </div>
        </div>
        
        {/* Value Proposition Tooltip */}
        <div className="group relative">
          <div className="w-8 h-8 bg-gradient-to-br from-red-600/20 to-black/60 border border-red-500/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-red-500/50 transition-all">
            <Info className="h-4 w-4 text-red-400" />
          </div>
          <div className="absolute top-10 left-0 bg-gradient-to-br from-red-900/90 to-black/95 border border-red-500/30 rounded-lg p-4 w-80 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-xl shadow-red-500/20">
            <div className="text-sm text-white font-medium mb-2">Startup Value</div>
            <div className="text-xs text-gray-300">{value}</div>
          </div>
        </div>
      </div>
      
      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
            <Avatar className="h-7 w-7">
              <AvatarImage src="/avatars/user.png" alt="User avatar" />
              <AvatarFallback className="text-xs bg-blue-600/10 text-blue-400 border border-blue-500/20">
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="flex items-center justify-start gap-3 p-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatarUrl} alt={user?.name} />
              <AvatarFallback className="bg-red-600/10 text-red-400 border border-red-500/20">
                {user?.name ? getUserInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 leading-none">
              <p className="text-sm font-medium text-white">{user?.name || 'Demo User'}</p>
              <p className="text-xs text-gray-400">
                {user?.email || 'user@startuppath.ai'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Building2 className="h-3 w-3 text-cyan-400" />
                <p className="text-xs text-cyan-400">{user?.orgName || 'STARTUP_PATH Demo'}</p>
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20 focus:text-red-300 focus:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}