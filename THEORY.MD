# Theory: Harmonic Retrieval Should Surface Its Blend Before It Tries To Hide It

## Problem

Engram now has the two substrates harmonic retrieval needs:

- abstraction nodes
- cue-anchor indexes

The next mistake would be to jump straight into opaque ranking behavior that
quietly mixes those signals into generic recall. That would make review harder,
not easier. If the blend is invisible, reviewers cannot tell whether a result
won because of abstraction compression, concrete cue matches, or an accidental
weighting bug.

PR19 needs to make the blend explicit before it becomes subtle.

## Operating Theory

The rollout pattern that has worked across the memory-OS track is:

1. define storage
2. define writers or indexes
3. expose a bounded retrieval surface
4. benchmark before deeper automation

For harmonic retrieval, that means:

1. PR17: abstraction-node storage
2. PR18: cue-anchor indexing
3. PR19: bounded harmonic retrieval section plus diagnostics

The harmonic blend should not be hidden inside `## Relevant Memories` yet.
It should ship as its own legible section so operators can inspect exactly what
the abstraction layer is contributing.

## Strategy

Keep PR19 narrow and explainable:

- add one dedicated recall section: `harmonic-retrieval`
- blend abstraction-node lexical relevance with cue-anchor lexical relevance
- preserve explainability by reporting:
  - matched anchors
  - matched fields
  - node-score vs anchor-score contribution
- add an operator diagnostic command:
  - `openclaw engram harmonic-search <query>`
- do not add writer automation or learned weighting in this slice

This keeps the first harmonic retrieval behavior inspectable. If the blend is
bad, operators can see why. If it is good, later benchmark work has a concrete
surface to measure.

## Key Discoveries

- Harmonic retrieval is more reviewable as its own recall section before any
  deeper blending into generic memory recall.
- Cue anchors and abstraction nodes need separate score components. A blended
  total without a breakdown is not diagnosable enough for early rollout.
- The existing recall-pipeline pattern already supports this slice cleanly:
  objective state, causal trajectories, trust zones, and harmonic retrieval can
  all coexist as bounded sections without mutating the generic memory path.

## Open Questions

- Should PR20 eventually let strong harmonic matches influence generic memory
  ranking, or should the harmonic section remain permanently separate?
- Do future harmonic diagnostics need per-anchor weights by type, or is the
  current structural blend enough until benchmark data says otherwise?
- Should later abstraction writers emit anchor candidates directly, or should a
  linker continue to own anchor creation for better reviewability?
