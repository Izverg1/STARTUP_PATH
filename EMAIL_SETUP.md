# 📧 Email Notification Setup Guide

## Overview

The STARTUP_PATH platform now includes a production-ready email notification system that sends notifications when users sign up for the waitlist. Here's how to configure it:

## 🔧 Email Service Options

### Option 1: Gmail (Recommended)
```bash
# Add to .env.local
ADMIN_EMAIL=your-email@gmail.com
GMAIL_USER=your-gmail@gmail.com  
GMAIL_APP_PASSWORD=your-app-password
```

**Setup Steps:**
1. Go to [Google Account settings](https://myaccount.google.com/)
2. Enable 2-factor authentication
3. Go to Security → 2-Step Verification → App passwords
4. Generate an app password for "Mail"
5. Use this password in `GMAIL_APP_PASSWORD`

### Option 2: SMTP Server
```bash
# Add to .env.local
ADMIN_EMAIL=your-email@domain.com
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
```

### Option 3: SendGrid
```bash
# Add to .env.local
ADMIN_EMAIL=your-email@domain.com
SENDGRID_API_KEY=your-sendgrid-api-key
```

## 📬 What Gets Sent

### Admin Notifications
You receive a detailed email every time someone signs up with:
- Contact information (email, name, company, position)
- Signup type (customer vs partner)
- Additional details (budget, partnership type, industry)
- Technical data (IP, referrer, user agent)
- Timestamp and priority

### User Welcome Email  
Users receive a professional welcome email with:
- Branded STARTUP_PATH design
- Waitlist confirmation
- What to expect next
- Early access benefits
- Link to free resources

## 🧪 Testing

### Test Email Configuration
```bash
curl http://localhost:1010/api/test-email
```

### Send Test Admin Notification
```bash
curl -X POST http://localhost:1010/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"type": "admin"}'
```

### Send Test Welcome Email
```bash
curl -X POST http://localhost:1010/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"type": "welcome"}'
```

## 🚀 Production Deployment

1. **Set Production Email Variables**
   ```bash
   # Set your actual email
   ADMIN_EMAIL=your-real-email@gmail.com
   
   # Configure email service (Gmail example)
   GMAIL_USER=your-real-gmail@gmail.com
   GMAIL_APP_PASSWORD=your-real-app-password
   ```

2. **Remove Test Endpoint** (Optional)
   The test endpoint (`/api/test-email`) automatically disables in production

3. **Verify Functionality**
   Test the signup flow on your production site to ensure emails are delivered

## 🔒 Security Notes

- App passwords are more secure than regular passwords
- Never commit email credentials to version control
- Use environment variables for all sensitive data
- Consider rate limiting for email endpoints in high-traffic scenarios

## 🛠 Troubleshooting

### Email Not Sending
1. Check server logs for error messages
2. Verify environment variables are set correctly
3. Test email service connection with `/api/test-email`
4. Check spam folders

### Gmail Issues
- Ensure 2FA is enabled
- Use app password, not regular password
- Check Google Account security settings

### SMTP Issues  
- Verify host, port, and security settings
- Check firewall/network restrictions
- Test with email client first

## 📊 Features Included

✅ **Production-Ready**: Robust error handling, non-blocking email sends
✅ **Multi-Provider**: Gmail, SMTP, SendGrid support  
✅ **Professional Templates**: HTML + text versions with branding
✅ **Comprehensive Data**: All signup info included in notifications
✅ **User Experience**: Welcome emails with clear next steps
✅ **Development Tools**: Test endpoints for easy debugging
✅ **Security**: App passwords, environment-based config

The email notification system is now live and ready for production use!