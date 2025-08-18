// Dashboard and metrics types for STARTUP_PATH platform
// Covers effectiveness metrics, funnel data, and dashboard configurations

import { BaseEntity, ChannelType } from './index';

// =============================================================================
// Core Metrics Types
// =============================================================================

export interface Metrics {
  cpqm: CPQMMetric;
  cac: CACMetric;
  cac_payback: PaybackMetric;
  mer: MERMetric;
  cpo: CPOMetric;
  ltv: LTVMetric;
  roi: ROIMetric;
}

// =============================================================================
// CPQM (Cost Per Qualified Meeting) Metrics
// =============================================================================

export interface CPQMMetric {
  current_value: number;
  target_value: number;
  benchmark_range: MetricBenchmark;
  trend: MetricTrend;
  breakdown: CPQMBreakdown;
  historical_data: HistoricalDataPoint[];
}

export interface CPQMBreakdown {
  by_channel: ChannelCPQM[];
  by_source: SourceCPQM[];
  by_period: PeriodCPQM[];
}

export interface ChannelCPQM {
  channel_id: string;
  channel_type: ChannelType;
  channel_name: string;
  cpqm: number;
  meetings_scheduled: number;
  total_cost: number;
  efficiency_score: EfficiencyScore;
}

export interface SourceCPQM {
  source_name: string;
  cpqm: number;
  meetings: number;
  cost: number;
  conversion_rate: number;
}

export interface PeriodCPQM {
  period: string;
  cpqm: number;
  meetings: number;
  cost: number;
  trend_direction: TrendDirection;
}

// =============================================================================
// CAC (Customer Acquisition Cost) Metrics
// =============================================================================

export interface CACMetric {
  current_value: number;
  target_value: number;
  benchmark_range: MetricBenchmark;
  trend: MetricTrend;
  breakdown: CACBreakdown;
  payback_analysis: PaybackAnalysis;
}

export interface CACBreakdown {
  blended_cac: number;
  by_channel: ChannelCAC[];
  by_cohort: CohortCAC[];
  cost_components: CostComponent[];
}

export interface ChannelCAC {
  channel_id: string;
  channel_type: ChannelType;
  channel_name: string;
  cac: number;
  customers_acquired: number;
  total_cost: number;
  efficiency_vs_blended: number;
}

export interface CohortCAC {
  cohort_period: string;
  cac: number;
  customers: number;
  ltv_cac_ratio: number;
  payback_months: number;
}

export interface CostComponent {
  category: CostCategory;
  amount: number;
  percentage_of_total: number;
  trend: MetricTrend;
}

export type CostCategory = 
  | 'media_spend'
  | 'platform_fees'
  | 'labor_costs'
  | 'tooling_costs'
  | 'content_creation'
  | 'other';

// =============================================================================
// Payback Metrics
// =============================================================================

export interface PaybackMetric {
  current_months: number;
  target_months: number;
  acceptable_range: AcceptableRange;
  trend: MetricTrend;
  breakdown: PaybackBreakdown;
  risk_factors: PaybackRiskFactor[];
}

export interface PaybackBreakdown {
  by_channel: ChannelPayback[];
  by_acv_band: ACVBandPayback[];
  by_customer_segment: SegmentPayback[];
}

export interface ChannelPayback {
  channel_id: string;
  channel_type: ChannelType;
  channel_name: string;
  payback_months: number;
  status: PaybackStatus;
  confidence_level: number;
}

export interface ACVBandPayback {
  acv_min: number;
  acv_max: number;
  payback_months: number;
  customer_count: number;
  revenue_contribution: number;
}

export interface SegmentPayback {
  segment_name: string;
  payback_months: number;
  ltv: number;
  cac: number;
  monthly_recurring_revenue: number;
}

export type PaybackStatus = 'excellent' | 'good' | 'acceptable' | 'concerning' | 'critical';

export interface PaybackRiskFactor {
  factor: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
}

// =============================================================================
// MER (Marketing Efficiency Ratio) Metrics
// =============================================================================

export interface MERMetric {
  current_value: number;
  target_value: number;
  benchmark_range: MetricBenchmark;
  trend: MetricTrend;
  components: MERComponents;
  efficiency_analysis: EfficiencyAnalysis;
}

export interface MERComponents {
  new_revenue: number;
  marketing_spend: number;
  attribution_window_days: number;
  excluded_costs: string[];
}

