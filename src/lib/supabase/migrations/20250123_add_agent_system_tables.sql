-- Agent System Tables for STARTUP_PATH Platform
-- Migration: Add agent persistence, execution tracking, and artifact storage
-- Author: Claude Code Assistant
-- Date: 2025-01-23

-- =============================================================================
-- Agent Status Table - Tracks current state of each agent
-- =============================================================================
CREATE TABLE SPATH_agents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL REFERENCES SPATH_projects(id) ON DELETE CASCADE,
  agent_key TEXT NOT NULL CHECK (agent_key IN (
    'channel_discovery_engine',
    'campaign_optimization_engine', 
    'performance_analytics_engine',
    'budget_allocation_engine'
  )),
  
  -- Current Status
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'working', 'blocked', 'done')),
  status_line TEXT NOT NULL DEFAULT 'Ready',
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  
  -- Configuration
  is_active BOOLEAN NOT NULL DEFAULT true,
  configuration JSONB DEFAULT '{}',
  capabilities JSONB NOT NULL DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for agent queries
CREATE INDEX idx_spath_agents_project_id ON SPATH_agents(project_id);
CREATE INDEX idx_spath_agents_status ON SPATH_agents(status);
CREATE UNIQUE INDEX idx_spath_agents_project_agent ON SPATH_agents(project_id, agent_key);

-- =============================================================================
-- Agent Executions Table - Tracks individual agent runs
-- =============================================================================
CREATE TABLE SPATH_agent_executions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  agent_id TEXT NOT NULL REFERENCES SPATH_agents(id) ON DELETE CASCADE,
  agent_key TEXT NOT NULL,
  
  -- Execution Details
  trigger_type TEXT NOT NULL DEFAULT 'manual' CHECK (trigger_type IN (
    'manual', 'scheduled', 'rule_triggered', 'webhook', 'api_call'
  )),
  trigger_data JSONB DEFAULT '{}',
  input_parameters JSONB DEFAULT '{}',
  
  -- Timing
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  duration_ms INTEGER,
  timeout_ms INTEGER DEFAULT 120000,
  
  -- Results
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN (
    'queued', 'running', 'completed', 'failed', 'timeout', 'cancelled'
  )),
  artifacts_created TEXT[] DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  
  -- Performance Metrics
  performance_metrics JSONB DEFAULT '{
    "cpu_time_ms": 0,
    "memory_usage_mb": 0,
    "api_calls_made": 0,
    "data_points_processed": 0
  }',
  
  -- Error Handling
  errors JSONB DEFAULT '[]',
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for execution queries
CREATE INDEX idx_spath_executions_agent_id ON SPATH_agent_executions(agent_id);
CREATE INDEX idx_spath_executions_status ON SPATH_agent_executions(status);
CREATE INDEX idx_spath_executions_start_time ON SPATH_agent_executions(start_time DESC);
CREATE INDEX idx_spath_executions_agent_key ON SPATH_agent_executions(agent_key);

-- =============================================================================
-- Artifacts Table - Stores agent outputs and generated content
-- =============================================================================
CREATE TABLE SPATH_artifacts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  agent_key TEXT NOT NULL,
  execution_id TEXT REFERENCES SPATH_agent_executions(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES SPATH_projects(id) ON DELETE CASCADE,
  
  -- Artifact Classification
  type TEXT NOT NULL CHECK (type IN (
    'benchmark', 'copy', 'calc', 'report', 'insight', 
    'recommendation', 'analysis', 'optimization'
  )),
  title TEXT NOT NULL,
  
  -- Content Storage
  content JSONB NOT NULL DEFAULT '{}',
  
  -- Metadata
  metadata JSONB DEFAULT '{
    "agent_version": "1.0.0",
    "confidence_score": 0.8,
    "data_sources": [],
    "dependencies": [],
    "tags": []
  }',
  
  -- Versioning
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  parent_artifact_id TEXT,
  
  -- Lifecycle
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Indexes for artifact queries  
CREATE INDEX idx_spath_artifacts_project_id ON SPATH_artifacts(project_id);
CREATE INDEX idx_spath_artifacts_agent_key ON SPATH_artifacts(agent_key);
CREATE INDEX idx_spath_artifacts_type ON SPATH_artifacts(type);
CREATE INDEX idx_spath_artifacts_execution_id ON SPATH_artifacts(execution_id);
CREATE INDEX idx_spath_artifacts_created_at ON SPATH_artifacts(created_at DESC);
CREATE INDEX idx_spath_artifacts_active ON SPATH_artifacts(is_active) WHERE is_active = true;

-- =============================================================================
-- Agent Configurations Table - Store agent-specific settings
-- =============================================================================
CREATE TABLE SPATH_agent_configurations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL REFERENCES SPATH_projects(id) ON DELETE CASCADE,
  agent_key TEXT NOT NULL,
  
  -- Configuration
  name TEXT NOT NULL,
  description TEXT,
  configuration JSONB NOT NULL DEFAULT '{}',
  
  -- Scheduling
  schedule_enabled BOOLEAN DEFAULT false,
  schedule_cron TEXT,
  schedule_timezone TEXT DEFAULT 'UTC',
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- Indexes for configurations
CREATE INDEX idx_spath_agent_configs_project_id ON SPATH_agent_configurations(project_id);
CREATE INDEX idx_spath_agent_configs_agent_key ON SPATH_agent_configurations(agent_key);
CREATE INDEX idx_spath_agent_configs_active ON SPATH_agent_configurations(is_active) WHERE is_active = true;
CREATE UNIQUE INDEX idx_spath_agent_configs_unique ON SPATH_agent_configurations(project_id, agent_key, name);

