#!/usr/bin/env bash
# require-selfcheck.sh — Stop hook enforcing WF-06 (self-check before done).
# Opt-in per session: set EOS_DOD_ARTIFACT to the path the role must produce (e.g. its
# filled checklist result or handoff artifact). If the artifact is missing, completion is
# blocked. If EOS_DOD_ARTIFACT is unset, this is a no-op.
# block = exit 2 with reason on stderr; allow = exit 0.
set -euo pipefail

target="${EOS_DOD_ARTIFACT:-}"
[ -z "$target" ] && exit 0

if [ ! -f "$target" ]; then
  echo "BLOCKED: WF-06 self-check incomplete — expected DoD artifact '$target' not found. Run your checklists/dod.md and record the result before finishing." >&2
  exit 2
fi
exit 0
