-- FINAL USER CREATION SQL
-- Copy and paste this into Supabase SQL Editor and run it

-- 1. Create demo organization
INSERT INTO spath_orgs (id, name, slug, settings, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'STARTUP_PATH Demo',
    'startup-path-demo', 
    '{"demo": true}',
    NOW(),
    NOW()
) ON CONFLICT (slug) DO NOTHING;

-- 2. Create auth user with confirmed email
DO $$
DECLARE
    demo_user_id uuid := gen_random_uuid();
BEGIN
    -- Create user in auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data
    ) VALUES (
        demo_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'user@startuppath.ai',
        crypt('demo123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Demo User"}'
    );
    
    -- Create user profile in spath_users
    INSERT INTO spath_users (
        id,
        email,
        name,
        org_id,
        role,
        settings,
        created_at,
        updated_at
    ) VALUES (
        demo_user_id,
        'user@startuppath.ai',
        'Demo User',
        '11111111-1111-1111-1111-111111111111'::uuid,
        'owner',
        '{"demo": true}',
        NOW(),
        NOW()
    );
    
    RAISE NOTICE 'User created successfully with ID: %', demo_user_id;
END $$;

-- 3. Verify the user was created
SELECT 
    au.id,
    au.email,
    au.email_confirmed_at IS NOT NULL as confirmed,
    su.name,
    su.role,
    so.name as org_name
FROM auth.users au
JOIN spath_users su ON au.id = su.id  
JOIN spath_orgs so ON su.org_id = so.id
WHERE au.email = 'user@startuppath.ai';