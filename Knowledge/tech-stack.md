# Tech Stack — Approved Defaults

> Status: canonical (v0.1 seed) · Owner: staff-architect · Consumed-by: all Leads, all specialists
> The default stack. Deviations require an ADR approved by the Staff Architect.

## Rules

- **TS-01** Frontend: **Next.js (App Router) + React + TypeScript + Tailwind CSS**. No other UI framework without an ADR.
- **TS-02** Backend: **NestJS + PostgreSQL + Prisma + Redis**. REST by default; GraphQL only per ADR.
- **TS-03** AI: **Claude (default), OpenAI, Gemini** via provider abstraction; **LangGraph** for agent orchestration; **MCP** for tool/context integration.
- **TS-04** Retrieval: **RAG** over a managed **vector database**; embeddings provider chosen per AI-* guidelines.
- **TS-05** Infra: **AWS** primary; **Docker** for packaging; **Cloudflare** for edge/CDN/WAF; **Vercel** acceptable for FE previews.
- **TS-06** Testing: **Playwright** (e2e), **Jest** (backend/unit), **Vitest** (frontend/unit).
- **TS-07** Observability: **Sentry** (errors), **Langfuse** (LLM traces/evals), **PostHog** (product analytics).
- **TS-08** Language baseline: TypeScript everywhere feasible; Python only for AI/data tooling that requires it.
- **TS-09** Package manager & Node version are pinned per project in its `projects/<slug>/CLAUDE.md`; never assume globally.
- **TS-10** No new runtime dependency enters a project without the owning Lead's sign-off and a one-line justification in the PR.

## Rationale
A fixed default stack removes per-project bikeshedding, maximizes cross-project reuse of skills,
and keeps specialist roles interchangeable across projects.

## Exceptions & how to request one
Open an ADR in `projects/<slug>/arch/adr/` describing the need, the alternative, and the trade-off.
Staff Architect approves or rejects; approved deviations are pinned in the project `CLAUDE.md`.
