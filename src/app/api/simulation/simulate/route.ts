// API endpoint for running Thompson Sampling simulations
// POST /api/simulation/simulate

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
    const { days = 7, noiseVariance = 0.05 } = body

    if (days <= 0 || days > 365) {
      return NextResponse.json(
        { error: 'Days must be between 1 and 365' }, 
        { status: 400 }
      )
    }

    if (noiseVariance < 0 || noiseVariance > 0.5) {
      return NextResponse.json(
        { error: 'Noise variance must be between 0 and 0.5' }, 
        { status: 400 }
      )
    }

    // Get simulation service
    const simulationService = getSimulationService()
    const state = simulationService.getState()

    if (!state.allocator || !state.lastAllocation.length) {
      return NextResponse.json(
        { error: 'No allocation found. Run budget allocation first.' }, 
        { status: 400 }
      )
    }

    // Run time period simulation
    const results = await simulationService.simulatePeriod(days, noiseVariance)
    
    // Calculate summary statistics
    const totalConversions = results.reduce((sum, r) => sum + r.conversions, 0)
    const totalCost = results.reduce((sum, r) => sum + r.cost, 0)
    const totalImpressions = results.reduce((sum, r) => sum + r.impressions, 0)
    
    const avgConversionRate = totalImpressions > 0 ? totalConversions / totalImpressions : 0
    const avgCostPerConversion = totalConversions > 0 ? totalCost / totalConversions : 0
    const roi = totalConversions > 0 ? (totalConversions * 1000 - totalCost) / totalCost : 0

    // Group results by channel for insights
    const channelPerformance = new Map()
    results.forEach(result => {
      const existing = channelPerformance.get(result.channelId) || {
        channelId: result.channelId,
        totalConversions: 0,
        totalCost: 0,
        totalImpressions: 0,
        days: 0
      }
      
      existing.totalConversions += result.conversions
      existing.totalCost += result.cost
      existing.totalImpressions += result.impressions
      existing.days = Math.max(existing.days, result.day)
      
      channelPerformance.set(result.channelId, existing)
    })

    const channelSummary = Array.from(channelPerformance.values()).map(cp => ({
      ...cp,
      conversionRate: cp.totalImpressions > 0 ? cp.totalConversions / cp.totalImpressions : 0,
      costPerConversion: cp.totalConversions > 0 ? cp.totalCost / cp.totalConversions : 0,
      dailyAverage: {
        conversions: cp.totalConversions / days,
        cost: cp.totalCost / days,
        impressions: cp.totalImpressions / days
      }
    }))

    const metrics = simulationService.getMetrics()

    return NextResponse.json({
      success: true,
      data: {
        simulationResults: results,
        summary: {
          totalConversions,
          totalCost,
          totalImpressions,
          avgConversionRate,
          avgCostPerConversion,
          projectedROI: roi,
          days,
          noiseVariance
        },
        channelPerformance: channelSummary,
        metrics,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Simulation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to run simulation', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}

// Get available simulation scenarios
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

    // Return predefined simulation scenarios
    const scenarios = [
      {
        id: 'conservative',
        name: 'Conservative Growth',
        description: 'Low risk simulation with steady, predictable growth patterns',
        parameters: {
          days: 30,
          noiseVariance: 0.02,
          config: {
            totalBudget: 10000,
            minAllocationPercentage: 0.10,
            maxAllocationPercentage: 0.40,
            riskTolerance: 'conservative'
          }
        }
      },
      {
        id: 'balanced',
        name: 'Balanced Optimization',
        description: 'Moderate risk simulation balancing growth and stability',
        parameters: {
          days: 21,
          noiseVariance: 0.05,
          config: {
            totalBudget: 10000,
            minAllocationPercentage: 0.05,
            maxAllocationPercentage: 0.60,
            riskTolerance: 'moderate'
          }
        }
      },
      {
        id: 'aggressive',
        name: 'Aggressive Growth',
        description: 'High risk simulation with dynamic budget reallocation',
        parameters: {
          days: 14,
          noiseVariance: 0.08,
          config: {
            totalBudget: 10000,
            minAllocationPercentage: 0.02,
            maxAllocationPercentage: 0.80,
            riskTolerance: 'aggressive'
          }
        }
      },
      {
        id: 'stress_test',
        name: 'Stress Test',
        description: 'High volatility simulation to test allocation robustness',
        parameters: {
          days: 7,
          noiseVariance: 0.15,
          config: {
            totalBudget: 10000,
            minAllocationPercentage: 0.05,
            maxAllocationPercentage: 0.70,
            riskTolerance: 'moderate'
          }
        }
      },
      {
        id: 'long_term',
        name: 'Long-term Projection',
        description: 'Extended simulation for quarterly planning',
        parameters: {
          days: 90,
          noiseVariance: 0.03,
          config: {
            totalBudget: 10000,
            minAllocationPercentage: 0.08,
            maxAllocationPercentage: 0.50,
            riskTolerance: 'moderate'
          }
        }
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        scenarios,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Get scenarios error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get scenarios', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}