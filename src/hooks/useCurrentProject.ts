"use client";

import { useContext } from 'react';
import { useCurrentProject as useProjectContext } from '@/contexts/ProjectContext';

// Re-export the hook from context for consistency
export const useCurrentProject = useProjectContext;