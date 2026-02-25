import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, mkdir, rm, writeFile, unlink } from "node:fs/promises";
import { TranscriptManager } from "../src/transcript.ts";

test("estimateSessionFootprint updates cached totals from newest shard growth", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "engram-transcript-footprint-"));
  try {
    const transcript = new TranscriptManager({
      memoryDir: dir,
      transcriptSkipChannelTypes: [],
    } as any);

    const sessionKey = "agent:generalist:main";
    const { dir: relDir } = transcript.getTranscriptPath(sessionKey);
    const channelDir = path.join(dir, "transcripts", relDir);
    await mkdir(channelDir, { recursive: true });

    const oldShard = path.join(channelDir, "2026-02-24.jsonl");
    const newShard = path.join(channelDir, "2026-02-25.jsonl");
    await writeFile(oldShard, "a".repeat(100), "utf-8");
    await writeFile(newShard, "b".repeat(200), "utf-8");

    const first = await transcript.estimateSessionFootprint(sessionKey);
    assert.equal(first.bytes, 300);

    await writeFile(newShard, "b".repeat(260), "utf-8");
    const second = await transcript.estimateSessionFootprint(sessionKey);
    assert.equal(second.bytes, 360);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("estimateSessionFootprint cache handles shard removal and new shard addition", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "engram-transcript-footprint-rotate-"));
  try {
    const transcript = new TranscriptManager({
      memoryDir: dir,
      transcriptSkipChannelTypes: [],
    } as any);

    const sessionKey = "agent:generalist:main";
    const { dir: relDir } = transcript.getTranscriptPath(sessionKey);
    const channelDir = path.join(dir, "transcripts", relDir);
    await mkdir(channelDir, { recursive: true });

    const shardA = path.join(channelDir, "2026-02-23.jsonl");
    const shardB = path.join(channelDir, "2026-02-24.jsonl");
    await writeFile(shardA, "a".repeat(80), "utf-8");
    await writeFile(shardB, "b".repeat(120), "utf-8");

    const first = await transcript.estimateSessionFootprint(sessionKey);
    assert.equal(first.bytes, 200);

    await unlink(shardA);
    const shardC = path.join(channelDir, "2026-02-25.jsonl");
    await writeFile(shardC, "c".repeat(150), "utf-8");

    const second = await transcript.estimateSessionFootprint(sessionKey);
    assert.equal(second.bytes, 270);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
