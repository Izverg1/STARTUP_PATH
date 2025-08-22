-- Create SPATH_waitlist table for STARTUP_PATH Platform
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS SPATH_waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
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
    contacted_by UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_email ON SPATH_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_type ON SPATH_waitlist(type);
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_status ON SPATH_waitlist(status);
CREATE INDEX IF NOT EXISTS idx_spath_waitlist_created_at ON SPATH_waitlist(created_at);

-- Enable Row Level Security
ALTER TABLE SPATH_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (for form submissions)
CREATE POLICY "Allow public waitlist signup" ON SPATH_waitlist
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Allow authenticated users to view waitlist
CREATE POLICY "Allow authenticated users to view waitlist" ON SPATH_waitlist
    FOR SELECT 
    TO authenticated
    USING (true);

-- Allow authenticated users to update (for admin features)
CREATE POLICY "Allow authenticated users to update waitlist" ON SPATH_waitlist
    FOR UPDATE 
    TO authenticated
    USING (true);

-- Insert a test record to verify everything works
INSERT INTO SPATH_waitlist (email, name, company, type, additional_info) 
VALUES ('setup-test@karlson.com', 'Setup Test', 'KARLSON LLC', 'customer', '{"source": "setup"}')
ON CONFLICT (email) DO NOTHING;

-- Success message
SELECT 'SPATH_waitlist table created successfully!' AS result;