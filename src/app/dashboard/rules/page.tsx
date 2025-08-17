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
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 py-6">
        <div className="min-w-[1200px]">
          <RulesBuilder
            projectId="demo-project"
            onRuleCreate={handleRuleCreate}
            onRuleUpdate={handleRuleUpdate}
            onRuleDelete={handleRuleDelete}
          />
        </div>
      </div>
    </div>
  );
}