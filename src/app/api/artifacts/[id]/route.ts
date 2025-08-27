import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase/types'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Verify user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // First, check if the artifact exists and user has permission
    const { data: artifact, error: fetchError } = await supabase
      .from('SPATH_artifacts')
      .select(`
        id,
        project_id,
        title,
        type,
        agent_key,
        SPATH_projects!inner (
          id,
          org_id,
          SPATH_orgs!inner (
            id,
            SPATH_users!inner (
              id,
              email
            )
          )
        )
      `)
      .eq('id', id)
      .eq('SPATH_projects.SPATH_orgs.SPATH_users.id', session.user.id)
      .single()

    if (fetchError || !artifact) {
      return NextResponse.json(
        { error: 'Artifact not found or access denied' },
        { status: 404 }
      )
    }

    // Check if artifact is currently being used/referenced
    const { data: executions } = await supabase
      .from('SPATH_agent_executions')
      .select('id, status')
      .contains('artifacts_created', [id])
      .in('status', ['running', 'queued'])

    if (executions && executions.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete artifact that is being generated or used by running agents',
          code: 'ARTIFACT_IN_USE'
        },
        { status: 409 }
      )
    }

    // Soft delete: mark as inactive and set expiry
    const { error: deleteError } = await supabase
      .from('SPATH_artifacts')
      .update({
        is_active: false,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h from now
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting artifact:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete artifact' },
        { status: 500 }
      )
    }

    // Log the deletion action - skip if no experiment context
    // Since experiment_id is required, we'll only log if we have that context
    // This could be enhanced to track the experiment ID if available

    return NextResponse.json({
      success: true,
      message: `Artifact "${artifact.title}" has been deleted`,
      artifact: {
        id: artifact.id,
        title: artifact.title,
        type: artifact.type,
        agent_key: artifact.agent_key
      }
    })

  } catch (error) {
    console.error('Error in DELETE /api/artifacts/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Verify user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Fetch artifact with project permissions check
    const { data: artifact, error } = await supabase
      .from('SPATH_artifacts')
      .select(`
        *,
        SPATH_projects!inner (
          id,
          name,
          org_id,
          SPATH_orgs!inner (
            id,
            SPATH_users!inner (
              id,
              email
            )
          )
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .eq('SPATH_projects.SPATH_orgs.SPATH_users.id', session.user.id)
      .single()

    if (error || !artifact) {
      return NextResponse.json(
        { error: 'Artifact not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json({ artifact })

  } catch (error) {
    console.error('Error in GET /api/artifacts/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}