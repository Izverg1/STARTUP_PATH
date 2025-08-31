import { NextRequest, NextResponse } from 'next/server'
import { sendStatusEmail } from '@/lib/email/mailer'

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-status-secret') || ''
    const expected = process.env.APP_STATUS_SECRET || ''
    if (!expected || secret !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({})) as {
      to?: string
      subject?: string
      text?: string
      html?: string
    }

    const subject = body.subject || 'Startup_Path Status'
    const text = body.text || 'No message provided.'
    const html = body.html

    const info = await sendStatusEmail({ to: body.to, subject, text, html })
    return NextResponse.json({ ok: true, id: info.messageId })
  } catch (err: any) {
    console.error('Status email error:', err?.message || err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}

