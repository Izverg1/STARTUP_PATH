#!/usr/bin/env node
/**
 * Implementation Verification Hook
 * Triggers after Write/Edit/MultiEdit - requires proof of functionality
 */

const fs = require('fs').promises;
const path = require('path');

class ImplementationHook {
  
  static async execute(context) {
    const { toolName, parameters, result } = context;
    
    // Trigger on file modification tools
    const implementationTools = ['Write', 'Edit', 'MultiEdit', 'mcp__MCP_DOCKER__edit_block'];
    if (!implementationTools.includes(toolName)) return null;
    
    const filePath = parameters.file_path || parameters.path;
    if (!filePath) return null;
    
    // Skip if it's a config/documentation file
    const skipPatterns = ['.md', '.json', '.yml', '.yaml', '.txt', '.gitignore'];
    if (skipPatterns.some(pattern => filePath.includes(pattern))) return null;
    
    console.log('\n🔧 **IMPLEMENTATION VERIFICATION**');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📁 File: ${filePath}`);
    
    // Analyze the changes for implementation keywords
    const content = parameters.new_string || parameters.content || '';
    const implementationKeywords = [
      'function', 'const', 'class', 'interface', 'export',
      'import', 'useState', 'useEffect', 'async', 'await',
      'query', 'mutation', 'api', 'endpoint', 'database'
    ];
    
    const hasImplementation = implementationKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
    
    if (!hasImplementation) {
      console.log('✅ No implementation keywords detected - skipping verification');
      return null;
    }
    
    console.log('\n⚠️ **IMPLEMENTATION DETECTED**');
    console.log('This appears to be functional code that should be tested.');
    
    // Check if it's a component that should be verifiable
    const isComponent = filePath.includes('components/') || filePath.includes('.tsx') || filePath.includes('.jsx');
    const isAPI = filePath.includes('api/') || content.includes('export async function');
    const isUtility = filePath.includes('lib/') || filePath.includes('utils/');
    
    const requirements = [];
    
    if (isComponent) {
      requirements.push('Screenshot showing component renders correctly');
      requirements.push('UI interaction test (click, input, etc.)');
    }
    
    if (isAPI) {
      requirements.push('API endpoint test with curl/Postman');
      requirements.push('Response data validation');
    }
    
    if (isUtility) {
      requirements.push('Function test with sample inputs/outputs');
      requirements.push('Edge case validation');
    }
    
    if (content.includes('supabase') || content.includes('database')) {
      requirements.push('Database query test showing actual data');
      requirements.push('Connection verification');
    }
    
    if (requirements.length > 0) {
      console.log('\n📋 **VERIFICATION REQUIRED**');
      requirements.forEach((req, i) => {
        console.log(`${i + 1}. ${req}`);
      });
      
      console.log('\n🚫 **BEFORE CLAIMING SUCCESS**');
      console.log('• Test the functionality manually');
      console.log('• Provide evidence it actually works');
      console.log('• Show the user-facing result');
      console.log('• Don\'t confuse "code written" with "feature working"');
      
      return {
        warning: true,
        message: `⚠️ Implementation requires verification: ${requirements.length} tests needed`
      };
    }
    
    return null;
  }
}

module.exports = { ImplementationHook };

// CLI execution for testing
if (require.main === module) {
  const testContext = {
    toolName: 'Write',
    parameters: {
      file_path: 'src/components/test.tsx',
      content: 'export function TestComponent() { const [data, setData] = useState([]); return <div>Test</div>; }'
    }
  };
  
  ImplementationHook.execute(testContext)
    .then(result => console.log('Hook result:', result))
    .catch(console.error);
}