-- SOL:GEN for Startups Database Schema
-- All tables prefixed with 'sg_' as per specification
-- Includes Row Level Security (RLS) policies for multi-tenant architecture

-- =============================================================================
-- Extensions
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- Custom Types and Enums
-- =============================================================================

-- User roles
CREATE TYPE user_role AS ENUM ('owner', 'contributor', 'viewer');

-- Subscription tiers
CREATE TYPE subscription_tier AS ENUM ('demo', 'starter', 'growth', 'enterprise');

-- Project status and mode
CREATE TYPE project_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');
CREATE TYPE project_mode AS ENUM ('simulation', 'connected');

-- Sales motion types
CREATE TYPE sales_motion AS ENUM ('plg', 'sales_led', 'services');

-- Company size categories
CREATE TYPE company_size AS ENUM ('startup', 'smb', 'mid_market', 'enterprise');

-- Geographic regions
CREATE TYPE geographic_region AS ENUM ('north_america', 'europe', 'asia_pacific', 'latin_america', 'global');

-- Channel types
CREATE TYPE channel_type AS ENUM (
  'google_search',
  'linkedin_inmail',
  'webinar',
  'content_marketing',
  'outbound_email',
  'events',
  'partnerships',
  'referrals',
  'social_media',
  'paid_social'
);

-- Experiment status
CREATE TYPE experiment_status AS ENUM ('draft', 'running', 'paused', 'completed', 'killed');

-- Decision types
CREATE TYPE decision_type AS ENUM ('scale', 'iterate', 'kill');

-- Gate operators
CREATE TYPE gate_operator AS ENUM ('gte', 'lte', 'eq', 'between');

-- Gate metrics
CREATE TYPE gate_metric AS ENUM (
  'reply_rate',
  'click_through_rate',
  'conversion_rate',
  'cost_per_lead',
  'cost_per_meeting',
  'meeting_show_rate',
  'opportunity_rate',
  'close_rate',
  'cac_payback_months'
);

-- Agent status
CREATE TYPE agent_status AS ENUM ('idle', 'working', 'blocked', 'done');

-- Artifact types
CREATE TYPE artifact_type AS ENUM ('benchmark', 'copy', 'calc', 'alloc');

-- Notification triggers
CREATE TYPE notification_trigger AS ENUM (
  'experiment_started',
  'experiment_completed',
  'gate_failed',
  'budget_threshold_reached',
  'decision_required',
  'anomaly_detected'
);

-- =============================================================================
-- Core Tables
-- =============================================================================

-- Organizations table
CREATE TABLE sg_orgs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  subscription_tier subscription_tier NOT NULL DEFAULT 'demo',
  owner_id UUID,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users table
