Local SMTP for status emails (Mailpit + Nodemailer)

What’s included
- Nodemailer utility: src/lib/email/mailer.ts (reads SMTP_* env vars; sane dev defaults)
- API endpoint: POST /api/status/notify (secured via x-status-secret)
- Mailpit docker compose: docker-compose.mailpit.yml (SMTP on 1025, UI on 8025)
- Scripts: npm run mail:up, mail:down, status:send

Quick start (dev)
1) Start local SMTP and UI
   - Requires Docker
   - npm run mail:up
   - Open http://localhost:8025 to view messages

2) Set env vars (optional for dev)
   - Defaults used if not set:
     - SMTP_HOST=127.0.0.1
     - SMTP_PORT=1025
     - SMTP_SECURE=false
     - MAIL_FROM=status@local.test
     - MAIL_TO=your@email
   - Set APP_STATUS_SECRET to secure the endpoint, e.g.:
     - macOS/Linux: echo 'APP_STATUS_SECRET=dev-secret' >> .env.local

3) Run the app and send a test
   - npm run dev
   - In another terminal: export APP_STATUS_SECRET=dev-secret && npm run status:send
   - Check http://localhost:8025 for the delivered message

Manual curl example
curl -X POST http://localhost:1010/api/status/notify \
  -H 'x-status-secret: dev-secret' \
  -H 'Content-Type: application/json' \
  -d '{"subject":"Status","text":"Hello from Startup_Path"}'

Production notes
- Configure real SMTP (e.g., SES, SendGrid, Mailgun) by setting SMTP_* and MAIL_FROM/MAIL_TO in your hosting env.
- Keep APP_STATUS_SECRET secret; rotate periodically.

