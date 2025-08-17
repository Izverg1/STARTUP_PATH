# SOL:GEN for startups™

**A simulated MVP platform for Go-To-Market (GTM) testing and experimentation**

© Karlson LLC. All rights reserved.

## 🚀 Overview

SOL:GEN for startups™ helps startups validate distribution channels, optimize CAC payback, and make data-driven GTM decisions through intelligent simulation and real-time analytics.

## ✨ Features

### Core Platform
- **🤖 Agent System**: Four intelligent agents (Channel Scout, Offer Alchemist, Signal Wrangler, Budget Captain)
- **🧪 Simulation Labs**: Thompson Sampling allocator with deterministic seeding
- **📊 Effectiveness Dashboard**: CPQM, CAC, Payback metrics with visual gauges
- **📝 Business Rules**: Plain-English to JSON rule builder with versioning
- **👥 Collaboration**: Spaces, threads, decision logs with approval workflows
- **🎯 Experiment Designer**: Channel selection with pre-filled benchmarks
- **💬 AI Assistant**: LLM-powered GTM advisor with fact sheet generation
- **🎮 Demo Mode**: Fully simulated with 14 days of realistic data

### Technical Stack
- **Framework**: Next.js 15 with TypeScript
- **UI**: Tailwind CSS v4 + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for production)

### Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd "STARTUP SIM"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials (optional for demo mode).

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🎯 Quick Start

### Demo Mode (No Setup Required)

1. Start the app: `npm run dev`
2. Navigate to the Admin section
3. Enable "Demo Mode" toggle
4. Explore with pre-seeded data

### Production Setup

1. Create a Supabase project
2. Run migrations from `src/lib/supabase/migrations.sql`
3. Update `.env.local` with your credentials
4. Deploy to Vercel or your preferred host

## 📁 Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── dashboard/         # Main app sections
│   ├── onboarding/        # User onboarding
│   └── auth/              # Authentication
├── components/            # React components
│   ├── agents/           # Agent system
│   ├── dashboard/        # Dashboard widgets
│   ├── experiments/      # Experiment tools
│   └── three/            # 3D visualizations
├── lib/                  # Core utilities
│   ├── supabase/        # Database client
│   ├── simulation/      # Simulation engine
│   └── agents/          # Agent logic
└── types/               # TypeScript definitions
```

## 🔧 Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript validation
```

### Key Components

- **Agent Dock**: 96px left sidebar with 4 agent cards
- **Main Content**: Fluid 720-1280px responsive area
- **Artifacts Sidebar**: 320px right panel for agent outputs
- **Hero Animation**: Three.js orbital particle system
- **Onboarding Wizard**: 4-step setup in under 3 minutes

## 🎨 Design System

### Theme
- **Dark Mode Default**: Karlson high-contrast theme
- **Accent Color**: Magenta (#ff00aa) for agents
- **Typography**: Inter font family
- **Spacing**: 4/8px grid system
- **Animation**: 90-120ms micro-interactions

### Accessibility
- WCAG 2.1 AA compliant
- 4.5:1 contrast ratios
- Keyboard navigation
- Screen reader support
- Reduced motion support

## 📊 Features in Detail

### Agent System
- **Channel Scout**: Discovers and recommends channels
- **Offer Alchemist**: Generates and optimizes copy
- **Signal Wrangler**: Calculates metrics and detects anomalies
- **Budget Captain**: Optimizes budget allocation

### Simulation Engine
- Thompson Sampling algorithm
- ±10% variance control
- Deterministic seeding for demos
- 14-day performance forecasting

### Business Rules
- Natural language input
- JSON rule generation
- Version control
- Approval workflows
- Real-time execution

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t solgen .
docker run -p 3000:3000 solgen
```

## 📝 License

© Karlson LLC. All rights reserved.

## 🤝 Support

For support, please contact the development team or open an issue.

---

**SOL:GEN for startups™** - Turn GTM experiments into growth engines.