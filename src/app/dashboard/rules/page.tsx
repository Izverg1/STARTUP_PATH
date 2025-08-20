'use client';

import React from 'react';
import { RulesBuilder } from '@/components/rules/RulesBuilder';
import { BusinessRule } from '@/types/rules';

export default function RulesPage() {
  // Mock handlers for rule operations
  const handleRuleCreate = (rule: Partial<BusinessRule>) => {
    console.log('Creating rule:', rule);
    // In a real app, this would call an API to create the rule
  };

  const handleRuleUpdate = (ruleId: string, updates: Partial<BusinessRule>) => {
    console.log('Updating rule:', ruleId, updates);
    // In a real app, this would call an API to update the rule
  };

  const handleRuleDelete = (ruleId: string) => {
    console.log('Deleting rule:', ruleId);
    // In a real app, this would call an API to delete the rule
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <span className="text-sm text-orange-400 font-medium">Business Rules Engine</span>
        </div>
        <p className="text-gray-400 text-sm">
          Build intelligent automation rules to optimize your GTM strategy
        </p>
      </div>

      {/* Rules Builder */}
      <div className="flex-1">
        <RulesBuilder
          projectId="demo-project"
          onRuleCreate={handleRuleCreate}
          onRuleUpdate={handleRuleUpdate}
          onRuleDelete={handleRuleDelete}
        />
      </div>

      {/* Bottom Spacing */}
      <div className="pb-8"></div>
    </div>
  );
}