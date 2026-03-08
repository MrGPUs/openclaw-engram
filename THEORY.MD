# Theory: Resume Bundles Should Reuse Existing Memory, Not Invent a New Recovery Stack

## Problem

PR27 gave Engram a typed resume-bundle format, but that format was still an
empty shell. A crash-recovery system is only useful once the bundle can be
assembled from real state the agent already captured during work.

The risk in PR28 is overreach. If the slice tries to build a full restore
engine, new transcript summarization, or another parallel recovery store, it
will sprawl and become hard to verify. The roadmap only needs one thing here:
deterministic bundle assembly from the stores Engram already owns.

## Operating Theory

Engram already has the ingredients for a compact handoff bundle:

- transcript recovery health from `TranscriptManager.getRecoverySummary(...)`
- recent objective-state snapshots for what changed in the world
- recent work-product ledger entries for what was created
- open commitment ledger entries for what still needs to happen

That means PR28 should not invent new sources of truth. It should compose these
existing stores into one bounded `ResumeBundle`, keep the session boundary
strict, and fail open on invalid stored artifacts the same way the status tools
do.

## Strategy

Keep the builder deterministic and operator-facing:

1. read only the requested `sessionKey`
2. bound each linked store by recency and a small fixed cap
3. turn transcript health into bundle facts and risk flags
4. turn open commitments into `nextActions`
5. persist the built bundle through a dedicated CLI command

This keeps the slice reviewable. The builder proves Engram can reconstruct a
restart-safe handoff from current memory primitives, while later slices can
decide how recall or restore should consume that bundle.

## Key Discoveries

- The transcript layer already exposes the right compact recovery signal.
  PR28 does not need a new parser; it can reuse `getRecoverySummary(...)`.
- The creation-memory stores already carry the right semantics for recovery:
  work products answer "what did we create?" and commitments answer "what is
  still owed?".
- Disabled-mode behavior matters as much as happy-path behavior. PR27 showed
  that a feature flag is only real if the CLI path also short-circuits before
  any storage walk.

## Open Questions

- Should the next slice keep only the latest bundle per session key, or retain
  a short sequence of checkpoints for recovery history?
- When resume bundles are eventually recalled, should `nextActions` remain a
  direct operator-authored list or be recomputed from current commitments at
  read time?
- Should future restore consumers treat transcript recovery health as a hard
  gate, or as one signal among several when deciding whether a session can
  resume safely?
