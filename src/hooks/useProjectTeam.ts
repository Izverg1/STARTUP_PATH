"use client";

import { useState, useEffect, useCallback } from 'react';
import { useCurrentProject } from '@/contexts/ProjectContext';
import { getOrganizationUsers } from '@/lib/db/client-queries';
import type { Tables } from '@/lib/supabase/client';

type User = Tables<'SPATH_users'>;

interface ProjectMember extends User {
  project_role?: 'owner' | 'contributor' | 'viewer';
  assigned_at?: string;
}

interface UseProjectTeamReturn {
  members: ProjectMember[];
  isLoading: boolean;
  error: string | null;
  addMember: (userId: string, role: 'contributor' | 'viewer') => Promise<boolean>;
  removeMember: (userId: string) => Promise<boolean>;
  updateMemberRole: (userId: string, role: 'contributor' | 'viewer') => Promise<boolean>;
  refreshMembers: () => Promise<void>;
}

export function useProjectTeam(): UseProjectTeamReturn {
  const { currentProject } = useCurrentProject();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For now, we'll use organization users as a proxy for project team members
  // In a full implementation, this would query a project_members table
  const loadMembers = useCallback(async () => {
    if (!currentProject?.org_id) return;

    setIsLoading(true);
    setError(null);

    try {
      const orgUsers = await getOrganizationUsers(currentProject.org_id);
      
      // For now, simulate project-level roles
      // In production, this would come from a project_members table
      const projectMembers: ProjectMember[] = orgUsers.map(user => ({
        ...user,
        project_role: user.id === currentProject.created_by ? 'owner' : 'contributor',
        assigned_at: user.created_at,
      }));

      setMembers(projectMembers);
    } catch (err) {
      console.error('Error loading project team members:', err);
      setError('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  }, [currentProject?.org_id, currentProject?.created_by]);

  // Refresh members when current project changes
  useEffect(() => {
    if (currentProject) {
      loadMembers();
    } else {
      setMembers([]);
    }
  }, [currentProject, loadMembers]);

  // Placeholder implementations for team management
  // These would integrate with actual project_members API endpoints
  const addMember = useCallback(async (userId: string, role: 'contributor' | 'viewer'): Promise<boolean> => {
    try {
      // TODO: Implement project member addition
      console.log('Adding member to project:', { userId, role, projectId: currentProject?.id });
      await loadMembers(); // Refresh after adding
      return true;
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member');
      return false;
    }
  }, [currentProject?.id, loadMembers]);

  const removeMember = useCallback(async (userId: string): Promise<boolean> => {
    try {
      // TODO: Implement project member removal
      console.log('Removing member from project:', { userId, projectId: currentProject?.id });
      await loadMembers(); // Refresh after removing
      return true;
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member');
      return false;
    }
  }, [currentProject?.id, loadMembers]);

  const updateMemberRole = useCallback(async (userId: string, role: 'contributor' | 'viewer'): Promise<boolean> => {
    try {
      // TODO: Implement project member role update
      console.log('Updating member role:', { userId, role, projectId: currentProject?.id });
      await loadMembers(); // Refresh after updating
      return true;
    } catch (err) {
      console.error('Error updating member role:', err);
      setError('Failed to update member role');
      return false;
    }
  }, [currentProject?.id, loadMembers]);

  return {
    members,
    isLoading,
    error,
    addMember,
    removeMember,
    updateMemberRole,
    refreshMembers: loadMembers,
  };
}