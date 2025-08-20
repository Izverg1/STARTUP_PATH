# Manual User Creation Guide for STARTUP_PATH

## The Issue
The authentication is failing because:
1. The user `user@startuppath.ai` doesn't exist in Supabase Auth
2. Row Level Security (RLS) is preventing user creation via the anon key
3. We need to create the user manually in the Supabase dashboard

## Solution: Create User Manually

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard/project/oftpmcfukkidmjvzeqfc
2. Navigate to **Authentication > Users**

### Step 2: Add New User
1. Click **"Add user"** button
2. Fill in the form:
   - **Email**: `user@startuppath.ai`
   - **Password**: `demo123`
   - **Auto Confirm User**: ✅ **ENABLE THIS** (very important!)
3. Click **"Create user"**

### Step 3: Verify User Creation
The user should now appear in the users list with:
- Email: user@startuppath.ai
- Status: Confirmed (green checkmark)

## Alternative: Disable Email Confirmation (Easier)

### Option A: Disable Email Confirmation Globally
1. Go to **Authentication > Settings**
2. Find **"Enable email confirmations"**
3. **Disable** this setting
4. Now any new signups won't need email confirmation

### Option B: Create User via SQL (if you have SQL access)
```sql
-- This would work if we had service role access
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  'user@startuppath.ai',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

## Test Authentication After Manual Creation

Once you've created the user manually, the authentication should work:

1. Navigate to: http://localhost:3004/login
2. Email: `user@startuppath.ai`
3. Password: `demo123`
4. Click **"Sign In"**
5. Should redirect to dashboard successfully

## Why This Happened

The authentication system expects:
1. A user in `auth.users` (Supabase's internal auth table)
2. Optionally, a profile in our `users` table
3. The auth service has been updated to work without the profile

The user creation through `supabase.auth.signUp()` is failing due to:
- Database triggers or RLS policies
- Email confirmation requirements
- Missing service role permissions

Manual creation bypasses these issues.