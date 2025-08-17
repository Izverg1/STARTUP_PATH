# SOL:GEN for startups™ — Simulated MVP (One-File Spec)
**© Karlson LLC. All rights reserved.**  
**Theme:** matches [iamkarlson.com] (neutral dark, high contrast, magenta accent)  
**Demo mode:** fully simulated, deterministic; real connectors can be wired later without changing UX.

---

## 0) What this file is
A single, demo-ready specification you can hand to design/engineering to produce a clickable simulation for prospects. It includes:
- hero animation (light Three.js vectors),  
- onboarding wizard,  
- simulation labs,  
- compact **magenta** agent **cards** (≈1″×1″) with an **Artifacts** sidebar,  
- dashboards & effectiveness metrics,  
- business rules builder, collaboration, and  
- an intelligent, domain-aware assistant that creates **persistent fact sheets**.

Everything here is realistic to implement and structured for eventual integration.

---

## 1) Brand, theme, and layout
- **Product name:** `SOL:GEN for startups™` (footer shows trademark + © **Karlson LLC**).  
- **Theme ingestion:** attempt to read base CSS tokens from `iamkarlson.com` at runtime. If blocked, fallback palette:
  - Background: `#0A0A0A` / `#111`  
  - Surface: `#151515` / `#1A1A1A`  
  - Text: `#FAFAFA` / `#D0D0D0`  
  - Accent (agents only): **Magenta** `#F0A` → utility class `.accent-magenta`
- **Typography:** Inter or system-ui; spacing from 4/8 px grid; generous line-height.
- **Layout shell:**  
  ```
  [Agent Dock 96px] | [Main Content fluid 720–1280px] | [Artifacts 320px]
  ```
- **Motion principle:** 90–120 ms microinteractions for status only; respect `prefers-reduced-motion`.
- **Accessibility:** 4.5:1 contrast minimum; focus rings; semantic headings.

---

## 2) Navigation & information architecture
Left nav (icons + labels):
- **Home** (Today, Your tests, Wins, Risks)
- **Experiments** (Designer, Active tests, Kill log)
- **Benchmarks** (Paid, Outbound, Events/Webinars, Owned Media)
- **Rules** (Business rules & approvals)
- **Collab** (Spaces, Threads, Decisions)
- **Effectiveness** (CPQM, CPO, CAC, CAC **Payback**, MER)
- **Assistant** (Ask SOL:GEN)
- **Admin** (Connectors, Roles, *Demo Mode* toggle)

Progressive disclosure keeps the first-time flow obvious; no modal walls of text.

---

## 3) First-run **Onboarding Wizard** (3–4 simple steps)
**Goal:** get a founder from zero → a believable simulated run in under 3 minutes.

**Step 1 – ICP & economics**  
- Persona (e.g., FinOps lead), company size band, geo  
- ACV band (e.g., $6–25k), gross margin (%)  
- Sales motion: PLG vs Sales-led / Services

**Step 2 – Select channels to test (2–3)**  
- Examples: **Google Search**, **LinkedIn InMail**, **Webinar**  
- Each card shows pre-filled **pass/fail gates** from Benchmarks (e.g., InMail reply ≥3–6% *or* ≤$350 per qualified meeting; Webinar reg→attend ≥35–45%; Search LP CVR ≥10–20% with CPL within band).

**Step 3 – Define success**  
- Acceptable **CAC payback** window (e.g., ≤12 mo preferred, ≤18 mo acceptable)  
- KPI: **CPQM** (cost per qualified meeting) as the primary “reward”

**Step 4 – Choose mode**  
- **Simulation** (deterministic seed) or **Connected** (later: connect Ads/Outreach/CRM).  
- Land in **Run View** with seeded day 0 data.

Help is inline, short, and skippable.

---

## 4) **Simulation Labs**
A safe, contained sandbox where founders **prompt** “what-ifs” without spending real budget.

- **Scenario library:** “Search vs InMail vs Webinar”, “Pre-seed low-budget”, “Mid-market buyer w/ compliance gate”.  
- **Prompt surface:**  
  > “Simulate B2B FinOps SaaS targeting $20–200M ARR companies; budget $6k; decision window 14 days; favor channels with sub-$300 CPQM.”
- **Allocator:** nightly **Thompson Sampling** that re-weights spend toward **lower CPQM** (exploration vs exploitation).  
- **Decision gate:** channel **passes** only if **pass/fail** thresholds are met **and** modeled **CAC payback** ≤ chosen window.  
- **Noise slider:** ±10% variance to demonstrate robustness.

---

## 5) Agents as **compact cards** + Artifacts sidebar
### 5.1 Agent Dock (left, fixed)
Four 1″×1″ cards (≈96×96 px) with a tiny label + one-line status and **subtle** status animation:
1) **Channel Scout** — proposes channels & pre-fills gates from Benchmarks.  
   - Micro-animation: compass tick every 2 s.  
   - Example status: “Gates set: email 3–6%…”
