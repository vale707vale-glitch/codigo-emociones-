import { describe, it, expect } from "vitest";
import { computeCurrentStreak } from "@/lib/streak";

describe("computeCurrentStreak", () => {
  it("0 with no logs", () => {
    expect(computeCurrentStreak([])).toBe(0);
  });
  it("1 when logged today", () => {
    expect(computeCurrentStreak([new Date().toISOString()])).toBe(1);
  });
  it("counts consecutive days", () => {
    const today = new Date();
    const yest = new Date(today);
    yest.setDate(yest.getDate() - 1);
    expect(
      computeCurrentStreak([today.toISOString(), yest.toISOString()])
    ).toBe(2);
  });
});