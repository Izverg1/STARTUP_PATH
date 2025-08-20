-- SOLUTION 2: SQL DIRECT USER CREATION
-- Copy and paste this entire SQL into your Supabase SQL Editor and click "Run"
-- This creates a real user directly in the database

-- Generate a new UUID for the user
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
    org_id UUID;
BEGIN
    -- 1. Create organization first
    INSERT INTO spath_orgs (id, name, slug, plan, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        'STARTUP_PATH Demo Organization',
        'startup-path-demo',
        'professional',
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        updated_at = NOW()
    RETURNING id INTO org_id;
    
    -- Get org_id if it already existed
    IF org_id IS NULL THEN
        SELECT id INTO org_id FROM spath_orgs WHERE slug = 'startup-path-demo';
    END IF;
    
    -- 2. Create user in auth.users with proper password hash
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
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
        new_user_id,
        'authenticated',
        'authenticated',
        'user@startuppath.ai',
        crypt('demo123', gen_salt('bf')), -- Proper bcrypt password hash
        NOW(), -- Email confirmed
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
    )
    ON CONFLICT (email) DO UPDATE SET
        encrypted_password = EXCLUDED.encrypted_password,
        email_confirmed_at = NOW(),
        updated_at = NOW();
    
    -- 3. Create user profile in spath_users
    INSERT INTO spath_users (
        id,
        email,
        name,
        org_id,
        role,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        'user@startuppath.ai',
        'Demo User',
        org_id,
        'owner',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        org_id = EXCLUDED.org_id,
        role = EXCLUDED.role,
        updated_at = NOW();
    
    -- 4. Create a sample project
    INSERT INTO spath_projects (
        id,
        name,
        description,
        org_id,
        owner_id,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        'Demo GTM Strategy',
        'Sample go-to-market strategy project',
        org_id,
        new_user_id,
        NOW(),
        NOW()
    )
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'SUCCESS: User created with ID: %', new_user_id;
    RAISE NOTICE 'Organization ID: %', org_id;
    RAISE NOTICE 'Email: user@startuppath.ai';
    RAISE NOTICE 'Password: demo123';
    RAISE NOTICE 'Login URL: http://localhost:3004/login';

END $$;

-- Verify the user was created
SELECT 
    au.id,
    au.email,
    au.email_confirmed_at,
    su.name,
    su.role,
    so.name as org_name
FROM auth.users au
JOIN spath_users su ON au.id = su.id
JOIN spath_orgs so ON su.org_id = so.id
WHERE au.email = 'user@startuppath.ai';