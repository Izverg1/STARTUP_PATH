-- =====================================================================================
-- STARTUP_PATH Platform - Seed Data Loading Script
-- Database: KSON_DB (Supabase)
-- Prefix: SPATH_ (all tables)
-- Purpose: Load startup_path_demo JSON data into database for realistic simulations
-- =====================================================================================

-- =====================================================================================
-- LOAD SCENARIO DATA from startup_path_demo
-- =====================================================================================

-- Insert scenarios from startup_path_demo JSON files
INSERT INTO SPATH_scenarios (scenario_id, title, seed, icp_persona, icp_company_size, icp_geography, acv, gross_margin, mrr_per_customer, window_days, channels, category, is_active) VALUES

-- FinOps Midmarket Scenario
('finops_midmarket', 'FinOps SaaS — Midmarket', 11873, 'FinOps Lead', '200-2000', 'NA/EU', 18000.00, 0.700, 1500.00, 14, 
'{
  "channels": [
    {
      "type": "search",
      "label": "Google Search",
      "budget_per_day": 400,
      "base": {
        "impressions": 12000,
        "ctr": 0.035,
        "cpc": 4.2,
        "lp_cvr": 0.14,
        "lead_to_meeting": 0.25,
        "meeting_to_opp": 0.45,
        "opp_to_win": 0.25
      },
      "variability": {
        "impressions": 0.1,
        "rates": 0.15,
        "cpc": 0.1
      },
      "lags": {
        "meeting_days": [0, 0],
        "opp_days": [2, 5],
        "win_days": [7, 21]
      }
    },
    {
      "type": "linkedin_inmail",
      "label": "LinkedIn InMail",
      "sends_per_day": 800,
      "cost_per_send": 0.3,
      "base": {
        "reply_rate": 0.035,
        "meet_given_reply": 0.3,
        "opp_given_meeting": 0.35,
        "win_given_opp": 0.25
      },
      "variability": {
        "rates": 0.2
      },
      "lags": {
        "meeting_days": [0, 1],
        "opp_days": [2, 6],
        "win_days": [7, 21]
      }
    },
    {
      "type": "webinar",
      "label": "Webinar",
      "regs_per_day": 110,
      "cost_per_reg": 75,
      "base": {
        "reg_to_attend": 0.4,
        "attend_to_meeting": 0.16,
        "opp_given_meeting": 0.35,
        "win_given_opp": 0.2
      },
      "variability": {
        "rates": 0.15,
        "regs": 0.1
      },
      "lags": {
        "meeting_days": [0, 2],
        "opp_days": [2, 7],
        "win_days": [10, 28]
      }
    }
  ]
}', 'demo', true),

-- DevTools PLG Scenario
('devtools_plg', 'DevTools PLG — Product-Led Growth', 42351, 'Engineering Lead', '50-500', 'Global', 24000.00, 0.850, 2000.00, 21,
'{
  "channels": [
    {
      "type": "search",
      "label": "Google Search",
      "budget_per_day": 300,
      "base": {
        "impressions": 8000,
        "ctr": 0.045,
        "cpc": 3.8,
        "lp_cvr": 0.18,
        "lead_to_trial": 0.8,
        "trial_to_paid": 0.15
      },
      "variability": {
        "impressions": 0.12,
        "rates": 0.18,
        "cpc": 0.15
      },
      "lags": {
        "trial_days": [0, 1],
        "paid_days": [7, 14]
      }
    },
    {
      "type": "content",
      "label": "Developer Content",
      "budget_per_day": 150,
      "base": {
        "views": 5000,
        "engagement_rate": 0.08,
        "lead_conversion": 0.12,
        "trial_conversion": 0.6
      },
      "variability": {
        "views": 0.2,
        "rates": 0.25
      },
      "lags": {
        "trial_days": [1, 3],
        "paid_days": [14, 21]
      }
    },
    {
      "type": "github_sponsorship",
      "label": "GitHub Sponsorship",
      "budget_per_day": 200,
      "base": {
        "repo_visits": 2000,
        "star_to_signup": 0.25,
        "signup_to_trial": 0.7,
        "trial_to_paid": 0.12
      },
      "variability": {
        "visits": 0.15,
        "rates": 0.2
      },
      "lags": {
        "trial_days": [0, 2],
        "paid_days": [3, 10]
      }
    }
  ]
}', 'demo', true),

