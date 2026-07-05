# Engineering OS

An AI-native engineering organization built on Claude Code. Specialized subagent **roles** with
mechanically-enforced boundaries take a PRD → architecture → build → test → deploy-ready, using
reusable **skills** (procedures) and shared **Knowledge** (standards). The human is CEO.

## Read this first
- **The constitution:** [`docs/engineering-os-standard.md`](docs/engineering-os-standard.md) — how everything is designed and why.
- **The org map:** [`.claude/CLAUDE.md`](.claude/CLAUDE.md) — routing table (always loaded).
- **The execution loop + handoff format:** [`Knowledge/development-workflow.md`](Knowledge/development-workflow.md).

## The three primitives
| Primitive | Is | Lives in |
|---|---|---|
| **Role** (subagent) | *who acts* — boundary enforced by tool allowlist + hooks | `.claude/agents/` |
| **Skill** (procedure) | *how work is done* — role-agnostic, on-demand | `.claude/skills/` |
| **Knowledge** (standard) | *what we know* — cited by stable rule ID | `Knowledge/` |

## Enforcement (run from repo root)
```bash
node scripts/budget-check.mjs          # always-loaded files within residency budget
node scripts/lint-role-boundaries.mjs  # no role-ownership overlaps; read-only integrity
node scripts/lint-handoff-chain.mjs    # every consumed artifact has a producer
node scripts/build-role-doc.mjs [role] # merge a role's body + assets → docs/roles/<role>.md
```

## Status
- ✅ v1.0 foundation: standard, templates, Knowledge (workflow + 5 seed standards), role matrix, linters, hooks.
- ✅ Role #1: `engineering-manager`.
- ⏭ Next: `staff-architect`, then `product-manager`, then `frontend-lead` + `backend-lead`; then flesh out the
  seed Knowledge standards; then a real PRD→build spine before adding the 12 specialists.

See [`docs/engineering-os-standard.md` §10](docs/engineering-os-standard.md) for the full build order.
