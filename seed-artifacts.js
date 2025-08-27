#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedArtifacts() {
  try {
    console.log('🌱 Seeding sample artifacts data...')
    
    // First, let's check if we have any projects
    const { data: projects } = await supabase
      .from('SPATH_projects')
      .select('id')
      .limit(1)
    
    if (!projects || projects.length === 0) {
      console.log('⚠️  No projects found. Creating a sample project first...')
      
      // Create a sample organization and project
      const { data: org } = await supabase
        .from('SPATH_organizations')
        .insert({
          name: 'Demo Organization',
          slug: 'demo-org',
          subscription_tier: 'demo'
        })
        .select()
        .single()
      
      if (org) {
        const { data: project } = await supabase
          .from('SPATH_projects')
          .insert({
            name: 'Demo Project',
            slug: 'demo-project',
            org_id: org.id,
            status: 'active'
          })
          .select()
          .single()
        
        console.log('✅ Created sample project:', project?.id)
        projects.push(project)
      }
    }
    
    const projectId = projects[0].id
    console.log('📦 Using project ID:', projectId)
    
    // Create sample agents for this project using the existing schema
    const agentConfigs = [
      {
        name: 'Channel Discovery Engine',
        type: 'channel_discovery_engine',
        project_id: projectId,
        status: ['idle', 'working', 'done'][Math.floor(Math.random() * 3)],
        settings: {
          capabilities: [
            { name: 'Analysis', type: 'analysis' },
            { name: 'Channel Discovery', type: 'channel_discovery' }
          ],
          status_line: 'Channel Discovery Engine - Ready'
        }
      },
      {
        name: 'Campaign Optimization Engine',
        type: 'campaign_optimization_engine',
        project_id: projectId,
        status: ['idle', 'working', 'done'][Math.floor(Math.random() * 3)],
        settings: {
          capabilities: [
            { name: 'Optimization', type: 'optimization' },
            { name: 'Copy Generation', type: 'copy_generation' }
          ],
          status_line: 'Campaign Optimization Engine - Ready'
        }
      },
      {
        name: 'Performance Analytics Engine',
        type: 'performance_analytics_engine',
        project_id: projectId,
        status: ['idle', 'working', 'done'][Math.floor(Math.random() * 3)],
        settings: {
          capabilities: [
            { name: 'Analysis', type: 'analysis' },
            { name: 'Performance Analysis', type: 'performance_analysis' }
          ],
          status_line: 'Performance Analytics Engine - Ready'
        }
      },
      {
        name: 'Budget Allocation Engine',
        type: 'budget_allocation_engine',
        project_id: projectId,
        status: ['idle', 'working', 'done'][Math.floor(Math.random() * 3)],
        settings: {
          capabilities: [
            { name: 'Optimization', type: 'optimization' },
            { name: 'Budget Optimization', type: 'budget_optimization' }
          ],
          status_line: 'Budget Allocation Engine - Ready'
        }
      }
    ]
    
    console.log('About to insert agents:', agentConfigs.length, 'items')
    
    const { data: agents, error: agentError } = await supabase
      .from('SPATH_agents')
      .insert(agentConfigs)
      .select()
    
    if (agentError) {
      console.log('Agent insertion error:', agentError)
    }
    
    console.log(`✅ Created/updated ${agents?.length || 0} agents`)
    
    // Create sample executions using the actual table schema
    const executionInserts = agents?.map(agent => ({
      agent_id: agent.id,
      status: 'completed',
      input: { trigger: 'manual', parameters: {} },
      output: { result: 'Success', metrics: { processed: Math.floor(Math.random() * 1000) } },
      started_at: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      completed_at: new Date().toISOString()
    })) || []
    
    const { data: executions } = await supabase
      .from('SPATH_agent_executions')
      .insert(executionInserts)
      .select()
    
    console.log(`✅ Created ${executions?.length || 0} agent executions`)
    
    // Create sample artifacts
    const artifactTypes = ['benchmark', 'copy', 'calc', 'report', 'insight', 'recommendation', 'analysis', 'optimization']
    
    const artifactInserts = executions?.flatMap(execution => {
      const numArtifacts = Math.floor(Math.random() * 3) + 1
      // Find the corresponding agent for this execution
      const agent = agents.find(a => a.id === execution.agent_id)
      return Array.from({ length: numArtifacts }, (_, i) => ({
        project_id: projectId,
        agent_id: execution.agent_id,
        type: artifactTypes[Math.floor(Math.random() * artifactTypes.length)],
        title: `${agent?.name || 'Agent'} - Artifact ${i + 1}`,
        content: {
          summary: `Generated by ${agent?.name || 'Agent'}`,
          data: { 
            confidence: Math.random(),
            metrics: { value: Math.floor(Math.random() * 100) }
          }
        },
        metadata: {
          confidence_score: Math.random(),
          tags: ['generated', 'demo', agent?.type?.split('_')[0] || 'agent'],
          created_by: 'system'
        }
      }))
    }) || []
    
    const { data: artifacts } = await supabase
      .from('SPATH_artifacts')
      .insert(artifactInserts)
      .select()
    
    console.log(`✅ Created ${artifacts?.length || 0} artifacts`)
    
    console.log('\n🎉 Seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`- Agents: ${agents?.length || 0}`)
    console.log(`- Executions: ${executions?.length || 0}`) 
    console.log(`- Artifacts: ${artifacts?.length || 0}`)
    console.log('\n🔄 Restart your dev server to see the artifacts in the right sidebar!')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    console.log('\n💡 Note: Make sure the migration was applied successfully first')
  }
}

seedArtifacts()