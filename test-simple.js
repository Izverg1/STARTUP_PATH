const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Open visible browser
  const page = await browser.newPage();
  
  console.log('Opening site...');
  await page.goto('http://localhost:3002');
  await page.waitForTimeout(2000);
  
  // Check initial state
  console.log('\n=== Slide 1 (Hero) ===');
  let heroVisible = await page.isVisible('text="AI-POWERED"');
  console.log('AI-POWERED visible:', heroVisible);
  
  // Navigate to slide 2
  console.log('\n=== Navigating to Slide 2 ===');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1500);
  
  let problemVisible = await page.isVisible('text="THE PROBLEM"');
  let budgetVisible = await page.isVisible('text="Budget Waste"');
  console.log('THE PROBLEM visible:', problemVisible);
  console.log('Budget Waste visible:', budgetVisible);
  
  // Navigate to slide 3
  console.log('\n=== Navigating to Slide 3 ===');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1500);
  
  let matrixVisible = await page.isVisible('text="NEURAL DISTRIBUTION"');
  console.log('NEURAL DISTRIBUTION visible:', matrixVisible);
  
  // Check if CTA is still interfering
  let ctaInterference = await page.isVisible('text="Ready to"');
  console.log('CTA (Ready to) visible on slide 3:', ctaInterference);
  
  console.log('\nLeaving browser open for manual inspection...');
  console.log('Press Ctrl+C to close');
  
  // Keep browser open
  await page.waitForTimeout(60000);
  await browser.close();
})();