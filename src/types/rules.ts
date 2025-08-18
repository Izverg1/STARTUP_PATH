// Business rules types for STARTUP_PATH platform
// Covers rule conditions, actions, versioning, and approval workflows

import { BaseEntity, AgentKey, ChannelType } from './index';

// =============================================================================
// Core Rule Types
// =============================================================================

export interface BusinessRule extends BaseEntity {
  name: string;
  description: string;
  project_id: string;
  ruleset_id: string;
  priority: number;
  is_active: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
  metadata: RuleMetadata;
  approval_status: ApprovalStatus;
  version: number;
}

export interface RuleSet extends BaseEntity {
  name: string;
  description: string;
  project_id: string;
  rules: string[]; // rule IDs
  is_active: boolean;
  version: RuleSetVersion;
  approval_workflow: ApprovalWorkflow;
  activation_schedule?: ActivationSchedule;
}

// =============================================================================
// Rule Conditions
// =============================================================================

export interface RuleCondition {
  id: string;
  type: ConditionType;
  field: ConditionField;
  operator: ConditionOperator;
  value: ConditionValue;
  aggregation?: AggregationConfig;
  time_window?: TimeWindow;
  logical_operator?: LogicalOperator; // for combining with next condition
}

export type ConditionType = 
  | 'metric_threshold'
  | 'trend_detection'
  | 'anomaly_detection'
  | 'time_based'
  | 'event_based'
  | 'comparative'
  | 'custom';

export type ConditionField = 
  | 'cpqm'
  | 'cac'
  | 'cac_payback_months'
  | 'mer'
  | 'cpo'
  | 'conversion_rate'
  | 'click_through_rate'
  | 'reply_rate'
  | 'meeting_show_rate'
  | 'opportunity_rate'
  | 'close_rate'
  | 'budget_utilization'
  | 'daily_spend'
  | 'total_meetings'
  | 'qualified_leads'
  | 'pipeline_value'
  | 'channel_performance'
  | 'experiment_duration'
  | 'sample_size'
  | 'statistical_significance';

export type ConditionOperator = 
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'greater_than_or_equal'
  | 'less_than'
  | 'less_than_or_equal'
  | 'between'
  | 'not_between'
  | 'in'
  | 'not_in'
  | 'contains'
  | 'not_contains'
  | 'is_trending_up'
  | 'is_trending_down'
  | 'is_anomalous'
  | 'has_changed_by'
  | 'is_above_benchmark'
  | 'is_below_benchmark';

export type ConditionValue = string | number | boolean | string[] | number[] | DateRange | object;

export interface DateRange {
  start: string;
  end: string;
}

export interface AggregationConfig {
  function: AggregationFunction;
  period: AggregationPeriod;
  minimum_sample_size?: number;
}

export type AggregationFunction = 'sum' | 'average' | 'median' | 'min' | 'max' | 'count' | 'std_dev';
export type AggregationPeriod = 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface TimeWindow {
  duration: number;
  unit: TimeUnit;
  offset?: number; // lookback offset
  consecutive_periods_required?: number;
}

export type TimeUnit = 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
export type LogicalOperator = 'AND' | 'OR' | 'NOT';

// =============================================================================
// Rule Actions
// =============================================================================

export interface RuleAction {
  id: string;
  type: ActionType;
  parameters: ActionParameters;
  delay?: ActionDelay;
  conditions?: ActionCondition[];
  rollback_strategy?: RollbackStrategy;
}

export type ActionType = 
  | 'pause_channel'
  | 'resume_channel'
  | 'adjust_budget'
  | 'reallocate_budget'
  | 'send_notification'
  | 'create_task'
  | 'trigger_agent'
  | 'update_gates'
  | 'end_experiment'
  | 'create_decision'
  | 'escalate_approval'
  | 'archive_data'
  | 'export_report'
  | 'webhook_call'
  | 'custom_script';

export interface ActionParameters {
  [key: string]: any;
  // Action-specific parameters
}

// Specific action parameter types
export interface PauseChannelParams extends ActionParameters {
  channel_id?: string; // if not specified, applies to all channels
  reason: string;
  notify_stakeholders: boolean;
  preserve_budget: boolean;
}

export interface AdjustBudgetParams extends ActionParameters {
  channel_id?: string;
  adjustment_type: 'absolute' | 'percentage' | 'target_value';
  adjustment_value: number;
  minimum_budget?: number;
  maximum_budget?: number;
  rationale: string;
}

