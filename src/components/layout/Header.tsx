"use client";

import { User, LogOut, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Startup_Path Branding */}
      <div className="flex items-center space-x-2">
        <div className="text-lg font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">STARTUP_PATH</span>
          <span className="text-blue-300/60 text-sm ml-2">
            Command Center™
          </span>
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
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="text-sm font-medium">Welcome</p>
              <p className="text-xs text-muted-foreground">
                user@example.com
              </p>
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
          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}