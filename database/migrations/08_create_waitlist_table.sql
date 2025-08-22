-- =====================================================================================
-- STARTUP_PATH Platform - Waitlist Table Migration
-- Database: KSON_DB (Supabase)
-- Prefix: SPATH_ (all tables)
-- Purpose: Customer and Partner waitlist management
-- =====================================================================================

-- =====================================================================================
-- TABLE: SPATH_waitlist
-- Purpose: Track potential customers and partners interested in the platform
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    name TEXT,
    company TEXT,
    position TEXT,
    type TEXT NOT NULL CHECK (type IN ('customer', 'partner')),
    source TEXT DEFAULT 'landing_page',
    utm_campaign TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_content TEXT,
    utm_term TEXT,
    referrer TEXT,
    ip_address INET,
    user_agent TEXT,
    additional_info JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'declined', 'spam')),
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    contacted_at TIMESTAMP WITH TIME ZONE,
    contacted_by UUID REFERENCES SPATH_users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- INDEXES: Performance optimization
-- =====================================================================================

-- Primary search indexes
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_email ON SPATH_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_type ON SPATH_waitlist(type);
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_status ON SPATH_waitlist(status);
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_priority ON SPATH_waitlist(priority);

-- Date-based indexes for analytics
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_created_at ON SPATH_waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_contacted_at ON SPATH_waitlist(contacted_at);

-- Marketing analytics indexes
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_source ON SPATH_waitlist(source);
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_utm_campaign ON SPATH_waitlist(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_utm_source ON SPATH_waitlist(utm_source);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_type_status ON SPATH_waitlist(type, status);
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_status_created ON SPATH_waitlist(status, created_at);

-- =====================================================================================
-- ROW LEVEL SECURITY: Public read access for form submissions
-- =====================================================================================

-- Enable RLS
ALTER TABLE SPATH_waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert (for form submissions)
CREATE POLICY "Allow public waitlist signup" ON SPATH_waitlist
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Only authenticated users can view waitlist entries
CREATE POLICY "Allow authenticated users to view waitlist" ON SPATH_waitlist
    FOR SELECT 
    TO authenticated
    USING (true);

-- Policy: Only admins and owners can update waitlist entries
CREATE POLICY "Allow admins to update waitlist" ON SPATH_waitlist
    FOR UPDATE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM SPATH_users 
            WHERE SPATH_users.id = auth.uid() 
            AND SPATH_users.role IN ('owner', 'admin')
        )
    );

-- Policy: Only owners can delete waitlist entries
CREATE POLICY "Allow owners to delete waitlist" ON SPATH_waitlist
    FOR DELETE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM SPATH_users 
            WHERE SPATH_users.id = auth.uid() 
            AND SPATH_users.role = 'owner'
        )
    );

-- =====================================================================================
-- TRIGGERS: Auto-update timestamps
-- =====================================================================================

-- Apply update trigger to waitlist table
CREATE TRIGGER update_spath_waitlist_updated_at 
    BEFORE UPDATE ON SPATH_waitlist 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- FUNCTIONS: Waitlist analytics and utilities
-- =====================================================================================

-- Function to get waitlist stats by type
CREATE OR REPLACE FUNCTION get_waitlist_stats()
RETURNS TABLE (
    type TEXT,
    total_count BIGINT,
    pending_count BIGINT,
    contacted_count BIGINT,
    converted_count BIGINT,
    latest_signup TIMESTAMP WITH TIME ZONE
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT 
        w.type,
        COUNT(*) as total_count,
        COUNT(*) FILTER (WHERE w.status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE w.status = 'contacted') as contacted_count,
        COUNT(*) FILTER (WHERE w.status = 'converted') as converted_count,
        MAX(w.created_at) as latest_signup
    FROM SPATH_waitlist w
    GROUP BY w.type
    ORDER BY w.type;
$$;

-- Function to get recent signups
CREATE OR REPLACE FUNCTION get_recent_waitlist_signups(
    days_back INTEGER DEFAULT 7,
    entry_type TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    email TEXT,
    name TEXT,
    company TEXT,
    type TEXT,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT 
        w.id,
        w.email,
        w.name,
        w.company,
        w.type,
        w.source,
        w.created_at
    FROM SPATH_waitlist w
    WHERE w.created_at >= NOW() - INTERVAL '1 day' * days_back
    AND (entry_type IS NULL OR w.type = entry_type)
    ORDER BY w.created_at DESC;
$$;

-- =====================================================================================
-- COMMENTS: Table documentation
-- =====================================================================================

COMMENT ON TABLE SPATH_waitlist IS 'Waitlist for potential customers and partners interested in STARTUP_PATH Platform';
COMMENT ON COLUMN SPATH_waitlist.type IS 'Type of waitlist entry: customer (potential users) or partner (integrations, agencies, etc.)';
COMMENT ON COLUMN SPATH_waitlist.status IS 'Status: pending (new), contacted (outreach made), converted (became customer/partner), declined (not interested), spam (invalid entry)';
COMMENT ON COLUMN SPATH_waitlist.priority IS 'Priority level 1-5 (1=highest priority) for sales/partnership outreach';
COMMENT ON COLUMN SPATH_waitlist.source IS 'Traffic source: landing_page, referral, social, etc.';
COMMENT ON COLUMN SPATH_waitlist.additional_info IS 'JSON field for storing extra form data, preferences, or custom fields';

-- =====================================================================================
-- VALIDATION: Verify table creation
-- =====================================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_waitlist') THEN
        RAISE EXCEPTION 'Table SPATH_waitlist was not created';
    END IF;
    
    -- Verify indexes exist
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_spath_waitlist_email') THEN
        RAISE EXCEPTION 'Index idx_spath_waitlist_email was not created';
    END IF;
    
    -- Verify RLS is enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'spath_waitlist' 
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'Row Level Security not enabled on SPATH_waitlist';
    END IF;
    
    RAISE NOTICE 'SUCCESS: Waitlist table created successfully with all indexes, policies, and functions';
END $$;

-- =====================================================================================
-- SAMPLE DATA: Demo entries for testing (optional)
-- =====================================================================================

-- Insert sample waitlist entries for demo purposes
INSERT INTO SPATH_waitlist (
    email, 
    name, 
    company, 
    position,
    type, 
    source, 
    utm_source, 
    utm_campaign,
    status,
    priority,
    additional_info
) VALUES 
(
    'founder@techstartup.com',
    'Sarah Chen',
    'TechStartup Inc',
    'CEO',
    'customer',
    'landing_page',
    'google',
    'startup_demo',
    'pending',
    1,
    '{"industry": "SaaS", "employees": "10-50", "current_spend": "$10k/month"}'
),
(
    'partnerships@growthagency.com',
    'Mike Rodriguez',
    'Growth Agency',
    'Head of Partnerships',
    'partner',
    'landing_page',
    'linkedin',
    'partner_program',
    'pending',
    2,
    '{"partnership_type": "referral", "clients": "50+", "focus": "B2B SaaS"}'
),
(
    'cmo@scaletech.io',
    'Alex Kumar',
    'ScaleTech',
    'Chief Marketing Officer',
    'customer',
    'referral',
    'direct',
    NULL,
    'contacted',
    1,
    '{"industry": "FinTech", "employees": "100-500", "current_tools": ["HubSpot", "Google Ads"]}'
)
ON CONFLICT (email) DO NOTHING;

RAISE NOTICE 'Waitlist table migration completed successfully! ✅';