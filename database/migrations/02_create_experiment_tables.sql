-- =====================================================================================
-- STARTUP_PATH Platform - Experiment Tables Migration
-- Database: KSON_DB (Supabase)
-- Prefix: SPATH_ (all tables)
-- Purpose: GTM Experiments, Channels, Gates, Results - Core simulation data
-- =====================================================================================

-- =====================================================================================
-- TABLE: SPATH_experiments
-- Purpose: GTM experiments within projects
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    project_id UUID NOT NULL REFERENCES SPATH_projects(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed', 'failed')),
    start_date DATE,
    end_date DATE,
    budget_total DECIMAL(10,2),
    budget_daily DECIMAL(10,2),
    icp JSONB DEFAULT '{}', -- Ideal Customer Profile
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_experiments_project_id ON SPATH_experiments(project_id);
CREATE INDEX IF NOT EXISTS idx_spath_experiments_status ON SPATH_experiments(status);
CREATE INDEX IF NOT EXISTS idx_spath_experiments_start_date ON SPATH_experiments(start_date);
CREATE INDEX IF NOT EXISTS idx_spath_experiments_end_date ON SPATH_experiments(end_date);

-- =====================================================================================
-- TABLE: SPATH_channels
-- Purpose: Distribution channels for experiments
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES SPATH_experiments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'paid_search', 'paid_social', 'display', 'video', 'email', 
        'content', 'seo', 'affiliate', 'referral', 'direct',
        'linkedin_inmail', 'webinar', 'events', 'partnership'
    )),
    budget_allocated DECIMAL(10,2) DEFAULT 0,
    budget_spent DECIMAL(10,2) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'stopped')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_channels_experiment_id ON SPATH_channels(experiment_id);
CREATE INDEX IF NOT EXISTS idx_spath_channels_type ON SPATH_channels(type);
CREATE INDEX IF NOT EXISTS idx_spath_channels_status ON SPATH_channels(status);