2) **Offer Alchemist** — drafts offers, subject lines, and LP blocks; light A/B copy checks.  
   - Micro-animation: three typing dots.  
   - Example status: “Drafting InMail v2…”
3) **Signal Wrangler** — computes **CPQM / CAC / Payback**; flags anomalies.  
   - Micro-animation: thin indeterminate ring.  
   - Example status: “Payback modeling…”
4) **Budget Captain** — nightly allocator move with rationale.  
   - Micro-animation: tiny bar-sparkline sweep.  
   - Example status: “+20% Search, −10% InMail”

**States:** `idle | working | blocked | done` control the micro-animation.

### 5.2 Artifacts (right sidebar)
A scannable, time-ordered feed of outputs:
- **benchmark** (gate rationale chips),
- **copy** (InMail v1/v2, LP headline variants),
- **calc** (finance math snapshot, anomaly note),
- **alloc** (“Allocator move 2025‑08‑15”, human-readable rationale).

Each item expands in-place; all artifacts are versioned and searchable.

---

## 6) Distribution channel **graphics** (vector / Three.js)
- **Hero:** one light **Three.js** scene with instanced lines/points orbiting the title **SOL:GEN for startups™**. Auto-pause on tab blur; cap device pixel ratio for perf.  
- **Channel Orbit Diagram:** a radial “bullseye”—each dot is a channel, sized by **meetings/day**, colored by **payback** band. Smooth transitions when allocator re-weights.  
- **Static fallback:** if WebGL unavailable, render the same with inline SVG (no loss of meaning).

---

## 7) Effectiveness dashboards
**Funnel:** Lead → Meeting → Opportunity → Win (drop-offs + uncertainty).  
**Finance:** **CPQM**, **CPO**, **CAC**, **CAC Payback** (dial with “good/acceptable” shaded band), **MER**.  
**Allocator timeline:** daily weight shifts with the Captain’s text rationale.  
**Kill log:** hypotheses, results, lessons (prevents zombie projects).

---

## 8) Business rules (plain-English → JSON, versioned)
**Examples founders can toggle:**
- “If **Payback > 18 mo** for 7 consecutive days → **Auto‑pause channel** and open a task.”  
- “If **Webinar Attend < 35%**, suggest topic refresh + follow-up sequence.”  
- “If **CPQM > $400** after day 7, shift 10% spend to best-performing channel.”

Rules require approval in **Collab**; every change is auditable and revertible.

---

## 9) Collaboration
- **Spaces**: per project or experiment.  
- **Threads**: @mentions, attachments.  
- **Decisions**: Approve / Reject with rationale → logged to an immutable **Decision Log**.  
- Export any thread/decision to **PDF** for board packs.

---

## 10) Assistant (“Ask SOL:GEN”)
A domain-aware advisor (narrow scope, controllable), grounded in your data:
- **System brief:** “You are SOL:GEN, a startup GTM advisor. Prioritize validated learning, explicit success gates, and CAC payback.”  
- **Context:** reads ICP, ACV, Rules, and Benchmarks.  
- **Tools:** `create_experiment`, `suggest_gates`, `explain_allocator_move`, `summarize_outcome`, `write_outreach_copy`.  
- **Guardrails:** cite benchmark panels; never promise outcomes; recommend enhanced/offline conversions when Ads are used.

**Sample prompts (chips):**
- “Draft my LinkedIn InMail test for FinOps buyers.”  
- “Are we overpaying for Google clicks vs benchmark?”  
- “Summarize last 10 days & recommend the next experiment.”

---

## 11) Fact‑Sheet Generator (persistent value)
Nightly job creates a 1‑page, board‑ready brief (Markdown → PDF) per project:
- **What we tried**, **what worked**, **gates met/missed**, **CAC/CAC‑payback math**, **Scale / Iterate / Kill** decision, **next tests**.  
- **Grounding:** RAG (retrieval‑augmented generation) from `sg_benchmarks`, `sg_rules`, prior fact sheets, and latest results; every stat is footnoted to its source row.  
- **Audience:** founders, boards, and even customer-facing summaries.

---

