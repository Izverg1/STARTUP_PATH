#!/usr/bin/env node
/**
 * Response Claims Verification Hook
 * Scans responses for implementation claims and forces proof
 */

const fs = require('fs').promises;
const path = require('path');

class ResponseClaimsHook {
  
  static async execute(context) {
    const { response } = context;
    
    if (!response || typeof response !== 'string') return null;
    
    console.log('\n🔍 **RESPONSE CLAIMS VERIFICATION**');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Detect implementation claims
    const claimPatterns = [
      /I (?:implemented|created|built|added|integrated|connected|deployed|fixed|setup|configured)/gi,
      /(?:Successfully|Now) (?:implemented|created|built|added|integrated|connected|deployed|fixed|setup|configured)/gi,
      /(?:Dynamic|Real|Actual) (?:data loading|database integration|connection)/gi,
      /(?:Working|Functional|Live) (?:feature|integration|connection|database)/gi,
      /(?:Database|API|Feature) (?:integration|connection) (?:working|complete|successful)/gi
    ];
    
    const foundClaims = [];
    
    claimPatterns.forEach(pattern => {
      const matches = response.match(pattern);
      if (matches) {
        foundClaims.push(...matches);
      }
    });
    
    if (foundClaims.length === 0) {
      console.log('✅ No implementation claims detected');
      return null;
    }
    
    console.log('\n⚠️ **IMPLEMENTATION CLAIMS DETECTED**');
    foundClaims.forEach((claim, i) => {
      console.log(`${i + 1}. "${claim}"`);
    });
    
    // Check for proof keywords in the same response
    const proofKeywords = [
      'screenshot', 'test', 'demo', 'working url', 'curl',
      'query result', 'output', 'console', 'error',
      'success', 'verified', 'confirmed', 'tested'
    ];
    
    const hasProof = proofKeywords.some(keyword => 
      response.toLowerCase().includes(keyword)
    );
    
    if (!hasProof) {
      console.log('\n❌ **NO PROOF PROVIDED**');
      console.log('Claims detected but no evidence found in response.');
      
      console.log('\n📋 **REQUIRED EVIDENCE**');
      console.log('• Screenshot of working feature');
      console.log('• Test command output');
      console.log('• Working URL demonstration');
      console.log('• Database query results');
      console.log('• Console logs showing success');
      
      return {
        block: true,
        message: `❌ Response blocked: ${foundClaims.length} implementation claims need proof`
      };
    }
    
    console.log('\n⚠️ **CLAIMS + PROOF DETECTED**');
    console.log('Verify that provided proof actually demonstrates the claims.');
    
    return {
      warning: true,
      message: `⚠️ Verify proof matches claims: ${foundClaims.length} claims detected`
    };
  }
}

module.exports = { ResponseClaimsHook };

// CLI execution for testing
if (require.main === module) {
  const testContext = {
    response: 'I implemented dynamic data loading with real database integration. The feature is now working correctly.'
  };
  
  ResponseClaimsHook.execute(testContext)
    .then(result => console.log('Hook result:', result))
    .catch(console.error);
}