-- B2B Services Midmarket Scenario  
('services_midmarket', 'B2B Services — Midmarket', 78432, 'Operations VP', '500-5000', 'NA', 45000.00, 0.600, 3750.00, 28,
'{
  "channels": [
    {
      "type": "search",
      "label": "Google Search",
      "budget_per_day": 600,
      "base": {
        "impressions": 15000,
        "ctr": 0.028,
        "cpc": 6.5,
        "lp_cvr": 0.12,
        "lead_to_meeting": 0.35,
        "meeting_to_proposal": 0.6,
        "proposal_to_win": 0.3
      },
      "variability": {
        "impressions": 0.08,
        "rates": 0.12,
        "cpc": 0.12
      },
      "lags": {
        "meeting_days": [1, 3],
        "proposal_days": [7, 14],
        "win_days": [21, 45]
      }
    },
    {
      "type": "linkedin_ads",
      "label": "LinkedIn Ads",
      "budget_per_day": 400,
      "base": {
        "impressions": 8000,
        "ctr": 0.015,
        "cpc": 8.2,
        "lp_cvr": 0.15,
        "lead_to_meeting": 0.4,
        "meeting_to_proposal": 0.65,
        "proposal_to_win": 0.35
      },
      "variability": {
        "impressions": 0.1,
        "rates": 0.15,
        "cpc": 0.1
      },
      "lags": {
        "meeting_days": [2, 5],
        "proposal_days": [10, 21],
        "win_days": [28, 60]
      }
    },
    {
      "type": "events",
      "label": "Industry Events",
      "budget_per_day": 350,
      "base": {
        "booth_visits": 150,
        "badge_scans": 0.6,
        "scan_to_meeting": 0.25,
        "meeting_to_proposal": 0.7,
        "proposal_to_win": 0.4
      },
      "variability": {
        "visits": 0.3,
        "rates": 0.2
      },
      "lags": {
        "meeting_days": [7, 14],
        "proposal_days": [14, 28],
        "win_days": [35, 75]
      }
    }
  ]
}', 'demo', true);

-- =====================================================================================
-- LOAD BENCHMARK DATA from startup_path_demo/benchmarks.json
-- =====================================================================================

-- Finance benchmarks
INSERT INTO SPATH_benchmarks (category, metric_name, min_value, max_value, target_value, unit, source_label, confidence_level, geography, vertical) VALUES
('finance', 'payback_good_months', 12.0, 18.0, 15.0, 'months', 'SaaS industry benchmark 2024', 'high', 'global', 'saas'),
('finance', 'gross_margin_default', 0.65, 0.85, 0.75, 'percentage', 'SaaS margin analysis', 'high', 'global', 'saas');

-- Search channel benchmarks
INSERT INTO SPATH_benchmarks (category, metric_name, channel_type, min_value, max_value, target_value, unit, source_label, confidence_level, geography, vertical) VALUES
('channels', 'lp_cvr_range', 'search', 0.10, 0.20, 0.15, 'percentage', 'Google Ads benchmark', 'medium', 'global', null),
('channels', 'click_cvr_range', 'search', 0.03, 0.12, 0.07, 'percentage', 'Search conversion benchmark', 'medium', 'global', null),
('channels', 'cpc_range', 'search', 2.0, 8.0, 5.0, 'dollars', 'B2B search CPC benchmark', 'medium', 'global', 'b2b'),
('channels', 'cpl_range', 'search', 40.0, 220.0, 120.0, 'dollars', 'B2B lead cost benchmark', 'medium', 'global', 'b2b'),
('channels', 'meet_rate_range', 'search', 0.15, 0.4, 0.25, 'percentage', 'Lead-to-meeting benchmark', 'medium', 'global', 'b2b');

-- LinkedIn channel benchmarks
INSERT INTO SPATH_benchmarks (category, metric_name, channel_type, min_value, max_value, target_value, unit, source_label, confidence_level, geography, vertical) VALUES
('channels', 'response_rate_range', 'linkedin_inmail', 0.02, 0.08, 0.04, 'percentage', 'LinkedIn InMail benchmark', 'medium', 'global', 'b2b'),
('channels', 'cost_per_send', 'linkedin_inmail', 0.25, 0.6, 0.35, 'dollars', 'LinkedIn pricing 2024', 'high', 'global', null),
('channels', 'meet_given_response', 'linkedin_inmail', 0.2, 0.5, 0.3, 'percentage', 'LinkedIn meeting conversion', 'medium', 'global', 'b2b');

