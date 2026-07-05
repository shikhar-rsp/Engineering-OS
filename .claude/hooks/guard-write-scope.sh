#!/usr/bin/env bash
# guard-write-scope.sh — PreToolUse(Write|Edit|MultiEdit) defense-in-depth.
# Primary boundary enforcement is each subagent's `tools` allowlist (read-only roles omit
# Write/Edit entirely). This hook protects shared Engineering-OS infrastructure (the
# constitution, standards, templates, scripts) from being clobbered by builder roles.
# Convention: block = exit 2 with reason on stderr; allow = exit 0.
# Sanctioned infra edit override:  EOS_ALLOW_INFRA_WRITE=1
set -euo pipefail

input="$(cat)"
path="$(printf '%s' "$input" | python3 -c 'import sys,json
try:
    d=json.load(sys.stdin); ti=d.get("tool_input",{})
    print(ti.get("file_path") or ti.get("path") or "")
except Exception:
    print("")' 2>/dev/null || true)"

[ -z "$path" ] && exit 0
[ "${EOS_ALLOW_INFRA_WRITE:-0}" = "1" ] && exit 0

if [[ "$path" == *"/Knowledge/"* || "$path" == "Knowledge/"* \
   || "$path" == *"/.claude/"*   || "$path" == ".claude/"*   \
   || "$path" == *"/templates/"* || "$path" == "templates/"* \
   || "$path" == *"/scripts/"*   || "$path" == "scripts/"*   \
   || "$path" == *"docs/engineering-os-standard.md" ]]; then
  echo "BLOCKED: '$path' is protected Engineering-OS infrastructure (standard/knowledge/template/script). Builder roles must not modify it. Escalate to the file's Owner, or set EOS_ALLOW_INFRA_WRITE=1 for a sanctioned change." >&2
  exit 2
fi
exit 0
