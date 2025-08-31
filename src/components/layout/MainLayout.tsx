"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { Navigation } from "./Navigation";
import { Header } from "./Header";
import { NavigationTransition } from "./NavigationTransition";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose, ChevronDown, ChevronUp, Satellite, Target, BarChart3, TrendingUp, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { AnimatedComponent } from "@/components/ui/AnimatedComponent";
import { HeaderProvider } from "@/contexts/HeaderContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { ProjectOnboardingGate } from "@/components/onboarding/ProjectOnboardingGate";
import { useEngineStatus, getStatusIndicator } from "@/hooks/useEngineStatus";
import { AgentCards } from "@/components/dashboard/AgentCards";
import { InvestorChatbot } from "@/components/chat/InvestorChatbot";
import { ChatbotToggle } from "@/components/chat/ChatbotToggle";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AsyncWrapper } from "@/components/ui/async-wrapper";

interface MainLayoutProps {
  children: ReactNode;
  showArtifacts?: boolean;
}

export function MainLayout({ children, showArtifacts = true }: MainLayoutProps) {
  // Sidebar state management
  const [isLeftSidebarExpanded, setIsLeftSidebarExpanded] = useState(false);
  const [isRightSidebarExpanded, setIsRightSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [performanceMode, config] = usePerformanceMode();
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const engines = useEngineStatus();
  
  // Hover timeouts for both sidebars
  const leftSidebarHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leftSidebarLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rightSidebarHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rightSidebarLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Left sidebar hover handlers - smoother, heavier feel
  const handleLeftSidebarMouseEnter = () => {
    if (leftSidebarLeaveTimeoutRef.current) {
      clearTimeout(leftSidebarLeaveTimeoutRef.current);
      leftSidebarLeaveTimeoutRef.current = null;
    }
    leftSidebarHoverTimeoutRef.current = setTimeout(() => {
      setIsLeftSidebarExpanded(true);
    }, 120);
  };

  const handleLeftSidebarMouseLeave = () => {
    if (leftSidebarHoverTimeoutRef.current) {
      clearTimeout(leftSidebarHoverTimeoutRef.current);
      leftSidebarHoverTimeoutRef.current = null;
    }
    leftSidebarLeaveTimeoutRef.current = setTimeout(() => {
      setIsLeftSidebarExpanded(false);
    }, 600);
  };

  // Right sidebar hover handlers - smoother, heavier feel
  const handleRightSidebarMouseEnter = () => {
    if (rightSidebarLeaveTimeoutRef.current) {
      clearTimeout(rightSidebarLeaveTimeoutRef.current);
      rightSidebarLeaveTimeoutRef.current = null;
    }
    rightSidebarHoverTimeoutRef.current = setTimeout(() => {
      setIsRightSidebarExpanded(true);
    }, 120);
  };

  const handleRightSidebarMouseLeave = () => {
    if (rightSidebarHoverTimeoutRef.current) {
      clearTimeout(rightSidebarHoverTimeoutRef.current);
      rightSidebarHoverTimeoutRef.current = null;
    }
    rightSidebarLeaveTimeoutRef.current = setTimeout(() => {
      setIsRightSidebarExpanded(false);
    }, 600);
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

  // Mobile detection and cleanup
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (leftSidebarHoverTimeoutRef.current) {
        clearTimeout(leftSidebarHoverTimeoutRef.current);
      }
      if (leftSidebarLeaveTimeoutRef.current) {
        clearTimeout(leftSidebarLeaveTimeoutRef.current);
      }
      if (rightSidebarHoverTimeoutRef.current) {
        clearTimeout(rightSidebarHoverTimeoutRef.current);
      }
      if (rightSidebarLeaveTimeoutRef.current) {
        clearTimeout(rightSidebarLeaveTimeoutRef.current);
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
      <ProjectProvider>
        <ProjectOnboardingGate>
          <div className={cn(
            "h-screen bg-black relative overflow-hidden",
            "bg-grid-pattern"
          )}>
          {/* Minimal grid background */}
          <div className="absolute inset-0 bg-black" />
        
        {/* Left Sidebar - Collapsed (always visible on desktop) */}
        {!isMobile && (
          <div 
            className="fixed inset-y-0 left-0 w-16 bg-slate-950/60 border-r border-blue-700/40 backdrop-blur-md z-30 transition-all duration-200 ease-out"
            onMouseEnter={handleLeftSidebarMouseEnter}
            onMouseLeave={handleLeftSidebarMouseLeave}
          >
            <ErrorBoundary>
              <Navigation 
                isExpanded={false} 
                onToggle={() => {}} // Disabled toggle for hover mode
              />
            </ErrorBoundary>
          </div>
        )}

        {/* Left Sidebar - Expanded Overlay */}
        {isLeftSidebarExpanded && (
          <div 
            className="fixed top-12 bottom-12 left-0 w-64 bg-slate-950/95 border-r border-blue-600/50 backdrop-blur-xl z-40 transition-all duration-500 ease-in-out shadow-2xl shadow-blue-900/20"
            onMouseEnter={handleLeftSidebarMouseEnter}
            onMouseLeave={handleLeftSidebarMouseLeave}
          >
            <ErrorBoundary>
              <Navigation 
                isExpanded={true} 
                onToggle={() => {}} // Disabled toggle for hover mode
              />
            </ErrorBoundary>
          </div>
        )}

        {/* Mobile overlay for left sidebar */}
        {isMobile && isLeftSidebarExpanded && (
          <div 
            className="fixed inset-0 bg-black/50 z-35"
            onClick={() => setIsLeftSidebarExpanded(false)}
          />
        )}

        {/* Command Center Area - Fixed width with margins for sidebars */}
        {/* Header - Flat Red Bar Across Full Width */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-red-600 border-b border-black/50 px-4 py-1">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-red-700/50 mr-4"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <ErrorBoundary>
            <Header />
          </ErrorBoundary>
        </div>

        <div className={cn(
          "flex flex-1 flex-col min-w-0 relative z-10 pt-12",
          isMobile ? "ml-0" : "ml-16 mr-16"
        )}>

          {/* Content Layout */}
          <div className="flex flex-1 min-h-0 flex-col">
            <div className="flex flex-1 min-h-0">
              {/* Main Content (responsive) - now takes full width */}
              <main className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden relative">
                {isFooterExpanded && (
                  <div
                    data-testid="footer-blur-overlay"
                    className={
                      "absolute inset-0 z-20 pointer-events-none bg-black/5 backdrop-blur-[1px] transition-opacity duration-300"
                    }
                  />
                )}
                <div
                  className={cn(
                    "mx-auto px-4 py-6 w-full h-full max-w-[1280px] overflow-y-scroll dashboard-scrollbar transition-[filter] duration-300",
                    isFooterExpanded ? "filter blur-[1px]" : "filter-none"
                  )}
                >
                  <ErrorBoundary>
                    <NavigationTransition>
                      <AsyncWrapper loadingMessage="Loading page content...">
                        {children}
                      </AsyncWrapper>
                    </NavigationTransition>
                  </ErrorBoundary>
                </div>
              </main>
            </div>

            {/* Right Sidebar - Collapsed (always visible) */}
            {showArtifacts && !isMobile && (
              <div 
                className="fixed top-20 bottom-0 right-0 w-16 bg-slate-950/60 border-l border-red-700/40 backdrop-blur-md z-30 transition-all duration-200 ease-out"
                onMouseEnter={handleRightSidebarMouseEnter}
                onMouseLeave={handleRightSidebarMouseLeave}
              >
                <div className="flex-1 flex flex-col items-center p-2 pt-8 space-y-4">
                  {/* CAC Mini */}
                  <div className="w-12 h-12 bg-red-900/30 border border-red-600/40 rounded-lg flex flex-col items-center justify-center hover:bg-red-800/40 transition-colors">
                    <div className="text-xs text-red-300">CAC</div>
                    <div className="text-xs text-red-100 font-bold">$1.8K</div>
                  </div>
                  
                  {/* CVR Mini */}
                  <div className="w-12 h-12 bg-red-900/30 border border-red-600/40 rounded-lg flex flex-col items-center justify-center hover:bg-red-800/40 transition-colors">
                    <div className="text-xs text-red-300">CVR</div>
                    <div className="text-xs text-red-100 font-bold">3.4%</div>
                  </div>
                  
                  {/* Next Mini */}
                  <div className="w-12 h-12 bg-red-900/30 border border-red-600/40 rounded-lg flex flex-col items-center justify-center hover:bg-red-800/40 transition-colors">
                    <div className="text-xs text-red-300">Next</div>
                    <div className="text-xs text-red-100 font-bold">LI</div>
                  </div>
                  
                  {/* Live Indicator */}
                  <div className="flex flex-col items-center pt-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-red-400/50 shadow-sm"></div>
                    <div className="text-xs text-red-300 mt-1">LIVE</div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Sidebar - Expanded Overlay */}
            {isRightSidebarExpanded && showArtifacts && !isMobile && (
              <div 
                className="fixed top-12 bottom-12 right-0 w-72 bg-slate-950/95 border-l border-red-600/50 backdrop-blur-xl z-40 transition-all duration-500 ease-in-out shadow-2xl shadow-red-900/20"
                onMouseEnter={handleRightSidebarMouseEnter}
                onMouseLeave={handleRightSidebarMouseLeave}
              >
                <div ref={sidebarRef} className="h-full p-4 pt-4">
                  {/* Scrollable content inside the right panel with red scrollbar */}
                  <div className="h-full overflow-y-auto red-scrollbar pr-2 flex flex-col">
                  {/* Header */}
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
                    {/* Performance Metrics */}
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
                        </div>
                      )}
                    </div>
                    
                    {/* Strategic Insights */}
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
                        </div>
                      )}
                    </div>
                    
                    {/* Action Center */}
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
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Enhanced Footer - Fixed to bottom (hidden on mobile) */}
        {!isMobile && (
          <div className="fixed bottom-0 left-16 right-16 z-20">
            {/* Bottom Indicator - Always Visible */}
            <div 
              className="shrink-0 bg-slate-950/80 border-t border-slate-700/40 px-6 py-2 cursor-pointer hover:bg-slate-800/30 transition-all duration-200 backdrop-blur-md"
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
                className={`absolute bottom-full left-0 right-0 bg-slate-950/95 border-t border-red-500/40 border-l border-r border-red-500/25 transition-all duration-300 ease-in-out z-50 backdrop-blur-lg shadow-2xl ${
                  isFooterExpanded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
                }`}
                style={{ height: '35vh' }}
                onMouseLeave={() => setIsFooterExpanded(false)}
              >
                {/* Elegant top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-red-500/30"></div>
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
                      <div key={engine.id} className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-900/70 hover:border-slate-600/50 transition-colors duration-200">
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
        )}

        {/* Investor Chatbot */}
        <ErrorBoundary>
          <ChatbotToggle 
            onClick={() => setIsChatbotOpen(true)} 
            isOpen={isChatbotOpen}
          />
          <InvestorChatbot 
            isOpen={isChatbotOpen} 
            onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
          />
        </ErrorBoundary>
        </div>
        </ProjectOnboardingGate>
      </ProjectProvider>
    </HeaderProvider>
  );
}
