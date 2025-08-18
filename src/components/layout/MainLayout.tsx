"use client";

import { ReactNode, useState } from "react";
import { Navigation } from "./Navigation";
import { Header } from "./Header";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";

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
          <main className="flex-1 min-w-0 max-w-none lg:max-w-5xl xl:max-w-none overflow-x-auto overflow-y-hidden">
            <div className="mx-auto px-4 py-6 w-full min-w-[720px] max-w-[1280px] h-full">
              {children}
            </div>
          </main>

          {/* Right Sidebar - Collapsible */}
          {showArtifacts && (
            <aside className={`transition-all duration-300 ease-in-out ${isRightSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'} border-l border-gray-700 bg-black/30 backdrop-blur-sm hidden xl:block`}>
              <div className="h-full p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-white">Live Analytics</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}>
                    {isRightSidebarOpen ? <PanelLeftClose className="h-4 w-4 text-gray-400" /> : <PanelLeftOpen className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
                <div className="text-xs text-gray-400">
                  Real-time GTM optimization data streams here.
                  {/* Placeholder for valuable info */}
                  <div className="mt-4 space-y-2">
                    <div className="p-2 bg-gray-800 rounded-md">
                      <p className="text-sm text-white font-medium">Current CAC: $1,850</p>
                      <p className="text-xs text-gray-400">Target: $1,500</p>
                    </div>
                    <div className="p-2 bg-gray-800 rounded-md">
                      <p className="text-sm text-white font-medium">Conversion Rate: 3.4%</p>
                      <p className="text-xs text-gray-400">Benchmark: 3.0%</p>
                    </div>
                    <div className="p-2 bg-gray-800 rounded-md">
                      <p className="text-sm text-white font-medium">Next Experiment: LinkedIn A/B Test</p>
                      <p className="text-xs text-gray-400">Est. ROI: 1.8x</p>
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