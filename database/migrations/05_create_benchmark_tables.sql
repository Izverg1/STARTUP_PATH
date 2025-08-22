-- =====================================================================================
-- STARTUP_PATH Platform - Benchmark Tables Migration
-- Database: KSON_DB (Supabase)
-- Prefix: SPATH_ (all tables)
-- Purpose: Industry Benchmarks, Seasonality - startup_path_demo benchmarks.json
-- =====================================================================================

-- =====================================================================================
-- TABLE: SPATH_benchmarks
-- Purpose: Industry benchmark ranges and targets
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL, -- 'finance', 'channels', 'conversion_rates'
    metric_name TEXT NOT NULL, -- 'payback_good_months', 'cpl_range', 'lp_cvr_range'
    channel_type TEXT, -- NULL for general metrics, specific for channel metrics
    
    -- Range Values
    min_value DECIMAL(10,4),
    max_value DECIMAL(10,4),
    target_value DECIMAL(10,4), -- Ideal target within range
    unit TEXT NOT NULL, -- 'months', 'dollars', 'percentage', 'multiplier'
    
    -- Metadata
    source_label TEXT, -- 'Industry avg 2024', 'Meta ads benchmark'
    confidence_level TEXT DEFAULT 'medium' CHECK (confidence_level IN ('low', 'medium', 'high')),
    sample_size TEXT, -- Description of data source size
    last_updated DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    
    -- Geographic/Vertical Specificity
    geography TEXT DEFAULT 'global', -- 'US', 'EU', 'global'
    vertical TEXT, -- 'saas', 'ecommerce', 'b2b_services'
    company_size TEXT, -- 'startup', 'smb', 'enterprise'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique benchmarks per category+metric+channel combination
    UNIQUE(category, metric_name, channel_type, geography, vertical, company_size)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_benchmarks_category ON SPATH_benchmarks(category);
CREATE INDEX IF NOT EXISTS idx_spath_benchmarks_metric_name ON SPATH_benchmarks(metric_name);
CREATE INDEX IF NOT EXISTS idx_spath_benchmarks_channel_type ON SPATH_benchmarks(channel_type);
CREATE INDEX IF NOT EXISTS idx_spath_benchmarks_geography ON SPATH_benchmarks(geography);
CREATE INDEX IF NOT EXISTS idx_spath_benchmarks_vertical ON SPATH_benchmarks(vertical);

