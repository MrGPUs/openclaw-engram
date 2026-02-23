# Napkin

## Corrections
| Date | Source | What Went Wrong | What To Do Instead |
|------|--------|----------------|-------------------|
| 2026-02-22 | self | Loaded process skill files before checking repo napkin state. | Read `.claude/napkin.md` first on session start before any other repo work. |
| 2026-02-22 | self | Initially searched for a PR merge commit message before checking for unresolved conflict markers in the branch merge commit itself. | For merge-resolution bugs, run `git grep '^<<<<<<<\|^=======\|^>>>>>>>' <merge_commit>` early to validate merge output integrity. |
| 2026-02-22 | self | Time-graph predecessor paths were derived from `thread.episodeIds` using a hardcoded `facts/<id>` pattern. | Resolve predecessor IDs via `allMemsForGraph` (`frontmatter.id -> relative path`) so corrections and dated facts keep real paths. |
| 2026-02-22 | self | Used `.slice(-Math.max(0, n))` without guarding `n=0`, causing `.slice(-0)` to return all elements. | For capped tail selection, guard `n===0` up front and return `[]`; only call `.slice(-n)` when `n>0`. |
| 2026-02-22 | self | Built graph edges before thread boundary detection was finalized for the current turn. | Establish thread context first, then persist memories and append memory IDs to that resolved thread to avoid cross-thread edges. |
| 2026-02-22 | self | Added per-fact persisted-path lookup via `getMemoryById`, which scans full memory corpus and regressed extraction performance. | In persistence loops, build/update an in-memory `id -> relativePath` map once per batch and resolve paths from that map only. |
| 2026-02-22 | self | While synthesizing in-memory graph context entries, used an invalid `confidenceTier` literal (`\"high\"`) that broke `tsc`. | For synthetic `MemoryFile` objects, use valid `ConfidenceTier` values (`explicit`/`implied`/`inferred`/`speculative`) or derive via helper. |
| 2026-02-22 | self | Pulled review comments from the wrong PR number first. | Resolve branch-to-PR with `gh pr list --head <branch>` before reading review comments. |

## User Preferences
- Announce applicable skills before any other response/action.
- On each user request, attempt memory lookup via MCP memory servers; if unavailable, continue without memory policy.
- When requested, keep fixes local and do not push until explicitly approved.

## Patterns That Work
- Use `multi_tool_use.parallel` for independent reads/probes to reduce latency.
- Add a regression test that scans critical files for conflict markers when fixing bad merge resolutions.
- For graph-edge path logic, use a pure helper with tests before touching orchestrator flow.
- For ordering bugs in orchestrator flows, use source-order regression tests plus behavior tests for new helper methods.

## Patterns That Don't Work
- Assuming memory MCP servers are present without probing `list_mcp_resources`.
- Relying on `npm run review:cursor` for deterministic local checks; it can hang in this environment even with `timeout`.

## Domain Notes
- Repo: `openclaw-engram` with strict retrieval/planner/cache guardrails in `AGENTS.md`.
- Commit `6379f03` (`origin/feature/v8.2-pr18-graph`) had unresolved conflict markers in `CHANGELOG.md`, `openclaw.plugin.json`, and `src/types.ts`.
- Kilo review item: `src/orchestrator.ts` time-graph predecessor lookup must use actual stored memory paths, not fabricated `facts/` paths.
