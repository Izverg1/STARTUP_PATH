// API endpoint for Thompson Sampling budget allocation
// POST /api/simulation/allocate

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSimulationService } from '@/lib/simulation/simulation-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    const { projectId, config } = body

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' }, 
        { status: 400 }
      )
    }

    // Create simulation service instance
    const simulationService = getSimulationService()
    
    // Initialize project if needed
    await simulationService.initializeProject(projectId)
    
    // Update configuration if provided
    if (config) {
      simulationService.updateConfig(config)
    }

    // Run Thompson Sampling allocation
    const allocation = await simulationService.allocateBudget()
    const metrics = simulationService.getMetrics()
    const channelSummary = simulationService.getChannelSummary()
    const decisionGates = simulationService.checkDecisionGates()

    return NextResponse.json({
      success: true,
      data: {
        allocation,
        metrics,
        channelSummary,
        decisionGates,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Simulation allocation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to run allocation', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const projectId = url.searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' }, 
        { status: 400 }
      )
    }

    // Get current simulation state
    const simulationService = getSimulationService()
    const state = simulationService.getState()
    
    if (!state.allocator || state.currentProject?.id !== projectId) {
      // Initialize if needed
      await simulationService.initializeProject(projectId)
    }

    const metrics = simulationService.getMetrics()
    const channelSummary = simulationService.getChannelSummary()
    const allocation = state.lastAllocation

    return NextResponse.json({
      success: true,
      data: {
        allocation,
        metrics,
        channelSummary,
        isRunning: state.isRunning,
        isInitialized: !!state.allocator,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Get allocation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get allocation', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}