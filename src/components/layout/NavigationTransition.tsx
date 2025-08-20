'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingPopup } from '@/components/ui/LoadingPopup';
import { AnimatePresence } from 'framer-motion';

interface NavigationTransitionProps {
  children: React.ReactNode;
}

const getLoadingMessage = (pathname: string) => {
  if (pathname.includes('/experiments')) {
    return {
      message: "Loading Experiment Lab",
      submessage: "Preparing channel validation tools..."
    };
  } else if (pathname.includes('/benchmarks')) {
    return {
      message: "Loading Benchmarks",
      submessage: "Fetching industry traction data..."
    };
  } else if (pathname.includes('/rules')) {
    return {
      message: "Loading Rules Engine",
      submessage: "Configuring automation logic..."
    };
  } else if (pathname.includes('/collaboration')) {
    return {
      message: "Loading Collaboration",
      submessage: "Syncing team workspace..."
    };
  } else if (pathname.includes('/effectiveness')) {
    return {
      message: "Loading Analytics",
      submessage: "Calculating performance metrics..."
    };
  } else if (pathname.includes('/assistant')) {
    return {
      message: "Loading GTM Assistant",
      submessage: "Initializing strategy recommendations..."
    };
  } else if (pathname.includes('/admin')) {
    return {
      message: "Loading Settings",
      submessage: "Configuring platform preferences..."
    };
  } else {
    return {
      message: "Loading Command Center",
      submessage: "Optimizing GTM performance matrix..."
    };
  }
};

export function NavigationTransition({ children }: NavigationTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingContent, setLoadingContent] = useState(getLoadingMessage(pathname));
  const [previousPath, setPreviousPath] = useState(pathname);

  useEffect(() => {
    // Only show loader when navigating between different dashboard pages
    if (pathname !== previousPath && pathname.startsWith('/dashboard')) {
      setIsLoading(true);
      setLoadingContent(getLoadingMessage(pathname));

      // Hide loader after a short delay to allow page to load
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPreviousPath(pathname);
      }, 600 + Math.random() * 200); // 600-800ms (faster than before)

      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingPopup 
            message={loadingContent.message}
            submessage={loadingContent.submessage}
          />
        )}
      </AnimatePresence>
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>
    </>
  );
}