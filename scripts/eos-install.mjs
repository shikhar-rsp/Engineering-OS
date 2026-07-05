#!/usr/bin/env node
// eos-install.mjs — install the Engineering OS bundle into another project so its roles,
// skills, hooks, and standards are available there. Everything is co-located in the target
// project so Knowledge citations and $CLAUDE_PROJECT_DIR-based hooks resolve correctly.
//
// Usage:  node scripts/eos-install.mjs /path/to/your/product-repo
//         node scripts/eos-install.mjs /path/to/repo --dry-run
//
// Copies: .claude/agents, .claude/skills, .claude/hooks, .claude/role-matrix.json, Knowledge/.
// Merges: .claude/settings.json hooks (never clobbers existing hooks/keys).
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';

const SRC = process.cwd();
const target = process.argv[2];
const dryRun = process.argv.includes('--dry-run');

if (!target || target.startsWith('--')) {
  console.error('Usage: node scripts/eos-install.mjs <target-project-dir> [--dry-run]');
  process.exit(1);
}
const DST = resolve(target.replace(/^~(?=$|\/)/, homedir()));
if (DST === SRC) { console.error('✗ Target is the Engineering OS repo itself; choose a different project.'); process.exit(1); }
if (!existsSync(DST)) { console.error(`✗ Target does not exist: ${DST}`); process.exit(1); }

const BUNDLE = [
  ['.claude/agents', 'dir'],
  ['.claude/skills', 'dir'],
  ['.claude/hooks', 'dir'],
  ['.claude/role-matrix.json', 'file'],
  ['Knowledge', 'dir'],
];

console.log(`${dryRun ? '[dry-run] ' : ''}Installing Engineering OS → ${DST}\n`);
for (const [rel, kind] of BUNDLE) {
  const src = join(SRC, rel);
  if (!existsSync(src)) { console.log(`  skip (missing in source): ${rel}`); continue; }
  const dst = join(DST, rel);
  console.log(`  ${existsSync(dst) ? 'overwrite' : 'copy'}  ${rel}`);
  if (!dryRun) {
    mkdirSync(join(dst, '..'), { recursive: true });
    cpSync(src, dst, { recursive: kind === 'dir' });
  }
}

// make hooks executable
function makeExec(dir) {
  if (!existsSync(dir)) return;
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) makeExec(p);
    else if (/\.(sh|py|mjs)$/.test(n)) chmodSync(p, 0o755);
  }
}
if (!dryRun) makeExec(join(DST, '.claude/hooks'));

// merge settings.json hooks (never clobber)
const OUR_HOOKS = {
  PreToolUse: [
    { matcher: 'Write|Edit|MultiEdit', hooks: [{ type: 'command', command: '"$CLAUDE_PROJECT_DIR/.claude/hooks/guard-write-scope.sh"' }] },
    { matcher: 'Bash', hooks: [{ type: 'command', command: '"$CLAUDE_PROJECT_DIR/.claude/hooks/enforce-readonly.sh"' }] },
  ],
  Stop: [
    { hooks: [{ type: 'command', command: '"$CLAUDE_PROJECT_DIR/.claude/hooks/require-selfcheck.sh"' }] },
  ],
};
const settingsPath = join(DST, '.claude/settings.json');
let settings = {};
if (existsSync(settingsPath)) { try { settings = JSON.parse(readFileSync(settingsPath, 'utf8')); } catch { console.log('  ⚠ existing settings.json is invalid JSON — leaving it; add hooks manually'); } }
settings.hooks = settings.hooks || {};
let added = 0;
for (const [event, entries] of Object.entries(OUR_HOOKS)) {
  settings.hooks[event] = settings.hooks[event] || [];
  const existing = JSON.stringify(settings.hooks[event]);
  for (const e of entries) if (!existing.includes(e.hooks[0].command)) { settings.hooks[event].push(e); added++; }
}
console.log(`\n  settings.json: ${added} hook entr${added === 1 ? 'y' : 'ies'} to add`);
if (!dryRun && added) { mkdirSync(join(DST, '.claude'), { recursive: true }); writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n'); }

console.log(`\n${dryRun ? '[dry-run complete — nothing written]' : '✓ Installed.'}`);
console.log(`\nNext:\n  1. Open a Claude Code session in ${DST}\n  2. Say: "Engineering Manager, here is my PRD: …"\n  3. Verify enforcement: ask it to write to Knowledge/test.md → should be blocked.\n  4. (optional) cd there && node .claude/../scripts/... — or copy scripts/ too if you want the linters.`);
