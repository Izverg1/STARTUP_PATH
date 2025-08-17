// Core types for SOL:GEN platform
// Based on database schema with sg_ prefix

// =============================================================================
// Base Entity Types
// =============================================================================

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  org_id: string;
  last_login?: string;
  is_active: boolean;
}

export interface Organization extends BaseEntity {
  name: string;
  slug: string;
  domain?: string;
  settings: OrganizationSettings;
  subscription_tier: SubscriptionTier;
  owner_id: string;
}

export interface Project extends BaseEntity {
  name: string;
  description?: string;
  org_id: string;
  owner_id: string;
  status: ProjectStatus;
  mode: ProjectMode;
  settings: ProjectSettings;
}

// =============================================================================
// Enums & Union Types
// =============================================================================

export type UserRole = 'owner' | 'contributor' | 'viewer';
export type SubscriptionTier = 'demo' | 'starter' | 'growth' | 'enterprise';
export type ProjectStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
export type ProjectMode = 'simulation' | 'connected';

export type SalesMotion = 'plg' | 'sales_led' | 'services';
export type CompanySize = 'startup' | 'smb' | 'mid_market' | 'enterprise';
export type GeographicRegion = 'north_america' | 'europe' | 'asia_pacific' | 'latin_america' | 'global';

export type ChannelType = 
  | 'google_search'
  | 'linkedin_inmail'
  | 'webinar'
  | 'content_marketing'
  | 'outbound_email'
  | 'events'
  | 'partnerships'
  | 'referrals'
  | 'social_media'
  | 'paid_social';

export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed' | 'killed';
export type DecisionType = 'scale' | 'iterate' | 'kill';

// =============================================================================
// ICP (Ideal Customer Profile) Types
// =============================================================================

export interface ICP {
  persona: string;
  company_size: CompanySize;
  geographic_region: GeographicRegion;
  acv_range: ACVRange;
  gross_margin_percent: number;
  sales_motion: SalesMotion;
  decision_window_days?: number;
  pain_points?: string[];
  use_cases?: string[];
}

export interface ACVRange {
  min: number;
  max: number;
  currency: string;
}

// =============================================================================
// Experiment & Channel Types
// =============================================================================

export interface Experiment extends BaseEntity {
  name: string;
  description?: string;
  project_id: string;
  status: ExperimentStatus;
  icp: ICP;
  target_cpqm: number;
  max_cac_payback_months: number;
  budget_allocated: number;
  start_date: string;
  end_date?: string;
  hypothesis: string;
  success_criteria: SuccessCriteria;
}

export interface SuccessCriteria {
  primary_metric: string;
  target_value: number;
  confidence_level: number;
  minimum_sample_size: number;
}

export interface Channel extends BaseEntity {
  experiment_id: string;
  type: ChannelType;
  name: string;
  description?: string;
  parameters: ChannelParameters;
  is_active: boolean;
  allocated_budget: number;
  current_weight: number;
}

export interface ChannelParameters {
  [key: string]: any;
  // Channel-specific parameters
  // Google Search: keywords, match_types, locations, etc.
  // LinkedIn: job_titles, company_sizes, industries, etc.
  // Webinar: topic, duration, follow_up_sequence, etc.
}

// =============================================================================
// Gates & Thresholds
// =============================================================================

export interface Gate extends BaseEntity {
  channel_id: string;
  name: string;
  metric: GateMetric;
  operator: GateOperator;
  threshold_value: number;
  window_days: number;
  is_critical: boolean;
  benchmark_source?: string;
  benchmark_range?: BenchmarkRange;
}

export type GateMetric = 
  | 'reply_rate'
  | 'click_through_rate'
  | 'conversion_rate'
  | 'cost_per_lead'
  | 'cost_per_meeting'
  | 'meeting_show_rate'
  | 'opportunity_rate'
  | 'close_rate'
  | 'cac_payback_months';

export type GateOperator = 'gte' | 'lte' | 'eq' | 'between';

export interface BenchmarkRange {
  min: number;
  max: number;
  percentile_25?: number;
  percentile_75?: number;
  source_url?: string;
}

// =============================================================================
// Results & Performance Data
// =============================================================================

export interface Result extends BaseEntity {
  channel_id: string;
  date: string;
  metrics: ResultMetrics;
  costs: ResultCosts;
  is_simulated: boolean;
  variance_applied?: number; // For demo mode noise
}

export interface ResultMetrics {
  impressions: number;
  clicks: number;
  leads: number;
  replies: number;
  meetings_scheduled: number;
  meetings_held: number;
  opportunities: number;
  wins: number;
  pipeline_value: number;
  closed_value: number;
}

export interface ResultCosts {
  media_spend: number;
  platform_fees: number;
  labor_costs: number;
  total_cost: number;
}

// =============================================================================
// Decision Types
// =============================================================================

export interface Decision extends BaseEntity {
  experiment_id: string;
  channel_id?: string; // null for experiment-level decisions
  type: DecisionType;
  reason: string;
  supporting_data: DecisionData;
  approver_id: string;
  implemented_at?: string;
  impact_metrics?: ImpactMetrics;
}

export interface DecisionData {
  metrics_snapshot: any;
  gate_results: GateResult[];
  financial_analysis: FinancialAnalysis;
  recommendation_confidence: number;
}

