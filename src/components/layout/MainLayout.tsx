"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { Navigation } from "./Navigation";
import { Header } from "./Header";
import { NavigationTransition } from "./NavigationTransition";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose, ChevronDown, ChevronUp, Satellite, Target, BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { AnimatedComponent } from "@/components/ui/AnimatedComponent";
import { HeaderProvider } from "@/contexts/HeaderContext";
import { useEngineStatus, getStatusIndicator } from "@/hooks/useEngineStatus";
import { AgentCards } from "@/components/dashboard/AgentCards";
import { InvestorChatbot } from "@/components/chat/InvestorChatbot";
import { ChatbotToggle } from "@/components/chat/ChatbotToggle";

interface MainLayoutProps {
  children: ReactNode;
  showArtifacts?: boolean;
}

export function MainLayout({ children, showArtifacts = true }: MainLayoutProps) {
  // Sidebar state management
  const [isLeftSidebarExpanded, setIsLeftSidebarExpanded] = useState(false);
  const [isRightSidebarExpanded, setIsRightSidebarExpanded] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [performanceMode, config] = usePerformanceMode();
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const engines = useEngineStatus();
  
  // Debounced hover state for right sidebar
  const sidebarHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sidebarLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced sidebar hover handlers
  const handleSidebarMouseEnter = () => {
    // Clear any pending leave timeout
    if (sidebarLeaveTimeoutRef.current) {
      clearTimeout(sidebarLeaveTimeoutRef.current);
      sidebarLeaveTimeoutRef.current = null;
    }

    // Set a small delay before expanding to reduce sensitivity
    sidebarHoverTimeoutRef.current = setTimeout(() => {
      setIsRightSidebarExpanded(true);
    }, 150); // 150ms delay for expansion
  };

  const handleSidebarMouseLeave = () => {
    // Clear any pending enter timeout
    if (sidebarHoverTimeoutRef.current) {
      clearTimeout(sidebarHoverTimeoutRef.current);
      sidebarHoverTimeoutRef.current = null;
    }

    // Set a longer delay before retracting for smoother UX
    sidebarLeaveTimeoutRef.current = setTimeout(() => {
      setIsRightSidebarExpanded(false);
    }, 400); // 400ms delay for retraction
  };

  // Helper functions for engine footer
  const getEngineDescription = (engineId: string) => {
    const descriptions = {
      'channel-discovery': 'Channel Discovery finds and tests new marketing channels using micro-budget experiments. It continuously scans for high-ROI opportunities across LinkedIn, Google Ads, email, and emerging platforms.',
      'campaign-optimization': 'Campaign Optimization runs A/B tests and optimizes messaging across all channels. It uses machine learning to find the best copy, timing, and audience segments for maximum conversion rates.',
      'performance-analytics': 'Performance Analytics monitors 500K+ data points in real-time to detect trends, anomalies, and optimization opportunities. It provides predictive insights for better decision making.',
      'budget-allocation': 'Budget Allocation uses Thompson Sampling to automatically redistribute spend to highest-performing channels. It moves budget in real-time based on conversion rates and CAC targets.'
    };
    return descriptions[engineId as keyof typeof descriptions] || 'Intelligence engine for GTM optimization';
  };

  const getPerformanceColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-green-400';
      case 'optimizing': return 'text-orange-400';
      case 'reallocating': return 'text-purple-400';
      case 'insights': return 'text-cyan-400';
      default: return 'text-red-400';
    }
  };

  const getPerformanceMetric = (status: string) => {
    switch (status) {
      case 'processing': return '+12% efficiency';
      case 'optimizing': return '+8% conversion';
      case 'reallocating': return '+18% ROI';
      case 'insights': return '94% accuracy';
      default: return 'Idle';
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (sidebarHoverTimeoutRef.current) {
        clearTimeout(sidebarHoverTimeoutRef.current);
      }
      if (sidebarLeaveTimeoutRef.current) {
        clearTimeout(sidebarLeaveTimeoutRef.current);
      }
    };
  }, []);

  // Dynamic height calculation for sidebar
  useEffect(() => {
    const updateSidebarHeight = () => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - 100; // Leave space for footer
        setSidebarHeight(availableHeight);
      }
    };

    updateSidebarHeight();
    window.addEventListener('resize', updateSidebarHeight);
    return () => window.removeEventListener('resize', updateSidebarHeight);
  }, []);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <HeaderProvider>
      <div className={cn(
        "flex h-screen bg-black relative overflow-hidden",
        "bg-grid-pattern"
      )}>
        {/* Minimal grid background */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Navigation - Left Sidebar (expandable) */}
        <div className={cn(
          "border-r border-slate-700/40 bg-slate-950/50 relative z-10 transition-all duration-300 backdrop-blur-sm",
          isLeftSidebarExpanded ? "w-64" : "w-24"
        )}>
          <Navigation 
            isExpanded={isLeftSidebarExpanded} 
            onToggle={() => setIsLeftSidebarExpanded(!isLeftSidebarExpanded)} 
          />
        </div>

        {/* Command Center Area */}
        <div className="flex flex-1 flex-col min-w-0 relative z-10">
          {/* Header - Clean */}
          <div className="flex items-center justify-between border-b border-slate-700/40 bg-slate-950/30 px-4 py-3 backdrop-blur-sm">
            <Header />
          </div>

          {/* Content Layout */}
          <div className="flex flex-1 min-h-0 flex-col">
            <div className="flex flex-1 min-h-0">
              {/* Main Content (720-1280px fluid) */}
              <main className="flex-1 min-w-0 max-w-none lg:max-w-5xl xl:max-w-none overflow-x-auto overflow-y-hidden relative">
                <div className="mx-auto px-4 py-6 w-full min-w-[720px] max-w-[1280px] h-full">
                  <NavigationTransition>
                    {children}
                  </NavigationTransition>
                </div>
              </main>

              {/* Redesigned Right Sidebar - Smooth Debounced Expansion */}
              {showArtifacts && (
                <aside 
                  className={`transition-all duration-300 ease-out border-l border-gray-500/20 bg-gray-950/50 hidden xl:block relative flex flex-col backdrop-blur-sm ${
                    isRightSidebarExpanded ? 'w-72' : 'w-16'
                  }`}
                  onMouseEnter={handleSidebarMouseEnter}
                  onMouseLeave={handleSidebarMouseLeave}
                >

                  {/* Condensed View - Clean Mini Cards */}
                  <div className={`flex-1 flex flex-col items-center p-2 pt-4 space-y-3 ${isRightSidebarExpanded ? 'hidden' : 'flex'}`}>
                      {/* CAC Mini */}
                      <div className="w-12 h-12 bg-slate-800/50 border border-slate-600/30 rounded-lg flex flex-col items-center justify-center">
                        <div className="text-xs text-slate-300">CAC</div>
                        <div className="text-xs text-white font-bold">$1.8K</div>
                      </div>
                      
                      {/* CVR Mini */}
                      <div className="w-12 h-12 bg-slate-800/50 border border-slate-600/30 rounded-lg flex flex-col items-center justify-center">
                        <div className="text-xs text-slate-300">CVR</div>
                        <div className="text-xs text-white font-bold">3.4%</div>
                      </div>
                      
                      {/* Next Mini */}
                      <div className="w-12 h-12 bg-slate-800/50 border border-slate-600/30 rounded-lg flex flex-col items-center justify-center">
                        <div className="text-xs text-slate-300">Next</div>
                        <div className="text-xs text-white font-bold">LI</div>
                      </div>
                      
                      {/* Live Indicator */}
                      <div className="flex flex-col items-center pt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="text-xs text-green-300 mt-1">LIVE</div>
                      </div>
                    </div>

                  {/* Expanded View - Properly Contained Text */}
                  <div ref={sidebarRef} className={`h-full p-4 pt-4 overflow-hidden flex-col ${isRightSidebarExpanded ? 'flex' : 'hidden'}`}>
                      {/* Header - Cleaner */}
                      <div className="mb-4 shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-base font-semibold text-white">Live Analytics</h2>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-300">LIVE</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">Real-time optimization data</p>
                      </div>
                    
                      <div className="flex-1 overflow-y-auto space-y-4">
                        {/* Performance Metrics - Compact Cards */}
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSection('performance')}
                            className="w-full justify-between text-white hover:bg-slate-800/50 p-2 h-auto rounded-md"
                          >
                            <span className="text-sm font-medium">Performance</span>
                            {collapsedSections.includes('performance') ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronUp className="h-3 w-3" />
                            )}
                          </Button>
                          {!collapsedSections.includes('performance') && (
                            <div className="space-y-2 mt-2">
                              {/* CAC Card */}
                              <div className="p-3 bg-slate-900/30 border border-slate-700/40 rounded-md">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-slate-300">Current CAC</span>
                                  <span className="text-xs text-orange-400 bg-orange-900/20 px-1.5 py-0.5 rounded">↑ 5.2%</span>
                                </div>
                                <div className="text-lg text-white font-bold">$1,850</div>
                                <div className="text-xs text-slate-400 break-words">
                                  Target: $1,500<br />
                                  Benchmark: $1,200
                                </div>
                              </div>
                              
                              {/* CVR Card */}
                              <div className="p-3 bg-slate-900/30 border border-slate-700/40 rounded-md">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-slate-300">Conversion Rate</span>
                                  <span className="text-xs text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded">↑ 8.1%</span>
                                </div>
                                <div className="text-lg text-white font-bold">3.4%</div>
                                <div className="text-xs text-slate-400 break-words">
                                  Industry: 3.0%<br />
                                  YC Avg: 2.8%
                                </div>
                              </div>
                              
                              {/* Next Experiment */}
                              <div className="p-3 bg-slate-900/30 border border-slate-700/40 rounded-md">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-slate-300">Next Test</span>
                                  <span className="text-xs text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded">1.8x ROI</span>
                                </div>
                                <div className="text-sm text-white font-medium">LinkedIn A/B</div>
                                <div className="text-xs text-slate-400 break-words">
                                  Budget: $2,500<br />
                                  Duration: 14 days
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Strategic Insights - Compact */}
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSection('insights')}
                            className="w-full justify-between text-white hover:bg-slate-800/50 p-2 h-auto rounded-md"
                          >
                            <span className="text-sm font-medium">Insights</span>
                            {collapsedSections.includes('insights') ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronUp className="h-3 w-3" />
                            )}
                          </Button>
                          {!collapsedSections.includes('insights') && (
                            <div className="space-y-1.5 mt-2">
                              <div className="p-2 bg-cyan-950/30 border border-cyan-500/20 rounded text-xs text-cyan-300 break-words">
                                📊 Organic traffic converting 2.3x better
                              </div>
                              <div className="p-2 bg-purple-950/30 border border-purple-500/20 rounded text-xs text-purple-300 break-words">
                                🎯 Product demos: 67% qualification rate
                              </div>
                              <div className="p-2 bg-orange-950/30 border border-orange-500/20 rounded text-xs text-orange-300 break-words">
                                ⚡ Email A/B tests needed for subject lines
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Center - Subtle */}
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSection('actions')}
                            className="w-full justify-between text-white hover:bg-slate-800/50 p-2 h-auto bg-slate-900/20 border border-slate-600/20 rounded-md"
                          >
                            <span className="text-sm font-medium flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                              Actions
                            </span>
                            {collapsedSections.includes('actions') ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronUp className="h-3 w-3" />
                            )}
                          </Button>
                          {!collapsedSections.includes('actions') && (
                            <div className="space-y-1.5 mt-2">
                              <Button size="sm" className="w-full bg-slate-700/60 hover:bg-slate-600/80 text-white text-xs border-none h-8">
                                📈 Dashboard
                              </Button>
                              <Button size="sm" variant="outline" className="w-full border-slate-600/30 text-slate-300 hover:bg-slate-800/50 text-xs h-8">
                                📊 Export
                              </Button>
                              <Button size="sm" variant="outline" className="w-full border-slate-600/30 text-slate-300 hover:bg-slate-800/50 text-xs h-8">
                                🎯 Schedule
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                </aside>
              )}
            </div>

            {/* Collapsible Enhanced Footer */}
            <div className="relative">
              {/* Bottom Indicator - Always Visible */}
              <div 
                className="shrink-0 bg-slate-950/50 border-t border-slate-700/40 px-6 py-2 cursor-pointer hover:bg-slate-800/30 transition-all duration-200 backdrop-blur-sm"
                onMouseEnter={() => setIsFooterExpanded(true)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Dynamic Engine Status Indicators */}
                    <div className="flex items-center gap-2">
                      {engines.map((engine) => {
                        const indicator = getStatusIndicator(engine.status);
                        return (
                          <div
                            key={engine.id}
                            className={`w-3 h-3 ${indicator.color} rounded-full ${indicator.animation} ${indicator.glowColor} shadow-sm`}
                            title={`${engine.name}: ${engine.currentTask}`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-sm text-white font-medium">
                      See how the 4 Intelligence Engines are performing against YC benchmarks
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Hover to expand</span>
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>

              {/* Expanded Footer - Appears on Hover */}
              <div 
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/98 via-slate-950/95 to-slate-950/90 border-t border-red-500/40 border-l border-r border-red-500/25 transition-all duration-300 ease-in-out z-50 backdrop-blur-lg shadow-2xl ${
                  isFooterExpanded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
                }`}
                style={{ height: '35vh' }}
                onMouseLeave={() => setIsFooterExpanded(false)}
              >
                {/* Elegant top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-400/60 to-transparent"></div>
                {/* Enhanced Engine Footer Content */}
                <div className="h-full flex flex-col p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Dynamic status indicator based on most active engine */}
                    {(() => {
                      const activeEngines = engines.filter(e => e.status !== 'stopped');
                      const mostActiveEngine = activeEngines.find(e => e.status === 'reallocating') || 
                                             activeEngines.find(e => e.status === 'optimizing') || 
                                             activeEngines.find(e => e.status === 'insights') ||
                                             activeEngines.find(e => e.status === 'processing');
                      const indicator = mostActiveEngine ? getStatusIndicator(mostActiveEngine.status) : getStatusIndicator('stopped');
                      return (
                        <div className={`w-3 h-3 ${indicator.color} rounded-full ${indicator.animation} ${indicator.glowColor} shadow-sm`}></div>
                      );
                    })()}
                    <h3 className="text-lg font-bold text-white">Intelligence Engines</h3>
                    <span className={`text-xs px-2 py-1 rounded ${engines.filter(e => e.status !== 'stopped').length > 0 ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'}`}>
                      {engines.filter(e => e.status !== 'stopped').length} ACTIVE
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Real-time GTM optimization • Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>

                {/* Engine Grid with Details */}
                <div className="flex-1 grid grid-cols-4 gap-6">
                  {engines.map((engine, index) => {
                    const indicator = getStatusIndicator(engine.status);
                    const icons = [Satellite, Target, BarChart3, TrendingUp];
                    const Icon = icons[index];
                    const gradients = [
                      'from-slate-950 to-blue-950/10',
                      'from-slate-950 to-indigo-950/10', 
                      'from-slate-950 to-purple-950/10',
                      'from-slate-950 to-green-950/10'
                    ];
                    const iconColors = ['text-blue-400', 'text-indigo-400', 'text-purple-400', 'text-green-400'];
                    const bgColors = ['bg-blue-500/20', 'bg-indigo-500/20', 'bg-purple-500/20', 'bg-green-500/20'];
                    
                    return (
                      <div key={engine.id} className={`bg-gradient-to-br ${gradients[index]} border border-slate-600/40 rounded-lg p-4 hover:border-slate-500/60 transition-all duration-200`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 ${bgColors[index]} rounded-lg flex items-center justify-center`}>
                              <Icon className={`w-4 h-4 ${iconColors[index]}`} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">{engine.name}</h4>
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 ${indicator.color} rounded-full ${indicator.animation}`}></div>
                                <span className={`text-xs ${indicator.textColor}`}>{indicator.label}</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            className="w-4 h-4 text-gray-400 hover:text-white transition-colors"
                            title={getEngineDescription(engine.id)}
                          >
                            ℹ️
                          </button>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Current Task:</span>
                            <span className="text-white font-medium truncate ml-2">{engine.currentTask}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className="text-cyan-400 font-medium truncate ml-2">{engine.statusText}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Performance:</span>
                            <span className={`font-bold ${getPerformanceColor(engine.status)}`}>
                              {getPerformanceMetric(engine.status)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Last Update:</span>
                            <span className="text-purple-400 font-bold">{Math.floor(Math.random() * 5) + 1}s ago</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* System Status Bar */}
                <div className="mt-4 pt-3 border-t border-slate-600/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400">System Health: Optimal</span>
                    </div>
                    <div className="text-slate-400">
                      CPU: 34% • RAM: 2.1GB • Network: 125ms
                    </div>
                  </div>
                  <div className="text-slate-400">
                    Next optimization cycle: 3m 42s
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investor Chatbot */}
      <ChatbotToggle 
        onClick={() => setIsChatbotOpen(true)} 
        isOpen={isChatbotOpen}
      />
      <InvestorChatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
      />
    </HeaderProvider>
  );
}