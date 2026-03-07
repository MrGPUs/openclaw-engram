# Theory: Engram As A Measured Memory OS

## Problem

PR8 closed the causal-trajectory storage loop: Engram can now persist typed
goal-action-observation-outcome-follow-up records as first-class artifacts. That
solves the storage problem, but those records are still isolated JSON files. The
next problem is graph continuity. If trajectories remain disconnected from the
graph substrate, PR10 would still have to infer traversal structure from raw
records at query time.

The current problem is therefore not retrieval breadth. It is causal graph
shape. Engram needs a deterministic bridge from trajectory records into graph
edges so later retrieval and explanation layers can expand over a stable
action-conditioned structure instead of re-deriving it from transcripts.

## Operating Theory

The rollout pattern still holds: store first, then graph construction, then
retrieval. PR9 is the graph-construction bridge. The right move is not to add
ranking heuristics yet, but to translate each typed trajectory into a
deterministic set of synthetic causal-stage nodes:

- `goal`
- `action`
- `observation`
- `outcome`
- optional `follow_up`

Those nodes can then be connected by stable `causal` edges inside the existing
graph JSONL store. This keeps the graph layer additive and backwards-compatible
while giving PR10 something real to traverse.

## Strategy

The roadmap is still benchmark-first, flag-first, and slice-first. Each memory
surface lands in this order:

1. storage contract
2. writer path
3. retrieval or planner integration
4. benchmark tightening

For the causal track, that means:

1. PR8: causal trajectory schema and storage
2. PR9: action-conditioned graph construction
3. PR10: trajectory-aware retrieval and explainability

This keeps the larger thesis intact:
- memory that improves action outcomes
- memory that survives long horizons and failures
- memory that can defend itself

## Key Discoveries

- Objective-state snapshots and causal trajectories are complementary, but they
  do not need to share the same node model yet. PR9 can ship synthetic
  trajectory-stage nodes first and leave richer cross-linking for later slices.
- Deterministic synthetic node IDs are enough for the first graph bridge. The
  important property is stable traversal structure, not perfect ontology on the
  first pass.
- Wiring graph construction into `recordCausalTrajectory(...)` keeps the write
  path simple and measurable while leaving retrieval behavior unchanged.

## Open Questions

- Should later slices link trajectory-stage nodes directly to objective-state
  snapshot nodes, entity graph nodes, or both?
- Which traversal/ranking heuristics best surface useful trajectory evidence
  once PR10 begins retrieval work?
- Which benchmark cases best expose regressions in trajectory usefulness versus
  simply graph coverage?
