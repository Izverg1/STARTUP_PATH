'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageLoader } from '@/components/ui/page-loader';

interface NavigationTransitionProps {
  children: React.ReactNode;
}

export function NavigationTransition({ children }: NavigationTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [loaderType, setLoaderType] = useState<'experiments' | 'benchmarks' | 'rules' | 'collaboration' | 'effectiveness' | 'assistant' | 'admin' | 'default'>('default');
  const [previousPath, setPreviousPath] = useState(pathname);

  useEffect(() => {
    // Only show loader when navigating between different dashboard pages
    if (pathname !== previousPath && pathname.startsWith('/dashboard')) {
      setIsLoading(true);
      
      // Determine loader type based on route
      if (pathname.includes('/experiments')) {
        setLoaderType('experiments');
      } else if (pathname.includes('/benchmarks')) {
        setLoaderType('benchmarks');
      } else if (pathname.includes('/rules')) {
        setLoaderType('rules');
      } else if (pathname.includes('/collaboration')) {
        setLoaderType('collaboration');
      } else if (pathname.includes('/effectiveness')) {
        setLoaderType('effectiveness');
      } else if (pathname.includes('/assistant')) {
        setLoaderType('assistant');
      } else if (pathname.includes('/admin')) {
        setLoaderType('admin');
      } else {
        setLoaderType('default');
      }

      // Hide loader after a short delay to allow page to load
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPreviousPath(pathname);
      }, 800 + Math.random() * 400); // 800-1200ms

      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath]);

  return (
    <>
      {isLoading && <PageLoader type={loaderType} />}
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>
    </>
  );
}