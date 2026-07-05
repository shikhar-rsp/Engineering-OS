# Architecture Principles

> Status: canonical (v0.1 seed) · Owner: staff-architect · Consumed-by: all Leads, database, devops
> Cited as `per AR-NN`.

## Rules

- **AR-01** Prefer the simplest design that meets the requirement. Complexity must be earned by a real constraint, not anticipated.
- **AR-02** Clear module boundaries: each domain owns its data and exposes a typed contract; no reaching across boundaries into internals.
- **AR-03** Dependencies point inward: domain/business logic never depends on frameworks, transport, or infra details.
- **AR-04** Stateless services by default; push state to Postgres/Redis. Horizontal scalability is the baseline assumption.
- **AR-05** One source of truth per datum. No duplicated writeable state across services.
- **AR-06** Design for failure: timeouts, retries with backoff, idempotency keys on all mutating external calls.
- **AR-07** API contracts are versioned and explicit; breaking changes require a version bump and migration path.
- **AR-08** Data migrations are forward-only, reviewed, and reversible-by-design where feasible (owned by `database`).
- **AR-09** Every architecturally significant decision is recorded as an ADR in `projects/<slug>/arch/adr/`.
- **AR-10** Security and observability are designed in, not bolted on: authz at every boundary, traces/metrics/logs from day one.
- **AR-11** Prefer boring, proven technology (per TS-*) over novel tech; novelty needs an ADR.
- **AR-12** Cost and latency budgets are set at design time and gated by the `performance` role.

## Rationale
Boundaries + inward dependencies + statelessness are what let the org build many products on one
stack and swap specialists in without re-learning bespoke architecture each time.

## Exceptions & how to request one
Write an ADR. The Staff Architect owns this file and ratifies deviations.
