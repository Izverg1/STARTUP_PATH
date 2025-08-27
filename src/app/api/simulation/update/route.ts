// API endpoint for updating channel performance in Thompson Sampling
// PUT /api/simulation/update

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSimulationService } from '@/lib/simulation/simulation-service'

export async function PUT(request: NextRequest) {
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
    const { channelId, conversions, impressions, spend } = body

    if (!channelId || conversions === undefined || impressions === undefined || spend === undefined) {
      return NextResponse.json(
        { error: 'channelId, conversions, impressions, and spend are required' }, 
        { status: 400 }
      )
    }

    // Get simulation service
    const simulationService = getSimulationService()
    const state = simulationService.getState()

    if (!state.allocator) {
      return NextResponse.json(
        { error: 'Simulation not initialized. Run allocation first.' }, 
        { status: 400 }
      )
    }

    // Update channel performance and get new allocation
    const newAllocation = await simulationService.updateChannelPerformance(
      channelId,
      conversions,
      impressions,
      spend
    )

    const metrics = simulationService.getMetrics()
    const channelSummary = simulationService.getChannelSummary()
    const decisionGates = simulationService.checkDecisionGates()

    return NextResponse.json({
      success: true,
      data: {
        allocation: newAllocation,
        metrics,
        channelSummary,
        decisionGates,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Channel performance update error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to update channel performance', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}

// Bulk update for multiple channels
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
    const { updates } = body

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'updates array is required' }, 
        { status: 400 }
      )
    }

    // Validate update objects
    for (const update of updates) {
      if (!update.channelId || update.conversions === undefined || update.impressions === undefined || update.spend === undefined) {
        return NextResponse.json(
          { error: 'Each update must have channelId, conversions, impressions, and spend' }, 
          { status: 400 }
        )
      }
    }

    // Get simulation service
    const simulationService = getSimulationService()
    const state = simulationService.getState()

    if (!state.allocator) {
      return NextResponse.json(
        { error: 'Simulation not initialized. Run allocation first.' }, 
        { status: 400 }
      )
    }

    // Apply all updates
    let finalAllocation = state.lastAllocation
    for (const update of updates) {
      finalAllocation = await simulationService.updateChannelPerformance(
        update.channelId,
        update.conversions,
        update.impressions,
        update.spend
      )
    }

    const metrics = simulationService.getMetrics()
    const channelSummary = simulationService.getChannelSummary()
    const decisionGates = simulationService.checkDecisionGates()

    return NextResponse.json({
      success: true,
      data: {
        allocation: finalAllocation,
        metrics,
        channelSummary,
        decisionGates,
        updatesApplied: updates.length,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Bulk channel update error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to update channel performance', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}