export interface EfficiencyAnalysis {
  spend_efficiency: number;
  revenue_velocity: number;
  channel_contribution: ChannelContribution[];
  optimization_opportunities: OptimizationOpportunity[];
}

export interface ChannelContribution {
  channel_id: string;
  channel_type: ChannelType;
  revenue_attributed: number;
  spend_allocated: number;
  mer_contribution: number;
  efficiency_rank: number;
}

export interface OptimizationOpportunity {
  type: 'budget_reallocation' | 'channel_optimization' | 'timing_adjustment';
  description: string;
  potential_impact: number;
  confidence: number;
  effort_required: 'low' | 'medium' | 'high';
}

// =============================================================================
// CPO (Cost Per Opportunity) Metrics
// =============================================================================

export interface CPOMetric {
  current_value: number;
  target_value: number;
  benchmark_range: MetricBenchmark;
  trend: MetricTrend;
  conversion_funnel: ConversionFunnel;
  quality_score: OpportunityQuality;
}

export interface OpportunityQuality {
  average_deal_size: number;
  close_rate: number;
  sales_cycle_days: number;
  quality_indicators: QualityIndicator[];
}

export interface QualityIndicator {
  name: string;
  score: number;
  weight: number;
  trend: TrendDirection;
}

// =============================================================================
// LTV (Lifetime Value) & ROI Metrics
// =============================================================================

export interface LTVMetric {
  current_value: number;
  target_value: number;
  ltv_cac_ratio: number;
  trend: MetricTrend;
  cohort_analysis: CohortLTV[];
  drivers: LTVDriver[];
}

export interface CohortLTV {
  cohort_period: string;
  ltv: number;
  months_to_maturity: number;
  churn_rate: number;
  expansion_rate: number;
}

export interface LTVDriver {
  driver: string;
  contribution_percent: number;
  trend: MetricTrend;
  optimization_potential: number;
}

export interface ROIMetric {
  current_value: number;
  target_value: number;
  time_horizon_months: number;
  trend: MetricTrend;
  breakdown: ROIBreakdown;
}

export interface ROIBreakdown {
  by_channel: ChannelROI[];
  by_campaign: CampaignROI[];
  cumulative_roi: CumulativeROI[];
}

export interface ChannelROI {
  channel_id: string;
  channel_type: ChannelType;
  roi_percent: number;
  investment: number;
  return: number;
  confidence_level: number;
}

export interface CampaignROI {
  campaign_id: string;
  campaign_name: string;
  roi_percent: number;
  investment: number;
  return: number;
  duration_days: number;
}

export interface CumulativeROI {
  month: number;
  cumulative_investment: number;
  cumulative_return: number;
  cumulative_roi: number;
}

// =============================================================================
// Funnel Types
// =============================================================================

export interface ConversionFunnel {
  stages: FunnelStage[];
  overall_conversion_rate: number;
  drop_off_analysis: DropOffAnalysis;
  optimization_recommendations: FunnelOptimization[];
}

export interface FunnelStage {
  name: FunnelStageName;
  order: number;
  count: number;
  conversion_rate: number;
  cost_per_conversion: number;
  benchmark_conversion_rate?: number;
  status: StageStatus;
}

export type FunnelStageName = 
  | 'impression'
  | 'click'
  | 'landing_page_view'
  | 'lead'
  | 'qualified_lead'
  | 'meeting_scheduled'
  | 'meeting_held'
  | 'opportunity'
  | 'proposal'
  | 'closed_won';

export type StageStatus = 'performing' | 'underperforming' | 'critical';

export interface DropOffAnalysis {
  highest_drop_stage: FunnelStageName;
  drop_rate: number;
  impact_on_pipeline: number;
  root_causes: DropOffCause[];
}

export interface DropOffCause {
  cause: string;
  confidence: number;
  impact_score: number;
  actionable: boolean;
}

export interface FunnelOptimization {
  stage: FunnelStageName;
  opportunity: string;
  potential_improvement: number;
  effort_required: 'low' | 'medium' | 'high';
  expected_roi: number;
}

// =============================================================================
// Common Metric Types
// =============================================================================

export interface MetricBenchmark {
  industry_median: number;
  top_quartile: number;
  bottom_quartile: number;
  source: string;
  last_updated: string;
}

