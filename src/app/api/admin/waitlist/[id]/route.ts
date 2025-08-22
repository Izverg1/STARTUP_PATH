import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

const updateSchema = z.object({
  status: z.enum(['pending', 'contacted', 'converted', 'declined', 'spam']).optional(),
  priority: z.number().min(1).max(5).optional(),
  notes: z.string().optional()
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateSchema.parse(body)
    
    const supabase = await createServerSupabaseClient()
    
    // For now, we'll skip auth check for demo purposes
    // In production, you'd want to verify admin authentication here
    
    const { data, error } = await supabase
      .from('SPATH_waitlist')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating waitlist entry:', error)
      return NextResponse.json(
        { error: 'Failed to update entry' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Update waitlist entry error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // For now, we'll skip auth check for demo purposes
    // In production, you'd want to verify admin authentication here
    
    const { error } = await supabase
      .from('SPATH_waitlist')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      console.error('Error deleting waitlist entry:', error)
      return NextResponse.json(
        { error: 'Failed to delete entry' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Entry deleted successfully'
    })

  } catch (error) {
    console.error('Delete waitlist entry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}