#!/usr/bin/env node
/**
 * Todo Completion Verification Hook
 * Triggers after TodoWrite tool usage - prevents false completion claims
 */

const fs = require('fs').promises;
const path = require('path');

class TodoCompletionHook {
  
  static async execute(context) {
    const { toolName, parameters, result } = context;
    
    // Only trigger on TodoWrite tool
    if (toolName !== 'TodoWrite') return null;
    
    const todos = parameters.todos || [];
    const completedTodos = todos.filter(todo => todo.status === 'completed');
    
    if (completedTodos.length === 0) return null;
    
    console.log('\n🔍 **TODO COMPLETION VERIFICATION**');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const violations = [];
    
    for (const todo of completedTodos) {
      console.log(`\n📋 Verifying: "${todo.content}"`);
      
      // Check for implementation keywords that require proof
      const implementationKeywords = [
        'implement', 'create', 'build', 'add', 'integrate', 
        'connect', 'deploy', 'fix', 'setup', 'configure'
      ];
      
      const hasImplementation = implementationKeywords.some(keyword => 
        todo.content.toLowerCase().includes(keyword)
      );
      
      if (hasImplementation) {
        violations.push({
          todo: todo.content,
          issue: 'Implementation task marked complete without verification',
          requirement: 'Must provide proof of working functionality'
        });
      }
    }
    
    if (violations.length > 0) {
      console.log('\n❌ **VERIFICATION FAILURES**');
      violations.forEach((v, i) => {
        console.log(`\n${i + 1}. ${v.todo}`);
        console.log(`   Issue: ${v.issue}`);
        console.log(`   Required: ${v.requirement}`);
      });
      
      console.log('\n🚫 **ACTION REQUIRED**');
      console.log('Provide evidence for each completed implementation:');
      console.log('• Screenshot of working feature');
      console.log('• Successful test run output');
      console.log('• Working URL/endpoint');
      console.log('• Database query showing data');
      
      return {
        block: true,
        message: `❌ Todo completion blocked: ${violations.length} items need verification evidence`
      };
    }
    
    console.log('\n✅ All completed todos verified');
    return null;
  }
}

module.exports = { TodoCompletionHook };

// CLI execution for testing
if (require.main === module) {
  const testContext = {
    toolName: 'TodoWrite',
    parameters: {
      todos: [
        { content: 'Implement user authentication', status: 'completed' },
        { content: 'Research API documentation', status: 'completed' }
      ]
    }
  };
  
  TodoCompletionHook.execute(testContext)
    .then(result => console.log('Hook result:', result))
    .catch(console.error);
}