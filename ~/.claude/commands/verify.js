#!/usr/bin/env node
/**
 * Global Verification System Slash Command
 * Usage: /verify [on|off|critical-only|status]
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const CONFIG_PATH = path.join(os.homedir(), '.claude', 'verification-config.json');

const VERIFICATION_MODES = {
  'disabled': {
    database: false,
    filesystem: false,
    git: false,
    deployment: false,
    tokenCost: '0%',
    description: 'No verification - fastest execution'
  },
  
  'critical': {
    database: true,      // Verify database operations
    filesystem: false,   // Skip file operations
    git: false,          // Skip git operations  
    deployment: true,    // Verify deployments
    tokenCost: '+10%',
    description: 'Verify only critical operations (database, deployments)'
  },
  
  'full': {
    database: true,
    filesystem: true,
    git: true,
    deployment: true,
    tokenCost: '+20-30%',
    description: 'Verify all operations - maximum safety'
  }
};

class VerificationController {
  
  static async loadConfig() {
    try {
      const data = await fs.readFile(CONFIG_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Default config
      return {
        mode: 'disabled',
        lastChanged: new Date().toISOString(),
        changedBy: 'system',
        version: '1.0.0'
      };
    }
  }
  
  static async saveConfig(config) {
    await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
  }
  
  static async setMode(mode) {
    if (!VERIFICATION_MODES[mode]) {
      throw new Error(`Invalid mode: ${mode}. Valid modes: ${Object.keys(VERIFICATION_MODES).join(', ')}`);
    }
    
    const config = await this.loadConfig();
    config.mode = mode;
    config.lastChanged = new Date().toISOString();
    config.changedBy = 'user';
    
    await this.saveConfig(config);
    
    // Set global environment variable for runtime
    process.env.CLAUDE_VERIFICATION_MODE = mode;
    
    return VERIFICATION_MODES[mode];
  }
  
  static async getStatus() {
    const config = await this.loadConfig();
    const mode = config.mode || 'disabled';
    const settings = VERIFICATION_MODES[mode];
    
    return `
📊 **Verification System Status**

**Current Mode:** ${mode}
**Description:** ${settings.description}
**Token Impact:** ${settings.tokenCost}
**Last Changed:** ${new Date(config.lastChanged).toLocaleString()}

**Operations Verified:**
${settings.database ? '✅' : '❌'} Database operations (CREATE, ALTER, migrations)
${settings.filesystem ? '✅' : '❌'} File operations (Write, Edit, MultiEdit)  
${settings.git ? '✅' : '❌'} Git operations (commit, push, merge)
${settings.deployment ? '✅' : '❌'} Deployment operations (deploy, publish)

**Available Commands:**
/verify off           → Disable all verification (fastest)
/verify critical-only → Verify only database/deployment operations  
/verify on            → Verify all operations (safest)
/verify status        → Show this status display

**Global Config:** ~/.claude/verification-config.json
`;
  }
  
  static shouldVerify(operationType) {
    const mode = process.env.CLAUDE_VERIFICATION_MODE || 'disabled';
    const settings = VERIFICATION_MODES[mode];
    
    const operationMap = {
      'apply_migration': 'database',
      'execute_sql': 'database',
      'query': 'database',
      'Write': 'filesystem',
      'Edit': 'filesystem',
      'MultiEdit': 'filesystem',
      'git commit': 'git',
      'git push': 'git',
      'deploy': 'deployment',
      'Bash': (params) => {
        if (params.command?.includes('git')) return 'git';
        if (params.command?.includes('deploy')) return 'deployment';
        return 'other';
      }
    };
    
    const category = typeof operationMap[operationType] === 'function' 
      ? operationMap[operationType]({}) 
      : operationMap[operationType] || 'other';
      
    return settings[category] || false;
  }
}

// Main command handler
export default async function verifyCommand(args) {
  const mode = args[0] || 'status';
  
  try {
    switch(mode) {
      case 'on':
      case 'full':
        await VerificationController.setMode('full');
        return '✅ **Verification ENABLED** - All operations will be verified (+20-30% tokens)';
        
      case 'off':
      case 'disable':
      case 'disabled':
        await VerificationController.setMode('disabled');
        return '❌ **Verification DISABLED** - No operation verification (fastest execution)';
        
      case 'critical-only':
      case 'critical':
        await VerificationController.setMode('critical');
        return '⚠️ **Critical Verification ENABLED** - Only database/deployment operations verified (+10% tokens)';
        
      case 'status':
      case 'info':
        return await VerificationController.getStatus();
        
      default:
        return `❌ Unknown command: ${mode}
        
**Usage:** /verify [command]

**Commands:**
- /verify on           → Enable full verification
- /verify off          → Disable verification  
- /verify critical-only → Enable critical-only verification
- /verify status       → Show current status`;
    }
  } catch (error) {
    return `❌ Error: ${error.message}`;
  }
}

// Export for use in other modules
export { VerificationController, VERIFICATION_MODES };