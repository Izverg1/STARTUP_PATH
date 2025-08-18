'use client';

import { useEffect, useState } from 'react';
import { 
  FlaskConical, 
  BarChart3, 
  Shield, 
  Users, 
  TrendingUp, 
  Bot, 
  Settings,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

interface PageLoaderProps {
  type: 'experiments' | 'benchmarks' | 'rules' | 'collaboration' | 'effectiveness' | 'assistant' | 'admin' | 'default';
  message?: string;
}

const loaderConfigs = {
  experiments: {
    icon: FlaskConical,
    message: 'Initializing Mission Control...',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    animation: 'animate-spin',
    particles: true
  },
  benchmarks: {
    icon: BarChart3,
    message: 'Loading Telemetry Data...',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    animation: 'animate-pulse',
    particles: false
  },
  rules: {
    icon: Shield,
    message: 'Activating Protocols...',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    animation: 'animate-bounce',
    particles: false
  },
  collaboration: {
    icon: Users,
    message: 'Connecting to Crew...',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    animation: 'animate-pulse',
    particles: true
  },
  effectiveness: {
    icon: TrendingUp,
    message: 'Analyzing Performance...',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    animation: 'animate-spin',
    particles: false
  },
  assistant: {
    icon: Bot,
    message: 'Waking up Co-Pilot...',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    animation: 'animate-bounce',
    particles: true
  },
  admin: {
    icon: Settings,
    message: 'Accessing Command Center...',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    animation: 'animate-spin',
    particles: false
  },
  default: {
    icon: Sparkles,
    message: 'Loading...',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    animation: 'animate-pulse',
    particles: true
  }
};

export function PageLoader({ type, message }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const config = loaderConfigs[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 30;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        {/* Background glow */}
        <div className={`absolute inset-0 ${config.bgColor} rounded-full blur-3xl scale-150 opacity-50`} />
        
        {/* Main loader container */}
        <div className="relative bg-gray-800 border border-gray-600 rounded-2xl p-8 min-w-[300px] text-center">
          
          {/* Particles for certain loaders */}
          {config.particles && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-1 h-1 ${config.color} rounded-full animate-ping`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Main icon */}
          <div className="relative mb-6">
            <Icon 
              className={`w-16 h-16 mx-auto ${config.color} ${config.animation}`}
            />
            
            {/* Secondary animation elements */}
            {type === 'experiments' && (
              <div className="absolute -top-2 -right-2">
                <Zap className="w-6 h-6 text-yellow-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
              </div>
            )}
            
            {type === 'effectiveness' && (
              <div className="absolute -bottom-2 -left-2">
                <Target className="w-6 h-6 text-green-400 animate-ping" style={{ animationDelay: '0.3s' }} />
              </div>
            )}
          </div>
          
          {/* Loading message */}
          <h3 className="text-lg font-semibold text-white mb-4">
            {message || config.message}
          </h3>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-${config.color.split('-')[1]}-500 to-${config.color.split('-')[1]}-400 transition-all duration-300 ease-out`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          
          {/* Progress percentage */}
          <p className="text-sm text-gray-400">
            {Math.floor(Math.min(progress, 100))}% complete
          </p>
          
          {/* Loading dots */}
          <div className="flex justify-center mt-4 space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 ${config.color} rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}