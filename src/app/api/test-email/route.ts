import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email/service'
import { generateAdminNotificationEmail, generateWelcomeEmail } from '@/lib/email/templates'

export async function POST(request: NextRequest) {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Test endpoint disabled in production' },
        { status: 403 }
      )
    }

    const { type = 'admin' } = await request.json()

    // Test data
    const testData = {
      email: 'test@example.com',
      name: 'John Doe',
      company: 'Test Company Inc.',
      position: 'CEO',
      type: 'customer' as const,
      additionalInfo: {
        monthlyBudget: '$10,000-$25,000',
        industry: 'SaaS'
      },
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      referrer: 'https://google.com',
      created_at: new Date().toISOString()
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'your-email@example.com'

    if (type === 'admin') {
      // Test admin notification email
      const adminNotification = generateAdminNotificationEmail(testData)
      const success = await emailService.sendEmail({
        to: adminEmail,
        subject: `[TEST] ${adminNotification.subject}`,
        html: adminNotification.html,
        text: adminNotification.text
      })

      return NextResponse.json({
        success,
        message: success 
          ? `Test admin email sent to ${adminEmail}` 
          : 'Failed to send test email - check email configuration',
        type: 'admin'
      })
    } else if (type === 'welcome') {
      // Test welcome email
      const welcomeEmail = generateWelcomeEmail(testData)
      const success = await emailService.sendEmail({
        to: adminEmail, // Send to admin for testing
        subject: `[TEST] ${welcomeEmail.subject}`,
        html: welcomeEmail.html,
        text: welcomeEmail.text
      })

      return NextResponse.json({
        success,
        message: success 
          ? `Test welcome email sent to ${adminEmail}` 
          : 'Failed to send test email - check email configuration',
        type: 'welcome'
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid test type. Use "admin" or "welcome"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Failed to send test email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Test endpoint disabled in production' },
        { status: 403 }
      )
    }

    // Check email service connection
    const isConnected = await emailService.verifyConnection()

    return NextResponse.json({
      emailService: {
        connected: isConnected,
        configuration: {
          hasGmail: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
          hasSMTP: !!process.env.SMTP_HOST,
          hasSendGrid: !!process.env.SENDGRID_API_KEY,
          adminEmail: process.env.ADMIN_EMAIL || 'not configured',
          fromEmail: process.env.EMAIL_FROM || 'noreply@startuppath.com'
        }
      },
      instructions: {
        testAdmin: 'POST /api/test-email with {"type": "admin"}',
        testWelcome: 'POST /api/test-email with {"type": "welcome"}',
        setup: 'Configure email settings in .env.local'
      }
    })

  } catch (error) {
    console.error('Email service check error:', error)
    return NextResponse.json(
      { error: 'Failed to check email service', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}