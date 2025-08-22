const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console logs
  page.on('console', msg => {
    console.log('Browser:', msg.text());
  });
  
  // Go to login page
  console.log('🌐 Opening login page...');
  await page.goto('http://localhost:1010/login');
  
  // Wait for page to load
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  console.log('✅ Login page loaded');
  
  // Check if button is in loading state
  const isLoading = await page.$eval('button[type="submit"]', button => {
    return button.textContent.includes('Authenticating');
  });
  
  console.log('Loading state:', isLoading);
  
  if (!isLoading) {
    // Try to log in
    console.log('🔐 Attempting login...');
    await page.click('button[type="submit"]');
    
    // Wait for result
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed or still loading');
    }
  } else {
    console.log('❌ Page is stuck in loading state');
  }
  
  await browser.close();
})().catch(console.error);