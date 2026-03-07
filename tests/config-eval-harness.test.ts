import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { parseConfig } from "../src/config.js";

test("evaluation harness config defaults off and derives store dir from memoryDir", () => {
  const memoryDir = "/tmp/engram-memory";
  const cfg = parseConfig({
    openaiApiKey: "test-openai-key",
    memoryDir,
  });

  assert.equal(cfg.evalHarnessEnabled, false);
  assert.equal(cfg.evalShadowModeEnabled, false);
  assert.equal(cfg.evalCiGateEnabled, false);
  assert.equal(cfg.evalStoreDir, path.join(memoryDir, "state", "evals"));
});

test("evaluation harness config respects explicit flags and custom store dir", () => {
  const cfg = parseConfig({
    openaiApiKey: "test-openai-key",
    memoryDir: "/tmp/engram-memory",
    evalHarnessEnabled: true,
    evalShadowModeEnabled: true,
    evalCiGateEnabled: true,
    evalStoreDir: "/tmp/custom-evals",
  });

  assert.equal(cfg.evalHarnessEnabled, true);
  assert.equal(cfg.evalShadowModeEnabled, true);
  assert.equal(cfg.evalCiGateEnabled, true);
  assert.equal(cfg.evalStoreDir, "/tmp/custom-evals");
});