## 12) Data model (Supabase‑ready; prefix `sg_`)
- `sg_orgs`, `sg_users` (RBAC, SSO later)  
- `sg_projects` (workspace)  
- `sg_experiments` (id, project_id, status, icp, acv, margin)  
- `sg_channels` (type, params)  
- `sg_gates` (kpi, operator, threshold, window_days, source)  
- `sg_results` (day, impressions, clicks, leads, replies, meetings, opps, wins, spend)  
- `sg_rulesets`, `sg_rules` (json logic, version, approver_id)  
- `sg_decisions` (scale/iterate/kill, reason, approver, ts)  
- `sg_threads`, `sg_comments`  
- `sg_benchmarks` (metric, vertical, value, source_url, updated_at)  
- `sg_fact_sheets` (md_body, pdf_url, citations_json)  
- `sg_agents` (key, title, icon, active)  
- `sg_agent_state` (agent_key, status_enum, status_line, pct, updated_at)  
- `sg_artifacts` (type_enum[benchmark|copy|calc|alloc], title, md_body, json_meta, created_at)

**Views:**  
- `v_finance`: CAC, Payback, MER per channel/day.  
- `v_allocator_weights`: weight history + rationale text for transparency.

---

## 13) Front‑end components (React / Next.js + Tailwind)
- **Hero3D** (optional): Three.js light orbit; auto‑pause on blur; capped DPR.  
- **Wizard**: 4‑step with contextual tips; never blocking.  
- **ExperimentDesigner**: ICP card, Channel cards (editable gates), Payback preview.  
- **RunView**: KPIs, status badges, Allocator weights sparkline.  
- **AgentDock**: 4 tiny cards with micro‑animations based on state.  
- **Artifacts**: right sidebar feed; expand in place.  
- **BenchmarksPanel**: chips with ranges and source labels.  
- **RulesBuilder**: plain‑English → JSON, versions, approvals.  
- **EffectivenessDashboard**: funnel, finance dial, allocator timeline.  
- **DecisionLog**: immutable list of scale/iterate/kill with reasons.

**Key styles:** Mostly black/white surfaces; magenta **only** for agent accents and selection.

---

## 14) Micro‑animations (keep subtle)
- **working:** 3 typing dots or thin indeterminate ring  
- **done:** small success ring sweep (SVG path animation)  
- **blocked:** amber exclamation badge  
- Durations 90–120 ms; spring/ease‑out; all gated by `prefers-reduced-motion`.

---

## 15) Demo Mode (deterministic seeds)
Environment: `NEXT_PUBLIC_DEMO=true`
- Seeder populates: ICP, 3 channels, gates, 14 days of synthetic results.  
- Allocator endpoint returns canned weight shifts by `(project_id, day_index)`.  
- Toggle **Noise** (±10%) to show robustness.  
- **Demo/Real switch** stored in `sg_projects.mode`.

---

## 16) Connectors (for “Connected” mode later)
- **Ads:** Google, LinkedIn (with offline conversion import / enhanced conversions for leads)  
- **Outreach:** Apollo/HubSpot Sales (replies, meetings)  
- **Webinars:** Zoom/ON24 (attendance, follow‑ups)  
- **CRM:** HubSpot/Salesforce (opportunities, wins)  
- Server‑side GA4 recommended for parity across ad blockers.

---

## 17) Security & governance
- Roles: Owner / Contributor / Viewer; row‑level security per org/project.  
- Audit trails on: rules, gates, decisions, connector scopes.  
- SOC 2 roadmap when leaving demo (logs, backups, SSO/SAML).

---

## 18) Accessibility & performance checklist
- 4.5:1 contrast; keyboard‑navigable; ARIA on toggles and tabs.  
- WebGL scene ≤ ~5–10k instanced points; draw calls minimized.  
- Pause animations in background; throttle with `requestIdleCallback` for non‑critical work.

---

## 19) 7‑day build plan (demo‑first)
**Day 1:** App shell, theme tokens, Hero3D fallback SVG, nav.  
**Day 2:** Wizard + seeded project creation.  
**Day 3:** Experiment Designer + Benchmarks panel chips.  
**Day 4:** Run View + Agent Dock states + Artifacts feed.  
**Day 5:** Effectiveness Dashboard + finance dial + allocator timeline.  
**Day 6:** Rules Builder (plain‑English → JSON) + approvals + Decision Log.  
**Day 7:** Fact‑Sheet generator (MD → PDF) + export; polish micro‑animations; “Demo/Real” toggle.

---

## 20) Demo script (5–7 minutes)
1) **Hero**: “SOL:GEN for startups™ — by **Karlson LLC**. Run my first GTM test.” (magenta accent; orbiting vectors.)  
2) **Wizard**: choose ICP, ACV band, 3 channels, set payback ≤ 12–18 mo; start **Simulation**.  
3) **Run View**: see **CPQM**, meetings, opps, wins; **Agent Dock** shows activity; right **Artifacts** logs outputs.  
4) **Effectiveness**: CAC Payback dial in “acceptable” band; allocator timeline with Captain’s rationale.  
5) **Rules**: toggle *“If Payback > 18 mo for 7 days, auto‑pause.”* Approve; re‑run.  
6) **Assistant**: “Summarize last 10 days & recommend the next experiment.”  
7) **Fact‑Sheet**: open the generated 1‑pager; export PDF.

