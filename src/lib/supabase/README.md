# Supabase Configuration for SOL:GEN

This directory contains all Supabase-related configuration and utilities for the SOL:GEN platform.

## Setup Instructions

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep secret!)

### 2. Database Setup

1. Create a new Supabase project at [app.supabase.com](https://app.supabase.com)
2. Run the migration SQL in the Supabase SQL editor:

```sql
-- Copy and paste the contents of migrations.sql
```

3. Enable Row Level Security (RLS) on all tables (this is done automatically in the migration)

### 3. Generate Types (Optional)

To regenerate TypeScript types from your database schema:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/lib/supabase/types.ts
```

## File Overview

### Core Files

- **`client.ts`** - Supabase client configuration for browser, server, and middleware
- **`types.ts`** - TypeScript types generated from database schema
- **`migrations.sql`** - Complete database schema with all tables and RLS policies
- **`middleware.ts`** - Authentication middleware for Next.js
- **`index.ts`** - Main export file with all utilities

### Database Utilities

- **`../db/queries.ts`** - Type-safe database query functions
- **`seed.ts`** - Database seeding utilities for demo data

## Usage Examples

### Basic Client Usage

```typescript
import { createClient } from '@/lib/supabase'

// Client component
const supabase = createClient()

// Server component
const supabase = await createServerSupabaseClient()
```

### Authentication

```typescript
import { getUser, getSession } from '@/lib/supabase'

// In server components
const user = await getUser()
const session = await getSession()
```

### Database Queries

```typescript
import { getOrganizationProjects, createExperiment } from '@/lib/supabase'

// Get projects
const projects = await getOrganizationProjects('org-id')

// Create experiment
const experiment = await createExperiment({
  name: 'My Experiment',
  project_id: 'project-id',
  // ... other fields
})
```

### Demo Data Seeding

```typescript
import { databaseSeeder } from '@/lib/supabase'

// Seed complete demo environment
await databaseSeeder.seedCompleteDemo({
  email: 'user@example.com',
  name: 'Demo User',
  userId: 'user-id'
})
```

## Database Schema Overview

### Core Tables (with sg_ prefix)

- **`sg_orgs`** - Organizations
- **`sg_users`** - Users with role-based access
- **`sg_projects`** - Projects (simulation or connected mode)
- **`sg_experiments`** - GTM experiments
- **`sg_channels`** - Marketing channels (Google, LinkedIn, etc.)
- **`sg_gates`** - Pass/fail criteria for channels
- **`sg_results`** - Daily performance metrics
- **`sg_decisions`** - Scale/iterate/kill decisions

### Agent System Tables

- **`sg_agents`** - Agent definitions (Scout, Alchemist, etc.)
- **`sg_agent_state`** - Current state of agents per project
- **`sg_artifacts`** - Agent outputs (benchmarks, copy, calculations)

### Collaboration Tables

- **`sg_spaces`** - Collaboration spaces
- **`sg_threads`** - Discussion threads
- **`sg_comments`** - Thread comments
- **`sg_rulesets`** - Business rule sets
- **`sg_rules`** - Individual business rules

### Reference Tables

- **`sg_benchmarks`** - Industry benchmark data
- **`sg_fact_sheets`** - Generated reports

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only access data within their organization
- Appropriate role-based permissions (owner, contributor, viewer)
- System operations can bypass RLS using service role

### Authentication Flow

1. User signs in via Supabase Auth
2. Middleware refreshes session on each request
3. RLS policies enforce data access based on user's organization
4. Protected routes redirect to login if unauthenticated

## Performance Considerations

### Indexes

The migration includes optimized indexes for:
- User and organization lookups
- Project and experiment queries
- Time-series result data
- Agent and artifact retrieval

### Caching Strategy

- Use React Query or SWR for client-side caching
- Server-side queries are optimized for minimal database hits
- Real-time subscriptions for live updates (agent states, results)

## Development Tips

### Demo Mode

The platform supports demo mode with simulated data:

```typescript
// Check if in demo mode
const isDemoMode = process.env.NEXT_PUBLIC_DEMO === 'true'

// Generate demo results with variance
const variance = process.env.NEXT_PUBLIC_DEMO_VARIANCE_PERCENT || 10
```

### Error Handling

```typescript
import { handleDatabaseError } from '@/lib/supabase'

try {
  // Database operation
} catch (error) {
  handleDatabaseError(error, 'operation_name')
}
```

### Type Safety

All database operations are fully typed:

```typescript
import type { Organization, Experiment, TablesInsert } from '@/lib/supabase'

const orgData: TablesInsert<'sg_orgs'> = {
  name: 'My Org',
  slug: 'my-org'
}
```

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Ensure user is authenticated and in correct organization
2. **Type Mismatches**: Regenerate types after schema changes
3. **Migration Errors**: Check for existing tables or naming conflicts

### Debug Mode

Enable debug logging:

```bash
DEBUG=true npm run dev
```

### Supabase Logs

Monitor your Supabase dashboard for:
- Authentication issues
- RLS policy violations
- Performance bottlenecks
- API usage patterns

## Migration Guide

When updating the database schema:

1. Create migration SQL file
2. Test in development environment
3. Update TypeScript types
4. Update RLS policies if needed
5. Deploy to production with proper backup

## Contributing

When adding new database features:

1. Update `migrations.sql` with schema changes
2. Regenerate types with `supabase gen types`
3. Add query functions to `queries.ts`
4. Update RLS policies if needed
5. Add seed data for demo mode
6. Update this README with examples