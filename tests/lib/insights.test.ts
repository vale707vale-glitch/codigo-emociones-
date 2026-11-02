import { describe, it, expect } from "vitest";
import {
  bodyShiftStats,
  percentAboveCourage,
  triggerRanking,
} from "@/lib/insights";
import type { EmotionLog } from "@/types";
import { BODY_SHIFTS } from "@/types";

function makeLog(
  level: number,
  daysAgo = 0,
  trigger: EmotionLog["triggerTag"] = "Trabajo",
  shift: EmotionLog["bodyShift"] = null
): EmotionLog {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    id: "1",
    userId: "u",
    emotionLevel: level,
    emotionName: "x",
    triggerTag: trigger,
    notes: null,
    bodyShift: shift,
    createdAt: d.toISOString(),
  };
}

describe("insights", () => {
  it("percentAboveCourage null when empty", () => {
    expect(percentAboveCourage([])).toBeNull();
  });
  it("percentAboveCourage counts", () => {
    const logs = [makeLog(250), makeLog(100)];
    expect(percentAboveCourage(logs)).toBe(50);
  });
  it("triggerRanking groups by tag", () => {
    const logs = [makeLog(100, 0, "Salud"), makeLog(250, 0, "Salud")];
    const r = triggerRanking(logs);
    expect(r[0].tag).toBe("Salud");
    expect(r[0].total).toBe(2);
    expect(r[0].lowCount).toBe(1);
  });
  it("bodyShiftStats", () => {
    const logs = [
      makeLog(200, 0, null, BODY_SHIFTS[0]),
      makeLog(200, 0, null, BODY_SHIFTS[2]),
    ];
    const s = bodyShiftStats(logs);
    expect(s.total).toBe(2);
    expect(s.positive).toBe(1);
  });
});