-- =====================================================================================
-- STARTUP_PATH Platform - Collaboration Tables Migration
-- Database: KSON_DB (Supabase)
-- Prefix: SPATH_ (all tables)
-- Purpose: Spaces, Threads, Decisions, Artifacts - Team collaboration features
-- =====================================================================================

-- =====================================================================================
-- TABLE: SPATH_spaces
-- Purpose: Collaboration spaces for team discussions
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    project_id UUID NOT NULL REFERENCES SPATH_projects(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES SPATH_users(id) ON DELETE CASCADE,
    is_private BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_spaces_project_id ON SPATH_spaces(project_id);
CREATE INDEX IF NOT EXISTS idx_spath_spaces_owner_id ON SPATH_spaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_spath_spaces_is_private ON SPATH_spaces(is_private);

-- =====================================================================================
-- TABLE: SPATH_threads
-- Purpose: Discussion threads within spaces
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    space_id UUID NOT NULL REFERENCES SPATH_spaces(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES SPATH_users(id) ON DELETE CASCADE,
    experiment_id UUID REFERENCES SPATH_experiments(id) ON DELETE SET NULL, -- Optional link to experiment
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'closed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_threads_space_id ON SPATH_threads(space_id);
CREATE INDEX IF NOT EXISTS idx_spath_threads_author_id ON SPATH_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_spath_threads_experiment_id ON SPATH_threads(experiment_id);
CREATE INDEX IF NOT EXISTS idx_spath_threads_status ON SPATH_threads(status);
CREATE INDEX IF NOT EXISTS idx_spath_threads_priority ON SPATH_threads(priority);

-- =====================================================================================
-- TABLE: SPATH_comments
-- Purpose: Comments within discussion threads
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES SPATH_threads(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES SPATH_users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES SPATH_comments(id) ON DELETE CASCADE, -- For reply threading
    attachments JSONB DEFAULT '[]',
    mentions UUID[] DEFAULT '{}', -- Array of mentioned user IDs
    reactions JSONB DEFAULT '{}', -- Emoji reactions
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_comments_thread_id ON SPATH_comments(thread_id);
CREATE INDEX IF NOT EXISTS idx_spath_comments_author_id ON SPATH_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_spath_comments_parent_id ON SPATH_comments(parent_id);

-- =====================================================================================
-- TABLE: SPATH_decisions
-- Purpose: Decision log for experiments and strategy changes
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    project_id UUID NOT NULL REFERENCES SPATH_projects(id) ON DELETE CASCADE,
    experiment_id UUID REFERENCES SPATH_experiments(id) ON DELETE SET NULL,
    decision_maker_id UUID NOT NULL REFERENCES SPATH_users(id) ON DELETE CASCADE,
    decision_type TEXT NOT NULL CHECK (decision_type IN (
        'budget_allocation', 'channel_optimization', 'gate_adjustment', 
        'experiment_pause', 'experiment_scale', 'strategy_pivot'
    )),
    decision_data JSONB DEFAULT '{}', -- What was decided (budget changes, etc.)
    rationale TEXT, -- Why this decision was made
    impact_expected TEXT, -- Expected outcomes
    impact_actual TEXT, -- Actual outcomes (filled later)
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'superseded', 'reverted')),
    confidence_score INTEGER CHECK (confidence_score >= 1 AND confidence_score <= 10),
    stakeholders UUID[] DEFAULT '{}', -- Array of involved user IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_decisions_project_id ON SPATH_decisions(project_id);
CREATE INDEX IF NOT EXISTS idx_spath_decisions_experiment_id ON SPATH_decisions(experiment_id);
CREATE INDEX IF NOT EXISTS idx_spath_decisions_decision_maker_id ON SPATH_decisions(decision_maker_id);
CREATE INDEX IF NOT EXISTS idx_spath_decisions_decision_type ON SPATH_decisions(decision_type);
CREATE INDEX IF NOT EXISTS idx_spath_decisions_status ON SPATH_decisions(status);

-- =====================================================================================
-- TABLE: SPATH_artifacts
-- Purpose: Outputs generated by AI agents
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'analysis', 'recommendation', 'report', 'optimization',
        'benchmark', 'forecast', 'allocation', 'insight'
    )),
    content TEXT NOT NULL,
    project_id UUID NOT NULL REFERENCES SPATH_projects(id) ON DELETE CASCADE,
    agent_key TEXT NOT NULL CHECK (agent_key IN ('channel_scout', 'offer_alchemist', 'signal_wrangler', 'budget_captain')),
    experiment_id UUID REFERENCES SPATH_experiments(id) ON DELETE SET NULL,
    channel_id UUID REFERENCES SPATH_channels(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}', -- Metrics, confidence scores, etc.
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_artifacts_project_id ON SPATH_artifacts(project_id);
CREATE INDEX IF NOT EXISTS idx_spath_artifacts_agent_key ON SPATH_artifacts(agent_key);
CREATE INDEX IF NOT EXISTS idx_spath_artifacts_experiment_id ON SPATH_artifacts(experiment_id);
CREATE INDEX IF NOT EXISTS idx_spath_artifacts_type ON SPATH_artifacts(type);
CREATE INDEX IF NOT EXISTS idx_spath_artifacts_status ON SPATH_artifacts(status);

