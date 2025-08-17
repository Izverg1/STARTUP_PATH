# SOL:GEN Sub-Agents Usage Guide

This directory contains 5 specialized Claude Code sub-agents designed for the SOL:GEN startup simulation platform. Each agent is an expert in a specific technical domain.

## Available Sub-Agents

### 🌟 three-js-specialist
**Domain**: 3D Graphics & Visualization  
**Use for**: Three.js components, WebGL optimization, animations, orbital diagrams  
**Files**: Hero3D, ChannelOrbitDiagram, SpaceStationVisualization, AgentLLMVisualization

### 🗄️ supabase-db-architect  
**Domain**: Database & Backend Integration  
**Use for**: Schema design, RLS policies, real-time subscriptions, migrations  
**Files**: Database schemas, auth policies, Supabase client configuration

### 🧮 simulation-engine-expert
**Domain**: Algorithms & Analytics  
**Use for**: Thompson Sampling, marketing metrics, simulation logic, demo data  
**Files**: /src/lib/simulation/, metrics calculations, allocation algorithms

### ⚛️ nextjs-ui-architect
**Domain**: Frontend Architecture & UI  
**Use for**: React components, Tailwind styling, routing, responsive design  
**Files**: /src/components/, /src/app/, layout systems, form handling

### 🤖 agent-system-coordinator
**Domain**: Multi-Agent System & AI Integration  
**Use for**: Agent states, artifacts management, collaboration, LLM integration  
**Files**: Agent system, AI assistant, collaboration features, fact sheets

## How to Use Sub-Agents

### Automatic Delegation
Claude Code will automatically route tasks to appropriate agents based on:
- File paths being modified
- Task descriptions and keywords
- Current context and conversation flow

### Explicit Invocation
You can explicitly request a specific agent:

```bash
# Three.js work
@three-js-specialist "Optimize the hero orbital animation for mobile performance"

# Database changes  
@supabase-db-architect "Add RLS policy for experiment templates"

# Simulation logic
@simulation-engine-expert "Implement seasonal variance in allocation algorithm"

# UI components
@nextjs-ui-architect "Create responsive agent card layout"

# Agent coordination
@agent-system-coordinator "Add real-time status sync for Budget Captain"
```

### Common Usage Patterns

#### Feature Development
```bash
# Multi-agent collaboration for new features
@nextjs-ui-architect "Create the UI for channel performance widget"
@simulation-engine-expert "Calculate the metrics for the widget backend"
@supabase-db-architect "Design table schema for performance data"
```

#### Bug Fixes
```bash
# Route to specialist based on issue domain
@three-js-specialist "Debug WebGL memory leak in orbit animation"
@agent-system-coordinator "Fix agent state synchronization issue"
```

#### Performance Optimization
```bash
@three-js-specialist "Reduce memory usage in particle systems"
@nextjs-ui-architect "Optimize bundle size for dashboard components"
@supabase-db-architect "Optimize slow queries in analytics views"
```

## Best Practices

### 1. Choose the Right Agent
- **Frontend Issues**: nextjs-ui-architect
- **3D/Graphics**: three-js-specialist  
- **Database/API**: supabase-db-architect
- **Math/Algorithms**: simulation-engine-expert
- **Agent System**: agent-system-coordinator

### 2. Be Specific
Good: "@three-js-specialist optimize orbital animation performance on mobile"
Poor: "@three-js-specialist make it faster"

### 3. Context Matters
Agents maintain their own context, so provide relevant background:
- Current issue or goal
- Specific files or components involved
- Performance requirements or constraints

### 4. Leverage Cross-Agent Coordination
For complex features, engage multiple agents:
1. Design phase: nextjs-ui-architect
2. Data modeling: supabase-db-architect  
3. Business logic: simulation-engine-expert
4. Integration: agent-system-coordinator

## Agent Capabilities Matrix

| Task Type | Primary Agent | Secondary Agent |
|-----------|---------------|-----------------|
| New UI Component | nextjs-ui-architect | agent-system-coordinator |
| Database Schema | supabase-db-architect | - |
| 3D Animation | three-js-specialist | nextjs-ui-architect |
| Metrics Calculation | simulation-engine-expert | agent-system-coordinator |
| Agent Behavior | agent-system-coordinator | simulation-engine-expert |
| Form Handling | nextjs-ui-architect | supabase-db-architect |
| Performance Optimization | (depends on domain) | - |
| Real-time Features | supabase-db-architect | agent-system-coordinator |

## Troubleshooting

### Agent Not Responding
- Verify agent name spelling in `/agents` command
- Check if task description matches agent expertise
- Try explicit invocation with @agent-name

### Wrong Agent Selected  
- Be more specific in task description
- Use explicit @agent-name invocation
- Review agent expertise areas in this guide

### Multiple Agents Needed
- Start with primary domain agent
- Request coordination with other agents as needed
- Use sequential approach for complex workflows

## Customization

To modify an agent:
1. Run `/agents` in Claude Code
2. Select the agent to edit
3. Modify description, tools, or system prompt
4. Save changes

To add new agents:
1. Run `/agents` → "Create New Agent"
2. Choose "Project-level" for SOL:GEN-specific agents
3. Follow the existing agent patterns in this directory

---

These specialized agents will significantly improve development efficiency and code quality for the SOL:GEN platform by providing domain-specific expertise and maintaining focused context for each technical area.
