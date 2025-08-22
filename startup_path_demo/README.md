# SOL:GEN Seed Pack (No-Integration Realism)
This pack makes your demo feel real with **plausible ranges**, **coherent math**, and **deterministic simulations**—no external APIs needed.

## Contents
- `seeds/benchmarks.json` — Ranges + source labels for gates and “is this good?” chips.
- `seeds/seasonality.json` — Day-of-week multipliers + optional “conference/holiday week” flags.
- `seeds/rules.json` — Three rules that actually fire and write artifacts.
- `seeds/scenarios/*.json` — Three ready-to-run scenarios (FinOps SaaS, DevTools PLG, B2B Services).
- `fact_sheet_template.md` — Mustache-style template; fill with your rollups + artifacts.

## How to use
1) Load a scenario JSON and the benchmarks/seasonality into your simulator.  
2) Generate daily outcomes with distributions (Poisson for impressions, Binomial for rates, LogNormal for CPC).  
3) Compute CPL, CPQM, CAC, Payback off the **same rollup** you chart.  
4) Reflect state on the **agent cards** (`idle|working|blocked|done`) and write an **Artifact** any time you:
   - set gates, generate copy, roll up finance, or shift budget.
5) Render the fact sheet by filling `fact_sheet_template.md` with your run data and listing the Artifact IDs you used as footnotes.

## Determinism
Use a seed like `seed = org_id ^ project_id ^ scenario.seed` and offer a ±10% noise slider for live demos.

## Disclaimers
These numbers are illustrative. When you’re ready, replace `source_label` strings with specific citations and tighten ranges by vertical.