-- =====================================================================================
-- TABLE: SPATH_gates
-- Purpose: Pass/fail criteria for experiments
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_gates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES SPATH_experiments(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES SPATH_channels(id) ON DELETE CASCADE, -- NULL = experiment-level gate
    name TEXT NOT NULL,
    metric TEXT NOT NULL CHECK (metric IN (
        'cpl', 'cpqm', 'cac', 'roas', 'payback_months', 'conversion_rate',
        'cost_per_click', 'click_through_rate', 'lead_to_meeting_rate',
        'meeting_to_opp_rate', 'opp_to_win_rate', 'avg_deal_size'
    )),
    operator TEXT NOT NULL CHECK (operator IN ('>', '<', '>=', '<=', '=')),
    threshold_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2),
    status TEXT NOT NULL DEFAULT 'monitoring' CHECK (status IN ('monitoring', 'passed', 'failed', 'warning')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_gates_experiment_id ON SPATH_gates(experiment_id);
CREATE INDEX IF NOT EXISTS idx_spath_gates_channel_id ON SPATH_gates(channel_id);
CREATE INDEX IF NOT EXISTS idx_spath_gates_metric ON SPATH_gates(metric);
CREATE INDEX IF NOT EXISTS idx_spath_gates_status ON SPATH_gates(status);

-- =====================================================================================
-- TABLE: SPATH_results
-- Purpose: Daily metrics and outcomes for experiments
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES SPATH_experiments(id) ON DELETE CASCADE,
    channel_id UUID NOT NULL REFERENCES SPATH_channels(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Traffic Metrics
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0,
    
    -- Funnel Metrics
    leads INTEGER DEFAULT 0,
    meetings INTEGER DEFAULT 0,
    opportunities INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    
    -- Calculated Metrics
    click_through_rate DECIMAL(5,4), -- CTR
    cost_per_click DECIMAL(10,2), -- CPC
    cost_per_lead DECIMAL(10,2), -- CPL
    cost_per_qualified_meeting DECIMAL(10,2), -- CPQM
    customer_acquisition_cost DECIMAL(10,2), -- CAC
    
    -- Conversion Rates
    lead_to_meeting_rate DECIMAL(5,4),
    meeting_to_opp_rate DECIMAL(5,4),
    opp_to_win_rate DECIMAL(5,4),
    
    -- Revenue Metrics
    revenue DECIMAL(10,2) DEFAULT 0,
    avg_deal_size DECIMAL(10,2),
    
    -- Additional data
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per experiment+channel+date
    UNIQUE(experiment_id, channel_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_results_experiment_id ON SPATH_results(experiment_id);
CREATE INDEX IF NOT EXISTS idx_spath_results_channel_id ON SPATH_results(channel_id);
CREATE INDEX IF NOT EXISTS idx_spath_results_date ON SPATH_results(date);
CREATE INDEX IF NOT EXISTS idx_spath_results_experiment_date ON SPATH_results(experiment_id, date);

-- =====================================================================================
-- TABLE: SPATH_agents
-- Purpose: AI agents working on experiments
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES SPATH_projects(id) ON DELETE CASCADE,
    agent_key TEXT NOT NULL CHECK (agent_key IN ('channel_scout', 'offer_alchemist', 'signal_wrangler', 'budget_captain')),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'working', 'blocked', 'done')),
    current_task TEXT,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    settings JSONB DEFAULT '{}',
    last_activity TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one agent of each type per project
    UNIQUE(project_id, agent_key)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_agents_project_id ON SPATH_agents(project_id);
CREATE INDEX IF NOT EXISTS idx_spath_agents_agent_key ON SPATH_agents(agent_key);
CREATE INDEX IF NOT EXISTS idx_spath_agents_status ON SPATH_agents(status);

-- =====================================================================================
-- TRIGGERS: Auto-update timestamps
-- =====================================================================================

CREATE TRIGGER update_spath_experiments_updated_at 
    BEFORE UPDATE ON SPATH_experiments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spath_channels_updated_at 
    BEFORE UPDATE ON SPATH_channels 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spath_gates_updated_at 
    BEFORE UPDATE ON SPATH_gates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spath_agents_updated_at 
    BEFORE UPDATE ON SPATH_agents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- COMMENTS: Table documentation
-- =====================================================================================

COMMENT ON TABLE SPATH_experiments IS 'GTM experiments with budget, timeline, and ICP configuration';
COMMENT ON TABLE SPATH_channels IS 'Distribution channels used in experiments (Google Ads, LinkedIn, etc.)';
COMMENT ON TABLE SPATH_gates IS 'Pass/fail criteria and thresholds for experiment success metrics';
COMMENT ON TABLE SPATH_results IS 'Daily performance metrics and outcomes for each channel';
COMMENT ON TABLE SPATH_agents IS 'AI agents working on experiments (Channel Scout, Budget Captain, etc.)';

COMMENT ON COLUMN SPATH_experiments.icp IS 'Ideal Customer Profile: persona, company size, geography';
COMMENT ON COLUMN SPATH_channels.type IS 'Channel type: paid_search, paid_social, content, etc.';
COMMENT ON COLUMN SPATH_gates.metric IS 'Metric being monitored: cpl, cpqm, cac, conversion rates';
COMMENT ON COLUMN SPATH_results.metadata IS 'Additional metrics and context data';

-- =====================================================================================
-- VALIDATION: Verify table creation
-- =====================================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_experiments') THEN
        RAISE EXCEPTION 'Table SPATH_experiments was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_channels') THEN
        RAISE EXCEPTION 'Table SPATH_channels was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_gates') THEN
        RAISE EXCEPTION 'Table SPATH_gates was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_results') THEN
        RAISE EXCEPTION 'Table SPATH_results was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_agents') THEN
        RAISE EXCEPTION 'Table SPATH_agents was not created';
    END IF;
    
    RAISE NOTICE 'SUCCESS: Experiment tables (experiments, channels, gates, results, agents) created successfully';
END $$;