export interface ReallocateBudgetParams extends ActionParameters {
  source_channels: string[];
  target_channels: string[];
  reallocation_strategy: 'proportional' | 'performance_based' | 'equal' | 'custom';
  reallocation_amount?: number;
  rationale: string;
}

export interface NotificationParams extends ActionParameters {
  recipients: NotificationRecipient[];
  message_template: string;
  severity: NotificationSeverity;
  channels: NotificationChannel[];
  include_data_snapshot: boolean;
}

export interface CreateTaskParams extends ActionParameters {
  title: string;
  description: string;
  assignee_id?: string;
  due_date?: string;
  priority: TaskPriority;
  category: TaskCategory;
  auto_resolve_conditions?: RuleCondition[];
}

export interface TriggerAgentParams extends ActionParameters {
  agent_key: AgentKey;
  action: string;
  input_data?: any;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  timeout_minutes?: number;
}

export interface UpdateGatesParams extends ActionParameters {
  gate_updates: GateUpdate[];
  apply_to_channels?: string[];
  rationale: string;
}

export interface GateUpdate {
  gate_id: string;
  new_threshold?: number;
  new_operator?: ConditionOperator;
  new_window_days?: number;
  is_active?: boolean;
}

export interface CreateDecisionParams extends ActionParameters {
  decision_type: 'scale' | 'iterate' | 'kill';
  scope: 'experiment' | 'channel' | 'campaign';
  target_id: string;
  rationale: string;
  supporting_data: any;
  requires_approval: boolean;
  auto_implement: boolean;
}

export interface WebhookCallParams extends ActionParameters {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  payload?: any;
  retry_config?: RetryConfig;
  authentication?: WebhookAuth;
}

export interface ActionDelay {
  duration: number;
  unit: TimeUnit;
  conditions?: RuleCondition[]; // conditions that can override delay
}

export interface ActionCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
  description: string;
}

export interface RollbackStrategy {
  enabled: boolean;
  triggers: RollbackTrigger[];
  actions: RuleAction[];
  max_rollback_attempts: number;
}

export interface RollbackTrigger {
  condition: RuleCondition;
  delay: ActionDelay;
}

// =============================================================================
// Supporting Types
// =============================================================================

export interface NotificationRecipient {
  type: 'user' | 'role' | 'email' | 'slack_channel';
  identifier: string;
  name?: string;
}

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'critical';
export type NotificationChannel = 'email' | 'slack' | 'sms' | 'in_app' | 'webhook';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 
  | 'optimization'
  | 'investigation'
  | 'configuration'
  | 'approval'
  | 'escalation'
  | 'maintenance';

export interface RetryConfig {
  max_attempts: number;
  backoff_strategy: 'linear' | 'exponential' | 'fixed';
  initial_delay_ms: number;
  max_delay_ms: number;
}

export interface WebhookAuth {
  type: 'none' | 'api_key' | 'bearer_token' | 'basic' | 'oauth';
  credentials: Record<string, string>;
}

// =============================================================================
// Rule Versioning & Approval
// =============================================================================

export interface RuleVersion extends BaseEntity {
  rule_id: string;
  version_number: number;
  changes: RuleChange[];
  change_summary: string;
  author_id: string;
  approval_status: ApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  activation_date?: string;
  is_current: boolean;
}

export interface RuleSetVersion extends BaseEntity {
  ruleset_id: string;
  version_number: number;
  rules_snapshot: string[]; // rule IDs at this version
  change_summary: string;
  author_id: string;
  approval_status: ApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  activation_date?: string;
  is_current: boolean;
}

export interface RuleChange {
  type: ChangeType;
  field: string;
  old_value?: any;
  new_value?: any;
  description: string;
}

export type ChangeType = 
  | 'created'
  | 'modified'
  | 'deleted'
  | 'activated'
  | 'deactivated'
  | 'condition_added'
  | 'condition_removed'
  | 'condition_modified'
  | 'action_added'
  | 'action_removed'
  | 'action_modified'
  | 'priority_changed'
  | 'metadata_updated';

export type ApprovalStatus = 
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'auto_approved'
  | 'expired';

export interface ApprovalWorkflow extends BaseEntity {
  name: string;
  description: string;
  steps: ApprovalStep[];
  auto_approval_rules?: AutoApprovalRule[];
  escalation_rules?: EscalationRule[];
  timeout_behavior: TimeoutBehavior;
}

