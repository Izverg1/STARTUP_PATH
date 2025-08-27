"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/AuthContext';
import { getOrganizationProjects } from '@/lib/db/client-queries';
import type { Project } from '@/types';

interface ProjectContextValue {
  // Current project state
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  
  // Available projects
  availableProjects: Project[];
  
  // Project enforcement
  hasActiveProject: boolean;
  requiresProject: boolean;
  
  // Actions
  setCurrentProject: (project: Project | null) => void;
  refreshProjects: () => Promise<void>;
  switchProject: (projectId: string) => void;
  createProject: (projectData: Partial<Project>) => Promise<Project | null>;
  clearProject: () => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

interface ProjectProviderProps {
  children: React.ReactNode;
  initialProjectId?: string;
  requiresProject?: boolean;
}

export function ProjectProvider({ children, initialProjectId, requiresProject = true }: ProjectProviderProps) {
  const { user } = useUser();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects for the organization
  const refreshProjects = useCallback(async () => {
    if (!user?.orgId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const projectsPromise = getOrganizationProjects(user.orgId);
      
      const projects = await Promise.race([projectsPromise, timeoutPromise]) as any;
      setAvailableProjects(projects);
      
      // Set current project if not already set
      if (!currentProject && projects.length > 0) {
        if (initialProjectId) {
          const targetProject = projects.find(p => p.id === initialProjectId);
          setCurrentProject(targetProject || projects[0]);
        } else {
          // Get from localStorage or fallback to first project
          const savedProjectId = localStorage.getItem('currentProjectId');
          const targetProject = savedProjectId 
            ? projects.find(p => p.id === savedProjectId) 
            : null;
          setCurrentProject(targetProject || projects[0]);
        }
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects');
      // Still set empty projects array and resolve loading state
      setAvailableProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.orgId, initialProjectId, currentProject]);

  // Switch to a specific project
  const switchProject = useCallback((projectId: string) => {
    const project = availableProjects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      localStorage.setItem('currentProjectId', projectId);
    }
  }, [availableProjects]);

  // Create a new project (placeholder - would need API endpoint)
  const createProject = useCallback(async (projectData: Partial<Project>): Promise<Project | null> => {
    if (!user?.orgId) return null;
    
    try {
      // This would call a create project API endpoint
      // For now, just refresh projects
      await refreshProjects();
      return null;
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project');
      return null;
    }
  }, [user?.orgId, refreshProjects]);

  // Load projects on mount and when user changes
  useEffect(() => {
    if (user?.orgId) {
      refreshProjects();
    } else {
      // If no org_id, resolve loading immediately
      setIsLoading(false);
    }
  }, [user?.orgId, refreshProjects]);

  // Save current project to localStorage when it changes
  useEffect(() => {
    if (currentProject?.id) {
      localStorage.setItem('currentProjectId', currentProject.id);
    }
  }, [currentProject?.id]);

  // Clear current project
  const clearProject = useCallback(() => {
    setCurrentProject(null);
    localStorage.removeItem('currentProjectId');
  }, []);

  // Calculate derived state
  const hasActiveProject = Boolean(currentProject);

  const value: ProjectContextValue = {
    currentProject,
    isLoading,
    error,
    availableProjects,
    hasActiveProject,
    requiresProject,
    setCurrentProject,
    refreshProjects,
    switchProject,
    createProject,
    clearProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useCurrentProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useCurrentProject must be used within a ProjectProvider');
  }
  return context;
}

// Hook for just getting the current project (simpler API)
export function useProject() {
  const { currentProject, isLoading } = useCurrentProject();
  return { project: currentProject, isLoading };
}