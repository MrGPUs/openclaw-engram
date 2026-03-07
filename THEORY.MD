# Theory: Cue Anchors Need Their Own Index Before Harmonic Blending Lands

## Problem

Engram now has a measured evaluation harness, objective-state memory, causal
trajectories, trust zones, provenance scoring, corroboration rules, and typed
red-team benchmark packs. The next roadmap step is still harmonic retrieval,
but PR18 should not jump from abstraction nodes straight into blended ranking.
The missing substrate is a cue-anchor index that makes abstraction nodes
addressable by concrete cues before any scoring logic is allowed to use them.

If cue-anchor indexing and harmonic blending land together, every retrieval
regression becomes ambiguous: did the failure come from bad anchor typing, bad
node linkage, or bad blending weights? The system needs a durable anchor index
before it needs retrieval heuristics.

## Operating Theory

The memory-OS rollout keeps working when each retrieval family is decomposed
into store, writer, retrieval, and policy slices. Harmonic retrieval should
keep following that pattern:

1. define abstraction-node storage
2. add cue-anchor indexing
3. blend abstractions and anchors into retrieval
4. benchmark whether the blend actually improves recall utility

PR18 is step 2. It should do one thing: make cue anchors first-class, typed,
and inspectable.

That keeps later retrieval work explainable. Reviewers can inspect whether
anchors are well-formed and linked to the right abstraction nodes before
debating how much weight they should have against semantic recall or episodic
traces.

## Strategy

Keep the cue-anchor contract narrow and deterministic:

- reuse the existing roadmap flags: `harmonicRetrievalEnabled` and `abstractionAnchorsEnabled`
- keep anchor storage under the existing abstraction root instead of adding a second top-level config knob
- store typed cue anchors by cue type: `entity`, `file`, `tool`, `outcome`, `constraint`, and `date`
- link each anchor to one or more abstraction-node IDs
- expose status counts by anchor type plus linked-node totals
- avoid retrieval blending in this PR

This preserves small-slice discipline. PR18 is not harmonic retrieval. It is
the smallest bounded indexing change that makes abstraction cues visible and
reviewable before scoring logic appears.

## Key Discoveries

- Harmonic retrieval needs its cue substrate before it needs ranking.
- Abstraction nodes should encode compression structure, while cue anchors
  encode retrieval handles. Mixing both into one record would make later
  diagnostics much harder.
- Operator-facing status commands keep new stores honest. If a new memory layer
  cannot report valid, invalid, latest, and per-type counts, it is still too
  implicit to tune safely.

## Open Questions

- Should future abstraction writers emit anchors directly during node creation,
  or should a later offline linker derive anchors from existing nodes?
- Should `file` and `date` anchors normalize to stricter canonical forms before
  PR19, or is current typed storage sufficient for the first blend?
- When PR19 arrives, should harmonic blending inject a new dedicated recall
  section first, or blend directly into existing semantic recall ranking?
