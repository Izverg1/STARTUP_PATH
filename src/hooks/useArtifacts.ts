import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/supabase/types'
import { Artifact } from '@/types/agents'

interface UseArtifactsOptions {
  projectId?: string
  experimentId?: string
  enabled?: boolean
}

export function useArtifacts(options?: UseArtifactsOptions | string) {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient<Database>()

  // Handle both old string API and new options API
  const { projectId, experimentId, enabled } = typeof options === 'string' 
    ? { projectId: options, experimentId: undefined, enabled: true }
    : { projectId: options?.projectId, experimentId: options?.experimentId, enabled: options?.enabled ?? true }

  const fetchArtifactsForProject = async (targetProjectId: string, filterExperimentId?: string) => {
    try {
      setLoading(true)
      setError(null)

      // First check if artifacts table exists by attempting a simple query
      const { data, error: fetchError } = await supabase
        .from('SPATH_artifacts')
        .select('id')
        .limit(1)

      if (fetchError) {
        // If table doesn't exist, set empty artifacts and warn
        console.warn('Artifacts table not found or not accessible:', fetchError.message)
        setArtifacts([])
        setError(null) // Don't show error for missing table in demo mode
        setLoading(false)
        return
      }

      // Build the query - start with project filter
      let query = supabase
        .from('SPATH_artifacts')
        .select(`
          *,
          SPATH_agent_executions (
            id,
            agent_key,
            status
          )
        `)
        .eq('project_id', targetProjectId)
        .eq('is_active', true)

      // If filtering by experiment, we need to join through agent_executions
      // For now, let's get all artifacts and filter in memory since we don't have direct experiment_id relation
      const { data: fullData, error: fullFetchError } = await query.order('created_at', { ascending: false })

      if (fullFetchError) {
        console.warn('Error fetching full artifacts:', fullFetchError.message)
        setArtifacts([])
        setError(null) // Don't show error in demo mode
        setLoading(false)
        return
      }

      // Transform the data to match the Artifact type
      const transformedArtifacts: Artifact[] = (fullData || []).map(item => ({
        id: item.id,
        agent_key: item.agent_key as any,
        execution_id: item.execution_id,
        project_id: item.project_id,
        type: item.type as any,
        title: item.title,
        description: item.metadata?.description as string || '',
        content: item.content as any,
        metadata: {
          confidence_score: item.metadata?.confidence_score as number || 0,
          tags: item.metadata?.tags as string[] || [],
          created_by: item.metadata?.created_by as string || '',
          ...item.metadata
        },
        version: item.version,
        is_active: item.is_active,
        parent_artifact_id: item.parent_artifact_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        expires_at: item.expires_at
      }))

      // Filter by experiment if needed (in-memory filtering for now)
      const filteredArtifacts = filterExperimentId 
        ? transformedArtifacts.filter(artifact => {
            // This is a simplified filter - in a real implementation, 
            // we might need to check the agent execution context
            return true // For now, return all artifacts for the project
          })
        : transformedArtifacts

      setArtifacts(filteredArtifacts)
    } catch (err) {
      console.warn('Error fetching artifacts:', err)
      setArtifacts([]) // Set empty array instead of error
      setError(null) // Don't show errors in demo mode
    } finally {
      setLoading(false)
    }
  }

  const fetchArtifacts = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    // If we have experimentId but no projectId, we need to fetch the project_id for this experiment first
    if (experimentId && !projectId) {
      const { data: expData } = await supabase
        .from('SPATH_experiments')
        .select('project_id')
        .eq('id', experimentId)
        .single()
      
      if (!expData?.project_id) {
        setLoading(false)
        return
      }
      
      // Use the project_id from the experiment
      return fetchArtifactsForProject(expData.project_id, experimentId)
    }

    if (!projectId && !experimentId) {
      setLoading(false)
      return
    }

    return fetchArtifactsForProject(projectId!, experimentId)
  }, [projectId, experimentId, enabled, supabase])

  const deleteArtifact = useCallback(async (artifactId: string) => {
    try {
      const response = await fetch(`/api/artifacts/${artifactId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete artifact')
      }

      // Remove from local state immediately for better UX
      setArtifacts(prev => prev.filter(artifact => artifact.id !== artifactId))
      
      return true
    } catch (error) {
      console.error('Error deleting artifact:', error)
      throw error
    }
  }, [])

  const refreshArtifacts = useCallback(() => {
    fetchArtifacts()
  }, [fetchArtifacts])

  // Subscribe to real-time changes (only if artifacts are available)
  useEffect(() => {
    const actualProjectId = projectId || (experimentId ? 'experiment-project' : null)
    if (!actualProjectId || error || !enabled) return

    try {
      const subscription = supabase
        .channel('artifacts')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'SPATH_artifacts',
            filter: `project_id=eq.${actualProjectId}`
          },
          (payload) => {
            console.log('Artifact change detected:', payload)
            refreshArtifacts()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    } catch (subscriptionError) {
      console.warn('Could not subscribe to artifact changes:', subscriptionError)
      // Don't fail if real-time subscription doesn't work
    }
  }, [projectId, experimentId, enabled, supabase, refreshArtifacts, error])

  // Initial fetch
  useEffect(() => {
    fetchArtifacts()
  }, [fetchArtifacts])

  return {
    artifacts,
    loading,
    error,
    deleteArtifact,
    refreshArtifacts
  }
}