export interface ApprovalStep {
  order: number;
  name: string;
  approver_type: ApproverType;
  approver_identifiers: string[];
  required_approvals: number;
  timeout_hours?: number;
  can_reject: boolean;
  can_modify: boolean;
  conditions?: ApprovalCondition[];
}

export type ApproverType = 'user' | 'role' | 'group' | 'external_system';

export interface AutoApprovalRule {
  conditions: RuleCondition[];
  max_impact_score?: number;
  excluded_action_types?: ActionType[];
  requires_peer_review: boolean;
}

export interface EscalationRule {
  trigger_conditions: RuleCondition[];
  escalation_delay_hours: number;
  escalate_to: ApprovalStep;
  notification_template: string;
}

export interface ApprovalCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
  description: string;
}

export type TimeoutBehavior = 'auto_approve' | 'auto_reject' | 'escalate' | 'extend';

export interface ActivationSchedule {
  type: 'immediate' | 'scheduled' | 'conditional';
  scheduled_date?: string;
  conditions?: RuleCondition[];
  rollout_strategy?: RolloutStrategy;
}

export interface RolloutStrategy {
  type: 'all_at_once' | 'gradual' | 'canary';
  phases?: RolloutPhase[];
  success_criteria?: SuccessCriteria[];
  rollback_triggers?: RollbackTrigger[];
}

export interface RolloutPhase {
  name: string;
  percentage: number;
  target_entities?: string[];
  duration_hours?: number;
  success_threshold?: number;
}

export interface SuccessCriteria {
  metric: string;
  operator: ConditionOperator;
  value: number;
  measurement_window_hours: number;
}

// =============================================================================
// Rule Execution & Monitoring
// =============================================================================

export interface RuleExecution extends BaseEntity {
  rule_id: string;
  trigger_event: TriggerEvent;
  evaluation_result: EvaluationResult;
  actions_taken: ActionExecution[];
  execution_time_ms: number;
  status: ExecutionStatus;
  error_details?: ExecutionError;
}

export interface TriggerEvent {
  type: TriggerEventType;
  source: string;
  timestamp: string;
  data: any;
  context: ExecutionContext;
}

export type TriggerEventType = 
  | 'metric_update'
  | 'scheduled_check'
  | 'manual_trigger'
  | 'agent_completion'
  | 'external_webhook'
  | 'threshold_breach'
  | 'anomaly_detected';

export interface ExecutionContext {
  project_id: string;
  experiment_id?: string;
  channel_id?: string;
  user_id?: string;
  correlation_id: string;
  metadata: Record<string, any>;
}

export interface EvaluationResult {
  conditions_met: boolean;
  condition_results: ConditionResult[];
  overall_confidence: number;
  evaluation_time_ms: number;
  data_freshness: DataFreshness;
}

export interface ConditionResult {
  condition_id: string;
  result: boolean;
  actual_value: any;
  expected_value: any;
  confidence: number;
  evaluation_notes?: string;
}

export interface DataFreshness {
  oldest_data_age_minutes: number;
  newest_data_age_minutes: number;
  completeness_percentage: number;
  quality_score: number;
}

export interface ActionExecution {
  action_id: string;
  action_type: ActionType;
  status: ActionExecutionStatus;
  start_time: string;
  end_time?: string;
  duration_ms?: number;
  result: ActionResult;
  retry_count: number;
  error_details?: ActionError;
}

export type ActionExecutionStatus = 
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'cancelled'
  | 'retrying';

export interface ActionResult {
  success: boolean;
  data?: any;
  side_effects?: SideEffect[];
  rollback_info?: RollbackInfo;
}

export interface SideEffect {
  type: string;
  description: string;
  entity_affected: string;
  reversible: boolean;
}

export interface RollbackInfo {
  rollback_id: string;
  can_rollback: boolean;
  rollback_deadline?: string;
  rollback_complexity: 'simple' | 'complex' | 'manual';
}

export interface ActionError {
  code: string;
  message: string;
  details: any;
  retry_recommended: boolean;
  manual_intervention_required: boolean;
}

export type ExecutionStatus = 'success' | 'partial_success' | 'failure' | 'cancelled';

export interface ExecutionError {
  type: 'condition_evaluation' | 'action_execution' | 'system_error' | 'timeout';
  message: string;
  details: any;
  recoverable: boolean;
}

// =============================================================================
// Rule Analytics & Monitoring
// =============================================================================