-- Content marketing benchmarks
INSERT INTO SPATH_benchmarks (category, metric_name, channel_type, min_value, max_value, target_value, unit, source_label, confidence_level, geography, vertical) VALUES
('channels', 'content_engagement', 'content', 0.05, 0.15, 0.08, 'percentage', 'Content marketing benchmark', 'medium', 'global', null),
('channels', 'content_conversion', 'content', 0.08, 0.18, 0.12, 'percentage', 'Content lead conversion', 'medium', 'global', null);

-- Webinar benchmarks
INSERT INTO SPATH_benchmarks (category, metric_name, channel_type, min_value, max_value, target_value, unit, source_label, confidence_level, geography, vertical) VALUES
('channels', 'webinar_attendance', 'webinar', 0.3, 0.6, 0.45, 'percentage', 'Webinar attendance benchmark', 'medium', 'global', 'b2b'),
('channels', 'webinar_to_meeting', 'webinar', 0.12, 0.25, 0.18, 'percentage', 'Webinar conversion benchmark', 'medium', 'global', 'b2b'),
('channels', 'cost_per_registration', 'webinar', 50.0, 120.0, 80.0, 'dollars', 'Webinar cost benchmark', 'medium', 'global', 'b2b');

-- =====================================================================================
-- LOAD SEASONALITY DATA from startup_path_demo/seasonality.json
-- =====================================================================================

-- Day of week multipliers
INSERT INTO SPATH_seasonality (name, type, day_of_week, impression_multiplier, conversion_multiplier, cost_multiplier, description, source_label, geography) VALUES
('Monday B2B', 'day_of_week', 1, 0.85, 0.9, 1.0, 'Monday slower start for B2B', 'B2B seasonal analysis', 'global'),
('Tuesday B2B Peak', 'day_of_week', 2, 1.1, 1.15, 1.05, 'Tuesday peak performance', 'B2B seasonal analysis', 'global'),
('Wednesday B2B Peak', 'day_of_week', 3, 1.15, 1.2, 1.05, 'Wednesday peak performance', 'B2B seasonal analysis', 'global'),
('Thursday B2B Strong', 'day_of_week', 4, 1.05, 1.1, 1.0, 'Thursday strong performance', 'B2B seasonal analysis', 'global'),
('Friday B2B Decline', 'day_of_week', 5, 0.9, 0.85, 0.95, 'Friday performance decline', 'B2B seasonal analysis', 'global'),
('Saturday B2B Low', 'day_of_week', 6, 0.4, 0.3, 0.8, 'Saturday very low B2B activity', 'B2B seasonal analysis', 'global'),
('Sunday B2B Low', 'day_of_week', 0, 0.3, 0.25, 0.8, 'Sunday very low B2B activity', 'B2B seasonal analysis', 'global');

-- Quarterly seasonality
INSERT INTO SPATH_seasonality (name, type, quarter, impression_multiplier, conversion_multiplier, cost_multiplier, description, source_label, geography) VALUES
('Q1 Budget Freeze', 'quarterly', 1, 0.8, 0.75, 1.1, 'Q1 budget constraints', 'B2B quarterly trends', 'global'),
('Q2 Recovery', 'quarterly', 2, 1.0, 1.0, 1.0, 'Q2 normal activity', 'B2B quarterly trends', 'global'),
('Q3 Summer Slowdown', 'quarterly', 3, 0.85, 0.9, 0.95, 'Q3 vacation impact', 'B2B quarterly trends', 'global'),
('Q4 Year End Push', 'quarterly', 4, 1.25, 1.3, 1.15, 'Q4 year-end budget spend', 'B2B quarterly trends', 'global');

-- Event-based seasonality
INSERT INTO SPATH_seasonality (name, type, event_name, start_date, end_date, impression_multiplier, conversion_multiplier, cost_multiplier, description, source_label) VALUES
('Black Friday Week', 'event_based', 'Black Friday', '2024-11-25', '2024-11-30', 1.4, 0.8, 1.3, 'High traffic, lower B2B conversion', 'E-commerce impact on B2B', 'global'),
('Christmas Holiday', 'event_based', 'Christmas Break', '2024-12-23', '2025-01-02', 0.3, 0.2, 0.7, 'Business shutdown period', 'Holiday impact analysis', 'global'),
('Dreamforce Conference', 'event_based', 'Dreamforce', '2024-09-17', '2024-09-20', 1.2, 1.4, 1.1, 'SaaS conference boost', 'Conference season analysis', 'global');

