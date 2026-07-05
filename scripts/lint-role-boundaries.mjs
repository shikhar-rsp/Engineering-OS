#!/usr/bin/env node
// lint-role-boundaries.mjs — enforces "no role overlap" as a checkable invariant.
// Checks (against .claude/role-matrix.json):
//   1. Every authored role file (.claude/agents/**.md, excl. _role-assets) has a matrix entry.
//   2. No two roles declare the same writeGlob (unless the path is a declared sharedDomain).
//   3. read-only roles have empty writeGlobs AND disallow Write + Edit.
// Run:  node scripts/lint-role-boundaries.mjs
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const ROOT = process.cwd();
const matrix = JSON.parse(readFileSync(join(ROOT, '.claude/role-matrix.json'), 'utf8'));
const roles = matrix.roles;
const sharedPaths = new Set((matrix.sharedDomains || []).map((d) => d.path));

function walkRoleFiles(dir) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  const out = [];
  for (const name of readdirSync(abs)) {
    const full = join(abs, name);
    const rel = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name !== '_role-assets') out.push(...walkRoleFiles(rel));
    } else if (extname(name) === '.md') {
      out.push({ slug: basename(name, '.md'), rel });
    }
  }
  return out;
}

const errors = [];

// Check 1: every authored role has a matrix entry
for (const f of walkRoleFiles('.claude/agents')) {
  if (!roles[f.slug]) errors.push(`${f.rel}: no entry in role-matrix.json for "${f.slug}"`);
}

// Check 2: writeGlob overlap
const globOwners = new Map();
for (const [slug, r] of Object.entries(roles)) {
  for (const g of r.writeGlobs || []) {
    if (sharedPaths.has(g)) continue; // explicitly shared, arbitrated by EM
    if (globOwners.has(g)) {
      errors.push(`writeGlob overlap: "${g}" claimed by both "${globOwners.get(g)}" and "${slug}" (not in sharedDomains)`);
    } else {
      globOwners.set(g, slug);
    }
  }
}

// Check 3: read-only integrity
for (const [slug, r] of Object.entries(roles)) {
  if (r.readOnly) {
    if ((r.writeGlobs || []).length) errors.push(`${slug}: readOnly but declares writeGlobs`);
    const dis = r.disallowed || [];
    if (!dis.includes('Write') || !dis.includes('Edit')) {
      errors.push(`${slug}: readOnly must disallow both "Write" and "Edit"`);
    }
  }
}

if (errors.length === 0) {
  console.log(`✓ lint-role-boundaries: ${Object.keys(roles).length} roles, no overlaps or read-only leaks`);
  process.exit(0);
}
for (const e of errors) console.error(`✗ ${e}`);
console.error(`\n✗ lint-role-boundaries: ${errors.length} error(s)`);
process.exit(1);