CREATE TABLE sg_users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'contributor',
  org_id UUID NOT NULL REFERENCES sg_orgs(id) ON DELETE CASCADE,
  last_login TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE sg_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  org_id UUID NOT NULL REFERENCES sg_orgs(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES sg_users(id) ON DELETE CASCADE,
  status project_status NOT NULL DEFAULT 'draft',
  mode project_mode NOT NULL DEFAULT 'simulation',
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Experiments table
CREATE TABLE sg_experiments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  project_id UUID NOT NULL REFERENCES sg_projects(id) ON DELETE CASCADE,
  status experiment_status NOT NULL DEFAULT 'draft',
  icp JSONB NOT NULL,
  target_cpqm DECIMAL(10,2),
  max_cac_payback_months INTEGER,
  budget_allocated DECIMAL(12,2) NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  hypothesis TEXT,
  success_criteria JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Channels table
CREATE TABLE sg_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID NOT NULL REFERENCES sg_experiments(id) ON DELETE CASCADE,
  type channel_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parameters JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  allocated_budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  current_weight DECIMAL(5,4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Gates table (pass/fail criteria)
CREATE TABLE sg_gates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES sg_channels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  metric gate_metric NOT NULL,
  operator gate_operator NOT NULL,
  threshold_value DECIMAL(10,4) NOT NULL,
  window_days INTEGER NOT NULL DEFAULT 7,
  is_critical BOOLEAN NOT NULL DEFAULT false,
  benchmark_source TEXT,
  benchmark_range JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Results table (daily performance data)
CREATE TABLE sg_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES sg_channels(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  costs JSONB NOT NULL DEFAULT '{}',
  is_simulated BOOLEAN NOT NULL DEFAULT true,
  variance_applied DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(channel_id, date)
);

-- Decisions table
CREATE TABLE sg_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID NOT NULL REFERENCES sg_experiments(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES sg_channels(id) ON DELETE CASCADE,
  type decision_type NOT NULL,
  reason TEXT NOT NULL,
  supporting_data JSONB NOT NULL DEFAULT '{}',
  approver_id UUID NOT NULL REFERENCES sg_users(id),
  implemented_at TIMESTAMPTZ,
  impact_metrics JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Rules and Collaboration Tables
-- =============================================================================

-- Rule sets table
CREATE TABLE sg_rulesets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES sg_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES sg_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual rules table
CREATE TABLE sg_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ruleset_id UUID NOT NULL REFERENCES sg_rulesets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  condition_logic JSONB NOT NULL,
  action_logic JSONB NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Collaboration spaces
CREATE TABLE sg_spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES sg_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES sg_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Discussion threads
CREATE TABLE sg_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES sg_spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES sg_users(id),
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Thread comments
CREATE TABLE sg_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES sg_threads(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES sg_comments(id),
  content TEXT NOT NULL,
  attachments JSONB,
  author_id UUID NOT NULL REFERENCES sg_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Benchmarks and Reference Data
-- =============================================================================

-- Industry benchmarks
CREATE TABLE sg_benchmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric TEXT NOT NULL,
  channel_type channel_type,
  vertical TEXT,
  company_size company_size,
  value_min DECIMAL(10,4),
  value_max DECIMAL(10,4),
  value_median DECIMAL(10,4),
  percentile_25 DECIMAL(10,4),
  percentile_75 DECIMAL(10,4),
  source_url TEXT,
  source_name TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Fact Sheets and Reports
-- =============================================================================

-- Generated fact sheets
CREATE TABLE sg_fact_sheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES sg_projects(id) ON DELETE CASCADE,
  experiment_id UUID REFERENCES sg_experiments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  md_body TEXT NOT NULL,
  pdf_url TEXT,
  citations_json JSONB,
  generated_by UUID REFERENCES sg_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Agent System Tables
-- =============================================================================

-- Agent definitions
CREATE TABLE sg_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agent state tracking
CREATE TABLE sg_agent_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES sg_projects(id) ON DELETE CASCADE,
  agent_key TEXT NOT NULL REFERENCES sg_agents(key),
  status agent_status NOT NULL DEFAULT 'idle',
  status_line TEXT,
  progress_percent INTEGER DEFAULT 0,
  last_activity TIMESTAMPTZ,
  context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, agent_key)
);

-- Agent artifacts/outputs
CREATE TABLE sg_artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES sg_projects(id) ON DELETE CASCADE,
  agent_key TEXT NOT NULL REFERENCES sg_agents(key),
  type artifact_type NOT NULL,
  title TEXT NOT NULL,
  md_body TEXT,
  json_meta JSONB,
  version INTEGER NOT NULL DEFAULT 1,
  is_current BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Indexes for Performance
-- =============================================================================

-- User and organization indexes
CREATE INDEX idx_sg_users_org_id ON sg_users(org_id);
CREATE INDEX idx_sg_users_email ON sg_users(email);
CREATE INDEX idx_sg_orgs_slug ON sg_orgs(slug);

-- Project and experiment indexes
CREATE INDEX idx_sg_projects_org_id ON sg_projects(org_id);
CREATE INDEX idx_sg_projects_owner_id ON sg_projects(owner_id);
CREATE INDEX idx_sg_experiments_project_id ON sg_experiments(project_id);
CREATE INDEX idx_sg_experiments_status ON sg_experiments(status);

-- Channel and results indexes
CREATE INDEX idx_sg_channels_experiment_id ON sg_channels(experiment_id);
CREATE INDEX idx_sg_channels_type ON sg_channels(type);
CREATE INDEX idx_sg_gates_channel_id ON sg_gates(channel_id);
CREATE INDEX idx_sg_results_channel_id ON sg_results(channel_id);
CREATE INDEX idx_sg_results_date ON sg_results(date);
CREATE INDEX idx_sg_results_channel_date ON sg_results(channel_id, date);

-- Decision and collaboration indexes
CREATE INDEX idx_sg_decisions_experiment_id ON sg_decisions(experiment_id);
CREATE INDEX idx_sg_decisions_channel_id ON sg_decisions(channel_id);
CREATE INDEX idx_sg_decisions_type ON sg_decisions(type);
CREATE INDEX idx_sg_spaces_project_id ON sg_spaces(project_id);
CREATE INDEX idx_sg_threads_space_id ON sg_threads(space_id);
CREATE INDEX idx_sg_comments_thread_id ON sg_comments(thread_id);

-- Agent system indexes
CREATE INDEX idx_sg_agent_state_project_id ON sg_agent_state(project_id);
CREATE INDEX idx_sg_agent_state_agent_key ON sg_agent_state(agent_key);
CREATE INDEX idx_sg_artifacts_project_id ON sg_artifacts(project_id);
CREATE INDEX idx_sg_artifacts_agent_key ON sg_artifacts(agent_key);
CREATE INDEX idx_sg_artifacts_type ON sg_artifacts(type);
CREATE INDEX idx_sg_artifacts_created_at ON sg_artifacts(created_at);

-- Benchmark indexes
CREATE INDEX idx_sg_benchmarks_channel_type ON sg_benchmarks(channel_type);
CREATE INDEX idx_sg_benchmarks_metric ON sg_benchmarks(metric);
CREATE INDEX idx_sg_benchmarks_vertical ON sg_benchmarks(vertical);

-- =============================================================================
-- Row Level Security Policies
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE sg_orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_rulesets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_fact_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_agent_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE sg_artifacts ENABLE ROW LEVEL SECURITY;

-- Organization policies
CREATE POLICY "Users can view their own organization" ON sg_orgs
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM sg_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can update their organization" ON sg_orgs
  FOR UPDATE USING (
    owner_id = auth.uid()
  );

-- User policies
CREATE POLICY "Users can view users in their organization" ON sg_users
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM sg_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile" ON sg_users
  FOR UPDATE USING (id = auth.uid());

-- Project policies
CREATE POLICY "Users can view projects in their organization" ON sg_projects
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM sg_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects in their organization" ON sg_projects
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM sg_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Project owners and org owners can update projects" ON sg_projects
  FOR UPDATE USING (
    owner_id = auth.uid() OR
    org_id IN (
      SELECT org_id FROM sg_users 
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- Experiment policies
CREATE POLICY "Users can view experiments in their organization projects" ON sg_experiments
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM sg_projects 
      WHERE org_id IN (
        SELECT org_id FROM sg_users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create experiments in their organization projects" ON sg_experiments
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM sg_projects 
      WHERE org_id IN (
        SELECT org_id FROM sg_users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Contributors can update experiments in their org" ON sg_experiments
  FOR UPDATE USING (
    project_id IN (
      SELECT id FROM sg_projects 
      WHERE org_id IN (
        SELECT org_id FROM sg_users 
        WHERE id = auth.uid() AND role IN ('owner', 'contributor')
      )
    )
  );

-- Channel policies
CREATE POLICY "Users can view channels in their organization experiments" ON sg_channels
  FOR SELECT USING (
    experiment_id IN (
      SELECT id FROM sg_experiments 
      WHERE project_id IN (
        SELECT id FROM sg_projects 
        WHERE org_id IN (
          SELECT org_id FROM sg_users WHERE id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Contributors can manage channels in their org" ON sg_channels
  FOR ALL USING (
    experiment_id IN (
      SELECT id FROM sg_experiments 
      WHERE project_id IN (
        SELECT id FROM sg_projects 
        WHERE org_id IN (
          SELECT org_id FROM sg_users 
          WHERE id = auth.uid() AND role IN ('owner', 'contributor')
        )
      )
    )
  );

-- Gates policies
CREATE POLICY "Users can view gates in their organization channels" ON sg_gates
  FOR SELECT USING (
    channel_id IN (
      SELECT id FROM sg_channels 
      WHERE experiment_id IN (
        SELECT id FROM sg_experiments 
        WHERE project_id IN (
          SELECT id FROM sg_projects 
          WHERE org_id IN (
            SELECT org_id FROM sg_users WHERE id = auth.uid()
          )
        )
      )
    )
  );

CREATE POLICY "Contributors can manage gates in their org" ON sg_gates
  FOR ALL USING (
    channel_id IN (
      SELECT id FROM sg_channels 
      WHERE experiment_id IN (
        SELECT id FROM sg_experiments 
        WHERE project_id IN (
          SELECT id FROM sg_projects 
          WHERE org_id IN (
            SELECT org_id FROM sg_users 
            WHERE id = auth.uid() AND role IN ('owner', 'contributor')
          )
        )
      )
    )
  );

-- Results policies
CREATE POLICY "Users can view results in their organization" ON sg_results
  FOR SELECT USING (
    channel_id IN (
      SELECT id FROM sg_channels 
      WHERE experiment_id IN (
        SELECT id FROM sg_experiments 
        WHERE project_id IN (
          SELECT id FROM sg_projects 
          WHERE org_id IN (
            SELECT org_id FROM sg_users WHERE id = auth.uid()
          )
        )
      )
    )
  );

CREATE POLICY "System can insert results" ON sg_results
  FOR INSERT WITH CHECK (true);

-- Decision policies
CREATE POLICY "Users can view decisions in their organization" ON sg_decisions
  FOR SELECT USING (
    experiment_id IN (
      SELECT id FROM sg_experiments 
      WHERE project_id IN (
        SELECT id FROM sg_projects 
        WHERE org_id IN (
          SELECT org_id FROM sg_users WHERE id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Contributors can create decisions in their org" ON sg_decisions
  FOR INSERT WITH CHECK (
    experiment_id IN (
      SELECT id FROM sg_experiments 
      WHERE project_id IN (
        SELECT id FROM sg_projects 
        WHERE org_id IN (
          SELECT org_id FROM sg_users 
          WHERE id = auth.uid() AND role IN ('owner', 'contributor')
        )
      )
    )
  );

-- Agent system policies
CREATE POLICY "Anyone can view agent definitions" ON sg_agents
  FOR SELECT USING (true);

CREATE POLICY "Users can view agent state in their projects" ON sg_agent_state
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM sg_projects 
      WHERE org_id IN (
        SELECT org_id FROM sg_users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "System can manage agent state" ON sg_agent_state
  FOR ALL USING (true);

CREATE POLICY "Users can view artifacts in their projects" ON sg_artifacts
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM sg_projects 
      WHERE org_id IN (
        SELECT org_id FROM sg_users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "System can create artifacts" ON sg_artifacts
  FOR INSERT WITH CHECK (true);

-- Benchmark policies (public read access)
CREATE POLICY "Anyone can view benchmarks" ON sg_benchmarks
  FOR SELECT USING (true);

-- Fact sheet policies
CREATE POLICY "Users can view fact sheets in their projects" ON sg_fact_sheets
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM sg_projects 
      WHERE org_id IN (
        SELECT org_id FROM sg_users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "System can create fact sheets" ON sg_fact_sheets
  FOR INSERT WITH CHECK (true);

-- =============================================================================
-- Views for Common Queries
-- =============================================================================

-- Finance metrics view
CREATE VIEW v_finance AS
SELECT 
  r.channel_id,
  c.experiment_id,
  r.date,
  c.type as channel_type,
  r.metrics->>'meetings_held' as meetings_held,
  r.costs->>'total_cost' as total_cost,
  CASE 
    WHEN (r.metrics->>'meetings_held')::numeric > 0 
    THEN (r.costs->>'total_cost')::numeric / (r.metrics->>'meetings_held')::numeric
    ELSE 0 
  END as cpqm,
  -- Add more financial calculations as needed
  r.created_at
FROM sg_results r
JOIN sg_channels c ON r.channel_id = c.id
WHERE r.is_simulated = true OR r.is_simulated = false;

-- Allocator weights view
CREATE VIEW v_allocator_weights AS
SELECT 
  c.id as channel_id,
  c.experiment_id,
  c.type as channel_type,
  c.current_weight,
  c.allocated_budget,
  c.updated_at as weight_updated_at,
  -- Join with latest artifacts for rationale
  a.md_body as rationale
FROM sg_channels c
LEFT JOIN sg_artifacts a ON a.project_id IN (
  SELECT project_id FROM sg_experiments WHERE id = c.experiment_id
) AND a.type = 'alloc' AND a.is_current = true;

-- =============================================================================
-- Functions and Triggers
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_sg_orgs_updated_at BEFORE UPDATE ON sg_orgs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_users_updated_at BEFORE UPDATE ON sg_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_projects_updated_at BEFORE UPDATE ON sg_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_experiments_updated_at BEFORE UPDATE ON sg_experiments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_channels_updated_at BEFORE UPDATE ON sg_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_gates_updated_at BEFORE UPDATE ON sg_gates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_results_updated_at BEFORE UPDATE ON sg_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_decisions_updated_at BEFORE UPDATE ON sg_decisions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_rulesets_updated_at BEFORE UPDATE ON sg_rulesets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_rules_updated_at BEFORE UPDATE ON sg_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_spaces_updated_at BEFORE UPDATE ON sg_spaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_threads_updated_at BEFORE UPDATE ON sg_threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_comments_updated_at BEFORE UPDATE ON sg_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_benchmarks_updated_at BEFORE UPDATE ON sg_benchmarks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_fact_sheets_updated_at BEFORE UPDATE ON sg_fact_sheets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_agents_updated_at BEFORE UPDATE ON sg_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sg_agent_state_updated_at BEFORE UPDATE ON sg_agent_state FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- Seed Data for Agents
-- =============================================================================

-- Insert default agents
INSERT INTO sg_agents (key, title, description, icon, config) VALUES
('channel_scout', 'Channel Scout', 'Proposes channels and pre-fills gates from benchmarks', 'compass', '{"micro_animation": "compass_tick", "interval_seconds": 2}'),
('offer_alchemist', 'Offer Alchemist', 'Drafts offers, subject lines, and landing page blocks with A/B copy checks', 'wand', '{"micro_animation": "typing_dots", "interval_seconds": 3}'),
('signal_wrangler', 'Signal Wrangler', 'Computes CPQM, CAC, and Payback metrics; flags anomalies', 'activity', '{"micro_animation": "progress_ring", "interval_seconds": 1}'),
('budget_captain', 'Budget Captain', 'Nightly allocator moves with human-readable rationale', 'trending-up', '{"micro_animation": "sparkline_sweep", "interval_seconds": 5}');

-- =============================================================================
-- Initial Benchmark Data
-- =============================================================================

-- Insert some sample benchmark data
INSERT INTO sg_benchmarks (metric, channel_type, vertical, company_size, value_min, value_max, value_median, percentile_25, percentile_75, source_name) VALUES
('reply_rate', 'linkedin_inmail', 'saas', 'startup', 0.02, 0.08, 0.04, 0.03, 0.06, 'Industry Survey 2024'),
('reply_rate', 'linkedin_inmail', 'saas', 'smb', 0.03, 0.10, 0.05, 0.04, 0.07, 'Industry Survey 2024'),
('reply_rate', 'outbound_email', 'saas', 'startup', 0.05, 0.15, 0.08, 0.06, 0.12, 'Industry Survey 2024'),
('click_through_rate', 'google_search', 'saas', 'startup', 0.02, 0.08, 0.04, 0.03, 0.06, 'Google Ads Benchmarks'),
('conversion_rate', 'webinar', 'saas', 'startup', 0.35, 0.60, 0.45, 0.40, 0.50, 'Webinar Platform Data'),
('cost_per_meeting', 'linkedin_inmail', 'saas', 'startup', 200.00, 500.00, 350.00, 250.00, 400.00, 'Industry Survey 2024'),
('cost_per_meeting', 'google_search', 'saas', 'startup', 150.00, 400.00, 275.00, 200.00, 350.00, 'Google Ads Benchmarks');