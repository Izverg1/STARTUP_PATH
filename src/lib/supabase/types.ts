// TypeScript types for STARTUP_PATH Platform - SPATH_ prefixed tables
// This file defines the database schema with SPATH_ prefix for KSON_DB
// All tables use SPATH_ prefix to stand out from other tables in the database

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      SPATH_organizations: {
        Row: {
          id: string
          name: string
          slug: string
          domain: string | null
          owner_id: string | null
          subscription_tier: 'demo' | 'starter' | 'growth' | 'enterprise'
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          domain?: string | null
          owner_id?: string | null
          subscription_tier?: 'demo' | 'starter' | 'growth' | 'enterprise'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          domain?: string | null
          owner_id?: string | null
          subscription_tier?: 'demo' | 'starter' | 'growth' | 'enterprise'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      SPATH_users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          org_id: string | null
          role: 'owner' | 'admin' | 'contributor' | 'viewer'
          is_active: boolean
          last_login: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          org_id?: string | null
          role?: 'owner' | 'admin' | 'contributor' | 'viewer'
          is_active?: boolean
          last_login?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          org_id?: string | null
          role?: 'owner' | 'admin' | 'contributor' | 'viewer'
          is_active?: boolean
          last_login?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "SPATH_users_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "SPATH_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      SPATH_projects: {
        Row: {
          id: string
          name: string
          description: string | null
          org_id: string
          created_by: string
          status: 'draft' | 'active' | 'paused' | 'completed' | 'archived'
          mode: 'simulation' | 'connected'
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          org_id: string
          created_by: string
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'archived'
          mode?: 'simulation' | 'connected'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          org_id?: string
          created_by?: string
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'archived'
          mode?: 'simulation' | 'connected'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "SPATH_projects_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "SPATH_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SPATH_projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "SPATH_users"
            referencedColumns: ["id"]
          },
        ]
      }
      SPATH_experiments: {
        Row: {
          id: string
          name: string
          description: string | null
          project_id: string
          status: 'draft' | 'running' | 'paused' | 'completed' | 'failed'
          start_date: string | null
          end_date: string | null
          budget_total: number | null
          budget_daily: number | null
          budget_allocated: number | null
          budget_spent: number | null
          target_cpqm: number | null
          max_cac_payback_months: number | null
          primary_metric: string | null
          icp: Json
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          project_id: string
          status?: 'draft' | 'running' | 'paused' | 'completed' | 'failed'
          start_date?: string | null
          end_date?: string | null
          budget_total?: number | null
          budget_daily?: number | null
          budget_allocated?: number | null
          budget_spent?: number | null
          target_cpqm?: number | null
          max_cac_payback_months?: number | null
          primary_metric?: string | null
          icp?: Json
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          project_id?: string
          status?: 'draft' | 'running' | 'paused' | 'completed' | 'failed'
          start_date?: string | null
          end_date?: string | null
          budget_total?: number | null
          budget_daily?: number | null
          budget_allocated?: number | null
          budget_spent?: number | null
          target_cpqm?: number | null
          max_cac_payback_months?: number | null
          primary_metric?: string | null
          icp?: Json
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "SPATH_experiments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "SPATH_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      SPATH_channels: {
        Row: {
          id: string
          experiment_id: string
          name: string
          type: string
          budget_allocated: number | null
          budget_spent: number | null
          status: 'active' | 'paused' | 'stopped'
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          experiment_id: string
          name: string
          type: string
          budget_allocated?: number | null
          budget_spent?: number | null
          status?: 'active' | 'paused' | 'stopped'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          experiment_id?: string
          name?: string
          type?: string
          budget_allocated?: number | null
          budget_spent?: number | null
          status?: 'active' | 'paused' | 'stopped'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "SPATH_channels_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "SPATH_experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      SPATH_gates: {
        Row: {
          id: string
          experiment_id: string
          channel_id: string | null
          name: string
          metric: string
          operator: string
          threshold_value: number
          current_value: number | null
          status: 'monitoring' | 'passed' | 'failed' | 'warning'
          priority: 'low' | 'medium' | 'high' | 'critical'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          experiment_id: string
          channel_id?: string | null
          name: string
          metric: string
          operator: string
          threshold_value: number
          current_value?: number | null
          status?: 'monitoring' | 'passed' | 'failed' | 'warning'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          experiment_id?: string
          channel_id?: string | null
          name?: string
          metric?: string
          operator?: string
          threshold_value?: number
          current_value?: number | null
          status?: 'monitoring' | 'passed' | 'failed' | 'warning'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "SPATH_gates_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "SPATH_experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SPATH_gates_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "SPATH_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      SPATH_results: {
        Row: {
          id: string
          experiment_id: string
          channel_id: string
          date: string
          impressions: number | null
          clicks: number | null
          cost: number | null
          leads: number | null
          meetings: number | null
          opportunities: number | null
          wins: number | null
          revenue: number | null
          click_through_rate: number | null
          cost_per_click: number | null
          cost_per_lead: number | null
          cost_per_qualified_meeting: number | null
          customer_acquisition_cost: number | null
          lead_to_meeting_rate: number | null
          meeting_to_opp_rate: number | null
          opp_to_win_rate: number | null
          avg_deal_size: number | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          experiment_id: string
          channel_id: string
          date: string
          impressions?: number | null
          clicks?: number | null
          cost?: number | null
          leads?: number | null
          meetings?: number | null
          opportunities?: number | null
          wins?: number | null
          revenue?: number | null
          click_through_rate?: number | null
          cost_per_click?: number | null
          cost_per_lead?: number | null
          cost_per_qualified_meeting?: number | null
          customer_acquisition_cost?: number | null
          lead_to_meeting_rate?: number | null
          meeting_to_opp_rate?: number | null
          opp_to_win_rate?: number | null
          avg_deal_size?: number | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          experiment_id?: string
          channel_id?: string
          date?: string
          impressions?: number | null
          clicks?: number | null
          cost?: number | null
          leads?: number | null
          meetings?: number | null
          opportunities?: number | null
          wins?: number | null
          revenue?: number | null
          click_through_rate?: number | null
          cost_per_click?: number | null
          cost_per_lead?: number | null
          cost_per_qualified_meeting?: number | null
          customer_acquisition_cost?: number | null
          lead_to_meeting_rate?: number | null
          meeting_to_opp_rate?: number | null
          opp_to_win_rate?: number | null
          avg_deal_size?: number | null
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "SPATH_results_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "SPATH_experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SPATH_results_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "SPATH_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      SPATH_agents: {
        Row: {
          id: string
          project_id: string
          agent_key: 'channel_scout' | 'offer_alchemist' | 'signal_wrangler' | 'budget_captain'
          name: string
          description: string | null
          status: 'idle' | 'working' | 'blocked' | 'done'
          status_line: string | null
          current_task: string | null
          progress: number | null
          is_active: boolean
          settings: Json
          last_activity: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          agent_key: 'channel_scout' | 'offer_alchemist' | 'signal_wrangler' | 'budget_captain'
          name: string
          description?: string | null
          status?: 'idle' | 'working' | 'blocked' | 'done'
          status_line?: string | null
          current_task?: string | null
          progress?: number | null
          is_active?: boolean
          settings?: Json
          last_activity?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          agent_key?: 'channel_scout' | 'offer_alchemist' | 'signal_wrangler' | 'budget_captain'
          name?: string
          description?: string | null
          status?: 'idle' | 'working' | 'blocked' | 'done'
          status_line?: string | null
          current_task?: string | null
          progress?: number | null
          is_active?: boolean
          settings?: Json
          last_activity?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "SPATH_agents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "SPATH_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      SPATH_benchmarks: {
        Row: {
          id: string
          metric: string
          category: string
          industry: string | null
          company_size: string | null
          geographic_region: string | null
          value_p25: number
          value_p50: number
          value_p75: number
          value_avg: number
          sample_size: number
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          metric: string
          category: string
          industry?: string | null
          company_size?: string | null
          geographic_region?: string | null
          value_p25: number
          value_p50: number
          value_p75: number
          value_avg: number
          sample_size: number
          last_updated: string
          created_at?: string
        }
        Update: {
          id?: string
          metric?: string
          category?: string
          industry?: string | null
          company_size?: string | null
          geographic_region?: string | null
          value_p25?: number
          value_p50?: number
          value_p75?: number
          value_avg?: number
          sample_size?: number
          last_updated?: string
          created_at?: string
        }
        Relationships: []
      }
      SPATH_agent_executions: {
        Row: {
          id: string
          agent_id: string
          status: 'running' | 'completed' | 'failed'
          start_time: string
          end_time: string | null
          duration_ms: number | null
          input_data: Json | null
          output_data: Json | null
          error_message: string | null
          artifacts_created: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          status?: 'running' | 'completed' | 'failed'
          start_time?: string
          end_time?: string | null
          duration_ms?: number | null
          input_data?: Json | null
          output_data?: Json | null
          error_message?: string | null
          artifacts_created?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          status?: 'running' | 'completed' | 'failed'
          start_time?: string
          end_time?: string | null
          duration_ms?: number | null
          input_data?: Json | null
          output_data?: Json | null
          error_message?: string | null
          artifacts_created?: string[] | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "SPATH_agent_executions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "SPATH_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      SPATH_artifacts: {
        Row: {
          id: string
          project_id: string
          agent_key: string
          execution_id: string | null
          name: string
          description: string | null
          artifact_type: string
          content: Json
          metadata: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          agent_key: string
          execution_id?: string | null
          name: string
          description?: string | null
          artifact_type: string
          content: Json
          metadata?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          agent_key?: string
          execution_id?: string | null
          name?: string
          description?: string | null
          artifact_type?: string
          content?: Json
          metadata?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "SPATH_artifacts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "SPATH_projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      project_mode: "simulation" | "connected"
      project_status: "draft" | "active" | "paused" | "completed" | "archived"
      subscription_tier: "demo" | "starter" | "growth" | "enterprise"
      user_role: "owner" | "admin" | "contributor" | "viewer"
      experiment_status: "draft" | "running" | "paused" | "completed" | "failed"
      channel_type: "paid_search" | "paid_social" | "display" | "video" | "email" | "content" | "seo" | "affiliate" | "referral" | "direct" | "linkedin_inmail" | "webinar" | "events" | "partnership"
      gate_metric: "cpl" | "cpqm" | "cac" | "roas" | "payback_months" | "conversion_rate" | "cost_per_click" | "click_through_rate" | "lead_to_meeting_rate" | "meeting_to_opp_rate" | "opp_to_win_rate" | "avg_deal_size"
      gate_operator: ">" | "<" | ">=" | "<=" | "="
      agent_status: "idle" | "working" | "blocked" | "done"
      artifact_type: "report" | "recommendation" | "analysis" | "data" | "insight"
      decision_type: "budget_allocation" | "channel_optimization" | "experiment_termination" | "scaling_decision"
      company_size: "startup" | "small" | "medium" | "large" | "enterprise"
      geographic_region: "north_america" | "europe" | "asia_pacific" | "latin_america" | "middle_east_africa"
      sales_motion: "self_serve" | "sales_assisted" | "enterprise_sales"
      notification_trigger: "gate_failure" | "budget_threshold" | "experiment_complete" | "anomaly_detected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}