export interface RuleAnalytics extends BaseEntity {
  rule_id: string;
  time_period: TimePeriod;
  execution_stats: ExecutionStats;
  impact_analysis: ImpactAnalysis;
  performance_metrics: RulePerformanceMetrics;
  optimization_suggestions: OptimizationSuggestion[];
}

export interface ExecutionStats {
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  average_execution_time_ms: number;
  trigger_frequency: TriggerFrequencyStats;
  action_success_rates: ActionSuccessRate[];
}

export interface TriggerFrequencyStats {
  triggers_per_day: number;
  peak_trigger_hour: number;
  trigger_distribution: HourlyDistribution[];
}

export interface HourlyDistribution {
  hour: number;
  count: number;
  percentage: number;
}

export interface ActionSuccessRate {
  action_type: ActionType;
  success_rate: number;
  total_attempts: number;
  average_duration_ms: number;
}

export interface ImpactAnalysis {
  total_budget_affected: number;
  channels_modified: number;
  decisions_created: number;
  notifications_sent: number;
  tasks_created: number;
  estimated_cost_savings: number;
  estimated_performance_improvement: number;
}

export interface RulePerformanceMetrics {
  precision: number; // true positives / (true positives + false positives)
  recall: number; // true positives / (true positives + false negatives)
  f1_score: number;
  false_positive_rate: number;
  average_response_time_minutes: number;
  effectiveness_score: number;
}

export interface OptimizationSuggestion {
  type: 'condition_tuning' | 'action_modification' | 'timing_adjustment' | 'deactivation';
  description: string;
  rationale: string;
  potential_impact: number;
  confidence: number;
  implementation_effort: 'low' | 'medium' | 'high';
}

// =============================================================================
// Rule Templates & Library
// =============================================================================

export interface RuleTemplate extends BaseEntity {
  name: string;
  description: string;
  category: RuleCategory;
  use_case: string;
  industry?: string[];
  business_size?: string[];
  template_conditions: TemplateCondition[];
  template_actions: TemplateAction[];
  configuration_parameters: ConfigurationParameter[];
  success_metrics: string[];
  documentation_url?: string;
}

export type RuleCategory = 
  | 'performance_optimization'
  | 'budget_management'
  | 'quality_control'
  | 'risk_mitigation'
  | 'automation'
  | 'compliance'
  | 'alerting';

export interface TemplateCondition {
  name: string;
  description: string;
  field: ConditionField;
  operator: ConditionOperator;
  default_value?: any;
  configurable: boolean;
  required: boolean;
}

export interface TemplateAction {
  name: string;
  description: string;
  type: ActionType;
  default_parameters?: ActionParameters;
  configurable_parameters: string[];
  optional: boolean;
}

export interface ConfigurationParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multi_select';
  description: string;
  default_value?: any;
  options?: ParameterOption[];
  validation_rules?: ValidationRule[];
  help_text?: string;
}

export interface ParameterOption {
  label: string;
  value: any;
  description?: string;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

// =============================================================================
// Rule Metadata
// =============================================================================

export interface RuleMetadata {
  tags: string[];
  business_justification: string;
  risk_assessment: RiskAssessment;
  testing_strategy: TestingStrategy;
  documentation: RuleDocumentation;
  dependencies: RuleDependency[];
  compliance_requirements?: ComplianceRequirement[];
}

export interface RiskAssessment {
  overall_risk: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: RiskFactor[];
  mitigation_strategies: string[];
  impact_if_failure: string;
}

export interface RiskFactor {
  category: 'financial' | 'operational' | 'compliance' | 'technical';
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export interface TestingStrategy {
  test_approach: 'canary' | 'ab_test' | 'shadow_mode' | 'gradual_rollout';
  test_duration_days: number;
  success_criteria: SuccessCriteria[];
  rollback_plan: string;
}

export interface RuleDocumentation {
  purpose: string;
  business_logic: string;
  implementation_notes: string;
  known_limitations: string[];
  related_rules: string[];
  change_log: ChangeLogEntry[];
}

export interface ChangeLogEntry {
  version: number;
  date: string;
  author: string;
  description: string;
  breaking_changes: boolean;
}

export interface RuleDependency {
  type: 'rule' | 'agent' | 'data_source' | 'external_system';
  identifier: string;
  description: string;
  criticality: 'optional' | 'recommended' | 'required';
}

export interface ComplianceRequirement {
  framework: string; // e.g., "GDPR", "SOX", "HIPAA"
  requirement_id: string;
  description: string;
  implementation_notes: string;
}