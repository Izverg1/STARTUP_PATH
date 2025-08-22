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
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navigationItems = [
  {
    id: "command-center",
    label: "Command Center",
    href: "/dashboard",
    icon: Home,
    description: "Central hub for monitoring all GTM activities, KPIs, and real-time performance metrics across channels",
    value: "Save 10+ hours/week with unified dashboard view"
  },
  {
    id: "experiments",
    label: "Experiments",
    href: "/dashboard/experiments",
    icon: FlaskConical,
    description: "Design and run A/B tests across channels with Thompson Sampling optimization for maximum ROI",
    value: "Reduce failed experiments from 70% to 15%"
  },
  {
    id: "benchmarks",
    label: "Analytics",
    href: "/dashboard/benchmarks",
    icon: BarChart3,
    description: "Deep-dive analytics with YC benchmarks, cohort analysis, and predictive insights for strategic decisions",
    value: "Identify 3-5x ROI opportunities faster"
  },
  {
    id: "rules",
    label: "Rules",
    href: "/dashboard/rules",
    icon: Shield,
    description: "Set automated business rules for budget allocation, bidding strategies, and performance thresholds",
    value: "Prevent 80% of budget waste automatically"
  },
  {
    id: "collab",
    label: "Team",
    href: "/dashboard/collaboration",
    icon: Users,
    description: "Collaborate with team members, share insights, and maintain decision logs for strategic alignment",
    value: "Improve team efficiency by 40%"
  },
  {
    id: "effectiveness",
    label: "Performance",
    href: "/dashboard/effectiveness",
    icon: TrendingUp,
    description: "Track CAC, LTV, payback periods, and channel effectiveness with real-time optimization suggestions",
    value: "Improve CAC by 40% and reduce payback time"
  },
  {
    id: "projects",
    label: "Projects",
    href: "/dashboard/projects",
    icon: Building2,
    description: "Manage your startup projects, simulations, and campaigns with organized workspace views",
    value: "Organize GTM efforts into focused project streams"
  },
  {
    id: "assistant",
    label: "Assistant",
    href: "/dashboard/assistant",
    icon: Bot,
    description: "AI-powered GTM advisor providing strategic recommendations and answering complex marketing questions",
    value: "Get expert-level insights without hiring consultants"
  },
  {
    id: "admin",
    label: "Settings",
    href: "/dashboard/admin",
    icon: Settings,
    description: "Configure platform settings, integrations, team permissions, and data sources for optimal performance",
    value: "Streamline operations and data flow"
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
        {/* Header with Toggle */}
        <div className="flex items-center justify-between mb-6 py-2">
          <div className={cn(
            "flex items-center gap-3 transition-all duration-300",
            !isExpanded && "justify-center w-full"
          )}>
            {isExpanded && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-lg neon-glow">STARTUP_PATH</span>
                </div>
                <span className="text-red-400 text-sm">Navigation</span>
              </div>
            )}
            {!isExpanded && (
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 flex-shrink-0">
                <span className="text-white font-bold text-lg">SP</span>
              </div>
            )}
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className={cn(
              "p-1.5 rounded-lg text-red-200 hover:text-white hover:bg-white/10 transition-all duration-300",
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
            className="p-1.5 rounded-lg text-red-200 hover:text-white hover:bg-white/10 transition-all duration-300 mb-4 mx-auto"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        
        <div className="flex flex-col space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && item.href !== "/" && pathname.startsWith(item.href));
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
                        "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-400/30 shadow-lg shadow-cyan-500/10" : 
                        "hover:bg-white/5 hover:border hover:border-white/10 hover:shadow-lg hover:shadow-white/5",
                      !isActive && "text-red-200/70 hover:text-white",
                      isLoading && "animate-pulse"
                    )}
                    aria-label={item.label}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-xl animate-pulse" />
                    )}
                    
                    {/* Loading spinner overlay */}
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/10 rounded-xl flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                      </div>
                    )}
                    
                    <Icon 
                      className={cn(
                        "h-5 w-5 transition-all duration-300 relative z-10 flex-shrink-0",
                        isActive && "text-cyan-400 scale-110",
                        !isActive && item.id === "assistant" && "text-red-400",
                        isLoading && "opacity-50"
                      )} 
                    />
                    
                    {/* Label for expanded state */}
                    {isExpanded && (
                      <span className={cn(
                        "text-sm font-medium transition-all duration-300 relative z-10",
                        isActive && "text-cyan-200",
                        !isActive && "text-red-200/70 group-hover:text-white",
                        isLoading && "opacity-50"
                      )}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right" className="ml-2 max-w-80 p-4 bg-slate-900/95 border-cyan-400/20 backdrop-blur-lg">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-cyan-300 text-sm">{item.label}</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">{item.description}</p>
                      <div className="pt-1 border-t border-cyan-400/20">
                        <span className="text-xs font-medium text-cyan-400">💡 {item.value}</span>
                      </div>
                    </div>
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