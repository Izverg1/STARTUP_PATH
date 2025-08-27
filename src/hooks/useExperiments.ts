'use client';

import { useState, useEffect, useCallback } from 'react'
import { 
  getOrganizationExperiments,
  getProjectExperimentsWithChannels,
  getActiveExperiments, 
  getCompletedExperiments, 
  getFailedExperiments,
  pauseExperiment,
  resumeExperiment,
  killExperiment,
  type ExperimentWithChannels
} from '@/lib/db/client-queries'

interface UseExperimentsOptions {
  orgId?: string
  projectId?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useExperiments(options: UseExperimentsOptions = {}) {
  const { orgId, projectId, autoRefresh = false, refreshInterval = 30000 } = options
  
  const [experiments, setExperiments] = useState<ExperimentWithChannels[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExperiments = useCallback(async () => {
    // Priority: projectId > orgId
    if (!projectId && !orgId) {
      setExperiments([])
      setLoading(false)
      return
    }

    try {
      setError(null)
      setLoading(true)
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 8000)
      );
      
      const experimentsPromise = projectId 
        ? getProjectExperimentsWithChannels(projectId)
        : getOrganizationExperiments(orgId!)
      
      const data = await Promise.race([experimentsPromise, timeoutPromise]) as any;
      setExperiments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load experiments')
      console.error('Error loading experiments:', err)
      // Still resolve with empty array
      setExperiments([])
    } finally {
      setLoading(false)
    }
  }, [orgId, projectId])

  useEffect(() => {
    fetchExperiments()
  }, [fetchExperiments])

  // Auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh || (!projectId && !orgId)) return

    const interval = setInterval(fetchExperiments, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchExperiments, orgId, projectId])

  // Filtered experiment lists
  const activeExperiments = experiments.filter(exp => exp.status === 'running' || exp.status === 'paused')
  const completedExperiments = experiments.filter(exp => exp.status === 'completed')
  const failedExperiments = experiments.filter(exp => exp.status === 'killed')

  // Actions
  const pauseExperimentAction = useCallback(async (experimentId: string) => {
    try {
      const success = await pauseExperiment(experimentId)
      if (success) {
        // Update local state
        setExperiments(prev => 
          prev.map(exp => 
            exp.id === experimentId 
              ? { ...exp, status: 'paused' as const }
              : exp
          )
        )
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to pause experiment:', err)
      return false
    }
  }, [])

  const resumeExperimentAction = useCallback(async (experimentId: string) => {
    try {
      const success = await resumeExperiment(experimentId)
      if (success) {
        // Update local state
        setExperiments(prev => 
          prev.map(exp => 
            exp.id === experimentId 
              ? { ...exp, status: 'running' as const }
              : exp
          )
        )
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to resume experiment:', err)
      return false
    }
  }, [])

  const killExperimentAction = useCallback(async (experimentId: string) => {
    try {
      const success = await killExperiment(experimentId)
      if (success) {
        // Update local state
        setExperiments(prev => 
          prev.map(exp => 
            exp.id === experimentId 
              ? { ...exp, status: 'killed' as const, end_date: new Date().toISOString().split('T')[0] }
              : exp
          )
        )
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to kill experiment:', err)
      return false
    }
  }, [])

  // Summary statistics
  const summary = {
    total: experiments.length,
    active: activeExperiments.length,
    running: experiments.filter(exp => exp.status === 'running').length,
    paused: experiments.filter(exp => exp.status === 'paused').length,
    completed: completedExperiments.length,
    failed: failedExperiments.length,
    totalBudget: activeExperiments.reduce((sum, exp) => sum + (exp.budget_allocated || 0), 0),
    totalSpent: activeExperiments.reduce((sum, exp) => sum + (exp.budget_spent || 0), 0),
    avgConfidence: activeExperiments.length > 0 
      ? activeExperiments.reduce((sum, exp) => sum + (exp.confidence_level || 0), 0) / activeExperiments.length
      : 0
  }

  return {
    experiments,
    activeExperiments,
    completedExperiments,
    failedExperiments,
    summary,
    loading,
    error,
    refetch: fetchExperiments,
    // Actions
    pauseExperiment: pauseExperimentAction,
    resumeExperiment: resumeExperimentAction,
    killExperiment: killExperimentAction
  }
}