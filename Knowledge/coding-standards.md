# Coding Standards

> Status: canonical (v0.1 seed) · Owner: staff-architect · Consumed-by: all builder roles, code-reviewer
> Cited as `per CS-NN`. Never inline this file into a role or skill.

## Rules

- **CS-01** TypeScript `strict` is mandatory. No `any` without an inline justification comment; prefer `unknown` + narrowing.
- **CS-02** No implicit `null`/`undefined` handling — model absence explicitly; return typed results, not thrown control-flow.
- **CS-03** Functions do one thing. Extract when a function exceeds ~40 lines or nests >3 levels.
- **CS-04** Names describe intent, not type (`activeUsers`, not `arr`). Match the surrounding file's existing idiom.
- **CS-05** No magic values. Hoist to named constants or config; centralize enums/unions.
- **CS-06** Errors: fail fast at boundaries, validate all external input (zod or equivalent), never swallow errors silently.
- **CS-07** Every module has a single clear responsibility and a stable public surface; internal helpers stay private.
- **CS-08** Async: no floating promises; handle or `await` every promise; no `async` without `await` in body.
- **CS-09** Tests colocated or mirrored under `tests/`; each bug fix adds a regression test; public behavior is tested, not internals.
- **CS-10** No commented-out code and no dead code in commits; delete it (git remembers).
- **CS-11** Formatting/linting are automated (Prettier + ESLint); never hand-format. CI blocks on lint.
- **CS-12** Comments explain *why*, not *what*. Match the file's existing comment density.
- **CS-13** Secrets never in source; read from env/secret manager. No credentials in logs.
- **CS-14** Public functions and exported types carry doc comments describing contract and failure modes.
- **CS-15** Prefer composition and pure functions over inheritance and shared mutable state.

## Rationale
Deterministic, reviewable code lowers cognitive load for the next agent (human or AI) and makes
automated review (`code-reviewer`) high-signal.

## Exceptions & how to request one
Justify inline at the deviation site AND flag it in the Output Contract `OPEN` field so the
code-reviewer can ratify or escalate to the Staff Architect.
