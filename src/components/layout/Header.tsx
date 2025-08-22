"use client";

import { Info } from "lucide-react";
import { useHeader } from "@/contexts/HeaderContext";
import { UserProfileDropdown } from "./UserProfileDropdown";

export function Header() {
  const { title, subtitle, description, value } = useHeader();

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
      
      {/* User Profile Dropdown */}
      <UserProfileDropdown />
    </div>
  );
}