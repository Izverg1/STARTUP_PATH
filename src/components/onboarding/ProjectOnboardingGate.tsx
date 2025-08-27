"use client";

import React, { useState } from 'react';
import { Building2, Plus, Rocket, Target, CheckCircle, ArrowRight, Briefcase } from 'lucide-react';
import { useCurrentProject } from '@/contexts/ProjectContext';
import { useUser } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectManagementModal } from '@/components/projects/ProjectManagementModal';

interface ProjectOnboardingGateProps {
  children: React.ReactNode;
}

export function ProjectOnboardingGate({ children }: ProjectOnboardingGateProps) {
  const { currentProject, availableProjects, isLoading } = useCurrentProject();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Show loading state while checking project status
  if (isLoading || !user) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Building2 className="w-6 h-6 animate-pulse" />
          Loading workspace...
        </div>
      </div>
    );
  }

  // If user has a current project, render children (normal app flow)
  if (currentProject) {
    return <>{children}</>;
  }

  // Project gate: show project-first onboarding when no current project
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <Card className="bg-white/95 border border-gray-200 backdrop-blur-sm p-8 shadow-2xl shadow-gray-900/20 rounded-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-50 rounded-full border border-blue-200 shadow-lg">
                <Briefcase className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
              Welcome to STARTUP_PATH™
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Let's set up your first project to start tracking market traction
            </p>
          </div>

          {/* Case Management Explanation - Redesigned */}
          <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Think of Projects as Cases</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              STARTUP_PATH works like a case management system for startup founders. Each <strong className="text-gray-900">project</strong> represents 
              a specific market validation effort or go-to-market experiment you're running.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 border border-gray-200 rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-600 font-semibold text-sm">Experiments</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">A/B tests and campaigns roll up to your project</p>
              </div>
              <div className="bg-white/80 border border-gray-200 rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-green-600 font-semibold text-sm">AI Agents</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">Four agents work specifically on your project goals</p>
              </div>
              <div className="bg-white/80 border border-gray-200 rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <span className="text-purple-600 font-semibold text-sm">Artifacts</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">Reports and insights generated for your project</p>
              </div>
            </div>
          </div>

          {/* Project Creation Options */}
          <div className="text-center">
            {availableProjects.length === 0 ? (
              // No projects exist - first time user
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Create Your First Project
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
                  Everything in STARTUP_PATH happens within a project. Let's create one to get started.
                </p>
                <Button
                  onClick={() => {
                    console.log('Create New Project button clicked');
                    setShowCreateModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl font-semibold"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Create Your First Project
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </div>
            ) : (
              // Projects exist but none selected
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Select a Project to Continue
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
                  You have {availableProjects.length} existing project{availableProjects.length > 1 ? 's' : ''}. 
                  Select one to continue or create a new project.
                </p>
                
                {/* Existing Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {availableProjects.map((project) => (
                    <Card 
                      key={project.id}
                      className="bg-white/80 border border-gray-200 p-5 hover:bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer"
                      onClick={() => window.location.reload()} // Simple approach - refresh to trigger context
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-gray-900 font-semibold">{project.name}</p>
                          <p className="text-gray-600 text-sm">
                            {project.status === 'active' && '● Active'} 
                            {project.status === 'draft' && '○ Draft'} 
                            {project.status === 'paused' && '⏸ Paused'} 
                            {project.status === 'completed' && '✓ Completed'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Button
                  onClick={() => setShowCreateModal(true)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 px-6 py-3 rounded-xl font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Project
                </Button>
              </div>
            )}
          </div>

          {/* Success Steps Preview */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              What happens after you create a project?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-full border border-green-200 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg group-hover:border-green-300 transition-all duration-300">
                  <span className="text-green-600 font-bold text-lg">1</span>
                </div>
                <p className="text-gray-900 font-semibold mb-2">Set Your Goals</p>
                <p className="text-gray-600 text-sm leading-relaxed">Define target CAC, payback periods, and success metrics</p>
              </div>
              <div className="text-center group">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full border border-blue-200 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg group-hover:border-blue-300 transition-all duration-300">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <p className="text-gray-900 font-semibold mb-2">AI Agents Activate</p>
                <p className="text-gray-600 text-sm leading-relaxed">Four intelligent engines start optimizing your GTM strategy</p>
              </div>
              <div className="text-center group">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full border border-purple-200 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg group-hover:border-purple-300 transition-all duration-300">
                  <span className="text-purple-600 font-bold text-lg">3</span>
                </div>
                <p className="text-gray-900 font-semibold mb-2">Track Results</p>
                <p className="text-gray-600 text-sm leading-relaxed">Real-time insights and optimization recommendations</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Project Creation Modal */}
        <ProjectManagementModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          mode="create"
        />
      </div>
    </div>
  );
}