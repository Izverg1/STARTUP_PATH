"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  FlaskConical,
  BarChart3,
  Shield,
  Users,
  TrendingUp,
  Bot,
  Settings,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navigationItems = [
  {
    id: "experiments",
    label: "Missions",
    href: "/dashboard/experiments",
    icon: FlaskConical,
  },
  {
    id: "benchmarks",
    label: "Telemetry",
    href: "/dashboard/benchmarks",
    icon: BarChart3,
  },
  {
    id: "rules",
    label: "Protocols",
    href: "/dashboard/rules",
    icon: Shield,
  },
  {
    id: "collab",
    label: "Crew",
    href: "/dashboard/collaboration",
    icon: Users,
  },
  {
    id: "effectiveness",
    label: "Performance",
    href: "/dashboard/effectiveness",
    icon: TrendingUp,
  },
  {
    id: "assistant",
    label: "Co-Pilot",
    href: "/dashboard/assistant",
    icon: Bot,
  },
  {
    id: "admin",
    label: "Command",
    href: "/dashboard/admin",
    icon: Settings,
  },
];

interface NavigationProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function Navigation({ isExpanded, onToggle }: NavigationProps) {
  const pathname = usePathname();
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);

  return (
    <TooltipProvider delayDuration={300}>
      <nav className="flex flex-col h-full p-3">
        {/* Header with Logo and Toggle */}
        <div className="flex items-center justify-between mb-6 py-2">
          <div className={cn(
            "flex items-center gap-3 transition-all duration-300",
            !isExpanded && "justify-center w-full"
          )}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            {isExpanded && (
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">STARTUP</span>
                <span className="text-blue-300 text-xs tracking-wider">PATH</span>
              </div>
            )}
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className={cn(
              "p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-all duration-300",
              !isExpanded && "hidden"
            )}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
        
        {/* Collapse button for collapsed state */}
        {!isExpanded && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-all duration-300 mb-4 mx-auto"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        
        <div className="flex flex-col space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            const isLoading = loadingRoute === item.href;

            return (
              <Tooltip key={item.id} delayDuration={isExpanded ? 1000 : 300}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (!isActive) {
                        setLoadingRoute(item.href);
                        setTimeout(() => setLoadingRoute(null), 1000);
                      }
                    }}
                    className={cn(
                      "group relative flex h-12 w-full items-center rounded-xl transition-all duration-300 hover:scale-105",
                      isExpanded ? "justify-start px-3 gap-3" : "justify-center",
                      isActive ? 
                        "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10" : 
                        "hover:bg-white/5 hover:border hover:border-white/10 hover:shadow-lg hover:shadow-white/5",
                      !isActive && "text-blue-200/70 hover:text-white",
                      isLoading && "animate-pulse"
                    )}
                    aria-label={item.label}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl animate-pulse" />
                    )}
                    
                    {/* Loading spinner overlay */}
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/10 rounded-xl flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                      </div>
                    )}
                    
                    <Icon 
                      className={cn(
                        "h-5 w-5 transition-all duration-300 relative z-10 flex-shrink-0",
                        isActive && "text-blue-400 scale-110",
                        !isActive && item.id === "assistant" && "text-cyan-400",
                        isLoading && "opacity-50"
                      )} 
                    />
                    
                    {/* Label for expanded state */}
                    {isExpanded && (
                      <span className={cn(
                        "text-sm font-medium transition-all duration-300 relative z-10",
                        isActive && "text-blue-200",
                        !isActive && "text-blue-200/70 group-hover:text-white",
                        isLoading && "opacity-50"
                      )}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right" className="ml-2">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>

        {/* Spacer to push admin to bottom */}
        <div className="flex-1" />
      </nav>
    </TooltipProvider>
  );
}