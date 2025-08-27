'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatbotToggleProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ChatbotToggle({ onClick, isOpen }: ChatbotToggleProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[50]" style={{ transform: 'translateZ(0)' }}>
      <div className="relative">
        {/* Animated attention ring */}
        <div className="absolute -inset-2 bg-gradient-to-r from-red-500/40 via-red-400/40 to-red-500/40 rounded-full opacity-75 blur-sm animate-pulse"></div>
        <div className="absolute -inset-1 border border-red-500/50 rounded-full animate-pulse"></div>
        
        <Button
          onClick={onClick}
          className={cn(
            "relative w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 shadow-2xl transition-all duration-300",
            "flex items-center justify-center pointer-events-auto cursor-pointer",
            isOpen && "scale-0 opacity-0 pointer-events-none"
          )}
          style={{
            transform: 'translateZ(0)',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div className="flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 border-2 border-slate-950 rounded-full flex items-center justify-center animate-bounce">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </Button>
        
        {/* Tooltip */}
        <div className={cn(
          "absolute bottom-16 right-0 bg-slate-900/95 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-white whitespace-nowrap shadow-xl backdrop-blur-sm transition-all duration-200",
          "opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0"
        )}>
          <div className="text-center">
            <div className="font-semibold text-red-300">Investor Assistant</div>
            <div className="text-xs text-gray-400">Learn about STARTUP_PATH</div>
          </div>
          <div className="absolute top-full right-4 -mt-px border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900/95"></div>
        </div>
      </div>
    </div>
  );
}