-- =====================================================================================
-- TABLE: SPATH_fact_sheets
-- Purpose: Automated experiment reports
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_fact_sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    experiment_id UUID NOT NULL REFERENCES SPATH_experiments(id) ON DELETE CASCADE,
    generated_by_id UUID NOT NULL REFERENCES SPATH_users(id) ON DELETE CASCADE,
    window_start DATE NOT NULL,
    window_end DATE NOT NULL,
    content TEXT NOT NULL, -- Markdown content
    template_version TEXT DEFAULT 'v1.0',
    metrics_summary JSONB DEFAULT '{}',
    artifact_refs UUID[] DEFAULT '{}', -- Referenced artifact IDs
    export_format TEXT DEFAULT 'markdown' CHECK (export_format IN ('markdown', 'pdf', 'html')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_fact_sheets_experiment_id ON SPATH_fact_sheets(experiment_id);
CREATE INDEX IF NOT EXISTS idx_spath_fact_sheets_generated_by_id ON SPATH_fact_sheets(generated_by_id);
CREATE INDEX IF NOT EXISTS idx_spath_fact_sheets_window_start ON SPATH_fact_sheets(window_start);
CREATE INDEX IF NOT EXISTS idx_spath_fact_sheets_window_end ON SPATH_fact_sheets(window_end);

-- =====================================================================================
-- TRIGGERS: Auto-update timestamps
-- =====================================================================================

CREATE TRIGGER update_spath_spaces_updated_at 
    BEFORE UPDATE ON SPATH_spaces 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spath_threads_updated_at 
    BEFORE UPDATE ON SPATH_threads 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spath_comments_updated_at 
    BEFORE UPDATE ON SPATH_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spath_decisions_updated_at 
    BEFORE UPDATE ON SPATH_decisions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spath_artifacts_updated_at 
    BEFORE UPDATE ON SPATH_artifacts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- FUNCTIONS: Helper functions for collaboration features
-- =====================================================================================

-- Function to count unread comments in a thread for a user
CREATE OR REPLACE FUNCTION get_unread_comment_count(thread_uuid UUID, user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    -- This is a placeholder - would need user read tracking table for real implementation
    RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- Function to get thread activity summary
CREATE OR REPLACE FUNCTION get_thread_activity_summary(thread_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    comment_count INTEGER;
    last_activity TIMESTAMP WITH TIME ZONE;
    participants UUID[];
BEGIN
    SELECT COUNT(*), MAX(created_at) 
    INTO comment_count, last_activity
    FROM SPATH_comments 
    WHERE thread_id = thread_uuid;
    
    SELECT ARRAY_AGG(DISTINCT author_id)
    INTO participants
    FROM SPATH_comments 
    WHERE thread_id = thread_uuid;
    
    RETURN jsonb_build_object(
        'comment_count', comment_count,
        'last_activity', last_activity,
        'participant_count', COALESCE(array_length(participants, 1), 0)
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================================================
-- COMMENTS: Table documentation
-- =====================================================================================

COMMENT ON TABLE SPATH_spaces IS 'Collaboration spaces for organizing team discussions';
COMMENT ON TABLE SPATH_threads IS 'Discussion threads within collaboration spaces';
COMMENT ON TABLE SPATH_comments IS 'Comments and replies within discussion threads';
COMMENT ON TABLE SPATH_decisions IS 'Decision log tracking strategic changes and rationale';
COMMENT ON TABLE SPATH_artifacts IS 'AI-generated outputs: analyses, recommendations, reports';
COMMENT ON TABLE SPATH_fact_sheets IS 'Automated experiment reports with metrics and insights';

COMMENT ON COLUMN SPATH_decisions.decision_data IS 'Structured data about what was changed (budgets, gates, etc.)';
COMMENT ON COLUMN SPATH_artifacts.metadata IS 'Agent-specific data: confidence scores, metrics, context';
COMMENT ON COLUMN SPATH_fact_sheets.artifact_refs IS 'Array of artifact IDs referenced in the report';

-- =====================================================================================
-- VALIDATION: Verify table creation
-- =====================================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_spaces') THEN
        RAISE EXCEPTION 'Table SPATH_spaces was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_threads') THEN
        RAISE EXCEPTION 'Table SPATH_threads was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_comments') THEN
        RAISE EXCEPTION 'Table SPATH_comments was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_decisions') THEN
        RAISE EXCEPTION 'Table SPATH_decisions was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_artifacts') THEN
        RAISE EXCEPTION 'Table SPATH_artifacts was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_fact_sheets') THEN
        RAISE EXCEPTION 'Table SPATH_fact_sheets was not created';
    END IF;
    
    RAISE NOTICE 'SUCCESS: Collaboration tables (spaces, threads, decisions, artifacts, fact_sheets) created successfully';
END $$;