import { DEMO_DATA } from './seed-data';
import { DemoDataUtils } from './demo-mode';

// Validation and testing utilities for demo data
export function validateDemoDataPatterns() {
  const { experiment, channels, gates, results, icp } = DEMO_DATA;
  
  console.log('=== DEMO DATA VALIDATION ===');
  
  // ICP Validation
  console.log('\n📊 ICP Data:');
  console.log(`Persona: ${icp.persona}`);
  console.log(`Company Size: ${icp.company_size}`);
  console.log(`ACV Range: $${icp.acv_range.min.toLocaleString()} - $${icp.acv_range.max.toLocaleString()}`);
  console.log(`Gross Margin: ${(icp.gross_margin_percent * 100).toFixed(1)}%`);
  
  // Experiment Validation
  console.log('\n🧪 Experiment Data:');
  console.log(`Name: ${experiment.name}`);
  console.log(`Status: ${experiment.status}`);
  console.log(`Budget: $${experiment.budget_allocated.toLocaleString()}`);
  console.log(`Target CPQM: $${experiment.target_cpqm}`);
  console.log(`Max Payback: ${experiment.max_cac_payback_months} months`);
  
  // Channels Validation
  console.log('\n📈 Channels Data:');
  channels.forEach(channel => {
    console.log(`- ${channel.name} (${channel.type})`);
    console.log(`  Budget: $${channel.allocated_budget.toLocaleString()} (${(channel.current_weight * 100).toFixed(1)}%)`);
    console.log(`  Active: ${channel.is_active}`);
  });
  
  // Gates Validation
  console.log('\n🚪 Gates Data:');
  const gatesByChannel = gates.reduce((acc, gate) => {
    const channelName = channels.find(c => c.id === gate.channel_id)?.name || 'Unknown';
    if (!acc[channelName]) acc[channelName] = [];
    acc[channelName].push(gate);
    return acc;
  }, {} as Record<string, typeof gates>);
  
  Object.entries(gatesByChannel).forEach(([channelName, channelGates]) => {
    console.log(`- ${channelName}:`);
    channelGates.forEach(gate => {
      console.log(`  ${gate.name}: ${gate.metric} ${gate.operator} ${gate.threshold_value} (${gate.window_days}d)`);
    });
  });
  
  // Results Validation - Performance Patterns
  console.log('\n📊 Results Analysis:');
  const channelPerformance = DemoDataUtils.calculateChannelPerformance(results, channels);
  
  channelPerformance.forEach(perf => {
    console.log(`\n${perf.channelName}:`);
    console.log(`  Total Cost: $${Math.round(perf.totalCost).toLocaleString()}`);
    console.log(`  Total Leads: ${perf.totalLeads}`);
    console.log(`  Total Meetings: ${perf.totalMeetings}`);
    console.log(`  Cost per Lead: $${Math.round(perf.costPerLead)}`);
    console.log(`  Cost per Meeting: $${Math.round(perf.costPerMeeting)}`);
    console.log(`  Conversion Rate: ${(perf.conversionRate * 100).toFixed(3)}%`);
    console.log(`  Win Rate: ${(perf.winRate * 100).toFixed(1)}%`);
  });
  
  // Funnel Analysis
  console.log('\n🔄 Funnel Analysis (14-day totals):');
  const totalMetrics = results.reduce((acc, result) => {
    Object.keys(result.metrics).forEach(key => {
      acc[key] = (acc[key] || 0) + (result.metrics[key as keyof typeof result.metrics] as number);
    });
    return acc;
  }, {} as Record<string, number>);
  
  console.log(`Impressions: ${totalMetrics.impressions?.toLocaleString() || 'N/A'}`);
  console.log(`Clicks: ${totalMetrics.clicks?.toLocaleString() || 'N/A'} (${((totalMetrics.clicks / totalMetrics.impressions) * 100).toFixed(2)}% CTR)`);
  console.log(`Leads: ${totalMetrics.leads?.toLocaleString() || 'N/A'} (${((totalMetrics.leads / totalMetrics.clicks) * 100).toFixed(2)}% Lead Rate)`);
  console.log(`Meetings Scheduled: ${totalMetrics.meetings_scheduled?.toLocaleString() || 'N/A'}`);
  console.log(`Meetings Held: ${totalMetrics.meetings_held?.toLocaleString() || 'N/A'} (${((totalMetrics.meetings_held / totalMetrics.meetings_scheduled) * 100).toFixed(1)}% Show Rate)`);
  console.log(`Opportunities: ${totalMetrics.opportunities?.toLocaleString() || 'N/A'}`);
  console.log(`Wins: ${totalMetrics.wins?.toLocaleString() || 'N/A'} (${((totalMetrics.wins / totalMetrics.opportunities) * 100).toFixed(1)}% Win Rate)`);
  
  // Time Series Validation
  console.log('\n📅 Time Series Patterns:');
  const dailyTotals = results.reduce((acc, result) => {
    if (!acc[result.date]) {
      acc[result.date] = { leads: 0, cost: 0 };
    }
    acc[result.date].leads += result.metrics.leads;
    acc[result.date].cost += result.costs.total_cost;
    return acc;
  }, {} as Record<string, { leads: number; cost: number }>);
  
  const sortedDates = Object.keys(dailyTotals).sort();
  console.log('Daily Performance:');
  sortedDates.forEach(date => {
    const day = dailyTotals[date];
    console.log(`  ${date}: ${day.leads} leads, $${Math.round(day.cost).toLocaleString()} cost`);
  });
  
  // Data Quality Validation
  const validation = DemoDataUtils.validateDemoData(DEMO_DATA);
  console.log('\n✅ Data Quality Check:');
  console.log(`Valid: ${validation.isValid}`);
  if (validation.errors.length > 0) {
    console.log('Errors:');
    validation.errors.forEach(error => console.log(`  - ${error}`));
  }
  if (validation.warnings.length > 0) {
    console.log('Warnings:');
    validation.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  console.log('\n=== VALIDATION COMPLETE ===');
  
  return {
    icp,
    experiment,
    channels: channels.length,
    gates: gates.length,
    results: results.length,
    channelPerformance,
    totalMetrics,
    validation,
    summary: {
      totalBudget: experiment.budget_allocated,
      totalCost: Object.values(dailyTotals).reduce((sum, day) => sum + day.cost, 0),
      totalLeads: Object.values(dailyTotals).reduce((sum, day) => sum + day.leads, 0),
      averageCPL: Object.values(dailyTotals).reduce((sum, day) => sum + day.cost, 0) / Object.values(dailyTotals).reduce((sum, day) => sum + day.leads, 0),
      daysOfData: sortedDates.length
    }
  };
}

// Export validation function for use in tests or admin panel
export default validateDemoDataPatterns;