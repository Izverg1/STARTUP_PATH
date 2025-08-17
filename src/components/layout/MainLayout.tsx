"use client";

import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
  showArtifacts?: boolean;
}

export function MainLayout({ children, showArtifacts = true }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-black relative overflow-hidden">
      {/* Subtle space background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full filter blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full filter blur-[100px]" />
      </div>
      
      {/* Mission Control - Left Sidebar (96px) */}
      <div className="w-24 border-r border-blue-500/20 bg-black/50 backdrop-blur-sm relative z-10">
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

          {/* Mission Data - Right (320px) */}
          {showArtifacts && (
            <aside className="w-80 border-l border-blue-500/20 bg-black/30 backdrop-blur-sm hidden xl:block">
              <div className="h-full p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-blue-200">
                    Mission Data
                  </h2>
                </div>
                <div className="text-xs text-blue-300/60">
                  Generated mission artifacts will appear here
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}