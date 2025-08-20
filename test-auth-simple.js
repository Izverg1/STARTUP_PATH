const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Testing STARTUP_PATH Authentication...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the login page
    console.log('📍 Navigating to http://localhost:3004/login');
    await page.goto('http://localhost:3004/login');
    
    // Take a screenshot of the login page
    await page.screenshot({ path: 'login-page-loaded.png', fullPage: true });
    console.log('📸 Screenshot saved: login-page-loaded.png');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Verify the login form elements are present
    const emailInput = await page.locator('input[type="email"]');
    const passwordInput = await page.locator('input[type="password"]');
    const loginButton = await page.locator('button[type="submit"]');
    
    console.log('✅ Email input found:', await emailInput.isVisible());
    console.log('✅ Password input found:', await passwordInput.isVisible());
    console.log('✅ Login button found:', await loginButton.isVisible());
    
    // Check if the form is pre-filled with demo credentials
    const currentEmail = await emailInput.inputValue();
    const currentPassword = await passwordInput.inputValue();
    
    console.log('📧 Pre-filled email:', currentEmail);
    console.log('🔒 Pre-filled password:', currentPassword ? '***hidden***' : 'empty');
    
    // Fill in the credentials if not pre-filled
    if (!currentEmail) {
      await emailInput.fill('user@startuppath.ai');
      console.log('✍️ Filled email: user@startuppath.ai');
    }
    
    if (!currentPassword) {
      await passwordInput.fill('demo123');
      console.log('✍️ Filled password: demo123');
    }
    
    // Take a screenshot with filled credentials
    await page.screenshot({ path: 'login-credentials-filled.png', fullPage: true });
    console.log('📸 Screenshot saved: login-credentials-filled.png');
    
    // Submit the login form
    console.log('🚀 Clicking login button...');
    await loginButton.click();
    
    // Wait for navigation or response
    await page.waitForTimeout(3000); // Wait 3 seconds for auth processing
    
    // Take a screenshot of the result
    await page.screenshot({ path: 'login-result.png', fullPage: true });
    console.log('📸 Screenshot saved: login-result.png');
    
    // Check the current URL
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    // Check if we're redirected to dashboard (success) or still on login (error)
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ SUCCESS! Authentication worked - redirected to dashboard');
      
      // Wait for dashboard to load
      await page.waitForLoadState('networkidle');
      
      // Take a screenshot of the dashboard
      await page.screenshot({ path: 'dashboard-loaded.png', fullPage: true });
      console.log('📸 Screenshot saved: dashboard-loaded.png');
      
    } else if (currentUrl.includes('/login')) {
      console.log('❌ FAILED! Still on login page - authentication failed');
      
      // Check for error messages
      try {
        const errorMessage = await page.locator('[class*="text-red"]').textContent();
        console.log('🚨 Error message:', errorMessage);
      } catch {
        console.log('🚨 No error message found');
      }
      
    } else {
      console.log('⚠️ UNKNOWN! Redirected to unexpected page:', currentUrl);
    }
    
    console.log('\n🔍 Test complete. Check the screenshots for visual confirmation.');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await browser.close();
  }
})();