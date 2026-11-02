import { describe, it, expect } from "vitest";
import { listRecentMonths, formatMonthLabel, buildMonthlyReport } from "@/lib/exportReport";

describe("exportReport", () => {
  it("listRecentMonths returns n", () => {
    expect(listRecentMonths(6)).toHaveLength(6);
  });
  it("formatMonthLabel returns string", () => {
    expect(typeof formatMonthLabel("2026-01")).toBe("string");
  });
  it("buildMonthlyReport includes header", () => {
    const out = buildMonthlyReport({ logs: [], interventions: [], practices: [] }, "2026-01");
    expect(out).toContain("ASCENSO - RESUMEN MENSUAL");
  });
});