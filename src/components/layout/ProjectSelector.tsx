"use client";

import React, { useState } from 'react';
import { Check, ChevronDown, FolderOpen, Plus, Building2, Loader2 } from 'lucide-react';
import { useCurrentProject } from '@/contexts/ProjectContext';
import { cn } from '@/lib/utils';
import { ProjectManagementModal } from '@/components/projects/ProjectManagementModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectSelectorProps {
  className?: string;
}

export function ProjectSelector({ className }: ProjectSelectorProps) {
  const { 
    currentProject, 
    availableProjects, 
    isLoading, 
    switchProject 
  } = useCurrentProject();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleProjectSwitch = (projectId: string) => {
    switchProject(projectId);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
        <span className="text-white/70 text-sm">Loading projects...</span>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <FolderOpen className="h-4 w-4 text-white/50" />
        <span className="text-white/50 text-sm">No project selected</span>
      </div>
    );
  }

  return (
    <div className={className}>
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-4 py-1 rounded-lg",
            "bg-slate-800/50 border border-slate-700/50",
            "hover:bg-slate-700/50 hover:border-slate-600/50",
            "transition-all duration-200",
            "text-left min-w-[380px]"
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Building2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-white text-sm font-medium truncate">
                {currentProject.name}
              </span>
              <span className="text-white/60 text-xs truncate">
                {currentProject.status === 'active' && '● Active'} 
                {currentProject.status === 'draft' && '○ Draft'} 
                {currentProject.status === 'paused' && '⏸ Paused'} 
                {currentProject.status === 'completed' && '✓ Completed'} 
                {currentProject.status === 'archived' && '📁 Archived'}
              </span>
            </div>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-white/60 transition-transform duration-200 flex-shrink-0",
            isOpen && "rotate-180"
          )} />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-[380px] bg-slate-900/95 border-slate-700/50 backdrop-blur-lg"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-white/90 text-xs font-medium">
          Select Project ({availableProjects.length} available)
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700/50" />
        
        {/* Current and Active Projects */}
        {availableProjects
          .filter(p => p.status === 'active' || p.id === currentProject.id)
          .map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => handleProjectSwitch(project.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 cursor-pointer",
                "hover:bg-slate-800/50 focus:bg-slate-800/50",
                project.id === currentProject.id && "bg-blue-600/20"
              )}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Building2 className={cn(
                  "h-4 w-4 flex-shrink-0",
                  project.id === currentProject.id ? "text-blue-400" : "text-white/60"
                )} />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className={cn(
                    "text-sm font-medium truncate",
                    project.id === currentProject.id ? "text-blue-200" : "text-white/90"
                  )}>
                    {project.name}
                  </span>
                  {project.description && (
                    <span className="text-white/50 text-xs truncate">
                      {project.description}
                    </span>
                  )}
                </div>
              </div>
              {project.id === currentProject.id && (
                <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />
              )}
            </DropdownMenuItem>
          ))}

        {/* Other Projects */}
        {availableProjects
          .filter(p => p.status !== 'active' && p.id !== currentProject.id)
          .length > 0 && (
            <>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <DropdownMenuLabel className="text-white/60 text-xs">
                Other Projects
              </DropdownMenuLabel>
              {availableProjects
                .filter(p => p.status !== 'active' && p.id !== currentProject.id)
                .map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    onClick={() => handleProjectSwitch(project.id)}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-800/50 focus:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Building2 className="h-4 w-4 text-white/40 flex-shrink-0" />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-white/70 text-sm font-medium truncate">
                          {project.name}
                        </span>
                        <span className="text-white/40 text-xs truncate">
                          {project.status === 'draft' && 'Draft'} 
                          {project.status === 'paused' && 'Paused'} 
                          {project.status === 'completed' && 'Completed'} 
                          {project.status === 'archived' && 'Archived'}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
            </>
          )}
        
        <DropdownMenuSeparator className="bg-slate-700/50" />
        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-800/50 focus:bg-slate-800/50"
          onClick={() => {
            setIsOpen(false);
            setShowCreateModal(true);
          }}
        >
          <Plus className="h-4 w-4 text-green-400" />
          <span className="text-green-400 text-sm font-medium">
            Create New Project
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <ProjectManagementModal
      isOpen={showCreateModal}
      onClose={() => setShowCreateModal(false)}
      mode="create"
    />
  </div>
  );
}