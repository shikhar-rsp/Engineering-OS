# Engineering OS Hooks — enforcement layer & validation notes

These hooks are **defense-in-depth**. The *primary* boundary wall is each subagent's `tools`
allowlist in `.claude/agents/*.md` (a role without `Write`/`Edit` in `tools` physically cannot
edit — see `.claude/role-matrix.json`). Hooks catch what allowlists can't express.

| Hook | Event | Enforces | Reliable? |
|------|-------|----------|-----------|
| `guard-write-scope.sh` | PreToolUse(Write\|Edit\|MultiEdit) | No builder role overwrites Knowledge / .claude / templates / scripts / the standard | ✅ path-based, role-agnostic |
| `enforce-readonly.sh` | PreToolUse(Bash) | Read-only roles can't run mutating shell (needs `EOS_ROLE_READONLY=1`) | ✅ when env set |
| `require-selfcheck.sh` | Stop | Completion blocked until DoD artifact exists (needs `EOS_DOD_ARTIFACT=<path>`) | ✅ when env set |

## ⚠ Validate against your installed Claude Code version before relying on these
Two things vary across versions and MUST be confirmed on this machine:
1. **Hook stdin schema** — these scripts read `tool_input.file_path` / `tool_input.command`
   from the JSON piped on stdin. Confirm your version passes that shape.
2. **Block convention** — these scripts use **exit code 2 + stderr** to block. If your version
   expects JSON (`permissionDecision: "deny"`) instead, adapt the scripts.

Quick check: trigger a Write to `Knowledge/x.md` from a builder context and confirm it's blocked.

## Env flags (set per role/session)
- `EOS_ROLE_READONLY=1` — run read-only roles (reviewers, security, perf, a11y, seo, animation) with this.
- `EOS_DOD_ARTIFACT=<path>` — the self-check artifact a role must produce this session.
- `EOS_ALLOW_INFRA_WRITE=1` — sanctioned override for editing standards/templates/scripts (Owners only).
