# AI Guidelines

> Status: canonical (v0.1 seed) · Owner: ai-platform-lead · Consumed-by: prompt-engineer, ai-evaluation, backend-lead
> Cited as `per AI-NN`.

## Rules

- **AI-01** Model access goes through a provider abstraction; no direct SDK calls scattered in feature code. Default model per TS-03.
- **AI-02** Every prompt is versioned, owned (`prompt-engineer`), and stored under `src/ai/prompts/`; no inline prompt literals in app code.
- **AI-03** Every LLM feature has an eval harness (`ai-evaluation`) with a golden set before it ships; no eval, no launch.
- **AI-04** All LLM calls are traced (Langfuse, per TS-07): inputs, outputs, latency, token cost, model version.
- **AI-05** Structured outputs use tool/schema constraints, not regex parsing of free text.
- **AI-06** RAG: chunk deliberately, cite sources, and measure retrieval quality separately from generation quality.
- **AI-07** Guard against prompt injection: treat retrieved/user content as untrusted; never let it override system instructions or trigger unsafe tools.
- **AI-08** Cost & latency budgets per feature are set at design time and enforced (fallback models, caching, max-tokens).
- **AI-09** Non-determinism is handled: set temperature deliberately, and never depend on exact output strings in tests — assert on schema/semantics.
- **AI-10** Human-in-the-loop for high-impact actions; agents propose, humans (or gated policies) approve irreversible operations.
- **AI-11** PII and sensitive data are minimized in prompts and never sent to a provider without a data-processing basis.

## Rationale
Versioned prompts + mandatory evals + tracing turn LLM features from demos into maintainable,
measurable production systems and let the AI specialists collaborate through contracts.

## Exceptions & how to request one
Raise with the AI Platform Lead; document the risk trade-off, especially for AI-03, AI-07, AI-10.