---

## 21) Example UI copy
- **Wizard tip:** “Benchmarks pre‑fill pass/fail gates so you can decide with evidence.”  
- **Allocator note:** “Budgets shift nightly toward the lowest **cost per qualified meeting**.”  
- **Decision banner:** “**Scale**: Search met gates and 12‑mo payback. **Iterate**: Webinar. **Kill**: InMail (reply < 3%).”

---

## 22) Example CSS tokens (fallback)
```css
:root {
  --bg: #0b0b0b; --surface: #151515; --muted: #1a1a1a;
  --text: #fafafa; --text-dim: #cfcfcf; --accent: #ff0aa8; /* magenta for agents */
  --ring: #7c7c7c; --border: #262626;
}
```

---

## 23) Example React stubs (Agent Dock & Artifacts)
```tsx
// AgentDock.tsx (cards ~96×96px; subtle motion; accessible labels)
type State = "idle"|"working"|"blocked"|"done";
type AgentState = { key:string; title:string; state:State; line:string };

const A: AgentState[] = [
  { key:"scout", title:"Channel Scout", state:"done",    line:"Gates set: email 3–6%…" },
  { key:"alchemist", title:"Offer Alchemist", state:"working", line:"Drafting InMail v2…" },
  { key:"wrangler", title:"Signal Wrangler", state:"working", line:"Payback modeling…" },
  { key:"captain", title:"Budget Captain", state:"idle",  line:"Waiting for day close" }
];

export function AgentDock(){
  return (
    <aside className="w-28 p-2 border-r border-[var(--border)] bg-[var(--bg)] text-[var(--text)]">
      <div className="grid gap-3">
        {A.map(x => (
          <button key={x.key} className="relative w-24 h-24 rounded-xl border border-[var(--border)] bg-[var(--muted)] hover:border-[var(--accent)] focus:outline-none" aria-label={`${x.title}: ${x.line}`}>
            <div className="absolute top-1 left-1 text-xs opacity-70">{icon(x.key)}</div>
            <div className="absolute bottom-1 left-1 right-1 text-[10px] leading-tight opacity-80">
              <div className="truncate">{x.title}</div>
              <div className="truncate opacity-70">{x.line}</div>
            </div>
            {x.state==="working" && <Dots/>}
            {x.state==="done" && <Ring/>}
            {x.state==="blocked" && <Warn/>}
          </button>
        ))}
      </div>
    </aside>
  );
}
```

```tsx
// Artifacts.tsx (right sidebar feed)
type Artifact = { id:string; agent:string; title:string; kind:"benchmark"|"copy"|"calc"|"alloc"; ts:string };
export function Artifacts({ items }:{ items:Artifact[] }){
  return (
    <aside className="w-80 border-l border-[var(--border)] bg-[var(--muted)] text-[var(--text)]">
      <div className="px-3 py-2 text-xs uppercase tracking-wider text-[var(--text-dim)]">Artifacts</div>
      <ul className="divide-y divide-[var(--border)]">
        {items.map(it => (
          <li key={it.id} className="p-3 hover:bg-[var(--surface)] cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-sm">{it.title}</span>
              <span className="text-[10px] opacity-60">{it.ts}</span>
            </div>
            <div className="text-[11px] opacity-70">by {it.agent} • {it.kind}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

---

## 24) Integration notes (so this can become real)
- Keep **Simulation** & **Connected** on the same pipeline; swap data sources only.  
- Persist **every** artifact and decision (RAG-ready history).  
- Push offline conversions back to Ads so bidding learns from meetings/opps, not just clicks.  
- Avoid over-automation: agents are **narrow and explicit**; every move has human-readable rationale.

---

## 25) Legal & branding
- Display `SOL:GEN for startups™` and `© Karlson LLC` in header/footer.  
- All demo data clearly labeled as **Simulation**.  
- Include basic privacy copy for Connected mode (data scopes by connector).

---

## 26) Ready-to-build checklist
- [ ] Theme tokens ingest + fallback  
- [ ] Three.js hero (instanced, capped DPR) + SVG fallback  
- [ ] Wizard → seed project  
- [ ] Designer (channels + gates)  
- [ ] Run View (KPIs, weights)  
- [ ] Agent Dock (cards + micro‑animations)  
- [ ] Artifacts feed (expandable)  
- [ ] Effectiveness dashboard (funnel + finance dial)  
- [ ] Rules builder + approvals + Decision Log  
- [ ] Fact‑Sheet generator (MD → PDF)  
- [ ] Demo toggles + Noise slider

---

**That’s it.** One coherent spec, theme-matched to iamkarlson.com, realistic to implement, and demo‑polished for founders who need clarity on distribution without burning runway.
