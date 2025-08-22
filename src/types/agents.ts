// Agent types for STARTUP_PATH platform
// Covers Agent states, configurations, and artifact types

import { BaseEntity } from './index';

// =============================================================================
// Agent State & Core Types
// =============================================================================

export type AgentState = 'idle' | 'working' | 'blocked' | 'done';

export interface Agent extends BaseEntity {
  key: AgentKey;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
  configuration: AgentConfiguration;
  capabilities: AgentCapability[];
}

export interface AgentStatus extends BaseEntity {
  agent_key: AgentKey;
  status: AgentState;
  status_line: string;
  progress_percent?: number;
  current_task?: string;
  last_activity: string;
  error_message?: string;
  estimated_completion?: string;
}

export type AgentKey = 'channel_discovery_engine' | 'campaign_optimization_engine' | 'performance_analytics_engine' | 'budget_allocation_engine';

// =============================================================================
// Agent Configurations
// =============================================================================

export interface AgentConfiguration {
  enabled: boolean;
  priority: number;
  execution_frequency: ExecutionFrequency;
  parameters: AgentParameters;
  constraints: AgentConstraints;
}

export type ExecutionFrequency = 'real_time' | 'hourly' | 'daily' | 'weekly' | 'on_demand';

export interface AgentParameters {
  [key: string]: any;
}

export interface AgentConstraints {
  max_execution_time_minutes: number;
  max_daily_executions?: number;
  required_data_points?: number;
  confidence_threshold?: number;
}

// =============================================================================
// Channel Discovery Engine
// =============================================================================

export interface ChannelDiscoveryEngineConfig extends AgentConfiguration {
  parameters: ChannelDiscoveryEngineParameters;
}

export interface ChannelDiscoveryEngineParameters extends AgentParameters {
  benchmark_sources: string[];
  confidence_threshold: number;
  max_channels_to_suggest: number;
  include_experimental_channels: boolean;
  icp_matching_weight: number;
  performance_history_weight: number;
}

export interface ChannelDiscoveryEngineCapability extends AgentCapability {
  type: 'channel_discovery' | 'gate_recommendation' | 'benchmark_analysis';
}

// =============================================================================
// Campaign Optimization Engine
// =============================================================================

export interface CampaignOptimizationEngineConfig extends AgentConfiguration {
  parameters: CampaignOptimizationEngineParameters;
}

export interface CampaignOptimizationEngineParameters extends AgentParameters {
  copy_variants_per_test: number;
  tone_preferences: TonePreference[];
  include_personalization: boolean;
  ab_test_confidence_level: number;
  max_subject_line_length: number;
  max_body_length: number;
  compliance_checks: ComplianceCheck[];
}

export type TonePreference = 'professional' | 'casual' | 'urgent' | 'consultative' | 'friendly';

export interface ComplianceCheck {
  type: 'gdpr' | 'can_spam' | 'industry_specific';
  enabled: boolean;
  strict_mode: boolean;
}

export interface CampaignOptimizationEngineCapability extends AgentCapability {
  type: 'copy_generation' | 'ab_test_design' | 'personalization' | 'compliance_check';
}

// =============================================================================
// Performance Analytics Engine
// =============================================================================

export interface PerformanceAnalyticsEngineConfig extends AgentConfiguration {
  parameters: PerformanceAnalyticsEngineParameters;
}

export interface PerformanceAnalyticsEngineParameters extends AgentParameters {
  anomaly_detection_sensitivity: number;
  statistical_significance_threshold: number;
  minimum_sample_size: number;
  lookback_days: number;
  forecast_horizon_days: number;
  alert_thresholds: AlertThreshold[];
}