-- =====================================================================================
-- TABLE: SPATH_seasonality
-- Purpose: Day-of-week and seasonal multipliers
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_seasonality (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- 'day_of_week', 'holiday_week', 'conference_season'
    type TEXT NOT NULL CHECK (type IN ('day_of_week', 'weekly', 'monthly', 'quarterly', 'event_based')),
    
    -- Timing
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    week_of_month INTEGER CHECK (week_of_month >= 1 AND week_of_month <= 5),
    month_of_year INTEGER CHECK (month_of_year >= 1 AND month_of_year <= 12),
    quarter INTEGER CHECK (quarter >= 1 AND quarter <= 4),
    
    -- Event-based (conferences, holidays)
    event_name TEXT,
    start_date DATE,
    end_date DATE,
    
    -- Multipliers
    impression_multiplier DECIMAL(4,3) DEFAULT 1.0,
    conversion_multiplier DECIMAL(4,3) DEFAULT 1.0,
    cost_multiplier DECIMAL(4,3) DEFAULT 1.0,
    
    -- Scope
    applies_to_channels TEXT[] DEFAULT '{}', -- Empty = all channels
    geography TEXT DEFAULT 'global',
    vertical TEXT,
    
    -- Metadata
    description TEXT,
    confidence_level TEXT DEFAULT 'medium' CHECK (confidence_level IN ('low', 'medium', 'high')),
    source_label TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_seasonality_type ON SPATH_seasonality(type);
CREATE INDEX IF NOT EXISTS idx_spath_seasonality_day_of_week ON SPATH_seasonality(day_of_week);
CREATE INDEX IF NOT EXISTS idx_spath_seasonality_month_of_year ON SPATH_seasonality(month_of_year);
CREATE INDEX IF NOT EXISTS idx_spath_seasonality_start_date ON SPATH_seasonality(start_date);
CREATE INDEX IF NOT EXISTS idx_spath_seasonality_is_active ON SPATH_seasonality(is_active);

-- =====================================================================================
-- TABLE: SPATH_benchmark_targets
-- Purpose: Organization-specific benchmark targets and gates
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_benchmark_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES SPATH_organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES SPATH_projects(id) ON DELETE CASCADE, -- NULL = org-level
    
    -- Benchmark Reference
    benchmark_id UUID REFERENCES SPATH_benchmarks(id) ON DELETE CASCADE,
    custom_metric_name TEXT, -- For custom org-specific metrics not in benchmarks
    
    -- Target Configuration
    target_value DECIMAL(10,4) NOT NULL,
    warning_threshold DECIMAL(10,4), -- Warning level before target breach
    unit TEXT NOT NULL,
    
    -- Status
    current_value DECIMAL(10,4),
    status TEXT DEFAULT 'monitoring' CHECK (status IN ('monitoring', 'on_track', 'warning', 'breach')),
    last_updated TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    rationale TEXT, -- Why this target was set
    owner_id UUID REFERENCES SPATH_users(id) ON DELETE SET NULL,
    review_frequency TEXT DEFAULT 'weekly' CHECK (review_frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure no duplicate targets for same metric in same scope
    UNIQUE(org_id, project_id, benchmark_id, custom_metric_name)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_benchmark_targets_org_id ON SPATH_benchmark_targets(org_id);
CREATE INDEX IF NOT EXISTS idx_spath_benchmark_targets_project_id ON SPATH_benchmark_targets(project_id);
CREATE INDEX IF NOT EXISTS idx_spath_benchmark_targets_benchmark_id ON SPATH_benchmark_targets(benchmark_id);
CREATE INDEX IF NOT EXISTS idx_spath_benchmark_targets_status ON SPATH_benchmark_targets(status);

-- =====================================================================================
-- TABLE: SPATH_metric_history
-- Purpose: Track metric performance over time for benchmarking
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_metric_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID NOT NULL REFERENCES SPATH_benchmark_targets(id) ON DELETE CASCADE,
    experiment_id UUID REFERENCES SPATH_experiments(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES SPATH_channels(id) ON DELETE CASCADE,
    
    -- Measurement
    date DATE NOT NULL,
    measured_value DECIMAL(10,4) NOT NULL,
    sample_size INTEGER, -- Number of data points
    confidence_interval JSONB, -- {'lower': X, 'upper': Y}
    
    -- Context
    measurement_method TEXT, -- 'calculated', 'manual_entry', 'imported'
    data_source TEXT, -- 'google_ads', 'simulation', 'manual'
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one measurement per target+date
    UNIQUE(target_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_metric_history_target_id ON SPATH_metric_history(target_id);
CREATE INDEX IF NOT EXISTS idx_spath_metric_history_date ON SPATH_metric_history(date);
CREATE INDEX IF NOT EXISTS idx_spath_metric_history_experiment_id ON SPATH_metric_history(experiment_id);

-- =====================================================================================
-- TRIGGERS: Auto-update timestamps
-- =====================================================================================

CREATE TRIGGER update_spath_benchmarks_updated_at 
    BEFORE UPDATE ON SPATH_benchmarks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spath_seasonality_updated_at 
    BEFORE UPDATE ON SPATH_seasonality 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spath_benchmark_targets_updated_at 
    BEFORE UPDATE ON SPATH_benchmark_targets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- FUNCTIONS: Benchmark helper functions
-- =====================================================================================

-- Function to get applicable seasonality multipliers for a date
CREATE OR REPLACE FUNCTION get_seasonality_multipliers(
    target_date DATE,
    target_geography TEXT DEFAULT 'global',
    target_vertical TEXT DEFAULT NULL,
    target_channels TEXT[] DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    dow INTEGER;
    multipliers JSONB := '{"impression": 1.0, "conversion": 1.0, "cost": 1.0}';
    season_record RECORD;
BEGIN
    -- Get day of week (0=Sunday)
    dow := EXTRACT(DOW FROM target_date);
    
    -- Find applicable seasonality records
    FOR season_record IN 
        SELECT 
            impression_multiplier,
            conversion_multiplier,
            cost_multiplier,
            applies_to_channels
        FROM SPATH_seasonality 
        WHERE is_active = TRUE
        AND (geography = target_geography OR geography = 'global')
        AND (vertical IS NULL OR vertical = target_vertical)
        AND (
            (type = 'day_of_week' AND day_of_week = dow) OR
            (type = 'event_based' AND target_date BETWEEN start_date AND end_date)
        )
    LOOP
        -- Apply channel filtering if specified
        IF target_channels IS NOT NULL AND season_record.applies_to_channels != '{}' THEN
            IF NOT (target_channels && season_record.applies_to_channels) THEN
                CONTINUE;
            END IF;
        END IF;
        
        -- Multiply existing multipliers (compound effect)
        multipliers := jsonb_set(
            multipliers, 
            '{impression}', 
            to_jsonb((multipliers->>'impression')::DECIMAL * season_record.impression_multiplier)
        );
        multipliers := jsonb_set(
            multipliers, 
            '{conversion}', 
            to_jsonb((multipliers->>'conversion')::DECIMAL * season_record.conversion_multiplier)
        );
        multipliers := jsonb_set(
            multipliers, 
            '{cost}', 
            to_jsonb((multipliers->>'cost')::DECIMAL * season_record.cost_multiplier)
        );
    END LOOP;
    
    RETURN multipliers;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a metric is within benchmark range
CREATE OR REPLACE FUNCTION check_benchmark_status(
    metric_value DECIMAL(10,4),
    benchmark_category TEXT,
    benchmark_metric TEXT,
    channel_type TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
    benchmark_record RECORD;
    status TEXT := 'unknown';
BEGIN
    -- Find matching benchmark
    SELECT min_value, max_value, target_value
    INTO benchmark_record
    FROM SPATH_benchmarks
    WHERE category = benchmark_category
    AND metric_name = benchmark_metric
    AND (channel_type IS NULL OR SPATH_benchmarks.channel_type = check_benchmark_status.channel_type)
    ORDER BY 
        CASE WHEN SPATH_benchmarks.channel_type = check_benchmark_status.channel_type THEN 1 ELSE 2 END,
        confidence_level DESC
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN 'no_benchmark';
    END IF;
    
    -- Determine status
    IF metric_value < benchmark_record.min_value THEN
        status := 'below_range';
    ELSIF metric_value > benchmark_record.max_value THEN
        status := 'above_range';
    ELSIF benchmark_record.target_value IS NOT NULL THEN
        IF ABS(metric_value - benchmark_record.target_value) <= (benchmark_record.max_value - benchmark_record.min_value) * 0.1 THEN
            status := 'optimal';
        ELSE
            status := 'within_range';
        END IF;
    ELSE
        status := 'within_range';
    END IF;
    
    RETURN status;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================================
-- COMMENTS: Table documentation
-- =====================================================================================

COMMENT ON TABLE SPATH_benchmarks IS 'Industry benchmark ranges and targets from startup_path_demo/benchmarks.json';
COMMENT ON TABLE SPATH_seasonality IS 'Day-of-week and seasonal multipliers for realistic simulation variance';
COMMENT ON TABLE SPATH_benchmark_targets IS 'Organization-specific targets and gates based on benchmarks';
COMMENT ON TABLE SPATH_metric_history IS 'Historical tracking of metric performance against targets';

COMMENT ON COLUMN SPATH_benchmarks.source_label IS 'Reference to data source: "Industry avg 2024", "Meta benchmark"';
COMMENT ON COLUMN SPATH_seasonality.applies_to_channels IS 'Empty array = all channels, or specific channel types';
COMMENT ON COLUMN SPATH_benchmark_targets.rationale IS 'Business reasoning for setting this specific target';

-- =====================================================================================
-- VALIDATION: Verify table creation
-- =====================================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_benchmarks') THEN
        RAISE EXCEPTION 'Table SPATH_benchmarks was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_seasonality') THEN
        RAISE EXCEPTION 'Table SPATH_seasonality was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_benchmark_targets') THEN
        RAISE EXCEPTION 'Table SPATH_benchmark_targets was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_metric_history') THEN
        RAISE EXCEPTION 'Table SPATH_metric_history was not created';
    END IF;
    
    RAISE NOTICE 'SUCCESS: Benchmark tables (benchmarks, seasonality, targets, metric_history) created successfully';
END $$;