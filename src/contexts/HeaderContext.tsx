'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface HeaderContextType {
  title: string;
  subtitle: string;
  description: string;
  value: string;
  setHeaderContent: (content: Partial<HeaderContextType>) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

const getPageContent = (pathname: string) => {
  switch (pathname) {
    case '/dashboard':
      return {
        title: 'Command Center',
        subtitle: 'Real-time GTM Optimization Matrix',
        description: 'Monitor live performance metrics and optimize burn rate with intelligent budget allocation across channels',
        value: 'Reduce CAC by 35% through real-time channel optimization and data-driven allocation decisions'
      };
    
    case '/dashboard/experiments':
      return {
        title: 'GTM Experiment Lab',
        subtitle: 'Scientific Channel Fit, Simulated',
        description: 'Validate distribution channels and optimize CAC payback with Thompson Sampling and deterministic seeding',
        value: 'Find PMF 2x faster through simulation, not by burning through your precious runway on unproven channels'
      };

    case '/dashboard/experiments/designer':
      return {
        title: 'Channel Strategy Builder',
        subtitle: 'Scientific GTM Validation',
        description: 'Configure channels, budgets, and success gates to test acquisition hypotheses with precision',
        value: 'Design experiments that maximize learning while minimizing runway burn with Y Combinator-style benchmarks'
      };
    
    case '/dashboard/benchmarks':
      return {
        title: 'Traction Benchmarks',
        subtitle: 'Battle-Tested Growth Data',
        description: 'Access verified data on ads, outbound, and events from pre-seed to Series A for rapid channel validation',
        value: 'Compare against YC-style benchmarks: 1-5% cold email reply rates, 12-18 month CAC payback for Series A readiness'
      };
    
    case '/dashboard/rules':
      return {
        title: 'Business Rules Engine',
        subtitle: 'Automated Decision Logic',
        description: 'Define pass/fail thresholds and allocation rules to automatically optimize budget toward winning channels',
        value: 'Eliminate emotion from budget decisions with data-driven rules that maximize CPQM and accelerate PMF'
      };
    
    case '/dashboard/collaboration':
      return {
        title: 'Founder Collaboration Hub',
        subtitle: 'Team Alignment & Decision Logs',
        description: 'Coordinate with co-founders and advisors on channel strategy with complete audit trails for investors',
        value: 'Build future-proof playbooks with collaboration logs and pivot decisions ready for board meetings and Series A'
      };
    
    case '/dashboard/effectiveness':
      return {
        title: 'Burn Rate Navigator',
        subtitle: 'Capital Efficiency Analytics',
        description: 'Track performance trends and budget shifts with focus on Cost Per Qualified Meeting (CPQM) and CAC payback',
        value: 'Escape vanity metrics and build sustainable growth focused on unit economics that matter to investors'
      };
    
    case '/dashboard/assistant':
      return {
        title: 'GTM Strategy Assistant',
        subtitle: 'AI-Powered Growth Intelligence',
        description: 'Get recommendations on channel optimization, budget allocation, and PMF validation strategies',
        value: 'Access founder-led sales insights and strategic growth opportunities backed by battle-tested startup data'
      };
    
    case '/dashboard/admin':
      return {
        title: 'Platform Settings',
        subtitle: 'Configure Your Growth Stack',
        description: 'Manage integrations, team permissions, and platform settings for your GTM optimization workflow',
        value: 'Secure your early traction with RBAC, audit trails, and SOC 2 preparation for Series A due diligence'
      };

    default:
      return {
        title: 'STARTUP_PATH',
        subtitle: 'Scientific Channel Fit, Simulated',
        description: 'Built by founders for founders - optimize burn rate and accelerate unicorn potential',
        value: 'Stop guessing, start scaling with data-driven GTM strategy'
      };
  }
};

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [headerContent, setHeaderContent] = useState(getPageContent(pathname));

  useEffect(() => {
    setHeaderContent(getPageContent(pathname));
  }, [pathname]);

  const updateHeaderContent = (content: Partial<HeaderContextType>) => {
    setHeaderContent(prev => ({ ...prev, ...content }));
  };

  return (
    <HeaderContext.Provider value={{
      ...headerContent,
      setHeaderContent: updateHeaderContent
    }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}