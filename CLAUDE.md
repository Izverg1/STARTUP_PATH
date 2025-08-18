# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**STARTUP_PATH for startups™** - A simulated MVP platform for Go-To-Market (GTM) testing and experimentation. This platform helps startups validate distribution channels, optimize CAC payback, and make data-driven GTM decisions through intelligent simulation and real-time analytics.

© Karlson LLC. All rights reserved.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npm run type-check

# Format code with Prettier
npx prettier --write .
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **State Management**: React Context + Hooks
- **Auth**: Supabase Auth

### Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard sections
│   ├── onboarding/        # Onboarding wizard
│   └── marketing/         # Public pages
├── components/            # React components
│   ├── agents/           # Agent system components
│   ├── artifacts/        # Artifacts sidebar
│   ├── dashboard/        # Dashboard widgets
│   ├── experiments/      # Experiment designer
│   ├── layout/          # Layout components
│   ├── onboarding/      # Onboarding steps
│   ├── rules/           # Business rules builder
│   ├── three/           # Three.js components
│   └── ui/              # shadcn/ui components
├── lib/                  # Utilities and helpers
│   ├── supabase/        # Supabase client
│   ├── db/              # Database queries
│   ├── agents/          # Agent logic
│   ├── analytics/       # Analytics functions
│   └── utils/           # General utilities
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
├── styles/              # Additional styles
└── config/              # Configuration files
```

### Key Features
1. **Agent System**: Four intelligent agents (Channel Scout, Offer Alchemist, Signal Wrangler, Budget Captain)
2. **Simulation Labs**: Thompson Sampling allocator with deterministic seeding
3. **Effectiveness Dashboard**: CPQM, CAC, Payback metrics
4. **Business Rules**: Plain-English to JSON rule builder
5. **Collaboration**: Spaces, threads, decision logs
6. **Assistant**: LLM-powered GTM advisor
7. **Fact Sheet Generator**: Automated reporting

### Design System
- **Theme**: Karlson dark theme (high contrast, magenta accent)
- **Colors**: 
  - Background: #0a0a0a
  - Surface: #151515
  - Text: #fafafa
  - Accent (agents): #ff00aa (magenta)
- **Typography**: Inter font family
- **Spacing**: 4/8px grid system
- **Animation**: 90-120ms micro-interactions

### Database Schema (Supabase)
All tables prefixed with `sg_`:
- `sg_orgs`, `sg_users` - Organization and user management
- `sg_projects` - Workspace projects
- `sg_experiments` - GTM experiments
- `sg_channels` - Distribution channels
- `sg_gates` - Pass/fail thresholds
- `sg_results` - Daily metrics
- `sg_rules` - Business rules
- `sg_decisions` - Decision log
- `sg_benchmarks` - Industry benchmarks
- `sg_agents` - Agent configurations
- `sg_artifacts` - Agent outputs

### Testing Approach
- Unit tests: Jest + React Testing Library
- E2E tests: Playwright
- Component tests: Storybook

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90
- Accessibility: WCAG 2.1 AA compliant

### Security Considerations
- Row-level security in Supabase
- Environment variables for sensitive data
- CSP headers configured
- Input validation with Zod schemas

## Key Technical Decisions

1. **Next.js App Router**: For better performance and React Server Components
2. **Tailwind v4**: Latest CSS features with better performance
3. **shadcn/ui**: Accessible, customizable components
4. **Supabase**: Real-time subscriptions and built-in auth
5. **Three.js**: Lightweight 3D graphics for hero animations
6. **Framer Motion**: Smooth, accessible animations

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEMO_MODE=true|false
```

## Deployment

The application is designed to be deployed on Vercel with Supabase as the backend.

## Important Notes

- Always maintain dark theme as default
- Magenta accent (#ff00aa) is reserved for agent-related UI only
- Respect prefers-reduced-motion for accessibility
- Keep micro-animations under 120ms
- Ensure 4.5:1 contrast ratio minimum
- after you are done with a task, always show the link to the site
- The platform is now called STARTUP_PATH (renamed from SOL:GEN)