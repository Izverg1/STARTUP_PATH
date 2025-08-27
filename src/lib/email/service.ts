import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null
  private fromEmail: string

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@startuppath.com'
    this.initializeTransporter()
  }

  private initializeTransporter() {
    // Support multiple email providers
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      // Gmail configuration
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      })
    } else if (process.env.SMTP_HOST) {
      // Custom SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      })
    } else if (process.env.SENDGRID_API_KEY) {
      // SendGrid configuration
      this.transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      })
    } else {
      console.warn('⚠️ No email configuration found. Email notifications disabled.')
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.error('❌ Email transporter not configured')
      return false
    }

    try {
      const mailOptions = {
        from: this.fromEmail,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      }

      const info = await this.transporter.sendMail(mailOptions)
      console.log('✅ Email sent successfully:', info.messageId)
      return true
    } catch (error) {
      console.error('❌ Failed to send email:', error)
      return false
    }
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false
    }

    try {
      await this.transporter.verify()
      console.log('✅ Email service connection verified')
      return true
    } catch (error) {
      console.error('❌ Email service connection failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()