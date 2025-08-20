-- SQL SOLUTION FOR YOUR AUTH SERVICE
-- Copy this into Supabase SQL Editor and run it
-- Creates a user that works with your authService.login() method

-- Clean up any existing demo user first
DELETE FROM spath_users WHERE email = 'user@startuppath.ai';
DELETE FROM auth.users WHERE email = 'user@startuppath.ai';

-- Create the complete user setup
DO $$
DECLARE
    demo_user_id UUID := gen_random_uuid();
    demo_org_id UUID;
BEGIN
    -- 1. Create or get demo organization
    INSERT INTO spath_orgs (id, name, slug, settings, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        'STARTUP_PATH Demo',
        'startup-path-demo',
        '{"plan": "professional"}',
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        updated_at = NOW()
    RETURNING id INTO demo_org_id;
    
    -- Get org ID if it already existed
    IF demo_org_id IS NULL THEN
        SELECT id INTO demo_org_id FROM spath_orgs WHERE slug = 'startup-path-demo';
    END IF;
    
    -- 2. Create auth user with proper bcrypt password hash
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at, -- CRUCIAL: Email is confirmed
        confirmation_sent_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change_token_current,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        last_sign_in_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        demo_user_id,
        'authenticated',
        'authenticated',
        'user@startuppath.ai',
        crypt('demo123', gen_salt('bf')), -- Proper password hash
        NOW(), -- Email confirmed = authentication works
        NOW(),
        encode(gen_random_bytes(32), 'hex'),
        '',
        '',
        '',
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Demo User", "company": "STARTUP_PATH Demo"}',
        false,
        null
    );
    
    -- 3. Create user profile matching your authService expectations
    INSERT INTO spath_users (
        id,
        email,
        name, -- Your authService looks for this field
        org_id,
        role, -- Your authService expects 'owner'
        settings,
        created_at,
        updated_at
    ) VALUES (
        demo_user_id,
        'user@startuppath.ai',
        'Demo User',
        demo_org_id,
        'owner',
        '{"theme": "dark", "notifications": true}',
        NOW(),
        NOW()
    );
    
    -- 4. Create a sample project for the dashboard
    INSERT INTO spath_projects (
        id,
        name,
        description,
        org_id,
        owner_id,
        settings,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        'Demo GTM Strategy',
        'Sample go-to-market optimization project',
        demo_org_id,
        demo_user_id,
        '{"industry": "SaaS", "stage": "Growth"}',
        NOW(),
        NOW()
    );
    
    RAISE NOTICE '✅ SUCCESS: User created for your authService!';
    RAISE NOTICE 'User ID: %', demo_user_id;
    RAISE NOTICE 'Organization ID: %', demo_org_id;
    RAISE NOTICE 'Email: user@startuppath.ai';
    RAISE NOTICE 'Password: demo123';
    RAISE NOTICE 'Login URL: http://localhost:3004/login';
    RAISE NOTICE '';
    RAISE NOTICE 'This user works with:';
    RAISE NOTICE '• authService.login() method';
    RAISE NOTICE '• useAuth hook';
    RAISE NOTICE '• spath_users table queries';
    RAISE NOTICE '• spath_orgs relationships';

END $$;

-- Verify the setup matches your authService expectations
SELECT 
    'AUTH USER' as table_type,
    au.id,
    au.email,
    au.email_confirmed_at,
    'Password hash present' as password_status
FROM auth.users au
WHERE au.email = 'user@startuppath.ai'

UNION ALL

SELECT 
    'SPATH USER' as table_type,
    su.id,
    su.email,
    su.name,
    su.role
FROM spath_users su
WHERE su.email = 'user@startuppath.ai'

UNION ALL

SELECT 
    'ORGANIZATION' as table_type,
    so.id,
    so.name,
    so.slug,
    'N/A' as extra
FROM spath_orgs so
WHERE so.slug = 'startup-path-demo'

UNION ALL

SELECT 
    'RELATIONSHIP TEST' as table_type,
    su.id,
    su.name || ' -> ' || so.name as relationship,
    'WORKING' as status,
    'N/A' as extra
FROM spath_users su
JOIN spath_orgs so ON su.org_id = so.id
WHERE su.email = 'user@startuppath.ai';