"use client";

import { ReactNode, useState } from "react";
import { Navigation } from "./Navigation";
import { Header } from "./Header";
import { NavigationTransition } from "./NavigationTransition";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose, PanelRightOpen, PanelRightClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { AnimatedComponent } from "@/components/ui/AnimatedComponent";
import { HeaderProvider } from "@/contexts/HeaderContext";

interface MainLayoutProps {
  children: ReactNode;
  showArtifacts?: boolean;
}

export function MainLayout({ children, showArtifacts = true }: MainLayoutProps) {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isLeftSidebarExpanded, setIsLeftSidebarExpanded] = useState(false);
  const [performanceMode, config] = usePerformanceMode();

  return (
    <HeaderProvider>
      <div className={cn(
        "flex h-screen bg-black relative overflow-hidden",
        config.backgroundEffects && "electric-grid"
      )}>
        {/* Clean professional background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50" />
        
        {/* Navigation - Left Sidebar (expandable) */}
        <div className={cn(
          "border-r border-red-500/15 bg-black/30 backdrop-blur-sm relative z-10 transition-all duration-300",
          isLeftSidebarExpanded ? "w-64" : "w-24"
        )}>
          <Navigation 
            isExpanded={isLeftSidebarExpanded} 
            onToggle={() => setIsLeftSidebarExpanded(!isLeftSidebarExpanded)} 
          />
        </div>

        {/* Command Center Area */}
        <div className="flex flex-1 flex-col min-w-0 relative z-10">
          {/* Header with Right Sidebar Toggle */}
          <div className="flex items-center justify-between border-b border-red-500/20 bg-gradient-to-r from-red-900/10 to-black/60 backdrop-blur-sm px-4 py-3">
            <Header />
            {showArtifacts && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                className="bg-gradient-to-r from-red-900/20 to-black/40 border-red-500/20 text-red-200 hover:from-red-800/30 hover:to-black/50 hover:text-white shadow-sm hidden xl:flex items-center gap-2"
                title={isRightSidebarOpen ? "Hide Live Analytics" : "Show Live Analytics"}
              >
                {isRightSidebarOpen ? (
                  <>
                    <PanelRightClose className="h-4 w-4" />
                    <span className="text-xs">Hide Analytics</span>
                  </>
                ) : (
                  <>
                    <PanelRightOpen className="h-4 w-4" />
                    <span className="text-xs">Show Analytics</span>
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Content Layout */}
          <div className="flex flex-1 min-h-0">
            {/* Main Content (720-1280px fluid) */}
            <main className="flex-1 min-w-0 max-w-none lg:max-w-5xl xl:max-w-none overflow-x-auto overflow-y-hidden relative">
              <div className="mx-auto px-4 py-6 w-full min-w-[720px] max-w-[1280px] h-full">
                <NavigationTransition>
                  {children}
                </NavigationTransition>
              </div>
            </main>

            {/* Right Sidebar - Collapsible */}
            {showArtifacts && (
              <aside className={`transition-all duration-300 ease-in-out ${isRightSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'} border-l border-red-500/20 bg-gradient-to-b from-red-900/10 to-black/60 backdrop-blur-sm hidden xl:block relative`}>
                {/* Collapse Button - Always Visible */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRightSidebarOpen(false)}
                  className="absolute top-4 right-4 z-20 h-8 w-8 p-0 bg-red-900/30 border border-red-500/40 text-red-300 hover:text-white hover:bg-red-800/50 rounded-lg"
                  title="Collapse sidebar"
                >
                  <PanelRightClose className="h-4 w-4" />
                </Button>

                <div className="h-full p-4 pt-16">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-semibold text-white">Live Analytics</h2>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                        <span className="text-xs text-green-300 font-medium">LIVE</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Real-time GTM optimization intelligence</p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Performance Metrics */}
                    <div className="space-y-3">
                      <div className="p-3 bg-black/40 border border-red-500/20 rounded-lg hover:border-red-500/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <p className="text-sm text-gray-300 font-medium">Current CAC</p>
                          </div>
                          <span className="text-xs text-red-300 bg-red-900/20 px-2 py-1 rounded">↑ 5.2%</span>
                        </div>
                        <p className="text-xl text-white font-bold">$1,850</p>
                        <p className="text-xs text-gray-400">Target: $1,500 • Benchmark: $1,200</p>
                      </div>
                      
                      <div className="p-3 bg-black/40 border border-green-500/20 rounded-lg hover:border-green-500/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <p className="text-sm text-gray-300 font-medium">Conversion Rate</p>
                          </div>
                          <span className="text-xs text-green-300 bg-green-900/20 px-2 py-1 rounded">↑ 8.1%</span>
                        </div>
                        <p className="text-xl text-white font-bold">3.4%</p>
                        <p className="text-xs text-gray-400">Industry: 3.0% • YC Avg: 2.8%</p>
                      </div>
                      
                      <div className="p-3 bg-black/40 border border-yellow-500/20 rounded-lg hover:border-yellow-500/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <p className="text-sm text-gray-300 font-medium">Next Experiment</p>
                          </div>
                          <span className="text-xs text-yellow-300 bg-yellow-900/20 px-2 py-1 rounded">Est. 1.8x ROI</span>
                        </div>
                        <p className="text-sm text-white font-medium">LinkedIn A/B Test</p>
                        <p className="text-xs text-gray-400">Budget: $2,500 • Duration: 14 days</p>
                      </div>
                    </div>
                    
                    {/* Quick Insights */}
                    <div className="mt-6 pt-4 border-t border-red-500/20">
                      <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                        Strategic Insights
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="p-2 bg-cyan-900/10 border border-cyan-500/20 rounded text-cyan-300">
                          📊 Organic traffic converting 2.3x better than paid
                        </div>
                        <div className="p-2 bg-purple-900/10 border border-purple-500/20 rounded text-purple-300">
                          🎯 Product demos showing 67% qualification rate
                        </div>
                        <div className="p-2 bg-orange-900/10 border border-orange-500/20 rounded text-orange-300">
                          ⚡ Email sequences need A/B testing for subject lines
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Center */}
                    <div className="mt-6 pt-4 border-t border-red-500/20">
                      <h3 className="text-sm font-medium text-white mb-3">Action Center</h3>
                      <div className="space-y-2">
                        <Button size="sm" className="w-full bg-gradient-to-r from-red-600/50 to-red-700/50 hover:from-red-700/70 hover:to-red-800/70 text-white text-xs border border-red-500/30">
                          📈 View Full Dashboard
                        </Button>
                        <Button size="sm" variant="outline" className="w-full border-red-500/20 text-red-200 hover:bg-red-900/20 text-xs">
                          📊 Export Weekly Report
                        </Button>
                        <Button size="sm" variant="outline" className="w-full border-cyan-500/20 text-cyan-200 hover:bg-cyan-900/20 text-xs">
                          🎯 Schedule Strategy Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </HeaderProvider>
  );
}