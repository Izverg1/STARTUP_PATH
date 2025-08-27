interface WaitlistData {
  email: string
  name?: string
  company?: string
  position?: string
  type: 'customer' | 'partner'
  additionalInfo?: {
    monthlyBudget?: string
    partnershipType?: string
    industry?: string
  }
  ip_address?: string
  user_agent?: string
  referrer?: string
  created_at: string
}

export function generateAdminNotificationEmail(data: WaitlistData): { subject: string, html: string, text: string } {
  const isCustomer = data.type === 'customer'
  const typeLabel = isCustomer ? 'Customer' : 'Partner'
  const emoji = isCustomer ? '🚀' : '🤝'
  
  const subject = `${emoji} New ${typeLabel} Signup - ${data.email}`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New ${typeLabel} Signup</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, ${isCustomer ? '#ff00aa' : '#6366f1'}, ${isCustomer ? '#cc0088' : '#4f46e5'}); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 8px 0 0 0; opacity: 0.9; font-size: 16px; }
        .content { padding: 30px; }
        .info-grid { display: grid; gap: 20px; margin: 20px 0; }
        .info-card { background: #f8f9fa; border-radius: 8px; padding: 20px; border-left: 4px solid ${isCustomer ? '#ff00aa' : '#6366f1'}; }
        .info-card h3 { margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600; }
        .info-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-weight: 500; color: #6b7280; }
        .info-value { font-weight: 600; color: #111827; text-align: right; max-width: 60%; word-break: break-word; }
        .priority { background: ${isCustomer ? '#fef3f2' : '#f0f0ff'}; color: ${isCustomer ? '#dc2626' : '#4f46e5'}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .timestamp { background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
        .cta { text-align: center; margin: 30px 0; }
        .cta-button { display: inline-block; background: ${isCustomer ? '#ff00aa' : '#6366f1'}; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.2s; }
        .cta-button:hover { background: ${isCustomer ? '#cc0088' : '#4f46e5'}; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${emoji} New ${typeLabel} Signup</h1>
            <p>Someone just joined the STARTUP_PATH waitlist</p>
        </div>
        
        <div class="content">
            <div class="info-grid">
                <div class="info-card">
                    <h3>📋 Contact Information</h3>
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${data.email}</span>
                    </div>
                    ${data.name ? `
                    <div class="info-row">
                        <span class="info-label">Name:</span>
                        <span class="info-value">${data.name}</span>
                    </div>` : ''}
                    ${data.company ? `
                    <div class="info-row">
                        <span class="info-label">Company:</span>
                        <span class="info-value">${data.company}</span>
                    </div>` : ''}
                    ${data.position ? `
                    <div class="info-row">
                        <span class="info-label">Position:</span>
                        <span class="info-value">${data.position}</span>
                    </div>` : ''}
                    <div class="info-row">
                        <span class="info-label">Type:</span>
                        <span class="info-value">
                            <span class="priority">${typeLabel}</span>
                        </span>
                    </div>
                </div>
                
                ${data.additionalInfo && Object.keys(data.additionalInfo).length > 0 ? `
                <div class="info-card">
                    <h3>${isCustomer ? '💰' : '🤝'} Additional Details</h3>
                    ${data.additionalInfo.monthlyBudget ? `
                    <div class="info-row">
                        <span class="info-label">Monthly Budget:</span>
                        <span class="info-value">${data.additionalInfo.monthlyBudget}</span>
                    </div>` : ''}
                    ${data.additionalInfo.partnershipType ? `
                    <div class="info-row">
                        <span class="info-label">Partnership Type:</span>
                        <span class="info-value">${data.additionalInfo.partnershipType}</span>
                    </div>` : ''}
                    ${data.additionalInfo.industry ? `
                    <div class="info-row">
                        <span class="info-label">Industry:</span>
                        <span class="info-value">${data.additionalInfo.industry}</span>
                    </div>` : ''}
                </div>` : ''}
                
                <div class="info-card">
                    <h3>🔍 Technical Details</h3>
                    ${data.ip_address ? `
                    <div class="info-row">
                        <span class="info-label">IP Address:</span>
                        <span class="info-value">${data.ip_address}</span>
                    </div>` : ''}
                    ${data.referrer && data.referrer !== 'direct' ? `
                    <div class="info-row">
                        <span class="info-label">Referrer:</span>
                        <span class="info-value">${data.referrer}</span>
                    </div>` : ''}
                    ${data.user_agent ? `
                    <div class="info-row">
                        <span class="info-label">User Agent:</span>
                        <span class="info-value" style="font-size: 11px;">${data.user_agent.substring(0, 80)}${data.user_agent.length > 80 ? '...' : ''}</span>
                    </div>` : ''}
                </div>
            </div>
            
            <div class="cta">
                <a href="http://localhost:1010/admin/waitlist" class="cta-button">
                    View in Admin Panel
                </a>
            </div>
        </div>
        
        <div class="timestamp">
            Signup Time: ${new Date(data.created_at).toLocaleString('en-US', { 
                timeZone: 'America/New_York',
                dateStyle: 'full',
                timeStyle: 'long'
            })}
        </div>
    </div>
</body>
</html>`

  const text = `
🎉 NEW ${typeLabel.toUpperCase()} SIGNUP

Contact Information:
- Email: ${data.email}
${data.name ? `- Name: ${data.name}` : ''}
${data.company ? `- Company: ${data.company}` : ''}
${data.position ? `- Position: ${data.position}` : ''}
- Type: ${typeLabel} (${isCustomer ? 'High Priority' : 'Standard Priority'})

${data.additionalInfo && Object.keys(data.additionalInfo).length > 0 ? `
Additional Details:
${data.additionalInfo.monthlyBudget ? `- Monthly Budget: ${data.additionalInfo.monthlyBudget}` : ''}
${data.additionalInfo.partnershipType ? `- Partnership Type: ${data.additionalInfo.partnershipType}` : ''}
${data.additionalInfo.industry ? `- Industry: ${data.additionalInfo.industry}` : ''}
` : ''}

Technical Details:
${data.ip_address ? `- IP Address: ${data.ip_address}` : ''}
${data.referrer && data.referrer !== 'direct' ? `- Referrer: ${data.referrer}` : ''}

Signup Time: ${new Date(data.created_at).toLocaleString('en-US', { 
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'long'
})}

View in admin panel: http://localhost:1010/admin/waitlist
`

  return { subject, html, text }
}

export function generateWelcomeEmail(data: WaitlistData): { subject: string, html: string, text: string } {
  const isCustomer = data.type === 'customer'
  const typeLabel = isCustomer ? 'startup' : 'partner'
  
  const subject = `Welcome to STARTUP_PATH - You're on the waitlist! 🚀`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to STARTUP_PATH</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #0a0a0a; }
        .container { max-width: 600px; margin: 0 auto; background: #111111; border-radius: 12px; border: 1px solid #333; overflow: hidden; }
        .header { background: linear-gradient(135deg, #ff00aa, #cc0088); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .header p { margin: 12px 0 0 0; opacity: 0.9; font-size: 18px; }
        .content { padding: 40px 30px; color: #e5e5e5; }
        .content h2 { color: #ff00aa; margin-top: 0; }
        .features { background: #1a1a1a; border-radius: 8px; padding: 25px; margin: 25px 0; border: 1px solid #333; }
        .feature { display: flex; align-items: flex-start; margin: 15px 0; }
        .feature-icon { margin-right: 15px; font-size: 20px; margin-top: 2px; }
        .feature-text { flex: 1; }
        .feature-title { font-weight: 600; color: #fff; margin-bottom: 5px; }
        .cta { text-align: center; margin: 30px 0; }
        .cta-button { display: inline-block; background: #ff00aa; color: white; padding: 15px 35px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.2s; }
        .cta-button:hover { background: #cc0088; }
        .footer { background: #0a0a0a; color: #888; padding: 25px; text-align: center; font-size: 14px; border-top: 1px solid #333; }
        .stats { background: linear-gradient(135deg, #1a1a1a, #222); border-radius: 8px; padding: 20px; text-align: center; border: 1px solid #333; }
        .stat-number { font-size: 24px; font-weight: 700; color: #ff00aa; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Welcome to STARTUP_PATH!</h1>
            <p>You're officially on the waitlist</p>
        </div>
        
        <div class="content">
            <h2>Hi ${data.name || 'there'}! 👋</h2>
            
            <p>Thanks for joining the STARTUP_PATH revolution! You're now part of an exclusive group of forward-thinking ${typeLabel}s who are ready to transform their GTM strategy with AI.</p>
            
            <div class="stats">
                <div class="stat-number">500+</div>
                <p style="margin: 5px 0 0 0; color: #ccc;">startups already in line</p>
            </div>
            
            <div class="features">
                <h3 style="color: #ff00aa; margin-top: 0;">What you can expect:</h3>
                
                <div class="feature">
                    <div class="feature-icon">🎯</div>
                    <div class="feature-text">
                        <div class="feature-title">Early Access</div>
                        <div>Be among the first to access STARTUP_PATH when we launch in Q1 2025</div>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">💰</div>
                    <div class="feature-text">
                        <div class="feature-title">Special Pricing</div>
                        <div>Exclusive early-bird pricing with up to 50% discount</div>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">🤖</div>
                    <div class="feature-text">
                        <div class="feature-title">AI-Powered Optimization</div>
                        <div>4 intelligent agents working 24/7 to optimize your GTM strategy</div>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <div class="feature-text">
                        <div class="feature-title">YC Benchmarks</div>
                        <div>Compare against 3,000+ YC companies and industry leaders</div>
                    </div>
                </div>
            </div>
            
            <p><strong>What's next?</strong></p>
            <ul style="color: #ccc;">
                <li>We'll send you exclusive updates on our progress</li>
                <li>Early access beta invites (coming soon!)</li>
                <li>Free GTM strategy resources and insights</li>
                <li>Invitation to our private Slack community</li>
            </ul>
            
            <div class="cta">
                <a href="https://startuppath.com/resources" class="cta-button">
                    Get Free GTM Resources
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>STARTUP_PATH</strong> by Karlson LLC</p>
            <p>Transforming GTM strategies with intelligent automation</p>
            <p style="margin-top: 15px; font-size: 12px;">
                You're receiving this because you signed up for STARTUP_PATH waitlist.
            </p>
        </div>
    </div>
</body>
</html>`

  const text = `
🚀 WELCOME TO STARTUP_PATH!

Hi ${data.name || 'there'}!

Thanks for joining the STARTUP_PATH revolution! You're now part of an exclusive group of forward-thinking ${typeLabel}s who are ready to transform their GTM strategy with AI.

500+ startups already in line

What you can expect:
🎯 Early Access - Be among the first to access STARTUP_PATH when we launch in Q1 2025
💰 Special Pricing - Exclusive early-bird pricing with up to 50% discount  
🤖 AI-Powered Optimization - 4 intelligent agents working 24/7 to optimize your GTM strategy
📊 YC Benchmarks - Compare against 3,000+ YC companies and industry leaders

What's next?
- We'll send you exclusive updates on our progress
- Early access beta invites (coming soon!)
- Free GTM strategy resources and insights
- Invitation to our private Slack community

Get free GTM resources: https://startuppath.com/resources

STARTUP_PATH by Karlson LLC
Transforming GTM strategies with intelligent automation

You're receiving this because you signed up for STARTUP_PATH waitlist.
`

  return { subject, html, text }
}