export interface MetricTrend {
  direction: TrendDirection;
  magnitude: number;
  period_days: number;
  statistical_significance: number;
  volatility: TrendVolatility;
}

export type TrendDirection = 'up' | 'down' | 'flat';
export type TrendVolatility = 'low' | 'medium' | 'high';

export interface HistoricalDataPoint {
  date: string;
  value: number;
  confidence_interval?: ConfidenceInterval;
  events?: MetricEvent[];
}

export interface MetricEvent {
  type: 'campaign_launch' | 'budget_change' | 'gate_modification' | 'external_factor';
  description: string;
  impact_magnitude?: number;
}

export interface ConfidenceInterval {
  lower_bound: number;
  upper_bound: number;
  confidence_level: number;
}

export interface EfficiencyScore {
  score: number;
  max_score: number;
  components: ScoreComponent[];
  improvement_areas: string[];
}

export interface ScoreComponent {
  name: string;
  weight: number;
  score: number;
  benchmark_score?: number;
}

export interface AcceptableRange {
  preferred_max: number;
  acceptable_max: number;
  current_value: number;
  status: 'preferred' | 'acceptable' | 'concerning' | 'unacceptable';
}

// =============================================================================
// Dashboard Configuration Types
// =============================================================================

export interface DashboardConfig extends BaseEntity {
  name: string;
  user_id: string;
  project_id: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  refresh_interval_minutes: number;
  is_shared: boolean;
  permissions: DashboardPermission[];
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  responsive_breakpoints: ResponsiveBreakpoint[];
}

export interface ResponsiveBreakpoint {
  screen_size: 'mobile' | 'tablet' | 'desktop' | 'large';
  columns: number;
  widget_spacing: number;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: WidgetPosition;
  size: WidgetSize;
  configuration: WidgetConfiguration;
  data_source: DataSource;
}

export type WidgetType = 
  | 'metric_card'
  | 'trend_chart'
  | 'funnel_chart'
  | 'breakdown_chart'
  | 'table'
  | 'gauge'
  | 'heatmap'
  | 'timeline';

export interface WidgetPosition {
  row: number;
  column: number;
}

export interface WidgetSize {
  width: number;
  height: number;
  min_width?: number;
  min_height?: number;
}

export interface WidgetConfiguration {
  metric_type?: string;
  time_range: TimeRange;
  aggregation: AggregationType;
  comparison_enabled: boolean;
  thresholds?: MetricThreshold[];
  formatting: DisplayFormatting;
}

export interface DataSource {
  type: 'real_time' | 'scheduled' | 'on_demand';
  query: DataQuery;
  cache_duration_minutes?: number;
  fallback_data?: any;
}

export interface DataQuery {
  metrics: string[];
  dimensions: string[];
  filters: QueryFilter[];
  sort_by?: SortConfiguration;
  limit?: number;
}

export interface QueryFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'between';
  value: any;
}

export interface SortConfiguration {
  field: string;
  direction: 'asc' | 'desc';
}

export interface TimeRange {
  type: 'relative' | 'absolute';
  start?: string;
  end?: string;
  period?: TimePeriod;
  include_current_period?: boolean;
}

export type TimePeriod = 
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'last_12_months'
  | 'month_to_date'
  | 'quarter_to_date'
  | 'year_to_date';

export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'median' | 'p95' | 'p99';

export interface MetricThreshold {
  value: number;
  operator: 'gt' | 'gte' | 'lt' | 'lte';
  color: string;
  label?: string;
}

export interface DisplayFormatting {
  number_format: NumberFormat;
  color_scheme: ColorScheme;
  show_trend_indicators: boolean;
  show_comparison: boolean;
  precision: number;
}

export interface NumberFormat {
  type: 'number' | 'currency' | 'percentage' | 'duration';
  currency_code?: string;
  use_thousands_separator: boolean;
  decimal_places: number;
}

export interface ColorScheme {
  primary: string;
  positive: string;
  negative: string;
  neutral: string;
  warning: string;
  critical: string;
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: FilterType;
  field: string;
  options?: FilterOption[];
  default_value?: any;
  is_required: boolean;
}

export type FilterType = 'select' | 'multi_select' | 'date_range' | 'text' | 'number_range';

export interface FilterOption {
  label: string;
  value: any;
  group?: string;
}

export interface DashboardPermission {
  user_id: string;
  role: 'viewer' | 'editor' | 'admin';
  granted_at: string;
  granted_by: string;
}