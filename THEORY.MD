# Theory: Creation Memory Needs Retrieval, Not Just Writes

## Problem

PR23 solved the first half of creation memory by making work products explicit
and durable. That was necessary, but it still left a practical gap:

How does an agent actually recover and reuse something it already made?

Until that answer exists, the creation-memory ledger is auditable but not yet
operationally useful during recall.

## Operating Theory

PR24 should stay just as disciplined as PR23:

1. reuse the existing typed ledger instead of inventing a second store
2. gate retrieval behind a separate recall flag
3. keep search lexical and inspectable before adding heavier reuse ranking
4. surface recovered work products in their own recall section, not mixed into
   generic semantic memory

## Strategy

Keep PR24 intentionally small:

- add `workProductRecallEnabled`
- add bounded search over work-product ledger entries
- add `openclaw engram work-product-recall-search`
- inject a dedicated `## Work Products` recall section
- do not yet infer commitments or resume bundles from recovered entries
- do not yet join the ledger to objective-state snapshots automatically

That yields the first real recovery path for created artifacts while keeping
the creation-memory rollout modular.

## Key Discoveries

- Creation memory becomes useful only when agents can ask "what did we already
  make that I can reuse right now?"
- The first recovery pass should favor explicit lexical matches over clever
  heuristics. Operators need a recall surface they can reason about.
- A dedicated `Work Products` section keeps recoverability legible and
  benchmarkable without polluting other recall sections.

## Open Questions

- Should later ranking prefer `artifact` and `file` entries over `record` or
  `report`, or should that stay query-dependent?
- When objective-state joins arrive, should recovery favor direct artifact-path
  evidence or shared entity refs first?
- Should commitment and resume-bundle slices reference recovered work products
  directly, or should they only consume ledger IDs as lineage edges?
