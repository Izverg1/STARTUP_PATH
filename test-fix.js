const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Testing CTA overlap fix...\n');
  
  await page.goto('http://localhost:3002');
  await page.waitForTimeout(2000);
  
  // Test slide 1 (Hero) - should not have CTA content
  console.log('=== Slide 1 (Hero) ===');
  const heroHasCTA = await page.isVisible('text="Ready to"');
  const heroHasHeroContent = await page.isVisible('text="AI-POWERED"');
  console.log('Hero content visible:', heroHasHeroContent ? '✓' : '✗');
  console.log('CTA content visible:', heroHasCTA ? '✗ PROBLEM' : '✓ GOOD');
  
  // Navigate to slide 2
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1500);
  
  console.log('\n=== Slide 2 (Problem) ===');
  const problemHasCTA = await page.isVisible('text="Ready to"');
  const problemHasProblem = await page.isVisible('text="THE PROBLEM"');
  console.log('Problem content visible:', problemHasProblem ? '✓' : '✗');
  console.log('CTA content visible:', problemHasCTA ? '✗ PROBLEM' : '✓ GOOD');
  
  // Navigate to slide 6 (CTA)
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(800);
  }
  
  console.log('\n=== Slide 6 (CTA) ===');
  const ctaHasCTA = await page.isVisible('text="Ready to"');
  const ctaHasForm = await page.isVisible('input[placeholder*="captain"]');
  console.log('CTA content visible:', ctaHasCTA ? '✓' : '✗');
  console.log('Form visible:', ctaHasForm ? '✓' : '✗');
  
  console.log('\n=== SUMMARY ===');
  const success = heroHasHeroContent && !heroHasCTA && problemHasProblem && !problemHasCTA && ctaHasCTA && ctaHasForm;
  console.log('Overall test result:', success ? '✅ SUCCESS - Fix works!' : '❌ FAILED - Still has issues');
  
  await browser.close();
})();