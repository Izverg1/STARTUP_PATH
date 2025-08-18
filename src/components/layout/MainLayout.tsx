"use client";

import { ReactNode, useState } from "react";
import { Navigation } from "./Navigation";
import { Header } from "./Header";
import { NavigationTransition } from "./NavigationTransition";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose, PanelRightOpen, PanelRightClose } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  showArtifacts?: boolean;
}

export function MainLayout({ children, showArtifacts = true }: MainLayoutProps) {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true); // State for right sidebar

  return (
    <div className="flex h-screen bg-black electric-grid relative overflow-hidden">
      {/* Cyberpunk background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-red-600/10 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/8 rounded-full filter blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full filter blur-[100px]" />
      </div>
      
      {/* Navigation - Left Sidebar (96px) */}
      <div className="w-24 border-r border-red-500/20 bg-black/50 backdrop-blur-sm relative z-10">
        <Navigation />
      </div>

      {/* Command Center Area */}
      <div className="flex flex-1 flex-col min-w-0 relative z-10">
        {/* Header */}
        <Header />

        {/* Content Layout */}
        <div className="flex flex-1 min-h-0">
          {/* Main Content (720-1280px fluid) */}
          <main className="flex-1 min-w-0 max-w-none lg:max-w-5xl xl:max-w-none overflow-x-auto overflow-y-hidden relative">
            {/* Floating Sidebar Toggle Button - Always Visible */}
            {showArtifacts && (
              <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20 xl:block hidden">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white shadow-lg"
                  title={isRightSidebarOpen ? "Hide Live Analytics" : "Show Live Analytics"}
                >
                  {isRightSidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                </Button>
              </div>
            )}
            
            <div className="mx-auto px-4 py-6 w-full min-w-[720px] max-w-[1280px] h-full">
              <NavigationTransition>
                {children}
              </NavigationTransition>
            </div>
          </main>

          {/* Right Sidebar - Collapsible */}
          {showArtifacts && (
            <aside className={`transition-all duration-300 ease-in-out ${isRightSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'} border-l border-gray-600 bg-gray-800/90 backdrop-blur-sm hidden xl:block`}>
              <div className="h-full p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Live Analytics</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-300">LIVE</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-sm text-gray-300 mb-4">
                    Real-time GTM optimization data streams
                  </div>
                  
                  {/* Current Metrics */}
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-300">Current CAC</p>
                        <span className="text-xs text-red-300">↑ 5.2%</span>
                      </div>
                      <p className="text-lg text-white font-bold">$1,850</p>
                      <p className="text-xs text-gray-400">Target: $1,500</p>
                    </div>
                    
                    <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-300">Conversion Rate</p>
                        <span className="text-xs text-green-300">↑ 8.1%</span>
                      </div>
                      <p className="text-lg text-white font-bold">3.4%</p>
                      <p className="text-xs text-gray-400">Benchmark: 3.0%</p>
                    </div>
                    
                    <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-300">Next Experiment</p>
                        <span className="text-xs text-yellow-300">Est. ROI</span>
                      </div>
                      <p className="text-sm text-white font-medium">LinkedIn A/B Test</p>
                      <p className="text-xs text-gray-400">Expected: 1.8x ROI</p>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-600">
                    <h3 className="text-sm font-medium text-white mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs">
                        View Full Analytics
                      </Button>
                      <Button size="sm" variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 text-xs">
                        Export Report
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
  );
}