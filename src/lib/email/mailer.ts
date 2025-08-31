import nodemailer from 'nodemailer'

type SendArgs = {
  to?: string
  subject: string
  text?: string
  html?: string
}

// Create a singleton transporter using environment variables with sane dev defaults
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST || '127.0.0.1'
  const port = Number(process.env.SMTP_PORT || 1025)
  const secure = /^(1|true|yes)$/i.test(process.env.SMTP_SECURE || 'false')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  })

  return transporter
}

export async function sendStatusEmail({ to, subject, text, html }: SendArgs) {
  const from = process.env.MAIL_FROM || 'status@local.test'
  const defaultTo = process.env.MAIL_TO
  const recipient = to || defaultTo

  if (!recipient) {
    throw new Error('No recipient provided. Set MAIL_TO or pass `to`.')
  }

  const t = getTransporter()
  const info = await t.sendMail({ from, to: recipient, subject, text, html })
  return info
}

