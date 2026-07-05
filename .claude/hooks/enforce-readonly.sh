#!/usr/bin/env bash
# enforce-readonly.sh — PreToolUse(Bash) guard for read-only roles.
# Read-only reviewers (code-reviewer, security-reviewer, performance, accessibility, seo,
# animation) keep Bash for inspection but must not mutate state. Run those agents with
# EOS_ROLE_READONLY=1 and this hook blocks mutating shell commands.
# block = exit 2 with reason on stderr; allow = exit 0.
set -euo pipefail

[ "${EOS_ROLE_READONLY:-0}" = "1" ] || exit 0

input="$(cat)"
cmd="$(printf '%s' "$input" | python3 -c 'import sys,json
try:
    print(json.load(sys.stdin).get("tool_input",{}).get("command",""))
except Exception:
    print("")' 2>/dev/null || true)"

[ -z "$cmd" ] && exit 0

if printf '%s' "$cmd" | grep -Eiq '(\brm\b|\bgit +(commit|push|reset|checkout|rebase|merge|clean)\b|\bnpm +(i|install|ci|publish)\b|\byarn +add\b|\bpnpm +(add|install)\b|prisma +migrate|\bdrop +table\b|\btruncate\b|\bdelete +from\b|\bmv\b|\bcp\b)'; then
  echo "BLOCKED: read-only role attempted a mutating command. Reviewers emit findings, they do not change state. Command: $cmd" >&2
  exit 2
fi
exit 0
