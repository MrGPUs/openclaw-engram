import type { SessionObserverBandConfig } from "./types.js";

export const DEFAULT_SESSION_OBSERVER_BANDS: SessionObserverBandConfig[] = [
  { maxBytes: 50_000, triggerDeltaBytes: 6_000, triggerDeltaTokens: 1_200 },
  { maxBytes: 200_000, triggerDeltaBytes: 12_000, triggerDeltaTokens: 2_400 },
  { maxBytes: 1_000_000_000, triggerDeltaBytes: 24_000, triggerDeltaTokens: 4_800 },
];

export function cloneDefaultSessionObserverBands(): SessionObserverBandConfig[] {
  return DEFAULT_SESSION_OBSERVER_BANDS.map((band) => ({ ...band }));
}
