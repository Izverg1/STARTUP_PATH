"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FlaskConical,
  BarChart3,
  Shield,
  Users,
  TrendingUp,
  Bot,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navigationItems = [
  {
    id: "home",
    label: "Launch Pad",
    href: "/",
    icon: Home,
  },
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

export function Navigation() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={300}>
      <nav className="flex flex-col h-full p-3">
        {/* Startup_Path Logo */}
        <div className="flex items-center justify-center mb-6 py-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-lg">S</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex h-12 w-full items-center justify-center rounded-xl transition-all duration-300",
                      isActive ? 
                        "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10" : 
                        "hover:bg-white/5 hover:border hover:border-white/10",
                      !isActive && "text-blue-200/70 hover:text-white"
                    )}
                    aria-label={item.label}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl animate-pulse" />
                    )}
                    <Icon 
                      className={cn(
                        "h-5 w-5 transition-all duration-300 relative z-10",
                        isActive && "text-blue-400 scale-110",
                        !isActive && item.id === "assistant" && "text-cyan-400"
                      )} 
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <p>{item.label}</p>
                </TooltipContent>
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