-- =============================================================================
-- Triggers for Updated At Timestamps
-- =============================================================================

-- Agents table trigger
CREATE OR REPLACE FUNCTION update_spath_agents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_spath_agents_updated_at
  BEFORE UPDATE ON SPATH_agents
  FOR EACH ROW EXECUTE FUNCTION update_spath_agents_updated_at();

-- Executions table trigger  
CREATE OR REPLACE FUNCTION update_spath_executions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_spath_executions_updated_at
  BEFORE UPDATE ON SPATH_agent_executions
  FOR EACH ROW EXECUTE FUNCTION update_spath_executions_updated_at();

-- Artifacts table trigger
CREATE OR REPLACE FUNCTION update_spath_artifacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_spath_artifacts_updated_at
  BEFORE UPDATE ON SPATH_artifacts
  FOR EACH ROW EXECUTE FUNCTION update_spath_artifacts_updated_at();

-- Configurations table trigger
CREATE OR REPLACE FUNCTION update_spath_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_spath_configs_updated_at
  BEFORE UPDATE ON SPATH_agent_configurations
  FOR EACH ROW EXECUTE FUNCTION update_spath_configs_updated_at();

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================

-- Enable RLS on all agent tables
ALTER TABLE SPATH_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE SPATH_agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE SPATH_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE SPATH_agent_configurations ENABLE ROW LEVEL SECURITY;

-- Agents table policies
CREATE POLICY "Users can access agents in their organization projects" ON SPATH_agents
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM SPATH_projects p
      JOIN SPATH_users u ON u.org_id = p.org_id
      WHERE u.id = auth.uid()
    )
  );

-- Executions table policies
CREATE POLICY "Users can access executions in their organization projects" ON SPATH_agent_executions  
  FOR ALL USING (
    agent_id IN (
      SELECT a.id FROM SPATH_agents a
      JOIN SPATH_projects p ON p.id = a.project_id
      JOIN SPATH_users u ON u.org_id = p.org_id
      WHERE u.id = auth.uid()
    )
  );

-- Artifacts table policies
CREATE POLICY "Users can access artifacts in their organization projects" ON SPATH_artifacts
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM SPATH_projects p
      JOIN SPATH_users u ON u.org_id = p.org_id
      WHERE u.id = auth.uid()
    )
  );

-- Configurations table policies  
CREATE POLICY "Users can access configurations in their organization projects" ON SPATH_agent_configurations
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM SPATH_projects p
      JOIN SPATH_users u ON u.org_id = p.org_id
      WHERE u.id = auth.uid()
    )
  );

-- =============================================================================
-- Initial Agent Setup Function
-- =============================================================================

-- Function to initialize agents for a new project
CREATE OR REPLACE FUNCTION initialize_project_agents(p_project_id TEXT)
RETURNS VOID AS $$
DECLARE
  agent_keys TEXT[] := ARRAY[
    'channel_discovery_engine',
    'campaign_optimization_engine', 
    'performance_analytics_engine',
    'budget_allocation_engine'
  ];
  agent_key TEXT;
BEGIN
  -- Create default agent records for each agent type
  FOREACH agent_key IN ARRAY agent_keys
  LOOP
    INSERT INTO SPATH_agents (project_id, agent_key, capabilities)
    VALUES (
      p_project_id,
      agent_key,
      CASE agent_key
        WHEN 'channel_discovery_engine' THEN 
          '[{"name": "Channel Discovery", "type": "channel_discovery"}, {"name": "Gate Recommendation", "type": "gate_recommendation"}]'::jsonb
        WHEN 'campaign_optimization_engine' THEN
          '[{"name": "Copy Generation", "type": "copy_generation"}, {"name": "A/B Test Design", "type": "ab_test_design"}]'::jsonb
        WHEN 'performance_analytics_engine' THEN
          '[{"name": "Performance Analysis", "type": "performance_analysis"}, {"name": "Trend Detection", "type": "trend_detection"}]'::jsonb
        WHEN 'budget_allocation_engine' THEN
          '[{"name": "Budget Optimization", "type": "budget_optimization"}, {"name": "Resource Allocation", "type": "resource_allocation"}]'::jsonb
      END
    )
    ON CONFLICT (project_id, agent_key) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Performance and Monitoring Views
-- =============================================================================

-- Agent performance summary view
CREATE VIEW agent_performance_summary AS
SELECT 
  a.project_id,
  a.agent_key,
  a.status,
  a.last_activity,
  COUNT(ae.id) as total_executions,
  COUNT(CASE WHEN ae.status = 'completed' THEN 1 END) as successful_executions,
  COUNT(CASE WHEN ae.status = 'failed' THEN 1 END) as failed_executions,
  AVG(ae.duration_ms) as avg_duration_ms,
  COUNT(ar.id) as artifacts_created,
  MAX(ae.start_time) as last_execution
FROM SPATH_agents a
LEFT JOIN SPATH_agent_executions ae ON a.id = ae.agent_id
LEFT JOIN SPATH_artifacts ar ON ae.id = ar.execution_id
GROUP BY a.project_id, a.agent_key, a.status, a.last_activity;

-- Recent artifacts view
CREATE VIEW recent_artifacts AS
SELECT 
  ar.id,
  ar.agent_key,
  ar.type,
  ar.title,
  ar.project_id,
  ar.created_at,
  ae.status as execution_status,
  ae.duration_ms
FROM SPATH_artifacts ar
LEFT JOIN SPATH_agent_executions ae ON ar.execution_id = ae.id
WHERE ar.created_at > NOW() - INTERVAL '30 days'
ORDER BY ar.created_at DESC;

-- Comment: Tables created successfully with comprehensive agent system support
-- Includes full lifecycle tracking, performance monitoring, and security policies