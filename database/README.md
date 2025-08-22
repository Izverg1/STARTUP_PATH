# STARTUP_PATH Database Migrations

This directory contains all database migrations for the STARTUP_PATH platform using Supabase PostgreSQL with SPATH_ table prefix.

## Migration Files

1. **01_create_core_tables.sql** - Core foundation tables
   - `SPATH_organizations` - Multi-tenant organizations
   - `SPATH_users` - User accounts and roles
   - `SPATH_projects` - Project workspaces

2. **02_create_experiment_tables.sql** - GTM experiment system
   - `SPATH_experiments` - GTM experiments
   - `SPATH_channels` - Distribution channels
   - `SPATH_gates` - Pass/fail thresholds
   - `SPATH_results` - Daily metrics
   - `SPATH_agents` - AI agent configurations

3. **03_create_collaboration_tables.sql** - Team collaboration
   - `SPATH_spaces` - Collaboration spaces
   - `SPATH_threads` - Discussion threads
   - `SPATH_comments` - Comments and replies
   - `SPATH_decisions` - Decision log
   - `SPATH_artifacts` - AI agent outputs
   - `SPATH_fact_sheets` - Automated reports

4. **04_create_simulation_tables.sql** - Simulation engine
   - `SPATH_scenarios` - Scenario configurations
   - `SPATH_simulation_runs` - Simulation executions
   - `SPATH_daily_outcomes` - Generated daily metrics
   - `SPATH_what_if_parameters` - What-if parameters

5. **05_create_benchmark_tables.sql** - Industry benchmarks
   - `SPATH_benchmarks` - Industry benchmark ranges
   - `SPATH_seasonality` - Seasonal multipliers
   - `SPATH_benchmark_targets` - Organization targets
   - `SPATH_metric_history` - Historical tracking

6. **06_setup_rls_policies.sql** - Multi-tenant security
   - Row Level Security policies for all tables
   - Organization-scoped data isolation
   - Role-based permissions (viewer < contributor < admin < owner)

7. **07_seed_startup_path_data.sql** - Load startup_path_demo data
   - 3 realistic B2B SaaS scenarios
   - Industry benchmarks from benchmarks.json
   - Seasonality multipliers
   - Demo organization and project

## Execution Order

**IMPORTANT**: Execute migrations in exact order (01-07) as they have dependencies.

## Features

- **Multi-tenant**: Complete data isolation between organizations
- **Realistic Data**: startup_path_demo scenarios with proper B2B SaaS economics
- **Security**: Row Level Security with role-based permissions
- **Performance**: Proper indexing and query optimization
- **Validation**: Built-in data validation and error checking

## Schema Overview

All tables use:
- `SPATH_` prefix for organization
- UUID primary keys with `uuid_generate_v4()`
- Auto-updating timestamps with triggers
- Proper foreign key constraints
- Comprehensive indexing

## Demo Data

After migration, the platform includes:
- **STARTUP_PATH Demo Corp** organization
- **GTM Optimization Lab** demo project
- 3 scenarios: finops_midmarket, devtools_plg, services_midmarket
- 15+ industry benchmarks
- 12+ seasonality multipliers

Ready for realistic GTM simulations!