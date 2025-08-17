// TypeScript types generated from Supabase schema
// This file should be regenerated whenever the database schema changes
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/lib/supabase/types.ts

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
      sg_agents: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          key: string
          title: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          key: string
          title: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sg_agent_state: {
        Row: {
          agent_key: string
          context: Json | null
          created_at: string
          id: string
          last_activity: string | null
          progress_percent: number | null
          project_id: string
          status: Database["public"]["Enums"]["agent_status"]
          status_line: string | null
          updated_at: string
        }
        Insert: {
          agent_key: string
          context?: Json | null
          created_at?: string
          id?: string
          last_activity?: string | null
          progress_percent?: number | null
          project_id: string
          status?: Database["public"]["Enums"]["agent_status"]
          status_line?: string | null
          updated_at?: string
        }
        Update: {
          agent_key?: string
          context?: Json | null
          created_at?: string
          id?: string
          last_activity?: string | null
          progress_percent?: number | null
          project_id?: string
          status?: Database["public"]["Enums"]["agent_status"]
          status_line?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_agent_state_agent_key_fkey"
            columns: ["agent_key"]
            isOneToOne: false
            referencedRelation: "sg_agents"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "sg_agent_state_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "sg_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_artifacts: {
        Row: {
          agent_key: string
          created_at: string
          id: string
          is_current: boolean
          json_meta: Json | null
          md_body: string | null
          project_id: string
          title: string
          type: Database["public"]["Enums"]["artifact_type"]
          version: number
        }
        Insert: {
          agent_key: string
          created_at?: string
          id?: string
          is_current?: boolean
          json_meta?: Json | null
          md_body?: string | null
          project_id: string
          title: string
          type: Database["public"]["Enums"]["artifact_type"]
          version?: number
        }
        Update: {
          agent_key?: string
          created_at?: string
          id?: string
          is_current?: boolean
          json_meta?: Json | null
          md_body?: string | null
          project_id?: string
          title?: string
          type?: Database["public"]["Enums"]["artifact_type"]
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "sg_artifacts_agent_key_fkey"
            columns: ["agent_key"]
            isOneToOne: false
            referencedRelation: "sg_agents"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "sg_artifacts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "sg_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_benchmarks: {
        Row: {
          channel_type: Database["public"]["Enums"]["channel_type"] | null
          company_size: Database["public"]["Enums"]["company_size"] | null
          created_at: string
          id: string
          metric: string
          percentile_25: number | null
          percentile_75: number | null
          source_name: string | null
          source_url: string | null
          updated_at: string
          value_max: number | null
          value_median: number | null
          value_min: number | null
          vertical: string | null
        }
        Insert: {
          channel_type?: Database["public"]["Enums"]["channel_type"] | null
          company_size?: Database["public"]["Enums"]["company_size"] | null
          created_at?: string
          id?: string
          metric: string
          percentile_25?: number | null
          percentile_75?: number | null
          source_name?: string | null
          source_url?: string | null
          updated_at?: string
          value_max?: number | null
          value_median?: number | null
          value_min?: number | null
          vertical?: string | null
        }
        Update: {
          channel_type?: Database["public"]["Enums"]["channel_type"] | null
          company_size?: Database["public"]["Enums"]["company_size"] | null
          created_at?: string
          id?: string
          metric?: string
          percentile_25?: number | null
          percentile_75?: number | null
          source_name?: string | null
          source_url?: string | null
          updated_at?: string
          value_max?: number | null
          value_median?: number | null
          value_min?: number | null
          vertical?: string | null
        }
        Relationships: []
      }
      sg_channels: {
        Row: {
          allocated_budget: number
          created_at: string
          current_weight: number
          description: string | null
          experiment_id: string
          id: string
          is_active: boolean
          name: string
          parameters: Json
          type: Database["public"]["Enums"]["channel_type"]
          updated_at: string
        }
        Insert: {
          allocated_budget?: number
          created_at?: string
          current_weight?: number
          description?: string | null
          experiment_id: string
          id?: string
          is_active?: boolean
          name: string
          parameters?: Json
          type: Database["public"]["Enums"]["channel_type"]
          updated_at?: string
        }
        Update: {
          allocated_budget?: number
          created_at?: string
          current_weight?: number
          description?: string | null
          experiment_id?: string
          id?: string
          is_active?: boolean
          name?: string
          parameters?: Json
          type?: Database["public"]["Enums"]["channel_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_channels_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "sg_experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_comments: {
        Row: {
          attachments: Json | null
          author_id: string
          content: string
          created_at: string
          id: string
          parent_id: string | null
          thread_id: string
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          author_id: string
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          thread_id: string
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "sg_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "sg_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_comments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "sg_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_decisions: {
        Row: {
          approver_id: string
          channel_id: string | null
          created_at: string
          experiment_id: string
          id: string
          impact_metrics: Json | null
          implemented_at: string | null
          reason: string
          supporting_data: Json
          type: Database["public"]["Enums"]["decision_type"]
          updated_at: string
        }
        Insert: {
          approver_id: string
          channel_id?: string | null
          created_at?: string
          experiment_id: string
          id?: string
          impact_metrics?: Json | null
          implemented_at?: string | null
          reason: string
          supporting_data?: Json
          type: Database["public"]["Enums"]["decision_type"]
          updated_at?: string
        }
        Update: {
          approver_id?: string
          channel_id?: string | null
          created_at?: string
          experiment_id?: string
          id?: string
          impact_metrics?: Json | null
          implemented_at?: string | null
          reason?: string
          supporting_data?: Json
          type?: Database["public"]["Enums"]["decision_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_decisions_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "sg_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_decisions_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "sg_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_decisions_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "sg_experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_experiments: {
        Row: {
          budget_allocated: number
          created_at: string
          description: string | null
          end_date: string | null
          hypothesis: string | null
          icp: Json
          id: string
          max_cac_payback_months: number | null
          name: string
          project_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["experiment_status"]
          success_criteria: Json | null
          target_cpqm: number | null
          updated_at: string
        }
        Insert: {
          budget_allocated?: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          hypothesis?: string | null
          icp: Json
          id?: string
          max_cac_payback_months?: number | null
          name: string
          project_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["experiment_status"]
          success_criteria?: Json | null
          target_cpqm?: number | null
          updated_at?: string
        }
        Update: {
          budget_allocated?: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          hypothesis?: string | null
          icp?: Json
          id?: string
          max_cac_payback_months?: number | null
          name?: string
          project_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["experiment_status"]
          success_criteria?: Json | null
          target_cpqm?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_experiments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "sg_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_fact_sheets: {
        Row: {
          citations_json: Json | null
          created_at: string
          experiment_id: string | null
          generated_by: string | null
          id: string
          md_body: string
          pdf_url: string | null
          project_id: string
          title: string
          updated_at: string
        }
        Insert: {
          citations_json?: Json | null
          created_at?: string
          experiment_id?: string | null
          generated_by?: string | null
          id?: string
          md_body: string
          pdf_url?: string | null
          project_id: string
          title: string
          updated_at?: string
        }
        Update: {
          citations_json?: Json | null
          created_at?: string
          experiment_id?: string | null
          generated_by?: string | null
          id?: string
          md_body?: string
          pdf_url?: string | null
          project_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_fact_sheets_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "sg_experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_fact_sheets_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "sg_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_fact_sheets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "sg_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_gates: {
        Row: {
          benchmark_range: Json | null
          benchmark_source: string | null
          channel_id: string
          created_at: string
          id: string
          is_critical: boolean
          metric: Database["public"]["Enums"]["gate_metric"]
          name: string
          operator: Database["public"]["Enums"]["gate_operator"]
          threshold_value: number
          updated_at: string
          window_days: number
        }
        Insert: {
          benchmark_range?: Json | null
          benchmark_source?: string | null
          channel_id: string
          created_at?: string
          id?: string
          is_critical?: boolean
          metric: Database["public"]["Enums"]["gate_metric"]
          name: string
          operator: Database["public"]["Enums"]["gate_operator"]
          threshold_value: number
          updated_at?: string
          window_days?: number
        }
        Update: {
          benchmark_range?: Json | null
          benchmark_source?: string | null
          channel_id?: string
          created_at?: string
          id?: string
          is_critical?: boolean
          metric?: Database["public"]["Enums"]["gate_metric"]
          name?: string
          operator?: Database["public"]["Enums"]["gate_operator"]
          threshold_value?: number
          updated_at?: string
          window_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "sg_gates_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "sg_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_orgs: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          name: string
          owner_id: string | null
          settings: Json
          slug: string
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          name: string
          owner_id?: string | null
          settings?: Json
          slug: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          settings?: Json
          slug?: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      sg_projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          mode: Database["public"]["Enums"]["project_mode"]
          name: string
          org_id: string
          owner_id: string
          settings: Json
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["project_mode"]
          name: string
          org_id: string
          owner_id: string
          settings?: Json
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["project_mode"]
          name?: string
          org_id?: string
          owner_id?: string
          settings?: Json
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_projects_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "sg_orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "sg_users"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_results: {
        Row: {
          channel_id: string
          costs: Json
          created_at: string
          date: string
          id: string
          is_simulated: boolean
          metrics: Json
          updated_at: string
          variance_applied: number | null
        }
        Insert: {
          channel_id: string
          costs?: Json
          created_at?: string
          date: string
          id?: string
          is_simulated?: boolean
          metrics?: Json
          updated_at?: string
          variance_applied?: number | null
        }
        Update: {
          channel_id?: string
          costs?: Json
          created_at?: string
          date?: string
          id?: string
          is_simulated?: boolean
          metrics?: Json
          updated_at?: string
          variance_applied?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sg_results_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "sg_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_rules: {
        Row: {
          action_logic: Json
          condition_logic: Json
          created_at: string
          description: string | null
          id: string
          is_enabled: boolean
          name: string
          priority: number
          ruleset_id: string
          updated_at: string
        }
        Insert: {
          action_logic: Json
          condition_logic: Json
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean
          name: string
          priority?: number
          ruleset_id: string
          updated_at?: string
        }
        Update: {
          action_logic?: Json
          condition_logic?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean
          name?: string
          priority?: number
          ruleset_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_rules_ruleset_id_fkey"
            columns: ["ruleset_id"]
            isOneToOne: false
            referencedRelation: "sg_rulesets"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_rulesets: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          project_id: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          project_id: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          project_id?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "sg_rulesets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sg_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_rulesets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "sg_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_spaces: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_spaces_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sg_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_spaces_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "sg_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_threads: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_locked: boolean
          space_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_locked?: boolean
          space_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_locked?: boolean
          space_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_threads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sg_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_threads_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "sg_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          name: string
          org_id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          last_login?: string | null
          name: string
          org_id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          name?: string
          org_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_users_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "sg_orgs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_allocator_weights: {
        Row: {
          allocated_budget: number | null
          channel_id: string | null
          channel_type: Database["public"]["Enums"]["channel_type"] | null
          current_weight: number | null
          experiment_id: string | null
          rationale: string | null
          weight_updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sg_channels_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "sg_experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      v_finance: {
        Row: {
          channel_id: string | null
          channel_type: Database["public"]["Enums"]["channel_type"] | null
          cpqm: number | null
          created_at: string | null
          date: string | null
          experiment_id: string | null
          meetings_held: string | null
          total_cost: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sg_channels_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "sg_experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_results_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "sg_channels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_status: "idle" | "working" | "blocked" | "done"
      artifact_type: "benchmark" | "copy" | "calc" | "alloc"
      channel_type:
        | "google_search"
        | "linkedin_inmail"
        | "webinar"
        | "content_marketing"
        | "outbound_email"
        | "events"
        | "partnerships"
        | "referrals"
        | "social_media"
        | "paid_social"
      company_size: "startup" | "smb" | "mid_market" | "enterprise"
      decision_type: "scale" | "iterate" | "kill"
      experiment_status: "draft" | "running" | "paused" | "completed" | "killed"
      gate_metric:
        | "reply_rate"
        | "click_through_rate"
        | "conversion_rate"
        | "cost_per_lead"
        | "cost_per_meeting"
        | "meeting_show_rate"
        | "opportunity_rate"
        | "close_rate"
        | "cac_payback_months"
      gate_operator: "gte" | "lte" | "eq" | "between"
      geographic_region:
        | "north_america"
        | "europe"
        | "asia_pacific"
        | "latin_america"
        | "global"
      notification_trigger:
        | "experiment_started"
        | "experiment_completed"
        | "gate_failed"
        | "budget_threshold_reached"
        | "decision_required"
        | "anomaly_detected"
      project_mode: "simulation" | "connected"
      project_status: "draft" | "active" | "paused" | "completed" | "archived"
      sales_motion: "plg" | "sales_led" | "services"
      subscription_tier: "demo" | "starter" | "growth" | "enterprise"
      user_role: "owner" | "contributor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}