import { describe, it, expect } from "vitest";
import { dateKey, lastNDaysKeys } from "@/lib/date";

describe("date", () => {
  it("dateKey formats YYYY-MM-DD", () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
  it("lastNDaysKeys returns n keys", () => {
    expect(lastNDaysKeys(7)).toHaveLength(7);
  });
  it("lastNDaysKeys all unique", () => {
    const keys = lastNDaysKeys(30);
    expect(new Set(keys).size).toBe(30);
  });
});