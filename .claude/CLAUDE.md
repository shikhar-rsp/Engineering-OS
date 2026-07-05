# Engineering OS

An AI-native engineering organization. The human is **CEO / final decision-maker**. Work is done
by specialized subagent **roles** with mechanically-enforced boundaries, using reusable **skills**
(procedures) and shared **Knowledge** (standards). Governing constitution: `docs/engineering-os-standard.md`.

## The three primitives
- **Roles** = subagents in `.claude/agents/` — *who acts*. Boundary = `tools` allowlist + hooks.
- **Skills** = procedures in `.claude/skills/` — *how work is done*. Role-agnostic, on-demand.
- **Knowledge** = standards in `Knowledge/` — *what we know*. Cited by stable rule ID, never pasted.

## Routing (who owns what)
| Trigger | Route to |
|---|---|
| New PRD / feature / cross-team task / ownership dispute | **engineering-manager** (start here) |
| Product scope & requirements | product-manager |
| Technical design, ADRs | staff-architect |
| Next.js/React/Tailwind UI code | frontend-lead |
| NestJS/API/data-access code | backend-lead |
| LLM / RAG / agents | ai-platform-lead |
| Design system & UX | uiux-lead |
| Schema, migrations, DB tuning | database · Reviews & QA | code-reviewer / security-reviewer / qa-automation |
| Infra/CI/CD | devops · Perf / a11y / seo / animation / docs / prompts / evals | matching specialist |

## Standards (cite by ID — see `Knowledge/_index.md`)
`WF-`/`EF-` workflow+efficiency · `TS-` stack · `CS-` code · `AR-` architecture · `UI-` design · `AI-` LLM.
The execution loop (WF-01..WF-08) and Output Contract live in `Knowledge/development-workflow.md`.

## Non-negotiables
1. Every role runs WF-01..WF-08 and returns the Output Contract. Think before acting.
2. Stay in your domain. Overlap → escalate to engineering-manager. Reviewers never edit.
3. Cite standards by rule ID; never inline them (EF-01). Never load the whole repo (EF-03).
4. Always-loaded budgets are law (`scripts/budget-check.mjs`).

## Repo map
`.claude/agents/` roles · `.claude/agents/_role-assets/<role>/` on-demand depth · `.claude/skills/` procedures
`Knowledge/` standards · `templates/` role/skill/standard templates · `playbooks/` multi-role flows
`projects/<slug>/` per-project work (prd/ arch/ plan/ handoffs/ escalations/) · `scripts/` linters · `docs/` generated dossiers + standard.

## Enforcement scripts
`node scripts/budget-check.mjs` · `node scripts/lint-role-boundaries.mjs` · `node scripts/lint-handoff-chain.mjs` · `node scripts/build-role-doc.mjs [role]`
