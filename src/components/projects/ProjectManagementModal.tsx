"use client";

import React, { useState } from 'react';
// Updated project creation modal with compact styling
import { Building2, Plus, X, Loader2 } from 'lucide-react';
import { useCurrentProject } from '@/contexts/ProjectContext';
import { useUser } from '@/contexts/AuthContext';
import { createProject } from '@/lib/db/client-queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ProjectStatus, ProjectMode } from '@/types';

interface ProjectManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  projectId?: string;
}

export function ProjectManagementModal({
  isOpen,
  onClose,
  mode,
  projectId
}: ProjectManagementModalProps) {
  const { user } = useUser();
  const { refreshProjects, switchProject } = useCurrentProject();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft' as ProjectStatus,
    mode: 'simulation' as ProjectMode,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Project name must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted, user:', user);
    console.log('User orgId:', user?.orgId);
    console.log('User id:', user?.id);
    
    if (!validateForm()) return;
    if (!user?.orgId) {
      console.log('No orgId found, cannot create project');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const projectData = {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          org_id: user.orgId,
          created_by: user.id,
          status: formData.status,
          mode: formData.mode,
          settings: {
            default_confidence_level: 0.95,
            minimum_test_duration_days: 14,
            maximum_test_duration_days: 90,
            auto_pause_on_poor_performance: true,
            noise_variance_percent: formData.mode === 'simulation' ? 15 : 0,
            allocator_frequency: 'weekly' as const,
          },
        };

        console.log('About to create project with data:', projectData);
        const newProject = await createProject(projectData);
        console.log('Project creation result:', newProject);
        
        if (newProject) {
          await refreshProjects();
          switchProject(newProject.id);
          onClose();
          resetForm();
        } else {
          throw new Error('Failed to create project');
        }
      } else {
        // TODO: Implement project update logic
        console.log('Update project:', projectId, formData);
      }
    } catch (error) {
      console.error('Error managing project:', error);
      setErrors({ submit: 'Failed to save project. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'draft',
      mode: 'simulation',
    });
    setErrors({});
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="flex items-center justify-center gap-3 text-xl">
            <div className="p-2 bg-blue-600/10 rounded-full border border-blue-500/20">
              <Building2 className="h-5 w-5 text-blue-400" />
            </div>
            {mode === 'create' ? 'Create New Project' : 'Edit Project'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {mode === 'create' 
              ? 'Start tracking your next GTM experiment'
              : 'Update your project settings'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">Project Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Q1 2024 Growth Campaign"
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Optional brief description..."
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 min-h-[50px] resize-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-xs text-red-400">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">Mode</Label>
              <Select 
                value={formData.mode} 
                onValueChange={(value) => handleInputChange('mode', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="simulation">🔬 Simulation</SelectItem>
                  <SelectItem value="connected">🔗 Connected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="draft">📝 Draft</SelectItem>
                  <SelectItem value="active">🚀 Active</SelectItem>
                  <SelectItem value="paused">⏸ Paused</SelectItem>
                  <SelectItem value="completed">✅ Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {errors.submit && (
            <div className="text-xs text-red-400 bg-red-900/20 border border-red-800/50 rounded-md p-2">
              {errors.submit}
            </div>
          )}

          <DialogFooter className="gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600/90 hover:bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Create Project' : 'Save Changes'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}