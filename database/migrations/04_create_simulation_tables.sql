-- =====================================================================================
-- STARTUP_PATH Platform - Simulation Tables Migration
-- Database: KSON_DB (Supabase)
-- Prefix: SPATH_ (all tables)
-- Purpose: Scenarios, Simulation Runs, Daily Outcomes - startup_path_demo integration
-- =====================================================================================

-- =====================================================================================
-- TABLE: SPATH_scenarios
-- Purpose: Store scenario configurations from startup_path_demo
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_id TEXT UNIQUE NOT NULL, -- From JSON: "finops_midmarket", "devtools_plg", etc.
    title TEXT NOT NULL,
    description TEXT,
    seed INTEGER NOT NULL, -- Deterministic seed for reproducible results
    
    -- ICP Configuration
    icp_persona TEXT NOT NULL,
    icp_company_size TEXT NOT NULL,
    icp_geography TEXT NOT NULL,
    
    -- Economics
    acv DECIMAL(10,2) NOT NULL, -- Annual Contract Value
    gross_margin DECIMAL(4,3) NOT NULL, -- 0.7 = 70%
    mrr_per_customer DECIMAL(10,2) NOT NULL, -- Monthly Recurring Revenue
    
    -- Simulation Configuration
    window_days INTEGER NOT NULL DEFAULT 14,
    channels JSONB NOT NULL, -- Full channel configuration from JSON
    
    -- Metadata
    category TEXT DEFAULT 'demo' CHECK (category IN ('demo', 'template', 'custom')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_scenarios_scenario_id ON SPATH_scenarios(scenario_id);
CREATE INDEX IF NOT EXISTS idx_spath_scenarios_category ON SPATH_scenarios(category);
CREATE INDEX IF NOT EXISTS idx_spath_scenarios_is_active ON SPATH_scenarios(is_active);

-- =====================================================================================
-- TABLE: SPATH_simulation_runs
-- Purpose: Track execution of scenarios
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_simulation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES SPATH_projects(id) ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES SPATH_scenarios(id) ON DELETE CASCADE,
    run_name TEXT NOT NULL,
    
    -- Run Configuration
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    seed_override INTEGER, -- Optional seed override for this run
    parameters JSONB DEFAULT '{}', -- What-if parameters applied
    
    -- Run State
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    error_message TEXT,
    
    -- Results Summary
    total_spend DECIMAL(10,2),
    total_leads INTEGER,
    total_meetings INTEGER,
    total_opportunities INTEGER,
    total_wins INTEGER,
    calculated_cac DECIMAL(10,2),
    calculated_cpqm DECIMAL(10,2),
    payback_months DECIMAL(4,2),
    
    -- Execution Metadata
    execution_time_ms INTEGER,
    data_points_generated INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_simulation_runs_project_id ON SPATH_simulation_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_spath_simulation_runs_scenario_id ON SPATH_simulation_runs(scenario_id);
CREATE INDEX IF NOT EXISTS idx_spath_simulation_runs_status ON SPATH_simulation_runs(status);
CREATE INDEX IF NOT EXISTS idx_spath_simulation_runs_start_date ON SPATH_simulation_runs(start_date);

-- =====================================================================================
-- TABLE: SPATH_daily_outcomes
-- Purpose: Generated daily metrics from simulation runs
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_daily_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_run_id UUID NOT NULL REFERENCES SPATH_simulation_runs(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    channel_name TEXT NOT NULL,
    channel_type TEXT NOT NULL,
    
    -- Daily Metrics (from scenario simulation)
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0,
    leads INTEGER DEFAULT 0,
    meetings INTEGER DEFAULT 0,
    opportunities INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    
    -- Calculated Daily Metrics
    ctr DECIMAL(6,5), -- Click-through rate
    cpc DECIMAL(10,2), -- Cost per click
    cpl DECIMAL(10,2), -- Cost per lead
    cpqm DECIMAL(10,2), -- Cost per qualified meeting
    
    -- Conversion Rates
    lead_to_meeting_rate DECIMAL(5,4),
    meeting_to_opp_rate DECIMAL(5,4),
    opp_to_win_rate DECIMAL(5,4),
    
    -- Lag Simulation
    meetings_from_leads_today INTEGER DEFAULT 0, -- Meetings from today's leads (with lag)
    opps_from_meetings_today INTEGER DEFAULT 0, -- Opps from today's meetings (with lag)
    wins_from_opps_today INTEGER DEFAULT 0, -- Wins from today's opps (with lag)
    
    -- Simulation Metadata
    random_seed INTEGER NOT NULL, -- Seed used for this day's generation
    seasonality_factor DECIMAL(4,3) DEFAULT 1.0, -- Day-of-week multiplier
    noise_applied DECIMAL(4,3) DEFAULT 0.0, -- Variance applied
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per run+date+channel
    UNIQUE(simulation_run_id, date, channel_name)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_daily_outcomes_simulation_run_id ON SPATH_daily_outcomes(simulation_run_id);
CREATE INDEX IF NOT EXISTS idx_spath_daily_outcomes_date ON SPATH_daily_outcomes(date);
CREATE INDEX IF NOT EXISTS idx_spath_daily_outcomes_channel_type ON SPATH_daily_outcomes(channel_type);
CREATE INDEX IF NOT EXISTS idx_spath_daily_outcomes_run_date ON SPATH_daily_outcomes(simulation_run_id, date);

-- =====================================================================================
-- TABLE: SPATH_what_if_parameters
-- Purpose: Store what-if scenario parameters for runs
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_what_if_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_run_id UUID NOT NULL REFERENCES SPATH_simulation_runs(id) ON DELETE CASCADE,
    parameter_name TEXT NOT NULL,
    parameter_type TEXT NOT NULL CHECK (parameter_type IN (
        'budget', 'conversion_rate', 'competition', 'seasonality', 'market_shift'
    )),
    base_value DECIMAL(10,4) NOT NULL,
    modified_value DECIMAL(10,4) NOT NULL,
    impact_level TEXT NOT NULL CHECK (impact_level IN ('low', 'medium', 'high')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_what_if_parameters_simulation_run_id ON SPATH_what_if_parameters(simulation_run_id);
CREATE INDEX IF NOT EXISTS idx_spath_what_if_parameters_parameter_type ON SPATH_what_if_parameters(parameter_type);

-- =====================================================================================
-- TRIGGERS: Auto-update timestamps
-- =====================================================================================

CREATE TRIGGER update_spath_scenarios_updated_at 
    BEFORE UPDATE ON SPATH_scenarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spath_simulation_runs_updated_at 
    BEFORE UPDATE ON SPATH_simulation_runs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- FUNCTIONS: Simulation helper functions
-- =====================================================================================

-- Function to calculate metrics for a simulation run
CREATE OR REPLACE FUNCTION calculate_simulation_metrics(run_id UUID)
RETURNS JSONB AS $$
DECLARE
    metrics JSONB;
    total_spend DECIMAL(10,2);
    total_leads INTEGER;
    total_meetings INTEGER;
    total_opps INTEGER;
    total_wins INTEGER;
    calculated_cac DECIMAL(10,2);
    calculated_cpqm DECIMAL(10,2);
    scenario_margin DECIMAL(4,3);
    scenario_mrr DECIMAL(10,2);
    payback_months DECIMAL(4,2);
BEGIN
    -- Aggregate metrics from daily outcomes
    SELECT 
        COALESCE(SUM(cost), 0),
        COALESCE(SUM(leads), 0),
        COALESCE(SUM(meetings), 0),
        COALESCE(SUM(opportunities), 0),
        COALESCE(SUM(wins), 0)
    INTO total_spend, total_leads, total_meetings, total_opps, total_wins
    FROM SPATH_daily_outcomes
    WHERE simulation_run_id = run_id;
    
    -- Calculate derived metrics
    calculated_cac := CASE WHEN total_wins > 0 THEN total_spend / total_wins ELSE NULL END;
    calculated_cpqm := CASE WHEN total_meetings > 0 THEN total_spend / total_meetings ELSE NULL END;
    
    -- Get scenario economics for payback calculation
    SELECT s.gross_margin, s.mrr_per_customer
    INTO scenario_margin, scenario_mrr
    FROM SPATH_simulation_runs sr
    JOIN SPATH_scenarios s ON sr.scenario_id = s.id
    WHERE sr.id = run_id;
    
    -- Calculate payback months
    IF calculated_cac IS NOT NULL AND scenario_margin IS NOT NULL AND scenario_mrr IS NOT NULL THEN
        payback_months := calculated_cac / (scenario_margin * scenario_mrr);
    END IF;
    
    -- Update simulation run with calculated metrics
    UPDATE SPATH_simulation_runs SET
        total_spend = calculate_simulation_metrics.total_spend,
        total_leads = calculate_simulation_metrics.total_leads,
        total_meetings = calculate_simulation_metrics.total_meetings,
        total_opportunities = calculate_simulation_metrics.total_opps,
        total_wins = calculate_simulation_metrics.total_wins,
        calculated_cac = calculate_simulation_metrics.calculated_cac,
        calculated_cpqm = calculate_simulation_metrics.calculated_cpqm,
        payback_months = calculate_simulation_metrics.payback_months,
        updated_at = NOW()
    WHERE id = run_id;
    
    -- Return metrics as JSON
    RETURN jsonb_build_object(
        'total_spend', total_spend,
        'total_leads', total_leads,
        'total_meetings', total_meetings,
        'total_opportunities', total_opps,
        'total_wins', total_wins,
        'calculated_cac', calculated_cac,
        'calculated_cpqm', calculated_cpqm,
        'payback_months', payback_months
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get channel performance summary
CREATE OR REPLACE FUNCTION get_channel_performance(run_id UUID)
RETURNS JSONB AS $$
DECLARE
    channel_stats JSONB;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'channel_name', channel_name,
            'channel_type', channel_type,
            'total_spend', total_spend,
            'total_leads', total_leads,
            'total_meetings', total_meetings,
            'cpl', CASE WHEN total_leads > 0 THEN total_spend / total_leads ELSE NULL END,
            'cpqm', CASE WHEN total_meetings > 0 THEN total_spend / total_meetings ELSE NULL END
        )
    )
    INTO channel_stats
    FROM (
        SELECT 
            channel_name,
            channel_type,
            SUM(cost) as total_spend,
            SUM(leads) as total_leads,
            SUM(meetings) as total_meetings
        FROM SPATH_daily_outcomes
        WHERE simulation_run_id = run_id
        GROUP BY channel_name, channel_type
        ORDER BY SUM(cost) DESC
    ) channel_summary;
    
    RETURN channel_stats;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================================
-- COMMENTS: Table documentation
-- =====================================================================================

COMMENT ON TABLE SPATH_scenarios IS 'Scenario configurations from startup_path_demo (finops_midmarket.json, etc.)';
COMMENT ON TABLE SPATH_simulation_runs IS 'Execution instances of scenarios with what-if parameters';
COMMENT ON TABLE SPATH_daily_outcomes IS 'Generated daily metrics from simulation runs with realistic distributions';
COMMENT ON TABLE SPATH_what_if_parameters IS 'What-if scenario parameters applied to simulation runs';

COMMENT ON COLUMN SPATH_scenarios.channels IS 'Full channel configuration JSON from startup_path_demo scenarios';
COMMENT ON COLUMN SPATH_simulation_runs.parameters IS 'What-if parameters applied for this specific run';
COMMENT ON COLUMN SPATH_daily_outcomes.random_seed IS 'Deterministic seed: org_id ^ project_id ^ scenario.seed ^ day_offset';

-- =====================================================================================
-- VALIDATION: Verify table creation
-- =====================================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_scenarios') THEN
        RAISE EXCEPTION 'Table SPATH_scenarios was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_simulation_runs') THEN
        RAISE EXCEPTION 'Table SPATH_simulation_runs was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_daily_outcomes') THEN
        RAISE EXCEPTION 'Table SPATH_daily_outcomes was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_what_if_parameters') THEN
        RAISE EXCEPTION 'Table SPATH_what_if_parameters was not created';
    END IF;
    
    RAISE NOTICE 'SUCCESS: Simulation tables (scenarios, simulation_runs, daily_outcomes, what_if_parameters) created successfully';
END $$;