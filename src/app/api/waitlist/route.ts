import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Validation schema
const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').optional(),
  company: z.string().min(1, 'Company is required').optional(),
  position: z.string().optional(),
  type: z.enum(['customer', 'partner'], {
    required_error: 'Type must be customer or partner'
  }),
  additionalInfo: z.object({
    monthlyBudget: z.string().optional(),
    partnershipType: z.string().optional(),
    industry: z.string().optional(),
    source: z.string().default('landing_page')
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = waitlistSchema.parse(body)
    
    // Create Supabase client
    const supabase = await createServerSupabaseClient()
    
    // Get client IP and user agent for tracking
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'direct'
    
    // Insert into waitlist table
    const { data, error } = await supabase
      .from('SPATH_waitlist')
      .insert({
        email: validatedData.email,
        name: validatedData.name || null,
        company: validatedData.company || null,
        position: validatedData.position || null,
        type: validatedData.type,
        source: 'landing_page',
        referrer: referer,
        ip_address: ip,
        user_agent: userAgent,
        additional_info: validatedData.additionalInfo || {},
        status: 'pending',
        priority: validatedData.type === 'customer' ? 1 : 2 // Customers get higher priority
      })
      .select()
      .single()

    if (error) {
      // Check for duplicate email
      if (error.code === '23505') {
        return NextResponse.json(
          { 
            error: 'Email already registered',
            message: 'This email is already on our waitlist. We\'ll keep you updated!'
          },
          { status: 409 }
        )
      }
      
      console.error('Database error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return NextResponse.json(
        { 
          error: 'Failed to join waitlist', 
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Successfully joined the ${validatedData.type} waitlist!`,
      data: {
        id: data.id,
        email: data.email,
        type: data.type,
        created_at: data.created_at
      }
    })

  } catch (error) {
    console.error('Waitlist submission error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
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

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get waitlist statistics
    const { data: stats, error } = await supabase
      .rpc('get_waitlist_stats')
    
    if (error) {
      console.error('Error fetching waitlist stats:', error)
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Waitlist stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}