-- =====================================================================================
-- CREATE DEMO ORGANIZATION AND USERS
-- =====================================================================================

-- Create demo organization (using fixed UUID for consistency)
INSERT INTO SPATH_organizations (id, name, slug, domain, subscription_tier, settings) VALUES 
('01234567-89ab-cdef-0123-456789abcdef', 'STARTUP_PATH Demo Corp', 'demo-corp', 'democorp.startuppath.ai', 'demo', 
'{"demo_mode": true, "scenario_access": ["finops_midmarket", "devtools_plg", "services_midmarket"], "features_enabled": ["simulation", "benchmarks", "collaboration"]}');

-- Note: Demo users would be created through the authentication system
-- This script focuses on seed data, not user creation

-- =====================================================================================
-- CREATE DEMO PROJECT
-- =====================================================================================

-- Create demo project (will be linked to demo org)
INSERT INTO SPATH_projects (id, name, description, org_id, owner_id, status, mode, settings) VALUES 
('11111111-2222-3333-4444-555555555555', 'GTM Optimization Lab', 'Demo project showcasing STARTUP_PATH simulation capabilities', 
'01234567-89ab-cdef-0123-456789abcdef', '00000000-0000-0000-0000-000000000000', 'active', 'simulation',
'{"default_scenario": "finops_midmarket", "simulation_enabled": true, "ai_agents_active": true}');

-- =====================================================================================
-- VALIDATION QUERIES
-- =====================================================================================

-- Verify data was loaded correctly
DO $$
DECLARE
    scenario_count INTEGER;
    benchmark_count INTEGER;
    seasonality_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO scenario_count FROM SPATH_scenarios;
    SELECT COUNT(*) INTO benchmark_count FROM SPATH_benchmarks;
    SELECT COUNT(*) INTO seasonality_count FROM SPATH_seasonality;
    
    RAISE NOTICE 'Loaded % scenarios from startup_path_demo', scenario_count;
    RAISE NOTICE 'Loaded % benchmark ranges', benchmark_count;
    RAISE NOTICE 'Loaded % seasonality multipliers', seasonality_count;
    
    IF scenario_count < 3 THEN
        RAISE EXCEPTION 'Expected at least 3 scenarios, got %', scenario_count;
    END IF;
    
    IF benchmark_count < 10 THEN
        RAISE EXCEPTION 'Expected at least 10 benchmarks, got %', benchmark_count;
    END IF;
    
    IF seasonality_count < 10 THEN
        RAISE EXCEPTION 'Expected at least 10 seasonality entries, got %', seasonality_count;
    END IF;
    
    RAISE NOTICE 'SUCCESS: All startup_path_demo data loaded successfully!';
    RAISE NOTICE 'Demo organization created: STARTUP_PATH Demo Corp';
    RAISE NOTICE 'Available scenarios: finops_midmarket, devtools_plg, services_midmarket';
    RAISE NOTICE 'Platform ready for realistic GTM simulations';
END $$;

-- =====================================================================================
-- SAMPLE QUERIES for testing
-- =====================================================================================

-- Test query: Get all scenarios with their economics
-- SELECT scenario_id, title, icp_persona, acv, gross_margin, mrr_per_customer FROM SPATH_scenarios WHERE is_active = true;

-- Test query: Get search channel benchmarks
-- SELECT metric_name, min_value, max_value, target_value, unit, source_label FROM SPATH_benchmarks WHERE channel_type = 'search';

-- Test query: Get Tuesday seasonality multipliers
-- SELECT name, impression_multiplier, conversion_multiplier, cost_multiplier FROM SPATH_seasonality WHERE day_of_week = 2;

-- =====================================================================================
-- COMPLETION MESSAGE
-- =====================================================================================

COMMENT ON TABLE SPATH_scenarios IS 'Loaded from startup_path_demo: finops_midmarket.json, devtools_plg.json, services_midmarket.json';
COMMENT ON TABLE SPATH_benchmarks IS 'Loaded from startup_path_demo: benchmarks.json with industry ranges and targets';
COMMENT ON TABLE SPATH_seasonality IS 'Loaded from startup_path_demo: seasonality.json with day-of-week and event multipliers';