export interface AlertThreshold {
  metric: string;
  operator: 'above' | 'below' | 'change_percent';
  value: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceAnalyticsEngineCapability extends AgentCapability {
  type: 'metric_calculation' | 'anomaly_detection' | 'forecasting' | 'alert_generation';
}

// =============================================================================
// Budget Allocation Engine
// =============================================================================

export interface BudgetAllocationEngineConfig extends AgentConfiguration {
  parameters: BudgetAllocationEngineParameters;
}

export interface BudgetAllocationEngineParameters extends AgentParameters {
  allocation_strategy: AllocationStrategy;
  reallocation_threshold_percent: number;
  minimum_budget_percent: number;
  maximum_budget_percent: number;
  exploration_rate: number; // Thompson Sampling exploration vs exploitation
  lookback_window_days: number;
  confidence_interval: number;
}

export type AllocationStrategy = 'thompson_sampling' | 'epsilon_greedy' | 'ucb' | 'manual';

export interface BudgetAllocationEngineCapability extends AgentCapability {
  type: 'budget_optimization' | 'allocation_strategy' | 'performance_modeling' | 'risk_assessment';
}

// =============================================================================
// Agent Capabilities
// =============================================================================

export interface AgentCapability {
  name: string;
  description: string;
  type: string;
  inputs: CapabilityInput[];
  outputs: CapabilityOutput[];
  dependencies: string[];
}

export interface CapabilityInput {
  name: string;
  type: string;
  required: boolean;
  description: string;
  validation_rules?: ValidationRule[];
}

export interface CapabilityOutput {
  name: string;
  type: string;
  description: string;
  format?: OutputFormat;
}

export interface ValidationRule {
  type: 'range' | 'pattern' | 'enum' | 'custom';
  parameters: any;
  error_message: string;
}

export type OutputFormat = 'json' | 'markdown' | 'csv' | 'chart_data';

// =============================================================================
// Artifact Types
// =============================================================================

export type ArtifactType = 'benchmark' | 'copy' | 'calc' | 'alloc';

export interface Artifact extends BaseEntity {
  type: ArtifactType;
  agent_key: AgentKey;
  title: string;
  description?: string;
  content: ArtifactContent;
  metadata: ArtifactMetadata;
  project_id: string;
  experiment_id?: string;
  channel_id?: string;
  version: number;
  is_active: boolean;
}

export interface ArtifactContent {
  markdown_body?: string;
  json_data?: any;
  structured_data?: any;
  file_urls?: string[];
}

export interface ArtifactMetadata {
  agent_version: string;
  execution_id: string;
  confidence_score?: number;
  data_sources: string[];
  computation_time_ms?: number;
  dependencies: string[];
  tags: string[];
}

// =============================================================================
// Specific Artifact Types
// =============================================================================

export interface BenchmarkArtifact extends Artifact {
  type: 'benchmark';
  content: BenchmarkContent;
}

export interface BenchmarkContent extends ArtifactContent {
  structured_data: {
    metric: string;
    vertical: string;
    channel_type: string;
    benchmark_value: number;
    range: {
      min: number;
      max: number;
      percentile_25: number;
      percentile_75: number;
    };
    sample_size: number;
    confidence_level: number;
    source_url: string;
    last_updated: string;
  };
}

export interface CopyArtifact extends Artifact {
  type: 'copy';
  content: CopyContent;
}

export interface CopyContent extends ArtifactContent {
  structured_data: {
    channel_type: string;
    copy_type: 'subject_line' | 'body' | 'cta' | 'headline' | 'description';
    variants: CopyVariant[];
    target_audience: string;
    tone: TonePreference;
    personalization_fields: string[];
    compliance_status: 'approved' | 'pending' | 'rejected';
  };
}

export interface CopyVariant {
  id: string;
  text: string;
  performance_prediction?: number;
  ab_test_allocation?: number;
  is_control: boolean;
}

export interface CalcArtifact extends Artifact {
  type: 'calc';
  content: CalcContent;
}

export interface CalcContent extends ArtifactContent {
  structured_data: {
    calculation_type: 'cpqm' | 'cac' | 'payback' | 'mer' | 'roi' | 'ltv';
    inputs: CalculationInput[];
    formula: string;
    result: CalculationResult;
    assumptions: string[];
    confidence_interval?: ConfidenceInterval;
  };
}

export interface CalculationInput {
  name: string;
  value: number;
  unit: string;
  source: string;
}

export interface CalculationResult {
  value: number;
  unit: string;
  interpretation: 'excellent' | 'good' | 'acceptable' | 'poor' | 'critical';
  benchmark_comparison?: BenchmarkComparison;
}

export interface BenchmarkComparison {
  benchmark_value: number;
  variance_percent: number;
  percentile_rank?: number;
}

export interface ConfidenceInterval {
  lower_bound: number;
  upper_bound: number;
  confidence_level: number;
}

export interface AllocArtifact extends Artifact {
  type: 'alloc';
  content: AllocContent;
}

export interface AllocContent extends ArtifactContent {
  structured_data: {
    allocation_date: string;
    strategy_used: AllocationStrategy;
    previous_weights: ChannelWeight[];
    new_weights: ChannelWeight[];
    rationale: string;
    expected_impact: ExpectedImpact;
    risk_assessment: RiskAssessment;
  };
}

export interface ChannelWeight {
  channel_id: string;
  channel_name: string;
  previous_weight: number;
  new_weight: number;
  budget_amount: number;
  performance_score: number;
}

export interface ExpectedImpact {
  cpqm_improvement_percent: number;
  total_meetings_change: number;
  confidence_level: number;
  time_to_impact_days: number;
}

export interface RiskAssessment {
  overall_risk: 'low' | 'medium' | 'high';
  risk_factors: RiskFactor[];
  mitigation_strategies: string[];
}

export interface RiskFactor {
  type: 'sample_size' | 'volatility' | 'external_factors' | 'data_quality';
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact_if_realized: string;
}

// =============================================================================
// Agent Execution & Workflow Types
// =============================================================================

export interface AgentExecution extends BaseEntity {
  agent_key: AgentKey;
  trigger_type: ExecutionTrigger;
  trigger_data?: any;
  status: ExecutionStatus;
  start_time: string;
  end_time?: string;
  duration_ms?: number;
  artifacts_created: string[]; // artifact IDs
  errors?: ExecutionError[];
  performance_metrics: ExecutionMetrics;
}

export type ExecutionTrigger = 'scheduled' | 'event_driven' | 'manual' | 'cascade';
export type ExecutionStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ExecutionError {
  type: 'validation' | 'data' | 'computation' | 'external_api' | 'timeout';
  message: string;
  details?: any;
  recoverable: boolean;
}

export interface ExecutionMetrics {
  cpu_time_ms: number;
  memory_usage_mb: number;
  api_calls_made: number;
  data_points_processed: number;
  quality_score?: number;
}

// =============================================================================
// Agent Communication & Coordination
// =============================================================================

export interface AgentMessage extends BaseEntity {
  from_agent: AgentKey;
  to_agent?: AgentKey; // null for broadcast
  message_type: MessageType;
  payload: any;
  priority: MessagePriority;
  requires_response: boolean;
  response_timeout_ms?: number;
  correlation_id?: string;
}

export type MessageType = 
  | 'data_request'
  | 'computation_result'
  | 'status_update'
  | 'error_notification'
  | 'coordination_request'
  | 'workflow_trigger';

export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface AgentWorkflow extends BaseEntity {
  name: string;
  description: string;
  trigger_conditions: WorkflowTrigger[];
  steps: WorkflowStep[];
  is_active: boolean;
  execution_history: WorkflowExecution[];
}

export interface WorkflowTrigger {
  type: 'time_based' | 'event_based' | 'condition_based';
  parameters: any;
}

export interface WorkflowStep {
  order: number;
  agent_key: AgentKey;
  action: string;
  inputs: any;
  conditions?: StepCondition[];
  timeout_ms: number;
}

export interface StepCondition {
  field: string;
  operator: string;
  value: any;
}

export interface WorkflowExecution extends BaseEntity {
  workflow_id: string;
  status: ExecutionStatus;
  steps_completed: number;
  total_steps: number;
  start_time: string;
  end_time?: string;
  results: any;
  errors?: ExecutionError[];
}