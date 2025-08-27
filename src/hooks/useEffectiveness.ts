'use client';

import { useState, useEffect, useCallback } from 'react'
import { 
  getOrganizationEffectivenessData,
  type EffectivenessData
} from '@/lib/db/client-queries'

interface UseEffectivenessOptions {
  orgId?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useEffectiveness(options: UseEffectivenessOptions = {}) {
  const { orgId, autoRefresh = false, refreshInterval = 30000 } = options
  
  const [effectivenessData, setEffectivenessData] = useState<EffectivenessData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEffectivenessData = useCallback(async () => {
    if (!orgId) {
      setEffectivenessData(null)
      setLoading(false)
      return
    }

    try {
      setError(null)
      const data = await getOrganizationEffectivenessData(orgId)
      setEffectivenessData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load effectiveness data')
      console.error('Error loading effectiveness data:', err)
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    fetchEffectivenessData()
  }, [fetchEffectivenessData])

  // Auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh || !orgId) return

    const interval = setInterval(fetchEffectivenessData, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchEffectivenessData, orgId])

  return {
    effectivenessData,
    loading,
    error,
    refetch: fetchEffectivenessData,
    
    // Computed properties for easier access
    overview: effectivenessData?.overview || null,
    channelPerformance: effectivenessData?.channelPerformance || [],
    timeSeriesData: effectivenessData?.timeSeriesData || [],
    optimizationOpportunities: effectivenessData?.optimizationOpportunities || []
  }
}