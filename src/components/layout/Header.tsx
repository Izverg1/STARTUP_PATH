"use client";

import { Info } from "lucide-react";
import { useHeader } from "@/contexts/HeaderContext";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { ProjectSelector } from "./ProjectSelector";

export function Header() {
  const { title } = useHeader();

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left: SP Icon + Prominent Project Selector */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-slate-800 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-sm">SP</span>
          </div>
          <span className="text-white/90 text-sm font-medium">{title}</span>
        </div>
        <div className="w-px h-6 bg-slate-600/50" />
        {/* Prominent Project Selector */}
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs font-medium uppercase tracking-wide">Project:</span>
          <ProjectSelector className="min-w-[640px]" />
        </div>
      </div>
      
      {/* Right: Status Indicators & User Profile */}
      <div className="flex items-center gap-4">
        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-xs font-medium">System Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-white/70 text-xs">4 Agents Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span className="text-white/70 text-xs">Real-time Analytics</span>
          </div>
        </div>
        
        <UserProfileDropdown />
      </div>
    </div>
  );
}