export interface GateResult {
  gate_id: string;
  gate_name: string;
  current_value: number;
  threshold_value: number;
  status: 'pass' | 'fail' | 'warning';
  days_evaluated: number;
}

export interface FinancialAnalysis {
  current_cac: number;
  projected_cac: number;
  payback_months: number;
  ltv_cac_ratio?: number;
  roi_projection?: number;
}

export interface ImpactMetrics {
  budget_reallocated?: number;
  performance_change?: number;
  efficiency_gain?: number;
}

// =============================================================================
// Settings & Configuration Types
// =============================================================================

export interface OrganizationSettings {
  timezone: string;
  currency: string;
  fiscal_year_start: string;
  notification_preferences: NotificationSettings;
  security_settings: SecuritySettings;
}

export interface ProjectSettings {
  default_confidence_level: number;
  minimum_test_duration_days: number;
  maximum_test_duration_days: number;
  auto_pause_on_poor_performance: boolean;
  noise_variance_percent?: number; // For simulation mode
  allocator_frequency: 'daily' | 'weekly' | 'bi_weekly';
}

export interface NotificationSettings {
  email_enabled: boolean;
  slack_webhook_url?: string;
  notification_triggers: NotificationTrigger[];
}

export interface SecuritySettings {
  sso_enabled: boolean;
  mfa_required: boolean;
  session_timeout_hours: number;
  allowed_domains: string[];
}

export type NotificationTrigger = 
  | 'experiment_started'
  | 'experiment_completed'
  | 'gate_failed'
  | 'budget_threshold_reached'
  | 'decision_required'
  | 'anomaly_detected';

// =============================================================================
// Collaboration Types
// =============================================================================

export interface Space extends BaseEntity {
  name: string;
  description?: string;
  project_id: string;
  owner_id: string;
  type: SpaceType;
  visibility: SpaceVisibility;
  members: SpaceMember[];
  settings: SpaceSettings;
}

export interface SpaceMember {
  user_id: string;
  user: Pick<User, 'id' | 'name' | 'email' | 'avatar_url'>;
  role: SpaceMemberRole;
  joined_at: string;
  last_active?: string;
}

export interface Thread extends BaseEntity {
  space_id: string;
  title: string;
  author_id: string;
  author: Pick<User, 'id' | 'name' | 'avatar_url'>;
  status: ThreadStatus;
  priority: ThreadPriority;
  tags: string[];
  participants: string[]; // user_ids
  message_count: number;
  last_message_at?: string;
  is_pinned: boolean;
  attachments: Attachment[];
}

export interface Message extends BaseEntity {
  thread_id: string;
  author_id: string;
  author: Pick<User, 'id' | 'name' | 'avatar_url'>;
  content: string;
  mentions: Mention[];
  attachments: Attachment[];
  reactions: Reaction[];
  reply_to_id?: string;
  is_edited: boolean;
  edited_at?: string;
}

export interface Mention {
  user_id: string;
  user: Pick<User, 'id' | 'name' | 'avatar_url'>;
  position: number; // character position in message
  length: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: AttachmentType;
  size: number;
  url: string;
  thumbnail_url?: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface Reaction {
  emoji: string;
  users: string[]; // user_ids who reacted
  count: number;
}

export interface CollaborativeDecision extends BaseEntity {
  space_id: string;
  thread_id?: string;
  title: string;
  description: string;
  type: CollaborativeDecisionType;
  status: CollaborativeDecisionStatus;
  proposer_id: string;
  proposer: Pick<User, 'id' | 'name' | 'avatar_url'>;
  approvers: DecisionApprover[];
  rationale?: string;
  supporting_documents: Attachment[];
  impact_assessment: ImpactAssessment;
  deadline?: string;
  implemented_at?: string;
  related_experiment_id?: string;
}

export interface DecisionApprover {
  user_id: string;
  user: Pick<User, 'id' | 'name' | 'avatar_url'>;
  status: ApprovalStatus;
  response_at?: string;
  comments?: string;
  required: boolean;
}

export interface ImpactAssessment {
  budget_impact?: number;
  timeline_impact?: string;
  risk_level: RiskLevel;
  stakeholders: string[];
  success_metrics: string[];
}

// Collaboration Enums
export type SpaceType = 'general' | 'experiment' | 'decision' | 'review';
export type SpaceVisibility = 'public' | 'private' | 'restricted';
export type SpaceMemberRole = 'owner' | 'admin' | 'member' | 'observer';
export type ThreadStatus = 'active' | 'resolved' | 'closed' | 'archived';
export type ThreadPriority = 'low' | 'medium' | 'high' | 'urgent';
export type AttachmentType = 'image' | 'document' | 'video' | 'audio' | 'other';
export type CollaborativeDecisionType = 'budget_allocation' | 'experiment_approval' | 'strategy_change' | 'tool_adoption' | 'process_change' | 'other';
export type CollaborativeDecisionStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'implemented' | 'cancelled';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'abstained';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SpaceSettings {
  notifications_enabled: boolean;
  auto_archive_days?: number;
  require_approval_for_decisions: boolean;
  allow_external_attachments: boolean;
  thread_auto_resolve_days?: number;
}

// =============================================================================
// Export all types
// =============================================================================

export * from './agents';
export * from './dashboard';
export * from './rules';