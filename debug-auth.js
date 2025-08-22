// Simple Node.js script to test auth service in isolation
console.log('🔍 Testing auth service...')

const AUTH_CONFIG = {
  DEMO_USER: {
    email: 'user@startuppath.ai',
    password: 'demo123',
    name: 'Demo User',
    role: 'owner',
    org: 'STARTUP_PATH Demo',
    orgId: 'spath-demo-org-001'
  },
  SESSION: {
    duration: 24 * 60 * 60 * 1000,
    storageKey: 'spath-auth-session'
  },
  DEV: {
    bypassSupabaseAuth: true,
    useFallbackAuth: true
  }
}

// Test the login
async function testDemoLogin(email, password) {
  console.log('Testing demo login with:', { email, password })
  
  if (email !== AUTH_CONFIG.DEMO_USER.email || password !== AUTH_CONFIG.DEMO_USER.password) {
    throw new Error('Invalid credentials')
  }
  
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const user = {
    id: 'demo-user-001',
    email: AUTH_CONFIG.DEMO_USER.email,
    name: AUTH_CONFIG.DEMO_USER.name,
    role: AUTH_CONFIG.DEMO_USER.role,
    orgId: AUTH_CONFIG.DEMO_USER.orgId,
    orgName: AUTH_CONFIG.DEMO_USER.org,
    lastLogin: new Date().toISOString(),
    onboardingCompleted: true
  }
  
  console.log('✅ Demo login successful:', user)
  return user
}

testDemoLogin('user@startuppath.ai', 'demo123')
  .then(() => console.log('✅ Auth test passed'))
  .catch(err => console.error('❌ Auth test failed:', err))
